#!/usr/bin/env python3
"""Ponte Telegram per il team di agenti di Lanterna.

Resta in ascolto nel gruppo Telegram e, SOLO quando chiedi un aggiornamento
(es. "aggiornamento stato progetto?" oppure /stato), risponde con un
messaggio per ogni membro del team, letto dalla sezione "## Stato attuale"
della sua nota in vault/Agenti/. Se in telegram_config.json è configurato un
bot dedicato per un agente, la sua risposta arriva da quel bot (effetto
"gruppo del team"); altrimenti risponde il bot principale con nome ed emoji
come prefisso.

Uso:
    cp scripts/telegram_config.example.json scripts/telegram_config.json
    # incolla i token nel file appena copiato
    python3 scripts/telegram_bridge.py

Nessuna dipendenza esterna: solo libreria standard.
"""

import json
import re
import subprocess
import time
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CONFIG_PATH = Path(__file__).resolve().parent / "telegram_config.json"

# (nome mostrato, nota di stato nel vault, chiave in agent_tokens)
TEAM = [
    ("🎲 Game Designer", "vault/Agenti/Game Designer.md", "game-designer"),
    ("💻 Programmatore", "vault/Agenti/Programmatore.md", "gameplay-programmer"),
    ("🗺️ Level Designer", "vault/Agenti/Level Designer.md", "level-designer"),
    ("🎨 Concept Artist", "vault/Agenti/Concept Artist.md", "concept-artist"),
    ("🧊 3D Artist (Francesco)", "vault/Agenti/3D Artist.md", "3d-artist"),
]

# Risponde solo a messaggi che contengono "aggiornamento" o ai comandi /stato /status
TRIGGER = re.compile(r"aggiornamento|^/stato|^/status", re.IGNORECASE)


def api(token, method, **params):
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = urllib.parse.urlencode(params).encode()
    with urllib.request.urlopen(url, data, timeout=90) as resp:
        return json.loads(resp.read())


def stato_da_nota(percorso):
    try:
        testo = (REPO / percorso).read_text(encoding="utf-8")
    except FileNotFoundError:
        return "(nota non trovata nel vault)"
    m = re.search(r"^## Stato attuale\s*\n(.*?)(?=^## |\Z)", testo, re.S | re.M)
    corpo = m.group(1).strip() if m else ""
    return corpo or "(nessun aggiornamento registrato)"


def riassunto_claude(cfg):
    """Riassunto extra generato da Claude Code in locale (se use_claude=true)."""
    if not cfg.get("use_claude"):
        return None
    prompt = (
        "Sei il project manager del videogioco Lanterna. Leggi docs/ e vault/ "
        "e scrivi in italiano un riassunto dello stato del progetto in massimo "
        "5 righe: avanzamento, rischi, prossimo passo."
    )
    try:
        out = subprocess.run(
            ["claude", "-p", prompt],
            cwd=REPO, capture_output=True, text=True, timeout=300,
        )
        return out.stdout.strip() or None
    except Exception as exc:  # CLI assente, timeout, ecc.
        return f"(riassunto Claude non disponibile: {exc})"


def main():
    cfg = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    main_token = cfg["main_token"]
    agent_tokens = cfg.get("agent_tokens", {})
    chat_atteso = cfg.get("chat_id")  # null = stampa gli id e risponde ovunque

    print("Ponte Telegram avviato. Trigger: 'aggiornamento…' oppure /stato")
    offset = 0
    while True:
        try:
            updates = api(main_token, "getUpdates", offset=offset, timeout=60)
        except Exception as exc:
            print("Errore di rete, riprovo tra 5 secondi:", exc)
            time.sleep(5)
            continue

        for up in updates.get("result", []):
            offset = up["update_id"] + 1
            msg = up.get("message") or {}
            testo = msg.get("text", "")
            chat_id = (msg.get("chat") or {}).get("id")
            if chat_id is None or not TRIGGER.search(testo):
                continue
            if chat_atteso is None:
                print(f"Messaggio da chat_id={chat_id} → mettilo in telegram_config.json")
            elif chat_id != chat_atteso:
                continue

            for nome, nota, chiave in TEAM:
                token = agent_tokens.get(chiave) or main_token
                prefisso = "" if agent_tokens.get(chiave) else f"{nome}\n"
                try:
                    api(token, "sendMessage", chat_id=chat_id,
                        text=f"{prefisso}{stato_da_nota(nota)}")
                except Exception as exc:
                    print(f"Invio fallito per {nome}:", exc)
                time.sleep(1)  # preserva l'ordine ed evita i rate limit

            extra = riassunto_claude(cfg)
            if extra:
                api(main_token, "sendMessage", chat_id=chat_id,
                    text=f"🤖 Riassunto del team\n{extra}")


if __name__ == "__main__":
    main()
