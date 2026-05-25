import fs from "node:fs";
import path from "node:path";
import winston from "winston";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const redact = winston.format((info) => {
  const payload = info.payload as Record<string, unknown> | undefined;
  if (payload) {
    for (const key of ["password", "passwordHash", "confirmPassword", "token", "authorization"]) {
      if (key in payload) payload[key] = "[REDACTED]";
    }
  }
  return info;
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    redact(),
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, "app.log") }),
    new winston.transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
    new winston.transports.Console({ silent: process.env.NODE_ENV === "test" })
  ]
});

