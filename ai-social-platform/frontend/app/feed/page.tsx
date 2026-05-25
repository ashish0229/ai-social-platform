import { PostCard } from "@/components/feed/PostCard";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const posts = [
  {
    id: "1",
    author: { username: "maya", avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=Maya" },
    content: "AI drafted this launch post, moderation cleared it, and it is now live in the feed.",
    createdAt: new Date().toISOString(),
    flagSeverity: "NONE" as const,
    _count: { likes: 42, comments: 8 }
  },
  {
    id: "2",
    author: { username: "samir", avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=Samir" },
    content: "This scroll feed is designed for fast scanning, quick reactions, and moderator visibility.",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    flagSeverity: "YELLOW" as const,
    _count: { likes: 18, comments: 3 }
  }
];

export default function FeedPage() {
  return (
    <main className="min-h-screen bg-paper dark:bg-slate-950">
      <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-xl font-bold">AI Social Feed</h1>
          <ThemeToggle />
        </div>
      </nav>
      <section className="mx-auto grid max-w-4xl gap-4 px-4 py-6">
        <form className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-3 md:grid-cols-3">
            <input className="rounded-md border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-950" placeholder="Topic" />
            <input className="rounded-md border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-950" placeholder="Tone" />
            <input className="rounded-md border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-950" placeholder="Platform" />
          </div>
          <textarea className="mt-3 h-24 w-full rounded-md border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-950" placeholder="Context for AI generation or manual post" />
          <div className="mt-3 flex justify-end gap-2">
            <button className="rounded-md border border-slate-200 px-4 py-2 font-medium dark:border-slate-700">Generate</button>
            <button className="rounded-md bg-brand px-4 py-2 font-semibold text-white">Publish</button>
          </div>
        </form>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} canModerate canDelete />
        ))}
      </section>
    </main>
  );
}

