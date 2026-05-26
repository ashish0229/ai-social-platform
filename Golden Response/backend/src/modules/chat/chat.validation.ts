import { z } from "zod";

export const conversationParamSchema = z.object({
  params: z.object({
    userId: z.string().uuid()
  })
});

