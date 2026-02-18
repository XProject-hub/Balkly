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
use Illuminate\Support\Facades\DB;
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
            'email_verified_at' => now(),
        ]);

        // Create profile
        Profile::create(['user_id' => $user->id]);

        // Auto-verified: skip email verification for now
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful!',
            'user' => $user->load('profile'),
            'token' => $token,
            'token_type' => 'Bearer',
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

        // Check if email is verified - BLOCK login until verified
        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'email_not_verified' => true,
                'email' => $user->email,
                'message' => 'Please verify your email address before logging in. Check your inbox for the verification link.',
            ], 403);
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
     * Send email verification notification (authenticated user)
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
     * Resend verification email by email address (no auth required)
     */
    public function resendVerificationEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Don't reveal if email exists
            return response()->json([
                'message' => 'If this email is registered, a verification link has been sent.',
            ]);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified. You can login now.',
            ]);
        }

        try {
            $user->sendEmailVerificationNotification();
        } catch (\Exception $e) {
            \Log::warning('Resend verification email failed: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Verification email sent! Please check your inbox.',
        ]);
    }

    /**
     * Verify email with token
     */
    public function verifyEmail(Request $request, $id, $hash)
    {
        $user = User::find($id);

        if (!$user) {
            return redirect()->to(env('FRONTEND_URL', 'https://balkly.live') . '/auth/verify-email?error=user_not_found');
        }

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return redirect()->to(env('FRONTEND_URL', 'https://balkly.live') . '/auth/verify-email?error=invalid_link');
        }

        if ($user->hasVerifiedEmail()) {
            // Already verified - just redirect to success
            return redirect()->to(env('FRONTEND_URL', 'https://balkly.live') . '/auth/email-verified?already=true');
        }

        $user->markEmailAsVerified();
        event(new Verified($user));

        // Redirect to success page
        return redirect()->to(env('FRONTEND_URL', 'https://balkly.live') . '/auth/email-verified');
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
     * Social login (Google/Facebook) - Exchange token
     * 
     * To enable, set these in .env:
     *   GOOGLE_CLIENT_ID=your_client_id
     *   GOOGLE_CLIENT_SECRET=your_client_secret
     *   FACEBOOK_CLIENT_ID=your_app_id
     *   FACEBOOK_CLIENT_SECRET=your_app_secret
     */
    public function socialLogin(Request $request)
    {
        $request->validate([
            'provider' => 'required|in:google,facebook',
            'access_token' => 'required|string',
        ]);

        $provider = $request->provider;

        if (!$this->isSocialProviderConfigured($provider)) {
            return response()->json([
                'message' => ucfirst($provider) . ' login is not configured yet. Please contact the administrator.',
                'error_code' => 'provider_not_configured',
            ], 503);
        }

        $socialUser = $this->verifySocialToken($provider, $request->access_token);

        if (!$socialUser) {
            return response()->json([
                'message' => 'Unable to verify your ' . ucfirst($provider) . ' account. Please try again.',
            ], 400);
        }

        $user = User::where('email', $socialUser['email'])->first();

        if (!$user) {
            $user = User::create([
                'name' => $socialUser['name'],
                'email' => $socialUser['email'],
                'password' => Hash::make(Str::random(32)),
                'email_verified_at' => now(),
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

    protected function isSocialProviderConfigured(string $provider): bool
    {
        return match ($provider) {
            'google' => !empty(config('services.google.client_id')),
            'facebook' => !empty(config('services.facebook.client_id')),
            default => false,
        };
    }

    protected function verifySocialToken(string $provider, string $accessToken): ?array
    {
        try {
            if ($provider === 'google' && config('services.google.client_id')) {
                $response = \Illuminate\Support\Facades\Http::get(
                    'https://www.googleapis.com/oauth2/v3/tokeninfo',
                    ['id_token' => $accessToken]
                );

                if ($response->successful()) {
                    $data = $response->json();
                    if ($data['aud'] === config('services.google.client_id')) {
                        return [
                            'name' => $data['name'] ?? $data['email'],
                            'email' => $data['email'],
                            'avatar' => $data['picture'] ?? null,
                        ];
                    }
                }
            }

            if ($provider === 'facebook' && config('services.facebook.client_id')) {
                $response = \Illuminate\Support\Facades\Http::get(
                    'https://graph.facebook.com/me',
                    [
                        'fields' => 'id,name,email,picture.type(large)',
                        'access_token' => $accessToken,
                    ]
                );

                if ($response->successful()) {
                    $data = $response->json();
                    if (!empty($data['email'])) {
                        return [
                            'name' => $data['name'],
                            'email' => $data['email'],
                            'avatar' => $data['picture']['data']['url'] ?? null,
                        ];
                    }
                }
            }
        } catch (\Exception $e) {
            \Log::warning("Social login verification failed for {$provider}: " . $e->getMessage());
        }

        return null;
    }

    /**
     * Delete the authenticated user's account
     */
    public function deleteAccount(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if ($request->email !== $user->email) {
            return response()->json(['message' => 'Email does not match your account.'], 422);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Incorrect password.'], 422);
        }

        DB::transaction(function () use ($user) {
            $user->tokens()->delete();
            $user->profile()->delete();
            $user->listings()->update(['status' => 'deleted']);
            $user->delete();
        });

        return response()->json(['message' => 'Account deleted successfully.']);
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
