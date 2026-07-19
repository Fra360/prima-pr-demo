# Portfolio · 3D Generalist

Sito-portfolio personale per un **3D generalist artist**, costruito con
**Next.js 15 + React 19 + Tailwind CSS 4 + Framer Motion**.
Estetica *dark cinematic*, hero guidato dallo scroll e showcase 3D interattivo.

## Caratteristiche

- 🎬 **Hero scroll-driven**: lo scroll comanda un **wireframe 3D** (un toro
  color rame) che ruota e zooma, mentre tre fasi di testo si alternano. Se
  metti uno showreel in `public/videos/reel.mp4`, l'hero lo "scrubberà" con lo
  scroll al posto del wireframe.
- 🗂️ **Griglia lavori** con filtro per categoria e segnaposto eleganti in stile
  viewport 3D — pronti da sostituire con i tuoi render.
- 🧊 **Showcase 3D navigabile** (GLB) con pulsante **AR** per guardarlo dal
  telefono.
- 👤 Sezione **Chi sono** con bio e lista dei software.
- ✉️ Sezione **Contatti** con email e link ad ArtStation/social.
- ✨ Animazioni di reveal allo scroll, design responsive e supporto
  `prefers-reduced-motion`.

## Avvio in locale

```bash
npm install
npm run dev
```

Poi apri [http://localhost:3000](http://localhost:3000).

## Personalizzazione — quasi tutto è in `lib/site.ts`

Apri **`lib/site.ts`**: da questo unico file cambi nome, ruolo, bio, email,
link, software e i progetti. Il resto del sito si aggiorna di conseguenza.

### Nome, ruolo e logo

- `name`, `role`, `tagline`, `bio` → testi principali.
- Il **logo** (`components/Logo.tsx`) è un monogramma vettoriale (cubo
  isometrico + iniziali). Le iniziali vengono calcolate dal nome; puoi
  forzarle con il campo `initials` in `lib/site.ts`.

### I tuoi lavori (render)

Nell'array `projects` di `lib/site.ts`, per ogni progetto:

1. metti l'immagine in `public/work/` (es. `public/work/progetto-01.jpg`);
2. imposta `image: "/work/progetto-01.jpg"` sul progetto.

La card mostrerà la foto al posto del segnaposto. Cambia anche `title`,
`category` (deve essere una di quelle in `categories`) e `tone`. Metti
`wide: true` per far occupare due colonne ai lavori migliori.

### Showreel dell'hero (opzionale)

Metti un video in **`public/videos/reel.mp4`**: l'hero lo rileva e lo scrubba
con lo scroll. Per uno scrubbing fluido codificalo con keyframe frequenti:

```bash
ffmpeg -i input.mp4 -g 1 -an -movflags +faststart -pix_fmt yuv420p public/videos/reel.mp4
```

### Modello 3D + AR

Sostituisci `public/models/casa.glb` (modello demo) con un tuo export **GLB**
— da Blender: `File → Export → glTF 2.0`, formato *glTF Binary*, con i
materiali (texture incluse). Poi aggiorna `model.src` in `lib/site.ts`.

- L'AR funziona dal telefono sul sito pubblicato (serve HTTPS: su Vercel è
  automatico). Android usa Scene Viewer, iPhone Quick Look.
- Per l'AR su **iPhone** serve anche un export **`.usdz`**: mettilo in
  `public/models/` e imposta `model.iosSrc` in `lib/site.ts`.

## Deploy su Vercel

1. Vai su [vercel.com](https://vercel.com) e importa questo repository.
2. Vercel riconosce Next.js automaticamente — nessuna configurazione.
3. Collega il tuo dominio da **Settings → Domains**.
