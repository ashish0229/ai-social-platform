import { Router } from "express";
import { Role } from "@prisma/client";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { dashboardStatsController } from "./dashboard.controller.js";

export const dashboardRoutes = Router();

dashboardRoutes.use(requireAuth, requireRole(Role.MODERATOR, Role.ADMIN));
dashboardRoutes.get("/stats", dashboardStatsController);
dashboardRoutes.get("/posts-over-time", dashboardStatsController);
dashboardRoutes.get("/flagged-posts", dashboardStatsController);
dashboardRoutes.get("/user-activity", dashboardStatsController);

