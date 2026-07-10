# Casa Omero · Sperlonga

Sito vetrina di lusso per la casa vacanze **Casa Omero** a Sperlonga, costruito con **Next.js 15 + React 19 + Tailwind CSS 4 + Framer Motion**.

## Caratteristiche

- 🌊 **Hero a schermo intero** con effetto parallax allo scroll (l'immagine si ingrandisce e scurisce, il testo fluttua verso l'alto)
- ✨ Animazioni di reveal allo scroll su ogni sezione
- 🖼️ **Galleria** con segnaposto eleganti — pronti da sostituire con le foto reali
- 🛎️ Sezioni: La Casa, Galleria, Servizi, Sperlonga, Recensioni, Prenota
- 📱 Design responsive con menu mobile
- 🔗 CTA di prenotazione che punta alla pagina Booking.com della proprietà

## Avvio in locale

```bash
npm install
npm run dev
```

Poi apri [http://localhost:3000](http://localhost:3000).

## Deploy su Vercel

1. Vai su [vercel.com](https://vercel.com) e importa questo repository
2. Vercel riconosce Next.js automaticamente — nessuna configurazione necessaria
3. Collega il tuo dominio personalizzato da **Settings → Domains**

## Sostituire le foto segnaposto

I segnaposto sono generati dal componente `components/Placeholder.tsx`. Quando avrai le foto reali:

1. Mettile in `public/photos/`
2. Sostituisci i `<Placeholder />` con `<Image />` di `next/image` nei componenti (`Hero`, `About`, `Gallery`, `Location`)

---

*(Questo repository era nato come demo per le Pull Request — lo script `saluto.py` è ancora qui come ricordo.)*
