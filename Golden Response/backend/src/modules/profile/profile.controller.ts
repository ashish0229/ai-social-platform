import { NextFunction, Request, Response } from "express";
import { followUser, getProfile, unfollowUser, updateProfile } from "./profile.service.js";

export async function getProfileController(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json({ profile: await getProfile(req.params.username, req.user?.id) });
  } catch (error) {
    return next(error);
  }
}

export async function updateProfileController(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json({ profile: await updateProfile(req.user!.id, req.body) });
  } catch (error) {
    return next(error);
  }
}

export async function avatarController(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json({ profile: await updateProfile(req.user!.id, { avatarUrl: req.body.url }) });
  } catch (error) {
    return next(error);
  }
}

export async function themeController(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json({ profile: await updateProfile(req.user!.id, { themeUrl: req.body.url }) });
  } catch (error) {
    return next(error);
  }
}

export async function followController(req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(201).json({ follow: await followUser(req.user!.id, req.params.userId) });
  } catch (error) {
    return next(error);
  }
}

export async function unfollowController(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json(await unfollowUser(req.user!.id, req.params.userId));
  } catch (error) {
    return next(error);
  }
}

