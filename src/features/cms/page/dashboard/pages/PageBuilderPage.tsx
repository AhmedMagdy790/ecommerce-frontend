import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  type DragEndEvent 
} from "@dnd-kit/core";
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy, 
  arrayMove 
} from "@dnd-kit/sortable";
import { Plus, ArrowLeft, Layers, Loader2 } from "lucide-react";

import { usePageBuilder } from "../hooks/usePageBuilder";
import SectionCard from "@/features/cms/section/dashboard/components/SectionCard";
import { Button } from "@/shared/components/Button";
import { getLocalizedName } from "@/shared/utils/localizeName";
import { useLang } from "@/shared/context/LanguageContext";
import { SectionModal } from "@/features/cms/section/dashboard/components/SectionModal";

export default function PageBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang } = useLang();
  const { t, i18n } = useTranslation("cms");
  const currentLang = i18n.language;

  const {
    page,
    pageId,
    sections,
    isLoading,
    isModalOpen,
    editingSection,
    openAddModal,
    openEditModal,
    closeModal,
    handleUpdateSectionOrder,
    handleDeleteSection,
    handleToggleSectionStatus,
    refetchSections,
  } = usePageBuilder(Number(id));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((sec) => sec.id === active.id);
      const newIndex = sections.findIndex((sec) => sec.id === over.id);

      arrayMove(sections, oldIndex, newIndex);
      await handleUpdateSectionOrder(active.id, newIndex + 1);
      refetchSections();
    }
  };

  // دالة التعامل مع تبديل حالة القسم
  const handleToggleStatus = async (sectionId: string | number) => {
    if (handleToggleSectionStatus) {
      await handleToggleSectionStatus(sectionId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* رأس الصفحة وأزرار التحكم */}
      <div className="flex items-center justify-between bg-[var(--color-background)] p-4 rounded-2xl border border-[var(--color-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-alt)] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
              {getLocalizedName(page?.title, lang) || "Page Builder"}
            </h1>
            <span className="text-xs text-[var(--color-text-muted)]">
              {t("pageBuilder.subtitle", "Manage and arrange page sections")}
            </span>
          </div>
        </div>

        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus size={18} />
          <span>{t("pageBuilder.addSection", "Add Section")}</span>
        </Button>
      </div>

      {/* صندوق عرض الأقسام وترتيبها */}
      <div className="bg-[var(--color-background)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[var(--color-border)]">
          <Layers className="text-[var(--color-primary)]" size={22} />
          <h3 className="font-bold text-lg text-[var(--color-text-primary)]">
            {t("pageBuilder.sectionsList", "Page Sections")} ({sections.length})
          </h3>
        </div>

        {sections.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            <p>{t("pageBuilder.noSections", "No sections added yet. Start by adding your first section.")}</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {sections.map((section, index) => (
                  <SectionCard
                    key={section.id}
                    section={section}
                    index={index}
                    lang={currentLang}
                    onEdit={openEditModal}
                    onDelete={handleDeleteSection}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <SectionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        pageId={pageId ?? Number(id)}
        editingSection={editingSection}
        onSectionSaved={refetchSections}
      />
    </div>
  );
}