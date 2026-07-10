import Reveal from "./Reveal";

const reviews = [
  {
    text: "Posizione perfetta, casa curata in ogni dettaglio e una vista dalla terrazza che toglie il fiato. Torneremo sicuramente.",
    author: "Giulia · Roma",
  },
  {
    text: "Pulizia impeccabile, host gentilissimi e la spiaggia a due passi. Il posto ideale per staccare davvero.",
    author: "Marco · Milano",
  },
  {
    text: "Sperlonga è magica e Casa Omero è il punto di partenza perfetto: comoda, elegante, silenziosa.",
    author: "Elena · Firenze",
  },
];

export default function Reviews() {
  return (
    <section id="recensioni" className="relative overflow-hidden bg-sea-deep py-28 md:py-36">
      {/* decorative glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(184,146,90,0.15) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-16 text-center">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.4em] text-gold-light">
              Recensioni
            </p>
            <h2 className="font-display text-4xl font-light text-white md:text-5xl">
              Gli ospiti <em className="text-gold-light">raccontano</em>
            </h2>
            <div className="mt-8 inline-flex items-center gap-3 border border-gold/40 px-6 py-3">
              <span className="font-display text-3xl text-gold-light">9.7</span>
              <span className="text-left text-[10px] font-medium uppercase leading-tight tracking-[0.2em] text-white/70">
                Eccezionale
                <br />
                su Booking.com
              </span>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.author} delay={i * 0.12}>
              <figure className="flex h-full flex-col border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <span className="font-display text-6xl leading-none text-gold/60">
                  &ldquo;
                </span>
                <blockquote className="flex-1 font-display text-lg font-light italic leading-relaxed text-white/85">
                  {r.text}
                </blockquote>
                <figcaption className="mt-6 text-[10px] font-medium uppercase tracking-[0.25em] text-gold-light">
                  {r.author}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <p className="text-xs font-light italic text-white/40">
            Recensioni di esempio — sostituiscile con quelle reali dal tuo
            profilo Booking.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
