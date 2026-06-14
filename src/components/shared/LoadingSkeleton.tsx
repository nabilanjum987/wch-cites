export function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export function BreakingBarSkeleton() {
  return (
    <div className="h-10 bg-gray-200 animate-pulse rounded" />
  );
}

export function TabSkeleton() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-9 w-24 bg-gray-200 rounded-full flex-shrink-0 animate-pulse" />
      ))}
    </div>
  );
}
