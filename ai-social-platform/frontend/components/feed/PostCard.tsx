"use client";

import { motion } from "framer-motion";
import { Flag, Heart, MessageCircle, Trash2 } from "lucide-react";
import { useState } from "react";

type Post = {
  id: string;
  author: { username: string; avatarUrl?: string };
  content: string;
  createdAt: string;
  flagSeverity?: "NONE" | "YELLOW" | "RED";
  _count: { likes: number; comments: number };
};

export function PostCard({ post, canModerate = false, canDelete = false }: { post: Post; canModerate?: boolean; canDelete?: boolean }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post._count.likes);
  const flagClass = post.flagSeverity === "RED" ? "bg-coral" : post.flagSeverity === "YELLOW" ? "bg-gold" : "bg-slate-300";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <header className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src={post.author.avatarUrl ?? "https://api.dicebear.com/8.x/initials/svg?seed=AI"} alt="" className="h-11 w-11 rounded-full border border-slate-200" />
          <div>
            <p className="font-semibold">{post.author.username}</p>
            <p className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium transition hover:border-brand hover:text-brand dark:border-slate-700">Follow</button>
      </header>

      <p className="whitespace-pre-wrap leading-7 text-slate-700 dark:text-slate-200">{post.content}</p>

      <footer className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition hover:bg-rose-50 hover:text-coral dark:hover:bg-rose-950"
            onClick={() => {
              setLiked((value) => !value);
              setLikes((value) => value + (liked ? -1 : 1));
            }}
            title={liked ? "Unlike post" : "Like post"}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} /> {likes}
          </button>
          <button className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition hover:bg-teal-50 hover:text-brand dark:hover:bg-teal-950" title="Comment">
            <MessageCircle size={18} /> {post._count.comments}
          </button>
        </div>
        <div className="flex items-center gap-2">
          {canModerate && <span className={`h-3 w-3 rounded-full ${flagClass}`} title="Moderation indicator" />}
          {canModerate && <button className="rounded-md p-2 transition hover:bg-amber-50 hover:text-gold dark:hover:bg-amber-950" title="Flag post"><Flag size={18} /></button>}
          {canDelete && <button className="rounded-md p-2 transition hover:bg-rose-50 hover:text-coral dark:hover:bg-rose-950" title="Delete post"><Trash2 size={18} /></button>}
        </div>
      </footer>
    </motion.article>
  );
}

