import express from "express";
import helmet from "helmet";
import { apiRateLimit } from "./middleware/rateLimit.middleware.js";
import { corsMiddleware } from "./config/cors.js";
import { requestLogger } from "./middleware/requestLogger.middleware.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { feedRoutes } from "./modules/feed/feed.routes.js";
import { profileRoutes } from "./modules/profile/profile.routes.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes.js";
import { formRoutes } from "./modules/forms/form.routes.js";
import { chatRoutes } from "./modules/chat/chat.routes.js";

export const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json({ limit: "1mb" }));
app.use(apiRateLimit);
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/forms/submit", formRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

