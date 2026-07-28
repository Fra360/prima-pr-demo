"use client";

import { useEffect, useState } from "react";

/**
 * Cinque voci, non sei: "Servizi" era la meno cercata e la sezione resta
 * comunque raggiungibile scorrendo. Meno opzioni, decisione piu rapida
 * (legge di Hick). La CTA "Prenota" e fuori dalla lista perche non e una
 * voce di navigazione ma l'azione principale del sito.
 */
const links = [
  { href: "#casa", label: "La Casa" },
  { href: "#galleria", label: "Galleria" },
  { href: "#esperienza3d", label: "3D & Tour" },
  { href: "#sperlonga", label: "Sperlonga" },
  { href: "#recensioni", label: "Recensioni" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stato attivo della navigazione: riconoscere invece di ricordare, l'utente
  // vede sempre dove si trova senza doverselo tenere a mente.
  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav
          className="glass glass--nav flex items-center justify-between gap-4 rounded-xl px-4 py-2.5 transition-all duration-500 sm:px-6"
          aria-label="Navigazione principale"
        >
          <a
            href="#top"
            className="flex min-h-[44px] items-center gap-2 whitespace-nowrap"
          >
            <span className="font-display text-2xl tracking-wide text-foam">
              Casa Omero
            </span>
            <span className="eyebrow hidden text-[0.55rem] text-lagoon sm:inline">
              Sperlonga
            </span>
          </a>

          <ul className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={active === l.href ? "true" : undefined}
                  className={`eyebrow text-[0.6rem] transition-colors ${
                    active === l.href
                      ? "text-seafoam"
                      : "text-light-sky/75 hover:text-seafoam"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Unica CTA primaria, visibile a ogni dimensione: e l'azione che
              vale il sito, non deve mai stare nascosta dietro un menu.
              Area cliccabile >= 44px (legge di Fitts). */}
          <a
            href="#prenota"
            className="btn btn--accent ml-auto min-h-[44px] px-5 text-[0.6rem] sm:px-6 lg:ml-0"
          >
            Prenota
          </a>

          <button
            className="-m-2 flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Chiudi il menu" : "Apri il menu"}
            aria-expanded={open}
          >
            <span
              className={`h-px w-6 bg-foam transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-6 bg-foam transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </button>
        </nav>

        {open && (
          <ul className="glass glass--nav mt-2 flex flex-col gap-1 p-3 lg:hidden">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="eyebrow flex min-h-[48px] items-center px-3 text-[0.65rem] text-light-sky"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
