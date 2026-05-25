import { env } from "../../config/env.js";
import { mailTransporter } from "../../config/mail.js";
import { logger } from "../../lib/logger.js";
import { prisma } from "../../lib/prisma.js";
import { sanitizeText } from "../../lib/sanitize.js";

export async function submitContactForm(input: {
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp?: string;
  ipAddress?: string;
}) {
  const safe = {
    name: sanitizeText(input.name),
    email: sanitizeText(input.email),
    phone: sanitizeText(input.phone),
    message: sanitizeText(input.message),
    createdAt: input.timestamp ? new Date(input.timestamp) : new Date()
  };

  logger.info("form_submission", {
    ip: input.ipAddress,
    payload: safe
  });

  const submission = await prisma.formSubmission.create({
    data: {
      name: safe.name,
      email: safe.email,
      phone: safe.phone,
      message: safe.message,
      ipAddress: input.ipAddress,
      createdAt: safe.createdAt
    }
  });

  await mailTransporter.sendMail({
    from: env.MAIL_FROM,
    to: env.PORTFOLIO_OWNER_EMAIL,
    subject: "New secure form submission",
    text: [
      `Name: ${safe.name}`,
      `Email: ${safe.email}`,
      `Phone: ${safe.phone}`,
      `Message: ${safe.message}`,
      `Timestamp: ${safe.createdAt.toISOString()}`
    ].join("\n")
  });

  return submission;
}

