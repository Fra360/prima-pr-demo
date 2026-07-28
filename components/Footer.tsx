export default function Footer() {
  return (
    <footer className="tone-dark border-t border-light-sky/10 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
        <div>
          <span className="font-display text-3xl tracking-wide text-foam">
            Casa Omero
          </span>
          <p className="eyebrow mt-1.5 text-[0.6rem] text-lagoon">
            Sperlonga · Italia
          </p>
        </div>
        <p className="max-w-md text-sm font-light leading-relaxed text-light-sky/75">
          Casa vacanze nel cuore di Sperlonga, a pochi passi dal mare e dal
          borgo antico. Terrazza vista mare, parcheggio privato, WiFi
          gratuito.
        </p>
        <div className="rule" />
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-light-sky/70">
          © {new Date().getFullYear()} Casa Omero — Tutti i diritti riservati
        </p>
      </div>
    </footer>
  );
}
