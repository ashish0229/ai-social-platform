import cors from "cors";
import { env } from "./env.js";

export const corsMiddleware = cors({
  origin: env.FRONTEND_URL.split(",").map((origin) => origin.trim()),
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
});

