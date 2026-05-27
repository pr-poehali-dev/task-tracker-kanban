import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { getTasks, updateTask, createTask, getProjects, type Task, type Project } from "@/lib/api";

type ColumnKey = "todo" | "inProgress" | "review" | "done";

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

function TaskCard({ task, projects }: { task: Task; projects: Project[] }) {
  const p = priorityConfig[task.priority] || priorityConfig.medium;
  const proj = projects.find(pr => pr.id === task.project_id);

  return (
    <div className="task-card bg-card border border-border rounded-xl p-3.5 space-y-2.5 hover:shadow-lg group">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[13px] font-medium text-foreground leading-snug flex-1">{task.title}</span>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-secondary text-muted-foreground">
          <Icon name="MoreHorizontal" size={14} />
        </button>
      </div>
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono">{tag}</span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between pt-1 border-t border-border/60">
        <div className={`flex items-center gap-1 text-[11px] font-medium ${p.cls}`}>
          <Icon name={p.icon} size={12} />
          <span>{p.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">{task.estimate}</span>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
            style={{ background: proj?.color || task.project_color || "#6366f1" }}
            title={task.assignee}
          >
            {task.assignee}
          </div>
        </div>
      </div>
    </div>
  );
}

interface NewTaskForm {
  title: string;
  priority: string;
  assignee: string;
  estimate: string;
  project_id: number | null;
}

export default function KanbanBoard() {
  const [tasksByCol, setTasksByCol] = useState<Record<ColumnKey, Task[]>>({ todo: [], inProgress: [], review: [], done: [] });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<ColumnKey | null>(null);
  const [addingTo, setAddingTo] = useState<ColumnKey | null>(null);
  const [newTask, setNewTask] = useState<NewTaskForm>({ title: "", priority: "medium", assignee: "", estimate: "", project_id: null });
  const [filterProject, setFilterProject] = useState<string>("all");

  useEffect(() => {
    Promise.all([getTasks(), getProjects()]).then(([tasks, projs]) => {
      setProjects(projs);
      groupTasks(tasks);
      setLoading(false);
    });
  }, []);

  const groupTasks = (tasks: Task[]) => {
    const grouped: Record<ColumnKey, Task[]> = { todo: [], inProgress: [], review: [], done: [] };
    tasks.forEach(t => {
      const col = t.status as ColumnKey;
      if (grouped[col]) grouped[col].push(t);
    });
    setTasksByCol(grouped);
  };

  const handleDrop = async (col: ColumnKey) => {
    if (dragId === null) return;
    const newCols = { ...tasksByCol };
    let moved: Task | null = null;
    (Object.keys(newCols) as ColumnKey[]).forEach(key => {
      const idx = newCols[key].findIndex(t => t.id === dragId);
      if (idx !== -1) [moved] = newCols[key].splice(idx, 1);
    });
    if (moved) {
      const updated = { ...moved, status: col };
      newCols[col] = [...newCols[col], updated];
      setTasksByCol(newCols);
      await updateTask(dragId, { status: col });
    }
    setDragId(null);
    setDragOver(null);
  };

  const handleAddTask = async (col: ColumnKey) => {
    if (!newTask.title.trim()) return;
    const created = await createTask({
      title: newTask.title,
      status: col,
      priority: newTask.priority,
      assignee: newTask.assignee,
      estimate: newTask.estimate,
      project_id: newTask.project_id,
      tags: [],
    });
    setTasksByCol(prev => ({ ...prev, [col]: [...prev[col], created] }));
    setAddingTo(null);
    setNewTask({ title: "", priority: "medium", assignee: "", estimate: "", project_id: null });
  };

  const filteredCols = (col: ColumnKey) => {
    if (filterProject === "all") return tasksByCol[col];
    return tasksByCol[col].filter(t => t.project_id === parseInt(filterProject));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground text-[13px] flex items-center gap-2">
          <Icon name="Loader" size={16} className="animate-spin" />
          Загрузка задач...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in h-full flex flex-col">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5 text-muted-foreground flex-1 max-w-xs">
          <Icon name="Search" size={14} />
          <input placeholder="Поиск задач..." className="bg-transparent text-[13px] outline-none flex-1 placeholder:text-muted-foreground" />
        </div>
        <select
          className="bg-secondary border-none rounded-lg px-3 py-1.5 text-[13px] text-foreground outline-none cursor-pointer"
          value={filterProject}
          onChange={e => setFilterProject(e.target.value)}
        >
          <option value="all">Все проекты</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setAddingTo("todo")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium text-white transition-all hover:opacity-90"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Icon name="Plus" size={14} />
            Задача
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 overflow-x-auto pb-2">
        {columns.map(col => {
          const colTasks = filteredCols(col.key);
          return (
            <div
              key={col.key}
              className={`kanban-column flex-1 min-w-[260px] rounded-xl border border-border flex flex-col transition-all ${dragOver === col.key ? "drag-over" : ""}`}
              style={{ background: col.bg }}
              onDragOver={e => { e.preventDefault(); setDragOver(col.key); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => handleDrop(col.key)}
            >
              <div className="px-4 py-3 flex items-center justify-between border-b border-border/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                  <span className="text-[13px] font-semibold" style={{ color: col.color }}>{col.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground bg-background/60 rounded-full px-2 py-0.5">{colTasks.length}</span>
                  <button
                    onClick={() => setAddingTo(col.key)}
                    className="p-1 rounded hover:bg-background/60 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon name="Plus" size={14} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {colTasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => setDragId(task.id)}
                    onDragEnd={() => setDragId(null)}
                  >
                    <TaskCard task={task} projects={projects} />
                  </div>
                ))}

                {addingTo === col.key && (
                  <div className="bg-card border border-primary/30 rounded-xl p-3 space-y-2 animate-scale-in">
                    <input
                      autoFocus
                      placeholder="Название задачи..."
                      value={newTask.title}
                      onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      onKeyDown={e => { if (e.key === "Enter") handleAddTask(col.key); if (e.key === "Escape") setAddingTo(null); }}
                      className="w-full bg-secondary rounded-lg px-3 py-2 text-[13px] outline-none text-foreground placeholder:text-muted-foreground"
                    />
                    <div className="flex gap-2">
                      <select
                        value={newTask.priority}
                        onChange={e => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                        className="flex-1 bg-secondary rounded-lg px-2 py-1.5 text-[12px] text-foreground outline-none cursor-pointer"
                      >
                        <option value="low">Низкий</option>
                        <option value="medium">Средний</option>
                        <option value="high">Высокий</option>
                        <option value="critical">Критичный</option>
                      </select>
                      <select
                        value={newTask.project_id ?? ""}
                        onChange={e => setNewTask(prev => ({ ...prev, project_id: e.target.value ? parseInt(e.target.value) : null }))}
                        className="flex-1 bg-secondary rounded-lg px-2 py-1.5 text-[12px] text-foreground outline-none cursor-pointer"
                      >
                        <option value="">Проект</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <input
                      placeholder="Исполнитель (инициалы)"
                      value={newTask.assignee}
                      onChange={e => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                      className="w-full bg-secondary rounded-lg px-3 py-1.5 text-[12px] outline-none text-foreground placeholder:text-muted-foreground"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddTask(col.key)}
                        className="flex-1 py-1.5 rounded-lg text-[12px] font-medium text-white hover:opacity-90"
                        style={{ background: "var(--gradient-primary)" }}
                      >
                        Добавить
                      </button>
                      <button
                        onClick={() => setAddingTo(null)}
                        className="flex-1 py-1.5 rounded-lg text-[12px] text-muted-foreground bg-secondary hover:bg-secondary/80"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                )}

                {colTasks.length === 0 && addingTo !== col.key && (
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
