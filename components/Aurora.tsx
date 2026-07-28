"use client";

import { useEffect } from "react";

/**
 * Le forme morbide dietro il vetro, piu il motore della parallasse.
 *
 * Il vetro sfoca cio che ha dietro: senza queste macchie di colore
 * l'effetto sarebbe un rettangolo grigio. Sono atmosfera, non contenuto:
 * blur pesante, opacita bassa, deriva lentissima (28-40s).
 *
 * La parallasse gira su un solo listener con rAF condiviso: ogni elemento
 * con `data-parallax="0.3"` riceve una `--parallax-y` proporzionale alla
 * sua distanza dal centro del viewport. Fattore < 1 = si muove piu piano
 * dello scroll, quindi sembra piu lontano.
 */
export default function Aurora() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Su telefono la parallasse peggiora quasi sempre la fluidita percepita
    const small = window.matchMedia("(max-width: 768px)");
    if (reduced.matches || small.matches) return;

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]")
    );
    if (nodes.length === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      for (const node of nodes) {
        const speed = Number(node.dataset.parallax);
        if (!speed) continue;
        const box = node.getBoundingClientRect();
        const fromCenter = box.top + box.height / 2 - viewport / 2;
        // spostamento = -distanza * (1 - velocita): a velocita 1 non si
        // muove nulla, a 0.3 resta indietro di sette decimi.
        const shift = -fromCenter * (1 - speed);
        node.style.setProperty("--parallax-y", `${shift.toFixed(1)}px`);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="aurora" aria-hidden="true">
      <div className="aurora__blob aurora__blob--teal" data-parallax="0.3" />
      <div className="aurora__blob aurora__blob--seafoam" data-parallax="0.4" />
      <div className="aurora__blob aurora__blob--lagoon" data-parallax="0.25" />
      <div className="aurora__ring" />
    </div>
  );
}
