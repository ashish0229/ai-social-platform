# Render Deploy Link

This repository includes a Render Blueprint at the project root:

```txt
render.yaml
```

Render Blueprints create multiple resources from one repo, including web services, PostgreSQL, and Key Value/Redis.

## Deploy Link Format

After you push this project to GitHub, use this link:

```txt
https://render.com/deploy?repo=https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
```

Example:

```txt
https://render.com/deploy?repo=https://github.com/acme/ai-social-platform
```

## README Badge

Replace `YOUR_USERNAME/YOUR_REPO_NAME` in this Markdown:

```md
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/YOUR_USERNAME/YOUR_REPO_NAME)
```

## Important Render Values

The Blueprint uses these default service URLs:

```txt
Frontend: https://ai-social-platform-frontend.onrender.com
Backend:  https://ai-social-platform-backend.onrender.com
AI:       https://ai-social-platform-ai.onrender.com
```

If Render changes a service URL because the name is already taken, update:

- Backend `FRONTEND_URL`
- Frontend `NEXT_PUBLIC_API_URL`
- Frontend `NEXT_PUBLIC_SOCKET_URL`

## Secrets Prompted During Deploy

Render will ask for:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `MAIL_FROM`
- `PORTFOLIO_OWNER_EMAIL`

JWT secrets are generated automatically.

