"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

/**
 * Sezione "Esplora la casa": una sola esperienza immersiva, la build Unity
 * WebGL in `public/tour/` (si parte in AR, il tasto VR della build porta
 * dentro casa).
 *
 * Niente cornice: il riquadro arriva ai bordi dello schermo e il fondo e lo
 * stesso della sezione, cosi l'esperienza sembra incastonata nella pagina
 * invece che appoggiata sopra.
 *
 * Finche la build non e in `public/tour/` la sezione mostra il modello 3D
 * (public/models/casa.glb) invece di restare vuota: appena la cartella
 * esiste, la build Unity prende il suo posto da sola, senza toccare il
 * codice. Il modello puo anche essere servito da un bucket esterno
 * impostando NEXT_PUBLIC_MODEL_URL.
 */

const MODEL_SRC = process.env.NEXT_PUBLIC_MODEL_URL || "/models/casa.glb";
const TOUR_URL = "/tour/index.html";

/** Permessi che servono alla build: AR usa la fotocamera, VR il WebXR */
const TOUR_ALLOW =
  "camera; xr-spatial-tracking; fullscreen; accelerometer; gyroscope; magnetometer; autoplay";

type Stato = "verifica" | "unity" | "modello";

function VisoreModello() {
  const [pronto, setPronto] = useState(false);
  // Su touchscreen il visore parte "bloccato": un dito scorre la pagina
  // normalmente finche non si tocca "Esplora in 3D". Da li il dito ruota il
  // modello, e "Fine" restituisce lo scroll alla pagina (pattern alla Google
  // Maps: evita sia lo scroll che ruba la rotazione, sia il modello che
  // intrappola la pagina).
  const [interattivo, setInterattivo] = useState(false);
  const [avanzamento, setAvanzamento] = useState(0);
  const mvRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Il web component va registrato solo nel browser
    import("@google/model-viewer").then(() => setPronto(true));
  }, []);

  useEffect(() => {
    const mv = mvRef.current;
    if (!mv) return;
    const onProgress = (e: Event) => {
      const d = (e as CustomEvent).detail as { totalProgress: number };
      setAvanzamento(d.totalProgress);
    };
    mv.addEventListener("progress", onProgress);
    return () => mv.removeEventListener("progress", onProgress);
  }, [pronto]);

  const caricando = pronto && avanzamento < 1;

  return (
    <div className="relative h-full w-full">
      {pronto && (
        <model-viewer
          ref={mvRef as React.RefObject<HTMLElement>}
          src={MODEL_SRC}
          alt="Modello 3D navigabile di Casa Omero: pianta della casa con arredi"
          camera-controls
          auto-rotate
          auto-rotate-delay="1500"
          rotation-per-second="20deg"
          shadow-intensity="0.9"
          shadow-softness="1"
          exposure="1.35"
          environment-image="neutral"
          tone-mapping="neutral"
          camera-orbit="20deg 35deg 105%"
          touch-action="none"
          interaction-prompt="none"
          // Fondo trasparente: si vede l'aurora della pagina, nessuno stacco
          style={{ width: "100%", height: "100%", background: "transparent" }}
        />
      )}

      {caricando && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 text-light-sky">
          <span className="eyebrow text-[0.6rem]">
            Caricamento modello… {Math.round(avanzamento * 100)}%
          </span>
          <div className="h-[3px] w-40 overflow-hidden rounded-full bg-light-sky/20">
            <div
              className="h-full rounded-full bg-lagoon transition-[width] duration-200"
              style={{ width: `${Math.max(avanzamento * 100, 4)}%` }}
            />
          </div>
        </div>
      )}

      {/* Scudo touch: visibile solo su touchscreen. Un dito sopra di esso
          scorre la pagina come al solito; il tap lo rimuove e attiva la
          rotazione del modello. */}
      {pronto && !interattivo && !caricando && (
        <button
          onClick={() => setInterattivo(true)}
          aria-label="Attiva la rotazione del modello 3D"
          className="absolute inset-0 hidden w-full touch-auto items-end justify-center bg-transparent pb-6 pointer-coarse:flex"
        >
          <span className="glass glass--dark pointer-events-none flex items-center gap-2 rounded-full px-5 py-3 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-foam">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 13V5.5a1.5 1.5 0 013 0V12m0-2.5a1.5 1.5 0 013 0V12m0-1a1.5 1.5 0 013 0v1m0 0a1.5 1.5 0 013 0v3a7 7 0 01-7 7h-1.5a7 7 0 01-5.6-2.8L4.5 15a1.7 1.7 0 012.7-2L8 14" />
            </svg>
            Tocca per esplorare in 3D
          </span>
        </button>
      )}

      {pronto && interattivo && (
        <button
          onClick={() => setInterattivo(false)}
          className="glass glass--dark absolute right-4 top-4 hidden min-h-[44px] items-center gap-2 rounded-full px-5 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-foam pointer-coarse:flex"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
          Fine
        </button>
      )}

      {!pronto && (
        <div className="flex h-full items-center justify-center">
          <span className="eyebrow text-[0.6rem] text-light-sky/70">
            Caricamento modello…
          </span>
        </div>
      )}
    </div>
  );
}

export default function Explore3D() {
  const [stato, setStato] = useState<Stato>("verifica");

  // Una sola verifica al montaggio: c'e la build Unity? Se si la sezione e
  // sua, altrimenti resta il modello 3D.
  useEffect(() => {
    let vivo = true;
    fetch(TOUR_URL, { method: "HEAD" })
      .then((r) => vivo && setStato(r.ok ? "unity" : "modello"))
      .catch(() => vivo && setStato("modello"));
    return () => {
      vivo = false;
    };
  }, []);

  return (
    <section id="esperienza3d" className="tone-dark py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal stagger className="mb-12 text-center">
          <p className="eyebrow text-light-sky">Esperienza immersiva</p>
          <h2 className="headline mt-5 text-foam">
            Esplora la casa{" "}
            <em className="not-italic text-light-sky">prima di arrivare</em>
          </h2>
          <p className="lede mx-auto mt-6 max-w-xl text-light-sky/85">
            {stato === "unity"
              ? "Inquadra lo spazio intorno a te per posare la casa in realtà aumentata, oppure entra in VR e cammina tra gli ambienti."
              : "Ruota il modello per vedere la casa da ogni lato, stanza per stanza."}
          </p>
        </Reveal>
      </div>

      {/* Nessuna cornice e nessun bordo: il riquadro arriva ai margini dello
          schermo e condivide il fondo della sezione. */}
      <Reveal className="relative h-[70svh] min-h-[460px] w-full">
        {stato === "unity" && (
          <iframe
            src={TOUR_URL}
            title="Casa Omero in realtà aumentata e realtà virtuale"
            allow={TOUR_ALLOW}
            allowFullScreen
            className="h-full w-full border-0 bg-transparent"
          />
        )}
        {stato === "modello" && <VisoreModello />}
        {stato === "verifica" && (
          <div className="flex h-full items-center justify-center">
            <span className="eyebrow text-[0.6rem] text-light-sky/70">
              Caricamento…
            </span>
          </div>
        )}
      </Reveal>

      <div className="mx-auto mt-6 max-w-6xl px-6">
        <p className="text-center text-sm font-light italic text-light-sky/70">
          {stato === "unity"
            ? "Funziona direttamente dal browser: non serve installare nulla."
            : "Il modello reale della casa — trascina per ruotarlo, pizzica per lo zoom."}
        </p>
      </div>
    </section>
  );
}
