import { site } from "@/lib/site";
import Placeholder from "./Placeholder";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="relative bg-bg py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        {/* Ritratto / segnaposto */}
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden border border-line">
            {site.portrait ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={site.portrait}
                alt={site.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Placeholder tone="copper" label="Ritratto" />
            )}
          </div>
        </Reveal>

        {/* Testo */}
        <Reveal delay={0.1}>
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-accent" />
              <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-accent">
                Chi sono
              </p>
            </div>
            <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-fg md:text-5xl">
              {site.name}
            </h2>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.25em] text-muted">
              {site.role}
            </p>

            <div className="mt-6 space-y-4">
              {site.bio.map((p, i) => (
                <p
                  key={i}
                  className="text-base font-light leading-relaxed text-fg-dim"
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Software */}
            <div className="mt-8">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.3em] text-muted">
                Strumenti
              </p>
              <div className="flex flex-wrap gap-2">
                {site.software.map((s) => (
                  <span
                    key={s}
                    className="border border-line px-3 py-1.5 text-xs font-medium text-fg-dim"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
