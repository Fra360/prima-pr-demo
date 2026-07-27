"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

/**
 * Sezione "Esplora la casa": modello 3D navigabile (GLB) + virtual tour
 * Unity WebGL.
 *
 * - Modello 3D: legge public/models/casa.glb. Il modello ottimizzato pesa
 *   ~10 MB, quindi sta comodamente nel repo. Se un domani servisse servirlo
 *   da un bucket esterno (Cloudflare R2), basta impostare
 *   NEXT_PUBLIC_MODEL_URL: nessuna modifica al codice, solo il CORS sul
 *   bucket.
 * - Virtual tour: copia la build Unity WebGL in public/tour/ (index.html
 *   incluso) e il tab la caricherà al click.
 */

const MODEL_SRC = process.env.NEXT_PUBLIC_MODEL_URL || "/models/casa.glb";
const TOUR_URL = "/tour/index.html";

type Tab = "modello" | "tour";

const tabs: { id: Tab; label: string }[] = [
  { id: "modello", label: "Modello 3D" },
  { id: "tour", label: "Virtual Tour" },
];

function ModelTab() {
  const [ready, setReady] = useState(false);
  // Su touchscreen il viewer parte "bloccato": un dito scorre la pagina
  // normalmente finche non si tocca "Esplora in 3D". Da li il dito ruota
  // il modello, e "Fine" restituisce lo scroll alla pagina (pattern alla
  // Google Maps: evita sia lo scroll che ruba la rotazione, sia il
  // modello che intrappola la pagina).
  const [interactive, setInteractive] = useState(false);
  const [progress, setProgress] = useState(0);
  const mvRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Il web component va registrato solo nel browser
    import("@google/model-viewer").then(() => setReady(true));
  }, []);

  // Barra di avanzamento del download
  useEffect(() => {
    const mv = mvRef.current;
    if (!mv) return;
    const onProgress = (e: Event) => {
      const detail = (e as CustomEvent).detail as { totalProgress: number };
      setProgress(detail.totalProgress);
    };
    mv.addEventListener("progress", onProgress);
    return () => mv.removeEventListener("progress", onProgress);
  }, [ready]);

  const loading = ready && progress < 1;

  return (
    <div className="relative h-[60svh] min-h-[420px] w-full overflow-hidden rounded-lg bg-deep-ocean">
      {ready && (
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
          style={{
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(ellipse at 50% 35%, #1e5a6e 0%, #0d2b45 65%, #0d2b45 100%)",
          }}
        />
      )}

      {loading && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 text-light-sky">
          <span className="eyebrow text-[0.6rem]">
            Caricamento modello… {Math.round(progress * 100)}%
          </span>
          <div className="h-[3px] w-40 overflow-hidden rounded-full bg-light-sky/20">
            <div
              className="h-full rounded-full bg-sandy-beige transition-[width] duration-200"
              style={{ width: `${Math.max(progress * 100, 4)}%` }}
            />
          </div>
        </div>
      )}

      {/* Scudo touch: visibile solo su touchscreen. Un dito sopra di esso
          scorre la pagina come al solito; il tap lo rimuove e attiva la
          rotazione del modello. */}
      {ready && !interactive && !loading && (
        <button
          onClick={() => setInteractive(true)}
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

      {ready && interactive && (
        <button
          onClick={() => setInteractive(false)}
          className="glass glass--dark absolute right-4 top-4 hidden min-h-[44px] items-center gap-2 rounded-full px-5 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-foam pointer-coarse:flex"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
          Fine
        </button>
      )}

      {!ready && (
        <div className="flex h-full items-center justify-center">
          <span className="eyebrow text-[0.6rem] text-light-sky/60">
            Caricamento modello…
          </span>
        </div>
      )}
    </div>
  );
}

function TourTab() {
  const [state, setState] = useState<"idle" | "loading" | "ready" | "missing">(
    "idle"
  );

  const start = async () => {
    setState("loading");
    try {
      const res = await fetch(TOUR_URL, { method: "HEAD" });
      setState(res.ok ? "ready" : "missing");
    } catch {
      setState("missing");
    }
  };

  return (
    <div className="relative h-[60svh] min-h-[420px] w-full overflow-hidden rounded-lg">
      {state === "ready" ? (
        <iframe
          src={TOUR_URL}
          title="Virtual tour di Casa Omero"
          className="h-full w-full border-0"
          allow="fullscreen; xr-spatial-tracking; accelerometer; gyroscope"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-7 bg-gradient-to-br from-ocean-teal to-deep-ocean px-6 text-center">
          <p className="eyebrow text-sandy-beige">Virtual tour immersivo</p>
          {state === "missing" ? (
            <p className="max-w-md text-sm font-light leading-relaxed text-light-sky">
              La build Unity non è ancora online: esporta il progetto in
              WebGL e copia la cartella della build in{" "}
              <code className="text-sandy-beige">public/tour/</code>. Questo
              pulsante la avvierà automaticamente.
            </p>
          ) : (
            <p className="lede max-w-md font-display italic text-foam">
              Cammina dentro Casa Omero: muoviti stanza per stanza come in un
              videogioco.
            </p>
          )}
          <button
            onClick={start}
            disabled={state === "loading"}
            className="btn btn--ghost disabled:opacity-50"
          >
            {state === "loading" ? "Verifica…" : "Entra nel tour"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Explore3D() {
  const [tab, setTab] = useState<Tab>("modello");

  return (
    <section id="esperienza3d" className="tone-dark py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal stagger className="mb-12 text-center">
          <p className="eyebrow text-sandy-beige">Esperienza immersiva</p>
          <h2 className="headline mt-5 text-foam">
            Esplora la casa{" "}
            <em className="not-italic text-light-sky">prima di arrivare</em>
          </h2>
          <p className="lede mx-auto mt-6 max-w-xl text-light-sky/85">
            Ruota il modello 3D per vedere ogni stanza, oppure entra nel
            virtual tour e cammina tra gli ambienti.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex justify-center">
            <div
              className="glass glass--dark flex w-full flex-col gap-1 rounded-full p-1.5 sm:w-auto sm:flex-row"
              role="tablist"
              aria-label="Modalità di esplorazione"
            >
              {tabs.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`min-h-[44px] rounded-full px-8 text-[0.6rem] font-medium uppercase tracking-[0.2em] transition-colors sm:px-10 ${
                    tab === t.id
                      ? "bg-sandy-beige text-deep-ocean"
                      : "text-light-sky/80 hover:text-seafoam"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Il vetro fa da cornice: sfoca l'aurora dietro, il viewer sta
              sopra e resta perfettamente nitido. */}
          <div className="glass glass--dark mt-8 p-2 sm:p-3">
            {tab === "modello" && <ModelTab />}
            {tab === "tour" && <TourTab />}
          </div>

          <p className="mt-6 text-center text-sm font-light italic text-light-sky/55">
            Il modello reale della casa — trascina per ruotarlo, pizzica per
            lo zoom.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
