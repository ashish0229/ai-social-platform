import { StatsChart } from "@/components/dashboard/StatsChart";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const points = Array.from({ length: 18 }, (_, index) => ({
  hour: String(index),
  count: Math.round(8 + Math.sin(index / 2) * 6 + index)
}));

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-paper p-4 dark:bg-slate-950">
      <header className="mx-auto mb-6 flex max-w-6xl items-center justify-between">
        <h1 className="text-2xl font-bold">Moderator Dashboard</h1>
        <ThemeToggle />
      </header>
      <section className="mx-auto grid max-w-6xl gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Yellow flags</p>
          <p className="text-3xl font-bold text-gold">18</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Red flags</p>
          <p className="text-3xl font-bold text-coral">7</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Rejected posts</p>
          <p className="text-3xl font-bold">26</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Online users</p>
          <p className="text-3xl font-bold text-brand">213</p>
        </div>
      </section>
      <section className="mx-auto mt-4 max-w-6xl">
        <h2 className="mb-3 text-lg font-semibold">Posts over last 1000 hours</h2>
        <StatsChart points={points} />
      </section>
    </main>
  );
}

