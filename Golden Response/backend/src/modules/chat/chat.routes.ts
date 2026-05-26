import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { conversationController, recentConversationsController } from "./chat.controller.js";
import { conversationParamSchema } from "./chat.validation.js";

export const chatRoutes = Router();

chatRoutes.get("/conversations", requireAuth, recentConversationsController);
chatRoutes.get("/conversations/:userId", requireAuth, validate(conversationParamSchema), conversationController);

