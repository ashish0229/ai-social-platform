import { z } from "zod";

export const createGeneratedPostSchema = z.object({
  body: z.object({
    topic: z.string().min(2).max(120),
    tone: z.string().min(2).max(60),
    platform: z.string().min(2).max(60),
    context: z.string().min(2).max(1000)
  })
});

export const createPostSchema = z.object({
  body: z.object({
    topic: z.string().min(2).max(120).default("User post"),
    tone: z.string().min(2).max(60).default("natural"),
    platform: z.string().min(2).max(60).default("social"),
    context: z.string().min(2).max(1000).default(""),
    content: z.string().min(1).max(4000)
  })
});

export const postIdSchema = z.object({
  params: z.object({
    postId: z.string().uuid()
  })
});

export const commentSchema = postIdSchema.extend({
  body: z.object({
    content: z.string().min(1).max(1000)
  })
});

export const flagSchema = postIdSchema.extend({
  body: z.object({
    severity: z.enum(["YELLOW", "RED"])
  })
});

export const moderationReviewSchema = postIdSchema.extend({
  body: z.object({
    status: z.enum(["PUBLISHED", "QUARANTINED", "REJECTED"])
  })
});

