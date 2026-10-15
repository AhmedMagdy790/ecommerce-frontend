import type { Section } from "@/features/cms/section/model/types/section.types";
import { useState, useEffect, useCallback } from "react";
import pageServices from "../../api/page.service";
import sectionServices from "@/features/cms/section/api/section.service";
import type { Page } from "../../model/types/page.types";
import type { TranslatedText } from "@/shared/types/types";

export function usePageBuilderData(pageId: string | undefined) {
  const [page, setPage] = useState<Page<TranslatedText> | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuilderData = useCallback(async () => {
    if (!pageId) return;

    try {
      setIsLoading(true);
      setError(null);

      // جلب تفاصيل الصفحة والأقسام التابعة لها بالتوازي
      const [pageRes, sectionsRes] = await Promise.all([
        pageServices.getPageById(pageId),
        sectionServices.getAll({ page_id: pageId }),
      ]);

      // استخراج البيانات بناءً على هيكل استجابة الـ API
      const pageData = pageRes.data?.page;
      const sectionsList = sectionsRes.data?.items || [];

      setPage(pageData);
      setSections(sectionsList);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load page builder data.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchBuilderData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchBuilderData]);

  return {
    page,
    sections,
    setSections,
    isLoading,
    error,
    refetch: fetchBuilderData,
  };
}