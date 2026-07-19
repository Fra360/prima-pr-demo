/**
 * Configurazione centrale del sito-portfolio.
 *
 * ⚙️  QUASI TUTTO QUELLO CHE VUOI CAMBIARE È QUI DENTRO.
 *     Cambia il nome, i link, i progetti e i software da questo unico file:
 *     l'intero sito si aggiorna di conseguenza.
 */

export const site = {
  // ── Identità ──────────────────────────────────────────────
  /** Nome e cognome mostrati grandi nell'hero. */
  name: "Francesco Moscarella",
  /** Ruolo mostrato sotto al nome. */
  role: "3D Generalist",
  /** Iniziali usate per il logo/monogramma (lasciale vuote "" per calcolarle dal nome). */
  initials: "",
  /** Frase di apertura (una riga, sotto al nome). */
  tagline:
    "Modellazione, texturing e lookdev — dall'idea al render finale.",
  /** Bio più estesa per la sezione 'Chi sono'. */
  bio: [
    "Sono un 3D generalist: mi occupo dell'intera pipeline, dalla modellazione al texturing, dal lighting al rendering finale.",
    "Mi piace curare ogni dettaglio — dalla silhouette di un asset alla resa dei materiali sotto la luce — per raccontare atmosfere credibili.",
  ],

  // ── Contatti & social ─────────────────────────────────────
  email: "fra111kikko@gmail.com",
  artstation: "https://fraart_3d.artstation.com/",
  /** Aggiungi/rimuovi liberamente. Metti "" per nascondere una voce. */
  socials: {
    instagram: "",
    linkedin: "",
    youtube: "",
  },

  /** Software che usi (mostrati nella sezione 'Chi sono'). */
  software: [
    "Blender",
    "ZBrush",
    "Substance Painter",
    "Marmoset Toolbag",
    "Maya",
    "Photoshop",
    "Unreal Engine",
    "Houdini",
  ],

  // ── Modello 3D dello showcase ─────────────────────────────
  // Sostituisci public/models/casa.glb con un tuo export .glb (texture incluse).
  model: {
    src: "/models/casa.glb",
    /** Per l'AR su iPhone metti un export .usdz in public/models e scrivi qui il path. */
    iosSrc: undefined as string | undefined,
    alt: "Modello 3D",
  },
};

/** Iniziali per il logo, calcolate dal nome se non impostate a mano. */
export function getInitials(): string {
  if (site.initials) return site.initials.toUpperCase();
  const parts = site.name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/**
 * Progetti del portfolio.
 *
 * Per ora usano segnaposto eleganti. Quando avrai i render:
 *   1. metti l'immagine in  public/work/  (es. public/work/progetto-01.jpg)
 *   2. scrivi qui il campo  image: "/work/progetto-01.jpg"
 * La card mostrerà la foto al posto del segnaposto, senza toccare altro.
 */
export type Project = {
  title: string;
  category: string;
  /** Path dell'immagine in /public. Vuoto ("") ⇒ segnaposto. */
  image?: string;
  /** Variante-colore del segnaposto (solo estetica finché non c'è l'immagine). */
  tone: "char" | "copper" | "teal" | "violet" | "amber" | "steel";
  /** true = la card occupa due colonne (per i tuoi lavori migliori). */
  wide?: boolean;
};

export const categories = [
  "Tutti",
  "Environment",
  "Character",
  "Props / Hard-surface",
  "Lookdev",
] as const;

export const projects: Project[] = [
  {
    title: "Progetto 01",
    category: "Environment",
    tone: "copper",
    wide: true,
    image: "",
  },
  { title: "Progetto 02", category: "Character", tone: "violet", image: "" },
  {
    title: "Progetto 03",
    category: "Props / Hard-surface",
    tone: "steel",
    image: "",
  },
  { title: "Progetto 04", category: "Lookdev", tone: "amber", image: "" },
  {
    title: "Progetto 05",
    category: "Environment",
    tone: "teal",
    wide: true,
    image: "",
  },
  { title: "Progetto 06", category: "Character", tone: "char", image: "" },
];
