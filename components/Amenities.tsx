import Reveal from "./Reveal";

/**
 * Otto servizi dentro UN SOLO pannello di vetro, non otto pannelli.
 * `backdrop-filter` e costoso e non va annidato: le celle sono separate da
 * linee sottili, il vetro lo fa il contenitore.
 *
 * Solo icona ed etichetta: ogni voce aveva anche una frase di descrizione e
 * la sezione diventava un muro di testo che nessuno legge. Qui si cerca la
 * conferma che un servizio ci sia — si scorre, non si legge — quindi
 * l'etichetta corta e piu utile della frase, e a colpo d'occhio si vede
 * tutto quello che c'e.
 */

const amenities = [
  {
    title: "Terrazza vista mare",
    icon: (
      <path d="M3 18h18M12 4v6m0 0c-3.5 0-6 2.5-6 5h12c0-2.5-2.5-5-6-5zM5 8l1.5 1.5M19 8l-1.5 1.5" />
    ),
  },
  {
    title: "Aria condizionata",
    icon: <path d="M12 3v18M5 6l14 12M19 6L5 18M3 12h18" />,
  },
  {
    title: "Cucina attrezzata",
    icon: <path d="M4 4h16v16H4zM4 10h16M8 14h.01M12 14h.01" />,
  },
  {
    title: "Parcheggio privato",
    icon: <path d="M5 20V6a2 2 0 012-2h6a4 4 0 010 8H7" />,
  },
  {
    title: "WiFi gratuito",
    icon: (
      <path d="M2 9c5.5-5.3 14.5-5.3 20 0M5.5 12.5c3.6-3.4 9.4-3.4 13 0M9 16a4.2 4.2 0 016 0M12 19.5h.01" />
    ),
  },
  {
    title: "Due bagni",
    icon: (
      <path d="M4 12h16v2a5 5 0 01-5 5H9a5 5 0 01-5-5v-2zM6 12V5a2 2 0 014 0M9 20l-1 2M15 20l1 2" />
    ),
  },
  {
    title: "Smart TV",
    icon: <path d="M3 5h18v12H3zM8 21h8M12 17v4" />,
  },
  {
    title: "A 5 minuti dal mare",
    icon: (
      <path d="M2 17c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M2 12c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M12 3a4 4 0 014 4H8a4 4 0 014-4z" />
    ),
  },
];

export default function Amenities() {
  return (
    <section id="servizi" className="tone-dark py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal stagger className="mb-14 text-center">
          <p className="eyebrow text-light-sky">Servizi</p>
          <h2 className="headline mt-5 text-foam">
            Ogni dettaglio,{" "}
            <em className="not-italic text-light-sky">pensato per voi</em>
          </h2>
        </Reveal>

        <Reveal>
          <ul className="glass glass--dark grid grid-cols-2 gap-2 p-4 sm:grid-cols-4">
            {amenities.map((a) => (
              <li
                key={a.title}
                className="group flex flex-col items-center gap-4 rounded-md px-4 py-8 text-center transition-colors duration-500 hover:bg-foam/10"
              >
                {/* L'icona non basta da sola: sotto c'e sempre l'etichetta */}
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="text-foam transition-transform duration-500 group-hover:-translate-y-1"
                >
                  {a.icon}
                </svg>
                <h3 className="font-display text-lg leading-snug text-foam">
                  {a.title}
                </h3>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
