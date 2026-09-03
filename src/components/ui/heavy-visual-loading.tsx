export function HeavyVisualLoading({ label = "Loading dashboard visuals" }: { label?: string }) {
  return (
    <div className="grid gap-6" role="status" aria-label={label}>
      <span className="sr-only">{label}</span>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="panel h-32 animate-pulse bg-[var(--soft)]" aria-hidden="true" key={index} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="panel h-[360px] animate-pulse bg-[var(--soft)]" aria-hidden="true" />
        <div className="panel h-[360px] animate-pulse bg-[var(--soft)]" aria-hidden="true" />
      </div>
    </div>
  );
}
