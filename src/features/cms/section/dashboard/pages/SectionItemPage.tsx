import { useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LayersIcon, PlusIcon } from "lucide-react";
import DataTable from "@/shared/components/DataTable/DataTable";
import { useLang } from "@/shared/context/LanguageContext";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";

import { getSectionItemColumns } from "../constants/sectionItemColumns";
import { useSectionItemPage } from "../hooks/useSectionItemPage";
import type { SectionItem } from "../../model/types/sectionItem.types";
import { SectionItemModal } from "../components/SectionItemModal";
import type { TranslatedText } from "@/shared/types/types";

export default function SectionItemPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const { t } = useTranslation("cms"); 
  const { lang } = useLang();
  const navigate = useNavigate();

  const {
    currentData,
    pagination,
    handleServerFilterOrPageChange,
    sectionItemFilters,

    isModalOpen,
    editingSectionItem,
    openCreateModal,
    openEditModal,
    closeModal,

    handleDelete,
  } = useSectionItemPage(sectionId);

  const handleDeleteRow = useCallback(
    (item: SectionItem) => handleDelete(item.id),
    [handleDelete]
  );

  const columns = useMemo(
    () =>
      getSectionItemColumns({
        t,
        lang,
      }),
    [t, lang]
  );


  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header & Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-alt)] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
          <LayersIcon className="w-6 h-6 text-[var(--color-primary)] shrink-0" />
          <span>{lang === "ar" ? "إدارة عناصر القسم" : "Section Items Management"}</span>
        </h1>

        <div className="flex items-center gap-3">
          <Button onClick={openCreateModal} className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            <span>{lang === "ar" ? "إضافة عنصر" : "Add Item"}</span>
          </Button>
        </div>
      </div>

      

      {/* DataTable Component */}
      <DataTable<SectionItem<TranslatedText>>
        data={currentData}
        meta={pagination}
        paginationMode={pagination?.type || "server"}
        filterSideServer={handleServerFilterOrPageChange}
        columns={columns}
        filterFields={sectionItemFilters}
        onDelete={handleDeleteRow}
        onEdit={(item) => openEditModal(item)}
      />

      {/* Section Item Modal (Create / Edit) */}
      <SectionItemModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        sectionId={Number(sectionId)}
        editingItem={editingSectionItem}
      />
    </div>
  );
}