import { Skeleton } from "@/shared/components/ui/Skeleton";
import { Container } from "@/shared/components/layout/Container";

export default function PageLoading() {
  return (
    <main
      className="space-y-12 py-6 md:py-8"
      role="status"
      aria-label="Loading page"
    >
      <span className="sr-only">Loading page...</span>

      {/* Hero Skeleton */}
      <Skeleton className="h-[50vh] min-h-80 w-full rounded-panel md:h-[70vh] lg:h-[80vh]" />

      <Container>
        {/* Categories / Featured Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton
              key={index}
              className="h-64 w-full rounded-panel"
            />
          ))}
        </div>

        {/* Content Section */}
        <div className="mt-12 space-y-4">
          <Skeleton className="h-8 w-1/3 rounded-control" />
          <Skeleton className="h-48 w-full rounded-panel" />
        </div>
      </Container>
    </main>
  );
}