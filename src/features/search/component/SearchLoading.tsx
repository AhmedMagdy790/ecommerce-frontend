export default function SearchLoading() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="
            flex
            items-center
            gap-4
            rounded-xl
            border
            border-[var(--color-border)]
            p-3
          "
        >
          <div
            className="
              h-16
              w-16
              animate-pulse
              rounded-lg
              bg-[var(--color-surface-secondary)]
            "
          />

          <div className="flex-1 space-y-2">
            <div
              className="
                h-4
                w-3/4
                animate-pulse
                rounded
                bg-[var(--color-surface-secondary)]
              "
            />

            <div
              className="
                h-3
                w-1/2
                animate-pulse
                rounded
                bg-[var(--color-surface-secondary)]
              "
            />

            <div
              className="
                h-4
                w-20
                animate-pulse
                rounded
                bg-[var(--color-surface-secondary)]
              "
            />
          </div>
        </div>
      ))}
    </div>
  );
}