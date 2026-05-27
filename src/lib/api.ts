import func2url from "../../backend/func2url.json";

const URLS = func2url as Record<string, string>;

async function request<T>(fn: string, path = "/", options: RequestInit = {}): Promise<T> {
  const base = URLS[fn];
  const url = path === "/" ? base : `${base}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

// ---- Tasks ----
export interface Task {
  id: number;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  project_id: number | null;
  tags: string[];
  estimate: string;
  sprint_id: number | null;
  project_name?: string;
  project_color?: string;
}

export const getTasks = (project_id?: number) =>
  request<Task[]>("tasks", project_id ? `/?project_id=${project_id}` : "/");

export const createTask = (data: Partial<Task>) =>
  request<Task>("tasks", "/", { method: "POST", body: JSON.stringify(data) });

export const updateTask = (id: number, data: Partial<Task>) =>
  request<Task>("tasks", `/${id}`, { method: "PATCH", body: JSON.stringify(data) });

// ---- Projects ----
export interface Project {
  id: number;
  name: string;
  color: string;
  progress: number;
  tasks: number;
  members: number;
}

export const getProjects = () => request<Project[]>("projects", "/");

export const createProject = (data: { name: string; color: string }) =>
  request<Project>("projects", "/", { method: "POST", body: JSON.stringify(data) });

// ---- Sprints ----
export interface Sprint {
  id: number;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  total_tasks: number;
  done_tasks: number;
  team: string;
  velocity: number;
  burndown: number[];
  progress: number;
}

export const getSprints = () => request<Sprint[]>("sprints", "/");

// ---- Members ----
export interface Member {
  id: number;
  name: string;
  role: string;
  avatar: string;
  color: string;
  online: boolean;
  task_count: number;
}

export const getMembers = () => request<Member[]>("members", "/");
