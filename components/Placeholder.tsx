type Variant = "sea" | "sunset" | "interior" | "stone" | "garden" | "night";

const gradients: Record<Variant, string> = {
  sea: "linear-gradient(160deg, #9fc4cf 0%, #5f93a3 40%, #2e5d6b 100%)",
  sunset: "linear-gradient(160deg, #e8c9a0 0%, #cf9a6b 45%, #8a5a3b 100%)",
  interior: "linear-gradient(160deg, #ece4d6 0%, #cbb896 50%, #96794f 100%)",
  stone: "linear-gradient(160deg, #d9d4ca 0%, #b0a898 50%, #6f6759 100%)",
  garden: "linear-gradient(160deg, #c9d6bb 0%, #92a97f 50%, #4f6644 100%)",
  night: "linear-gradient(160deg, #3a5060 0%, #22333f 55%, #101c26 100%)",
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
      {/* soft light flare */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 25% 15%, rgba(255,255,255,0.35) 0%, transparent 55%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-3 px-6 text-center text-white/85">
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          className="opacity-80"
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
        <span className="text-[10px] font-medium uppercase tracking-[0.25em] opacity-70">
          Foto in arrivo
        </span>
      </div>
    </div>
  );
}
