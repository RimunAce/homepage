interface StatRow {
  label: string;
  value: string | number;
}

export function StatPanel({ title, stats }: { title: string; stats: StatRow[] }) {
  return (
    <div className="p-4 bg-retro-gray border-2 border-retro-black">
      <h3 className="retro-heading text-sm mb-3">{title}</h3>
      <div className="space-y-1 retro-text text-xs">
        {stats.map((stat) => (
          <div className="flex justify-between" key={stat.label}>
            <span>{stat.label}</span>
            <span className="font-bold">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
