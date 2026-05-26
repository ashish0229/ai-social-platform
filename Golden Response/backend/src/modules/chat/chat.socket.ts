import { Server, Socket } from "socket.io";
import { verifyAccessToken } from "../../lib/jwt.js";
import { logger } from "../../lib/logger.js";
import { prisma } from "../../lib/prisma.js";
import { createMessage } from "./chat.service.js";

type ChatPayload = {
  receiverId: string;
  content: string;
  attachmentUrl?: string;
};

function authenticate(socket: Socket) {
  const token = socket.handshake.auth?.token as string | undefined;
  if (!token) return null;

  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

export function registerChatSocket(io: Server) {
  io.use((socket, next) => {
    const user = authenticate(socket);
    if (!user) return next(new Error("Unauthorized"));
    socket.data.user = user;
    return next();
  });

  io.on("connection", async (socket) => {
    const user = socket.data.user;
    socket.join(user.sub);

    await prisma.user.update({
      where: { id: user.sub },
      data: { isOnline: true, lastSeenAt: new Date() }
    });

    socket.on("chat:typing", (payload: { receiverId: string; isTyping: boolean }) => {
      io.to(payload.receiverId).emit("chat:typing", {
        senderId: user.sub,
        isTyping: payload.isTyping
      });
    });

    socket.on("chat:send", async (payload: ChatPayload, callback?: (response: unknown) => void) => {
      try {
        const message = await createMessage({
          senderId: user.sub,
          receiverId: payload.receiverId,
          content: payload.content,
          attachmentUrl: payload.attachmentUrl
        });

        io.to(payload.receiverId).emit("chat:new-message", message);
        io.to(user.sub).emit("chat:new-message", message);
        callback?.({ ok: true, message });
      } catch (error) {
        logger.error("socket_message_error", { error });
        callback?.({ ok: false });
      }
    });

    socket.on("chat:read", async (payload: { senderId: string }) => {
      await prisma.message.updateMany({
        where: {
          senderId: payload.senderId,
          receiverId: user.sub,
          readAt: null
        },
        data: { readAt: new Date() }
      });
    });

    socket.on("disconnect", async () => {
      await prisma.user.update({
        where: { id: user.sub },
        data: { isOnline: false, lastSeenAt: new Date() }
      });
    });
  });
}

