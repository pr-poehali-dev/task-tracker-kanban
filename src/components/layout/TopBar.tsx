import { useState } from "react";
import Icon from "@/components/ui/icon";
import { notifications } from "@/data/mockData";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0 relative z-20">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-[15px] font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5 w-48 text-muted-foreground hover:bg-secondary/80 transition-colors cursor-pointer">
          <Icon name="Search" size={14} />
          <span className="text-[13px]">Поиск...</span>
          <span className="ml-auto text-[10px] font-mono bg-background rounded px-1 py-0.5">⌘K</span>
        </div>

        {/* Add task */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium text-primary-foreground transition-all hover:opacity-90 hover:scale-105" style={{ background: "var(--gradient-primary)" }}>
          <Icon name="Plus" size={14} />
          Задача
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-8 h-8 rounded-lg flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors text-muted-foreground hover:text-foreground"
          >
            <Icon name="Bell" size={16} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 bg-card border border-border rounded-xl shadow-2xl animate-scale-in z-50 overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <span className="text-[13px] font-semibold">Уведомления</span>
                <span className="text-[11px] text-primary cursor-pointer hover:underline">Отметить все прочитанными</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`flex gap-3 p-3.5 border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer ${!n.read ? "bg-primary/3" : ""}`}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 text-white" style={{ background: n.color }}>
                      {n.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-foreground leading-relaxed">{n.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
