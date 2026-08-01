"use client";

import { useEffect, type RefObject } from "react";

/**
 * Profondita legata allo scroll per un nastro orizzontale (effetto coverflow).
 *
 * Per ogni card misura quanto dista dal centro del contenitore, in "unita di
 * card", e ne ricava scala, opacita, sfocatura e z-index. I valori finiscono
 * in custom property CSS: il foglio di stile decide come usarli, questo file
 * decide solo quanto. Nessuno stile viene scritto riga per riga.
 *
 * Perche agganciarsi allo scroll nativo invece di gestire il drag a mano:
 * trascinamento col mouse, swipe, inerzia, frecce da tastiera e aggancio
 * arrivano gratis dal browser e sono gia accessibili. Qui resta solo la
 * mappatura visiva, che e la parte che vogliamo davvero controllare.
 */

/** Valori scelti (motivazione nel commento di ciascuno) */
const SCALA_LATERALE = 0.86; // sotto 0.82 le didascalie diventano illeggibili
const OPACITA_LATERALE = 0.6; // sotto 0.5 la card sembra disattivata, non dietro
const BLUR_DESKTOP = 3; // 3px leggono come "fuori fuoco" senza spalmare i bordi
const BLUR_MOBILE = 1.5; // il blur e costoso su GPU mobile: meta
const PASSO_BLUR = 0.5; // sfocatura a gradini: meno ridisegni, differenza invisibile
const RIPOSO_MS = 160; // quando lo scroll tace, si toglie will-change

const lerp = (da: number, a: number, t: number) => da + (a - da) * t;

export function useCoverflow(
  scroller: RefObject<HTMLElement | null>,
  attivo = true
) {
  useEffect(() => {
    const el = scroller.current;
    if (!el || !attivo) return;

    // Con la riduzione del movimento attiva si aggiorna solo quando lo scroll
    // si ferma: la gerarchia resta, il movimento continuo no.
    const ridotto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blurMax = window.matchMedia("(max-width: 768px)").matches
      ? BLUR_MOBILE
      : BLUR_DESKTOP;

    const cards = () => Array.from(el.children) as HTMLElement[];

    const applica = () => {
      const box = el.getBoundingClientRect();
      const centro = box.left + box.width / 2;
      const lista = cards();
      if (lista.length === 0) return;

      // Un "passo" e la distanza fra i centri di due card vicine: normalizza
      // la misura, cosi l'effetto e identico a ogni dimensione di schermo.
      const primo = lista[0].getBoundingClientRect();
      const passo =
        lista.length > 1
          ? Math.abs(
              lista[1].getBoundingClientRect().left - primo.left
            ) || primo.width
          : primo.width;

      for (const card of lista) {
        const r = card.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - centro) / passo;
        // Oltre una card di distanza l'effetto e gia al massimo: continuare a
        // rimpicciolire farebbe sparire le card lontane senza aggiungere nulla
        const t = Math.min(dist, 1);

        const blur = ridotto
          ? 0
          : Math.round((t * blurMax) / PASSO_BLUR) * PASSO_BLUR;

        card.style.setProperty("--cf-scale", lerp(1, SCALA_LATERALE, t).toFixed(4));
        card.style.setProperty("--cf-opacity", lerp(1, OPACITA_LATERALE, t).toFixed(3));
        card.style.setProperty("--cf-blur", `${blur}px`);
        // La card davanti copre le vicine, mai il contrario
        card.style.setProperty("--cf-z", String(Math.round(100 - t * 10)));
      }
    };

    let raf = 0;
    let timerRiposo = 0;
    let inMovimento = false;

    const fineMovimento = () => {
      inMovimento = false;
      // will-change tolto appena il nastro si ferma: tenerlo sempre acceso
      // costringe il browser a mantenere un livello per ogni card
      for (const card of cards()) card.style.willChange = "";
    };

    const onScroll = () => {
      if (!inMovimento) {
        inMovimento = true;
        if (!ridotto) {
          for (const card of cards())
            card.style.willChange = "transform, opacity, filter";
        }
      }
      window.clearTimeout(timerRiposo);
      timerRiposo = window.setTimeout(() => {
        fineMovimento();
        applica(); // valore definitivo dopo l'aggancio
      }, RIPOSO_MS);

      if (ridotto) return; // niente aggiornamento continuo
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        applica();
      });
    };

    applica();
    el.addEventListener("scroll", onScroll, { passive: true });

    // Il passo dipende dalla larghezza: va ricalcolato quando cambia
    const ro = new ResizeObserver(() => applica());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.clearTimeout(timerRiposo);
      if (raf) cancelAnimationFrame(raf);
      for (const card of cards()) {
        card.style.willChange = "";
        card.style.removeProperty("--cf-scale");
        card.style.removeProperty("--cf-opacity");
        card.style.removeProperty("--cf-blur");
        card.style.removeProperty("--cf-z");
      }
    };
  }, [scroller, attivo]);
}
