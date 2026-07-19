import { getInitials } from "@/lib/site";

/**
 * Logo / monogramma vettoriale per un 3D artist:
 * un cubo isometrico "wireframe" (richiamo al 3D) accanto alle iniziali.
 *
 * Le iniziali si prendono da lib/site.ts (getInitials). Puoi forzarle
 * passando la prop `initials`. Il colore segue `currentColor` + accento,
 * quindi si adatta ovunque lo metti.
 */
export default function Logo({
  withText = true,
  className = "",
  initials,
}: {
  withText?: boolean;
  className?: string;
  initials?: string;
}) {
  const mark = initials ?? getInitials();

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* cubo isometrico: 3 facce visibili con spigoli in accento */}
        <g
          stroke="var(--color-accent)"
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          {/* contorno esagonale esterno */}
          <path d="M16 3 L28 10 V22 L16 29 L4 22 V10 Z" opacity="0.95" />
          {/* spigoli interni che formano il vertice frontale */}
          <path d="M16 3 V16 M16 16 L4 10 M16 16 L28 10" opacity="0.6" />
          {/* faccia superiore leggermente riempita */}
          <path
            d="M16 3 L28 10 L16 16 L4 10 Z"
            fill="var(--color-accent)"
            fillOpacity="0.14"
            stroke="none"
          />
        </g>
      </svg>
      {withText && (
        <span className="font-display text-lg font-semibold tracking-[0.14em] text-fg">
          {mark}
        </span>
      )}
    </span>
  );
}
