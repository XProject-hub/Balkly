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

        // Create Categories (or get existing)
        $gettingStarted = KbCategory::firstOrCreate(
            ['slug' => 'getting-started'],
            [
                'name' => 'Getting Started',
                'description' => 'New to Balkly? Start here!',
                'display_order' => 1,
            ]
        );

        $listings = KbCategory::firstOrCreate(
            ['slug' => 'listings-selling'],
            [
                'name' => 'Listings & Selling',
                'description' => 'Everything about posting and managing listings',
                'display_order' => 2,
            ]
        );

        $buying = KbCategory::firstOrCreate(
            ['slug' => 'buying-orders'],
            [
                'name' => 'Buying & Orders',
                'description' => 'How to buy items and manage orders',
                'display_order' => 3,
            ]
        );

        $events = KbCategory::firstOrCreate(
            ['slug' => 'events-tickets'],
            [
                'name' => 'Events & Tickets',
                'description' => 'Event tickets and QR codes',
                'display_order' => 4,
            ]
        );

        $forum = KbCategory::firstOrCreate(
            ['slug' => 'forum-community'],
            [
                'name' => 'Forum & Community',
                'description' => 'Using the Balkly community forum',
                'display_order' => 5,
            ]
        );

        $account = KbCategory::firstOrCreate(
            ['slug' => 'account-security'],
            [
                'name' => 'Account & Security',
                'description' => 'Managing your account and security settings',
                'display_order' => 6,
            ]
        );

        // Create Articles

        // Getting Started
        KbArticle::firstOrCreate(
            ['slug' => 'welcome-quick-start'],
            [
                'category_id' => $gettingStarted->id,
                'title' => 'Welcome to Balkly - Quick Start Guide',
                'is_published' => true,
                'display_order' => 1,
                'content' => '
# Welcome to Balkly!

Balkly is the premier marketplace platform for the Balkan community in the UAE. Whether you\'re buying, selling, or connecting with fellow Balkanci, we\'ve got you covered!

## What Can You Do on Balkly?

### 🛍️ **Buy & Sell**
- Browse thousands of listings across multiple categories
- Auto, Real Estate, Electronics, Fashion, Jobs, and more
- Safe and secure transactions

### 🎫 **Events & Entertainment**
- Discover upcoming events in Dubai and across UAE
- Buy tickets with QR codes for easy entry
- Concerts, sports, cultural events, and more

### 💬 **Community Forum**
- Connect with other Balkanci in UAE
- Ask questions, share experiences
- Get advice on living in Dubai

## Getting Started

1. **Create an account** - Click "Sign Up" in the top right
2. **Complete your profile** - Add your location and interests
3. **Browse or post** - Start buying, selling, or joining discussions!

## Need Help?

- 📧 Email: support@balkly.live
- 💬 Live Chat: Available on every page
- 📚 Knowledge Base: You\'re here!

**Dobrodošli! مرحبا بك!**
                ',
            ]
        );

        KbArticle::firstOrCreate(
            ['slug' => 'switch-languages'],
            [
                'category_id' => $gettingStarted->id,
                'title' => 'How to Switch Languages',
                'is_published' => true,
                'display_order' => 2,
                'content' => '
# Language Support

Balkly supports 5 languages to serve our diverse Balkan community in UAE!

## Available Languages

- 🇬🇧 **English** - International
- 🇷🇸 **Serbian** (Srpski)
- 🇭🇷 **Croatian** (Hrvatski)
- 🇧🇦 **Bosnian** (Bosanski)
- 🇦🇪 **Arabic** (العربية) - with RTL support

## How to Change Language

1. Look for the **flag icon** in the top navigation bar
2. Click the flag to open language menu
3. Select your preferred language
4. The entire site will switch immediately!

Your language choice is saved automatically.

## Currency Support

We also support multiple currencies:
- **EUR** (€) - Euro
- **AED** (د.إ) - UAE Dirham

Change currency using the dropdown next to the language switcher.
                ',
            ]
        );

        // Listings & Selling
        KbArticle::firstOrCreate(
            ['slug' => 'post-listing'],
            [
                'category_id' => $listings->id,
                'title' => 'How to Post a Listing',
                'is_published' => true,
                'display_order' => 3,
                'content' => '
# Posting Your First Listing

Follow these simple steps to post your item for sale:

## Step 1: Click "Post Listing"

Find the button in:
- Top navigation (desktop)
- Mobile menu
- Or go directly to: `/listings/create`

## Step 2: Choose Category

Select the right category for your item:
- **Auto** - Cars, motorcycles, vehicles
- **Real Estate** - Apartments, villas, commercial
- **Electronics** - Phones, laptops, gadgets
- **Fashion** - Clothing, shoes, accessories
- **Jobs** - Employment opportunities
- And more!

## Step 3: Fill in Details

Provide accurate information:
- **Title** - Clear, descriptive (e.g., "2022 Toyota Camry - Low Mileage")
- **Description** - Detailed condition, features, history
- **Price** - Fair market value
- **Location** - City and area in UAE
- **Photos** - Multiple clear images (up to 10)

## Step 4: Choose Promotion (Optional)

**Free to Post!** But you can boost visibility:

- **3 days** - €5 / د.إ20
- **7 days** - €10 / د.إ40
- **30 days** - €30 / د.إ120

Promoted listings appear at the top of search results!

## Step 5: Publish

Click "Submit" and your listing goes live immediately!

## Tips for Great Listings

✅ Use high-quality photos
✅ Be honest about condition
✅ Price competitively
✅ Respond quickly to messages
✅ Include all relevant details

Happy selling! 🎉
                ',
            ]
        );

        KbArticle::firstOrCreate(
            ['slug' => 'promoting-listings'],
            [
                'category_id' => $listings->id,
                'title' => 'Promoting Your Listings - Pricing & Benefits',
                'is_published' => true,
                'display_order' => 4,
                'content' => '
# Listing Promotion Plans

Want more visibility? Promote your listing to appear at the top!

## Promotion Tiers

### 🥉 **3 Days Promotion**
- **Price:** €5 / د.إ20
- Top placement for 3 days
- Great for quick sales
- Perfect for urgent items

### 🥈 **7 Days Promotion**  
- **Price:** €10 / د.إ40
- Top placement for 1 week
- **Most Popular Choice!**
- Best value for money

### 🥇 **30 Days Promotion**
- **Price:** €30 / د.إ120
- Top placement for entire month
- Maximum exposure
- Ideal for premium items

## Benefits of Promotion

✅ **Top Position** - Appear first in search results
✅ **Featured Badge** - Special highlight marker
✅ **More Views** - 5-10x more visibility
✅ **Faster Sales** - Sell 3x faster on average
✅ **Homepage Display** - May appear on homepage

## How to Promote

1. When creating listing, select promotion duration
2. Or promote existing listing from dashboard
3. Pay securely with Stripe
4. Instant activation!

## Free Alternative

Don\'t want to pay? No problem!

- Regular listings are **always free**
- They appear in chronological order
- Still fully searchable
- Still get views and messages

**It\'s your choice!** 💰
                ',
            ]
        );

        // Events & Tickets
        KbArticle::firstOrCreate(
            ['slug' => 'event-tickets-qr'],
            [
                'category_id' => $events->id,
                'title' => 'How Event Tickets Work - QR Codes & Entry',
                'is_published' => true,
                'display_order' => 5,
                'content' => '
# Event Tickets & QR Codes

Balkly uses modern QR code technology for seamless event entry!

## Buying Tickets

1. Browse events at `/events`
2. Select your event
3. Choose ticket type (General, VIP, etc.)
4. Complete payment
5. **Instant QR code delivery via email!**

## Your QR Code Ticket

After purchase, you receive:
- ✉️ **Email** with QR code
- 📱 **View in Dashboard** → My Tickets
- 🎫 **Printable PDF** version
- 🔗 **Shareable link**

## At the Event

1. Open email or dashboard on your phone
2. Show QR code at entrance
3. Staff scans with Balkly app
4. ✅ **Instant verification** - You\'re in!

## QR Code Features

✅ **Unique** - Each ticket has unique code
✅ **Secure** - Can\'t be duplicated
✅ **One-time scan** - Prevents reuse
✅ **Offline works** - No internet needed at venue
✅ **Real-time** - Instant validation

## Ticket Transfer

Want to give ticket to a friend?

1. Go to Dashboard → My Tickets
2. Click "Transfer"
3. Enter friend\'s email
4. They receive the QR code

## Refund Policy

- **7+ days before event:** Full refund
- **3-7 days before:** 50% refund
- **Less than 3 days:** No refund

See full policy at `/refund`

## Lost Your Ticket?

No worries!

- Check your email
- Login to Dashboard → My Tickets
- Contact support@balkly.live

We can resend anytime! 🎉
                ',
            ]
        );

        // Forum
        KbArticle::firstOrCreate(
            ['slug' => 'using-forum'],
            [
                'category_id' => $forum->id,
                'title' => 'Using the Community Forum',
                'is_published' => true,
                'display_order' => 6,
                'content' => '
# Community Forum Guide

Connect with thousands of Balkanci living in UAE!

## Forum Categories

### Main Topics
- **General Discussion** - General chat, introductions
- **Buy & Sell** - Trading tips, price checks
- **Auto & Vehicles** - Car advice, maintenance
- **Real Estate** - Housing tips, recommendations
- **Events** - Meetups, gatherings
- **Help & Support** - Get help from community

## Creating a Topic

1. Go to `/forum`
2. Click "New Discussion"
3. Choose category
4. Write your post (Markdown supported!)
5. Publish

**Free to post!**

## Making Your Topic Sticky

Want your topic at the top?

Pay to make it "sticky" (pinned):
- **7 days:** €5 / د.إ20
- **15 days:** €10 / د.إ40
- **30 days:** €20 / د.إ80

Great for:
- Important announcements
- Event organization
- Group buys
- Community initiatives

## Forum Rules

✅ Be respectful
✅ No spam or advertising
✅ Stay on topic
✅ Help each other
✅ Use appropriate language

❌ No hate speech
❌ No scams
❌ No personal attacks

Violators will be banned.

## Markdown Support

Format your posts beautifully:

```
**Bold text**
*Italic text*
# Heading
- Bullet list
[Links](url)
```

## Getting Help

Stuck? Post in **Help & Support** category!

Our community is friendly and helpful. 🤝
                ',
            ]
        );

        // Account & Security
        KbArticle::firstOrCreate(
            ['slug' => 'account-security-2fa'],
            [
                'category_id' => $account->id,
                'title' => 'Account Security & Two-Factor Authentication (2FA)',
                'is_published' => true,
                'display_order' => 7,
                'content' => '
# Keep Your Account Secure

Protect your Balkly account with these security features!

## Strong Password

✅ Minimum 8 characters
✅ Mix of letters, numbers, symbols
✅ Don\'t reuse passwords
✅ Change regularly

## Two-Factor Authentication (2FA)

Add extra security layer!

### Enable 2FA:

1. Go to **Dashboard** → **Settings**
2. Click "Enable 2FA"
3. Scan QR code with authenticator app:
   - Google Authenticator
   - Authy
   - Microsoft Authenticator
4. Enter 6-digit code to confirm
5. **Save backup codes!**

### Benefits:

🔒 Even if password is stolen, account stays safe
🔒 Required for high-value transactions
🔒 Builds buyer trust

## Email Verification

Always verify your email:
- Receive important notifications
- Password reset capability
- Account recovery

Check your inbox after registration!

## Account Recovery

Forgot password?

1. Click "Forgot Password" on login
2. Enter your email
3. Check inbox for reset link
4. Create new password

## Privacy Settings

Control what others see:
- Email address (private by default)
- Phone number (optional display)
- Last online status
- Activity history

Go to **Dashboard** → **Privacy Settings**

## Report Suspicious Activity

See something wrong?
- Contact: support@balkly.live
- Use "Report" button on listings/users
- We investigate within 24 hours

**Stay safe!** 🛡️
                ',
            ]
        );

        // Buying
        KbArticle::firstOrCreate(
            ['slug' => 'buying-safely'],
            [
                'category_id' => $buying->id,
                'title' => 'How to Buy Safely on Balkly',
                'is_published' => true,
                'display_order' => 8,
                'content' => '
# Safe Buying Guide

Follow these tips for secure purchases on Balkly!

## Before You Buy

### ✅ Check the Seller

- Read seller reviews and ratings
- Check join date and history
- Look for verified badge
- Read previous buyer feedback

### ✅ Inspect the Item

- Request more photos if needed
- Ask specific questions
- Request video calls for high-value items
- Check for authenticity documents

### ✅ Agree on Details

- Final price (no hidden fees)
- Delivery method
- Payment terms
- Return policy (if any)

## Meeting in Person (Dubai)

### Safe Meeting Locations:

✅ **Shopping Malls** - Dubai Mall, Mall of Emirates
✅ **Police Stations** - Have "safe trade zones"
✅ **Bank Lobbies** - Secure and monitored
✅ **Public Cafes** - Busy, well-lit areas

❌ Avoid private homes
❌ Avoid late night meetings
❌ Avoid isolated areas

### During Meeting:

- Bring a friend if possible
- Inspect item thoroughly
- Test electronics before paying
- Verify documents (for cars, real estate)
- Count cash carefully
- Get receipt/proof of sale

## Online Payments

Use secure methods:
- Balkly escrow (coming soon)
- PayPal Goods & Services
- Bank transfer (for trusted sellers)

❌ Avoid Western Union
❌ Avoid cryptocurrency (for items)
❌ Never pay full amount upfront to unknown sellers

## Red Flags 🚩

Watch out for:
- Prices too good to be true
- Seller refuses to meet in person
- Requests unusual payment methods
- Poor communication
- Pressure to decide quickly
- No photos or stock photos
- Newly created account with expensive items

## If Something Goes Wrong

1. Contact seller first
2. Use Balkly messaging (keeps record)
3. Report to: support@balkly.live
4. We investigate and take action

## Your Rights

- Accurate item description
- Safe transaction environment
- Privacy protection
- Dispute resolution support

**Buy smart, buy safe!** 🛡️✅
                ',
            ]
        );

        echo "✅ Knowledge Base seeded with " . KbArticle::count() . " articles!\n";
    }
}

