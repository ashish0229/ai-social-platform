# Deployment Guide

This project includes a Docker-based deployment for a pre-production server. It runs:

- Next.js frontend
- Express API and Socket.io backend
- FastAPI AI service
- PostgreSQL
- Redis
- Nginx reverse proxy

## 1. Server Requirements

Use a Linux VM or cloud instance with:

- Docker Engine
- Docker Compose plugin
- Open inbound port `80`
- Optional domain pointing to the server IP

For HTTPS, put this stack behind a managed load balancer, Cloudflare, Caddy, Traefik, or Certbot-enabled Nginx.

## 2. Configure Environment

From the project root:

```bash
cp .env.production.example .env.production
```

Edit `.env.production` and replace:

- `APP_DOMAIN`
- `FRONTEND_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SOCKET_URL`
- `POSTGRES_PASSWORD`
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- SMTP values

For a VM without a domain, use:

```txt
FRONTEND_URL=http://YOUR_SERVER_IP
NEXT_PUBLIC_API_URL=http://YOUR_SERVER_IP
NEXT_PUBLIC_SOCKET_URL=http://YOUR_SERVER_IP
```

## 3. Start Production Stack

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

## 4. Create Database Tables

For this scaffold, initialize Prisma with:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend npx prisma db push
```

For a real production lifecycle, create Prisma migrations and use:

```bash
npx prisma migrate deploy
```

## 5. Verify Deployment

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
curl http://YOUR_SERVER_IP/health
```

Open:

```txt
http://YOUR_SERVER_IP
```

## 6. Useful Operations

View logs:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f backend
```

Restart one service:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml restart backend
```

Stop stack:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml down
```

Keep database volumes when stopping. Only remove volumes when you intentionally want to delete data.

