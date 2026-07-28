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
    <section id="recensioni" className="tone-dark py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal stagger className="mb-14 text-center">
          <p className="eyebrow text-lagoon">Recensioni</p>
          <h2 className="headline mt-5 text-foam">
            Gli ospiti{" "}
            <em className="not-italic text-light-sky">raccontano</em>
          </h2>
          <p className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full border border-lagoon/40 px-6 py-3">
            <span className="font-display text-3xl leading-none text-lagoon">
              9.7
            </span>
            <span className="text-left text-[0.6rem] font-medium uppercase leading-tight tracking-[0.2em] text-light-sky">
              Eccezionale
              <br />
              su Booking.com
            </span>
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.author} delay={i * 0.12}>
              <figure className="glass glass--dark flex h-full flex-col p-8">
                <span
                  aria-hidden="true"
                  className="font-display text-6xl leading-none text-lagoon/50"
                >
                  &ldquo;
                </span>
                <blockquote className="flex-1 font-display text-lg font-light italic leading-relaxed text-foam">
                  {r.text}
                </blockquote>
                <figcaption className="eyebrow mt-6 text-[0.6rem] text-lagoon">
                  {r.author}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <p className="text-sm font-light italic text-light-sky/70">
            Recensioni di esempio — sostituiscile con quelle reali dal tuo
            profilo Booking.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
