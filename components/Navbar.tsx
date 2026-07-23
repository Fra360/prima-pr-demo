"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#casa", label: "La Casa" },
  { href: "#galleria", label: "Galleria" },
  { href: "#esperienza3d", label: "3D & Tour" },
  { href: "#servizi", label: "Servizi" },
  { href: "#sperlonga", label: "Sperlonga" },
  { href: "#recensioni", label: "Recensioni" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ink/90 py-3 shadow-lg shadow-black/10 backdrop-blur-md"
          : "bg-transparent py-6"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a
          href="#top"
          className="flex items-baseline gap-2 whitespace-nowrap text-white"
        >
          <span className="font-display text-2xl tracking-wide">
            Casa Omero
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.3em] text-gold-light sm:inline">
            Sperlonga
          </span>
        </a>

        <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-xs font-medium uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-gold-light"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#prenota"
              className="rounded-full border border-gold px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-gold-light transition-all hover:bg-gold hover:text-white"
            >
              Prenota
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="-m-3 flex flex-col gap-1.5 p-3 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span
            className={`h-px w-7 bg-white transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-7 bg-white transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-4 bg-ink/95 px-6 py-6 backdrop-blur-md lg:hidden">
          {[...links, { href: "#prenota", label: "Prenota" }].map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium uppercase tracking-[0.2em] text-white/85"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
