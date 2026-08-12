export function SkeletonNewsCard() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex gap-3">
      <div className="skeleton w-20 h-20 shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-3 w-1/3" />
      </div>
    </div>
  );
}

export function SkeletonRepoCard() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-2">
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-1/2" />
    </div>
  );
}
