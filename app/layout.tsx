import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#12284b",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Casa Omero · Sperlonga — Luxury Holiday Home",
  description:
    "Casa Omero, elegante casa vacanze nel cuore di Sperlonga. Terrazza vista mare, a pochi passi dalla spiaggia e dal borgo antico. Valutazione 9.7 su Booking.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: lo script qui sotto aggiunge la classe `js`
    // a <html> prima dell'idratazione, quindi server e client differiscono
    // di proposito su questo attributo.
    <html
      lang="it"
      suppressHydrationWarning
      className={`${cormorant.variable} ${jost.variable}`}
    >
      <head>
        {/* Marca il documento come "JS attivo" prima del primo paint.
            Il CSS nasconde i blocchi da animare solo sotto .js: senza
            JavaScript il contenuto resta visibile e leggibile, e con il
            JavaScript non c'e nessun lampo di testo gia visibile. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js")`,
          }}
        />
      </head>
      {/* `motion-enabled` accende micro-interazioni e carosello in profondita.
          Tutte le regole nuove stanno sotto questa classe: togliendola il sito
          torna esattamente all'aspetto precedente, senza rimuovere codice.
          Utile per confrontare prima/dopo — da console:
          document.body.classList.toggle("motion-enabled") */}
      <body className="motion-enabled">{children}</body>
    </html>
  );
}
