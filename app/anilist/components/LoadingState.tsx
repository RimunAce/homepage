import { SkeletonCard } from "./SkeletonCard";

export function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="retro-card animate-pulse">
        <div className="flex gap-6">
          <div className="w-32 h-32 bg-retro-gray border-2 border-retro-black"></div>
          <div className="flex-grow space-y-3">
            <div className="h-6 bg-retro-gray border-2 border-retro-black w-1/3"></div>
            <div className="h-20 bg-retro-gray border-2 border-retro-black"></div>
          </div>
        </div>
      </div>
      <div className="retro-card">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: 10 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
