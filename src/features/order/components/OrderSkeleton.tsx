

export const OrderSkeleton = () => {
  return (
    <main className="container mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-10">
      <div className="w-full animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-8 text-center">
        
        {/* Icon Placeholder */}
        <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-zinc-200" />

        {/* Title/Message Placeholders */}
        <div className="mx-auto h-8 w-3/4 rounded bg-zinc-200" />
        <div className="mx-auto mt-4 h-4 w-1/2 rounded bg-zinc-200" />

        {/* Details Placeholder */}
        <div className="mt-8 space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-20 rounded bg-zinc-200" />
              <div className="h-4 w-24 rounded bg-zinc-200" />
            </div>
          ))}
        </div>

        {/* Button Placeholders */}
        <div className="mt-8 space-y-3">
          <div className="h-12 w-full rounded-xl bg-zinc-200" />
          <div className="h-12 w-full rounded-xl bg-zinc-200" />
        </div>
      </div>
    </main>
  );
};