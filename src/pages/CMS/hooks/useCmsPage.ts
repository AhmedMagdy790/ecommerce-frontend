import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/shared/context/LanguageContext";
import { storeApi } from "@/api/client";

export function useCmsPage(slug: string | undefined) {
  const { lang } = useLang();

  return useQuery({
    queryKey: ["cms", "page", slug, lang],
    enabled: !!slug,
    queryFn: () => {
      if (!slug) {
        throw new Error("Missing page slug");
      }
      return storeApi.getPageBySlug(slug);
    },
    select: (response: any) => response?.data?.page,
    staleTime: 0, // تجنب الحفظ الزائد عند الاختبار
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
