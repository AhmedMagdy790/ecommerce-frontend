
export function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-[var(--spacing-4)] py-[var(--spacing-12)] max-w-[var(--container-lg)]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-[var(--spacing-8)]">
        <div className="h-64 bg-[var(--color-surface-secondary)] animate-pulse rounded-[var(--radius-2xl)] lg:col-span-1"></div>
        <div className="h-96 bg-[var(--color-surface-secondary)] animate-pulse rounded-[var(--radius-2xl)] lg:col-span-3"></div>
      </div>
    </div>
  );
}