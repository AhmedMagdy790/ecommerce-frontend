import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

interface UseProductSearchOptions {
  debounceMs?: number;
  paramName?: string;
}

export const useProductSearch = ({
  debounceMs = 500,
  paramName = "search",
}: UseProductSearchOptions = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 1. القيمة الأولية المأخوذة من الـ URL عند فتح الصفحة
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get(paramName) || ""
  );

  // 2. تطبيق التأخير (Debounce) وتحديث الـ URL Params فقط بعد توقف المستخدم عن الكتابة
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQuery = searchParams.get(paramName) || "";
      const trimmedSearch = searchTerm.trim();
      
      if (trimmedSearch !== currentQuery) {
        setSearchParams(
          (prevParams) => {
            const newParams = new URLSearchParams(prevParams);
            if (trimmedSearch) {
              newParams.set(paramName, trimmedSearch);
            } else {
              newParams.delete(paramName);
            }
            newParams.set("page", "1");
            return newParams;
          },
          { replace: true } // لتجنب تراكم كل حرف في سجل المتصفح History
        );
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs, paramName, searchParams, setSearchParams]);

  // 4. دالة لمسح البحث سريعاً
  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.delete(paramName);
      newParams.set("page", "1");
      return newParams;
    });
  }, [paramName, setSearchParams]);

  return {
    searchTerm,
    setSearchTerm,
    clearSearch,
    isSearching: Boolean(searchTerm.trim()),
  };
};