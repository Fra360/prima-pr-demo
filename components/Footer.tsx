export default function Footer() {
  return (
    <footer className="bg-ink py-14 text-white/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
        <div>
          <span className="font-display text-3xl tracking-wide text-white">
            Casa Omero
          </span>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.35em] text-gold-light">
            Sperlonga · Italia
          </p>
        </div>
        <p className="max-w-md text-xs font-light leading-relaxed">
          Casa vacanze nel cuore di Sperlonga, a pochi passi dal mare e dal
          borgo antico. Terrazza vista mare, parcheggio privato, WiFi
          gratuito.
        </p>
        <div className="h-px w-16 bg-gold/50" />
        <p className="text-[10px] uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} Casa Omero — Tutti i diritti riservati
        </p>
      </div>
    </footer>
  );
}
