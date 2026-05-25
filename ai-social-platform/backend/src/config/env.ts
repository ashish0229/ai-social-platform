import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1).default("redis://localhost:6379"),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  AI_SERVICE_HOSTPORT: z.string().optional(),
  AI_SERVICE_URL: z.string().url().default("http://localhost:8001"),
  SMTP_HOST: z.string().default("localhost"),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().default("no-reply@ai-social.local"),
  PORTFOLIO_OWNER_EMAIL: z.string().email().default("owner@example.com")
});

const rawEnv = { ...process.env };

if (!rawEnv.AI_SERVICE_URL && rawEnv.AI_SERVICE_HOSTPORT) {
  rawEnv.AI_SERVICE_URL = `http://${rawEnv.AI_SERVICE_HOSTPORT}`;
}

export const env = envSchema.parse(rawEnv);
