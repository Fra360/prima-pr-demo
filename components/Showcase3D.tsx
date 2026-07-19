"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { site } from "@/lib/site";

/**
 * Showcase 3D interattivo: un tuo modello .glb navigabile, con pulsante AR
 * per guardarlo dal telefono.
 *
 * Sostituisci il file indicato in lib/site.ts (model.src) con un tuo export
 * .glb (le texture incorporate vengono mostrate automaticamente). Per l'AR su
 * iPhone aggiungi anche un export .usdz e imposta model.iosSrc.
 */
export default function Showcase3D() {
  const [ready, setReady] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    import("@google/model-viewer").then(() => setReady(true));
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  return (
    <section id="showcase" className="relative bg-bg-2 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-accent" />
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-accent">
              Interattivo
            </p>
          </div>
          <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-fg md:text-5xl">
            Esplora un modello in 3D
          </h2>
          <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-muted">
            Trascina per ruotare, pizzica per lo zoom. Dal telefono puoi anche
            guardarlo in realtà aumentata nella tua stanza.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 overflow-hidden border border-line">
            <div className="relative h-[60svh] min-h-[440px] w-full bg-bg">
              {ready ? (
                <model-viewer
                  src={site.model.src}
                  ios-src={site.model.iosSrc}
                  alt={site.model.alt}
                  camera-controls
                  auto-rotate
                  auto-rotate-delay="1200"
                  rotation-per-second="18deg"
                  shadow-intensity="1"
                  shadow-softness="0.9"
                  exposure="1.05"
                  camera-orbit="25deg 75deg 105%"
                  touch-action="none"
                  interaction-prompt="none"
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  style={{
                    width: "100%",
                    height: "100%",
                    background:
                      "radial-gradient(ellipse at 50% 30%, #1b1b1f 0%, #101012 55%, #0a0a0b 100%)",
                  }}
                >
                  {(interactive || !coarse) && (
                    <button
                      slot="ar-button"
                      className="absolute bottom-5 right-5 flex items-center gap-2 border border-accent bg-bg/80 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-accent backdrop-blur transition-colors hover:bg-accent hover:text-bg"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3l7 4v10l-7 4-7-4V7l7-4zM12 12l7-4M12 12v9M12 12L5 8" />
                      </svg>
                      Guarda in AR
                    </button>
                  )}
                </model-viewer>
              ) : null}

              {ready && !interactive && (
                <button
                  onClick={() => setInteractive(true)}
                  aria-label="Attiva la rotazione del modello 3D"
                  className="absolute inset-0 hidden w-full touch-auto items-end justify-center bg-transparent pb-6 pointer-coarse:flex"
                >
                  <span className="pointer-events-none flex items-center gap-2 border border-accent/60 bg-bg/70 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-fg backdrop-blur">
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
                  className="absolute right-4 top-4 hidden items-center gap-2 border border-line bg-bg/70 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-fg backdrop-blur transition-colors hover:border-accent pointer-coarse:flex"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                  Fine
                </button>
              )}

              {!ready && (
                <div className="flex h-full items-center justify-center">
                  <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted">
                    Caricamento modello…
                  </span>
                </div>
              )}
            </div>
          </div>

          <p className="mt-5 text-center text-xs font-light italic text-muted">
            Metti un tuo export <code className="text-accent-soft">.glb</code> in{" "}
            <code className="text-accent-soft">public/models/</code> e aggiornalo
            in <code className="text-accent-soft">lib/site.ts</code>. L&apos;AR
            funziona dal telefono sul sito pubblicato (serve HTTPS).
          </p>
        </Reveal>
      </div>
    </section>
  );
}
