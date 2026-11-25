export default function SiteFooter() {
  return (
    <footer className="relative z-10 mt-16 border-t border-white/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 pb-32 font-mono text-xs text-[#aeb5c4] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>Respire. Developer and Forester.</p>
        <nav aria-label="Contact" className="flex flex-wrap gap-x-4 gap-y-1">
          <a href="mailto:hi@respire.my" className="inline-flex min-h-11 items-center px-1 text-white/70 underline underline-offset-4 hover:text-white">
            hi@respire.my
          </a>
          <a
            href="https://github.com/RimunAce"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 min-w-11 items-center justify-center px-1 text-white/70 underline underline-offset-4 hover:text-white"
          >
            GitHub
          </a>
          <a
            href="https://other.respire.my"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center px-1 text-white/70 underline underline-offset-4 hover:text-white"
          >
            Old site
          </a>
        </nav>
      </div>
    </footer>
  );
}
