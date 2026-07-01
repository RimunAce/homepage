export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-[2/3] bg-retro-gray border-2 border-retro-black"></div>
      <div className="mt-2 space-y-2">
        <div className="h-3 bg-retro-gray border border-retro-black"></div>
        <div className="h-2 bg-retro-gray border border-retro-black w-2/3"></div>
      </div>
    </div>
  );
}
