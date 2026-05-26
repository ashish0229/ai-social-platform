import { z } from "zod";

export const usernameParamSchema = z.object({
  params: z.object({
    username: z.string().min(3).max(32)
  })
});

export const updateProfileSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(32).optional(),
    bio: z.string().max(500).optional(),
    avatarUrl: z.string().url().optional(),
    themeUrl: z.string().url().optional()
  })
});

export const followParamSchema = z.object({
  params: z.object({
    userId: z.string().uuid()
  })
});

export const uploadUrlSchema = z.object({
  body: z.object({
    url: z.string().url()
  })
});

