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

Metti il tuo video AI in **`public/videos/hero.mp4`**: il componente `Hero` lo rileva da solo e lo scrubberà con lo scroll al posto dell'animazione canvas.

> ⚠️ Per uno scrubbing fluido il video va codificato con keyframe frequenti, altrimenti i salti di `currentTime` scattano:
> ```bash
> ffmpeg -i input.mp4 -g 1 -an -movflags +faststart -pix_fmt yuv420p public/videos/hero.mp4
> ```
> (`-g 1` = ogni frame è un keyframe; `-an` rimuove l'audio, inutile per lo scrub. Tieni il video sotto ~10-15 MB: durata 5-10 s a 1080p va benissimo.)

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
