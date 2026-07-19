"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

const links = [
  { href: "#lavori", label: "Lavori" },
  { href: "#showcase", label: "3D" },
  { href: "#about", label: "Chi sono" },
  { href: "#contatti", label: "Contatti" },
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
          ? "border-b border-line bg-bg/80 py-3 backdrop-blur-md"
          : "border-b border-transparent bg-transparent py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#top" aria-label="Torna su">
          <Logo />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-xs font-medium uppercase tracking-[0.2em] text-fg-dim transition-colors hover:text-accent"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contatti"
              className="border border-accent/50 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-accent transition-all hover:bg-accent hover:text-bg"
            >
              Lavoriamo insieme
            </a>
          </li>
        </ul>

        {/* Toggle mobile */}
        <button
          className="-m-3 flex flex-col gap-1.5 p-3 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <span
            className={`h-px w-7 bg-fg transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-7 bg-fg transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-4 border-t border-line bg-bg/95 px-6 py-6 backdrop-blur-md md:hidden">
          {[...links, { href: "#contatti", label: "Lavoriamo insieme" }].map(
            (l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium uppercase tracking-[0.2em] text-fg-dim"
                >
                  {l.label}
                </a>
              </li>
            )
          )}
        </ul>
      )}
    </header>
  );
}
