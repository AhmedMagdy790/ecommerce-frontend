// src/pages/Home/HomePage.tsx
import SectionRenderer from "./components/SectionRenderer";
import PageLoading from "./components/ui/PageLoading";
import PageError from "./components/ui/PageError";
import SEO from "@/shared/components/seo/SEO";
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

  // استخراج بيانات الـ SEO والمحتوى من الـ API (بعد تطبيق getTranslation أصبحت نصوصاً جاهزة مباشرة)
  const pageTitle = data?.meta_title || data?.title;
  const pageDescription = data?.meta_description;
  // const pageContent = data?.content;
  const canonicalUrl = `${import.meta.env.VITE_APP_URL}/`;

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
      />

      <main className="flex flex-col gap-12 pb-16">


        <SectionRenderer 
          sections={data?.sections ?? []}
        />
      </main>
    </>
  );
}