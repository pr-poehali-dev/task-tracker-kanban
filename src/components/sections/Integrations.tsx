import Icon from "@/components/ui/icon";

const integrations = [
  { name: "GitHub", desc: "Синхронизация коммитов и PR с задачами", icon: "Github", connected: true, color: "#333" },
  { name: "Slack", desc: "Уведомления о задачах прямо в каналы", icon: "MessageSquare", connected: true, color: "#4A154B" },
  { name: "Figma", desc: "Прикрепляйте дизайн-макеты к задачам", icon: "Pen", connected: false, color: "#F24E1E" },
  { name: "Google Calendar", desc: "Синхронизация спринтов и дедлайнов", icon: "Calendar", connected: false, color: "#4285F4" },
  { name: "Jira", desc: "Миграция задач из Jira в FlowDesk", icon: "Layers", connected: false, color: "#0052CC" },
  { name: "Confluence", desc: "Импорт документации из Confluence", icon: "FileText", connected: false, color: "#172B4D" },
  { name: "Telegram", desc: "Бот для уведомлений и управления задачами", icon: "Send", connected: true, color: "#2AABEE" },
  { name: "Webhook", desc: "Кастомные вебхуки для любых сервисов", icon: "Webhook", connected: false, color: "#6366f1" },
];

const apiEndpoints = [
  { method: "GET", path: "/api/v1/tasks", desc: "Список задач проекта" },
  { method: "POST", path: "/api/v1/tasks", desc: "Создать задачу" },
  { method: "PUT", path: "/api/v1/tasks/:id", desc: "Обновить задачу" },
  { method: "GET", path: "/api/v1/sprints", desc: "Список спринтов" },
  { method: "POST", path: "/api/v1/webhooks", desc: "Зарегистрировать вебхук" },
];

const methodColors: Record<string, string> = {
  GET: "#4ade80",
  POST: "#818cf8",
  PUT: "#fbbf24",
  DELETE: "#f87171",
};

export default function Integrations() {
  return (
    <div className="p-6 space-y-6 animate-fade-in overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold">Интеграции и API</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Подключите внешние сервисы и инструменты</p>
        </div>
      </div>

      {/* Integrations grid */}
      <div>
        <h3 className="text-[13px] font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Сервисы</h3>
        <div className="grid grid-cols-4 gap-3">
          {integrations.map((intg, i) => (
            <div
              key={intg.name}
              className="bg-card border border-border rounded-xl p-4 hover-lift animate-fade-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${intg.color}20` }}
                >
                  <Icon name={intg.icon} size={20} style={{ color: intg.color }} />
                </div>
                <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${intg.connected ? "bg-green-500/15 text-green-400" : "bg-secondary text-muted-foreground"}`}>
                  {intg.connected ? "Подключено" : "Не подключено"}
                </div>
              </div>
              <div className="text-[13px] font-semibold text-foreground mb-1">{intg.name}</div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">{intg.desc}</p>
              <button
                className={`w-full py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                  intg.connected
                    ? "bg-secondary text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    : "text-white hover:opacity-90"
                }`}
                style={!intg.connected ? { background: "var(--gradient-primary)" } : {}}
              >
                {intg.connected ? "Отключить" : "Подключить"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* API */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-[14px] font-semibold mb-1">REST API</h3>
          <p className="text-[12px] text-muted-foreground mb-4">Используйте API для интеграции с вашими сервисами</p>
          <div className="space-y-2">
            {apiEndpoints.map((ep, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                <span
                  className="text-[10px] font-bold font-mono px-2 py-0.5 rounded w-12 text-center flex-shrink-0"
                  style={{ color: methodColors[ep.method], background: `${methodColors[ep.method]}20` }}
                >
                  {ep.method}
                </span>
                <code className="text-[12px] font-mono text-foreground/80 flex-1">{ep.path}</code>
                <span className="text-[11px] text-muted-foreground truncate">{ep.desc}</span>
              </div>
            ))}
          </div>
          <button className="mt-3 text-[12px] text-primary hover:underline flex items-center gap-1">
            <Icon name="ExternalLink" size={12} />
            Полная документация API
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-[14px] font-semibold mb-1">API ключ</h3>
          <p className="text-[12px] text-muted-foreground mb-4">Используйте ключ для авторизации запросов</p>
          <div className="bg-secondary rounded-lg p-3 font-mono text-[12px] text-muted-foreground mb-3 flex items-center justify-between">
            <span>fd_live_••••••••••••••••••••••••••••</span>
            <button className="p-1 hover:text-foreground transition-colors">
              <Icon name="Copy" size={13} />
            </button>
          </div>
          <div className="space-y-2">
            <button className="w-full py-2 rounded-lg text-[12px] text-white hover:opacity-90 transition-all" style={{ background: "var(--gradient-primary)" }}>
              Сгенерировать новый ключ
            </button>
            <button className="w-full py-2 rounded-lg text-[12px] text-muted-foreground bg-secondary hover:bg-secondary/80 transition-colors">
              Настроить разрешения
            </button>
          </div>
          <div className="mt-4 p-3 bg-primary/8 rounded-lg border border-primary/20">
            <div className="text-[11px] text-primary font-medium mb-1">Webhooks</div>
            <p className="text-[11px] text-muted-foreground">Настройте вебхуки для получения событий в реальном времени при изменении задач, спринтов и проектов.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
