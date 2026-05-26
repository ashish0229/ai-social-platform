"use client";

import { motion } from "framer-motion";

export type Message = {
  id: string;
  content: string;
  createdAt: string;
  mine: boolean;
  attachmentUrl?: string;
};

export function MessageBubble({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${message.mine ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[76%] rounded-2xl px-4 py-2 shadow-sm ${message.mine ? "rounded-br-md bg-brand text-white" : "rounded-bl-md bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100"}`}>
        {message.attachmentUrl && <a className="mb-1 block text-sm underline" href={message.attachmentUrl}>Attachment</a>}
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className={`mt-1 text-right text-[11px] ${message.mine ? "text-teal-50" : "text-slate-500"}`}>{new Date(message.createdAt).toLocaleTimeString()}</p>
      </div>
    </motion.div>
  );
}

