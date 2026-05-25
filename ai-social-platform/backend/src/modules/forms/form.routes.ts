import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { submitFormController } from "./form.controller.js";
import { formSubmissionSchema } from "./form.validation.js";

export const formRoutes = Router();

formRoutes.post("/", validate(formSubmissionSchema), submitFormController);

