"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { projects, categories } from "@/lib/site";
import Placeholder from "./Placeholder";
import Reveal from "./Reveal";

export default function Work() {
  const [active, setActive] = useState<(typeof categories)[number]>("Tutti");

  const shown =
    active === "Tutti"
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <section id="lavori" className="relative bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-accent" />
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-accent">
              Selezione
            </p>
          </div>
          <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-fg md:text-5xl">
            Lavori & progetti
          </h2>
          <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-muted">
            Una selezione di render. Passa il mouse su una card per i dettagli —
            presto qui ci saranno i tuoi lavori reali.
          </p>
        </Reveal>

        {/* Filtro categorie */}
        <Reveal delay={0.05}>
          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
                  active === c
                    ? "bg-accent text-bg"
                    : "border border-line text-fg-dim hover:border-accent/50 hover:text-fg"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Griglia */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <motion.article
              key={p.title}
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.06 }}
              className={`group relative overflow-hidden border border-line bg-surface ${
                p.wide ? "sm:col-span-2" : ""
              }`}
            >
              <div
                className={`relative w-full ${p.wide ? "aspect-[16/9]" : "aspect-[4/3]"}`}
              >
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                    <Placeholder tone={p.tone} label={p.title} />
                  </div>
                )}

                {/* Overlay info */}
                <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-bg via-bg/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="w-full p-5">
                    <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-accent">
                      {p.category}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-medium text-fg">
                      {p.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Barra sempre visibile con titolo (mobile-friendly) */}
              <div className="flex items-center justify-between border-t border-line px-5 py-3.5">
                <span className="font-display text-sm font-medium text-fg">
                  {p.title}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
                  {p.category}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
