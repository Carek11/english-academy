"""
Script di inizializzazione database esercizi.
Crea exercises.db con 50 esercizi reali.
Esegui con: python init_db.py
"""

import sqlite3
import os

DB_PATH = "exercises.db"

def crea_database():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute('''
        CREATE TABLE IF NOT EXISTS esercizi (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            categoria  TEXT NOT NULL,
            sotto      TEXT NOT NULL,
            difficolta TEXT NOT NULL,
            titolo     TEXT NOT NULL,
            testo      TEXT NOT NULL,
            soluzione  TEXT NOT NULL
        )
    ''')

    c.execute('CREATE INDEX IF NOT EXISTS idx_categoria  ON esercizi(categoria)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_difficolta ON esercizi(difficolta)')

    esercizi = [

        # ─── HTML5 ────────────────────────────────────────────────────────────
        ("Web", "HTML5", "Base",
         "Struttura base di una pagina HTML5",
         "Scrivi la struttura minima di una pagina HTML5 valida con: doctype, html, head (con charset UTF-8 e viewport), title e body.",
         """<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>La mia pagina</title>
</head>
<body>
  <h1>Ciao mondo!</h1>
</body>
</html>"""),

        ("Web", "HTML5", "Base",
         "Form di contatto HTML5",
         "Crea un form HTML5 con: campo nome (required), campo email (type=email), textarea messaggio e pulsante submit. Usa etichette <label> collegate.",
         """<form action="/contatti" method="POST">
  <label for="nome">Nome:</label>
  <input type="text" id="nome" name="nome" required>

  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>

  <label for="messaggio">Messaggio:</label>
  <textarea id="messaggio" name="messaggio" rows="5"></textarea>

  <button type="submit">Invia</button>
</form>"""),

        ("Web", "HTML5", "Base",
         "Lista non ordinata e ordinata",
         "Crea una lista ordinata (ol) con 3 passi di una ricetta e una lista non ordinata (ul) con 3 ingredienti.",
         """<h2>Ingredienti</h2>
<ul>
  <li>200g farina</li>
  <li>2 uova</li>
  <li>100ml latte</li>
</ul>

<h2>Procedimento</h2>
<ol>
  <li>Mescola farina e uova</li>
  <li>Aggiungi il latte gradualmente</li>
  <li>Cuoci in padella per 2 minuti per lato</li>
</ol>"""),

        ("Web", "HTML5", "Intermedio",
         "Tabella HTML5 semantica",
         "Crea una tabella HTML5 con thead, tbody e tfoot. Mostra i voti di 3 studenti (Nome, Matematica, Italiano) e la media nel footer.",
         """<table>
  <thead>
    <tr>
      <th>Nome</th>
      <th>Matematica</th>
      <th>Italiano</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Mario</td><td>8</td><td>7</td></tr>
    <tr><td>Luca</td><td>6</td><td>9</td></tr>
    <tr><td>Sara</td><td>10</td><td>8</td></tr>
  </tbody>
  <tfoot>
    <tr>
      <td>Media</td>
      <td>8.0</td>
      <td>8.0</td>
    </tr>
  </tfoot>
</table>"""),

        ("Web", "HTML5", "Avanzato",
         "Video e Audio HTML5",
         "Incorpora un video HTML5 con due sorgenti (mp4 e webm), controlli e poster. Poi aggiungi un elemento audio con controlli e sorgente mp3.",
         """<video controls poster="anteprima.jpg" width="640">
  <source src="video.mp4"  type="video/mp4">
  <source src="video.webm" type="video/webm">
  Il tuo browser non supporta il tag video.
</video>

<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  Il tuo browser non supporta il tag audio.
</audio>"""),

        # ─── CSS GRID/FLEXBOX ─────────────────────────────────────────────────
        ("Web", "CSS", "Base",
         "Centro verticale e orizzontale con Flexbox",
         "Usa Flexbox per centrare perfettamente un div 200×200px di colore blu all'interno di un contenitore 100vw×100vh.",
         """.contenitore {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.box {
  width: 200px;
  height: 200px;
  background-color: blue;
}"""),

        ("Web", "CSS", "Intermedio",
         "Layout a 3 colonne con CSS Grid",
         "Crea un layout a 3 colonne (sidebar 200px, main 1fr, aside 200px) usando CSS Grid con gap di 20px. Altezza minima del contenitore 100vh.",
         """.layout {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  gap: 20px;
  min-height: 100vh;
}

.sidebar { background: #f0f0f0; }
.main    { background: white;   }
.aside   { background: #f0f0f0; }"""),

        ("Web", "CSS", "Intermedio",
         "Card responsive con Flexbox",
         "Crea un container di card che: si dispone in riga su desktop (min 3 per riga), va a capo su tablet (2 per riga) e diventa 1 per riga su mobile, usando Flexbox e media query.",
         """.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  flex: 1 1 calc(33.33% - 16px);
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .card { flex: 1 1 calc(50% - 16px); }
}

@media (max-width: 480px) {
  .card { flex: 1 1 100%; }
}"""),

        ("Web", "CSS", "Avanzato",
         "Grid Template Areas",
         "Crea un layout completo (header, nav, main, sidebar, footer) usando grid-template-areas. Il footer deve coprire tutta la larghezza.",
         """.pagina {
  display: grid;
  grid-template-areas:
    'header  header'
    'nav     nav'
    'main    sidebar'
    'footer  footer';
  grid-template-columns: 1fr 300px;
  grid-template-rows: auto auto 1fr auto;
  min-height: 100vh;
}

header  { grid-area: header;  background: #1a3a52; color: white; padding: 20px; }
nav     { grid-area: nav;     background: #eee; padding: 10px; }
main    { grid-area: main;    padding: 20px; }
.sidebar{ grid-area: sidebar; padding: 20px; background: #f9f9f9; }
footer  { grid-area: footer;  background: #333; color: white; padding: 20px; }"""),

        ("Web", "CSS", "Avanzato",
         "Animazione CSS keyframes",
         "Crea un'animazione CSS che fa pulsare un cerchio: parte da scala 1, cresce a 1.2 al 50% e torna a 1. Deve ripetersi all'infinito con durata 1.5s.",
         """.cerchio {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: coral;
  animation: pulsa 1.5s ease-in-out infinite;
}

@keyframes pulsa {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}"""),

        # ─── JAVASCRIPT ES6+ ──────────────────────────────────────────────────
        ("Web", "JavaScript", "Base",
         "Arrow function e template literals",
         "Riscrivi questa funzione usando arrow function e template literal:\nfunction saluta(nome) { return 'Ciao ' + nome + '! Benvenuto.'; }",
         """const saluta = nome => `Ciao ${nome}! Benvenuto.`;

// Uso:
console.log(saluta('Mario')); // "Ciao Mario! Benvenuto."

// Con parametri multipli:
const salutaConEta = (nome, eta) =>
  `Ciao ${nome}, hai ${eta} anni!`;"""),

        ("Web", "JavaScript", "Base",
         "Destructuring di oggetti e array",
         "Dato l'oggetto: const utente = { nome:'Mario', eta:30, citta:'Roma' };\nEstrai nome e citta con destructuring. Poi dall'array [10, 20, 30] estrai il primo e il terzo elemento.",
         """const utente = { nome: 'Mario', eta: 30, citta: 'Roma' };

// Destructuring oggetto
const { nome, citta } = utente;
console.log(nome);  // 'Mario'
console.log(citta); // 'Roma'

// Con alias
const { nome: nomeUtente, eta: anni } = utente;

// Destructuring array
const numeri = [10, 20, 30];
const [primo, , terzo] = numeri;
console.log(primo); // 10
console.log(terzo); // 30"""),

        ("Web", "JavaScript", "Intermedio",
         "Promise e async/await",
         "Crea una funzione fetchUtente(id) che simula una chiamata API (con setTimeout 1s) e restituisce un oggetto utente. Usala con async/await e gestisci l'errore con try/catch.",
         """// Funzione che simula API
function fetchUtente(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, nome: 'Mario', email: 'mario@email.it' });
      } else {
        reject(new Error('ID utente non valido'));
      }
    }, 1000);
  });
}

// Uso con async/await
async function caricaUtente(id) {
  try {
    const utente = await fetchUtente(id);
    console.log('Utente:', utente);
  } catch (errore) {
    console.error('Errore:', errore.message);
  }
}

caricaUtente(1);  // Utente: { id: 1, nome: 'Mario', ... }
caricaUtente(-1); // Errore: ID utente non valido"""),

        ("Web", "JavaScript", "Intermedio",
         "Map, Filter, Reduce",
         "Dato l'array: const prodotti = [{nome:'Pane',prezzo:1.5},{nome:'Latte',prezzo:1.2},{nome:'Formaggio',prezzo:3.8}];\n1) Filtra quelli con prezzo > 1.5\n2) Ottieni array dei soli nomi\n3) Calcola il totale",
         """const prodotti = [
  { nome: 'Pane',      prezzo: 1.5 },
  { nome: 'Latte',     prezzo: 1.2 },
  { nome: 'Formaggio', prezzo: 3.8 }
];

// 1) Filter: prezzo > 1.5
const cari = prodotti.filter(p => p.prezzo > 1.5);
// [{ nome: 'Formaggio', prezzo: 3.8 }]

// 2) Map: solo nomi
const nomi = prodotti.map(p => p.nome);
// ['Pane', 'Latte', 'Formaggio']

// 3) Reduce: totale
const totale = prodotti.reduce((acc, p) => acc + p.prezzo, 0);
// 6.5"""),

        ("Web", "JavaScript", "Avanzato",
         "Closure e factory function",
         "Crea una factory function creaContatore() che restituisce un oggetto con tre metodi: incrementa(), decrementa() e valore(). Lo stato interno deve essere privato (closure).",
         """function creaContatore(iniziale = 0) {
  let conteggio = iniziale; // variabile privata

  return {
    incrementa() { conteggio++; },
    decrementa() { conteggio--; },
    valore()     { return conteggio; }
  };
}

const c = creaContatore(10);
c.incrementa();
c.incrementa();
c.decrementa();
console.log(c.valore()); // 11
console.log(c.conteggio); // undefined — è privato!"""),

        ("Web", "JavaScript", "Avanzato",
         "Fetch API con gestione errori",
         "Scrivi una funzione getData(url) usando fetch che: recupera dati JSON, gestisce errori HTTP (response.ok), gestisce errori di rete e restituisce null in caso di fallimento.",
         """async function getData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (errore) {
    if (errore instanceof TypeError) {
      console.error('Errore di rete:', errore.message);
    } else {
      console.error('Errore HTTP:', errore.message);
    }
    return null;
  }
}

// Uso
const utenti = await getData('https://jsonplaceholder.typicode.com/users');
if (utenti) console.log(utenti.length, 'utenti caricati');"""),

        # ─── PHP ──────────────────────────────────────────────────────────────
        ("PHP", "Basi", "Base",
         "Ciclo for e while in PHP",
         "Scrivi un ciclo for che stampa i numeri da 1 a 10. Poi riscrivi la stessa logica con un while.",
         """<?php
// Ciclo for
for ($i = 1; $i <= 10; $i++) {
    echo $i . PHP_EOL;
}

// Ciclo while equivalente
$j = 1;
while ($j <= 10) {
    echo $j . PHP_EOL;
    $j++;
}"""),

        ("PHP", "Basi", "Base",
         "Array e foreach in PHP",
         "Crea un array associativo con nome, email e ruolo di un utente. Stampalo con foreach mostrando chiave e valore.",
         """<?php
$utente = [
    'nome'  => 'Mario Rossi',
    'email' => 'mario@email.it',
    'ruolo' => 'admin'
];

foreach ($utente as $chiave => $valore) {
    echo "$chiave: $valore" . PHP_EOL;
}

// Output:
// nome: Mario Rossi
// email: mario@email.it
// ruolo: admin"""),

        ("PHP", "Basi", "Intermedio",
         "Funzione con validazione email",
         "Crea una funzione PHP validaEmail($email) che restituisce true se l'email è valida, false altrimenti. Usa filter_var e un controllo sul dominio.",
         """<?php
function validaEmail(string $email): bool {
    // Usa il filtro nativo di PHP
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    // Controlla che il dominio abbia un punto
    $domain = substr(strrchr($email, '@'), 1);
    return strpos($domain, '.') !== false;
}

// Test
var_dump(validaEmail('mario@email.it'));   // bool(true)
var_dump(validaEmail('mario@'));           // bool(false)
var_dump(validaEmail('non-una-email'));    // bool(false)"""),

        ("PHP", "Web Scraping", "Avanzato",
         "Web scraping con cURL",
         "Scrivi una funzione PHP che usa cURL per scaricare il contenuto HTML di un URL, con timeout 10s, User-Agent personalizzato e gestione errori.",
         """<?php
function scaricaPagina(string $url): ?string {
    $ch = curl_init();

    curl_setopt_array($ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_USERAGENT      => 'MyBot/1.0',
        CURLOPT_SSL_VERIFYPEER => false,
    ]);

    $html   = curl_exec($ch);
    $errore = curl_error($ch);
    curl_close($ch);

    if ($errore) {
        error_log("cURL errore: $errore");
        return null;
    }

    return $html;
}

$html = scaricaPagina('https://example.com');
if ($html) {
    echo "Scaricati " . strlen($html) . " bytes";
}"""),

        ("PHP", "Web Scraping", "Avanzato",
         "Parsing HTML con DOMDocument",
         "Usando DOMDocument e DOMXPath, estrai tutti i link (href) e i titoli (title o testo) da una stringa HTML. Ignora link vuoti o con '#'.",
         """<?php
function estraiLink(string $html): array {
    $dom = new DOMDocument();
    libxml_use_internal_errors(true); // silenzia warning HTML
    $dom->loadHTML($html);
    libxml_clear_errors();

    $xpath = new DOMXPath($dom);
    $link  = [];

    foreach ($xpath->query('//a[@href]') as $nodo) {
        $href  = $nodo->getAttribute('href');
        $testo = trim($nodo->textContent);

        if (empty($href) || $href === '#') continue;

        $link[] = [
            'url'   => $href,
            'testo' => $testo ?: $href
        ];
    }

    return $link;
}"""),

        # ─── DATABASE SQL ─────────────────────────────────────────────────────
        ("Database", "SQL", "Base",
         "SELECT con WHERE e ORDER BY",
         "Scrivi una query per ottenere nome e email degli utenti della città 'Milano', ordinati per nome in ordine alfabetico.",
         """SELECT nome, email
FROM utenti
WHERE citta = 'Milano'
ORDER BY nome ASC;"""),

        ("Database", "SQL", "Base",
         "INSERT, UPDATE, DELETE",
         "Scrivi le 3 query fondamentali: inserisci un nuovo prodotto (nome='Laptop', prezzo=999.99, stock=50), aggiorna il prezzo a 899.99 dove id=1, elimina i prodotti con stock=0.",
         """-- INSERT
INSERT INTO prodotti (nome, prezzo, stock)
VALUES ('Laptop', 999.99, 50);

-- UPDATE
UPDATE prodotti
SET prezzo = 899.99
WHERE id = 1;

-- DELETE
DELETE FROM prodotti
WHERE stock = 0;"""),

        ("Database", "SQL", "Intermedio",
         "JOIN tra tabelle",
         "Hai due tabelle: ordini(id, utente_id, totale, data) e utenti(id, nome, email). Scrivi una query che mostra nome utente, email e totale ordine per tutti gli ordini degli ultimi 30 giorni.",
         """SELECT
    u.nome,
    u.email,
    o.totale,
    o.data
FROM ordini o
INNER JOIN utenti u ON o.utente_id = u.id
WHERE o.data >= DATE('now', '-30 days')
ORDER BY o.data DESC;"""),

        ("Database", "SQL", "Intermedio",
         "GROUP BY e funzioni aggregate",
         "Dalla tabella vendite(id, prodotto, quantita, prezzo, data), scrivi una query che mostra per ogni prodotto: quantità totale venduta, fatturato totale e prezzo medio, solo per prodotti con fatturato > 1000.",
         """SELECT
    prodotto,
    SUM(quantita)         AS qty_totale,
    SUM(quantita * prezzo) AS fatturato,
    AVG(prezzo)           AS prezzo_medio
FROM vendite
GROUP BY prodotto
HAVING SUM(quantita * prezzo) > 1000
ORDER BY fatturato DESC;"""),

        ("Database", "SQL", "Avanzato",
         "Subquery e CTE (Common Table Expression)",
         "Usa una CTE per trovare i 5 clienti con il maggior numero di ordini nell'ultimo anno, mostrando nome e conteggio ordini.",
         """WITH ordini_per_cliente AS (
    SELECT
        utente_id,
        COUNT(*) AS num_ordini
    FROM ordini
    WHERE data >= DATE('now', '-1 year')
    GROUP BY utente_id
)
SELECT
    u.nome,
    opc.num_ordini
FROM ordini_per_cliente opc
INNER JOIN utenti u ON opc.utente_id = u.id
ORDER BY opc.num_ordini DESC
LIMIT 5;"""),

        ("Database", "SQL", "Avanzato",
         "Indici e ottimizzazione query",
         "Spiega quando creare un indice e scrivi i comandi SQL per: creare un indice su email in tabella utenti, un indice composto su (categoria, data) in tabella articoli e verificare gli indici esistenti.",
         """-- Crea indice singolo (utile per ricerche frequenti su email)
CREATE INDEX idx_utenti_email
ON utenti(email);

-- Crea indice univoco (garantisce unicità email)
CREATE UNIQUE INDEX idx_utenti_email_unico
ON utenti(email);

-- Crea indice composto (per filtri su categoria + data)
CREATE INDEX idx_articoli_cat_data
ON articoli(categoria, data DESC);

-- Visualizza indici su una tabella (SQLite)
PRAGMA index_list('utenti');

-- Analisi query con EXPLAIN
EXPLAIN QUERY PLAN
SELECT * FROM utenti WHERE email = 'mario@email.it';"""),

        # ─── PYTHON / ALGORITMI ───────────────────────────────────────────────
        ("Python", "Algoritmi", "Base",
         "Bubble Sort",
         "Implementa il Bubble Sort in Python per ordinare una lista di interi in ordine crescente. Aggiungi un flag per ottimizzarlo se la lista è già ordinata.",
         """def bubble_sort(lista):
    n = len(lista)
    for i in range(n):
        scambiato = False
        for j in range(0, n - i - 1):
            if lista[j] > lista[j + 1]:
                lista[j], lista[j + 1] = lista[j + 1], lista[j]
                scambiato = True
        # Ottimizzazione: esci se nessuno scambio
        if not scambiato:
            break
    return lista

# Test
print(bubble_sort([64, 34, 25, 12, 22, 11, 90]))
# [11, 12, 22, 25, 34, 64, 90]"""),

        ("Python", "Algoritmi", "Intermedio",
         "Ricerca binaria",
         "Implementa la ricerca binaria (binary search) su una lista ordinata. Restituisce l'indice dell'elemento o -1 se non trovato. Implementa sia la versione iterativa che ricorsiva.",
         """# Versione iterativa
def ricerca_binaria(lista, target):
    sinistra, destra = 0, len(lista) - 1
    while sinistra <= destra:
        medio = (sinistra + destra) // 2
        if lista[medio] == target:
            return medio
        elif lista[medio] < target:
            sinistra = medio + 1
        else:
            destra = medio - 1
    return -1

# Versione ricorsiva
def ricerca_bin_ricorsiva(lista, target, sx=0, dx=None):
    if dx is None:
        dx = len(lista) - 1
    if sx > dx:
        return -1
    medio = (sx + dx) // 2
    if lista[medio] == target:
        return medio
    elif lista[medio] < target:
        return ricerca_bin_ricorsiva(lista, target, medio + 1, dx)
    else:
        return ricerca_bin_ricorsiva(lista, target, sx, medio - 1)

numeri = [1, 3, 5, 7, 9, 11, 13, 15]
print(ricerca_binaria(numeri, 7))  # 3
print(ricerca_binaria(numeri, 6))  # -1"""),

        ("Python", "Strutture Dati", "Intermedio",
         "Implementa uno Stack",
         "Implementa una classe Stack in Python con metodi: push(elemento), pop(), peek(), is_empty() e size(). Usa una lista interna. Gestisci il caso di pop su stack vuoto.",
         """class Stack:
    def __init__(self):
        self._dati = []

    def push(self, elemento):
        self._dati.append(elemento)

    def pop(self):
        if self.is_empty():
            raise IndexError("Stack vuoto")
        return self._dati.pop()

    def peek(self):
        if self.is_empty():
            raise IndexError("Stack vuoto")
        return self._dati[-1]

    def is_empty(self):
        return len(self._dati) == 0

    def size(self):
        return len(self._dati)

    def __repr__(self):
        return f"Stack({self._dati})"

# Test
s = Stack()
s.push(1); s.push(2); s.push(3)
print(s.peek()) # 3
print(s.pop())  # 3
print(s.size()) # 2"""),

        ("Python", "Strutture Dati", "Avanzato",
         "Albero binario di ricerca (BST)",
         "Implementa un BST con nodo, inserimento e visita in-order (che restituisce la lista ordinata).",
         """class Nodo:
    def __init__(self, valore):
        self.valore = valore
        self.sinistro = None
        self.destro   = None

class BST:
    def __init__(self):
        self.radice = None

    def inserisci(self, valore):
        if self.radice is None:
            self.radice = Nodo(valore)
        else:
            self._inserisci_ricorsivo(self.radice, valore)

    def _inserisci_ricorsivo(self, nodo, valore):
        if valore < nodo.valore:
            if nodo.sinistro is None:
                nodo.sinistro = Nodo(valore)
            else:
                self._inserisci_ricorsivo(nodo.sinistro, valore)
        else:
            if nodo.destro is None:
                nodo.destro = Nodo(valore)
            else:
                self._inserisci_ricorsivo(nodo.destro, valore)

    def in_order(self):
        risultato = []
        self._in_order_ricorsivo(self.radice, risultato)
        return risultato

    def _in_order_ricorsivo(self, nodo, risultato):
        if nodo:
            self._in_order_ricorsivo(nodo.sinistro, risultato)
            risultato.append(nodo.valore)
            self._in_order_ricorsivo(nodo.destro, risultato)

# Test
bst = BST()
for v in [5, 3, 7, 1, 4, 6, 8]:
    bst.inserisci(v)
print(bst.in_order()) # [1, 3, 4, 5, 6, 7, 8]"""),

        ("Python", "Algoritmi", "Avanzato",
         "Merge Sort",
         "Implementa il Merge Sort in Python. Deve dividere la lista a metà ricorsivamente e unirle ordinate. Complexity: O(n log n).",
         """def merge_sort(lista):
    if len(lista) <= 1:
        return lista

    medio = len(lista) // 2
    sinistra = merge_sort(lista[:medio])
    destra   = merge_sort(lista[medio:])

    return merge(sinistra, destra)

def merge(sinistra, destra):
    risultato = []
    i = j = 0

    while i < len(sinistra) and j < len(destra):
        if sinistra[i] <= destra[j]:
            risultato.append(sinistra[i])
            i += 1
        else:
            risultato.append(destra[j])
            j += 1

    risultato.extend(sinistra[i:])
    risultato.extend(destra[j:])
    return risultato

# Test
numeri = [38, 27, 43, 3, 9, 82, 10]
print(merge_sort(numeri)) # [3, 9, 10, 27, 38, 43, 82]"""),

        # ─── LOGICA / ALGORITMI CLASSICI ──────────────────────────────────────
        ("Logica", "Algoritmi", "Base",
         "FizzBuzz",
         "Scrivi una funzione fizzbuzz(n) che per ogni numero da 1 a n stampa: 'Fizz' se divisibile per 3, 'Buzz' se divisibile per 5, 'FizzBuzz' se divisibile per entrambi, altrimenti il numero.",
         """def fizzbuzz(n):
    for i in range(1, n + 1):
        if i % 15 == 0:
            print("FizzBuzz")
        elif i % 3 == 0:
            print("Fizz")
        elif i % 5 == 0:
            print("Buzz")
        else:
            print(i)

fizzbuzz(20)
# 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz,
# 11, Fizz, 13, 14, FizzBuzz, 16, 17, Fizz, 19, Buzz"""),

        ("Logica", "Algoritmi", "Base",
         "Palindromo",
         "Scrivi una funzione e_palindromo(s) che verifica se una stringa è palindroma, ignorando spazi, punteggiatura e maiuscole/minuscole.",
         """import re

def e_palindromo(s):
    # Mantieni solo lettere e numeri, minuscolo
    pulita = re.sub(r'[^a-z0-9]', '', s.lower())
    return pulita == pulita[::-1]

# Test
print(e_palindromo("Anna"))                    # True
print(e_palindromo("A man a plan a canal Panama")) # True
print(e_palindromo("hello"))                   # False
print(e_palindromo("Was it a car or a cat I saw?")) # True"""),

        ("Logica", "Algoritmi", "Intermedio",
         "Numeri di Fibonacci",
         "Implementa 3 versioni della sequenza di Fibonacci fino a n: 1) Ricorsiva, 2) Iterativa, 3) Con memoizzazione. Confronta le performance.",
         """import time
from functools import lru_cache

# 1) Ricorsiva (lenta)
def fib_ricorsiva(n):
    if n <= 1: return n
    return fib_ricorsiva(n-1) + fib_ricorsiva(n-2)

# 2) Iterativa (veloce)
def fib_iterativa(n):
    if n <= 1: return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

# 3) Con memoizzazione (veloce come iterativa)
@lru_cache(maxsize=None)
def fib_memo(n):
    if n <= 1: return n
    return fib_memo(n-1) + fib_memo(n-2)

# Test
for n in [10, 20, 30]:
    print(f"fib({n}) = {fib_iterativa(n)}")
# fib(10) = 55, fib(20) = 6765, fib(30) = 832040"""),

        ("Logica", "Algoritmi", "Intermedio",
         "Trova i duplicati in una lista",
         "Scrivi una funzione trova_duplicati(lista) che restituisce una lista degli elementi che appaiono più di una volta. Usa un approccio efficiente O(n).",
         """def trova_duplicati(lista):
    visti    = set()
    duplicati = set()

    for elemento in lista:
        if elemento in visti:
            duplicati.add(elemento)
        else:
            visti.add(elemento)

    return sorted(duplicati)

# Test
print(trova_duplicati([1, 2, 3, 2, 4, 3, 5]))
# [2, 3]

print(trova_duplicati(['a', 'b', 'a', 'c', 'b', 'b']))
# ['a', 'b']

print(trova_duplicati([1, 2, 3, 4, 5]))
# []"""),

        ("Logica", "Algoritmi", "Avanzato",
         "Anagrammi",
         "Scrivi una funzione sono_anagrammi(s1, s2) e poi una funzione raggruppa_anagrammi(lista_parole) che raggruppa le parole che sono anagrammi tra loro.",
         """from collections import Counter, defaultdict

def sono_anagrammi(s1: str, s2: str) -> bool:
    return Counter(s1.lower()) == Counter(s2.lower())

def raggruppa_anagrammi(parole):
    gruppi = defaultdict(list)
    for parola in parole:
        chiave = tuple(sorted(parola.lower()))
        gruppi[chiave].append(parola)
    return [g for g in gruppi.values() if len(g) > 1]

# Test
print(sono_anagrammi("listen", "silent")) # True
print(sono_anagrammi("hello",  "world"))  # False

parole = ["eat", "tea", "tan", "ate", "nat", "bat"]
print(raggruppa_anagrammi(parole))
# [['eat','tea','ate'], ['tan','nat']]"""),

        # ─── NOSQL / MONGODB ──────────────────────────────────────────────────
        ("Database", "NoSQL", "Intermedio",
         "Query MongoDB con filtri e proiezione",
         "Scrivi le query MongoDB (in notazione Python con pymongo) per: 1) trovare tutti gli utenti con età > 25, 2) trovare utenti con città='Roma' o città='Milano', 3) aggiornare l'email di un utente.",
         """from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['accademia']
utenti = db['utenti']

# 1) Età > 25, solo nome e email
risultati = utenti.find(
    {'eta': {'$gt': 25}},
    {'nome': 1, 'email': 1, '_id': 0}
)

# 2) Roma O Milano
risultati2 = utenti.find({
    'citta': {'$in': ['Roma', 'Milano']}
})

# 3) Aggiorna email
utenti.update_one(
    {'_id': 'id_utente'},
    {'$set': {'email': 'nuova@email.it'}}
)

# 4) Aggregazione: conta per città
pipeline = [
    {'$group': {'_id': '$citta', 'count': {'$sum': 1}}},
    {'$sort': {'count': -1}}
]
utenti.aggregate(pipeline)"""),

        # ─── REACT ────────────────────────────────────────────────────────────
        ("Web", "React", "Intermedio",
         "useState e useEffect Hook",
         "Crea un componente React che mostra una lista di utenti caricata da un'API (https://jsonplaceholder.typicode.com/users). Usa useState per i dati e useEffect per il fetch. Mostra 'Caricamento...' durante il fetch.",
         """import React, { useState, useEffect } from 'react';

function ListaUtenti() {
  const [utenti, setUtenti]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [errore, setErrore]       = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => {
        if (!res.ok) throw new Error('Errore HTTP ' + res.status);
        return res.json();
      })
      .then(dati => {
        setUtenti(dati);
        setLoading(false);
      })
      .catch(err => {
        setErrore(err.message);
        setLoading(false);
      });
  }, []); // [] = esegui solo al mount

  if (loading) return <p>Caricamento...</p>;
  if (errore)  return <p>Errore: {errore}</p>;

  return (
    <ul>
      {utenti.map(u => (
        <li key={u.id}>
          <strong>{u.name}</strong> — {u.email}
        </li>
      ))}
    </ul>
  );
}

export default ListaUtenti;"""),

        ("Web", "React", "Avanzato",
         "Custom Hook useFetch",
         "Crea un custom hook useFetch(url) riutilizzabile che gestisce stato di loading, dati ed errore. Usalo in un componente.",
         """import { useState, useEffect } from 'react';

// Custom hook riutilizzabile
function useFetch(url) {
  const [dati, setDati]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore]   = useState(null);

  useEffect(() => {
    let attivo = true; // cleanup race conditions
    setLoading(true);

    fetch(url)
      .then(res => res.json())
      .then(json => {
        if (attivo) {
          setDati(json);
          setLoading(false);
        }
      })
      .catch(err => {
        if (attivo) {
          setErrore(err.message);
          setLoading(false);
        }
      });

    return () => { attivo = false; }; // cleanup
  }, [url]);

  return { dati, loading, errore };
}

// Uso in un componente
function Posts() {
  const { dati, loading, errore } =
    useFetch('https://jsonplaceholder.typicode.com/posts');

  if (loading) return <p>Caricamento...</p>;
  if (errore)  return <p>Errore: {errore}</p>;

  return (
    <div>
      {dati.slice(0, 5).map(p => (
        <div key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.body}</p>
        </div>
      ))}
    </div>
  );
}"""),

    ]

    c.executemany(
        'INSERT INTO esercizi (categoria, sotto, difficolta, titolo, testo, soluzione) VALUES (?,?,?,?,?,?)',
        esercizi
    )

    conn.commit()
    print(f"✅ Database creato: {len(esercizi)} esercizi inseriti")
    conn.close()

if __name__ == "__main__":
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print(f"ℹ️  Database precedente rimosso")
    crea_database()
    print(f"📂 File: {DB_PATH}")
