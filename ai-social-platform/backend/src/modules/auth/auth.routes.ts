import { Router } from "express";
import { authRateLimit } from "../../middleware/rateLimit.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { login, me, refresh, register } from "./auth.controller.js";
import { loginSchema, refreshSchema, registerSchema } from "./auth.validation.js";

export const authRoutes = Router();

authRoutes.post("/register", authRateLimit, validate(registerSchema), register);
authRoutes.post("/login", authRateLimit, validate(loginSchema), login);
authRoutes.post("/refresh-token", validate(refreshSchema), refresh);
authRoutes.post("/logout", requireAuth, (_req, res) => res.json({ ok: true }));
authRoutes.get("/me", requireAuth, me);

