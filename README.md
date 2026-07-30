# MIZAN — Justice in Every Calculation

> AI-powered Islamic Financial Assistant for calculating Inheritance (Mirath), Zakat, and more.

## Overview
MIZAN is a comprehensive, open-source Islamic Financial Assistant designed to provide accurate and compliant calculations for Inheritance (Mirath or Faraid) and Zakat, following classical Islamic jurisprudence. It aims to simplify complex rules, helping users calculate shares of heirs or due Zakat on various asset classes reliably. By combining a deterministic offline-first rule engine with an intelligent AI assistant, MIZAN offers both precise calculations and conversational guidance.

## Architecture
MIZAN uses a Monorepo architecture managed by Turborepo.

```
MIZAN Monorepo
│
├── apps/
│   └── mobile/        # Expo React Native App
│
├── packages/          # Shared engines and utilities
│
└── backend/           # Node.js + Express API
    ├── PostgreSQL     # Primary relational database
    └── Redis          # Caching and rate limiting
```

## Features
- **Inheritance Calculator (Mirath/Faraid)** — Complete rule set including all Hanafi rules.
- **Zakat Calculator** — Supports all asset types (gold, silver, cash, business goods) with live Nisab rates.
- **AI Assistant** — GPT-4o powered chat bot with specialized Islamic finance expertise.
- **PDF Report Generation** — Export detailed and formatted calculations as PDFs.
- **Multi-Madhhab Support** — Support for Hanafi, Maliki, Shafi'i, Hanbali, and Ja'fari schools (configurable).
- **Push Notifications** — Integrated with Firebase for mobile alerts.
- **Email Notifications** — Automated emails for verification and reports via SMTP.

## Tech Stack
| Tier | Technology |
|---|---|
| Frontend | Expo (React Native), React Navigation, Zustand, Expo Router |
| Backend | Node.js, Express, TypeScript, Prisma ORM, Puppeteer (Reports) |
| Database | PostgreSQL, Redis |
| AI | OpenAI API (GPT-4o) |
| Auth | Custom JWT Authentication, Firebase (Push) |

## Prerequisites
- Node.js >= 18
- PostgreSQL >= 14
- Redis
- Expo CLI

## Quick Start
### 1. Clone & install
```bash
git clone https://github.com/yourusername/mizan.git
cd mizan
npm install
```

### 2. Setup environment
Copy the environment files and fill in your keys:
```bash
cp backend/.env.example backend/.env
cp apps/mobile/.env.example apps/mobile/.env
```

### 3. Database setup
Ensure PostgreSQL is running.
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 4. Run backend
```bash
npm run dev --workspace=backend
```

### 5. Run mobile
```bash
npm run start --workspace=mizan-mobile
```

## Environment Variables
| Variable | Description |
|---|---|
| `NODE_ENV` | Environment type (development/production) |
| `PORT` | API Server port |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Secret key for JWT access tokens |
| `JWT_REFRESH_SECRET` | Secret key for JWT refresh tokens |
| `JWT_EXPIRES_IN` | Expiry time for access tokens |
| `JWT_REFRESH_EXPIRES_IN` | Expiry time for refresh tokens |
| `SMTP_HOST` | Email SMTP host |
| `SMTP_PORT` | Email SMTP port |
| `SMTP_USER` | Email SMTP user |
| `SMTP_PASS` | Email SMTP password |
| `FROM_EMAIL` | Default sender email |
| `OPENAI_API_KEY` | OpenAI API key for AI assistant |
| `FIREBASE_SERVICE_ACCOUNT_JSON`| Firebase admin SDK credentials |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary name for avatars/assets |
| `CLOUDINARY_API_KEY` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret |
| `PAYSTACK_SECRET_KEY` | Secret key for Paystack (payments) |
| `STRIPE_SECRET_KEY` | Secret key for Stripe (payments) |
| `ALLOWED_ORIGINS` | CORS origins allowed |
| `FRONTEND_URL` | Frontend domain |

## API Endpoints
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Authenticate user |
| GET | `/api/auth/profile` | Yes | Get user profile |
| POST | `/api/inheritance/calculate`| Yes | Calculate Mirath |
| GET | `/api/inheritance/history`| Yes | View inheritance history |
| GET | `/api/inheritance/:id` | Yes | Get specific inheritance calculation |
| POST | `/api/zakat/calculate` | Yes | Calculate Zakat |
| GET | `/api/zakat/history` | Yes | View Zakat history |
| GET | `/api/zakat/nisab-rates`| No | Get live Nisab rates |
| POST | `/api/ai/chat` | Yes | Send a message to AI assistant |
| GET | `/api/ai/conversations` | Yes | List AI conversations |
| POST | `/api/reports/inheritance/:id`| Yes | Generate Inheritance PDF |
| POST | `/api/reports/zakat/:id` | Yes | Generate Zakat PDF |
| GET | `/api/notifications` | Yes | Get user notifications |
| POST | `/api/notifications/register-token`| Yes| Register device for Push |

## Rule Engine
The core Inheritance (Mirath) and Zakat logic operates on an **offline-first, deterministic rule engine**. All calculations are handled purely by code implementing traditional Fiqh rules, without reliance on AI. This guarantees precision, reproducibility, and reliability. AI features are restricted entirely to the conversational assistant for educational guidance.

## Madhhab Support
| Madhhab | Supported | Key Differences (Inheritance/Zakat) |
|---|---|---|
| Hanafi | Yes (Default)| Radd, Dhawul Arham calculation |
| Shafi'i | Yes | Zakat on personal jewelry differences |
| Maliki | Yes | Specific rulings on Awl and Radd |
| Hanbali | Yes | Specifics on Dhawul Arham |
| Ja'fari | Yes | Entirely different class-based inheritance |

## Islamic Finance Disclaimer
> **Disclaimer:** MIZAN is an educational and assisting tool. While every effort has been made to ensure calculations adhere to classical Fiqh principles, Islamic Finance and Inheritance involve highly nuanced legal and religious aspects that can vary by region and individual circumstances. Please consult with qualified local scholars or Islamic legal authorities before executing any financial distributions or legal wills.

## License
MIT
