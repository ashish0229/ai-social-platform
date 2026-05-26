import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { PostCard } from "@/components/feed/PostCard";

const posts = [
  {
    id: "p1",
    author: { username: "maya", avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=Maya" },
    content: "Newest profile post appears first.",
    createdAt: new Date().toISOString(),
    flagSeverity: "NONE" as const,
    _count: { likes: 12, comments: 2 }
  }
];

export default function ProfilePage({ params }: { params: { username: string } }) {
  return (
    <main className="min-h-screen bg-paper dark:bg-slate-950">
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-5xl items-start justify-between gap-4 px-4 py-6">
          <div className="flex gap-4">
            <img src={`https://api.dicebear.com/8.x/initials/svg?seed=${params.username}`} alt="" className="h-24 w-24 rounded-full border border-slate-200" />
            <div>
              <h1 className="text-2xl font-bold">{params.username}</h1>
              <p className="mt-1 max-w-xl text-slate-600 dark:text-slate-300">Editable bio for this user profile.</p>
              <div className="mt-3 flex gap-4 text-sm">
                <span><strong>128</strong> followers</span>
                <span><strong>94</strong> following</span>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 py-6 md:grid-cols-[18rem_1fr]">
        <form className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 font-semibold">Edit Profile</h2>
          <input className="mb-3 w-full rounded-md border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-950" defaultValue={params.username} />
          <textarea className="mb-3 h-24 w-full rounded-md border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-950" defaultValue="Editable bio for this user profile." />
          <label className="mb-3 block text-sm">
            Profile picture
            <input className="mt-1 w-full text-sm" type="file" accept="image/*" />
          </label>
          <label className="mb-4 block text-sm">
            Feed background theme
            <input className="mt-1 w-full text-sm" type="file" accept="image/*" />
          </label>
          <div className="flex gap-2">
            <button className="rounded-md bg-brand px-4 py-2 font-semibold text-white">Save</button>
            <button className="rounded-md border border-slate-200 px-4 py-2 font-semibold dark:border-slate-700">Follow</button>
          </div>
        </form>
        <div className="grid gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} canDelete />
          ))}
        </div>
      </section>
    </main>
  );
}

