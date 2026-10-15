import { useCallback, useMemo } from "react";
import { LayersIcon, PlusIcon } from "lucide-react";
import DataTable from "@/shared/components/DataTable/DataTable";
import { useLang } from "@/shared/context/LanguageContext";
import { Button } from "@/shared/components/Button";

import { getSectionColumns } from "../constants/sectionColumns";
import { useTranslation } from "react-i18next";
import { useSectionPage } from "../hooks/useSectionPage";
import type { Section } from "../../model/types/section.types";
import { SectionModal } from "../components/SectionModal";


export default function SectionPage() {
  const { t } = useTranslation("cms"); 
  const { lang } = useLang();

  const {
    // من useSectionTable أو useSectionStore
    currentData,
    pagination,
    handleServerFilterOrPageChange,
    sectionFilters,

    // من useSectionModal
    isModalOpen,
    editingSection,
    openCreateModal,
    openEditModal,
    closeModal,

    // من useSectionActions
    handleDelete,
    handleStatusChange,
    togglingId,
  } = useSectionPage();

  const handleDeleteRow = useCallback(
    (item: Section) => handleDelete(item.id),
    [handleDelete]
  );

  const columns = useMemo(
    () =>
      getSectionColumns({
        t,
        lang,
        togglingId,
        onStatusChange: handleStatusChange,
        onEdit: (item) => openEditModal(item),
        onDelete: handleDeleteRow,
      }),
    [t, lang, togglingId, handleStatusChange, openEditModal, handleDeleteRow]
  );

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header & Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
          <LayersIcon className="w-6 h-6 text-[var(--color-primary)] shrink-0" />
          <span>{lang === "ar" ? "إدارة أقسام الموقع" : "CMS Sections Management"}</span>
        </h1>

        <div className="flex items-center gap-3">
          <Button onClick={openCreateModal} className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            <span>{lang === "ar" ? "إضافة قسم" : "Add Section"}</span>
          </Button>
        </div>
      </div>

      {/* DataTable Component */}
      <DataTable<Section>
        data={currentData}
        // loading={isLoading}
        meta={pagination}
        paginationMode={pagination?.type || "server"}
        filterSideServer={handleServerFilterOrPageChange}
        columns={columns}
        filterFields={sectionFilters}
        onDelete={handleDeleteRow}
        onEdit={(item) => openEditModal(item)}
      />

      {/* Section Modal (Create / Edit) */}
      <SectionModal
        pageId={editingSection?.page_id ?? 0}
        isOpen={isModalOpen}
        onClose={closeModal}
        editingSection={editingSection}
      />
    </div>
  );
}