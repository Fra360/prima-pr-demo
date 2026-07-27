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
    <section id="sperlonga" className="tone-light py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] overflow-hidden rounded-lg">
                <Placeholder variant="stone" label="Il borgo bianco" />
              </div>
              {/* Sfalsata e leggermente piu lenta: da profondita senza
                  che nessuno noti l'effetto */}
              <div
                className="mt-12 aspect-[3/4] overflow-hidden rounded-lg"
                data-parallax="0.88"
              >
                <Placeholder variant="sea" label="La spiaggia" />
              </div>
            </div>
          </Reveal>

          <Reveal stagger className="order-1 lg:order-2">
            <p className="eyebrow text-deep-ocean/80">La Posizione</p>
            <h2 className="headline mt-5 text-deep-ocean">
              Sperlonga, la perla{" "}
              <em className="not-italic text-ocean-teal">
                della Riviera di Ulisse
              </em>
            </h2>
            <div className="rule my-7" />
            <p className="max-w-lg font-light leading-relaxed text-deep-ocean/80">
              Tra Roma e Napoli, arroccata su uno sperone bianco a picco sul
              Tirreno, Sperlonga è uno dei Borghi più belli d&apos;Italia:
              vicoli imbiancati a calce, bouganville, spiagge Bandiera Blu e
              la leggendaria Grotta di Tiberio.
            </p>

            <ul className="glass glass--light mt-9 divide-y divide-ocean-teal/12 px-6">
              {spots.map((s) => (
                <li
                  key={s.name}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-4"
                >
                  <span className="font-display text-lg text-deep-ocean">
                    {s.name}
                  </span>
                  <span className="eyebrow text-[0.6rem] text-deep-ocean/80">
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
