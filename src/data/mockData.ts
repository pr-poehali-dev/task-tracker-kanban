export const projects = [
  { id: 1, name: "FlowDesk Platform", color: "#6366f1", tasks: 42, members: 8, progress: 68 },
  { id: 2, name: "Mobile App v2", color: "#8b5cf6", tasks: 27, members: 5, progress: 45 },
  { id: 3, name: "API Gateway", color: "#06b6d4", tasks: 15, members: 3, progress: 82 },
  { id: 4, name: "Design System", color: "#f59e0b", tasks: 33, members: 6, progress: 31 },
];

export const members = [
  { id: 1, name: "Алексей Петров", role: "Product Manager", avatar: "АП", color: "#6366f1", online: true },
  { id: 2, name: "Мария Козлова", role: "Frontend Dev", avatar: "МК", color: "#8b5cf6", online: true },
  { id: 3, name: "Дмитрий Иванов", role: "Backend Dev", avatar: "ДИ", color: "#06b6d4", online: false },
  { id: 4, name: "Анна Смирнова", role: "Designer", avatar: "АС", color: "#f59e0b", online: true },
  { id: 5, name: "Сергей Волков", role: "QA Engineer", avatar: "СВ", color: "#10b981", online: false },
  { id: 6, name: "Ольга Новикова", role: "Tech Lead", avatar: "ОН", color: "#ef4444", online: true },
];

export const kanbanTasks = {
  todo: [
    { id: "t1", title: "Разработать систему авторизации", priority: "high", assignee: "МК", project: "FlowDesk Platform", tags: ["auth", "security"], estimate: "3д" },
    { id: "t2", title: "Написать документацию API", priority: "medium", assignee: "ДИ", project: "API Gateway", tags: ["docs"], estimate: "2д" },
    { id: "t3", title: "Обновить дизайн-токены", priority: "low", assignee: "АС", project: "Design System", tags: ["design"], estimate: "1д" },
    { id: "t4", title: "Настроить CI/CD пайплайн", priority: "critical", assignee: "ОН", project: "Mobile App v2", tags: ["devops"], estimate: "4д" },
  ],
  inProgress: [
    { id: "t5", title: "Реализовать канбан доску с DnD", priority: "high", assignee: "МК", project: "FlowDesk Platform", tags: ["frontend", "feature"], estimate: "5д" },
    { id: "t6", title: "Оптимизация запросов к базе данных", priority: "medium", assignee: "ДИ", project: "API Gateway", tags: ["backend", "perf"], estimate: "3д" },
    { id: "t7", title: "Создать компоненты форм", priority: "medium", assignee: "АС", project: "Design System", tags: ["design", "ui"], estimate: "2д" },
  ],
  review: [
    { id: "t8", title: "Code review: модуль уведомлений", priority: "high", assignee: "ОН", project: "FlowDesk Platform", tags: ["review"], estimate: "1д" },
    { id: "t9", title: "Тестирование push-уведомлений", priority: "medium", assignee: "СВ", project: "Mobile App v2", tags: ["testing", "mobile"], estimate: "2д" },
  ],
  done: [
    { id: "t10", title: "Настройка мониторинга Sentry", priority: "low", assignee: "ДИ", project: "FlowDesk Platform", tags: ["monitoring"], estimate: "1д" },
    { id: "t11", title: "Миграция на PostgreSQL 15", priority: "high", assignee: "ДИ", project: "API Gateway", tags: ["db", "migration"], estimate: "3д" },
    { id: "t12", title: "Обновление зависимостей", priority: "low", assignee: "МК", project: "Mobile App v2", tags: ["maintenance"], estimate: "1д" },
  ],
};

export const sprints = [
  {
    id: 1,
    name: "Sprint 12",
    status: "active",
    startDate: "20 мая",
    endDate: "3 июня",
    progress: 62,
    totalTasks: 18,
    doneTasks: 11,
    team: "FlowDesk Platform",
    velocity: 47,
    burndown: [18, 17, 15, 14, 12, 11, 10, 8, 7, 7, 6],
  },
  {
    id: 2,
    name: "Sprint 11",
    status: "completed",
    startDate: "6 мая",
    endDate: "19 мая",
    progress: 100,
    totalTasks: 21,
    doneTasks: 21,
    team: "FlowDesk Platform",
    velocity: 53,
    burndown: [21, 19, 17, 14, 12, 9, 7, 5, 3, 1, 0],
  },
  {
    id: 3,
    name: "Sprint 8",
    status: "active",
    startDate: "22 мая",
    endDate: "5 июня",
    progress: 38,
    totalTasks: 14,
    doneTasks: 5,
    team: "Mobile App v2",
    velocity: 31,
    burndown: [14, 13, 12, 11, 9, 9],
  },
];

export const docs = [
  {
    id: 1,
    title: "Начало работы",
    icon: "🚀",
    children: [
      { id: 11, title: "Введение в FlowDesk", content: "# Введение в FlowDesk\n\nFlowDesk — это современная платформа управления проектами...\n\n## Основные возможности\n\n- **Канбан-доска** с поддержкой drag & drop\n- **Спринты** для agile-планирования\n- **Документация** с встроенным редактором\n- **Аналитика** и отчёты в реальном времени\n\n## Быстрый старт\n\n1. Создайте проект\n2. Пригласите команду\n3. Добавьте задачи\n4. Начните первый спринт" },
      { id: 12, title: "Настройка рабочего пространства", content: "# Настройка рабочего пространства\n\nСоздайте организацию и пригласите участников..." },
    ]
  },
  {
    id: 2,
    title: "Управление задачами",
    icon: "✅",
    children: [
      { id: 21, title: "Создание задач", content: "# Создание задач\n\nЗадачи — основная единица работы в FlowDesk..." },
      { id: 22, title: "Приоритеты и теги", content: "# Приоритеты и теги\n\nГрамотная расстановка приоритетов повышает эффективность команды..." },
      { id: 23, title: "Назначение исполнителей", content: "# Назначение исполнителей\n\nКаждая задача может иметь одного или нескольких исполнителей..." },
    ]
  },
  {
    id: 3,
    title: "Kanban & Спринты",
    icon: "📋",
    children: [
      { id: 31, title: "Работа с канбан-доской", content: "# Работа с канбан-доской\n\nКанбан-доска отображает задачи по статусам..." },
      { id: 32, title: "Планирование спринтов", content: "# Планирование спринтов\n\nСпринт — это временной отрезок фиксированной длины..." },
    ]
  },
  {
    id: 4,
    title: "API & Интеграции",
    icon: "🔌",
    children: [
      { id: 41, title: "REST API", content: "# REST API\n\nFlowDesk предоставляет полноценное REST API..." },
      { id: 42, title: "Webhooks", content: "# Webhooks\n\nНастройте вебхуки для получения уведомлений о событиях..." },
    ]
  },
];

export const notifications = [
  { id: 1, text: "Мария назначила вас на задачу 'Оптимизация запросов'", time: "2 мин", read: false, avatar: "МК", color: "#8b5cf6" },
  { id: 2, text: "Sprint 12 завершается через 3 дня", time: "1 ч", read: false, avatar: "🚀", color: "#6366f1" },
  { id: 3, text: "Алексей прокомментировал задачу 'CI/CD пайплайн'", time: "3 ч", read: false, avatar: "АП", color: "#6366f1" },
  { id: 4, text: "Задача 'Миграция PostgreSQL' переведена в Done", time: "вчера", read: true, avatar: "ДИ", color: "#06b6d4" },
  { id: 5, text: "Новый участник добавлен: Ольга Новикова", time: "вчера", read: true, avatar: "ОН", color: "#ef4444" },
];

export const analyticsData = {
  tasksCompleted: [8, 12, 7, 15, 11, 9, 14, 18, 13, 16, 21, 17],
  velocity: [35, 42, 38, 51, 47, 53, 48, 62, 55, 58, 67, 71],
  byPriority: { critical: 5, high: 18, medium: 31, low: 24 },
  byStatus: { todo: 22, inProgress: 15, review: 8, done: 33 },
  months: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
};
