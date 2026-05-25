param(
  [string]$EnvFile = ".env.production"
)

docker compose --env-file $EnvFile -f docker-compose.prod.yml up -d --build
docker compose --env-file $EnvFile -f docker-compose.prod.yml exec backend npx prisma db push
docker compose --env-file $EnvFile -f docker-compose.prod.yml ps

