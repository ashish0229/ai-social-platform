import { Queue } from "bullmq";
import { redis } from "../config/redis.js";

export const moderationQueue = new Queue("moderation", {
  connection: redis
});

