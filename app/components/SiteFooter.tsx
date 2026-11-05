export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t-2 border-retro-black bg-retro-white">
      <div className="max-w-6xl mx-auto flex flex-col gap-3 px-4 py-4 pb-32 text-xs font-mono sm:flex-row sm:items-center sm:justify-between">
        <p>Respire. Developer and Forester.</p>
        <nav aria-label="Contact" className="flex flex-wrap gap-x-4 gap-y-1">
          <a href="mailto:hi@respire.my" className="retro-link inline-flex min-h-11 items-center px-1">
            hi@respire.my
          </a>
          <a
            href="https://github.com/RimunAce"
            target="_blank"
            rel="noopener noreferrer"
            className="retro-link inline-flex min-h-11 min-w-11 items-center justify-center px-1"
          >
            GitHub
          </a>
          <a
            href="https://other.respire.my"
            target="_blank"
            rel="noopener noreferrer"
            className="retro-link inline-flex min-h-11 items-center px-1"
          >
            Old site
          </a>
        </nav>
      </div>
    </footer>
  );
}
