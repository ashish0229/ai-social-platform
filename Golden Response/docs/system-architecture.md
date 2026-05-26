# System Architecture

## Request Flow

```txt
Next.js frontend
  |
  v
Express routes
  |
  v
Middleware: Helmet, CORS, rate limit, JWT auth, RBAC, Zod validation
  |
  v
Controllers
  |
  v
Services
  |
  +--> Prisma/PostgreSQL
  +--> Redis/BullMQ
  +--> Socket.io
  +--> FastAPI AI service
  +--> Nodemailer
  +--> Winston logs
```

## Moderation Pipeline

```txt
Input JSON
  |
  v
Intent detection
  |
  v
LLM-style generation
  |
  v
Toxicity, hate speech, and self-harm classifiers
  |
  v
Rules engine using moderation_rules.json
  |
  +--> PUBLISHED for safe content
  +--> QUARANTINED with yellow flag for moderator review
  +--> REJECTED with red flag for unsafe content
```

## Email and Log Flow

```txt
Form validation
  |
  v
Payload sanitization
  |
  v
Winston structured log
  |
  v
PostgreSQL FormSubmission
  |
  v
Nodemailer notification
  |
  v
HTTP response
```

## Scaling Notes For 1000 Pre-production Users

- Run backend and frontend as separate services.
- Use PostgreSQL indexes already defined in Prisma for feed, moderation, messages, and activity queries.
- Use Redis for presence, BullMQ queues, and Socket.io adapter if scaled horizontally.
- Keep AI moderation behind FastAPI so model serving can scale independently.
- Store uploaded images in object storage in production and persist only URLs in PostgreSQL.

