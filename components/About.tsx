import Placeholder from "./Placeholder";
import Reveal from "./Reveal";

/**
 * Prima sezione dopo l'hero: e qui che comincia il racconto a parole.
 *
 * Il testo che prima stava sopra il video (eyebrow, nome della casa,
 * sottotitolo) non e stato buttato: e stato spostato qui, dove si legge
 * davvero. Questa sezione porta anche l'unico <h1> del sito — prima la
 * pagina non ne aveva nessuno, il nome stava in un <h2> dentro l'hero.
 */

const stats = [
  { value: "9.7", label: "Voto su Booking" },
  { value: "7 min", label: "A piedi dal mare" },
  { value: "2", label: "Bagni eleganti" },
  { value: "∞", label: "Vista sul blu" },
];

export default function About() {
  return (
    <section id="casa" className="tone-dark relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Il momento della rivelazione: la sequenza video e finita, il sito
            si presenta. Un solo blocco, un solo messaggio. */}
        <Reveal stagger className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-light-sky">Sperlonga · Riviera di Ulisse</p>
          <h1 className="headline headline--hero mt-6 text-foam">
            Casa Omero
          </h1>
          <div className="rule mx-auto my-8" />
          <p className="lede mx-auto max-w-xl text-foam/85">
            Un rifugio elegante sul mare, a pochi passi dalla spiaggia e dal
            borgo antico di Sperlonga.
          </p>

          {/* Riprova sociale attaccata alla CTA, non relegata in fondo:
              il numero che rassicura sta dove si decide. */}
          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <a href="#prenota" className="btn btn--primary w-full sm:w-auto">
              Verifica disponibilità
            </a>
            <p className="flex items-center gap-2.5 text-sm text-foam/85">
              <span className="font-display text-3xl leading-none text-foam">
                9.7
              </span>
              <span className="text-left leading-tight">
                <span className="block font-medium">Eccezionale</span>
                <span className="block text-xs">su 40+ recensioni Booking</span>
              </span>
            </p>
          </div>
        </Reveal>

        <div className="mt-24 grid items-center gap-14 lg:mt-32 lg:grid-cols-2">
          <Reveal stagger>
            <h2 className="headline text-foam">
              Dove il tempo rallenta,{" "}
              <em className="not-italic text-light-sky">
                e il mare entra in casa
              </em>
            </h2>
            <div className="rule my-7" />
            <p className="max-w-lg font-light leading-relaxed text-foam/85">
              Casa Omero è un appartamento raffinato nel cuore di Sperlonga,
              pensato per chi cerca il lusso della semplicità. Una terrazza
              privata con vista mare, interni luminosi e curati, una cucina
              completamente attrezzata e ogni comfort — dall&apos;aria
              condizionata al parcheggio privato.
            </p>
            <p className="mt-5 max-w-lg font-light leading-relaxed text-foam/85">
              A pochi passi trovate la sabbia dorata della spiaggia di
              Sperlonga e i vicoli bianchi del borgo, tra i più belli
              d&apos;Italia.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            {/* Niente vetro sopra le foto: sfocarle le rovinerebbe. Il vetro
                lo prende solo la didascalia. */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="overflow-hidden rounded-xl" data-parallax="0.9">
                <div className="aspect-[4/5]">
                  <Placeholder variant="interior" label="Il soggiorno" />
                </div>
              </div>
              <p className="glass glass--dark absolute -bottom-6 left-6 right-6 px-5 py-4 text-center text-sm font-light md:left-10 md:right-10">
                Terrazza privata con vista sul Tirreno
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-32">
          <dl className="glass glass--dark grid grid-cols-2 gap-y-10 px-6 py-12 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-display text-5xl font-light text-foam/85 md:text-6xl">
                    {s.value}
                  </span>
                  <span className="eyebrow mt-2 block text-[0.6rem] text-light-sky">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
