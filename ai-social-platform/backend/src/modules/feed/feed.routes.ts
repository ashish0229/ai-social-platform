import { Router } from "express";
import { Role } from "@prisma/client";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  commentController,
  createPostController,
  deletePostController,
  flagController,
  generatePostController,
  likePostController,
  listFeed,
  moderationReviewController,
  unlikePostController
} from "./feed.controller.js";
import {
  commentSchema,
  createGeneratedPostSchema,
  createPostSchema,
  flagSchema,
  moderationReviewSchema,
  postIdSchema
} from "./feed.validation.js";

export const feedRoutes = Router();

feedRoutes.get("/", requireAuth, listFeed);
feedRoutes.post("/generate", requireAuth, validate(createGeneratedPostSchema), generatePostController);
feedRoutes.post("/", requireAuth, validate(createPostSchema), createPostController);
feedRoutes.post("/:postId/like", requireAuth, validate(postIdSchema), likePostController);
feedRoutes.delete("/:postId/like", requireAuth, validate(postIdSchema), unlikePostController);
feedRoutes.post("/:postId/comments", requireAuth, validate(commentSchema), commentController);
feedRoutes.delete("/:postId", requireAuth, validate(postIdSchema), deletePostController);
feedRoutes.patch("/:postId/flag", requireAuth, requireRole(Role.MODERATOR, Role.ADMIN), validate(flagSchema), flagController);
feedRoutes.patch("/:postId/moderate", requireAuth, requireRole(Role.MODERATOR, Role.ADMIN), validate(moderationReviewSchema), moderationReviewController);

