import Reveal from "./Reveal";

/**
 * Prima sezione dopo l'hero: e qui che comincia il racconto a parole.
 *
 * Il testo che prima stava sopra il video (eyebrow, nome della casa,
 * sottotitolo) non e stato buttato: e stato spostato qui, dove si legge
 * davvero. Questa sezione porta anche l'unico <h1> del sito — prima la
 * pagina non ne aveva nessuno, il nome stava in un <h2> dentro l'hero.
 *
 * Tutto incolonnato al centro, come l'apertura: prima il racconto stava in
 * una colonna a sinistra affiancata da una foto, e l'occhio doveva cambiare
 * asse di lettura a meta sezione. Le foto vivono nella galleria.
 */

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

        <Reveal stagger className="mx-auto mt-24 max-w-2xl text-center lg:mt-32">
          <h2 className="headline text-foam">
            Dove il tempo rallenta,{" "}
            <em className="not-italic text-light-sky">
              e il mare entra in casa
            </em>
          </h2>
          <div className="rule mx-auto my-7" />
          <p className="font-light leading-relaxed text-foam/85">
            Casa Omero è un appartamento raffinato nel cuore di Sperlonga,
            pensato per chi cerca il lusso della semplicità. Una terrazza
            privata con vista mare, interni luminosi e curati, una cucina
            completamente attrezzata e ogni comfort — dall&apos;aria
            condizionata al parcheggio privato.
          </p>
          <p className="mt-5 font-light leading-relaxed text-foam/85">
            A pochi passi trovate la sabbia dorata della spiaggia di
            Sperlonga e i vicoli bianchi del borgo, tra i più belli
            d&apos;Italia.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
