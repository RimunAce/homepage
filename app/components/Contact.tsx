"use client";

import { useEffect, useRef, useState } from "react";

const valueLink =
  "inline-flex min-h-11 items-center text-sm text-[#f2f3f6] underline decoration-white/35 underline-offset-4 hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function Contact() {
  const [copyFeedback, setCopyFeedback] = useState<"idle" | "copied" | "failed">("idle");
  const copiedTimer = useRef<number>(0);

  useEffect(() => {
    return () => window.clearTimeout(copiedTimer.current);
  }, []);

  async function copyDiscord() {
    try {
      await navigator.clipboard.writeText("respire");
      setCopyFeedback("copied");
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopyFeedback("idle"), 2000);
    } catch {
      setCopyFeedback("failed");
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopyFeedback("idle"), 2000);
    }
  }

  return (
    <div className="pt-3">
      <p className="max-w-prose text-sm leading-relaxed text-[#aeb5c4]">
        Say hello. Collaborations and questions welcome.
      </p>
      <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap sm:gap-6">
        <div>
          <p className="text-xs text-[#aeb5c4]">GitHub</p>
          <a href="https://github.com/RimunAce" target="_blank" rel="noopener noreferrer" className={valueLink}>
            @RimunAce
          </a>
        </div>
        <div>
          <p className="text-xs text-[#aeb5c4]">Discord</p>
          <button
            type="button"
            onClick={copyDiscord}
            className={`${valueLink} cursor-pointer border-0 bg-transparent px-0 font-[inherit]`}
            aria-live="polite"
          >
            {copyFeedback === "copied"
              ? "Copied respire"
              : copyFeedback === "failed"
                ? "Copy failed, use respire"
                : "respire"}
          </button>
        </div>
        <div>
          <p className="text-xs text-[#aeb5c4]">Email</p>
          <a href="mailto:hi@respire.my" className={valueLink}>
            hi@respire.my
          </a>
        </div>
      </div>
    </div>
  );
}
