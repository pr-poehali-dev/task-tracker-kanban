import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Dashboard from "@/components/sections/Dashboard";
import KanbanBoard from "@/components/sections/KanbanBoard";
import Sprints from "@/components/sections/Sprints";
import Docs from "@/components/sections/Docs";
import Team from "@/components/sections/Team";
import Analytics from "@/components/sections/Analytics";
import Integrations from "@/components/sections/Integrations";

const sectionMeta: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Обзор", subtitle: "Добро пожаловать, Алексей!" },
  kanban: { title: "Канбан-доска", subtitle: "FlowDesk Platform" },
  sprints: { title: "Спринты", subtitle: "Agile-планирование команды" },
  docs: { title: "Документация", subtitle: "Внутренняя база знаний" },
  team: { title: "Команда", subtitle: "Участники и роли" },
  analytics: { title: "Аналитика", subtitle: "Метрики и отчёты" },
  integrations: { title: "Интеграции", subtitle: "Внешние сервисы и API" },
};

export default function Index() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeProject, setActiveProject] = useState(1);

  const meta = sectionMeta[activeSection] || sectionMeta.dashboard;

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard": return <Dashboard onSectionChange={setActiveSection} />;
      case "kanban": return <KanbanBoard />;
      case "sprints": return <Sprints />;
      case "docs": return <Docs />;
      case "team": return <Team />;
      case "analytics": return <Analytics />;
      case "integrations": return <Integrations />;
      default: return <Dashboard onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
        <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }} />
      </div>

      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        activeProject={activeProject}
        onProjectChange={setActiveProject}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar title={meta.title} subtitle={meta.subtitle} />
        <main className={`flex-1 overflow-y-auto ${activeSection === "docs" ? "!overflow-hidden flex flex-col" : ""}`}>
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
