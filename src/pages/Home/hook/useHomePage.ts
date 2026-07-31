import { useQuery } from "@tanstack/react-query";
import { cmsService } from "../services/cmsService";
import { useLang } from "@/shared/context/LanguageContext";
import type { HomePageResponse } from "../types";

export function useHomePage() {
  const { lang } = useLang();

  return useQuery<HomePageResponse>({
    queryKey: ["cms", "page", "home", lang],

    queryFn: () => cmsService.getPage("home"),

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,

    retry: 1,
    refetchOnWindowFocus: false,
  });
}