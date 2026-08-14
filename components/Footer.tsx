/**
 * Piè di pagina.
 *
 * CIN — Codice Identificativo Nazionale. Va esposto in ogni annuncio della
 * struttura, quindi anche qui: essendo il footer, compare su tutto il sito.
 *
 * Per inserirlo basta scrivere il codice qui sotto fra le virgolette. Finche
 * la stringa e vuota la riga non viene mostrata: meglio nessun codice che un
 * codice inventato o un segnaposto pubblicato per sbaglio.
 */
const CIN = "IT059030C258LAFGJE";

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

        {CIN && (
          /* Piena opacita e non attenuato come il copyright: e un dato che
             deve potersi leggere e trascrivere, non una nota di servizio.
             `select-all` perche di solito lo si copia tutto intero. */
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-light-sky">
            <span className="text-light-sky/70">CIN</span>{" "}
            <span className="select-all font-medium text-foam">{CIN}</span>
          </p>
        )}

        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-light-sky/70">
          © {new Date().getFullYear()} Casa Omero — Tutti i diritti riservati
        </p>
      </div>
    </footer>
  );
}
