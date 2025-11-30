<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Welcome to Balkly</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            padding: 40px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .logo {
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .content {
            background: #ffffff;
            padding: 40px;
            border: 1px solid #e5e7eb;
        }
        .feature {
            padding: 15px;
            margin: 10px 0;
            background: #f9fafb;
            border-left: 4px solid #0f172a;
            border-radius: 4px;
        }
        .button {
            display: inline-block;
            padding: 15px 40px;
            background: #0f172a;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            color: #6b7280;
            padding: 20px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🎊 BALKLY</div>
        <h1 style="margin: 0; font-size: 28px;">Welcome!</h1>
    </div>
    
    <div class="content">
        <h2>Hi {{ $user->name }},</h2>
        <p style="font-size: 18px;">Welcome to Balkly! We're excited to have you join our community.</p>
        
        <p>Your account has been created successfully. Here's what you can do now:</p>
        
        <div class="feature">
            <strong>🛍️ Browse & Buy</strong>
            <p style="margin: 5px 0 0 0; color: #6b7280;">Explore thousands of listings in categories like Auto, Real Estate, and Events.</p>
        </div>
        
        <div class="feature">
            <strong>📝 Create Listings</strong>
            <p style="margin: 5px 0 0 0; color: #6b7280;">Post your items with our smart 4-step wizard. Get auto-enhancement for better results!</p>
        </div>
        
        <div class="feature">
            <strong>💬 Join Discussions</strong>
            <p style="margin: 5px 0 0 0; color: #6b7280;">Participate in our community forum and connect with other users.</p>
        </div>
        
        <div class="feature">
            <strong>🎫 Get Event Tickets</strong>
            <p style="margin: 5px 0 0 0; color: #6b7280;">Buy tickets for concerts, sports, and entertainment with instant QR codes.</p>
        </div>

        <div style="text-align: center;">
            <a href="{{ config('app.url') }}/dashboard" class="button">
                Go to Your Dashboard
            </a>
        </div>

        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <strong>Pro Tip:</strong> Complete your profile in Settings to build trust with other users!
        </p>
    </div>
    
    <div class="footer">
        <p><strong>Need help?</strong> Visit our <a href="{{ config('app.url') }}/help" style="color: #0f172a;">Help Center</a></p>
        <p style="margin-top: 20px;">© {{ date('Y') }} Balkly. All rights reserved.</p>
        <p>
            <a href="{{ config('app.url') }}/terms" style="color: #6b7280; text-decoration: none;">Terms</a> | 
            <a href="{{ config('app.url') }}/privacy" style="color: #6b7280; text-decoration: none;">Privacy</a>
        </p>
    </div>
</body>
</html>

