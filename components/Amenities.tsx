import Reveal from "./Reveal";

const amenities = [
  {
    title: "Terrazza vista mare",
    desc: "Colazioni lente e aperitivi al tramonto con il blu davanti a voi.",
    icon: (
      <path d="M3 18h18M12 4v6m0 0c-3.5 0-6 2.5-6 5h12c0-2.5-2.5-5-6-5zM5 8l1.5 1.5M19 8l-1.5 1.5" />
    ),
  },
  {
    title: "Aria condizionata",
    desc: "Clima perfetto in ogni stagione, in tutti gli ambienti.",
    icon: (
      <path d="M12 3v18M5 6l14 12M19 6L5 18M3 12h18" />
    ),
  },
  {
    title: "Cucina completa",
    desc: "Lavastoviglie, forno, microonde e tutto per cucinare come a casa.",
    icon: (
      <path d="M4 4h16v16H4zM4 10h16M8 14h.01M12 14h.01" />
    ),
  },
  {
    title: "Parcheggio privato",
    desc: "Posto auto riservato in loco: arrivate e dimenticatevi dell'auto.",
    icon: (
      <path d="M5 20V6a2 2 0 012-2h6a4 4 0 010 8H7" />
    ),
  },
  {
    title: "WiFi veloce e gratuito",
    desc: "Connessione in tutta la casa, anche in terrazza.",
    icon: (
      <path d="M2 9c5.5-5.3 14.5-5.3 20 0M5.5 12.5c3.6-3.4 9.4-3.4 13 0M9 16a4.2 4.2 0 016 0M12 19.5h.01" />
    ),
  },
  {
    title: "Due bagni",
    desc: "Entrambi con bidet, asciugacapelli e set di cortesia.",
    icon: (
      <path d="M4 12h16v2a5 5 0 01-5 5H9a5 5 0 01-5-5v-2zM6 12V5a2 2 0 014 0M9 20l-1 2M15 20l1 2" />
    ),
  },
  {
    title: "TV a schermo piatto",
    desc: "Smart TV via cavo per le serate di relax.",
    icon: (
      <path d="M3 5h18v12H3zM8 21h8M12 17v4" />
    ),
  },
  {
    title: "A 7 minuti dal mare",
    desc: "Una passeggiata breve vi separa dalla spiaggia di Sperlonga.",
    icon: (
      <path d="M2 17c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M2 12c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M12 3a4 4 0 014 4H8a4 4 0 014-4z" />
    ),
  },
];

export default function Amenities() {
  return (
    <section id="servizi" className="py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-16 text-center">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.4em] text-gold">
              Servizi
            </p>
            <h2 className="font-display text-4xl font-light md:text-5xl">
              Ogni dettaglio, <em className="text-sea">pensato per voi</em>
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {amenities.map((a, i) => (
            <Reveal
              key={a.title}
              delay={i * 0.05}
              className="group bg-ivory p-8 transition-colors duration-500 hover:bg-ivory-dark"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-5 text-gold transition-transform duration-500 group-hover:-translate-y-1"
              >
                {a.icon}
              </svg>
              <h3 className="font-display text-xl">{a.title}</h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-ink-soft/70">
                {a.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
