import { FlagSeverity, PostStatus, Role } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { sanitizeText } from "../../lib/sanitize.js";
import { classifyAndModerate, generateAndModerate } from "../moderation/moderation.service.js";

async function createModerationLog(postId: string, moderation: {
  appliedRule: string;
  flagSeverity: FlagSeverity;
  action: string;
  toxicityScore: number;
}) {
  await prisma.moderationLog.create({
    data: {
      postId,
      rule: moderation.appliedRule,
      severity: moderation.flagSeverity,
      action: moderation.action,
      score: moderation.toxicityScore
    }
  });
}

export async function getFeed() {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, username: true, avatarUrl: true } },
      _count: { select: { likes: true, comments: true } }
    },
    take: 50
  });
}

export async function createGeneratedPost(authorId: string, input: {
  topic: string;
  tone: string;
  platform: string;
  context: string;
}) {
  const result = await generateAndModerate(input);
  const post = await prisma.post.create({
    data: {
      authorId,
      topic: sanitizeText(input.topic),
      tone: sanitizeText(input.tone),
      platform: sanitizeText(input.platform),
      context: sanitizeText(input.context),
      content: sanitizeText(result.content),
      status: result.moderation.status,
      flagSeverity: result.moderation.flagSeverity,
      toxicityScore: result.moderation.toxicityScore,
      rejectionReason: result.moderation.rejectionReason
    }
  });

  await createModerationLog(post.id, result.moderation);
  return { post, intent: result.intent };
}

export async function createUserPost(authorId: string, input: {
  topic: string;
  tone: string;
  platform: string;
  context: string;
  content: string;
}) {
  const content = sanitizeText(input.content);
  const moderation = await classifyAndModerate(content);
  const post = await prisma.post.create({
    data: {
      authorId,
      topic: sanitizeText(input.topic),
      tone: sanitizeText(input.tone),
      platform: sanitizeText(input.platform),
      context: sanitizeText(input.context),
      content,
      status: moderation.status,
      flagSeverity: moderation.flagSeverity,
      toxicityScore: moderation.toxicityScore,
      rejectionReason: moderation.rejectionReason
    }
  });

  await createModerationLog(post.id, moderation);
  return post;
}

export async function deletePost(userId: string, role: Role, postId: string) {
  const post = await prisma.post.findUniqueOrThrow({ where: { id: postId } });
  if (role !== "ADMIN" && post.authorId !== userId) {
    throw new Error("Only admins or post owners can delete this post");
  }

  await prisma.post.delete({ where: { id: postId } });
  return { ok: true };
}

export async function likePost(userId: string, postId: string) {
  return prisma.like.upsert({
    where: { postId_userId: { postId, userId } },
    update: {},
    create: { postId, userId }
  });
}

export async function unlikePost(userId: string, postId: string) {
  await prisma.like.deleteMany({ where: { postId, userId } });
  return { ok: true };
}

export async function addComment(userId: string, postId: string, content: string) {
  const safeContent = sanitizeText(content);
  const moderation = await classifyAndModerate(safeContent);
  if (moderation.status === "REJECTED") {
    throw new Error("Comment rejected by moderation");
  }

  return prisma.comment.create({
    data: {
      authorId: userId,
      postId,
      content: safeContent
    }
  });
}

export async function flagPost(postId: string, severity: FlagSeverity) {
  return prisma.post.update({
    where: { id: postId },
    data: {
      flagSeverity: severity,
      status: severity === "RED" ? "REJECTED" : "QUARANTINED"
    }
  });
}

export async function moderatePost(postId: string, status: PostStatus) {
  return prisma.post.update({
    where: { id: postId },
    data: {
      status,
      flagSeverity: status === "PUBLISHED" ? "NONE" : status === "REJECTED" ? "RED" : "YELLOW"
    }
  });
}

