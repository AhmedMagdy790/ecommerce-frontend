import { useEffect, useState } from "react";
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

import { useNavigationItemsManager } from "../hook/useNavigationItemsManager";
import NavigationItemModal from "../components/NavigationItemModal";
import NavigationItemCard from "../components/NavigationItemCard";
import { Button } from "@/shared/components/Button";
import type { TranslatedText } from "@/shared/types/types";
import type { NavMenuItem } from "../../model/types/navigation.types";
import { useModal } from "@/shared/hooks/useModal";

export default function NavigationItemsPage() {
  const navigate = useNavigate();

  const { menuId } = useParams<{ menuId: string }>();
  const numericMenuId = menuId ? Number(menuId) : 0;

  useEffect(() => {
  if (!menuId || isNaN(Number(menuId))) {
    navigate("/admin/cms/navigation", { replace: true });
  }
}, [menuId, navigate]);
  
  const { t, i18n } = useTranslation("cms");
  const currentLang = i18n.language;

  const {
    items,
    isLoading,
    error,
    refetch,
    handleDeleteItem,
    handleUpdateItemOrder,
  } = useNavigationItemsManager(numericMenuId);

  console.log("items", items)

  const {
    isOpen: isModalOpen,
    editingItem,
    openCreateModal,
    openEditModal,
    closeModal: handleCloseModal,
  } = useModal<NavMenuItem<TranslatedText>>();

  const [activeParentId, setActiveParentId] = useState<number | null>(null);

  const openAddModal = (parentId: number | null = null) => {
    setActiveParentId(parentId);
    openCreateModal();
  };

  const openItemEditModal = (item: NavMenuItem<TranslatedText>) => {
    setActiveParentId(item.parent_id ?? null);
    openEditModal(item);
  };

  const closeModal = () => {
    handleCloseModal();
    setActiveParentId(null);
    refetch();
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      arrayMove(items, oldIndex, newIndex);
      
      if (handleUpdateItemOrder) {
        await handleUpdateItemOrder(active.id, newIndex + 1);
      }
      refetch();
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
              {t("navigation.itemsManagement", "إدارة عناصر القائمة")}
            </h1>
            <span className="text-xs text-[var(--color-text-muted)]">
              {t("navigation.itemsPageSubtitle", "إعادة ترتيب وإدارة روابط وصفحات القائمة")}
            </span>
          </div>
        </div>

        <Button onClick={() => openAddModal(null)} className="flex items-center gap-2">
          <Plus size={18} />
          <span>{t("navigation.addItem", "إضافة عنصر")}</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 text-sm text-white bg-red-500 rounded-xl">
          {error}
        </div>
      )}

      {/* صندوق عرض عناصر القائمة وترتيبها */}
      <div className="bg-[var(--color-background)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[var(--color-border)]">
          <Layers className="text-[var(--color-primary)]" size={22} />
          <h3 className="font-bold text-lg text-[var(--color-text-primary)]">
            {t("navigation.itemsList", "عناصر القائمة")} ({items.length})
          </h3>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            <p>{t("navigation.noItems", "لا توجد عناصر مضافة حتى الآن. ابدأ بإضافة أول عنصر.")}</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <NavigationItemCard
                    key={item.id}
                    item={item}
                    index={index}
                    lang={currentLang}
                    onEdit={openItemEditModal}
                    onDelete={handleDeleteItem}
                    onAddSubItem={(parentId) => openAddModal(parentId)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <NavigationItemModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        navMenuId={numericMenuId}
        parentId={activeParentId}
        item={editingItem}
      />
    </div>
  );
}