import { site } from "@/lib/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg py-12 text-muted">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <Logo />
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted">
            {site.name} · {site.role}
          </p>
        </div>

        <div className="flex items-center gap-6">
          {site.artstation && (
            <a
              href={site.artstation}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-accent"
            >
              ArtStation
            </a>
          )}
          <a
            href={`mailto:${site.email}`}
            className="text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-accent"
          >
            Email
          </a>
        </div>
      </div>
      <p className="mt-8 text-center text-[10px] uppercase tracking-[0.2em] text-muted/70">
        © {new Date().getFullYear()} {site.name}
      </p>
    </footer>
  );
}
