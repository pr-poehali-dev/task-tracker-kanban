import { useState } from "react";
import Icon from "@/components/ui/icon";
import { projects, notifications } from "@/data/mockData";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  activeProject: number;
  onProjectChange: (id: number) => void;
}

const navItems = [
  { id: "dashboard", label: "Обзор", icon: "LayoutDashboard" },
  { id: "kanban", label: "Канбан", icon: "Kanban" },
  { id: "sprints", label: "Спринты", icon: "Zap" },
  { id: "docs", label: "Документация", icon: "BookOpen" },
  { id: "team", label: "Команда", icon: "Users" },
  { id: "analytics", label: "Аналитика", icon: "BarChart2" },
  { id: "integrations", label: "Интеграции", icon: "Plug" },
];

export default function Sidebar({ activeSection, onSectionChange, activeProject, onProjectChange }: SidebarProps) {
  const [projectsOpen, setProjectsOpen] = useState(true);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <aside className="w-64 h-screen flex flex-col bg-[hsl(var(--sidebar-background))] border-r border-border flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Icon name="Zap" size={16} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-[15px] text-foreground">FlowDesk</span>
            <div className="text-[10px] text-muted-foreground font-mono">WORKSPACE</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left relative ${activeSection === item.id ? "active" : "text-muted-foreground"}`}
          >
            <Icon name={item.icon} size={17} />
            <span>{item.label}</span>
            {item.id === "dashboard" && unread > 0 && (
              <span className="ml-auto text-[10px] font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center notification-dot">
                {unread}
              </span>
            )}
          </button>
        ))}

        {/* Projects */}
        <div className="pt-4">
          <button
            onClick={() => setProjectsOpen(!projectsOpen)}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
          >
            <Icon name={projectsOpen ? "ChevronDown" : "ChevronRight"} size={12} />
            Проекты
          </button>

          {projectsOpen && (
            <div className="mt-1 space-y-0.5 animate-fade-in">
              {projects.map(project => (
                <button
                  key={project.id}
                  onClick={() => { onProjectChange(project.id); onSectionChange("kanban"); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeProject === project.id && activeSection === "kanban" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
                >
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: project.color }} />
                  <span className="truncate text-[13px]">{project.name}</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">{project.tasks}</span>
                </button>
              ))}
              <button
                onClick={() => onSectionChange("kanban")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Icon name="Plus" size={14} />
                <span className="text-[13px]">Новый проект</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: "#6366f1" }}>
            АП
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-foreground truncate">Алексей Петров</div>
            <div className="text-[11px] text-muted-foreground">Product Manager</div>
          </div>
          <button className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <Icon name="Settings" size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}