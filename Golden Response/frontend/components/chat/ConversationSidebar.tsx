"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

type Conversation = {
  id: string;
  username: string;
  avatarUrl: string;
  preview: string;
  unread: number;
};

export function ConversationSidebar({ conversations, activeId, onSelect }: {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => conversations.filter((conversation) => conversation.username.toLowerCase().includes(query.toLowerCase())),
    [conversations, query]
  );

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:w-80">
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-md border border-slate-300 py-2 pl-10 pr-3 dark:border-slate-700 dark:bg-slate-950" placeholder="Search chats" />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {filtered.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${activeId === conversation.id ? "bg-teal-50 dark:bg-teal-950" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <img src={conversation.avatarUrl} alt="" className="h-11 w-11 rounded-full" />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{conversation.username}</span>
              <span className="block truncate text-sm text-slate-500">{conversation.preview}</span>
            </span>
            {conversation.unread > 0 && <span className="rounded-full bg-coral px-2 py-1 text-xs font-semibold text-white">{conversation.unread}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
}

