import { useEffect, useCallback, useState } from "react";
import { useSectionStore } from "@/features/cms/section/model/store/useSectionStore";
import type { Section } from "@/features/cms/section/model/types/section.types";
import { usePageStore } from "../../model/store/usePageStore";

export function usePageBuilder(pageId: number | undefined) {
  const { 
    selectedItem: page, 
    getPageById: fetchPage,
    isFetching: isPageFetching 
  } = usePageStore();

  const { 

    setPerPage,


    items: sections, 
    fetch: fetchSections, 
    update: updateSection, 
    delete: deleteSection,
    toggleStatus: toggleSectionStatus,
    isFetching: isSectionsFetching 
  } = useSectionStore();

  setPerPage(30);
  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  // جلب البيانات الأساسية عند تحميل الصفحة لأول مرة فقط
  const loadBuilderData = useCallback(async () => {
    if (!pageId) return;
    await Promise.all([
      fetchPage(pageId),
      fetchSections({ page_id: pageId }),
    ]);
  }, [pageId, fetchPage, fetchSections]);

  useEffect(() => {
    loadBuilderData();
  }, [loadBuilderData]);

  const openAddModal = () => {
    setEditingSection(null);
    setIsModalOpen(true);
  };

  const openEditModal = (section: Section) => {
    console.log("section", section)
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingSection(null);
    setIsModalOpen(false);
  };

  // تحديث الترتيب (بدون إعادة جلب القائمة كاملة، الاعتماد على الـ Store)
  const handleUpdateSectionOrder = async (sectionId: string | number, newSortOrder: number) => {
    try {
      await updateSection(sectionId, { sort_order: newSortOrder });
    } catch (error) {
      console.error("Failed to update section order", error);
    }
  };

  // تبديل الحالة محلياً عبر الـ Store بدون fetch إضافي
  const handleToggleSectionStatus = async (sectionId: string | number) => {
    try {
      await toggleSectionStatus(sectionId);
    } catch (error) {
      console.error("Failed to toggle section status", error);
    }
  };

  // حذف القسم محلياً عبر الـ Store بدون طلب fetch إضافي
  const handleDeleteSection = async (sectionId: string | number) => {
    try {
      await deleteSection(sectionId);
    } catch (error) {
      console.error("Failed to delete section", error);
    }
  };

  return {
    page,
    pageId,
    sections,
    isLoading: isPageFetching || isSectionsFetching,
    isModalOpen,
    editingSection,
    openAddModal,
    openEditModal,
    closeModal,
    handleUpdateSectionOrder,
    handleToggleSectionStatus,
    handleDeleteSection,
    refetchSections: () => pageId && fetchSections({ page_id: pageId }),
  };
}