import Reveal from "./Reveal";

const BOOKING_URL = "https://www.booking.com/hotel/it/casa-omero-sperlonga.it.html";

/**
 * La chiusura (Peak-End Rule): le persone ricordano il momento migliore e
 * l'ultima cosa che hanno visto. Il picco e l'hero col video; questa e la
 * fine, e non puo essere trascurata. Un solo pannello, un solo messaggio,
 * una sola azione primaria — con la riprova sociale attaccata al bottone,
 * non relegata in fondo alla pagina.
 */
export default function BookingCTA() {
  return (
    <section id="prenota" className="tone-light py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal stagger className="glass glass--strong glass--light px-7 py-14 text-center md:px-14 md:py-16">
          <p className="eyebrow text-deep-ocean/80">Prenota il tuo soggiorno</p>

          <h2 className="headline mt-6 text-deep-ocean">
            Il mare vi aspetta.
            <br />
            <em className="not-italic text-slate-blue">Casa Omero anche.</em>
          </h2>

          <div className="rule mx-auto my-8" />

          <p className="lede mx-auto max-w-xl text-deep-ocean/80">
            Verificate la disponibilità per le vostre date e prenotate in
            sicurezza tramite Booking.com — oppure scriveteci direttamente
            per richieste speciali.
          </p>

          {/* Una sola azione primaria. Il contatto resta disponibile ma
              visivamente subordinato: nessuna scelta contemporanea. */}
          <div className="mt-11 flex flex-col items-center gap-4">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary w-full sm:w-auto"
            >
              Prenota su Booking.com
            </a>

            {/* Riprova sociale nel punto esatto della decisione */}
            <p className="flex items-center gap-2 text-sm text-deep-ocean/80">
              <span aria-hidden="true" className="text-deep-ocean">
                ★★★★★
              </span>
              <span>
                <strong className="font-medium text-deep-ocean">9.7/10</strong>{" "}
                — &ldquo;Eccezionale&rdquo; su Booking
              </span>
            </p>

            <a
              href="mailto:info@casaomerosperlonga.it"
              className="mt-2 inline-flex min-h-[44px] items-center text-sm text-deep-ocean/80 underline decoration-slate-blue/30 underline-offset-4 transition-colors hover:text-deep-ocean hover:decoration-deep-ocean"
            >
              Oppure scrivici per una richiesta speciale
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
