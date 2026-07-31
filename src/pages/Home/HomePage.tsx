// src/pages/Home/HomePage.tsx
import SectionRenderer from "./components/SectionRenderer";
import PageLoading from "./components/ui/PageLoading";
import PageError from "./components/ui/PageError";
import { useLang } from "@/shared/context/LanguageContext";
import { useHomePage } from "./hook/useHomePage";

export default function HomePage() {
  const { lang } = useLang();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useHomePage();

  if (isLoading) {
    return <PageLoading />;
  }

// if (data?.page?.sections) {
//   console.log(
//     "Sections Data:",

//     data.page.sections.map((section) => ({
//         ID: section.id,
//         Key: section.key,
//         Type: section.type,
//         SortOrder: section.sort_order,
//         NameAr: section.name?.ar,
//       }))
//     );
//   }

  if (error) {
    return (
      <PageError
        message={
          error instanceof Error
            ? error.message
            : lang === "ar"
              ? "فشل تحميل الصفحة"
              : "Failed to load page"
        }
        onRetry={refetch}
      />
    );
  }



  return (
    <main className="flex flex-col gap-12 pb-16">
      <SectionRenderer 
        sections={data?.page.sections ?? []}
      />
    </main>
  );
}