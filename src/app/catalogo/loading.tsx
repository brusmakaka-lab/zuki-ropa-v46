export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 h-20 max-w-lg animate-pulse rounded-md bg-black/10" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="aspect-[4/5] animate-pulse rounded-md bg-black/10" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-black/10" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-black/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
