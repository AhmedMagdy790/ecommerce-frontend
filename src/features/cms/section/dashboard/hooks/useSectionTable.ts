// src/features/cms/section/model/hooks/useSectionTable.ts

import { useState, useEffect, useCallback } from "react";
import { useSectionStore } from "../../model/store/useSectionStore";

interface UseSectionTableProps {
  pageId?: number;
  initialPerPage?: number;
}

export function useSectionTable({ pageId, initialPerPage = 10 }: UseSectionTableProps = {}) {
  const {
    items: sections,
    pagination,
    isFetching: isLoading,
    fetch: fetchSections,
    delete: deleteSection,
    toggleStatus: toggleSectionStatus,
    update: updateSection,
  } = useSectionStore();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage] = useState<number>(initialPerPage);

  const loadTableData = useCallback(async () => {
    const params: Record<string, any> = {
      page: currentPage,
      per_page: perPage,
    };

    if (pageId) {
      params.page_id = pageId;
    }

    await fetchSections(params);
  }, [currentPage, perPage, pageId, fetchSections]);

  useEffect(() => {
    loadTableData();
  }, [loadTableData]);

  // تغيير الصفحة (هنا فقط نحتاج جلب بيانات الصفحة الجديدة من السيرفر)
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // 1. تحديث الترتيب (محلياً أو إرسال الطلب بدون إعادة جلب كاملة للجدول إذا الـ store يحدث نفسه)
  const handleUpdateSectionOrder = async (sectionId: string | number, newSortOrder: number) => {
    try {
      await updateSection(sectionId, { sort_order: newSortOrder });
      // لا نحتاج لطلب fetch هنا إذا كان الـ store أو الـ backend يحدث الترتيب، 
      // أو يمكنك الاعتماد على الـ local state إذا أردت.
    } catch (error) {
      console.error("Failed to update section order", error);
    }
  };

  // 2. تبديل الحالة (بدون إعادة جلب البيانات - الاعتماد على تحديث الـ Store)
  const handleToggleSectionStatus = async (sectionId: string | number) => {
    try {
      // غالباً الـ toggleStatus في الـ Store يقوم بتحديث العنصر في المصفوفة مباشرة (Immutably)
      await toggleSectionStatus(sectionId);
    } catch (error) {
      console.error("Failed to toggle section status", error);
    }
  };

  // 3. الحذف (بدون إعادة جلب - الـ Store يزيل العنصر من الـ items مباشرة)
  const handleDeleteSection = async (sectionId: string | number) => {
    try {
      await deleteSection(sectionId);
      // الـ deleteSection في الـ Store المفترض أن يحذف العنصر من items محلياً
    } catch (error) {
      console.error("Failed to delete section", error);
    }
  };

  return {
    sections, // ستتحدث تلقائياً من الـ Store دون الحاجة لـ fetch جديد
    pagination: pagination || { current_page: currentPage, last_page: 1 },
    isLoading,
    currentPage,
    handlePageChange,
    handleUpdateSectionOrder,
    handleToggleSectionStatus,
    handleDeleteSection,
  };
}