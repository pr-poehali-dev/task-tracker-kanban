CREATE TABLE IF NOT EXISTS t_p69306450_task_tracker_kanban.members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6366f1',
  online BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p69306450_task_tracker_kanban.sprints (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  total_tasks INTEGER NOT NULL DEFAULT 0,
  done_tasks INTEGER NOT NULL DEFAULT 0,
  team TEXT NOT NULL,
  velocity INTEGER NOT NULL DEFAULT 0,
  burndown JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p69306450_task_tracker_kanban.tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'medium',
  assignee TEXT NOT NULL DEFAULT '',
  project_id INTEGER REFERENCES t_p69306450_task_tracker_kanban.projects(id),
  tags JSONB NOT NULL DEFAULT '[]',
  estimate TEXT NOT NULL DEFAULT '',
  sprint_id INTEGER REFERENCES t_p69306450_task_tracker_kanban.sprints(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
