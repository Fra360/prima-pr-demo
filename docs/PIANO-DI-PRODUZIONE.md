# Piano di produzione — *Lanterna*

Piano su **12 settimane** (part-time, ritmo sostenibile). Le date partono da
lunedì 20 luglio 2026; sposta tutto liberamente, contano le durate e le
dipendenze.

Ruoli: **GD** = game designer · **PR** = programmatore · **LD** = level
designer · **CA** = concept artist · **3D** = 3D artist (**tu**).

## Gantt

```mermaid
gantt
    title Lanterna — 12 settimane di produzione
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m

    section Pre-produzione (sett. 1-2)
    GDD v1.0 completo (GD)                 :gd1, 2026-07-20, 10d
    Direzione artistica e palette (CA)     :ca1, 2026-07-20, 7d
    Setup progetto Unity 6 + repo (PR)     :pr1, 2026-07-20, 5d
    Pipeline asset 3D documentata (PR+3D)  :pr2, after pr1, 4d
    Studio stile e primi test modello (3D) :d31, after ca1, 5d

    section Prototipo (sett. 3-4)
    Controller + interazione (PR)          :pr3, after pr1, 7d
    Puzzle energia prototipo (PR)          :pr4, after pr3, 7d
    Blockout Area 1 Molo (LD)              :ld1, after gd1, 5d
    Scelta 1a/3a persona (GD+tutti)        :milestone, m1, 2026-08-14, 0d
    Schede concept asset P1 (CA)           :ca2, after ca1, 10d

    section Produzione asset 3D (sett. 4-9) — TU
    Faro esterno (3D)                      :d32, 2026-08-10, 10d
    Molo e barca (3D)                      :d33, after d32, 7d
    Casa del guardiano (3D)                :d34, after d33, 10d
    Meccanismi e generatore (3D)           :d35, after d34, 7d
    Props domestici P2 (3D)                :d36, after d35, 8d

    section Level design e integrazione (sett. 5-10)
    Blockout Aree 2-3 + Faro (LD)          :ld2, after ld1, 12d
    Inventario, UI, salvataggio (PR)       :pr5, after pr4, 10d
    Integrazione asset in Area 1 (PR+LD)   :int1, after d33, 5d
    Integrazione Aree 2-3 (PR+LD)          :int2, after d35, 8d
    Note del diario e narrativa (GD)       :gd2, after gd1, 10d

    section Polish e release (sett. 10-12)
    Vertical slice giocabile               :milestone, m2, 2026-09-28, 0d
    Lighting e set dressing (3D+CA)        :d37, after int2, 8d
    Audio e feedback (PR)                  :pr6, after pr5, 7d
    Playtest e bilanciamento (GD+LD)       :gd3, after int2, 7d
    Bugfix e ottimizzazione (PR)           :pr7, after pr6, 5d
    Build web + pagina itch.io             :rel1, 2026-10-05, 5d
    Render e materiale portfolio (3D)      :d38, after d37, 5d
    Release demo                           :milestone, m3, 2026-10-11, 0d
```

## Le tue task da 3D artist, in ordine

1. **Sett. 2**: leggi la direzione artistica del concept artist, fai 1–2
   modelli di prova per validare stile e pipeline di import in Unity.
2. **Sett. 4–5**: **Faro esterno** — l'hero asset. Prenditi il tempo che serve.
3. **Sett. 5–6**: molo e barca (prima inquadratura del gioco).
4. **Sett. 6–8**: casa del guardiano, esterno + interno.
5. **Sett. 8–9**: meccanismi, generatore, kit condotti del puzzle.
6. **Sett. 9–10**: prop set domestico (~15 pezzi piccoli).
7. **Sett. 10–11**: set dressing e lighting col concept artist.
8. **Sett. 11–12**: render belli, turntable e breakdown per il portfolio.

Ogni asset entra nel gioco appena pronto: il programmatore usa placeholder
fino a quel momento, quindi nessuno ti mette fretta.

## Milestone

| Data | Milestone | Criterio di successo |
|---|---|---|
| 14/08 | Fine prototipo | Si cammina, si interagisce, un puzzle energia funziona con i cubi grigi |
| 28/09 | Vertical slice | Area 1 completa con asset veri, giocabile da un estraneo senza aiuto |
| 11/10 | Release demo | Build web su itch.io + pagina portfolio con i tuoi asset |

## Come usare la rete di agenti (workflow)

Gli agenti sono definiti in `.claude/agents/` e si invocano da Claude Code
menzionandoli, ad esempio:

- *"Chiedi al **game-designer** di specificare il puzzle del generatore"*
- *"Fai fare al **level-designer** il blockout dell'Area 1 con la lista asset"*
- *"Il **concept-artist** prepari la scheda del faro"*
- *"Il **gameplay-programmer** implementi l'interazione con raycast"*

Flusso tipico di una feature:
**GD** scrive la specifica nel GDD → **LD** la piazza nel livello e aggiorna
la lista asset → **CA** produce la scheda concept → **tu** modelli → **PR**
integra. Tutto passa dai documenti in `docs/`, che sono la memoria condivisa
del team.
