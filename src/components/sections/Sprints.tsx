import Icon from "@/components/ui/icon";
import { sprints } from "@/data/mockData";

export default function Sprints() {
  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold">Спринты</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Планирование и отслеживание итераций</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-white hover:opacity-90 transition-all" style={{ background: "var(--gradient-primary)" }}>
          <Icon name="Plus" size={14} />
          Новый спринт
        </button>
      </div>

      {sprints.map((sprint, si) => {
        const isActive = sprint.status === "active";
        const maxBurn = sprint.totalTasks;

        return (
          <div key={sprint.id} className="bg-card border border-border rounded-xl overflow-hidden hover-lift animate-fade-in" style={{ animationDelay: `${si * 80}ms` }}>
            {/* Sprint header */}
            <div className="p-5 border-b border-border/60">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${isActive ? "bg-primary/15 text-primary" : "bg-green-500/15 text-green-400"}`}>
                    {isActive ? "🔥 Активный" : "✅ Завершён"}
                  </div>
                  <h3 className="text-[15px] font-bold">{sprint.name}</h3>
                  <span className="text-[12px] text-muted-foreground">{sprint.team}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <Icon name="Edit2" size={14} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <Icon name="MoreHorizontal" size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <Icon name="Calendar" size={13} />
                  <span>{sprint.startDate} — {sprint.endDate}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <Icon name="Zap" size={13} />
                  <span>Velocity: <span className="text-foreground font-medium">{sprint.velocity}</span></span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <Icon name="CheckSquare" size={13} />
                  <span>{sprint.doneTasks} / {sprint.totalTasks} задач</span>
                </div>
              </div>
            </div>

            {/* Progress + Burndown */}
            <div className="p-5 grid grid-cols-2 gap-6">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] text-muted-foreground">Прогресс спринта</span>
                  <span className="text-[14px] font-bold gradient-text">{sprint.progress}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full sprint-progress"
                    style={{ width: `${sprint.progress}%` }}
                  />
                </div>

                {/* Task breakdown */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { label: "Завершено", value: sprint.doneTasks, color: "#4ade80" },
                    { label: "Осталось", value: sprint.totalTasks - sprint.doneTasks, color: "#818cf8" },
                  ].map(stat => (
                    <div key={stat.label} className="bg-secondary/50 rounded-lg p-3">
                      <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Burndown chart */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] text-muted-foreground">Burndown chart</span>
                </div>
                <div className="relative h-20">
                  <svg width="100%" height="100%" viewBox={`0 0 ${sprint.burndown.length * 30} 80`} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`grad-${sprint.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Ideal line */}
                    <line
                      x1="0" y1="4"
                      x2={`${(sprint.burndown.length - 1) * 30}`} y2="76"
                      stroke="#ffffff15"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    {/* Area */}
                    <polyline
                      points={sprint.burndown.map((v, i) => `${i * 30},${4 + (1 - v / maxBurn) * 72}`).join(" ")}
                      fill={`url(#grad-${sprint.id})`}
                      stroke="none"
                    />
                    {/* Line */}
                    <polyline
                      points={sprint.burndown.map((v, i) => `${i * 30},${4 + (1 - v / maxBurn) * 72}`).join(" ")}
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Dots */}
                    {sprint.burndown.map((v, i) => (
                      <circle key={i} cx={i * 30} cy={4 + (1 - v / maxBurn) * 72} r="3" fill="#818cf8" />
                    ))}
                  </svg>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground">{sprint.startDate}</span>
                  <span className="text-[10px] text-muted-foreground">{sprint.endDate}</span>
                </div>
              </div>
            </div>

            {isActive && (
              <div className="px-5 pb-5">
                <button className="w-full py-2 rounded-lg border border-dashed border-border text-[12px] text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                  + Добавить задачу в спринт
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
