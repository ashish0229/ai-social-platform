import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  avatarController,
  followController,
  getProfileController,
  themeController,
  unfollowController,
  updateProfileController
} from "./profile.controller.js";
import { followParamSchema, updateProfileSchema, uploadUrlSchema, usernameParamSchema } from "./profile.validation.js";

export const profileRoutes = Router();

profileRoutes.patch("/me", requireAuth, validate(updateProfileSchema), updateProfileController);
profileRoutes.post("/me/avatar", requireAuth, validate(uploadUrlSchema), avatarController);
profileRoutes.post("/me/theme", requireAuth, validate(uploadUrlSchema), themeController);
profileRoutes.post("/:userId/follow", requireAuth, validate(followParamSchema), followController);
profileRoutes.delete("/:userId/follow", requireAuth, validate(followParamSchema), unfollowController);
profileRoutes.get("/:username", requireAuth, validate(usernameParamSchema), getProfileController);
