import http from "node:http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { registerChatSocket } from "./modules/chat/chat.socket.js";

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: env.FRONTEND_URL.split(",").map((origin) => origin.trim()),
    credentials: true
  }
});

registerChatSocket(io);

httpServer.listen(env.PORT, () => {
  logger.info("server_started", { port: env.PORT });
});

