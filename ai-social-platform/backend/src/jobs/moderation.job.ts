import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import { logger } from "../lib/logger.js";
import { classifyAndModerate } from "../modules/moderation/moderation.service.js";
import { prisma } from "../lib/prisma.js";

export const moderationWorker = new Worker(
  "moderation",
  async (job) => {
    const moderation = await classifyAndModerate(job.data.content);
    await prisma.post.update({
      where: { id: job.data.postId },
      data: {
        status: moderation.status,
        flagSeverity: moderation.flagSeverity,
        toxicityScore: moderation.toxicityScore,
        rejectionReason: moderation.rejectionReason
      }
    });
  },
  { connection: redis }
);

moderationWorker.on("failed", (job, error) => {
  logger.error("moderation_job_failed", { jobId: job?.id, error });
});

