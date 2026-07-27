"use client";

import { useEffect, useRef } from "react";

/**
 * Comparsa allo scroll: opacita 0->1 e translateY 40px->0.
 *
 * Niente framer-motion qui: `whileInView` scrive `opacity:0` gia nell'HTML
 * del server, quindi senza JavaScript la pagina resterebbe bianca. Lo stato
 * iniziale lo mette invece il CSS sotto la classe `.js` (aggiunta a <html>
 * prima del paint), e qui serve solo un IntersectionObserver.
 *
 * `stagger` fa entrare i figli diretti in sequenza (100ms l'uno dall'altro),
 * cosi l'occhio segue l'ordine eyebrow -> titolo -> testo -> CTA.
 */
export default function Reveal({
  children,
  delay = 0,
  stagger = false,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  /** Ritardo in secondi, per scaglionare blocchi affiancati */
  delay?: number;
  stagger?: boolean;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Se l'utente ha chiesto meno movimento, mostriamo e basta.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.classList.add("is-in");
          observer.disconnect(); // una volta sola: niente animazioni al ritorno
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // @ts-expect-error — il ref e generico su piu tag, tutti HTMLElement
      ref={ref}
      className={`reveal ${stagger ? "reveal--stagger" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
