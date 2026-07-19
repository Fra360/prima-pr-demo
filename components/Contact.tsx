import { site } from "@/lib/site";
import Reveal from "./Reveal";

type Link = { label: string; href: string };

function buildLinks(): Link[] {
  const out: Link[] = [];
  if (site.artstation) out.push({ label: "ArtStation", href: site.artstation });
  if (site.socials.instagram)
    out.push({ label: "Instagram", href: site.socials.instagram });
  if (site.socials.linkedin)
    out.push({ label: "LinkedIn", href: site.socials.linkedin });
  if (site.socials.youtube)
    out.push({ label: "YouTube", href: site.socials.youtube });
  return out;
}

export default function Contact() {
  const links = buildLinks();

  return (
    <section
      id="contatti"
      className="grain relative overflow-hidden bg-bg-2 py-28 md:py-36"
    >
      {/* alone caldo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(224,162,100,0.14) 0%, transparent 55%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.5em] text-accent">
            Contatti
          </p>
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-fg md:text-6xl">
            Lavoriamo insieme
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-fg-dim">
            Hai un progetto 3D in mente — un asset, un ambiente, un character?
            Scrivimi, mi fa piacere sentirti.
          </p>

          <a
            href={`mailto:${site.email}`}
            className="mt-10 inline-block border border-accent bg-accent px-10 py-4 text-xs font-medium uppercase tracking-[0.3em] text-bg transition-colors hover:bg-transparent hover:text-accent"
          >
            {site.email}
          </a>

          {links.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium uppercase tracking-[0.25em] text-fg-dim underline-offset-4 transition-colors hover:text-accent hover:underline"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
