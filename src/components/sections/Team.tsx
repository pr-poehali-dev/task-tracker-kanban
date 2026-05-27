import Icon from "@/components/ui/icon";
import { members } from "@/data/mockData";

const roles = ["Все роли", "Product Manager", "Frontend Dev", "Backend Dev", "Designer", "QA Engineer", "Tech Lead"];

const roleColors: Record<string, string> = {
  "Product Manager": "#6366f1",
  "Frontend Dev": "#8b5cf6",
  "Backend Dev": "#06b6d4",
  "Designer": "#f59e0b",
  "QA Engineer": "#10b981",
  "Tech Lead": "#ef4444",
};

export default function Team() {
  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold">Команда</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Управление участниками и ролями</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-white hover:opacity-90 transition-all" style={{ background: "var(--gradient-primary)" }}>
          <Icon name="UserPlus" size={14} />
          Пригласить
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {roles.map((role, i) => (
          <button
            key={role}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${i === 0 ? "text-white" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            style={i === 0 ? { background: "var(--gradient-primary)" } : {}}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Members grid */}
      <div className="grid grid-cols-3 gap-4">
        {members.map((m, i) => (
          <div
            key={m.id}
            className="bg-card border border-border rounded-xl p-5 hover-lift animate-fade-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: m.color }}
                >
                  {m.avatar}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-card ${m.online ? "bg-green-400" : "bg-gray-500"}`} />
              </div>
              <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="MoreHorizontal" size={14} />
              </button>
            </div>

            <div className="mb-3">
              <div className="text-[14px] font-semibold text-foreground">{m.name}</div>
              <div
                className="text-[11px] font-medium mt-0.5 px-2 py-0.5 rounded-full inline-block"
                style={{ color: roleColors[m.role] || "#6366f1", background: `${roleColors[m.role] || "#6366f1"}20` }}
              >
                {m.role}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-4">
              <div className={`w-1.5 h-1.5 rounded-full ${m.online ? "bg-green-400" : "bg-gray-500"}`} />
              <span>{m.online ? "Онлайн" : "Не в сети"}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border">
              {[
                { label: "Задач", value: Math.floor(Math.random() * 15) + 3 },
                { label: "Закрыто", value: Math.floor(Math.random() * 30) + 10 },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-[16px] font-bold text-foreground">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-1.5 rounded-lg text-[12px] text-muted-foreground bg-secondary hover:bg-secondary/80 hover:text-foreground transition-colors">
                Профиль
              </button>
              <button className="flex-1 py-1.5 rounded-lg text-[12px] text-primary-foreground hover:opacity-90 transition-all" style={{ background: "var(--gradient-primary)" }}>
                Написать
              </button>
            </div>
          </div>
        ))}

        {/* Invite card */}
        <div className="bg-card border border-dashed border-border rounded-xl p-5 flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/3 transition-all cursor-pointer group">
          <div className="w-14 h-14 rounded-xl border-2 border-dashed border-border group-hover:border-primary/40 flex items-center justify-center transition-colors">
            <Icon name="Plus" size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="text-center">
            <div className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">Пригласить участника</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Добавить в команду</div>
          </div>
        </div>
      </div>
    </div>
  );
}
