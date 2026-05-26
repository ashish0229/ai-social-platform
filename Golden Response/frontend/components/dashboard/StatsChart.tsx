type Point = {
  hour: string;
  count: number;
};

export function StatsChart({ points }: { points: Point[] }) {
  const width = 640;
  const height = 220;
  const max = Math.max(1, ...points.map((point) => point.count));
  const path = points
    .map((point, index) => {
      const x = (index / Math.max(1, points.length - 1)) * width;
      const y = height - (point.count / max) * height;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <path d={path} fill="none" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

