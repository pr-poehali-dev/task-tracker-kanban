import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { getProjects, getMembers, getTasks, type Project, type Member, type Task } from "@/lib/api";
import { notifications, analyticsData } from "@/data/mockData";

interface DashboardProps {
  onSectionChange: (s: string) => void;
}

export default function Dashboard({ onSectionChange }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProjects(), getMembers(), getTasks()]).then(([p, m, t]) => {
      setProjects(p);
      setMembers(m);
      setTasks(t);
      setLoading(false);
    });
  }, []);

  const activeCount = tasks.filter(t => t.status !== "done").length;
  const inProgressCount = tasks.filter(t => t.status === "inProgress").length;
  const doneCount = tasks.filter(t => t.status === "done").length;
  const donePercent = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;
  const onlineCount = members.filter(m => m.online).length;

  const stats = [
    { label: "Активных задач", value: loading ? "—" : String(activeCount), delta: `${tasks.length} всего`, icon: "CheckSquare", color: "#6366f1" },
    { label: "В работе", value: loading ? "—" : String(inProgressCount), delta: "задач сейчас", icon: "Clock", color: "#8b5cf6" },
    { label: "Участников", value: loading ? "—" : String(members.length), delta: `${onlineCount} онлайн`, icon: "Users", color: "#06b6d4" },
    { label: "Выполнено", value: loading ? "—" : `${donePercent}%`, delta: `${doneCount} задач`, icon: "TrendingUp", color: "#10b981" },
  ];

  const lastMonths = analyticsData.months.slice(-6);
  const lastVelocity = analyticsData.velocity.slice(-6);
  const maxV = Math.max(...lastVelocity);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="stat-card bg-card border border-border rounded-xl p-4 hover-lift" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}22` }}>
                <Icon name={s.icon} size={18} style={{ color: s.color }} />
              </div>
              <span className="text-[11px] text-muted-foreground">{s.delta}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-[12px] text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Projects */}
        <div className="col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold">Проекты</h3>
            <button onClick={() => onSectionChange("kanban")} className="text-[12px] text-primary hover:underline">Все проекты</button>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => <div key={i} className="h-12 bg-secondary/50 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer" onClick={() => onSectionChange("kanban")}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-[13px]" style={{ background: p.color }}>
                    {p.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-medium text-foreground truncate">{p.name}</span>
                      <span className="text-[12px] text-muted-foreground ml-2 flex-shrink-0">{p.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full sprint-progress transition-all" style={{ width: `${p.progress}%`, background: p.color }} />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[12px] text-muted-foreground">{p.tasks} задач</div>
                    <div className="text-[11px] text-muted-foreground">{p.members} чел.</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold">Активность</h3>
            <Icon name="Activity" size={15} className="text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {notifications.slice(0, 4).map((n) => (
              <div key={n.id} className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 text-white" style={{ background: n.color }}>
                  {n.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-foreground leading-relaxed line-clamp-2">{n.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart + Team */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold">Velocity команды</h3>
            <span className="text-[11px] text-muted-foreground">последние 6 месяцев</span>
          </div>
          <div className="flex items-end gap-3 h-28">
            {lastVelocity.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">{v}</span>
                <div
                  className="w-full rounded-t-md transition-all hover:opacity-80"
                  style={{
                    height: `${(v / maxV) * 88}px`,
                    background: i === lastVelocity.length - 1 ? "var(--gradient-primary)" : "rgba(99,102,241,0.25)"
                  }}
                />
                <span className="text-[10px] text-muted-foreground">{lastMonths[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold">Команда</h3>
            <button onClick={() => onSectionChange("team")} className="text-[12px] text-primary hover:underline">Все</button>
          </div>
          {loading ? (
            <div className="space-y-2.5">
              {[1,2,3,4].map(i => <div key={i} className="h-8 bg-secondary/50 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-2.5">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: m.color }}>
                      {m.avatar}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${m.online ? "bg-green-400" : "bg-gray-500"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-foreground truncate">{m.name}</div>
                    <div className="text-[10px] text-muted-foreground">{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
