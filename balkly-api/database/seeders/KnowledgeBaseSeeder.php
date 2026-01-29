<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\KbCategory;
use App\Models\KbArticle;
use App\Models\User;

class KnowledgeBaseSeeder extends Seeder
{
    public function run(): void
    {
        // Get admin user
        $admin = User::where('role', 'admin')->first();
        
        if (!$admin) {
            echo "No admin user found, skipping KB seeding\n";
            return;
        }

        // Create Categories (using icon names, not emojis)
        $gettingStarted = KbCategory::firstOrCreate(
            ['slug' => 'getting-started'],
            [
                'name' => 'Getting Started',
                'description' => 'New to Balkly? Start here!',
                'icon' => 'rocket',
                'display_order' => 1,
            ]
        );

        $accountSecurity = KbCategory::firstOrCreate(
            ['slug' => 'account-security'],
            [
                'name' => 'Account & Security',
                'description' => 'Managing your account, profile, and security settings',
                'icon' => 'shield',
                'display_order' => 2,
            ]
        );

        $listings = KbCategory::firstOrCreate(
            ['slug' => 'listings-selling'],
            [
                'name' => 'Listings & Selling',
                'description' => 'Everything about creating, managing, and promoting listings',
                'icon' => 'package',
                'display_order' => 3,
            ]
        );

        $buying = KbCategory::firstOrCreate(
            ['slug' => 'buying-orders'],
            [
                'name' => 'Buying & Orders',
                'description' => 'How to buy items, make offers, and manage orders',
                'icon' => 'cart',
                'display_order' => 4,
            ]
        );

        $messaging = KbCategory::firstOrCreate(
            ['slug' => 'messaging-chat'],
            [
                'name' => 'Messaging & Chat',
                'description' => 'Communicating with buyers and sellers',
                'icon' => 'message',
                'display_order' => 5,
            ]
        );

        $events = KbCategory::firstOrCreate(
            ['slug' => 'events-tickets'],
            [
                'name' => 'Events & Tickets',
                'description' => 'Discovering events and purchasing tickets',
                'icon' => 'ticket',
                'display_order' => 6,
            ]
        );

        $forum = KbCategory::firstOrCreate(
            ['slug' => 'forum-community'],
            [
                'name' => 'Forum & Community',
                'description' => 'Using the Balkly community forum',
                'icon' => 'users',
                'display_order' => 7,
            ]
        );

        $payments = KbCategory::firstOrCreate(
            ['slug' => 'payments-billing'],
            [
                'name' => 'Payments & Billing',
                'description' => 'Payment methods, invoices, and refunds',
                'icon' => 'credit-card',
                'display_order' => 8,
            ]
        );

        $trust = KbCategory::firstOrCreate(
            ['slug' => 'trust-safety'],
            [
                'name' => 'Trust & Safety',
                'description' => 'Staying safe, reporting issues, and verification',
                'icon' => 'lock',
                'display_order' => 9,
            ]
        );

        // =====================================================
        // GETTING STARTED ARTICLES
        // =====================================================

        KbArticle::updateOrCreate(
            ['slug' => 'welcome-to-balkly'],
            [
                'category_id' => $gettingStarted->id,
                'title' => 'Welcome to Balkly - Complete Platform Guide',
                'is_published' => true,
                'display_order' => 1,
                'content' => '
# Welcome to Balkly! 🎉

Balkly is the premier online marketplace connecting the Balkan community in the UAE. Whether you\'re buying, selling, attending events, or connecting with fellow Balkanci - we\'ve built the platform for you!

## What Can You Do on Balkly?

### 🛍️ Buy & Sell
- **Post Free Listings** - Sell your items across multiple categories
- **Browse Thousands of Items** - Cars, real estate, electronics, fashion, jobs & more
- **Make Offers** - Negotiate prices directly with sellers
- **Safe Messaging** - Communicate securely through our platform

### 🎫 Events & Entertainment
- **Discover Events** - Concerts, sports, cultural events across UAE
- **Buy Tickets Online** - Secure QR code tickets delivered instantly
- **Create Events** - Organize your own community gatherings

### 💬 Community Forum
- **Connect with Balkanci** - Join discussions on various topics
- **Ask Questions** - Get advice about life in UAE
- **Share Experiences** - Help others with your knowledge
- **Build Reputation** - Earn points for helpful contributions

### 🏪 For Businesses
- **Seller Verification** - Get a verified badge for trust
- **Promoted Listings** - Boost visibility with featured placement
- **Analytics** - Track your performance and views

## Quick Start Guide

### Step 1: Create Your Account
1. Click **"Sign Up"** in the top navigation
2. Enter your email and create a password
3. **Verify your email** (check inbox for verification link)
4. Complete your profile with location and bio

### Step 2: Explore the Platform
- **Listings** - Browse items for sale
- **Events** - Check upcoming happenings
- **Forum** - Join community discussions

### Step 3: Start Participating
- **Buying?** Browse, message sellers, make offers
- **Selling?** Click "Post Listing" and follow the wizard
- **Socializing?** Jump into forum discussions

## Platform Features

| Feature | Description |
|---------|-------------|
| Multi-Language | English, Serbian, Croatian, Bosnian, Arabic |
| Multi-Currency | EUR (€) and AED (د.إ) |
| Two-Factor Auth | Secure your account with 2FA |
| AI Assistant | Smart suggestions for listings |
| Mobile Friendly | Works great on all devices |

## Need Help?

- 📧 **Email:** support@balkly.live
- 📚 **Knowledge Base:** You\'re here!
- 💬 **Forum:** Ask the community

---

**Dobrodošli na Balkly!** 🇧🇦🇷🇸🇭🇷🇲🇪🇲🇰🇸🇮
                ',
            ]
        );

        KbArticle::updateOrCreate(
            ['slug' => 'creating-your-account'],
            [
                'category_id' => $gettingStarted->id,
                'title' => 'How to Create Your Balkly Account',
                'is_published' => true,
                'display_order' => 2,
                'content' => '
# Creating Your Balkly Account

Setting up your account takes just 2 minutes!

## Registration Steps

### Step 1: Go to Sign Up
- Click **"Sign Up"** in the top right corner
- Or visit: `/auth/register`

### Step 2: Enter Your Information

| Field | Requirements |
|-------|-------------|
| **Name** | Your display name (2-50 characters) |
| **Email** | Valid email address |
| **Password** | Minimum 8 characters |
| **Confirm Password** | Must match |

### Step 3: Verify Your Email

After registering:
1. Check your email inbox
2. Look for email from **Balkly** (check spam folder too!)
3. Click the **"Verify Email"** button
4. You\'ll be redirected back to Balkly

⚠️ **Important:** You must verify your email before you can:
- Post listings
- Send messages
- Make offers
- Purchase tickets

### Step 4: Complete Your Profile

Go to **Dashboard** → **Settings** and add:
- Profile photo (avatar)
- Bio/description
- Location (city, country)
- Phone number (optional)
- Company name (for businesses)

## Social Login Options

You can also sign up using:
- 🔵 **Google Account** - One-click signup
- 🔵 **Facebook Account** - Connect with social

Benefits of social login:
- No new password to remember
- Faster sign up process
- Profile photo imported automatically

## Account Verification Levels

| Level | What You Can Do |
|-------|----------------|
| **Unverified** | Browse listings, view events |
| **Email Verified** | Post, message, buy tickets |
| **Seller Verified** | Verified badge, higher trust |

## Trouble Signing Up?

**Email not arriving?**
- Check spam/junk folder
- Add `@balkly.live` to contacts
- Click "Resend Verification" on login page

**Password too weak?**
- Use at least 8 characters
- Mix letters, numbers, symbols
- Avoid common passwords

**Email already exists?**
- You may already have an account
- Try "Forgot Password" to recover

Need more help? Contact **support@balkly.live**
                ',
            ]
        );

        KbArticle::updateOrCreate(
            ['slug' => 'navigating-balkly'],
            [
                'category_id' => $gettingStarted->id,
                'title' => 'Navigating Balkly - Site Overview',
                'is_published' => true,
                'display_order' => 3,
                'content' => '
# Navigating Balkly

Learn your way around the platform!

## Main Navigation

### Top Bar
- **Logo** - Click to go home
- **Listings** - Browse all items for sale
- **Events** - Find upcoming events
- **Forum** - Community discussions
- **Post Listing** - Create new listing (logged in)
- **🔔 Notifications** - Your alerts
- **Profile Menu** - Account options

### Footer
- About Balkly
- Contact Us
- Privacy Policy
- Terms of Service
- Knowledge Base (Help)

## Main Pages

### 🏠 Homepage (`/`)
- Featured listings
- Upcoming events
- Popular categories
- Community highlights

### 📦 Listings (`/listings`)
- All items for sale
- Filter by category, price, location
- Sort by newest, price, featured
- Map view available

### 🎫 Events (`/events`)
- Upcoming events calendar
- Event details and tickets
- Filter by date and type

### 💬 Forum (`/forum`)
- Discussion categories
- Recent topics
- Create new discussions

### 👤 Dashboard (`/dashboard`)
After logging in:
- **My Listings** - Manage your items
- **My Messages** - Conversations
- **My Orders** - Purchase history
- **My Favorites** - Saved items
- **My Offers** - Sent/received offers
- **Settings** - Account preferences

## Search & Filters

### Global Search
- Search bar in top navigation
- Searches listings, events, and forum
- Auto-suggestions as you type

### Listing Filters
- **Category** - Auto, Real Estate, Electronics, etc.
- **Price Range** - Min and max price
- **Location** - City, country
- **Sort** - Newest, price low/high, featured

### Map View
- Visual listing locations
- Click pins for details
- Zoom and pan

## Language & Currency

### Switch Language
1. Click language flag in header
2. Select: English, Serbian, Croatian, Bosnian, or Arabic
3. Page updates instantly

### Change Currency
1. Click currency dropdown
2. Choose EUR (€) or AED (د.إ)
3. All prices convert automatically

## Mobile Navigation

On mobile devices:
- **☰ Menu** button opens navigation
- Swipe-friendly interface
- All features available
- Optimized for touch

## Quick Tips

✅ Use **Favorites** (heart icon) to save items
✅ Enable **Notifications** for important updates
✅ Check **Dashboard** regularly for messages
✅ Use **Filters** to find items faster
                ',
            ]
        );

        KbArticle::updateOrCreate(
            ['slug' => 'language-currency-settings'],
            [
                'category_id' => $gettingStarted->id,
                'title' => 'Language & Currency Settings',
                'is_published' => true,
                'display_order' => 4,
                'content' => '
# Language & Currency Settings

Balkly supports multiple languages and currencies!

## Available Languages

| Language | Code | Direction |
|----------|------|-----------|
| 🇬🇧 English | EN | Left-to-Right |
| 🇷🇸 Serbian | SR | Left-to-Right |
| 🇭🇷 Croatian | HR | Left-to-Right |
| 🇧🇦 Bosnian | BS | Left-to-Right |
| 🇦🇪 Arabic | AR | Right-to-Left |

## How to Change Language

### Method 1: Header Switcher
1. Look for the **flag icon** in the top navigation
2. Click to open language dropdown
3. Select your preferred language
4. Page reloads in new language

### Method 2: Account Settings
1. Go to **Dashboard** → **Settings**
2. Find "Language" preference
3. Select and save

Your language choice is:
- Saved to your account (if logged in)
- Stored in browser (if logged out)
- Applied site-wide instantly

## Supported Currencies

| Currency | Symbol | Region |
|----------|--------|--------|
| Euro | € (EUR) | Europe |
| UAE Dirham | د.إ (AED) | UAE |

## How to Change Currency

1. Find currency dropdown in header (next to language)
2. Click to open
3. Select EUR or AED
4. All prices update automatically

## Currency Conversion

- Prices are stored in original currency
- Converted using real-time exchange rates
- Approximate conversions shown with ~ symbol
- Final payment in listing\'s original currency

### Example:
If listing is posted at **€100**:
- Shows €100 when viewing in EUR
- Shows ~د.إ400 when viewing in AED (approximate)

## Arabic (RTL) Support

When Arabic is selected:
- Page layout flips to right-to-left
- Text aligns correctly
- Navigation adjusts
- Forms work properly

## Tips

✅ Set language once - it remembers your choice
✅ Currency is for display - payments use listing currency
✅ Arabic users get full RTL experience
✅ All content is available in all languages
                ',
            ]
        );

        // =====================================================
        // ACCOUNT & SECURITY ARTICLES
        // =====================================================

        KbArticle::updateOrCreate(
            ['slug' => 'managing-your-profile'],
            [
                'category_id' => $accountSecurity->id,
                'title' => 'Managing Your Profile',
                'is_published' => true,
                'display_order' => 1,
                'content' => '
# Managing Your Profile

Your profile is your identity on Balkly. Make it complete and trustworthy!

## Accessing Your Profile

1. Click your **profile picture** in top right
2. Select **"Settings"**
3. Or go directly to `/dashboard/settings`

## Profile Information

### Basic Info
| Field | Purpose |
|-------|---------|
| **Display Name** | How others see you |
| **Email** | Login and notifications |
| **Phone** | Optional contact method |
| **Bio** | Tell others about yourself |

### Location
- **City** - e.g., Dubai, Abu Dhabi
- **Country** - UAE or your home country
- **Address** - For verified sellers

### Business Info (Optional)
- **Company Name** - For business accounts
- **VAT ID** - Tax registration number

## Profile Photo (Avatar)

### How to Upload
1. Go to Settings
2. Click current avatar/placeholder
3. Select image file (JPG, PNG)
4. Crop if needed
5. Save

### Photo Guidelines
✅ Clear face photo (personal)
✅ Company logo (business)
✅ Appropriate content
❌ No offensive images
❌ No copyrighted material

## Public vs Private

| Information | Visibility |
|-------------|------------|
| Display Name | Public |
| Avatar | Public |
| Bio | Public |
| Location | Public |
| Email | **Private** (only you) |
| Phone | **Hidden** by default |
| Join Date | Public |

## Profile Insights

View your stats at **Dashboard** → **Insights**:

- 👁️ Profile views
- 📦 Active listings
- 💬 Messages sent/received
- ⭐ Reviews received
- 📈 Performance trends

## Editing Profile

1. Go to **Dashboard** → **Settings**
2. Update fields
3. Click **"Save Changes"**
4. Changes apply immediately

## Deleting Your Account

To permanently delete:
1. Go to Settings
2. Scroll to "Delete Account"
3. Confirm with password
4. Account is permanently removed

⚠️ **Warning:** This action cannot be undone!
- All listings deleted
- All messages deleted
- All data removed
                ',
            ]
        );

        KbArticle::updateOrCreate(
            ['slug' => 'two-factor-authentication'],
            [
                'category_id' => $accountSecurity->id,
                'title' => 'Two-Factor Authentication (2FA) Setup',
                'is_published' => true,
                'display_order' => 2,
                'content' => '
# Two-Factor Authentication (2FA)

Add an extra layer of security to your account!

## What is 2FA?

Two-Factor Authentication requires:
1. **Something you know** - Your password
2. **Something you have** - Your phone with authenticator app

Even if someone steals your password, they can\'t access your account without your phone!

## Setting Up 2FA

### Step 1: Get an Authenticator App

Download one of these free apps:

| App | iOS | Android |
|-----|-----|---------|
| **Google Authenticator** | ✅ | ✅ |
| **Microsoft Authenticator** | ✅ | ✅ |
| **Authy** | ✅ | ✅ |

### Step 2: Enable 2FA on Balkly

1. Go to **Dashboard** → **Settings** → **Security**
2. Click **"Enable Two-Factor Authentication"**
3. A QR code appears on screen

### Step 3: Scan QR Code

1. Open your authenticator app
2. Tap **"+"** or **"Add Account"**
3. Select **"Scan QR Code"**
4. Point camera at the QR code
5. Account "Balkly" appears in app

### Step 4: Confirm Setup

1. Your app shows a 6-digit code
2. Enter this code on Balkly
3. Click **"Confirm"**
4. 2FA is now active! 🎉

## Recovery Codes

After enabling 2FA, you\'ll receive **10 recovery codes**.

⚠️ **IMPORTANT:** Save these somewhere safe!

- Each code can only be used once
- Use if you lose your phone
- Store in password manager
- Print and keep in secure location

## Logging In with 2FA

1. Enter email and password
2. Click "Login"
3. Enter 6-digit code from authenticator app
4. Click "Verify"
5. You\'re logged in!

## Using Recovery Codes

Lost your phone? Use a recovery code:

1. On 2FA screen, click **"Use Recovery Code"**
2. Enter one of your saved codes
3. You\'re logged in
4. Go to Settings and reconfigure 2FA

## Disabling 2FA

1. Go to **Settings** → **Security**
2. Click **"Disable 2FA"**
3. Enter your password to confirm
4. 2FA is disabled

## Troubleshooting

**Code not working?**
- Codes refresh every 30 seconds
- Make sure phone time is correct
- Try the next code that appears

**Lost phone and recovery codes?**
- Contact support@balkly.live
- Verify your identity
- We\'ll help reset your account

## Security Tips

✅ Enable 2FA for maximum security
✅ Save recovery codes immediately
✅ Never share codes with anyone
✅ Use a strong password too
                ',
            ]
        );

        KbArticle::updateOrCreate(
            ['slug' => 'password-management'],
            [
                'category_id' => $accountSecurity->id,
                'title' => 'Password Management & Recovery',
                'is_published' => true,
                'display_order' => 3,
                'content' => '
# Password Management & Recovery

Keep your account secure with a strong password!

## Creating a Strong Password

### Requirements
- Minimum **8 characters**
- Mix of uppercase and lowercase
- Include numbers
- Include special characters (!@#$%^&*)

### Good Password Examples
✅ `MyDubai2024!Balkly`
✅ `S3cure_P@ssw0rd_2024`
✅ `Balkan_UAE_$hopping1`

### Bad Password Examples
❌ `password123`
❌ `12345678`
❌ `balkly`
❌ `qwerty`

## Changing Your Password

1. Go to **Dashboard** → **Settings** → **Security**
2. Click **"Change Password"**
3. Enter your **current password**
4. Enter your **new password**
5. Confirm new password
6. Click **"Update Password"**

## Forgot Your Password?

### Step 1: Request Reset
1. Go to login page
2. Click **"Forgot Password?"**
3. Enter your email address
4. Click **"Send Reset Link"**

### Step 2: Check Email
1. Open your email inbox
2. Look for email from Balkly
3. Check spam folder if not found
4. Click **"Reset Password"** button

### Step 3: Create New Password
1. Enter your new password
2. Confirm new password
3. Click **"Reset Password"**
4. You can now login with new password!

## Password Security Tips

### Do\'s ✅
- Use unique password for Balkly
- Use a password manager
- Change password periodically
- Enable 2FA for extra security

### Don\'ts ❌
- Don\'t share your password
- Don\'t use same password everywhere
- Don\'t write password on sticky notes
- Don\'t use personal info (birthday, name)

## Password Managers We Recommend

| Tool | Free Tier | Platforms |
|------|-----------|-----------|
| **Bitwarden** | Yes | All |
| **1Password** | No | All |
| **LastPass** | Limited | All |
| **Apple Keychain** | Yes | Apple only |
| **Google Passwords** | Yes | Chrome |

## Suspicious Activity

If you suspect someone accessed your account:

1. **Change password immediately**
2. Enable 2FA if not already
3. Check recent activity in Dashboard
4. Review connected devices
5. Contact support@balkly.live

## Account Locked?

Too many failed login attempts will temporarily lock your account.

- Wait 15-30 minutes
- Or use "Forgot Password" to reset
- Contact support if issue persists
                ',
            ]
        );

        KbArticle::updateOrCreate(
            ['slug' => 'email-verification'],
            [
                'category_id' => $accountSecurity->id,
                'title' => 'Email Verification',
                'is_published' => true,
                'display_order' => 4,
                'content' => '
# Email Verification

Verifying your email is essential for using Balkly!

## Why Verify?

Email verification allows you to:
- ✅ Post listings
- ✅ Send and receive messages
- ✅ Make offers on items
- ✅ Purchase event tickets
- ✅ Participate in forum
- ✅ Receive important notifications

Without verification, you can only browse.

## How to Verify

### Automatic Email
After registration:
1. Check your email inbox
2. Look for email from **Balkly** or **noreply@balkly.live**
3. Click the **"Verify Email Address"** button
4. You\'ll be redirected to Balkly
5. Done! ✅

### Resend Verification

If you didn\'t receive the email:

1. Try to login
2. You\'ll see "Verify your email" message
3. Click **"Resend Verification Email"**
4. Check inbox again

Or go directly to: `/auth/verify`

## Troubleshooting

### Email Not Arriving?

**Check these first:**
- ✅ Spam/Junk folder
- ✅ Promotions tab (Gmail)
- ✅ Correct email address spelling
- ✅ Email inbox isn\'t full

**Still no email?**
- Add `@balkly.live` to your contacts
- Try a different email address
- Contact support@balkly.live

### Verification Link Expired?

Links expire after 24 hours for security.

Solution:
1. Go to login page
2. Click "Resend Verification Email"
3. Use the new link

### Wrong Email Address?

If you registered with wrong email:
1. Create new account with correct email
2. Or contact support to change email

## After Verification

Once verified, you\'ll see:
- ✅ Green checkmark on your profile
- ✅ Full access to all features
- ✅ "Verified" badge in settings

## Email Notifications

After verifying, you\'ll receive emails for:
- 📩 New messages
- 💰 Offers on your listings
- 🛒 Order confirmations
- 🔔 Forum replies
- 📢 Important updates

Manage notification preferences in **Settings**.
                ',
            ]
        );

        // =====================================================
        // LISTINGS & SELLING ARTICLES
        // =====================================================

        KbArticle::updateOrCreate(
            ['slug' => 'creating-a-listing'],
            [
                'category_id' => $listings->id,
                'title' => 'How to Create a Listing',
                'is_published' => true,
                'display_order' => 1,
                'content' => '
# Creating a Listing

Post your item for sale in just a few steps!

## Before You Start

Make sure you have:
- ✅ Verified email address
- ✅ Photos of your item (up to 10)
- ✅ Item details ready
- ✅ Price in mind

## Step-by-Step Guide

### Step 1: Start Creating

Click **"Post Listing"** button in:
- Top navigation bar
- Mobile menu
- Dashboard

### Step 2: Choose Category

Select the most appropriate category:

| Category | Examples |
|----------|----------|
| **Auto** | Cars, motorcycles, parts |
| **Real Estate** | Apartments, villas, commercial |
| **Electronics** | Phones, laptops, cameras |
| **Fashion** | Clothing, shoes, accessories |
| **Jobs** | Employment offers |
| **Services** | Professional services |
| **Home & Garden** | Furniture, appliances |
| **Sports** | Equipment, gear |

### Step 3: Fill Details

**Required fields:**
- **Title** - Clear, descriptive (max 100 chars)
- **Description** - Detailed info about item
- **Price** - Fair market value
- **Condition** - New, Like New, Good, Fair
- **Location** - City in UAE

**Optional fields:**
- Additional attributes (varies by category)
- Contact phone number

### Step 4: Add Photos

Good photos = faster sales!

**Tips for great photos:**
- 📸 Use good lighting (natural is best)
- 📸 Show all angles
- 📸 Include close-ups of details
- 📸 Show any defects honestly
- 📸 Clean item before photographing
- 📸 Use plain background

**Requirements:**
- Up to 10 images
- JPG, PNG, or WebP format
- Max 10MB per image
- First image = main thumbnail

### Step 5: Choose Promotion (Optional)

**Free Listing:**
- Always an option
- Appears in chronological order
- Full functionality

**Promoted Listing:**
- Top placement in search results
- "Featured" badge
- More visibility
- Higher chance of selling

### Step 6: Review & Submit

1. Preview your listing
2. Check all information
3. Click **"Submit"** or **"Publish"**
4. Listing goes live!

## After Posting

Your listing:
- Appears immediately (or after review)
- Visible in search results
- Found in **Dashboard** → **My Listings**

## AI Assistant

Try the **AI Helper** when writing your listing:
- Improves your title
- Enhances description
- Suggests better wording
- Available during creation

Click **"Improve with AI"** button!
                ',
            ]
        );

        KbArticle::updateOrCreate(
            ['slug' => 'listing-photos-tips'],
            [
                'category_id' => $listings->id,
                'title' => 'Tips for Great Listing Photos',
                'is_published' => true,
                'display_order' => 2,
                'content' => '
# Tips for Great Listing Photos

Photos are the first thing buyers see. Make them count!

## Why Photos Matter

- 📸 Listings with 5+ photos get **3x more views**
- 📸 Clear photos build **trust**
- 📸 Good photos = **faster sales**
- 📸 Reduce questions from buyers

## Photo Guidelines

### General Rules

| Do ✅ | Don\'t ❌ |
|-------|----------|
| Use natural lighting | Use flash directly |
| Clean background | Cluttered background |
| Multiple angles | Single photo only |
| High resolution | Blurry images |
| Show actual item | Stock photos |
| Honest representation | Heavy filters |

### Lighting Tips

**Best lighting:**
- Near a window (natural light)
- Overcast days (soft shadows)
- Morning or afternoon
- Even, diffused light

**Avoid:**
- Direct sunlight (harsh shadows)
- Dim indoor lighting
- Mixed light sources
- Backlit subjects

### Angles to Include

For most items:
1. **Front view** - Main image
2. **Back view** - Full picture
3. **Side views** - Both sides
4. **Top view** - If relevant
5. **Close-ups** - Details, brand, condition
6. **Defects** - Be honest!

### Category-Specific Tips

**For Vehicles:**
- All four corners
- Interior (dashboard, seats)
- Odometer reading
- Any damage close-ups
- Engine bay (optional)

**For Electronics:**
- Screen on (working)
- Ports and connections
- Accessories included
- Box (if available)
- Serial number area

**For Fashion:**
- Flat lay or hanging
- Front and back
- Labels/tags
- Any wear or damage
- With sizing reference

**For Real Estate:**
- All rooms
- Kitchen and bathrooms
- Exterior/building
- View from windows
- Amenities

## Technical Requirements

| Specification | Requirement |
|---------------|-------------|
| **Format** | JPG, PNG, WebP |
| **Max Size** | 10MB per image |
| **Max Count** | 10 images |
| **Min Resolution** | 800x600 recommended |
| **Orientation** | Landscape preferred |

## Photo Order

1. Best photo = first (thumbnail)
2. Overview shots next
3. Detail shots after
4. Defect photos last

You can **drag and drop** to reorder after uploading!

## Editing Photos

**Basic edits are OK:**
- Brightness adjustment
- Cropping
- Straightening

**Don\'t:**
- Heavy filters
- Remove defects
- Alter colors significantly
- Use misleading editing
                ',
            ]
        );

        KbArticle::updateOrCreate(
            ['slug' => 'promoting-your-listing'],
            [
                'category_id' => $listings->id,
                'title' => 'Promoting Your Listing',
                'is_published' => true,
                'display_order' => 3,
                'content' => '
# Promoting Your Listing

Get more visibility and sell faster!

## Free vs Promoted Listings

| Feature | Free | Promoted |
|---------|------|----------|
| Listed on site | ✅ | ✅ |
| Searchable | ✅ | ✅ |
| Can receive messages | ✅ | ✅ |
| Top of search results | ❌ | ✅ |
| Featured badge | ❌ | ✅ |
| Homepage visibility | ❌ | ✅ |
| Highlighted design | ❌ | ✅ |

## Promotion Plans

### 🥉 Standard (3 Days)
- **Price:** €5 / د.إ20
- Best for: Quick sales, urgent items
- Top placement for 3 days

### 🥈 Featured (7 Days)
- **Price:** €10 / د.إ40
- **Most Popular!**
- Best for: Most items
- Best value for money

### 🥇 Boost (30 Days)
- **Price:** €30 / د.إ120
- Best for: Premium items, real estate, vehicles
- Maximum exposure

## How to Promote

### During Listing Creation:
1. Create your listing
2. On the last step, select promotion plan
3. Complete payment
4. Listing is promoted immediately!

### Existing Listing:
1. Go to **Dashboard** → **My Listings**
2. Find your listing
3. Click **"Boost"** button
4. Select promotion plan
5. Complete payment
6. Instant activation!

## Payment Methods

- 💳 Credit/Debit Card (Stripe)
- 🅿️ PayPal

## Benefits of Promotion

### More Views
Promoted listings get **5-10x more views** on average.

### Featured Badge
Stands out with special "Featured" marker.

### Top Placement
Always appears above free listings in search.

### Homepage Display
May appear in featured section on homepage.

### Faster Sales
Promoted items sell **3x faster** on average.

## Promotion Tips

1. **Use great photos** - Promotion works best with quality listings
2. **Price competitively** - Views don\'t help if price is too high
3. **Respond quickly** - Be available when inquiries come
4. **Renew if needed** - Re-promote when promotion expires
5. **Track performance** - Check views in dashboard

## Promotion Status

Check your promotion status:
1. Go to **Dashboard** → **My Listings**
2. Promoted listings show badge
3. See days remaining
4. Option to extend promotion
                ',
            ]
        );

        KbArticle::updateOrCreate(
            ['slug' => 'managing-listings'],
            [
                'category_id' => $listings->id,
                'title' => 'Managing Your Listings',
                'is_published' => true,
                'display_order' => 4,
                'content' => '
# Managing Your Listings

Keep your listings up to date!

## Accessing Your Listings

Go to **Dashboard** → **My Listings**

Here you\'ll see:
- All your active listings
- Pending listings
- Sold/expired listings
- Views and message counts

## Listing Status

| Status | Meaning |
|--------|---------|
| **Active** | Live and visible |
| **Pending** | Awaiting review |
| **Draft** | Not published yet |
| **Sold** | Marked as sold |
| **Expired** | Time limit reached |
| **Rejected** | Didn\'t meet guidelines |

## Editing a Listing

1. Go to **My Listings**
2. Find the listing
3. Click **"Edit"** button
4. Update information
5. Click **"Save Changes"**

**What you can edit:**
- Title and description
- Price
- Photos (add/remove/reorder)
- Category attributes
- Location

## Deleting a Listing

1. Go to **My Listings**
2. Find the listing
3. Click **"Delete"** button
4. Confirm deletion

⚠️ Deleted listings cannot be recovered!

## Marking as Sold

When item sells:
1. Go to **My Listings**
2. Click **"Mark as Sold"**
3. Listing moves to "Sold" section

Benefits:
- Shows other buyers item is gone
- Your history shows successful sales
- Builds your seller reputation

## Renewing a Listing

For expired listings:
1. Go to **My Listings**
2. Find expired listing
3. Click **"Renew"**
4. Listing is reactivated

## Viewing Statistics

Each listing shows:
- 👁️ Total views
- 💬 Message count
- ❤️ Favorites count
- 📅 Days listed

## Responding to Inquiries

When someone messages about your listing:
1. Notification appears
2. Go to **Messages**
3. Reply promptly
4. Be helpful and honest

**Quick response tips:**
- Check messages daily
- Enable notifications
- Be polite and professional
- Answer all questions

## Listing Tips

✅ Keep information accurate
✅ Update price if you reduce
✅ Add more photos over time
✅ Respond to messages quickly
✅ Mark sold when item goes
                ',
            ]
        );

        // =====================================================
        // BUYING & ORDERS ARTICLES
        // =====================================================

        KbArticle::updateOrCreate(
            ['slug' => 'how-to-buy'],
            [
                'category_id' => $buying->id,
                'title' => 'How to Buy on Balkly',
                'is_published' => true,
                'display_order' => 1,
                'content' => '
# How to Buy on Balkly

Find great items and connect with sellers!

## Finding Items

### Browse Categories
1. Go to **Listings**
2. Select a category
3. Browse items

### Use Search
1. Type keywords in search bar
2. Press Enter or click search
3. Results show matching items

### Apply Filters
Narrow down results:
- **Category** - Item type
- **Price Range** - Min to max
- **Location** - City in UAE
- **Sort By** - Newest, price, featured

### Map View
- Click "Map" to see locations
- Visual item distribution
- Good for local pickups

## Viewing a Listing

Click any listing to see:
- All photos (gallery view)
- Full description
- Price and location
- Seller information
- Similar items

## Contacting Sellers

### Send a Message
1. Click **"Message Seller"**
2. Write your message
3. Ask questions about item
4. Click Send

### What to Ask
- Is item still available?
- Can I see more photos?
- What\'s the item condition?
- Can you deliver?
- Is price negotiable?

## Making an Offer

Want to negotiate?

1. Click **"Make Offer"** on listing
2. Enter your offer amount
3. Add a message (optional)
4. Submit offer

### Offer Status
- **Pending** - Waiting for seller response
- **Accepted** - Seller agreed! Contact to complete
- **Rejected** - Seller declined
- **Countered** - Seller proposed different price

## Saving Items

### Add to Favorites
Click the ❤️ heart icon to save

### View Favorites
Go to **Dashboard** → **My Favorites**

### Price Alerts
1. View a listing
2. Click **"Set Price Alert"**
3. Get notified if price drops

## Safety Tips

Before buying:
- ✅ Check seller profile/reviews
- ✅ Ask for more photos
- ✅ Meet in public places
- ✅ Inspect item before paying
- ✅ Use secure payment methods

**Read our full Safety Guide** for more tips!

## Reporting Issues

If something seems wrong:
1. Click **"Report"** on listing
2. Select reason
3. Add details
4. We\'ll investigate
                ',
            ]
        );

        KbArticle::updateOrCreate(
            ['slug' => 'making-offers'],
            [
                'category_id' => $buying->id,
                'title' => 'Making Offers & Negotiations',
                'is_published' => true,
                'display_order' => 2,
                'content' => '
# Making Offers & Negotiations

Negotiate the best price!

## How Offers Work

The offer system lets you:
- Propose a different price
- Negotiate with sellers
- Keep track of negotiations
- Formalize agreements

## Making an Offer

### Step 1: Find Listing
Browse and find an item you want

### Step 2: Click "Make Offer"
Button below price on listing page

### Step 3: Enter Details
- **Offer Amount** - Your proposed price
- **Message** - Why this price? (optional)

### Step 4: Submit
Click "Send Offer"

## Offer Status

| Status | Meaning | Next Step |
|--------|---------|-----------|
| **Pending** | Waiting for seller | Wait for response |
| **Accepted** | Seller agreed | Contact to arrange |
| **Rejected** | Seller declined | Make new offer or move on |
| **Countered** | New price proposed | Accept, reject, or counter |
| **Expired** | No response (3 days) | Make new offer |

## Responding to Counter Offers

When seller counters:
1. Go to **Dashboard** → **My Offers**
2. See counter offer amount
3. Choose: **Accept**, **Reject**, or **Counter**

## Viewing Your Offers

### Offers You Made
**Dashboard** → **My Offers** → **Sent**

### Offers You Received (as seller)
**Dashboard** → **My Offers** → **Received**

## Offer Tips

### For Buyers

✅ **Be reasonable** - Very low offers may be ignored
✅ **Explain your offer** - "Willing to pick up today"
✅ **Respond quickly** - To counter offers
✅ **Be polite** - Sellers appreciate courtesy
✅ **Do research** - Know fair market value

### Suggested Discount Ranges

| Item Type | Reasonable Offer |
|-----------|------------------|
| Electronics | 5-15% below asking |
| Vehicles | 5-10% below asking |
| Furniture | 10-20% below asking |
| Fashion | 10-25% below asking |

## What Happens After Acceptance

1. Offer accepted ✅
2. Arrangement needed:
   - Agree on meeting place
   - Confirm pickup/delivery
   - Payment method
3. Complete transaction
4. Leave review!

## Offer Expiration

Offers expire after **3 days** if no response.

You can:
- Make a new offer
- Message seller directly
- Move on to other listings

## Canceling an Offer

Before seller responds:
1. Go to **My Offers**
2. Find the offer
3. Click **"Cancel"**

⚠️ Can\'t cancel after seller responds
                ',
            ]
        );

        KbArticle::updateOrCreate(
            ['slug' => 'favorites-saved-searches'],
            [
                'category_id' => $buying->id,
                'title' => 'Favorites & Saved Searches',
                'is_published' => true,
                'display_order' => 3,
                'content' => '
# Favorites & Saved Searches

Never miss a great deal!

## Favorites (Saved Items)

### Adding to Favorites
1. Find a listing you like
2. Click the **❤️ heart icon**
3. Item is saved!

### Viewing Favorites
Go to **Dashboard** → **My Favorites**

See all saved items:
- Current price
- Availability status
- Quick links to view

### Removing from Favorites
Click the filled heart ❤️ again to remove

### Benefits of Favorites
- 📌 Save items to review later
- 📊 Compare multiple options
- 🔔 Get notified of price drops
- ⚡ Quick access from dashboard

## Saved Searches

### What Are Saved Searches?

Save your search criteria and get alerts when new matching items are listed!

### Creating a Saved Search

1. Perform a search with filters
2. Click **"Save This Search"**
3. Name your search (e.g., "BMW Dubai under 50k")
4. Choose alert frequency

### Alert Options

| Frequency | When You Get Alerts |
|-----------|---------------------|
| **Instant** | As soon as item is posted |
| **Daily** | Once per day summary |
| **Weekly** | Once per week summary |

### Managing Saved Searches

Go to **Dashboard** → **Saved Searches**

Options:
- View matching items
- Edit search criteria
- Change alert frequency
- Delete saved search

## Price Alerts

### Setting a Price Alert

For a specific listing:
1. View the listing
2. Click **"Set Price Alert"**
3. Enter target price (optional)
4. Get notified if price drops

### How It Works
- We monitor the listing price
- When it drops to/below your target
- You get email notification
- Act fast - good deals go quick!

### Managing Price Alerts

**Dashboard** → **Price Alerts**

- See all monitored listings
- Current vs. target price
- Remove alerts you don\'t need

## Tips for Power Buyers

✅ **Save multiple searches** for different categories
✅ **Use instant alerts** for high-demand items
✅ **Review favorites weekly** - prices and availability change
✅ **Set realistic price alerts** - not too low
✅ **Act quickly** when alerted - good deals sell fast

## Notification Settings

Control how you receive alerts:

1. **Dashboard** → **Settings** → **Notifications**
2. Toggle email notifications
3. Choose in-app vs email
4. Set quiet hours
                ',
            ]
        );

        // =====================================================
        // MESSAGING & CHAT ARTICLES
        // =====================================================

        KbArticle::updateOrCreate(
            ['slug' => 'messaging-basics'],
            [
                'category_id' => $messaging->id,
                'title' => 'Messaging Basics',
                'is_published' => true,
                'display_order' => 1,
                'content' => '
# Messaging on Balkly

Communicate safely with buyers and sellers!

## Starting a Conversation

### From a Listing
1. Open any listing
2. Click **"Message Seller"**
3. Write your message
4. Click Send

### From User Profile
1. Visit user\'s profile
2. Click **"Send Message"**
3. Choose related listing (optional)
4. Write and send

## Accessing Messages

Go to **Dashboard** → **Messages**

You\'ll see:
- All conversations
- Unread message indicators
- Last message preview
- Related listing info

## Message Features

### Text Messages
Write any length message to communicate

### Related Listing
Each conversation is linked to a listing for context

### Read Receipts
See when your message was read

### Timestamps
Know when messages were sent

## Writing Good Messages

### First Message Tips

✅ **Be specific** - Reference the item
✅ **Ask clearly** - One question at a time
✅ **Be polite** - Hello and thank you
✅ **Include intent** - "I\'m interested in buying..."

### Example First Message:

> Hi! I\'m interested in your iPhone 14 Pro.
> 
> Is it still available? Can you tell me:
> - Battery health percentage?
> - Any scratches or damage?
> - Is the price negotiable?
> 
> Thanks!

### Responding to Inquiries (Sellers)

✅ **Reply quickly** - Within hours if possible
✅ **Be honest** - About condition, flaws
✅ **Answer all questions** - Don\'t skip any
✅ **Be helpful** - Offer more photos if needed

## Message Notifications

You\'ll be notified via:
- 🔔 In-app notification
- 📧 Email (if enabled)

### Managing Notifications
**Settings** → **Notifications**

## Safety in Messaging

### Do ✅
- Keep conversations on Balkly
- Ask questions before meeting
- Be polite and professional
- Save important agreements

### Don\'t ❌
- Share personal details too early
- Send money before seeing item
- Click suspicious links
- Agree to unusual requests

## Reporting Bad Behavior

If someone is:
- Spam messaging
- Being abusive
- Attempting scams

Click **"Report"** in the conversation
We\'ll investigate and take action

## Message History

All messages are saved:
- View anytime in Dashboard
- Reference past conversations
- Proof of agreements
                ',
            ]
        );

        // =====================================================
        // EVENTS & TICKETS ARTICLES
        // =====================================================

        KbArticle::updateOrCreate(
            ['slug' => 'finding-events'],
            [
                'category_id' => $events->id,
                'title' => 'Finding Events in UAE',
                'is_published' => true,
                'display_order' => 1,
                'content' => '
# Finding Events in UAE

Discover concerts, sports, cultural events, and more!

## Browsing Events

### Events Page
Go to **Events** in main navigation

See:
- Upcoming events
- Event calendar view
- Featured events
- Categories

### Event Filters

Filter by:
- **Date** - Today, this week, this month
- **Category** - Music, sports, culture, etc.
- **Location** - Dubai, Abu Dhabi, etc.
- **Price** - Free, paid

### Calendar View
Switch to calendar to see events by date:
- Monthly overview
- Click dates to see events
- Plan ahead

## Event Types

| Category | Examples |
|----------|----------|
| **Concerts** | Music performances, DJ nights |
| **Sports** | Football, cricket, F1 |
| **Cultural** | Balkan nights, festivals |
| **Business** | Networking, conferences |
| **Social** | Meetups, gatherings |
| **Family** | Kids events, activities |

## Event Details

Click any event to see:
- 📅 Date and time
- 📍 Venue and location
- 📝 Full description
- 🎫 Ticket types and prices
- 🗺️ Map to venue
- 👥 Organizer info

## Saving Events

Click ❤️ to save events to favorites

Access later in **Dashboard** → **My Favorites**

## Sharing Events

Share with friends:
- Copy link
- Share to WhatsApp
- Share to Facebook
- Share to Twitter

## Event Notifications

Get notified about:
- New events in your interests
- Events from followed organizers
- Price drops on tickets
- Event reminders

## Creating Events

Are you an organizer?

1. Go to **Dashboard**
2. Click **"Create Event"**
3. Fill event details
4. Add ticket types
5. Publish!

See "Creating Events" article for full guide.
                ',
            ]
        );

        KbArticle::updateOrCreate(
            ['slug' => 'buying-tickets'],
            [
                'category_id' => $events->id,
                'title' => 'Buying Event Tickets',
                'is_published' => true,
                'display_order' => 2,
                'content' => '
# Buying Event Tickets

Secure your spot at events!

## How to Buy Tickets

### Step 1: Find Event
Browse events and find one you want

### Step 2: Select Tickets
1. View event details
2. See available ticket types
3. Choose type (General, VIP, etc.)
4. Select quantity

### Step 3: Checkout
1. Review order
2. Enter payment details
3. Complete purchase

### Step 4: Receive Tickets
Immediately after purchase:
- ✉️ Email with QR code tickets
- 📱 View in Dashboard → My Tickets
- 🎫 Downloadable PDF

## Ticket Types

Events may offer:

| Type | Features |
|------|----------|
| **General** | Standard entry |
| **VIP** | Premium area, perks |
| **Early Bird** | Discounted early purchase |
| **Group** | Multiple tickets, savings |
| **Student** | Discounted with ID |

## Payment Methods

- 💳 Credit/Debit Card
- 🅿️ PayPal

## Your QR Code Ticket

Each ticket has unique QR code:
- Scannable at entrance
- Cannot be duplicated
- One-time use
- Works offline

## At the Event

1. Open email or Balkly app
2. Show QR code at entrance
3. Staff scans code
4. ✅ Entry granted!

**Tips:**
- Screenshot QR as backup
- Arrive with battery charged
- Have PDF ready just in case

## Managing Tickets

**Dashboard** → **My Tickets**

See all your tickets:
- Upcoming events
- Past events
- Ticket details
- Download options

## Ticket Transfer

Give ticket to a friend:
1. Go to My Tickets
2. Click "Transfer"
3. Enter friend\'s email
4. They receive the ticket

⚠️ Once transferred, you can\'t use it

## Refund Policy

| Timing | Refund |
|--------|--------|
| 7+ days before | Full refund |
| 3-7 days before | 50% refund |
| Less than 3 days | No refund |

Request refunds through **My Orders**

## Lost Ticket?

Don\'t worry!
- Check email (search "Balkly ticket")
- Login and check My Tickets
- Contact support@balkly.live

We can resend anytime!
                ',
            ]
        );

        // =====================================================
        // FORUM & COMMUNITY ARTICLES
        // =====================================================

        KbArticle::updateOrCreate(
            ['slug' => 'forum-guide'],
            [
                'category_id' => $forum->id,
                'title' => 'Forum Guide - Getting Started',
                'is_published' => true,
                'display_order' => 1,
                'content' => '
# Forum Guide

Connect with the Balkly community!

## About the Forum

The Balkly Forum is where our community:
- 💬 Discusses topics of interest
- ❓ Asks and answers questions
- 🤝 Helps each other
- 📢 Shares news and events
- 👋 Makes connections

## Forum Categories

| Category | What to Discuss |
|----------|-----------------|
| **General** | Introductions, casual chat |
| **Buy & Sell** | Trading tips, price advice |
| **Auto & Vehicles** | Car advice, mechanics |
| **Real Estate** | Housing, rentals, areas |
| **Jobs & Careers** | Employment, business |
| **Events & Meetups** | Community gatherings |
| **Help & Support** | Questions about Balkly |
| **Off Topic** | Everything else |

## Browsing the Forum

Go to **Forum** in navigation

See:
- Recent topics
- Popular discussions
- Sticky (pinned) topics
- Category filters

## Reading Topics

Click any topic to see:
- Original post
- All replies
- Like counts
- Best answers (if marked)

## Creating a Topic

1. Click **"New Discussion"**
2. Choose category
3. Write title (be descriptive!)
4. Write your post
5. Click **"Publish"**

### Writing Good Topics

✅ **Clear title** - Summarize your question/topic
✅ **Details** - Provide context
✅ **Formatting** - Use paragraphs, lists
✅ **Respectful** - Be polite
✅ **Search first** - Check if asked before

## Replying to Topics

1. Scroll to bottom of topic
2. Write your reply
3. Click **"Post Reply"**

### Good Replies

✅ Stay on topic
✅ Be helpful
✅ Add value
✅ Be respectful

## Forum Features

### Markdown Support
Format your posts:
```
**Bold text**
*Italic text*
# Heading
- Bullet points
[Links](url)
```

### Liking Posts
Click 👍 to show appreciation

### Best Answer
Topic creators can mark best answer ✅

### Watching Topics
Click "Watch" to get notifications on replies

## Reputation System

Earn points for:
- Creating helpful topics: +5
- Getting likes: +2
- Best answer: +10
- Being helpful: +1

Higher reputation = more trust!
                ',
            ]
        );

        KbArticle::updateOrCreate(
            ['slug' => 'forum-rules'],
            [
                'category_id' => $forum->id,
                'title' => 'Forum Rules & Guidelines',
                'is_published' => true,
                'display_order' => 2,
                'content' => '
# Forum Rules & Guidelines

Keep our community friendly and helpful!

## Core Rules

### ✅ DO

1. **Be Respectful**
   - Treat others as you want to be treated
   - Disagree politely
   - Appreciate different viewpoints

2. **Stay On Topic**
   - Post in correct category
   - Keep replies relevant
   - Don\'t hijack threads

3. **Be Helpful**
   - Share knowledge
   - Answer questions fully
   - Help newcomers

4. **Use Clear Language**
   - Write clearly
   - Check spelling
   - Use proper formatting

5. **Search First**
   - Check if question was asked before
   - Avoid duplicate topics

### ❌ DON\'T

1. **No Spam**
   - No repeated posts
   - No excessive self-promotion
   - No advertising without permission

2. **No Harassment**
   - No personal attacks
   - No bullying
   - No discrimination

3. **No Hate Speech**
   - No racism, sexism, or bigotry
   - No political extremism
   - No religious attacks

4. **No Inappropriate Content**
   - No adult content
   - No violence
   - No illegal content

5. **No Scams**
   - No fraudulent offers
   - No phishing
   - No misleading information

## Consequences

### First Violation
- Warning from moderators
- Post may be removed

### Repeated Violations
- Temporary ban (1-7 days)
- Posts removed

### Serious Violations
- Permanent ban
- Account deletion
- Possible legal action

## Reporting Issues

See something that violates rules?

1. Click **"Report"** on the post
2. Select reason
3. Add details
4. Submit

We review all reports within 24 hours.

## Moderators

Our moderators:
- Enforce rules fairly
- Help resolve conflicts
- Answer questions
- Keep community safe

Respect their decisions!

## Appeals

Disagree with moderation decision?

Email: support@balkly.live
Include:
- Your username
- The situation
- Why you disagree

We\'ll review fairly.

---

**By using the forum, you agree to these rules.**

Let\'s build a great community together! 🤝
                ',
            ]
        );

        // =====================================================
        // PAYMENTS & BILLING ARTICLES
        // =====================================================

        KbArticle::updateOrCreate(
            ['slug' => 'payment-methods'],
            [
                'category_id' => $payments->id,
                'title' => 'Payment Methods',
                'is_published' => true,
                'display_order' => 1,
                'content' => '
# Payment Methods

Secure payment options on Balkly!

## Accepted Payment Methods

### 💳 Credit & Debit Cards

We accept:
- Visa
- Mastercard
- American Express

Processed securely through **Stripe**.

### 🅿️ PayPal

- Pay with PayPal balance
- Connected bank account
- PayPal Credit

## What Can You Pay For?

| Service | Payment Required |
|---------|------------------|
| **Listing Promotion** | Yes |
| **Forum Sticky** | Yes |
| **Event Tickets** | Yes |
| **Basic Listing** | FREE |
| **Messaging** | FREE |
| **Account** | FREE |

## Payment Security

### We Use:

✅ **SSL Encryption** - All data encrypted
✅ **PCI Compliance** - Industry standard security
✅ **Stripe** - Trusted payment processor
✅ **No Card Storage** - We don\'t store your card

### Your Protection:

- Secure checkout pages
- Fraud detection
- Purchase confirmation emails
- Transaction records

## Making a Payment

### Step 1: Select Service
Choose what to purchase (promotion, tickets, etc.)

### Step 2: Review Order
Check items and total

### Step 3: Enter Payment
- Card details, or
- PayPal login

### Step 4: Confirm
Click "Pay" to complete

### Step 5: Confirmation
- Success page shown
- Email receipt sent
- Service activated instantly

## Currencies

Pay in:
- **EUR (€)** - Euro
- **AED (د.إ)** - UAE Dirham

Price shown = price charged (no conversion fees from us)

## Invoices

All payments generate invoices:
1. Go to **Dashboard** → **My Orders**
2. Find order
3. Click **"View Invoice"** or **"Download PDF"**

Invoices include:
- Order details
- Payment amount
- Date and time
- Your information
- VAT info (if applicable)

## Failed Payments

Payment declined?

**Common reasons:**
- Insufficient funds
- Card expired
- Incorrect details
- Bank security block

**Solutions:**
1. Check card details
2. Try different card
3. Contact your bank
4. Use PayPal instead

## Payment Support

Issues with payments?

📧 Email: support@balkly.live

Include:
- Order number
- Payment amount
- Issue description
                ',
            ]
        );

        KbArticle::updateOrCreate(
            ['slug' => 'refund-policy'],
            [
                'category_id' => $payments->id,
                'title' => 'Refund Policy',
                'is_published' => true,
                'display_order' => 2,
                'content' => '
# Refund Policy

Understanding our refund process.

## Event Ticket Refunds

| Request Timing | Refund Amount |
|----------------|---------------|
| **7+ days** before event | 100% full refund |
| **3-7 days** before event | 50% partial refund |
| **Less than 3 days** | No refund |
| **After event** | No refund |

### How to Request Ticket Refund

1. Go to **Dashboard** → **My Orders**
2. Find the ticket order
3. Click **"Request Refund"**
4. Select reason
5. Submit request

### Ticket Refund Exceptions

**Full refund given if:**
- Event is cancelled by organizer
- Event is significantly changed
- Technical issues prevented entry

## Listing Promotion Refunds

### Standard Policy

- Promotions are **non-refundable** once activated
- No partial refunds for unused time

### Exceptions

Full refund if:
- Technical error prevented activation
- Double charge occurred
- Promotion never went live

## Forum Sticky Refunds

Same as listing promotions:
- Non-refundable once active
- Exceptions for technical errors

## Processing Time

| Method | Refund Time |
|--------|-------------|
| **Card** | 5-10 business days |
| **PayPal** | 3-5 business days |

Appears as credit, not new transaction.

## How to Request Refund

### Method 1: Dashboard
1. **Dashboard** → **My Orders**
2. Find order
3. Click **"Request Refund"**
4. Fill form
5. Submit

### Method 2: Email
Contact: support@balkly.live

Include:
- Order number
- Reason for refund
- Contact information

## Dispute Resolution

If you disagree with refund decision:

1. Reply to refund email with concerns
2. We\'ll review within 48 hours
3. Final decision communicated

## Chargebacks

Please contact us before filing chargeback:
- We respond quickly
- Avoid chargeback fees
- Faster resolution

Filing unwarranted chargebacks may result in account restrictions.

## Contact

Refund questions?

📧 support@balkly.live
📞 Response within 24 hours
                ',
            ]
        );

        // =====================================================
        // TRUST & SAFETY ARTICLES
        // =====================================================

        KbArticle::updateOrCreate(
            ['slug' => 'staying-safe'],
            [
                'category_id' => $trust->id,
                'title' => 'Staying Safe on Balkly',
                'is_published' => true,
                'display_order' => 1,
                'content' => '
# Staying Safe on Balkly

Your safety is our priority!

## Account Security

### Strong Passwords
- Use 8+ characters
- Mix letters, numbers, symbols
- Don\'t reuse passwords
- Change periodically

### Two-Factor Authentication
Enable 2FA for extra security:
**Settings** → **Security** → **Enable 2FA**

### Email Verification
Always verify your email to:
- Receive important alerts
- Enable account recovery
- Build trust with others

## Safe Buying

### Before Purchasing

✅ **Check seller profile**
- Reviews from others
- Account age
- Previous sales

✅ **Ask questions**
- Request more photos
- Clarify condition
- Understand return policy

✅ **Research price**
- Compare similar items
- Too good to be true = red flag

### Meeting in Person (UAE)

**Safe locations:**
- 🏬 Shopping malls
- 🚔 Police station safe zones
- 🏦 Bank lobbies
- ☕ Busy cafes

**Precautions:**
- Meet during daylight
- Bring a friend
- Tell someone where you\'re going
- Inspect item thoroughly
- Don\'t carry large cash

### Payment Safety

✅ **Recommended:**
- Cash on delivery (after inspection)
- PayPal Goods & Services
- Bank transfer (established sellers)

❌ **Avoid:**
- Wire transfers to strangers
- Cryptocurrency for items
- Full payment before seeing item

## Safe Selling

### Protect Yourself

✅ **Meet safely**
- Public places only
- Bring someone if possible
- Daytime meetings

✅ **Payment first**
- Receive payment before handing over
- Count cash carefully
- Verify bank transfers complete

✅ **Document everything**
- Keep message history
- Photo the item before handover
- Get buyer contact info

## Red Flags 🚩

Watch out for:

| Red Flag | What to Do |
|----------|------------|
| Price too low | Be suspicious |
| Refuses to meet | Don\'t proceed |
| Pressure to decide | Take your time |
| Unusual payment request | Decline |
| Poor communication | Be cautious |
| New account, expensive item | Extra verification |
| Stock photos only | Request real photos |

## Reporting Issues

### Report a Listing
1. Click **"Report"** on listing
2. Select reason
3. Add details
4. Submit

### Report a User
1. Visit their profile
2. Click **"Report User"**
3. Explain concern
4. Submit

### Contact Support
For urgent issues:
📧 support@balkly.live

We investigate all reports within 24 hours.

## If Something Goes Wrong

1. **Stop communication** with bad actor
2. **Don\'t send more money**
3. **Gather evidence** (screenshots, messages)
4. **Report to Balkly** immediately
5. **Report to police** for serious fraud

## Our Commitment

Balkly actively:
- Reviews reported content
- Removes scams and fraud
- Bans bad actors
- Cooperates with authorities
- Protects user privacy
                ',
            ]
        );

        KbArticle::updateOrCreate(
            ['slug' => 'seller-verification'],
            [
                'category_id' => $trust->id,
                'title' => 'Seller Verification Program',
                'is_published' => true,
                'display_order' => 2,
                'content' => '
# Seller Verification Program

Build trust with the verified badge!

## What is Seller Verification?

Verified sellers have:
- ✅ Confirmed identity
- ✅ Validated business (if applicable)
- ✅ Passed our review process
- ✅ **Verified Badge** on profile

## Benefits of Verification

### For Verified Sellers

| Benefit | Description |
|---------|-------------|
| **Trust Badge** | Visible on all listings |
| **Higher Visibility** | Preferred in search |
| **Buyer Confidence** | More inquiries |
| **Faster Sales** | Buyers trust you |
| **Premium Support** | Priority assistance |

### For Buyers

- Know seller is legitimate
- Reduced scam risk
- Accountable sellers
- Easier dispute resolution

## Verification Types

### 👤 Personal Verification
For individual sellers:
- Government ID verification
- Selfie verification
- Address confirmation

### 🏢 Business Verification
For companies:
- Trade license
- Company registration
- Tax ID / VAT number
- Business address

## How to Get Verified

### Step 1: Request Verification
1. Go to **Dashboard** → **Settings**
2. Click **"Request Verification"**
3. Choose type (Personal/Business)

### Step 2: Submit Documents

**Personal:**
- Emirates ID or Passport
- Selfie holding ID
- Proof of address

**Business:**
- Trade license
- Emirates ID of owner
- Business address proof
- VAT certificate (if applicable)

### Step 3: Review Process
- We review within 2-3 business days
- May request additional info
- You\'ll receive email notification

### Step 4: Get Verified!
Once approved:
- Badge appears on profile
- Badge shows on listings
- Verification status in dashboard

## Maintaining Verification

To keep your verified status:
- Keep documents current
- Maintain good standing
- No policy violations
- Update expired documents

## Verification Removal

We may remove verification for:
- Document expiration
- Policy violations
- Fraudulent activity
- User request

## Privacy

Your documents are:
- Encrypted and secure
- Never shared publicly
- Used only for verification
- Deleted after 30 days (documents)

## Cost

**Verification is FREE!**

No fees for:
- Application
- Review process
- Badge display

## Questions?

📧 Email: support@balkly.live
Include: "Verification Question" in subject
                ',
            ]
        );

        KbArticle::updateOrCreate(
            ['slug' => 'reporting-content'],
            [
                'category_id' => $trust->id,
                'title' => 'Reporting Inappropriate Content',
                'is_published' => true,
                'display_order' => 3,
                'content' => '
# Reporting Inappropriate Content

Help keep Balkly safe for everyone!

## What to Report

### Listings

Report if you see:
- 🚫 Prohibited items
- 🚫 Scams or fraud
- 🚫 Stolen goods
- 🚫 Counterfeit items
- 🚫 Misleading descriptions
- 🚫 Duplicate listings (spam)
- 🚫 Wrong category
- 🚫 Inappropriate images

### Forum Posts

Report if you see:
- 🚫 Spam or advertising
- 🚫 Harassment or bullying
- 🚫 Hate speech
- 🚫 Inappropriate content
- 🚫 Personal attacks
- 🚫 Misinformation

### Users

Report if someone:
- 🚫 Attempts scams
- 🚫 Sends threatening messages
- 🚫 Harasses you
- 🚫 Uses fake identity
- 🚫 Violates policies

## How to Report

### Report a Listing
1. Open the listing
2. Click **"Report"** button
3. Select reason from list
4. Add details (optional)
5. Submit

### Report a Forum Post
1. Find the post
2. Click **"Report"** or flag icon
3. Select reason
4. Add details
5. Submit

### Report a User
1. Go to their profile
2. Click **"Report User"**
3. Select reason
4. Explain the issue
5. Submit

### Report via Email
For complex issues:
📧 support@balkly.live

Include:
- URL of content
- Screenshot (if possible)
- Detailed explanation
- Your contact info

## Report Categories

| Category | Examples |
|----------|----------|
| **Spam** | Repeated posts, ads |
| **Fraud/Scam** | Fake offers, phishing |
| **Inappropriate** | Adult content, violence |
| **Harassment** | Bullying, threats |
| **Copyright** | Stolen images/content |
| **Duplicate** | Same listing multiple times |
| **Wrong Category** | Misplaced content |
| **Other** | Anything else concerning |

## What Happens After Reporting

1. **We receive** your report
2. **Review** within 24 hours
3. **Take action** if needed:
   - Remove content
   - Warn user
   - Ban user
4. **You may receive** follow-up (optional)

## Our Commitment

We take reports seriously:
- All reports reviewed
- Quick response times
- Fair enforcement
- User privacy protected

## False Reports

Please don\'t report:
- Content you simply disagree with
- Competitors\' legitimate listings
- Personal disputes

Repeated false reports may result in account action.

## Urgent Matters

For immediate threats or illegal activity:
- Report to local authorities
- Contact UAE Cybercrime: 901
- Email us: support@balkly.live

## Anonymous Reporting

- Reports can be anonymous
- We don\'t share reporter identity
- Reporters protected from retaliation
                ',
            ]
        );

        echo "✅ Knowledge Base seeded with " . KbArticle::count() . " articles in " . KbCategory::count() . " categories!\n";
    }
}
