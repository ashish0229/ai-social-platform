import { z } from "zod";

export const registerSchema = z.object({
  body: z
    .object({
      username: z.string().min(3).max(32),
      email: z.string().email(),
      role: z.enum(["USER", "MODERATOR", "ADMIN"]).default("USER"),
      password: z.string().min(8),
      confirmPassword: z.string().min(8)
    })
    .refine((body) => body.password === body.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"]
    })
});

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(32),
    email: z.string().email(),
    password: z.string().min(8)
  })
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(20)
  })
});

