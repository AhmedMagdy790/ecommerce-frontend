import { useQuery } from "@tanstack/react-query";
import { cmsService } from "../services/cmsService";
import { useLang } from "@/shared/context/LanguageContext";
// import type { Page } from "../types"; // قم بفك التعليق وتعديل النوع حسب مشروعك

export function useHomePage() {
  const { lang } = useLang();

  return useQuery({
    queryKey: ["cms", "page", "home", lang],

    queryFn: () => cmsService.getPage("home"),

    select: (response: any) => response?.data?.page,

    staleTime: 1000 * 60 * 5, // 5 دقائق
    gcTime: 1000 * 60 * 30,  // 30 دقيقة

    retry: 1,
    refetchOnWindowFocus: false,
  });
}