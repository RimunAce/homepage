export default function ScrollingBanner() {
  return (
    <div className="bg-retro-black text-retro-white py-1 overflow-hidden relative z-10">
      <div
        className="flex whitespace-nowrap text-xs font-mono banner-scroll"
        style={{ willChange: "transform" }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={`banner-${i}`} className="mx-4">
            WE ARE NOT FINISHED //
          </span>
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={`banner-dup-${i}`} className="mx-4">
            WE ARE NOT FINISHED //
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes bannerScroll {
          0% { transform: translateX(0) translateZ(0); }
          100% { transform: translateX(-50%) translateZ(0); }
        }
        .banner-scroll {
          animation: bannerScroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
