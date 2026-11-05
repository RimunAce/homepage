"use client";

import { useEffect, useRef, useState } from "react";
import SafeImage from "./SafeImage";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<number>(0);

  useEffect(() => {
    return () => window.clearTimeout(copiedTimer.current);
  }, []);

  async function copyDiscord() {
    try {
      await navigator.clipboard.writeText("respire");
      setCopied(true);
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="relative overflow-visible">
      <section id="contact" className="retro-card relative mr-[5.25rem] sm:mr-24">
        <h2 className="retro-heading">CONTACT</h2>
        <div className="space-y-3">
          <div className="retro-text">
            <p className="font-bold text-sm mb-2">GET IN TOUCH</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 min-h-11">
                <span className="text-xs">GitHub:</span>
                <a
                  href="https://github.com/RimunAce"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs retro-link inline-flex min-h-11 items-center"
                >
                  @RimunAce
                </a>
              </div>
              <div className="flex items-center gap-2 min-h-11">
                <span className="text-xs">Discord:</span>
                <button
                  type="button"
                  onClick={copyDiscord}
                  className="text-xs retro-link inline-flex min-h-11 items-center bg-transparent px-1 border-0 font-[inherit]"
                  aria-live="polite"
                >
                  {copied ? "Copied respire" : "respire"}
                </button>
              </div>
              <div className="flex items-center gap-2 min-h-11">
                <span className="text-xs">Email:</span>
                <a href="mailto:hi@respire.my" className="text-xs retro-link inline-flex min-h-11 items-center">
                  hi@respire.my
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-retro-black pt-3">
            <p className="text-xs retro-text">
              Say hello. Collaborations and questions welcome.
            </p>
          </div>
        </div>
      </section>
      <div className="pointer-events-none absolute bottom-0 right-0 z-20 w-[6.75rem] sm:w-32">
        <SafeImage
          src="https://cdn.apis.rocks/images/teto.png"
          alt="Kasane Teto standing beside the contact card"
          width={348}
          height={749}
          sizes="(min-width: 640px) 8rem, 6.75rem"
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
