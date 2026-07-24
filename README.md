# Casa Omero · Sperlonga

Sito vetrina di lusso per la casa vacanze **Casa Omero** a Sperlonga, costruito con **Next.js 15 + React 19 + Tailwind CSS 4 + Framer Motion**.

## Caratteristiche

- 🎬 **Hero scroll-video**: lo scroll controlla l'avanzamento del video (scrubbing) con tre fasi di testo che si alternano; finché il video non c'è, un'animazione canvas procedurale risponde allo scroll allo stesso modo
- 🏠 **Modello 3D navigabile** (GLB) con pulsante **AR** per guardarlo in realtà aumentata dal telefono
- 🗺️ Tab **Planimetria** e **Virtual Tour** (build Unity WebGL caricata al click)
- ✨ Animazioni di reveal allo scroll su ogni sezione
- 🖼️ **Galleria** con segnaposto eleganti — pronti da sostituire con le foto reali
- 🛎️ Sezioni: La Casa, Galleria, 3D & Tour, Servizi, Sperlonga, Recensioni, Prenota
- 📱 Design responsive con menu mobile e supporto `prefers-reduced-motion`
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

## Sostituire i contenuti segnaposto

### Video hero (scroll-scrubbing)

Il componente `Hero` usa **due file** e sceglie da solo quale scaricare in base al viewport (`max-width: 768px`), così il telefono non si scarica il 1080p:

| File | Risoluzione | Peso indicativo |
| --- | --- | --- |
| `public/videos/hero.mp4` | 1920×1080 | ~6,5 MB |
| `public/videos/hero-mobile.mp4` | 1280×720 | ~3,5 MB |

> ⚠️ **Il video va sempre ricodificato**, non basta esportarlo dall'editor:
> - **H.264 obbligatorio** — un MP4 in H.265/HEVC non viene riprodotto da Chrome su desktop e Android;
> - **keyframe fitti** (`-g 4`), altrimenti ogni salto di `currentTime` deve decodificare decine di frame e lo scrub scatta;
> - **niente B-frame** (`-bf 0`): il riordino dei frame rende il seeking meno reattivo;
> - **`+faststart`**, altrimenti il browser non mostra nulla finché non ha scaricato quasi tutto il file;
> - **`-an`** per togliere l'audio, inutile per lo scrub e peso sprecato.
>
> ```bash
> # desktop
> ffmpeg -i input.mp4 -an -sn -c:v libx264 -profile:v high -pix_fmt yuv420p \
>   -g 4 -keyint_min 1 -sc_threshold 0 -bf 0 -crf 26 -preset slow \
>   -movflags +faststart public/videos/hero.mp4
>
> # mobile
> ffmpeg -i input.mp4 -an -sn -c:v libx264 -profile:v high -pix_fmt yuv420p \
>   -vf scale=1280:720:flags=lanczos \
>   -g 4 -keyint_min 1 -sc_threshold 0 -bf 0 -crf 27 -preset slow \
>   -movflags +faststart public/videos/hero-mobile.mp4
> ```
>
> Durata consigliata 5-8 s. **L'animazione deve arrivare in fondo al file**: la pausa finale sulla scena completa la gestisce il codice (`VIDEO_END_AT` in `components/Hero.tsx`), non serve una coda di frame fermi.

### Modello 3D + AR

Il modello attuale (`public/models/casa.glb`) è la conversione di `public/models/Casa.obj`. L'OBJ non porta con sé materiali/texture (serve il file `.mtl` + le immagini), quindi il formato consigliato è il **GLB**: da Blender `File → Export → glTF 2.0`, formato `glTF Binary`, con i materiali — tutto finisce in un unico file, texture comprese. Sovrascrivi **`public/models/casa.glb`** e il sito lo mostra subito.

Per riconvertire un OBJ aggiornato:

```bash
npx obj2gltf -i public/models/Casa.obj -o public/models/casa.glb --binary
```

Se il GLB esportato è pesante, si può alleggerire senza perdita visiva (il sito lo supporta nativamente):

```bash
npx gltf-transform dedup casa.glb casa.glb && \
npx gltf-transform prune casa.glb casa.glb && \
npx gltf-transform weld casa.glb casa.glb && \
npx gltf-transform quantize casa.glb casa.glb
```

- L'AR funziona da telefono sul sito pubblicato (serve HTTPS, su Vercel è automatico): Android usa Scene Viewer, iPhone Quick Look.
- Per l'AR su **iPhone** serve anche un export **`.usdz`**: mettilo in `public/models/casa.usdz` e imposta `IOS_SRC` in `components/Explore3D.tsx`.

### Planimetria

Metti l'immagine in **`public/plans/planimetria.jpg`** — il tab la mostra automaticamente.

### Virtual tour Unity

1. In Unity: `File → Build Settings → WebGL`. In **Player Settings → Publishing Settings** imposta *Compression Format* su **Brotli** e attiva **Decompression Fallback** (così funziona su qualsiasi hosting senza configurare header).
2. Copia il contenuto della build (l'`index.html` con le cartelle `Build/` e `TemplateData/`) in **`public/tour/`**.
3. Il tab "Virtual Tour" carica la build al click su *Entra nel tour*.

### Foto

I segnaposto sono generati dal componente `components/Placeholder.tsx`. Quando avrai le foto reali:

1. Mettile in `public/photos/`
2. Sostituisci i `<Placeholder />` con `<Image />` di `next/image` nei componenti (`About`, `Gallery`, `Location`)

---

*(Questo repository era nato come demo per le Pull Request — lo script `saluto.py` è ancora qui come ricordo.)*
