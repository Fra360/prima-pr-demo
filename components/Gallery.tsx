import Placeholder from "./Placeholder";
import Reveal from "./Reveal";

const photos = [
  { variant: "sea", label: "Terrazza vista mare", span: "md:col-span-2 md:row-span-2" },
  { variant: "interior", label: "Camera matrimoniale", span: "" },
  { variant: "stone", label: "Bagno principale", span: "" },
  { variant: "sunset", label: "Tramonto dal balcone", span: "md:row-span-2" },
  { variant: "interior", label: "Cucina attrezzata", span: "" },
  { variant: "garden", label: "Esterni", span: "" },
  { variant: "night", label: "Sperlonga di sera", span: "md:col-span-2" },
] as const;

export default function Gallery() {
  return (
    <section id="galleria" className="bg-ink py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-16 text-center">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.4em] text-gold-light">
              Galleria
            </p>
            <h2 className="font-display text-4xl font-light text-white md:text-5xl">
              Uno sguardo <em className="text-gold-light">dentro</em>
            </h2>
          </div>
        </Reveal>

        <div className="grid auto-rows-[220px] grid-cols-1 gap-4 md:grid-cols-4">
          {photos.map((p, i) => (
            <Reveal
              key={p.label}
              delay={i * 0.06}
              className={`group relative overflow-hidden rounded-sm ${p.span}`}
            >
              <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
                <Placeholder variant={p.variant} label={p.label} />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <p className="text-sm font-light italic text-white/50">
            Le foto professionali della casa arriveranno presto — questi sono
            segnaposto.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
