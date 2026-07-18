import { useQuery } from "@tanstack/react-query";
import SectionRenderer from "./components/SectionRenderer";
import PageLoading from "./components/ui/PageLoading";
import PageError from "./components/ui/PageError";
import { fetchMockHomePageData } from "./services/mockPageService";

export default function HomePage() {
  // 1. Fetching logic: Using React Query for enterprise-grade caching/loading
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['page', 'home'],
    queryFn: fetchMockHomePageData,
    // Enterprise configuration:
    staleTime: 1000 * 60 * 5, // 5 minutes before fresh fetch
    retry: 1,
  });

  // 2. Loading State: Uses the Skeleton pattern to prevent Layout Shift
  if (isLoading) return <PageLoading />;

  // 3. Error State: Provides a "Try Again" mechanism using refetch()
  if (error) {
    return (
      <PageError 
        message={error instanceof Error ? error.message : "Failed to load home page"} 
        onRetry={refetch} 
      />
    );
  }

  // 4. Success State: Declarative and clean
  return (
    <main>
      {/* 
        SectionRenderer now expects 'sections' array.
        It handles the logic of mapping and spreading the 'data' 
        properties to your UI components.
      */}
      <SectionRenderer sections={data?.sections || []} />
    </main>
  );
}