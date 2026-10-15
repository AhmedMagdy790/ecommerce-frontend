import { useCallback, useMemo, type ComponentProps } from "react";
import { FileTextIcon, PlusIcon } from "lucide-react";
import DataTable from "@/shared/components/DataTable/DataTable";
import { useLang } from "@/shared/context/LanguageContext";
import { Button } from "@/shared/components/Button";

import { getPageColumns } from "../constants/pageColumns";
import { useTranslation } from "react-i18next";
import { usePagePage } from "../hooks/usePagePage";
import PageModal from "../modal/PageModal";
import type { TranslatedText } from "@/shared/types/types";
import type { Page } from "../../model/types/page.types";

export default function PagePage() {
  const { t } = useTranslation("cms"); 
  const { lang } = useLang();

  const {
    // من usePageTable
    currentData,
    isLoading,
    pagination,
    handleServerFilterOrPageChange,
    pageFilters,

    // من usePageModal
    isModalOpen,
    editingPage,
    openCreateModal,
    openEditModal,
    closeModal,

    // من usePageActions
    handleDelete,
    handleStatusChange,
    togglingId,
  } = usePagePage();


  const handleDeleteRow = useCallback(
    (item: Page) => handleDelete(item.id),
    [handleDelete]
  );

  const columns = useMemo(
    () =>
      getPageColumns({
        t,
        lang,
        togglingId,
        onStatusChange: handleStatusChange,
      }),
    [t, lang, togglingId, handleStatusChange]
  );

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header & Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
          <FileTextIcon className="w-6 h-6 text-[var(--color-primary)] shrink-0" />
          <span>{lang === "ar" ? "إدارة صفحات الموقع" : "CMS Pages Management"}</span>
        </h1>

        <div className="flex items-center gap-3">
          <Button onClick={openCreateModal} className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            <span>{lang === "ar" ? "إضافة صفحة" : "Add Page"}</span>
          </Button>
        </div>
      </div>

      {/* DataTable Component */}
      <DataTable<Page<TranslatedText>>
        data={currentData}
        loading={isLoading}
        meta={pagination}
        paginationMode={pagination?.type || "server"}
        filterSideServer={handleServerFilterOrPageChange}
        columns={columns}
        filterFields={pageFilters}
        onDelete={handleDeleteRow}
        onEdit={(item) => openEditModal(item)}
      />

      {/* Page Modal (Create / Edit) */}
      <PageModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        page={editingPage as unknown as ComponentProps<typeof PageModal>["page"]}
      />
    </div>
  );
}