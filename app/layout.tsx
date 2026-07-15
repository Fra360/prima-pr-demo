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
  themeColor: "#101c26",
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
    <html lang="it" className={`${cormorant.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}
