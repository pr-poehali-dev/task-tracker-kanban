import { useState } from "react";
import Icon from "@/components/ui/icon";
import { kanbanTasks, projects } from "@/data/mockData";

type Priority = "low" | "medium" | "high" | "critical";
type ColumnKey = "todo" | "inProgress" | "review" | "done";

interface Task {
  id: string;
  title: string;
  priority: string;
  assignee: string;
  project: string;
  tags: string[];
  estimate: string;
}

const columns: { key: ColumnKey; label: string; color: string; bg: string }[] = [
  { key: "todo", label: "К выполнению", color: "#94a3b8", bg: "rgba(148,163,184,0.08)" },
  { key: "inProgress", label: "В работе", color: "#818cf8", bg: "rgba(99,102,241,0.08)" },
  { key: "review", label: "На проверке", color: "#fbbf24", bg: "rgba(245,158,11,0.08)" },
  { key: "done", label: "Готово", color: "#4ade80", bg: "rgba(34,197,94,0.08)" },
];

const priorityConfig: Record<string, { label: string; icon: string; cls: string }> = {
  low: { label: "Низкий", icon: "ArrowDown", cls: "priority-low" },
  medium: { label: "Средний", icon: "ArrowRight", cls: "priority-medium" },
  high: { label: "Высокий", icon: "ArrowUp", cls: "priority-high" },
  critical: { label: "Критичный", icon: "AlertCircle", cls: "priority-critical" },
};

function TaskCard({ task }: { task: Task }) {
  const p = priorityConfig[task.priority] || priorityConfig.medium;
  const proj = projects.find(pr => pr.name === task.project);

  return (
    <div className="task-card bg-card border border-border rounded-xl p-3.5 space-y-2.5 hover:shadow-lg group">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[13px] font-medium text-foreground leading-snug flex-1">{task.title}</span>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-secondary text-muted-foreground">
          <Icon name="MoreHorizontal" size={14} />
        </button>
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono">{tag}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-border/60">
        <div className={`flex items-center gap-1 text-[11px] font-medium ${p.cls}`}>
          <Icon name={p.icon} size={12} />
          <span>{p.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">{task.estimate}</span>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
            style={{ background: proj?.color || "#6366f1" }}
            title={task.assignee}
          >
            {task.assignee}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(kanbanTasks);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<ColumnKey | null>(null);

  const handleDragStart = (id: string) => setDragId(id);

  const handleDrop = (col: ColumnKey) => {
    if (!dragId) return;
    const newTasks = { ...tasks };
    let draggedTask: Task | null = null;

    (Object.keys(newTasks) as ColumnKey[]).forEach(key => {
      const idx = newTasks[key].findIndex(t => t.id === dragId);
      if (idx !== -1) {
        [draggedTask] = newTasks[key].splice(idx, 1);
      }
    });

    if (draggedTask) newTasks[col] = [...newTasks[col], draggedTask];
    setTasks(newTasks);
    setDragId(null);
    setDragOver(null);
  };

  return (
    <div className="p-6 animate-fade-in h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5 text-muted-foreground flex-1 max-w-xs">
          <Icon name="Search" size={14} />
          <input placeholder="Поиск задач..." className="bg-transparent text-[13px] outline-none flex-1 placeholder:text-muted-foreground" />
        </div>
        <select className="bg-secondary border-none rounded-lg px-3 py-1.5 text-[13px] text-foreground outline-none cursor-pointer">
          <option>Все проекты</option>
          {projects.map(p => <option key={p.id}>{p.name}</option>)}
        </select>
        <select className="bg-secondary border-none rounded-lg px-3 py-1.5 text-[13px] text-foreground outline-none cursor-pointer">
          <option>Все участники</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <button className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="Filter" size={15} />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium text-white transition-all hover:opacity-90" style={{ background: "var(--gradient-primary)" }}>
            <Icon name="Plus" size={14} />
            Задача
          </button>
        </div>
      </div>

      {/* Columns */}
      <div className="flex gap-4 flex-1 overflow-x-auto pb-2">
        {columns.map(col => {
          const colTasks = tasks[col.key];
          return (
            <div
              key={col.key}
              className={`kanban-column flex-1 min-w-[260px] rounded-xl border border-border flex flex-col transition-all ${dragOver === col.key ? "drag-over" : ""}`}
              style={{ background: col.bg }}
              onDragOver={e => { e.preventDefault(); setDragOver(col.key); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => handleDrop(col.key)}
            >
              {/* Column header */}
              <div className="px-4 py-3 flex items-center justify-between border-b border-border/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                  <span className="text-[13px] font-semibold" style={{ color: col.color }}>{col.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground bg-background/60 rounded-full px-2 py-0.5">
                    {colTasks.length}
                  </span>
                  <button className="p-1 rounded hover:bg-background/60 text-muted-foreground hover:text-foreground transition-colors">
                    <Icon name="Plus" size={14} />
                  </button>
                </div>
              </div>

              {/* Tasks */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {colTasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    onDragEnd={() => setDragId(null)}
                  >
                    <TaskCard task={task} />
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Icon name="Plus" size={24} className="mb-2 opacity-30" />
                    <span className="text-[12px] opacity-50">Перетащите задачу</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
