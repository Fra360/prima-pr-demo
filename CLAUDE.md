# Lanterna — progetto videogioco

Piccolo gioco 3D cozy di esplorazione/puzzle sviluppato da un team misto:
agenti Claude Code (`.claude/agents/`) + Francesco come 3D artist umano.
Motore: **Unity 6** (C#, URP, export WebGL), progetto in `game/` quando verrà creato.

## Documenti chiave
- `docs/GDD.md` — game design document (fonte di verità del design)
- `docs/PIANO-DI-PRODUZIONE.md` — Gantt a 12 settimane, milestone, workflow
- `docs/GUIDA-RETE-AGENTI.md` — setup Obsidian, ponte Telegram, memoria

## Memoria condivisa (vault Obsidian)
La cartella `vault/` è il vault Obsidian del progetto e la memoria a lungo
termine del team. Regole valide per Claude e per tutti gli agenti:

1. **Consulta la memoria prima di decidere**: `vault/Memoria/Decisioni.md`
   contiene le scelte già fatte (non ridiscuterle senza motivo),
   `Glossario.md` i termini del progetto.
2. **A fine sessione di lavoro** aggiorna: la sezione `## Stato attuale`
   della nota del ruolo coinvolto in `vault/Agenti/`, il diario in
   `vault/Diario/AAAA-MM-GG.md`, e registra nuove decisioni/lezioni in
   `vault/Memoria/`.
3. **Usa i wikilink** `[[...]]` tra note, documenti e task: alimentano il
   grafo di Obsidian che rende visibile il lavoro.
4. Le note di stato devono essere brevi (2–4 righe: fatto, in corso,
   prossimo passo, blocchi): vengono lette anche dal ponte Telegram
   (`scripts/telegram_bridge.py`).
5. Quando Francesco scrive "chiudi la sessione": esegui il punto 2 per tutti
   i ruoli toccati, aggiorna `vault/Bacheca Kanban.md` e committa.
