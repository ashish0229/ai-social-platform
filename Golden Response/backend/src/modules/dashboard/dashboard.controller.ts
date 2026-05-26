import { NextFunction, Request, Response } from "express";
import { getDashboardStats } from "./dashboard.service.js";

export async function dashboardStatsController(_req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await getDashboardStats();
    return res.json(stats);
  } catch (error) {
    return next(error);
  }
}

