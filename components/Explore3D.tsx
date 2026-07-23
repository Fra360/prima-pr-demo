"use client";

import { useEffect, useRef, useState } from "react";
import Placeholder from "./Placeholder";
import Reveal from "./Reveal";

/**
 * Sezione "Esplora la casa": modello 3D navigabile (GLB) + virtual tour
 * Unity WebGL.
 *
 * - Modello 3D: di default legge public/models/casa.glb. Per servirlo da
 *   Cloudflare R2 (file grande, non compresso) basta impostare la variabile
 *   d'ambiente NEXT_PUBLIC_MODEL_URL con l'URL pubblico del bucket — nessuna
 *   modifica al codice. Il bucket R2 deve permettere il GET via CORS dal
 *   dominio del sito.
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
  // normalmente finché non si tocca "Esplora in 3D". Da lì il dito ruota
  // il modello, e "Fine" restituisce lo scroll alla pagina (pattern alla
  // Google Maps: evita sia lo scroll che ruba la rotazione, sia il
  // modello che intrappola la pagina).
  const [interactive, setInteractive] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const [progress, setProgress] = useState(0);
  const mvRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Il web component va registrato solo nel browser
    import("@google/model-viewer").then(() => setReady(true));
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Barra di avanzamento del download (utile per il modello grande su R2)
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
    <div className="relative h-[60svh] min-h-[420px] w-full bg-sea-deep">
      {ready && (
        <model-viewer
          ref={mvRef as React.RefObject<HTMLElement>}
          src={MODEL_SRC}
          alt="Modello 3D di Casa Omero"
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
              "radial-gradient(ellipse at 50% 35%, #2e5d6b 0%, #16323c 60%, #101c26 100%)",
          }}
        />
      )}

      {/* Barra di caricamento */}
      {loading && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/80">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em]">
            Caricamento modello… {Math.round(progress * 100)}%
          </span>
          <div className="h-[3px] w-40 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-200"
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
          <span className="pointer-events-none flex items-center gap-2 rounded-full border border-gold/60 bg-ink/70 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur">
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
          className="absolute right-4 top-4 hidden items-center gap-2 rounded-full border border-white/40 bg-ink/70 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur transition-colors hover:border-gold pointer-coarse:flex"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
          Fine
        </button>
      )}

      {!ready && (
        <div className="flex h-full items-center justify-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-ink-soft/50">
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
    <div className="relative h-[60svh] min-h-[420px] w-full">
      {state === "ready" ? (
        <iframe
          src={TOUR_URL}
          title="Virtual tour di Casa Omero"
          className="h-full w-full border-0"
          allow="fullscreen; xr-spatial-tracking; accelerometer; gyroscope"
        />
      ) : (
        <>
          <Placeholder variant="night" label="Virtual tour immersivo" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-ink/40 px-6 text-center">
            {state === "missing" ? (
              <p className="max-w-md text-sm font-light leading-relaxed text-white/85">
                La build Unity non è ancora online: esporta il progetto in
                WebGL e copia la cartella della build in{" "}
                <code className="text-gold-light">public/tour/</code>. Questo
                pulsante la avvierà automaticamente.
              </p>
            ) : (
              <p className="max-w-md font-display text-lg italic text-white/85">
                Cammina dentro Casa Omero: muoviti stanza per stanza come in
                un videogioco.
              </p>
            )}
            <button
              onClick={start}
              disabled={state === "loading"}
              className="rounded-full border border-white/60 px-10 py-4 text-xs font-medium uppercase tracking-[0.3em] text-white transition-all duration-300 hover:border-gold hover:bg-gold disabled:opacity-50"
            >
              {state === "loading" ? "Verifica…" : "Entra nel tour"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Explore3D() {
  const [tab, setTab] = useState<Tab>("modello");

  return (
    <section id="esperienza3d" className="bg-ivory py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.4em] text-gold">
              Esperienza immersiva
            </p>
            <h2 className="font-display text-4xl font-light md:text-5xl">
              Esplora la casa <em className="text-sea">prima di arrivare</em>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-ink-soft/70">
              Ruota il modello 3D per vedere ogni stanza, oppure entra nel
              virtual tour e cammina tra gli ambienti.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {/* Tabs */}
          <div className="flex justify-center">
            <div className="flex w-full flex-col gap-1 rounded-full border border-ink/10 bg-ink/5 p-1 sm:w-auto sm:flex-row">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`rounded-full px-8 py-3 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors sm:px-10 ${
                    tab === t.id
                      ? "bg-ink text-white"
                      : "text-ink-soft/70 hover:bg-ivory-dark"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-ink/10 shadow-2xl shadow-sea-deep/10">
            {tab === "modello" && <ModelTab />}
            {tab === "tour" && <TourTab />}
          </div>

          <p className="mt-6 text-center text-xs font-light italic text-ink-soft/50">
            Il modello reale della casa — trascina per ruotarlo, pizzica per
            lo zoom.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
