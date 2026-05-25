import { NextFunction, Request, Response } from "express";
import {
  addComment,
  createGeneratedPost,
  createUserPost,
  deletePost,
  flagPost,
  getFeed,
  likePost,
  moderatePost,
  unlikePost
} from "./feed.service.js";

export async function listFeed(_req: Request, res: Response, next: NextFunction) {
  try {
    return res.json({ posts: await getFeed() });
  } catch (error) {
    return next(error);
  }
}

export async function generatePostController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await createGeneratedPost(req.user!.id, req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function createPostController(req: Request, res: Response, next: NextFunction) {
  try {
    const post = await createUserPost(req.user!.id, req.body);
    return res.status(201).json({ post });
  } catch (error) {
    return next(error);
  }
}

export async function deletePostController(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json(await deletePost(req.user!.id, req.user!.role, req.params.postId));
  } catch (error) {
    return next(error);
  }
}

export async function likePostController(req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(201).json({ like: await likePost(req.user!.id, req.params.postId) });
  } catch (error) {
    return next(error);
  }
}

export async function unlikePostController(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json(await unlikePost(req.user!.id, req.params.postId));
  } catch (error) {
    return next(error);
  }
}

export async function commentController(req: Request, res: Response, next: NextFunction) {
  try {
    const comment = await addComment(req.user!.id, req.params.postId, req.body.content);
    return res.status(201).json({ comment });
  } catch (error) {
    return next(error);
  }
}

export async function flagController(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json({ post: await flagPost(req.params.postId, req.body.severity) });
  } catch (error) {
    return next(error);
  }
}

export async function moderationReviewController(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json({ post: await moderatePost(req.params.postId, req.body.status) });
  } catch (error) {
    return next(error);
  }
}

