# AI Social Platform

A full-stack social media application scaffold for AI-assisted post generation, automated moderation, real-time chat, dashboards, secure form submissions, and role-based access control.

## Stack

- Frontend: Next.js, React, Tailwind CSS, Framer Motion, Socket.io client
- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis, BullMQ, Socket.io
- AI service: Python FastAPI, Hugging Face-ready moderation endpoints
- Services: Winston logs, Nodemailer email notifications, JWT auth, bcrypt password hashing

## Project Structure

```txt
ai-social-platform/
  backend/
  frontend/
  ai-service/
  docker-compose.yml
  .env.example
```

## Quick Start

```bash
cp .env.example backend/.env
cp .env.example frontend/.env.local
docker compose up --build
```

## Deployment

Production-style deployment files are included:

```txt
docker-compose.prod.yml
.env.production.example
render.yaml
deployment/nginx.conf
deployment/README.md
deployment/render-deploy.md
deployment/deploy.sh
deployment/deploy.ps1
```

Basic deployment:

```bash
cp .env.production.example .env.production
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend npx prisma db push
```

See `deployment/README.md` for full steps.

### Deploy Link

After pushing this project to GitHub, use this Render deploy link format:

```txt
https://render.com/deploy?repo=https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
```

The included `render.yaml` defines the frontend, backend, AI service, PostgreSQL, and Redis/Key Value resources.

For local development without Docker:

```bash
cd backend
npm install
npm run prisma:generate
npm run dev

cd ../frontend
npm install
npm run dev

cd ../ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

## Core Flows

### Post generation and moderation

```txt
User request -> Express route -> Auth/RBAC/Validation middleware -> Controller
-> Feed service -> AI intent detection -> LLM generation -> AI moderation
-> Rules engine -> PostgreSQL -> structured response
```

Safe posts are published, yellow posts are quarantined for moderator review, and red posts are rejected.

### Form submission

```txt
POST /api/forms/submit -> Zod validation -> Winston log -> PostgreSQL storage
-> Nodemailer notification -> JSON response
```

### Chat

```txt
Next.js chat UI -> Socket.io client -> Express Socket.io server
-> Prisma message storage -> receiver room broadcast
```

## Roles

- USER: social feed, profile, follow, chat, own post deletion
- MODERATOR: dashboard access, post flagging, moderation review
- ADMIN: full moderation access and delete any post

## Important API Prefixes

- `/api/auth`
- `/api/feed`
- `/api/profile`
- `/api/dashboard`
- `/api/forms/submit`
