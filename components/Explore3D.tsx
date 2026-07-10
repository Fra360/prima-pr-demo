"use client";

import { useEffect, useState } from "react";
import Placeholder from "./Placeholder";
import Reveal from "./Reveal";

/**
 * Sezione "Esplora la casa": modello 3D navigabile (GLB) con AR,
 * planimetria e virtual tour Unity WebGL — sul modello di
 * youstartxr.com/apeiron.
 *
 * - Modello 3D: sostituisci public/models/casa.glb con il tuo export
 *   (le texture incorporate nel GLB vengono mostrate automaticamente).
 *   Per l'AR su iPhone aggiungi anche un export .usdz e imposta IOS_SRC.
 * - Virtual tour: copia la build Unity WebGL in public/tour/
 *   (index.html incluso) e il tab la caricherà al click.
 */

const MODEL_SRC = "/models/casa.glb";
const IOS_SRC = undefined; // es. "/models/casa.usdz" per Quick Look su iPhone
const TOUR_URL = "/tour/index.html";

type Tab = "modello" | "planimetria" | "tour";

const tabs: { id: Tab; label: string }[] = [
  { id: "modello", label: "Modello 3D" },
  { id: "planimetria", label: "Planimetria" },
  { id: "tour", label: "Virtual Tour" },
];

function ModelTab() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Il web component va registrato solo nel browser
    import("@google/model-viewer").then(() => setReady(true));
  }, []);

  return (
    <div className="relative h-[60svh] min-h-[420px] w-full bg-ivory-dark">
      {ready ? (
        <model-viewer
          src={MODEL_SRC}
          ios-src={IOS_SRC}
          alt="Modello 3D di Casa Omero"
          camera-controls
          auto-rotate
          auto-rotate-delay="1500"
          rotation-per-second="20deg"
          shadow-intensity="1"
          shadow-softness="0.8"
          exposure="1.1"
          camera-orbit="30deg 78deg 115%"
          touch-action="pan-y"
          ar
          ar-modes="webxr scene-viewer quick-look"
          style={{ width: "100%", height: "100%" }}
        >
          <button
            slot="ar-button"
            className="absolute bottom-5 right-5 flex items-center gap-2 border border-gold bg-ivory/90 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink backdrop-blur transition-colors hover:bg-gold hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l7 4v10l-7 4-7-4V7l7-4zM12 12l7-4M12 12v9M12 12L5 8" />
            </svg>
            Guarda in AR
          </button>
        </model-viewer>
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-ink-soft/50">
            Caricamento modello…
          </span>
        </div>
      )}
    </div>
  );
}

function PlanTab() {
  const [hasImage, setHasImage] = useState(true);

  return (
    <div className="relative h-[60svh] min-h-[420px] w-full">
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/plans/planimetria.jpg"
          alt="Planimetria di Casa Omero"
          onError={() => setHasImage(false)}
          className="h-full w-full bg-ivory-dark object-contain"
        />
      ) : (
        <>
          <Placeholder variant="stone" label="Planimetria della casa" />
          <p className="absolute bottom-5 left-1/2 w-max max-w-[90%] -translate-x-1/2 bg-ink/70 px-4 py-2 text-center text-[11px] font-light tracking-wide text-white/85 backdrop-blur">
            Carica la planimetria in <code>public/plans/planimetria.jpg</code>
          </p>
        </>
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
              className="border border-white/60 px-10 py-4 text-xs font-medium uppercase tracking-[0.3em] text-white transition-all duration-300 hover:border-gold hover:bg-gold disabled:opacity-50"
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
              Ruota il modello 3D, guardalo in realtà aumentata nel tuo
              salotto, studia la planimetria o entra nel virtual tour e
              cammina tra le stanze.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {/* Tabs */}
          <div className="flex justify-center">
            <div className="flex w-full flex-col gap-px border border-ink/10 bg-ink/10 p-px sm:w-auto sm:flex-row">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors sm:px-8 ${
                    tab === t.id
                      ? "bg-ink text-white"
                      : "bg-ivory text-ink-soft/70 hover:bg-ivory-dark"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-sm border border-ink/10 shadow-2xl shadow-sea-deep/10">
            {tab === "modello" && <ModelTab />}
            {tab === "planimetria" && <PlanTab />}
            {tab === "tour" && <TourTab />}
          </div>

          <p className="mt-6 text-center text-xs font-light italic text-ink-soft/50">
            Modello segnaposto — sostituiscilo con il tuo export GLB per
            vedere texture e dettagli reali. L&apos;AR funziona dal telefono
            sul sito pubblicato (serve HTTPS).
          </p>
        </Reveal>
      </div>
    </section>
  );
}
