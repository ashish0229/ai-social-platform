"use client";

import { useState } from "react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const conversations = [
  { id: "u1", username: "Maya", avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=Maya", preview: "Dashboard review is ready", unread: 2 },
  { id: "u2", username: "Samir", avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=Samir", preview: "Post was quarantined", unread: 0 },
  { id: "u3", username: "Nia", avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=Nia", preview: "Can you check this rule?", unread: 1 }
];

export default function ChatPage() {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const active = conversations.find((conversation) => conversation.id === activeId) ?? conversations[0];

  return (
    <main className="flex h-screen flex-col bg-paper dark:bg-slate-950">
      <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-bold">Messages</h1>
        <ThemeToggle />
      </nav>
      <div className="grid min-h-0 flex-1 md:grid-cols-[20rem_1fr]">
        <ConversationSidebar conversations={conversations} activeId={activeId} onSelect={setActiveId} />
        <ChatWindow peer={{ id: active.id, username: active.username, avatarUrl: active.avatarUrl }} />
      </div>
    </main>
  );
}

