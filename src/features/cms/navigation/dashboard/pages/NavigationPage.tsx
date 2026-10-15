import { useCallback, useMemo } from "react";
import { MenuIcon, PlusIcon } from "lucide-react";
import DataTable from "@/shared/components/DataTable/DataTable";
import type { TranslatedText } from "@/shared/types/types";
import { useLang } from "@/shared/context/LanguageContext";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";
import { useNavigationPage } from "../hook/useNavigationPage.ts";
import type { NavMenu } from "../../model/types/navigation.types.ts";
import NavigationModal from "../components/NavigationModal.tsx";
import { getNavigationColumns } from "../constants/NavigationColumns.tsx";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "../constants/routes.ts";


export default function NavigationPage() {
  const { t } = useTranslation("navigation");
  const navigate = useNavigate();
  const { lang } = useLang();

  const {
    currentData,
    isLoading,
    pagination,
    handleServerFilterOrPageChange,
    navigationFilters,

    isOpen: isModalOpen,
    editingItem: editingMenu,
    openCreateModal,
    openEditModal,
    closeModal,

    handleDelete,
    handleStatusChange,
    togglingId,
  } = useNavigationPage();

  const handleDeleteRow = useCallback(
    (item: NavMenu<TranslatedText>) => handleDelete(item.id),
    [handleDelete]
  );

  const columns = useMemo(
    () =>
      getNavigationColumns({
        t,
        lang,
        togglingId,
        onStatusChange: handleStatusChange,
        onManageItems: (menu) => {
          navigate(ADMIN_ROUTES.CMS.NAVIGATION.ITEMS(menu.id));
        },
      }),
    [t, lang, togglingId, handleStatusChange, navigate]
  );
  
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header & Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
          <MenuIcon className="w-6 h-6 text-[var(--color-primary)] shrink-0" />
          <span>{lang === "ar" ? "إدارة القوائم (Navigation)" : "Navigation Management"}</span>
        </h1>

        <div className="flex items-center gap-3">
          <Button onClick={openCreateModal} className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            <span>{lang === "ar" ? "إضافة قائمة جديدة" : "Add Menu"}</span>
          </Button>
        </div>
      </div>

      {/* DataTable Component */}
      <DataTable<NavMenu<TranslatedText>>
        data={currentData}
        loading={isLoading}
        meta={pagination}
        paginationMode={pagination?.type || "server"}
        filterSideServer={handleServerFilterOrPageChange}
        columns={columns} 
        filterFields={navigationFilters}
        onDelete={handleDeleteRow}
        onEdit={(item) => openEditModal(item)}
      />

      {/* Navigation Modal (Create / Edit) */}
      <NavigationModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        menu={editingMenu}
      />
    </div>
  );
}