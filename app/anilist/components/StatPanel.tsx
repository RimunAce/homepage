interface StatRow {
  label: string;
  value: string | number;
}

export function StatPanel({ title, stats }: { title: string; stats: StatRow[] }) {
  return (
    <section className="stat-panel">
      <h3 className="stat-title">{title}</h3>
      <div className="stat-rows">
        {stats.map((stat) => (
          <div className="stat-row" key={stat.label}>
            <span>{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
