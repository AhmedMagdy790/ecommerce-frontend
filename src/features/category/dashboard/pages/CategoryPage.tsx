// src/pages/categories/ui/CategoryPage.tsx
import { useCallback, useMemo } from "react";
import { FolderTreeIcon, PlusIcon } from "lucide-react";
import DataTable from "@/shared/components/DataTable/DataTable";
import type { Category } from "../../model/types/category.types";
import type { TranslatedText } from "@/shared/types/types";
import { useLang } from "@/shared/context/LanguageContext";
import { Button } from "@/shared/components/Button";

import { getCategoryColumns } from "../constants/CategoryColumns";
import { useTranslation } from "react-i18next";
import { useCategoryPage } from "../hook/useCategoryPage";
import CategoryModal from "../modal/CategoryModal";
import ShippingStats from "@/features/shipping/dashboard/components/ShippingStats";

export default function CategoryPage() {
  const { t } = useTranslation("category");
  const { lang } = useLang();

  const {
    // من useCategoryTable
    currentData,
    status,
    isLoading,
    pagination,
    showTrashed,
    setShowTrashed,
    handleServerFilterOrPageChange,

    categoryFilters,

    // من useCategoryModal
    isOpen: isModalOpen,
    editingItem: editingCategory,
    openCreateModal,
    openEditModal,
    closeModal,

    // من useCategoryActions
    handleDelete,
    handleRestore,
    handleStatusChange,
    togglingId
    
  } = useCategoryPage();

  const handleDeleteRow = useCallback(
    (item: Category<TranslatedText>) => handleDelete(item.id),
    [handleDelete]
  );

  const columns = useMemo(
    () =>
      getCategoryColumns({
        t,
        lang,
        showTrashed,
        togglingId,
        onStatusChange: handleStatusChange,
      }),
    [t, lang, showTrashed, togglingId, handleStatusChange]
  );

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header & Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
          <FolderTreeIcon className="w-6 h-6 text-[var(--color-primary)] shrink-0" />
          <span>{lang === "ar" ? "إدارة الأقسام" : "Category Management"}</span>
        </h1>

        <div className="flex items-center gap-3">
          <Button
            variant={showTrashed ? "outline" : "secondary"}
            onClick={() => setShowTrashed(!showTrashed)}
          >
            {showTrashed
              ? lang === "ar"
                ? "عرض النشط"
                : "View Active"
              : lang === "ar"
              ? "الأرشيف"
              : "View Trashed"}
          </Button>

          {!showTrashed && (
            <Button onClick={openCreateModal} className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              <span>{lang === "ar" ? "إضافة قسم" : "Add Category"}</span>
            </Button>
          )}
        </div>
      </div>

      <ShippingStats showTrashed={false} stats={status} />

      {/* DataTable Component */}
      <DataTable<Category<TranslatedText>>
        data={currentData}
        loading={isLoading}
        showTrashed={showTrashed}
        meta={pagination}
        paginationMode={pagination?.type || "server"}
        filterSideServer={handleServerFilterOrPageChange}
        columns={columns} 
        filterFields={categoryFilters}
        onDelete={handleDeleteRow}
        onEdit={(item) => openEditModal(item)}
        onRestore={(item) => handleRestore(item.id)}
      />

      {/* Category Modal (Create / Edit) */}
      <CategoryModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        category={editingCategory}
      />
    </div>
  );
}