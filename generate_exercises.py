"""
Script per generare fino a 2950 esercizi aggiuntivi nel database.
Esegui con: python generate_exercises.py [quanti]
Default: 100 esercizi per esecuzione.
"""

import sqlite3
import random
import sys

DB_PATH = "exercises.db"

# ── Template di esercizi per categoria ──────────────────────────────────────

TEMPLATE_WEB_JS = [
    ("Closure con variabile privata",
     "Crea una closure che mantiene un saldo bancario privato con metodi deposita(importo) e preleva(importo). Gestisci il caso di saldo insufficiente.",
     """function creaConto(saldoIniziale = 0) {
  let saldo = saldoIniziale;
  return {
    deposita(importo)  { saldo += importo; return saldo; },
    preleva(importo) {
      if (importo > saldo) throw new Error('Saldo insufficiente');
      saldo -= importo; return saldo;
    },
    getSaldo() { return saldo; }
  };
}"""),
    ("Array flat e flatMap",
     "Dato un array annidato [[1,2],[3,[4,5]],6], appiattiscilo completamente con flat(). Poi usa flatMap per raddoppiare ogni numero in un array semplice.",
     """const annidato = [[1,2],[3,[4,5]],6];
const piatto = annidato.flat(Infinity); // [1,2,3,4,5,6]

const doppio = [1,2,3].flatMap(x => [x, x*2]);
// [1,2,2,4,3,6]"""),
]

TEMPLATE_WEB_CSS = [
    ("Variabili CSS (Custom Properties)",
     "Definisci 5 variabili CSS globali (colori e font) e usale in un bottone con hover.",
     """:root {
  --colore-primario: #1a3a52;
  --colore-testo: #ffffff;
  --bordo-radius: 8px;
  --padding: 12px 24px;
  --font-size: 1rem;
}
.btn {
  background: var(--colore-primario);
  color: var(--colore-testo);
  border-radius: var(--bordo-radius);
  padding: var(--padding);
  font-size: var(--font-size);
}
.btn:hover { filter: brightness(1.2); }"""),
]

TEMPLATE_SQL = [
    ("Window Function ROW_NUMBER",
     "Usa ROW_NUMBER() per assegnare un numero di riga a ogni vendita per cliente, ordinata per data decrescente.",
     """SELECT
    cliente_id,
    data,
    totale,
    ROW_NUMBER() OVER (
        PARTITION BY cliente_id
        ORDER BY data DESC
    ) AS riga
FROM vendite;"""),
    ("LEFT JOIN per trovare righe mancanti",
     "Trova tutti gli utenti che NON hanno mai effettuato un ordine usando LEFT JOIN.",
     """SELECT u.nome, u.email
FROM utenti u
LEFT JOIN ordini o ON u.id = o.utente_id
WHERE o.id IS NULL
ORDER BY u.nome;"""),
]

TEMPLATE_PYTHON = [
    ("Generatore (yield)",
     "Crea un generatore infinito che produce la sequenza di Collatz per un numero n.",
     """def collatz(n):
    yield n
    while n != 1:
        n = n // 2 if n % 2 == 0 else 3 * n + 1
        yield n

for x in collatz(6):
    print(x, end=' ')
# 6 3 10 5 16 8 4 2 1"""),
    ("Decoratore",
     "Scrivi un decoratore @misura_tempo che stampa il tempo di esecuzione di una funzione.",
     """import time
def misura_tempo(func):
    def wrapper(*args, **kwargs):
        inizio = time.perf_counter()
        risultato = func(*args, **kwargs)
        fine = time.perf_counter()
        print(f"{func.__name__} eseguita in {fine-inizio:.4f}s")
        return risultato
    return wrapper

@misura_tempo
def somma_lenta(n):
    return sum(range(n))

somma_lenta(1_000_000)"""),
]

TEMPLATE_LOGICA = [
    ("Conta le occorrenze",
     "Scrivi una funzione conta_parole(testo) che restituisce un dizionario con il numero di occorrenze di ogni parola, case-insensitive.",
     """from collections import Counter
import re

def conta_parole(testo):
    parole = re.findall(r'\\b\\w+\\b', testo.lower())
    return dict(Counter(parole))

testo = "Il gatto mangia il pesce. Il pesce nuota."
print(conta_parole(testo))
# {'il': 3, 'gatto': 1, 'mangia': 1, 'pesce': 2, 'nuota': 1}"""),
]

TUTTE_CATEGORIE = [
    ("Web",     "JavaScript", "Intermedio", TEMPLATE_WEB_JS),
    ("Web",     "CSS",        "Intermedio", TEMPLATE_WEB_CSS),
    ("Database","SQL",        "Intermedio", TEMPLATE_SQL),
    ("Python",  "Algoritmi",  "Intermedio", TEMPLATE_PYTHON),
    ("Logica",  "Algoritmi",  "Base",       TEMPLATE_LOGICA),
]

DIFFICOLTA = ["Base", "Intermedio", "Avanzato"]
VERBI = ["Implementa", "Crea", "Scrivi", "Definisci", "Ottimizza", "Analizza"]

def genera_esercizio_generico(indice):
    """Genera un esercizio placeholder numerato."""
    cat, sotto, diff, templates = random.choice(TUTTE_CATEGORIE)
    tmpl = random.choice(templates)
    titolo = f"{tmpl[0]} (Variante {indice})"
    testo  = f"[Esercizio {indice}] {tmpl[1]}"
    sol    = tmpl[2]
    return (cat, sotto, random.choice(DIFFICOLTA), titolo, testo, sol)

def genera_n_esercizi(n: int):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute("SELECT COUNT(*) FROM esercizi")
    esistenti = c.fetchone()[0]
    print(f"Esercizi esistenti: {esistenti}")

    nuovi = [genera_esercizio_generico(esistenti + i + 1) for i in range(n)]
    c.executemany(
        'INSERT INTO esercizi (categoria, sotto, difficolta, titolo, testo, soluzione) VALUES (?,?,?,?,?,?)',
        nuovi
    )
    conn.commit()

    c.execute("SELECT COUNT(*) FROM esercizi")
    totale = c.fetchone()[0]
    conn.close()
    print(f"✅ Aggiunti {n} esercizi. Totale ora: {totale}")

if __name__ == "__main__":
    quanti = int(sys.argv[1]) if len(sys.argv) > 1 else 100
    genera_n_esercizi(quanti)
