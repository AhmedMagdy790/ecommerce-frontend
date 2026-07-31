import { Skeleton } from "@/shared/components/ui/Skeleton";

export default function PageLoading() {
  return (
    <div className="space-y-spacing-12 p-spacing-4">
      {/* Hero Skeleton - matches your LuxuryHero height */}
      <Skeleton className="w-full h-[80vh] rounded-2xl" />
      
      {/* Grid Section Skeleton - matches Categories/Featured */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
      
      {/* Content Section Skeleton */}
      <Skeleton className="w-full h-48" />
    </div>
  );
}