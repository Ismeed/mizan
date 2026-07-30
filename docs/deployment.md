# Deployment Guide

This guide covers the deployment of the MIZAN backend, database, and mobile applications.

## 1. Database & Cache (Docker Compose)
For self-hosting or simple setups, you can deploy PostgreSQL and Redis using Docker Compose.

**docker-compose.yml**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mizan_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

volumes:
  pgdata:
```
Run `docker-compose up -d` to start the databases.

## 2. Backend Deployment (Railway / Render)
The Node.js backend can be easily deployed to PaaS providers like Railway or Render.

1. Connect your GitHub repository to Railway/Render.
2. Select the `backend` directory as the root (or use Turborepo scripts).
3. Set the build command: `npm run build`
4. Set the start command: `npm start`
5. Inject Environment Variables.

### Environment Variable Checklist
Ensure the following variables are set in your production environment:
- `NODE_ENV=production`
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
- `OPENAI_API_KEY`
- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `CORS_ALLOWED_ORIGINS`

### Database Migrations
Before the app can serve traffic, you must apply Prisma migrations.
Run this command in your CI/CD pipeline or directly on the server:
```bash
npx prisma migrate deploy
```

### Health Checks
Configure your PaaS to use the health check endpoint:
- **Endpoint:** `GET /health`
- **Expected Status:** `200 OK`

## 3. Mobile App Deployment (EAS Build)
The React Native mobile app is built using Expo Application Services (EAS).

1. Install EAS CLI: `npm install -g eas-cli`
2. Login to Expo: `eas login`
3. Configure your project: `eas build:configure`
4. Ensure `EXPO_PUBLIC_API_URL` is set in your environment or `.env` correctly.

### Build Android
```bash
eas build --platform android --profile production
```

### Build iOS
```bash
eas build --platform ios --profile production
```

After EAS finishes the build, you can submit the artifacts to the App Store and Google Play Store using `eas submit`.
