import { useState } from "react";
import Icon from "@/components/ui/icon";
import { docs } from "@/data/mockData";

interface DocItem {
  id: number;
  title: string;
  content: string;
}

export default function Docs() {
  const [expandedSections, setExpandedSections] = useState<number[]>([1, 2]);
  const [activeDoc, setActiveDoc] = useState<DocItem>(docs[0].children[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  const toggleSection = (id: number) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const openDoc = (doc: DocItem) => {
    setActiveDoc(doc);
    setIsEditing(false);
  };

  const startEdit = () => {
    setEditContent(activeDoc.content);
    setIsEditing(true);
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("# ")) return <h1 key={i} className="text-2xl font-bold text-foreground mb-4 mt-2">{line.slice(2)}</h1>;
      if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-semibold text-foreground mb-3 mt-5">{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="text-[15px] font-semibold text-foreground mb-2 mt-4">{line.slice(4)}</h3>;
      if (line.match(/^\d+\. /)) {
        const content = line.replace(/^\d+\. /, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return <li key={i} className="text-[13px] text-foreground/90 leading-relaxed ml-4 mb-1 list-decimal" dangerouslySetInnerHTML={{ __html: content }} />;
      }
      if (line.startsWith("- ")) {
        const content = line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return <li key={i} className="text-[13px] text-foreground/90 leading-relaxed ml-4 mb-1 list-disc" dangerouslySetInnerHTML={{ __html: content }} />;
      }
      if (line.trim() === "") return <div key={i} className="h-3" />;
      const content = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return <p key={i} className="text-[13px] text-foreground/80 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: content }} />;
    });
  };

  return (
    <div className="flex h-full animate-fade-in">
      {/* Doc sidebar */}
      <div className="w-60 border-r border-border flex flex-col bg-[hsl(var(--sidebar-background))] flex-shrink-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5 text-muted-foreground">
            <Icon name="Search" size={13} />
            <input placeholder="Поиск по документам..." className="bg-transparent text-[12px] outline-none flex-1 placeholder:text-muted-foreground" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {docs.map(section => (
            <div key={section.id} className="mb-1">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-secondary/60 text-left transition-colors"
              >
                <Icon name={expandedSections.includes(section.id) ? "ChevronDown" : "ChevronRight"} size={12} className="text-muted-foreground" />
                <span className="text-[13px]">{section.icon}</span>
                <span className="text-[12px] font-medium text-foreground">{section.title}</span>
              </button>

              {expandedSections.includes(section.id) && (
                <div className="ml-4 mt-0.5 space-y-0.5 animate-fade-in">
                  {section.children.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => openDoc(doc)}
                      className={`doc-sidebar-item w-full text-left px-3 py-1.5 rounded-lg text-[12px] ${activeDoc.id === doc.id ? "active" : "text-muted-foreground"}`}
                    >
                      {doc.title}
                    </button>
                  ))}
                  <button className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                    <Icon name="Plus" size={11} />
                    Новая страница
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-border">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors">
            <Icon name="Plus" size={14} />
            Новый раздел
          </button>
        </div>
      </div>

      {/* Doc content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Doc toolbar */}
        <div className="px-6 py-3 border-b border-border flex items-center justify-between bg-background/60">
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <span>Документация</span>
            <Icon name="ChevronRight" size={12} />
            <span className="text-foreground">{activeDoc.title}</span>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg text-[12px] text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-white hover:opacity-90 transition-all"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  Сохранить
                </button>
              </>
            ) : (
              <>
                <button onClick={startEdit} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                  <Icon name="Edit2" size={13} />
                  Редактировать
                </button>
                <button className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                  <Icon name="Share2" size={14} />
                </button>
                <button className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                  <Icon name="MoreHorizontal" size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isEditing ? (
            <div className="h-full p-8">
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="w-full h-full bg-transparent text-[13px] text-foreground font-mono outline-none resize-none leading-relaxed"
                placeholder="Начните писать в формате Markdown..."
              />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto p-8">
              <div className="mb-6 pb-4 border-b border-border">
                <h1 className="text-2xl font-bold gradient-text mb-2">{activeDoc.title}</h1>
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Icon name="Clock" size={11} /> Обновлено сегодня</span>
                  <span className="flex items-center gap-1.5"><Icon name="User" size={11} /> Алексей Петров</span>
                  <span className="flex items-center gap-1.5"><Icon name="Eye" size={11} /> 24 просмотра</span>
                </div>
              </div>
              <div className="prose-custom">
                {renderMarkdown(activeDoc.content)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
