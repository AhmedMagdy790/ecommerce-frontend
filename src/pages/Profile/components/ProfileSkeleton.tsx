
import { Container } from "@/shared/components/layout/Container";

export function ProfileSkeleton() {
  return (
    <Container>
      <div
        className="mx-auto w-full max-w-5xl animate-pulse py-6 sm:py-10"
        role="status"
        aria-label="Loading profile"
      >
        <span className="sr-only">Loading profile...</span>

        <div className="mb-8 space-y-3">
          <div className="h-8 w-48 rounded-lg bg-surface-secondary sm:h-9" />
          <div className="h-4 w-full max-w-md rounded-md bg-surface-secondary" />
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6">
          <div className="min-h-48 rounded-xl border border-border bg-surface-secondary lg:col-span-1" />
          <div className="min-h-72 rounded-xl border border-border bg-surface-secondary lg:col-span-3" />
        </div>
      </div>
    </Container>
  );
}