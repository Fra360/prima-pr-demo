"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax: the background scales & drifts, the text floats up and fades
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-120%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const veil = useTransform(scrollYProgress, [0, 1], [0.25, 0.65]);

  return (
    <section ref={ref} id="top" className="relative h-[115svh]">
      <div className="sticky top-0 h-svh min-h-[540px] overflow-hidden">
        {/* "Photo" backdrop — replace with your hero image */}
        <motion.div
          style={{
            scale: bgScale,
            y: bgY,
            background:
              "linear-gradient(180deg, #7fb0bf 0%, #4a8194 34%, #2e5d6b 62%, #16323c 100%)",
          }}
          className="absolute inset-0"
        >
          {/* sun flare */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 70% 22%, rgba(255,236,200,0.55) 0%, transparent 42%)",
            }}
          />
          {/* horizon shimmer */}
          <div
            className="absolute inset-x-0 top-[58%] h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
            }}
          />
        </motion.div>

        {/* darkening veil that deepens on scroll */}
        <motion.div
          className="absolute inset-0 bg-ink"
          style={{ opacity: veil }}
        />

        {/* Content */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-6 text-[11px] font-medium uppercase tracking-[0.45em] text-gold-light"
          >
            Sperlonga · Riviera di Ulisse
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="font-display text-6xl font-light leading-none tracking-wide sm:text-7xl md:text-8xl lg:text-9xl"
          >
            Casa Omero
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1 }}
            className="my-8 h-px w-24 bg-gold"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.1 }}
            className="max-w-xl font-display text-xl italic text-white/85 md:text-2xl"
          >
            Un rifugio elegante sul mare, a pochi passi dalla spiaggia
            e dal borgo antico di Sperlonga.
          </motion.p>

          <motion.a
            href="#prenota"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-12 border border-white/60 px-10 py-4 text-xs font-medium uppercase tracking-[0.3em] transition-all duration-300 hover:border-gold hover:bg-gold"
          >
            Verifica disponibilità
          </motion.a>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{ opacity: textOpacity }}
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
        </motion.div>
      </div>
    </section>
  );
}
