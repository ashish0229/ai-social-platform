"use client";

import { AnimatePresence } from "framer-motion";
import { Paperclip, Send, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";
import { Message, MessageBubble } from "./MessageBubble";

const emoji = ["🙂", "🔥", "👏", "💡"];

export function ChatWindow({ peer }: { peer: { id: string; username: string; avatarUrl: string } }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", content: "Hey, the moderation dashboard is ready for review.", createdAt: new Date(Date.now() - 120000).toISOString(), mine: false },
    { id: "m2", content: "Great. I will check the yellow queue first.", createdAt: new Date(Date.now() - 60000).toISOString(), mine: true }
  ]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = getSocket();
    socket.connect();
    socket.on("chat:new-message", (message) => {
      setMessages((current) => [...current, { id: message.id, content: message.content, createdAt: message.createdAt, mine: message.senderId !== peer.id, attachmentUrl: message.attachmentUrl }]);
    });
    socket.on("chat:typing", (event) => setTyping(event.senderId === peer.id && event.isTyping));
    return () => {
      socket.off("chat:new-message");
      socket.off("chat:typing");
    };
  }, [peer.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send() {
    if (!draft.trim() && !attachmentUrl) return;
    const message = {
      id: crypto.randomUUID(),
      content: draft,
      createdAt: new Date().toISOString(),
      mine: true,
      attachmentUrl
    };
    setMessages((current) => [...current, message]);
    getSocket().emit("chat:send", { receiverId: peer.id, content: draft, attachmentUrl });
    setDraft("");
    setAttachmentUrl("");
  }

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col bg-slate-50 dark:bg-slate-950">
      <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <img src={peer.avatarUrl} alt="" className="h-11 w-11 rounded-full" />
        <div>
          <p className="font-semibold">{peer.username}</p>
          <p className="text-xs text-brand">online</p>
        </div>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
        </AnimatePresence>
        {typing && <div className="w-fit rounded-full bg-white px-4 py-2 text-sm text-slate-500 shadow-sm dark:bg-slate-800">typing...</div>}
      </div>

      {showEmoji && (
        <div className="flex gap-2 border-t border-slate-200 bg-white px-4 py-2 dark:border-slate-800 dark:bg-slate-900">
          {emoji.map((item) => (
            <button key={item} className="rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setDraft((value) => `${value}${item}`)}>{item}</button>
          ))}
        </div>
      )}

      <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        {attachmentUrl && <p className="mb-2 truncate text-sm text-slate-500">Attached: {attachmentUrl}</p>}
        <div className="flex items-end gap-2">
          <button className="rounded-md p-3 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setShowEmoji((value) => !value)} title="Emoji"><Smile size={20} /></button>
          <label className="rounded-md p-3 hover:bg-slate-100 dark:hover:bg-slate-800" title="Attach file">
            <Paperclip size={20} />
            <input className="hidden" type="file" onChange={(event) => setAttachmentUrl(event.target.files?.[0]?.name ?? "")} />
          </label>
          <textarea
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              getSocket().emit("chat:typing", { receiverId: peer.id, isTyping: true });
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            className="max-h-28 min-h-11 flex-1 resize-none rounded-md border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-950"
            placeholder="Message"
          />
          <button className="rounded-md bg-brand p-3 text-white transition hover:bg-teal-800" onClick={send} title="Send message"><Send size={20} /></button>
        </div>
      </div>
    </section>
  );
}

