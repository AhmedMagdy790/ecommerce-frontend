import React, { useEffect, useRef, useState, useCallback } from "react";
import { PlusIcon, LayersIcon, TagIcon } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";
import DataTable from "@/shared/components/DataTable/DataTable";
import { type FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import { useCategoryStore } from "../store/useCategoryStore";
import CategoryModal from "../modal/CategoryModal";
import { type ICategory } from "../types/types";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";
import { Button } from "@/shared/components/Button";

export default function CategoryPage() {
  const { lang } = useLang();
  const [showTrashed, setShowTrashed] = useState<boolean>(false);
  const { show, hide } = useStatusStore.getState();

  const {
    fetchAdminCategories,
    fetchTrashed,
    adminCategories,
    trashedCategories,
    isLoading,
    stats,
    restoreCategory,
    deleteCategory,
    toggleCategoryStatus,
  } = useCategoryStore();

  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isFetching = useRef(false);

  const loadData = useCallback(async () => {
    isFetching.current = true;

    try {
      if (showTrashed) {
        await fetchTrashed();
      } else {
        await fetchAdminCategories();
      }
    } catch (error) {
      console.error(error);
    } finally {
      isFetching.current = false;
    }
  }, [showTrashed, fetchTrashed, fetchAdminCategories]);

  useEffect(() => {
    if (isLoading || isFetching.current) return;
    loadData();
  }, [loadData]);

  const categoryFilters: FilterField[] = [
    {
      key: "name",
      label: lang === "ar" ? "اسم القسم" : "Category Name",
      type: "text",
      placeholder: "Search...",
    },
    {
      key: "status",
      label: lang === "ar" ? "الحالة" : "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ];

  const handleEdit = (category: ICategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleRestore = async (id: number | string) => {
    restoreCategory(id);
    fetchTrashed();
  };

  const handleDelete = async (id: number | string) => {
    const result = await confirm({
      title: "Delete Address",
      description: "Are you sure?",
      confirmText: "Confirm",
      cancelText: "Cancel",
    });

    if (!result || !id) return;

    deleteCategory(id);
    fetchTrashed();
  };

  const handleToggleCategoryStatus = (id: number | string, status: string) => {
    if (showTrashed) {
      confirm({
        title: "",
        description: "لا يمكن تغير فوضع الحذف الامن?",
        confirmText: "Confirm",
        cancelText: "Cancel",
      });
      return;
    }
    toggleCategoryStatus(id, status);
  };

  const categoryColumns = [
    {
      header: lang === "ar" ? "الاسم" : "Name",
      accessor: "name",
    },
    {
      header: lang === "ar" ? "الصورة" : "Image",
      accessor: (item: ICategory) => (
        <img
          src={item.image}
          alt={item.name}
          className="w-10 h-10 object-cover rounded-[var(--radius-md)] border border-[var(--color-border)]"
        />
      ),
    },
    {
      header: lang === "ar" ? "القسم الأب" : "Parent Category",
      accessor: (item: ICategory) => {
        const parent = item?.parent;
        return parent ? parent.name : (lang === "ar" ? "قسم رئيسي" : "Main Category");
      },
    },
    {
      header: lang === "ar" ? "الحالة" : "Status",
      accessor: (item: ICategory) => (
        <button
          type="button"
          onClick={() => handleToggleCategoryStatus(item.id, item.status)}
          className={`
            px-3 
            py-1 
            rounded-full 
            text-xs 
            font-medium 
            transition-colors 
            cursor-pointer
            ${
              item.status === "active"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-[var(--red-500)]/10 text-[var(--red-500)] border border-[var(--red-500)]/20"
            }
          `}
        >
          {item.status === "active" ? (lang === "ar" ? "نشط" : "Active") : (lang === "ar" ? "معطل" : "Inactive")}
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8" style={{ fontFamily: "var(--font-outfit)" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
            <div className="p-2.5 bg-[var(--color-primary)]/10 rounded-[var(--radius-xl)] border border-[var(--color-primary)]/20">
              <LayersIcon className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            {lang === "ar" ? "إدارة الأقسام" : "Manage Categories"}
          </h1>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
          leftIcon={<PlusIcon className="w-4 h-4" />}
        >
          {lang === "ar" ? "إضافة قسم جديد" : "Add New Category"}
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-[var(--card-bg)] rounded-[var(--radius-xl)] shadow-[var(--shadow-xs)] border border-[var(--color-border)] flex items-center gap-4 backdrop-blur-xl">
          <div className="p-3 bg-[var(--color-primary)]/10 rounded-[var(--radius-lg)] border border-[var(--color-primary)]/20">
            <TagIcon className="text-[var(--color-primary)] w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-secondary)]">{lang === "ar" ? "إجمالي الأقسام" : "Total Categories"}</p>
            <p className="text-xl font-bold text-[var(--color-text-primary)]">{stats.all}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--color-border)] mb-6">
        <button
          type="button"
          onClick={() => setShowTrashed(false)}
          className={`
            pb-3 
            px-6 
            text-sm 
            font-medium 
            transition-colors 
            relative 
            cursor-pointer
            ${!showTrashed ? "text-[var(--color-primary)] font-bold" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}
          `}
        >
          {lang === "ar" ? "الأقسام النشطة" : "Active Categories"}
          {!showTrashed && <div className="absolute bottom-0 start-0 w-full h-0.5 bg-[var(--color-primary)]" />}
        </button>

        <button
          type="button"
          onClick={() => setShowTrashed(true)}
          className={`
            pb-3 
            px-6 
            text-sm 
            font-medium 
            transition-colors 
            relative 
            cursor-pointer
            ${showTrashed ? "text-[var(--red-500)] font-bold" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}
          `}
        >
          <div className="flex items-center gap-2">
            {lang === "ar" ? "الأرشيف" : "Archive"}
            <span className="bg-[var(--red-500)]/10 text-[var(--red-500)] border border-[var(--red-500)]/20 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {stats.trashed}
            </span>
          </div>
          {showTrashed && <div className="absolute bottom-0 start-0 w-full h-0.5 bg-[var(--red-500)]" />}
        </button>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-[var(--color-surface-secondary)] rounded-[var(--radius-lg)] animate-pulse border border-[var(--color-border)]" />
          ))}
        </div>
      ) : (
        <DataTable
          data={showTrashed ? trashedCategories : adminCategories}
          showTrashed={showTrashed}
          columns={categoryColumns}
          filterFields={categoryFilters}
          lang={lang}
          onDelete={(item) => handleDelete(item.id)}
          onEdit={(item) => handleEdit(item)}
          onRestore={(item) => handleRestore(item.id)}
          renderMobileCard={(item) => (
            <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-[var(--color-border)]">
              <div>
                <p className="font-bold text-sm text-[var(--color-text-primary)]">{item.name}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{item.slug}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${item.status === "active" ? "bg-emerald-500" : "bg-[var(--red-500)]"}`} />
            </div>
          )}
        />
      )}

      {/* Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
}