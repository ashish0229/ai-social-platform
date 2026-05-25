import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser, refreshAccessToken } from "./auth.service.js";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await loginUser(req.body);
    return res.json(result);
  } catch {
    return res.status(401).json({ error: "Invalid credentials" });
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await refreshAccessToken(req.body.refreshToken);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function me(req: Request, res: Response) {
  return res.json({ user: req.user });
}

