import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import { mailTransporter } from "../config/mail.js";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

export const emailWorker = new Worker(
  "email",
  async (job) => {
    await mailTransporter.sendMail({
      from: env.MAIL_FROM,
      to: env.PORTFOLIO_OWNER_EMAIL,
      subject: job.data.subject,
      text: job.data.text
    });
  },
  { connection: redis }
);

emailWorker.on("failed", (job, error) => {
  logger.error("email_job_failed", { jobId: job?.id, error });
});

