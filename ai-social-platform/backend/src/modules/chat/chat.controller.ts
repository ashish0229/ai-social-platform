import { NextFunction, Request, Response } from "express";
import { getConversation, getRecentConversations } from "./chat.service.js";

export async function recentConversationsController(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json({ conversations: await getRecentConversations(req.user!.id) });
  } catch (error) {
    return next(error);
  }
}

export async function conversationController(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json({ messages: await getConversation(req.user!.id, req.params.userId) });
  } catch (error) {
    return next(error);
  }
}

