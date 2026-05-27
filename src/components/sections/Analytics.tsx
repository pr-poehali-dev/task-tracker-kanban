import Icon from "@/components/ui/icon";
import { analyticsData, projects } from "@/data/mockData";

export default function Analytics() {
  const maxCompleted = Math.max(...analyticsData.tasksCompleted);
  const maxVelocity = Math.max(...analyticsData.velocity);

  const statCards = [
    { label: "Всего задач", value: "156", delta: "+23 за месяц", icon: "CheckSquare", color: "#6366f1" },
    { label: "Среднее время задачи", value: "2.4д", delta: "-0.3 к прошлому", icon: "Clock", color: "#8b5cf6" },
    { label: "Скорость команды", value: "71", delta: "velocity points", icon: "Zap", color: "#06b6d4" },
    { label: "Выполнено вовремя", value: "87%", delta: "+5% за квартал", icon: "Target", color: "#10b981" },
  ];

  const priorityTotal = Object.values(analyticsData.byPriority).reduce((a, b) => a + b, 0);
  const statusTotal = Object.values(analyticsData.byStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="p-6 space-y-5 animate-fade-in overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold">Аналитика</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Отчёты и метрики команды</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-secondary border-none rounded-lg px-3 py-1.5 text-[13px] text-foreground outline-none cursor-pointer">
            <option>За 12 месяцев</option>
            <option>За 6 месяцев</option>
            <option>За 3 месяца</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] text-muted-foreground bg-secondary hover:bg-secondary/80 transition-colors">
            <Icon name="Download" size={14} />
            Экспорт
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className="stat-card bg-card border border-border rounded-xl p-4 hover-lift" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}22` }}>
                <Icon name={s.icon} size={18} style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-[12px] text-muted-foreground">{s.label}</div>
            <div className="text-[11px] mt-1" style={{ color: s.color }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Tasks completed */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold">Закрытые задачи</h3>
            <span className="text-[11px] text-muted-foreground">по месяцам</span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {analyticsData.tasksCompleted.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md hover:opacity-80 transition-opacity cursor-pointer"
                  style={{
                    height: `${(v / maxCompleted) * 110}px`,
                    background: i >= 10 ? "var(--gradient-primary)" : "rgba(99,102,241,0.3)"
                  }}
                  title={`${v} задач`}
                />
                <span className="text-[9px] text-muted-foreground">{analyticsData.months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Velocity */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold">Velocity команды</h3>
            <span className="text-[11px] text-green-400 flex items-center gap-1">
              <Icon name="TrendingUp" size={12} /> +103% за год
            </span>
          </div>
          <div className="relative h-32">
            <svg width="100%" height="100%" viewBox={`0 0 ${analyticsData.velocity.length * 40 - 20} 110`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="vel-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline
                points={analyticsData.velocity.map((v, i) => `${i * 40},${10 + (1 - v / maxVelocity) * 90}`).join(" ")}
                fill="url(#vel-grad)"
                stroke="none"
              />
              <polyline
                points={analyticsData.velocity.map((v, i) => `${i * 40},${10 + (1 - v / maxVelocity) * 90}`).join(" ")}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {analyticsData.velocity.map((v, i) => (
                <circle key={i} cx={i * 40} cy={10 + (1 - v / maxVelocity) * 90} r="3.5" fill="#818cf8" />
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-4">
        {/* By priority */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-[14px] font-semibold mb-4">По приоритету</h3>
          <div className="space-y-3">
            {[
              { key: "critical", label: "Критичные", color: "#ef4444" },
              { key: "high", label: "Высокий", color: "#f97316" },
              { key: "medium", label: "Средний", color: "#f59e0b" },
              { key: "low", label: "Низкий", color: "#64748b" },
            ].map(({ key, label, color }) => {
              const val = analyticsData.byPriority[key as keyof typeof analyticsData.byPriority];
              const pct = Math.round((val / priorityTotal) * 100);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-muted-foreground">{label}</span>
                    <span className="text-[12px] font-medium text-foreground">{val} <span className="text-muted-foreground">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By status */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-[14px] font-semibold mb-4">По статусу</h3>
          <div className="space-y-3">
            {[
              { key: "todo", label: "К выполнению", color: "#94a3b8" },
              { key: "inProgress", label: "В работе", color: "#818cf8" },
              { key: "review", label: "На проверке", color: "#fbbf24" },
              { key: "done", label: "Готово", color: "#4ade80" },
            ].map(({ key, label, color }) => {
              const val = analyticsData.byStatus[key as keyof typeof analyticsData.byStatus];
              const pct = Math.round((val / statusTotal) * 100);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-muted-foreground">{label}</span>
                    <span className="text-[12px] font-medium text-foreground">{val} <span className="text-muted-foreground">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Projects performance */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-[14px] font-semibold mb-4">Проекты</h3>
          <div className="space-y-3">
            {projects.map(p => (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-[12px] text-muted-foreground truncate max-w-[110px]">{p.name}</span>
                  </div>
                  <span className="text-[12px] font-medium text-foreground">{p.progress}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${p.progress}%`, background: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
