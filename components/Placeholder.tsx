type Tone = "char" | "copper" | "teal" | "violet" | "amber" | "steel";

const gradients: Record<Tone, string> = {
  char: "linear-gradient(150deg, #26262b 0%, #17171a 55%, #0e0e10 100%)",
  copper: "linear-gradient(150deg, #3a281c 0%, #24170f 55%, #120b07 100%)",
  teal: "linear-gradient(150deg, #16333a 0%, #0e2229 55%, #08151a 100%)",
  violet: "linear-gradient(150deg, #2c2340 0%, #1c1730 55%, #100c1c 100%)",
  amber: "linear-gradient(150deg, #3d3018 0%, #261e0f 55%, #130f08 100%)",
  steel: "linear-gradient(150deg, #2a3038 0%, #1a1f26 55%, #0d1014 100%)",
};

/**
 * Segnaposto elegante in stile "viewport 3D": gradiente scuro, griglia
 * prospettica sottile e icona a cubo. Sostituiscilo con l'immagine reale
 * mettendo il file in /public/work e impostando `image` in lib/site.ts.
 */
export default function Placeholder({
  tone = "char",
  label,
  className = "",
}: {
  tone?: Tone;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{ background: gradients[tone] }}
      role="img"
      aria-label={label ?? "Render in arrivo"}
    >
      {/* griglia da viewport */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage:
            "radial-gradient(ellipse at 50% 60%, black 10%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 60%, black 10%, transparent 75%)",
        }}
      />
      {/* alone di luce */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 35% 25%, rgba(224,162,100,0.18) 0%, transparent 55%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-3 px-6 text-center text-fg-dim">
        <svg
          width="38"
          height="38"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
          className="opacity-70"
        >
          <path d="M16 3 L28 10 V22 L16 29 L4 22 V10 Z" />
          <path d="M16 3 V16 M16 16 L4 10 M16 16 L28 10 M16 16 V29" opacity="0.6" />
        </svg>
        {label && (
          <span className="font-display text-base tracking-wide text-fg/90">
            {label}
          </span>
        )}
        <span className="text-[10px] font-medium uppercase tracking-[0.28em] opacity-60">
          Render in arrivo
        </span>
      </div>
    </div>
  );
}
