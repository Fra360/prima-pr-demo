# Game Design Document — *Lanterna* (titolo provvisorio)

> Versione 0.1 — bozza iniziale proposta dal team. Tutto è in discussione:
> questo documento vive e si aggiorna a ogni decisione.

## 1. Visione in una frase

Un piccolo gioco 3D **cozy di esplorazione e puzzle**: sei il nuovo guardiano
di un faro su un'isola abbandonata e devi riportarla in vita, un meccanismo
alla volta.

## 2. Perché questo gioco (e perché è perfetto per il portfolio)

- **Scope realistico**: un team di 1 persona + agenti può finirlo. Un gioco
  piccolo e *finito* vale più di dieci prototipi.
- **Vetrina 3D ideale**: pochi asset, ma tutti "hero asset" inquadrabili da
  vicino — faro, casa del guardiano, barca, molo, meccanismi in ottone,
  props d'epoca. Ogni asset che modelli è un pezzo da portfolio con un
  contesto reale attorno, non un modello isolato su sfondo grigio.
- **Niente animazioni di personaggi complesse**: il protagonista è in prima
  persona (o terza con capsula stilizzata), i nemici non esistono. Il 90%
  del lavoro artistico è environment e props: esattamente ciò che vuoi
  mostrare.

## 3. Dati chiave

| | |
|---|---|
| Genere | Esplorazione / puzzle, cozy, senza combattimento |
| Visuale | Prima persona (fallback: terza persona semplice) |
| Motore | Godot 4 (gratuito, leggero, export web per demo giocabile nel portfolio) |
| Durata target | 30–45 minuti |
| Piattaforma | PC + build web (itch.io) |
| Stile | Low-poly stilizzato, palette calda, luce di tramonto |
| Team | Game designer, programmatore, level designer, concept artist (agenti) + **3D artist (tu)** |

## 4. Core loop

1. **Esplora** un'area dell'isola.
2. **Trova** un meccanismo rotto o un oggetto mancante.
3. **Risolvi** il puzzle (combinare oggetti, allineare, alimentare).
4. **L'isola risponde**: una luce si accende, un ponte si abbassa, una nuova
   area si apre.
5. Ripeti, fino ad accendere la lanterna del faro nel finale.

Ogni puzzle risolto cambia visibilmente il mondo: è il feedback principale
e mette in mostra gli asset (le luci che si accendono illuminano i tuoi
modelli).

## 5. Meccaniche

| Meccanica | Descrizione | Note implementative |
|---|---|---|
| Movimento | Camminata, niente salto acrobatico, scale a pioli interagibili | CharacterBody3D standard |
| Interazione | Un solo tasto contestuale (E): raccogli, aziona, inserisci | Raycast dalla camera |
| Inventario | Max 3 oggetti, mostrati come icone | Niente crafting |
| Puzzle "energia" | Collegare/ruotare condotti per portare corrente ai meccanismi | Meccanica firma del gioco |
| Diario | Note trovate in giro raccontano la storia del vecchio guardiano | Narrativa ambientale, zero cutscene |

## 6. Struttura del gioco (3 aree + finale)

| Area | Contenuto | Meccanica introdotta |
|---|---|---|
| 1. Il Molo | Tutorial: arrivo in barca, prima interazione, prime note | Movimento + interazione |
| 2. La Casa del Guardiano | Puzzle domestici: generatore, chiavi, ascensore del carbone | Inventario + energia |
| 3. Il Giardino / le Scogliere | Puzzle d'acqua e vento, area più aperta | Combinazione di meccaniche |
| Finale. Il Faro | Salita del faro, grande puzzle della lanterna, accensione | Tutte insieme |

## 7. Lista asset 3D preliminare (il tuo portfolio)

Priorità P1 = indispensabile per il prototipo, P2 = produzione, P3 = polish.

| Asset | Priorità | Note per il portfolio |
|---|---|---|
| Faro (esterno + interno lanterna) | P1 | Hero asset principale, visibile ovunque |
| Casa del guardiano | P1 | Interno esplorabile: hero environment |
| Molo + barca a remi | P1 | Prima cosa che il giocatore vede |
| Generatore / meccanismi in ottone | P1 | Props hero, primi piani garantiti |
| Set props domestici (~15 pezzi: lampade, libri, stoviglie, mobili) | P2 | Ottimo per una prop-sheet da portfolio |
| Condotti/valvole del puzzle energia | P2 | Modulari, riusati ovunque |
| Vegetazione stilizzata (3–4 piante, erba, albero) | P2 | Kit ambientale |
| Rocce modulari scogliera | P2 | Kit ambientale |
| Skybox/acqua stilizzata | P3 | Shader, col programmatore |
| Dettagli finali (gabbiani statici, reti, casse) | P3 | Set dressing |

## 8. Cosa NON c'è (scope cutting esplicito)

Niente combattimento, niente NPC animati, niente ciclo giorno/notte dinamico,
niente doppiaggio, niente open world. Se a metà produzione siamo in ritardo,
si taglia l'Area 3, non la qualità delle prime due.

## 9. Punti aperti

- [ ] Prima o terza persona? (decidere col prototipo, settimana 3)
- [ ] Titolo definitivo
- [ ] Palette definitiva → scheda del concept artist in `docs/arte/`
