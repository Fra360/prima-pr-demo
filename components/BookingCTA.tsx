import Reveal from "./Reveal";

const BOOKING_URL = "https://www.booking.com/hotel/it/casa-omero-sperlonga.it.html";

export default function BookingCTA() {
  return (
    <section id="prenota" className="py-28 md:py-40">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.4em] text-gold">
            Prenota il tuo soggiorno
          </p>
          <h2 className="font-display text-4xl font-light leading-tight md:text-6xl">
            Il mare vi aspetta.
            <br />
            <em className="text-sea">Casa Omero anche.</em>
          </h2>
          <div className="mx-auto my-10 h-px w-16 bg-gold" />
          <p className="mx-auto max-w-xl text-base font-light leading-relaxed text-ink-soft/80 md:text-lg">
            Verificate la disponibilità per le vostre date e prenotate in
            sicurezza tramite Booking.com — oppure scriveteci direttamente
            per richieste speciali.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full bg-ink px-10 py-4 text-xs font-medium uppercase tracking-[0.3em] text-white transition-colors duration-300 hover:bg-gold sm:w-auto"
            >
              Prenota su Booking.com
            </a>
            <a
              href="mailto:info@casaomerosperlonga.it"
              className="w-full rounded-full border border-ink/20 px-10 py-4 text-xs font-medium uppercase tracking-[0.3em] text-ink transition-all duration-300 hover:border-gold hover:text-gold sm:w-auto"
            >
              Contattaci
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
