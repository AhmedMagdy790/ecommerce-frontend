import { useParams } from "react-router-dom";
import { useLang } from "@/shared/context/LanguageContext";
import SectionRenderer from "@/pages/Home/components/SectionRenderer";
import PageLoading from "@/pages/Home/components/ui/PageLoading";
import PageError from "@/pages/Home/components/ui/PageError";
import SEO from "@/shared/components/seo/SEO";
import { useCmsPage } from "./hooks/useCmsPage";

export default function DynamicCmsPage() {
  const { slug } = useParams();
  const { lang } = useLang();
  const { data, isLoading, error, refetch } = useCmsPage(slug);

  if (!slug) {
    return (
      <PageError
        message={lang === "ar" ? "الرابط غير صالح" : "Invalid link"}
        onRetry={refetch}
      />
    );
  }

  if (isLoading) {
    return <PageLoading />;
  }

  if (error || !data) {
    return (
      <PageError
        message={
          error instanceof Error
            ? error.message
            : lang === "ar"
              ? "لم يتم العثور على هذه الصفحة"
              : "Page not found"
        }
        onRetry={refetch}
      />
    );
  }

  // استخراج بيانات الصفحة بأمان (سواء كانت داخل data مباشرة أو داخل data.page)
  const pageObject = data?.page ?? data;
  const sectionsData = pageObject?.sections ?? [];

  const pageTitle = pageObject?.meta_title || pageObject?.title || slug;
  const pageDescription = pageObject?.meta_description;
  const canonicalUrl = `${import.meta.env.VITE_APP_URL}/${slug}`;


  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
      />

      {/* عرض الأقسام ديناميكياً عبر المنسق */}
      <main className="flex flex-col gap-12 pb-16">
        <SectionRenderer sections={sectionsData} />
      </main>
    </>
  );
}