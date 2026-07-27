import Placeholder from "./Placeholder";
import Reveal from "./Reveal";

/**
 * Sezione scura: nessuno sfondo proprio, si vede il blu profondo del body
 * con l'aurora che filtra dietro le foto.
 *
 * Le foto non vanno dietro il vetro (le sfocherebbe): prendono solo il
 * raggio e un bordo sottile.
 */

const photos = [
  { variant: "sea", label: "Terrazza vista mare", span: "sm:col-span-2 md:row-span-2" },
  { variant: "interior", label: "Camera matrimoniale", span: "" },
  { variant: "stone", label: "Bagno principale", span: "" },
  { variant: "sunset", label: "Tramonto dal balcone", span: "md:row-span-2" },
  { variant: "interior", label: "Cucina attrezzata", span: "" },
  { variant: "garden", label: "Esterni", span: "" },
  { variant: "night", label: "Sperlonga di sera", span: "sm:col-span-2" },
] as const;

export default function Gallery() {
  return (
    <section id="galleria" className="tone-dark py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal stagger className="mb-14 text-center">
          <p className="eyebrow text-sandy-beige">Galleria</p>
          <h2 className="headline mt-5 text-foam">
            Uno sguardo <em className="not-italic text-light-sky">dentro</em>
          </h2>
        </Reveal>

        <div className="grid auto-rows-[240px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[220px] md:grid-cols-4">
          {photos.map((p, i) => (
            <Reveal
              key={p.label}
              delay={i * 0.06}
              className={`group relative overflow-hidden rounded-lg border border-light-sky/15 ${p.span}`}
            >
              <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
                <Placeholder variant={p.variant} label={p.label} />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <p className="text-sm font-light italic text-light-sky/70">
            Le foto professionali della casa arriveranno presto — questi sono
            segnaposto.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
