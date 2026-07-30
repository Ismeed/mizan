# MIZAN API Documentation

## Base URL
All API requests should be prefixed with `/api` (e.g. `http://localhost:3000/api`).

## Authentication
Most endpoints require a JWT access token sent in the Authorization header.
```
Authorization: Bearer <your_access_token>
```

## Standard Error Format
```json
{
  "success": false,
  "error": "Message describing the error"
}
```

## Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login and get tokens |
| POST | `/auth/verify-email` | No | Verify email using OTP |
| POST | `/auth/forgot-password` | No | Request password reset |
| POST | `/auth/reset-password` | No | Reset password |
| POST | `/auth/refresh` | No | Refresh access token |
| GET | `/auth/profile` | Yes | Get current user profile |

**Example Request (POST /auth/login)**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```
**Example Response (POST /auth/login)**
```json
{
  "success": true,
  "data": {
    "user": { "id": "123", "email": "user@example.com" },
    "tokens": { "access_token": "...", "refresh_token": "..." }
  }
}
```

### Inheritance
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/inheritance/calculate` | Yes | Calculate inheritance shares |
| GET | `/inheritance/history` | Yes | Get user's calculation history |
| GET | `/inheritance/:id` | Yes | Get a specific calculation |

**Example Request (POST /inheritance/calculate)**
```json
{
  "total_estate": 100000,
  "debts": 5000,
  "funeral_expenses": 1000,
  "wasiyyah": 10000,
  "madhhab": "HANAFI",
  "currency": "USD",
  "heirs": [
    { "heir_type": "WIFE", "count": 1 },
    { "heir_type": "SON", "count": 2 }
  ]
}
```

### Zakat
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/zakat/calculate` | Yes | Calculate Zakat |
| GET | `/zakat/history` | Yes | Get user's Zakat calculation history |
| GET | `/zakat/nisab-rates` | No | Get current gold/silver nisab rates |

**Example Request (POST /zakat/calculate)**
```json
{
  "currency": "USD",
  "total_debts": 1000,
  "assets": [
    { "asset_type": "CASH", "value": 15000 }
  ]
}
```

### AI Assistant
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/ai/chat` | Yes | Send message to AI |
| GET | `/ai/conversations` | Yes | Get conversation history |
| GET | `/ai/conversations/:id/messages` | Yes | Get messages for a conversation |

**Example Request (POST /ai/chat)**
```json
{
  "conversation_id": "optional-id",
  "message": "What is the ruling on Zakat for business inventory?"
}
```

### Reports
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/reports/inheritance/:id` | Yes | Generate PDF report for inheritance |
| GET | `/reports/zakat/:id` | Yes | Generate PDF report for Zakat |

### Notifications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/notifications` | Yes | Get user notifications |
| PUT | `/notifications/:id/read` | Yes | Mark notification as read |
| POST | `/notifications/register-token` | Yes | Register Firebase FCM token |

### Admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/stats` | Yes (Admin)| Get system statistics |
| GET | `/admin/users` | Yes (Admin)| List users |
| POST | `/admin/broadcast`| Yes (Admin)| Send broadcast notification |
