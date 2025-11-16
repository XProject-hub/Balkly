<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use PragmaRX\Google2FA\Google2FA;

class AuthController extends Controller
{
    /**
     * Register new user with email verification
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'locale' => 'nullable|string|in:en,balkly,ar,bs,sr,hr',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'locale' => $request->locale ?? 'en',
            'role' => 'user',
        ]);

        // Create profile
        Profile::create(['user_id' => $user->id]);

        // Auto-verify email (skip email sending for now)
        $user->email_verified_at = now();
        $user->save();

        // Fire registered event (sends verification email) - DISABLED for now
        // event(new Registered($user));

        // Send welcome email - DISABLED for now
        // $user->notify(new \App\Notifications\WelcomeNotification());

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
            'message' => 'Registration successful! Welcome to Balkly.',
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if 2FA is enabled
        if ($user->twofa_secret) {
            // Return intermediate response for 2FA
            return response()->json([
                'requires_2fa' => true,
                'user_id' => $user->id,
                'message' => 'Please enter your 2FA code',
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user->load('profile'),
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Get current user
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('profile'),
        ]);
    }

    /**
     * Send email verification notification
     */
    public function sendVerificationEmail(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified',
            ], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Verification email sent',
        ]);
    }

    /**
     * Verify email with token
     */
    public function verifyEmail(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'hash' => 'required|string',
        ]);

        $user = User::findOrFail($request->id);

        if (!hash_equals((string) $request->hash, sha1($user->getEmailForVerification()))) {
            return response()->json([
                'message' => 'Invalid verification link',
            ], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified',
            ]);
        }

        $user->markEmailAsVerified();
        event(new Verified($user));

        return response()->json([
            'message' => 'Email verified successfully',
        ]);
    }

    /**
     * Send password reset link
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Password reset link sent to your email',
            ]);
        }

        return response()->json([
            'message' => 'Unable to send reset link',
        ], 400);
    }

    /**
     * Reset password
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();

                // Revoke all tokens
                $user->tokens()->delete();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Password has been reset successfully',
            ]);
        }

        return response()->json([
            'message' => 'Failed to reset password',
        ], 400);
    }

    /**
     * Enable 2FA - Generate QR code
     */
    public function enable2FA(Request $request)
    {
        $user = $request->user();

        if ($user->twofa_secret) {
            return response()->json([
                'message' => '2FA is already enabled',
            ], 400);
        }

        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        // Temporarily store secret (user must verify before saving)
        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        return response()->json([
            'secret' => $secret,
            'qr_code_url' => $qrCodeUrl,
            'message' => 'Scan QR code with your authenticator app',
        ]);
    }

    /**
     * Verify and confirm 2FA setup
     */
    public function confirm2FA(Request $request)
    {
        $request->validate([
            'secret' => 'required|string',
            'code' => 'required|string|size:6',
        ]);

        $google2fa = new Google2FA();
        $valid = $google2fa->verifyKey($request->secret, $request->code);

        if (!$valid) {
            return response()->json([
                'message' => 'Invalid verification code',
            ], 400);
        }

        // Save secret to user
        $user = $request->user();
        $user->update(['twofa_secret' => $request->secret]);

        return response()->json([
            'message' => '2FA enabled successfully',
            'user' => $user,
        ]);
    }

    /**
     * Verify 2FA code during login
     */
    public function verify2FA(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'code' => 'required|string|size:6',
        ]);

        $user = User::findOrFail($request->user_id);

        if (!$user->twofa_secret) {
            return response()->json([
                'message' => '2FA is not enabled for this user',
            ], 400);
        }

        $google2fa = new Google2FA();
        $valid = $google2fa->verifyKey($user->twofa_secret, $request->code);

        if (!$valid) {
            return response()->json([
                'message' => 'Invalid 2FA code',
            ], 400);
        }

        // Generate token after successful 2FA
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user->load('profile'),
            'token' => $token,
            'token_type' => 'Bearer',
            'message' => '2FA verified successfully',
        ]);
    }

    /**
     * Disable 2FA
     */
    public function disable2FA(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = $request->user();

        if (!$user->twofa_secret) {
            return response()->json([
                'message' => '2FA is not enabled',
            ], 400);
        }

        $google2fa = new Google2FA();
        $valid = $google2fa->verifyKey($user->twofa_secret, $request->code);

        if (!$valid) {
            return response()->json([
                'message' => 'Invalid 2FA code',
            ], 400);
        }

        $user->update(['twofa_secret' => null]);

        return response()->json([
            'message' => '2FA disabled successfully',
        ]);
    }

    /**
     * Social login (Google) - Exchange token
     */
    public function socialLogin(Request $request)
    {
        $request->validate([
            'provider' => 'required|in:google,facebook',
            'access_token' => 'required|string',
        ]);

        // Verify token with provider and get user info
        $socialUser = $this->verifySocialToken($request->provider, $request->access_token);

        if (!$socialUser) {
            return response()->json([
                'message' => 'Invalid social login token',
            ], 400);
        }

        // Find or create user
        $user = User::where('email', $socialUser['email'])->first();

        if (!$user) {
            // Create new user
            $user = User::create([
                'name' => $socialUser['name'],
                'email' => $socialUser['email'],
                'password' => Hash::make(Str::random(32)), // Random password
                'email_verified_at' => now(), // Auto-verify for social
                'role' => 'user',
            ]);

            Profile::create([
                'user_id' => $user->id,
                'avatar_url' => $socialUser['avatar'] ?? null,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user->load('profile'),
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Verify social provider token
     * TODO: Add actual provider verification when you provide credentials
     */
    protected function verifySocialToken($provider, $accessToken)
    {
        // Google verification
        if ($provider === 'google') {
            // TODO: Verify with Google API
            // $client = new Google_Client(['client_id' => config('services.google.client_id')]);
            // $payload = $client->verifyIdToken($accessToken);
            
            // For now, return null (implement when you provide Google credentials)
            return null;
        }

        // Facebook verification
        if ($provider === 'facebook') {
            // TODO: Verify with Facebook API
            // Implement when you provide Facebook app credentials
            
            return null;
        }

        return null;
    }

    /**
     * Get 2FA recovery codes
     */
    public function get2FARecoveryCodes(Request $request)
    {
        $user = $request->user();

        if (!$user->twofa_secret) {
            return response()->json([
                'message' => '2FA is not enabled',
            ], 400);
        }

        // Generate 10 recovery codes
        $codes = [];
        for ($i = 0; $i < 10; $i++) {
            $codes[] = strtoupper(Str::random(8));
        }

        // Store hashed recovery codes in user metadata
        $user->update([
            'metadata' => array_merge($user->metadata ?? [], [
                'recovery_codes' => array_map(fn($code) => hash('sha256', $code), $codes),
            ]),
        ]);

        return response()->json([
            'codes' => $codes,
            'message' => 'Save these codes securely. Each can only be used once.',
        ]);
    }
}
