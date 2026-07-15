import Placeholder from "./Placeholder";
import Reveal from "./Reveal";

const stats = [
  { value: "9.7", label: "Voto su Booking" },
  { value: "7 min", label: "A piedi dal mare" },
  { value: "2", label: "Bagni eleganti" },
  { value: "∞", label: "Vista sul blu" },
];

export default function About() {
  return (
    <section id="casa" className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.4em] text-gold">
              La Casa
            </p>
            <h2 className="font-display text-4xl font-light leading-tight md:text-5xl lg:text-6xl">
              Dove il tempo rallenta,{" "}
              <em className="text-sea">e il mare entra in casa</em>
            </h2>
            <div className="my-8 h-px w-16 bg-gold" />
            <p className="max-w-lg text-base font-light leading-relaxed text-ink-soft/80 md:text-lg">
              Casa Omero è un appartamento raffinato nel cuore di Sperlonga,
              pensato per chi cerca il lusso della semplicità. Una terrazza
              privata con vista mare, interni luminosi e curati, una cucina
              completamente attrezzata e ogni comfort — dall&apos;aria
              condizionata al parcheggio privato.
            </p>
            <p className="mt-5 max-w-lg text-base font-light leading-relaxed text-ink-soft/80 md:text-lg">
              A pochi passi trovate la sabbia dorata della spiaggia di
              Sperlonga e i vicoli bianchi del borgo, tra i più belli
              d&apos;Italia.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-2xl shadow-sea-deep/20">
                <Placeholder variant="interior" label="Il soggiorno" />
              </div>
              <div className="absolute -bottom-10 -left-10 hidden aspect-square w-48 overflow-hidden rounded-sm border-8 border-ivory shadow-xl md:block">
                <Placeholder variant="sea" label="La terrazza" />
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-28">
          <div className="grid grid-cols-2 gap-y-10 border-y border-ink/10 py-12 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-5xl font-light text-sea md:text-6xl">
                  {s.value}
                </div>
                <div className="mt-2 text-[10px] font-medium uppercase tracking-[0.25em] text-ink-soft/60">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
