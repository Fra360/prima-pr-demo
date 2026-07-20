"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { site } from "@/lib/site";

/**
 * Hero cinematografico guidato dallo scroll (dark).
 *
 * Se esiste `public/videos/reel.mp4`, quello showreel viene "scrubbato":
 * lo scroll ne controlla il tempo di riproduzione. Finché non c'è, un
 * wireframe 3D (toro) ruota e zooma con lo scroll — un richiamo al lavoro
 * di un 3D artist — con un glow color rame sopra il nero.
 */

const VIDEO_SRC = "/videos/reel.mp4";

/* ── Geometria del toro (wireframe) ─────────────────────────── */
const MAJOR = 30; // segmenti attorno all'anello
const MINOR = 14; // segmenti attorno al tubo
const R = 1.15; // raggio maggiore
const r = 0.46; // raggio del tubo

type V3 = { x: number; y: number; z: number };

const torus: V3[][] = [];
for (let i = 0; i < MAJOR; i++) {
  const theta = (i / MAJOR) * Math.PI * 2;
  const ring: V3[] = [];
  for (let j = 0; j < MINOR; j++) {
    const phi = (j / MINOR) * Math.PI * 2;
    const cx = (R + r * Math.cos(phi)) * Math.cos(theta);
    const cy = (R + r * Math.cos(phi)) * Math.sin(theta);
    const cz = r * Math.sin(phi);
    ring.push({ x: cx, y: cy, z: cz });
  }
  torus.push(ring);
}

function rotate(p: V3, ax: number, ay: number): V3 {
  // rotazione attorno a X
  let y = p.y * Math.cos(ax) - p.z * Math.sin(ax);
  let z = p.y * Math.sin(ax) + p.z * Math.cos(ax);
  let x = p.x;
  // rotazione attorno a Y
  const x2 = x * Math.cos(ay) + z * Math.sin(ay);
  const z2 = -x * Math.sin(ay) + z * Math.cos(ay);
  x = x2;
  z = z2;
  return { x, y, z };
}

function drawWireframe(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: number,
  t: number
) {
  ctx.clearRect(0, 0, w, h);

  // sfondo: bagliore radiale caldo che si accende con lo scroll
  const glow = ctx.createRadialGradient(
    w * 0.5,
    h * 0.46,
    0,
    w * 0.5,
    h * 0.46,
    Math.max(w, h) * 0.6
  );
  const gA = 0.1 + 0.22 * p;
  glow.addColorStop(0, `rgba(224, 162, 100, ${gA})`);
  glow.addColorStop(0.4, `rgba(120, 80, 45, ${gA * 0.5})`);
  glow.addColorStop(1, "rgba(10, 10, 11, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.5;
  const cy = h * 0.46;
  const scale = Math.min(w, h) * (0.2 + 0.16 * p); // zoom in con lo scroll
  const ax = 1.05 + p * 1.7 + t * 0.06;
  const ay = t * 0.14 + p * 2.4;
  const fov = 4.2;

  const project = (v: V3) => {
    const rv = rotate(v, ax, ay);
    const persp = fov / (fov + rv.z);
    return {
      sx: cx + rv.x * scale * persp,
      sy: cy + rv.y * scale * persp,
      depth: rv.z,
    };
  };

  const drawEdge = (a: V3, b: V3) => {
    const pa = project(a);
    const pb = project(b);
    const d = (pa.depth + pb.depth) / 2;
    // profondità → opacità/spessore (davanti più luminoso)
    const near = (d + r + R) / (2 * (r + R));
    const alpha = 0.12 + 0.55 * near;
    ctx.strokeStyle = `rgba(224, 162, 100, ${alpha})`;
    ctx.lineWidth = 0.6 + near * 1.1;
    ctx.beginPath();
    ctx.moveTo(pa.sx, pa.sy);
    ctx.lineTo(pb.sx, pb.sy);
    ctx.stroke();
  };

  ctx.lineCap = "round";
  for (let i = 0; i < MAJOR; i++) {
    const ring = torus[i];
    const next = torus[(i + 1) % MAJOR];
    for (let j = 0; j < MINOR; j++) {
      drawEdge(ring[j], ring[(j + 1) % MINOR]); // lungo il tubo
      drawEdge(ring[j], next[j]); // lungo l'anello
    }
  }
}

/* ── Fasi di testo ───────────────────────────────────────────── */
const stages = [
  {
    eyebrow: site.role,
    title: site.name,
    sub: site.tagline,
    range: [0, 0.32] as const,
    isName: true,
  },
  {
    eyebrow: "La pipeline",
    title: "Model · Texture · Light",
    sub: "Ogni asset curato dalla prima silhouette al render finale.",
    range: [0.38, 0.64] as const,
  },
  {
    eyebrow: "Il portfolio",
    title: "Guarda i lavori",
    sub: "Scorri per esplorare i progetti — o vai dritto alla selezione.",
    range: [0.7, 0.96] as const,
  },
];

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
}: {
  stage: (typeof stages)[number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [a, b] = stage.range;
  const isName = "isName" in stage && stage.isName;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = (p: number) => {
      const opacity = isName
        ? interp(p, [a, b - 0.05, b], [1, 1, 0])
        : interp(p, [a, a + 0.05, b - 0.05, b], [0, 1, 1, 0]);
      const y = interp(p, [a, b], isName ? [0, -40] : [30, -30]);
      el.style.opacity = String(opacity);
      el.style.transform = `translateY(${y}px)`;
      el.style.visibility = opacity <= 0.001 ? "hidden" : "visible";
    };
    apply(progress.get());
    return progress.on("change", apply);
  }, [progress, a, b, isName]);

  const titleClass = `font-display font-semibold leading-[0.95] tracking-tight text-fg ${
    isName
      ? "text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
      : "text-4xl sm:text-5xl md:text-6xl"
  }`;

  return (
    <div
      ref={ref}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
    >
      {/* Scrim morbido: scurisce il centro così il testo resta leggibile
          sopra il wireframe, senza nasconderlo del tutto. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[130%] max-w-[52rem] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(10,10,11,0.72) 0%, rgba(10,10,11,0.42) 42%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />
      <p className="relative mb-6 text-[11px] font-medium uppercase tracking-[0.5em] text-accent">
        {stage.eyebrow}
      </p>
      {isName ? (
        <h1 className={`relative ${titleClass}`}>{stage.title}</h1>
      ) : (
        <p className={`relative ${titleClass}`} aria-hidden="true">
          {stage.title}
        </p>
      )}
      <div className="relative my-7 h-px w-16 bg-accent/70" />
      <p className="relative max-w-xl text-base font-light leading-relaxed text-fg-dim md:text-lg">
        {stage.sub}
      </p>
      {isName && (
        <a
          href="#lavori"
          className="relative mt-11 border border-fg/25 px-9 py-3.5 text-xs font-medium uppercase tracking-[0.3em] text-fg transition-all duration-300 hover:border-accent hover:bg-accent hover:text-bg"
        >
          Vedi i lavori
        </a>
      )}
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

  const cueRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (cueRef.current)
      cueRef.current.style.opacity = String(interp(p, [0, 0.12], [1, 0]));
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
  });

  // Scrub dello showreel con lo scroll (se presente)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => setHasVideo(true);
    const onError = () => setHasVideo(false);
    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("error", onError);

    let raf = 0;
    let current = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!video.duration || video.readyState < 2) return;
      const target = scrollYProgress.get() * (video.duration - 0.05);
      current += (target - current) * 0.12;
      if (Math.abs(video.currentTime - current) > 0.02)
        video.currentTime = current;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("error", onError);
    };
  }, [scrollYProgress]);

  // Wireframe 3D procedurale (fallback quando non c'è lo showreel)
  useEffect(() => {
    if (hasVideo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    if (reduced) {
      resize();
      drawWireframe(ctx, canvas.clientWidth, canvas.clientHeight, 0.15, 0);
      const onResize = () => {
        resize();
        drawWireframe(ctx, canvas.clientWidth, canvas.clientHeight, 0.15, 0);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const start = performance.now();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      resize();
      const t = (performance.now() - start) / 1000;
      drawWireframe(
        ctx,
        canvas.clientWidth,
        canvas.clientHeight,
        scrollYProgress.get(),
        t
      );
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [hasVideo, reduced, scrollYProgress]);

  return (
    <section ref={ref} id="top" className="relative h-[320svh]">
      <div className="sticky top-0 h-svh min-h-[560px] overflow-hidden bg-bg">
        {/* Livello media: showreel (se presente) o wireframe 3D */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 h-full w-full object-cover ${
            hasVideo ? "" : "hidden"
          }`}
        />
        {!hasVideo && (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          />
        )}

        {/* Vignettatura per far risaltare il testo */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, transparent 30%, rgba(10,10,11,0.55) 100%)",
          }}
        />

        {/* Fasi di testo */}
        <div className="relative h-full">
          {stages.map((s) => (
            <Stage key={s.title} stage={s} progress={scrollYProgress} />
          ))}
        </div>

        {/* Indicatore di scroll */}
        <div
          ref={cueRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-fg-dim"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-[10px] uppercase tracking-[0.35em]">
              Scorri
            </span>
            <span className="h-12 w-px bg-gradient-to-b from-fg-dim to-transparent" />
          </motion.div>
        </div>

        {/* Barra di avanzamento */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
          <div
            ref={barRef}
            className="h-full origin-left bg-accent"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
