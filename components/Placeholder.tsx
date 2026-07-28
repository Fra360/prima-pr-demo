type Variant = "sea" | "sunset" | "interior" | "stone" | "garden" | "night";

/**
 * Segnaposto per le foto reali. I gradienti leggono i token della palette
 * invece di ripetere gli hex: cambiando la palette cambiano anche loro.
 * Vanno solo tra colori adiacenti della scala, dal chiaro al profondo:
 * niente arcobaleni. "lagoon" e l'accento, quindi compare di rado.
 */
const gradients: Record<Variant, string> = {
  sea: "linear-gradient(160deg, var(--color-light-sky) 0%, var(--color-seafoam) 45%, var(--color-deep-ocean) 100%)",
  sunset:
    "linear-gradient(160deg, var(--color-lagoon) 0%, var(--color-seafoam) 55%, var(--color-deep-ocean) 100%)",
  interior:
    "linear-gradient(160deg, var(--color-light-sky) 0%, var(--color-seafoam) 50%, var(--color-slate-blue) 100%)",
  stone:
    "linear-gradient(160deg, var(--color-light-sky) 0%, var(--color-slate-blue) 55%, var(--color-deep-ocean) 100%)",
  garden:
    "linear-gradient(160deg, var(--color-seafoam) 0%, var(--color-deep-ocean) 55%, var(--color-slate-blue) 100%)",
  night:
    "linear-gradient(160deg, var(--color-slate-blue) 0%, var(--color-deep-ocean) 60%, var(--color-deep-ocean) 100%)",
};

export default function Placeholder({
  variant = "sea",
  label,
  className = "",
}: {
  variant?: Variant;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{ background: gradients[variant] }}
      role="img"
      aria-label={label ?? "Foto in arrivo"}
    >
      {/* Riflesso morbido, come la luce sul vetro */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 25% 15%, rgb(var(--rgb-foam) / 0.4) 0%, transparent 55%)",
        }}
      />
      {/* Velatura sotto la didascalia: i gradienti vanno dal chiaro allo
          scuro, quindi nessun colore di testo funzionerebbe su tutti e sei.
          Con questo scrim il bianco schiumoso sta sopra 6.6:1 ovunque. */}
      <div className="relative flex flex-col items-center gap-3 rounded-md bg-deep-ocean/70 px-6 py-5 text-center text-foam">
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
          className="opacity-70"
        >
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <circle cx="12" cy="13.5" r="3.5" />
          <path d="M8.5 7l1.2-2.4A1 1 0 0110.6 4h2.8a1 1 0 01.9.6L15.5 7" />
        </svg>
        {label && (
          <span className="font-display text-lg italic tracking-wide md:text-xl">
            {label}
          </span>
        )}
        <span className="eyebrow text-[0.55rem] opacity-70">Foto in arrivo</span>
      </div>
    </div>
  );
}
