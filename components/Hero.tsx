"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";

/**
 * Hero cinematografico guidato dallo scroll.
 *
 * Se esiste `public/videos/hero.mp4`, il video viene "scrubbato": lo scroll
 * ne controlla il tempo di riproduzione (come su sito-youstart.vercel.app).
 * Finché il video non c'è, un'animazione canvas procedurale (alba sul mare
 * di Sperlonga) risponde allo scroll esattamente allo stesso modo.
 *
 * Consiglio per l'export del video AI: codifica con keyframe frequenti
 * (es. ffmpeg -g 1) così lo scrubbing è fluido in ogni punto.
 */

const VIDEO_SRC = "/videos/hero.mp4";
const VIDEO_SRC_MOBILE = "/videos/hero-mobile.mp4";

/**
 * Punto dello scroll (0-1) in cui il video raggiunge l'ultimo frame.
 * Il tratto restante scorre tenendo la scena finale ferma: alzalo per
 * accorciare la pausa, abbassalo per allungarla.
 */
const VIDEO_END_AT = 0.8;

function drawSeascape(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: number
) {
  const lerp = (a: number, b: number) => a + (b - a) * p;

  // Cielo: da alba tenue a giorno pieno e poi crepuscolo dorato
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.62);
  sky.addColorStop(0, `rgb(${lerp(127, 46)}, ${lerp(176, 77)}, ${lerp(191, 96)})`);
  sky.addColorStop(1, `rgb(${lerp(74, 22)}, ${lerp(129, 61)}, ${lerp(148, 76)})`);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.62);

  // Sole: scende verso l'orizzonte con lo scroll
  const sunX = w * lerp(0.72, 0.5);
  const sunY = h * lerp(0.18, 0.55);
  const sunR = Math.max(w, h) * 0.35;
  const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR);
  sun.addColorStop(0, `rgba(255, ${lerp(240, 214)}, ${lerp(205, 160)}, ${lerp(0.75, 0.95)})`);
  sun.addColorStop(1, "rgba(255, 236, 200, 0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h * 0.62);

  // Mare
  const sea = ctx.createLinearGradient(0, h * 0.62, 0, h);
  sea.addColorStop(0, `rgb(${lerp(95, 40)}, ${lerp(147, 80)}, ${lerp(163, 95)})`);
  sea.addColorStop(1, `rgb(${lerp(22, 12)}, ${lerp(50, 26)}, ${lerp(60, 34)})`);
  ctx.fillStyle = sea;
  ctx.fillRect(0, h * 0.62, w, h * 0.38);

  // Scia del sole sul mare
  const glint = ctx.createLinearGradient(0, h * 0.62, 0, h * 0.95);
  glint.addColorStop(0, `rgba(255, 230, 180, ${lerp(0.25, 0.5)})`);
  glint.addColorStop(1, "rgba(255, 230, 180, 0)");
  ctx.fillStyle = glint;
  const beamW = w * lerp(0.1, 0.22);
  ctx.beginPath();
  ctx.moveTo(sunX - beamW * 0.3, h * 0.62);
  ctx.lineTo(sunX + beamW * 0.3, h * 0.62);
  ctx.lineTo(sunX + beamW, h);
  ctx.lineTo(sunX - beamW, h);
  ctx.closePath();
  ctx.fill();

  // Onde: linee sinusoidali che scorrono con lo scroll
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 7; i++) {
    const y = h * (0.66 + i * 0.045);
    const amp = 1.5 + i * 0.8;
    const phase = p * 26 + i * 1.7;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 8) {
      const yy = y + Math.sin(x / (60 + i * 18) + phase) * amp;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }

  // Linea dell'orizzonte
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(0, h * 0.62, w, 1);

  // Promontorio di Sperlonga (silhouette)
  ctx.fillStyle = `rgba(16, 28, 38, ${lerp(0.55, 0.85)})`;
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, h * 0.42);
  ctx.quadraticCurveTo(w * 0.08, h * 0.4, w * 0.13, h * 0.48);
  ctx.quadraticCurveTo(w * 0.2, h * 0.58, w * 0.26, h * 0.62);
  ctx.quadraticCurveTo(w * 0.3, h * 0.66, w * 0.3, h);
  ctx.closePath();
  ctx.fill();

  // Lucine del borgo sul promontorio (più visibili al "tramonto")
  const dots = 14;
  ctx.fillStyle = `rgba(255, 220, 160, ${lerp(0.0, 0.9)})`;
  for (let i = 0; i < dots; i++) {
    const t = i / dots;
    const x = w * (0.02 + t * 0.24);
    const y = h * (0.47 + Math.sin(i * 2.7) * 0.03 + t * 0.12);
    ctx.fillRect(x, y, 2, 2);
  }
}

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
      <div className="glass-halo" aria-hidden />
      <div className="hero-type relative flex flex-col items-center">
        <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.45em] text-gold-light">
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
        <p className="max-w-xl font-display text-xl italic text-white/85 md:text-2xl">
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);
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
    // Velatura generale piu leggera di prima: il contrasto sotto al testo lo
    // porta l'alone di vetro, cosi il video resta luminoso invece di ingrigirsi
    if (veilRef.current)
      veilRef.current.style.opacity = String(0.16 + 0.22 * p);
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

    const onLoaded = () => setHasVideo(true);
    const onError = () => setHasVideo(false);
    // Qualsiasi segnale di "video pronto" attiva la modalità video
    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("canplay", onLoaded);
    video.addEventListener("error", onError);
    // Se il video è già pronto quando l'effetto parte (race), attiva subito
    if (video.readyState >= 2 || video.videoWidth > 0) setHasVideo(true);

    let raf = 0;
    let current = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!video.duration || video.readyState < 2) return;
      // Appena il video è scrubbabile, assicura che sia visibile
      setHasVideo(true);
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

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("canplay", onLoaded);
      video.removeEventListener("error", onError);
    };
  }, [scrollYProgress]);

  // Fallback canvas: alba/tramonto procedurale guidato dallo scroll
  useEffect(() => {
    if (hasVideo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (p: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawSeascape(ctx, w, h, p);
    };

    draw(reduced ? 0 : scrollYProgress.get());
    if (reduced) return;

    const unsub = scrollYProgress.on("change", (p) => draw(p));
    const onResize = () => draw(scrollYProgress.get());
    window.addEventListener("resize", onResize);
    return () => {
      unsub();
      window.removeEventListener("resize", onResize);
    };
  }, [hasVideo, reduced, scrollYProgress]);

  return (
    <section ref={ref} id="top" className="relative h-[300svh]">
      <div className="sticky top-0 h-svh min-h-[540px] overflow-hidden">
        {/* Livello media: video AI (quando presente) o canvas procedurale */}
        {/* Il video resta sempre nel DOM (mai display:none): iOS non carica
            i video nascosti, quindi usiamo l'opacità per il fallback. */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            hasVideo ? "opacity-100" : "opacity-0"
          }`}
        />
        {!hasVideo && (
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        )}

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
