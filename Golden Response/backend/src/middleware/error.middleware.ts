import { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger.js";

export function notFoundHandler(req: Request, res: Response) {
  return res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error: Error, req: Request, res: Response, _next: NextFunction) {
  logger.error("unhandled_error", {
    message: error.message,
    stack: error.stack,
    path: req.originalUrl,
    ip: req.ip,
    userId: req.user?.id
  });

  return res.status(500).json({ error: "Internal server error" });
}

