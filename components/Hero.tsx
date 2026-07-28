"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

/**
 * Hero cinematografico guidato dallo scroll.
 *
 * Il video viene "scrubbato": lo scroll ne controlla il tempo di
 * riproduzione. Durante il caricamento si vede il poster, che e esattamente
 * il primo fotogramma: il passaggio poster->video e quindi invisibile.
 *
 * Sopra il video non c'e nessun testo, per scelta. Il filmato prende tutta
 * l'attenzione e qualsiasi scritta sovrapposta verrebbe saltata: il racconto
 * a parole comincia subito sotto, quando la sequenza e finita. Restano solo
 * la navbar e l'indicatore di scroll.
 *
 * Consiglio per l'export: codifica con keyframe frequenti (ffmpeg -g 1),
 * cosi lo scrubbing e fluido in ogni punto.
 */

/* TODO: sostituire con il video definitivo (render da Blender).
   Cambiare solo queste due righe: il resto del componente non va toccato. */
const HERO_VIDEO_SRC = "/videos/hero.mp4";
const HERO_VIDEO_SRC_MOBILE = "/videos/hero-mobile.mp4";

/** Primo fotogramma del video: copre l'attesa del download */
const HERO_VIDEO_POSTER = "/videos/hero-poster.jpg";

/**
 * Punto dello scroll (0-1) in cui il video raggiunge l'ultimo frame.
 * Il tratto restante scorre tenendo la scena finale ferma: alzalo per
 * accorciare la pausa, abbassalo per allungarla.
 */
const VIDEO_END_AT = 0.8;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const veilRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Velo, indicatore di scroll e barra di avanzamento aggiornati a mano:
  // i binding dichiarativi scroll->stile di framer-motion vengono compilati
  // in ScrollTimeline native che si desincronizzano quando l'altezza della
  // pagina cambia dopo il mount (immagini, model-viewer, ecc.).
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Velatura uniforme su tutto il fotogramma: copre l'intero schermo,
    // quindi non ha bordi visibili. Si intensifica verso la fine per
    // accompagnare l'uscita dell'hero nel blu profondo della pagina.
    if (veilRef.current) veilRef.current.style.opacity = String(0.18 + 0.3 * p);
    if (cueRef.current)
      cueRef.current.style.opacity = String(Math.max(1 - p / 0.12, 0));
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
  });

  // Sorgente scelta in base al viewport: su telefono una versione 720p molto
  // piu leggera. La scelta avviene dopo il mount (niente `src` nel JSX) cosi
  // il browser scarica un solo file e l'HTML del server resta identico.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    video.src = mobile ? HERO_VIDEO_SRC_MOBILE : HERO_VIDEO_SRC;
    video.load();
  }, []);

  // Sblocco iOS: su iPhone il seeking (currentTime) non aggiorna i frame
  // finche il video non e stato "riprodotto" almeno una volta. Un muted
  // inline video puo fare play/pause senza gesto, ma per sicurezza ritentiamo
  // anche al primo tocco. Senza questo, su iOS lo scrubbing resta congelato.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true; // React a volte non imposta la proprieta muted
    const unlock = () => {
      const p = video.play();
      if (p && typeof p.then === "function") {
        p.then(() => video.pause()).catch(() => {});
      }
    };
    unlock();
    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("pointerdown", unlock);
    return () => {
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("pointerdown", unlock);
    };
  }, []);

  // Scrub del video con lo scroll (con smoothing)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Con la riduzione del movimento attiva restiamo sul primo fotogramma
    if (reduced) return;

    let raf = 0;
    let current = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!video.duration || video.readyState < 2) return;
      // Il video completa la sua animazione prima della fine dello scroll:
      // l'ultimo tratto tiene fermo il frame finale, cosi la scena finita
      // si vede ferma un istante prima che l'hero si stacchi.
      const p = Math.min(scrollYProgress.get() / VIDEO_END_AT, 1);
      const target = p * (video.duration - 0.05);
      current += (target - current) * 0.12;
      if (Math.abs(video.currentTime - current) > 0.02) {
        video.currentTime = current;
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [scrollYProgress, reduced]);

  return (
    <section ref={ref} id="top" className="relative h-[300svh]">
      <div className="sticky top-0 h-svh min-h-[540px] overflow-hidden bg-deep-ocean">
        {/* Livello media. Il video resta sempre nel DOM e visibile (mai
            display:none ne opacity:0): iOS non carica i video nascosti. */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster={HERO_VIDEO_POSTER}
          aria-label="Casa Omero vista dall'esterno, sequenza guidata dallo scroll"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Velo che si intensifica con lo scroll */}
        <div
          ref={veilRef}
          className="absolute inset-0 bg-deep-ocean"
          style={{ opacity: 0.18 }}
        />

        {/* Sfumatura in basso: l'hero si scioglie nel blu della pagina invece
            di finire con una linea netta */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-deep-ocean" />

        {/* Unico elemento ammesso sopra il video, oltre alla navbar */}
        <div
          ref={cueRef}
          className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-light-sky/75"
        >
          <span className="eyebrow text-[0.6rem]">Scorri</span>
          <span className="hero-cue h-14 w-px bg-gradient-to-b from-light-sky/70 to-transparent" />
        </div>

        {/* Avanzamento della sequenza */}
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-light-sky/10">
          <div
            ref={barRef}
            className="h-full origin-left bg-lagoon"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
