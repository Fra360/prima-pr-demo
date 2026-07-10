import Placeholder from "./Placeholder";
import Reveal from "./Reveal";

const spots = [
  { name: "Spiaggia di Sperlonga", dist: "7 min a piedi" },
  { name: "Borgo antico", dist: "5 min a piedi" },
  { name: "Grotta di Tiberio e Museo", dist: "10 min in auto" },
  { name: "Porto di Formia", dist: "21 km" },
];

export default function Location() {
  return (
    <section id="sperlonga" className="bg-ivory-dark py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] overflow-hidden rounded-sm">
                <Placeholder variant="stone" label="Il borgo bianco" />
              </div>
              <div className="mt-10 aspect-[3/4] overflow-hidden rounded-sm">
                <Placeholder variant="sea" label="La spiaggia" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="order-1 lg:order-2">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.4em] text-gold">
              La Posizione
            </p>
            <h2 className="font-display text-4xl font-light leading-tight md:text-5xl">
              Sperlonga, la perla{" "}
              <em className="text-sea">della Riviera di Ulisse</em>
            </h2>
            <div className="my-8 h-px w-16 bg-gold" />
            <p className="max-w-lg text-base font-light leading-relaxed text-ink-soft/80 md:text-lg">
              Tra Roma e Napoli, arroccata su uno sperone bianco a picco sul
              Tirreno, Sperlonga è uno dei Borghi più belli d&apos;Italia:
              vicoli imbiancati a calce, bouganville, spiagge Bandiera Blu e
              la leggendaria Grotta di Tiberio.
            </p>

            <ul className="mt-10 space-y-4">
              {spots.map((s) => (
                <li
                  key={s.name}
                  className="flex items-baseline justify-between border-b border-ink/10 pb-3"
                >
                  <span className="font-display text-lg">{s.name}</span>
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                    {s.dist}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
