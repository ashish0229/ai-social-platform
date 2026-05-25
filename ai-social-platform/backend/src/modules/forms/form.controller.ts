import { NextFunction, Request, Response } from "express";
import { submitContactForm } from "./form.service.js";

export async function submitFormController(req: Request, res: Response, next: NextFunction) {
  try {
    const submission = await submitContactForm({
      ...req.body,
      ipAddress: req.ip
    });

    return res.status(201).json({
      ok: true,
      id: submission.id
    });
  } catch (error) {
    return next(error);
  }
}

