INSERT INTO t_p69306450_task_tracker_kanban.projects (name, color, progress) VALUES
  ('FlowDesk Platform', '#6366f1', 68),
  ('Mobile App v2', '#8b5cf6', 45),
  ('API Gateway', '#06b6d4', 82),
  ('Design System', '#f59e0b', 31);

INSERT INTO t_p69306450_task_tracker_kanban.members (name, role, avatar, color, online) VALUES
  ('Алексей Петров', 'Product Manager', 'АП', '#6366f1', true),
  ('Мария Козлова', 'Frontend Dev', 'МК', '#8b5cf6', true),
  ('Дмитрий Иванов', 'Backend Dev', 'ДИ', '#06b6d4', false),
  ('Анна Смирнова', 'Designer', 'АС', '#f59e0b', true),
  ('Сергей Волков', 'QA Engineer', 'СВ', '#10b981', false),
  ('Ольга Новикова', 'Tech Lead', 'ОН', '#ef4444', true);

INSERT INTO t_p69306450_task_tracker_kanban.sprints (name, status, start_date, end_date, total_tasks, done_tasks, team, velocity, burndown) VALUES
  ('Sprint 12', 'active', '20 мая', '3 июня', 18, 11, 'FlowDesk Platform', 47, '[18,17,15,14,12,11,10,8,7,7,6]'),
  ('Sprint 11', 'completed', '6 мая', '19 мая', 21, 21, 'FlowDesk Platform', 53, '[21,19,17,14,12,9,7,5,3,1,0]'),
  ('Sprint 8', 'active', '22 мая', '5 июня', 14, 5, 'Mobile App v2', 31, '[14,13,12,11,9,9]');

INSERT INTO t_p69306450_task_tracker_kanban.tasks (title, status, priority, assignee, project_id, tags, estimate, sprint_id) VALUES
  ('Разработать систему авторизации', 'todo', 'high', 'МК', 1, '["auth","security"]', '3д', 1),
  ('Написать документацию API', 'todo', 'medium', 'ДИ', 3, '["docs"]', '2д', NULL),
  ('Обновить дизайн-токены', 'todo', 'low', 'АС', 4, '["design"]', '1д', NULL),
  ('Настроить CI/CD пайплайн', 'todo', 'critical', 'ОН', 2, '["devops"]', '4д', 3),
  ('Реализовать канбан доску с DnD', 'inProgress', 'high', 'МК', 1, '["frontend","feature"]', '5д', 1),
  ('Оптимизация запросов к базе данных', 'inProgress', 'medium', 'ДИ', 3, '["backend","perf"]', '3д', NULL),
  ('Создать компоненты форм', 'inProgress', 'medium', 'АС', 4, '["design","ui"]', '2д', NULL),
  ('Code review: модуль уведомлений', 'review', 'high', 'ОН', 1, '["review"]', '1д', 1),
  ('Тестирование push-уведомлений', 'review', 'medium', 'СВ', 2, '["testing","mobile"]', '2д', 3),
  ('Настройка мониторинга Sentry', 'done', 'low', 'ДИ', 1, '["monitoring"]', '1д', 1),
  ('Миграция на PostgreSQL 15', 'done', 'high', 'ДИ', 3, '["db","migration"]', '3д', NULL),
  ('Обновление зависимостей', 'done', 'low', 'МК', 2, '["maintenance"]', '1д', 3);
