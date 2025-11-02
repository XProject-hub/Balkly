# Balkly — Modern Marketplace + Forum + Events Platform

> A comprehensive marketplace platform with paid listings, forum, events (affiliate & own ticketing), AI assistants, and real-time features.

## 🌟 Features

### Core Modules
- **Marketplace**: Paid listings with categories (Auto, Real Estate, Events, etc.)
- **Forum**: Community discussions with paid sticky/featured posts
- **Events**: 
  - Affiliate events with tracking & commission
  - Own ticketing system with QR check-in
- **AI Assistants**: 
  - Listing copilot (title/description generation, translation)
  - Content classifier
  - Moderation (NSFW, spam, fraud detection)
  - Support chatbot

### Key Features
- ✅ Multi-language support (EN, BS, DE)
- ✅ Real-time chat between buyers/sellers
- ✅ Advanced search with filters and map view
- ✅ Payment integration (Stripe, Checkout.com)
- ✅ Automated invoicing with VAT handling
- ✅ QR code ticketing with check-in app
- ✅ Moderation queue with AI pre-screening
- ✅ Progressive Web App (PWA)
- ✅ SEO optimized with schema.org markup
- ✅ GDPR compliant with data export/delete

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router, Server Actions)
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Zustand** (state management)
- **react-hook-form** + **zod** (forms & validation)
- **Framer Motion** (animations)
- **Leaflet/MapLibre** (maps)

### Backend
- **Laravel 11** (PHP 8.3)
- **MySQL 8** (InnoDB, UTF8MB4)
- **Redis 7** (cache & queues)
- **Meilisearch** (search engine)
- **Laravel Horizon** (queue management)
- **Laravel WebSockets** (real-time)

### Infrastructure
- **Docker** + **Docker Compose**
- **Nginx** (reverse proxy)
- **MinIO** (S3-compatible object storage)
- **GitHub Actions** (CI/CD)

### Services
- **Stripe** (payments)
- **OpenAI GPT-4** (AI features)
- **Postmark/SendGrid** (emails)
- **Twilio** (SMS/OTP)

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- PHP 8.3+
- Composer 2.6+

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Balkly
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start services with Docker Compose**
```bash
docker-compose up -d
```

4. **Set up Laravel backend**
```bash
cd balkly-api
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
```

5. **Set up Next.js frontend**
```bash
cd balkly-web
npm install
npm run dev
```

6. **Access the platform**
- Frontend: http://localhost
- Backend API: http://localhost/api/v1
- MinIO Console: http://localhost:9001
- Meilisearch: http://localhost:7700

## 📁 Project Structure

```
Balkly/
├── balkly-api/          # Laravel backend
│   ├── app/
│   │   ├── Models/      # Eloquent models
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Middleware/
│   │   ├── Services/    # Business logic
│   │   └── Jobs/        # Queue jobs
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
├── balkly-web/          # Next.js frontend
│   ├── src/
│   │   ├── app/         # App router pages
│   │   ├── components/  # React components
│   │   ├── lib/         # Utilities
│   │   └── styles/      # Global styles
│   └── public/
├── nginx/               # Nginx configuration
├── docker-compose.yml
└── README.md
```

## 📖 API Documentation

API endpoints follow REST conventions with `/api/v1` prefix.

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/2fa/verify` - 2FA verification

### Listings
- `GET /listings` - List all listings
- `POST /listings` - Create listing
- `GET /listings/:id` - Get listing details
- `PATCH /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing
- `POST /listings/:id/boost` - Boost listing
- `POST /listings/:id/publish` - Publish listing

### Forum
- `GET /forum/categories` - List forum categories
- `POST /forum/posts` - Create forum post
- `POST /forum/posts/:id/sticky` - Make post sticky (paid)

### Events
- `GET /events` - List events
- `POST /events` - Create event (organizer)
- `POST /events/:id/tickets` - Create ticket types
- `POST /ticket_orders/:id/pay` - Purchase tickets
- `POST /ticket/scan` - Check-in QR code

### Chat
- `POST /chats/:listing_id` - Start chat
- `GET /chats` - List user chats
- `POST /messages` - Send message

See full API documentation at `/api/v1/docs` (Swagger/OpenAPI).

## 💰 Monetization Model

### Listing Fees
- **Standard**: €4.99 / 30 days
- **Featured**: €14.99 / 30 days (homepage + category top)
- **Top/Boost**: €4.99 / 7 days bump

### Forum
- **Sticky**: €2.99 / 7 days, €9.99 / 30 days

### Events
- **Own Ticketing**: 7.5% + €0.35 per ticket
- **Affiliate**: CPA/CPS per partner agreement

### Subscriptions (Optional)
- **Basic**: €19/month
- **Pro**: €49/month
- **Business**: €99/month

## 🧪 Testing

```bash
# Backend tests
cd balkly-api
php artisan test

# Frontend tests
cd balkly-web
npm run test

# E2E tests
npm run test:e2e
```

## 🔒 Security

- Password hashing with Argon2id
- 2FA with TOTP
- Rate limiting per IP/session
- CSRF protection
- Content Security Policy (CSP)
- Signed URLs for media access
- Input validation and sanitization
- Audit logs for all actions
- GDPR compliance tools

## 📊 Admin Panel

Access at `/admin` with admin role:
- User management
- Content moderation queue
- Pricing configuration
- Payout management
- Analytics dashboard
- System settings
- Audit logs

## 🤖 AI Features

### Listing Copilot
- Auto-generate compelling titles (max 70 chars)
- Improve descriptions with bullet points
- Auto-translate to EN/BS/DE
- Image cleanup and optimization
- Category and attribute auto-tagging

### Moderation
- NSFW detection
- Spam filtering
- Duplicate detection
- Fraud signal analysis
- Toxicity scoring

### Support Bot
- FAQ answers
- Policy guidance
- Multi-language support
- RAG over help center articles

## 🌍 Internationalization

Supported languages:
- English (en)
- Bosnian (bs)
- German (de)

## 📱 PWA Features

- Installable on mobile/desktop
- Offline browsing
- Push notifications
- Add to home screen

## 🚢 Deployment

### Production Checklist
- [ ] Configure production environment variables
- [ ] Set up SSL certificates
- [ ] Configure CDN for static assets
- [ ] Set up automated backups
- [ ] Configure monitoring (Sentry, Grafana)
- [ ] Set up log aggregation
- [ ] Configure WAF and rate limiting
- [ ] Review security headers
- [ ] Set up CI/CD pipeline
- [ ] Load testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Proprietary - All rights reserved

## 📞 Support

For support, email support@balkly.com or join our Slack channel.

---

**Built with ❤️ by the Balkly Team**

