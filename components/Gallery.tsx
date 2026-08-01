"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Placeholder from "./Placeholder";
import Reveal from "./Reveal";
import { useCoverflow } from "./useCoverflow";

/**
 * Sezione scura: nessuno sfondo proprio, si vede il blu profondo del body
 * con l'aurora che filtra dietro le foto.
 *
 * Galleria a scorrimento orizzontale, su telefono come su desktop. In
 * verticale le sette foto formavano un nastro lunghissimo da scorrere; in
 * orizzontale la sezione occupa un'altezza sola e le foto si sfogliano.
 *
 * Le foto non vanno dietro il vetro (le sfocherebbe): prendono solo il
 * raggio e un bordo sottile.
 *
 * Niente Reveal sulle singole card: il suo IntersectionObserver terrebbe
 * invisibili quelle fuori schermo a destra. Compare l'intero carosello.
 */

const photos = [
  { variant: "sea", label: "Terrazza vista mare" },
  { variant: "interior", label: "Camera matrimoniale" },
  { variant: "stone", label: "Bagno principale" },
  { variant: "sunset", label: "Tramonto dal balcone" },
  { variant: "interior", label: "Cucina attrezzata" },
  { variant: "garden", label: "Esterni" },
  { variant: "night", label: "Sperlonga di sera" },
] as const;

export default function Gallery() {
  const scroller = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Le frecce si spengono agli estremi invece di sparire: niente salti nel
  // layout e resta chiaro dove ci si trova nella sequenza.
  const aggiornaEstremi = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    aggiornaEstremi();
    el.addEventListener("scroll", aggiornaEstremi, { passive: true });
    window.addEventListener("resize", aggiornaEstremi);
    return () => {
      el.removeEventListener("scroll", aggiornaEstremi);
      window.removeEventListener("resize", aggiornaEstremi);
    };
  }, [aggiornaEstremi]);

  // Profondita legata allo scroll: la card al centro davanti, le altre
  // arretrate. Scrive solo custom property, il resto lo fa il CSS.
  useCoverflow(scroller);

  const scorri = (verso: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    // Un "passo" e la larghezza di una card piu il divario
    const card = el.querySelector("li");
    const passo = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: passo * verso, behavior: "smooth" });
  };

  // Frecce da tastiera: il contenitore e focusabile, ma le frecce native
  // scorrerebbero di pochi pixel invece che di una card.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scorri(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scorri(-1);
    }
  };

  return (
    <section id="galleria" className="tone-dark py-24 md:py-32">
      {/* Frecce nell'intestazione, non sopra il nastro: in un carosello a
          bordo pieno l'ultima foto arriva al margine dello schermo e una
          freccia sovrapposta le finirebbe addosso. Solo dove c'e un
          puntatore preciso: su touch si trascina. */}
      <div className="relative mx-auto mb-14 max-w-6xl px-6">
        <Reveal stagger className="text-center">
          <p className="eyebrow text-light-sky">Galleria</p>
          <h2 className="headline mt-5 text-foam">
            Uno sguardo <em className="not-italic text-light-sky">dentro</em>
          </h2>
        </Reveal>

        <div className="absolute bottom-0 right-6 hidden gap-3 pointer-fine:flex">
          <button
            type="button"
            onClick={() => scorri(-1)}
            disabled={atStart}
            aria-label="Foto precedenti"
            className="glass glass--dark grid size-12 place-items-center rounded-full text-foam transition-opacity disabled:opacity-30"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scorri(1)}
            disabled={atEnd}
            aria-label="Foto successive"
            className="glass glass--dark grid size-12 place-items-center rounded-full text-foam transition-opacity disabled:opacity-30"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <Reveal>
        {/* Il nastro esce dal contenitore centrato e arriva ai bordi dello
            schermo: le card ai lati restano intraviste, cosi si capisce che
            c'e altro da scorrere. Il padding allinea la prima al testo. */}
        <ul
          ref={scroller}
          tabIndex={0}
          role="region"
          aria-label="Foto di Casa Omero: scorri in orizzontale, o usa le frecce sinistra e destra"
          onKeyDown={onKeyDown}
          className="coverflow no-scrollbar flex snap-x snap-mandatory items-center gap-4 overflow-x-auto scroll-smooth px-6 pb-2 [scroll-padding-left:1.5rem] md:px-[max(1.5rem,calc((100vw-72rem)/2))] md:[scroll-padding-left:max(1.5rem,calc((100vw-72rem)/2))]"
        >
          {photos.map((p) => (
            <li
              key={p.label}
              className="group relative aspect-[4/5] w-[78vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-lg border border-light-sky/15 sm:w-[320px] sm:max-w-none lg:w-[360px]"
            >
              <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
                <Placeholder variant={p.variant} label={p.label} />
              </div>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="mx-auto mt-10 max-w-6xl px-6">
        <Reveal className="text-center">
          <p className="text-sm font-light italic text-light-sky/70">
            Trascina per sfogliare — le foto professionali della casa
            arriveranno presto, questi sono segnaposto.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
