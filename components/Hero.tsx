"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";

/**
 * Hero cinematografico guidato dallo scroll.
 *
 * Il video di `public/videos/` viene "scrubbato": lo scroll ne controlla il
 * tempo di riproduzione. Durante il caricamento si vede il poster, che è
 * esattamente il primo fotogramma del video: il passaggio poster→video è
 * quindi invisibile, senza nessuna scena segnaposto.
 *
 * Consiglio per l'export del video AI: codifica con keyframe frequenti
 * (es. ffmpeg -g 1) così lo scrubbing è fluido in ogni punto.
 */

const VIDEO_SRC = "/videos/hero.mp4";
const VIDEO_SRC_MOBILE = "/videos/hero-mobile.mp4";
/** Primo fotogramma del video: copre l'attesa del download */
const VIDEO_POSTER = "/videos/hero-poster.jpg";

/**
 * Punto dello scroll (0-1) in cui il video raggiunge l'ultimo frame.
 * Il tratto restante scorre tenendo la scena finale ferma: alzalo per
 * accorciare la pausa, abbassalo per allungarla.
 */
const VIDEO_END_AT = 0.8;

/** Fasi di testo che si alternano durante lo scroll */
const stages = [
  {
    eyebrow: "Sperlonga · Riviera di Ulisse",
    title: "Casa Omero",
    sub: "Un rifugio elegante sul mare, a pochi passi dalla spiaggia e dal borgo antico di Sperlonga.",
    range: [0, 0.3] as const,
  },
  {
    eyebrow: "La terrazza",
    title: "Il blu, davanti a voi",
    sub: "Colazioni lente e tramonti dorati sulla vostra terrazza privata con vista mare.",
    range: [0.36, 0.62] as const,
  },
  {
    eyebrow: "La spiaggia",
    title: "A 7 minuti a piedi",
    sub: "Sabbia dorata, acque Bandiera Blu e i vicoli bianchi del borgo dietro l'angolo.",
    range: [0.68, 0.94] as const,
  },
];

/** Interpolazione lineare a tratti (con clamp agli estremi) */
function interp(p: number, xs: readonly number[], ys: readonly number[]) {
  if (p <= xs[0]) return ys[0];
  for (let i = 1; i < xs.length; i++) {
    if (p <= xs[i]) {
      const t = (p - xs[i - 1]) / (xs[i] - xs[i - 1]);
      return ys[i - 1] + (ys[i] - ys[i - 1]) * t;
    }
  }
  return ys[ys.length - 1];
}

function Stage({
  stage,
  progress,
  isFirst,
}: {
  stage: (typeof stages)[number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  isFirst: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [a, b] = stage.range;

  // Applichiamo opacità/posizione direttamente all'elemento: i binding
  // dichiarativi scroll→stile di framer-motion vengono compilati in
  // ScrollTimeline native che si desincronizzano quando l'altezza della
  // pagina cambia dopo il mount (immagini, model-viewer, ecc.).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = (p: number) => {
      const opacity = isFirst
        ? interp(p, [a, b - 0.04, b], [1, 1, 0])
        : interp(p, [a, a + 0.05, b - 0.04, b], [0, 1, 1, 0]);
      const y = interp(p, [a, b], isFirst ? [0, -40] : [30, -30]);
      el.style.opacity = String(opacity);
      el.style.transform = `translateY(${y}px)`;
      el.style.visibility = opacity <= 0.001 ? "hidden" : "visible";
    };
    apply(progress.get());
    return progress.on("change", apply);
  }, [progress, a, b, isFirst]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white"
    >
      <div className="hero-type relative flex flex-col items-center">
        <p className="hero-eyebrow mb-6 text-[11px] font-medium uppercase tracking-[0.45em]">
          {stage.eyebrow}
        </p>
        <h2
          className={`font-display font-light leading-none tracking-wide ${
            isFirst
              ? "text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
              : "text-5xl sm:text-6xl md:text-7xl"
          }`}
        >
          {stage.title}
        </h2>
        <div className="my-8 h-px w-24 bg-gold" />
        <p className="max-w-xl font-display text-xl italic text-white/95 md:text-2xl">
          {stage.sub}
        </p>
        {isFirst && (
          <a
            href="#prenota"
            className="mt-12 rounded-full border border-white/60 px-10 py-4 text-xs font-medium uppercase tracking-[0.3em] transition-all duration-300 hover:border-gold hover:bg-gold"
          >
            Verifica disponibilità
          </a>
        )}
      </div>
    </div>
  );
}

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

  // Velo, indicatore di scroll e barra di avanzamento aggiornati a mano
  // (stesso motivo delle fasi di testo: niente ScrollTimeline native)
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Velatura uniforme su tutto il fotogramma: coprendo l'intero schermo non
    // ha bordi visibili, a differenza di qualsiasi forma centrata sul testo
    if (veilRef.current)
      veilRef.current.style.opacity = String(0.22 + 0.26 * p);
    if (cueRef.current)
      cueRef.current.style.opacity = String(interp(p, [0, 0.12], [1, 0]));
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
  });

  // Sorgente scelta in base al viewport: su telefono una versione 720p molto
  // più leggera. La scelta avviene dopo il mount (niente `src` nel JSX) così
  // il browser scarica un solo file e l'HTML del server resta identico.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    video.src = mobile ? VIDEO_SRC_MOBILE : VIDEO_SRC;
    video.load();
  }, []);

  // Sblocco iOS: su iPhone il seeking (currentTime) non aggiorna i frame
  // finché il video non è stato "riprodotto" almeno una volta. Un muted
  // inline video può fare play/pause senza gesto, ma per sicurezza ritentiamo
  // anche al primo tocco. Senza questo, su iOS lo scrubbing resta congelato.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true; // React a volte non imposta la proprietà muted
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
      // l'ultimo tratto tiene fermo il frame finale, così la scena finita
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
      <div className="sticky top-0 h-svh min-h-[540px] overflow-hidden bg-ink">
        {/* Livello media. Il poster è il primo fotogramma del video, quindi
            durante il download si vede già la scena giusta e il passaggio al
            video è impercettibile. Il video resta sempre nel DOM e visibile
            (mai display:none né opacity:0): iOS non carica i video nascosti. */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster={VIDEO_POSTER}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Velo scuro che si intensifica */}
        <div
          ref={veilRef}
          className="absolute inset-0 bg-ink"
          style={{ opacity: 0.25 }}
        />

        {/* Fasi di testo */}
        <div className="relative h-full">
          {stages.map((s, i) => (
            <Stage
              key={s.title}
              stage={s}
              progress={scrollYProgress}
              isFirst={i === 0}
            />
          ))}
        </div>

        {/* Indicatore di scroll */}
        <div
          ref={cueRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-[10px] uppercase tracking-[0.35em]">
              Scorri
            </span>
            <span className="h-12 w-px bg-gradient-to-b from-white/70 to-transparent" />
          </motion.div>
        </div>

        {/* Barra di avanzamento della sequenza */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
          <div
            ref={barRef}
            className="h-full origin-left bg-gold"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
