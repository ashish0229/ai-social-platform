import { prisma } from "../../lib/prisma.js";
import { sanitizeText } from "../../lib/sanitize.js";

export async function getConversation(userId: string, peerId: string) {
  return prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: peerId },
        { senderId: peerId, receiverId: userId }
      ]
    },
    orderBy: { createdAt: "asc" },
    take: 100
  });
}

export async function getRecentConversations(userId: string) {
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }]
    },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, username: true, avatarUrl: true } },
      receiver: { select: { id: true, username: true, avatarUrl: true } }
    },
    take: 50
  });

  const seen = new Set<string>();
  return messages.filter((message) => {
    const peerId = message.senderId === userId ? message.receiverId : message.senderId;
    if (seen.has(peerId)) return false;
    seen.add(peerId);
    return true;
  });
}

export async function createMessage(input: {
  senderId: string;
  receiverId: string;
  content: string;
  attachmentUrl?: string;
}) {
  return prisma.message.create({
    data: {
      senderId: input.senderId,
      receiverId: input.receiverId,
      content: sanitizeText(input.content),
      attachmentUrl: input.attachmentUrl
    },
    include: {
      sender: { select: { id: true, username: true, avatarUrl: true } },
      receiver: { select: { id: true, username: true, avatarUrl: true } }
    }
  });
}

