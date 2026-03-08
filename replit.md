# English Academy - Applicazione Educativa

Piattaforma web italiana per imparare l'inglese, con focus sulla Marina Militare e sistema esercizi di programmazione scalabile.

## Architettura

| File | Ruolo |
|---|---|
| `index.html` + `templates/index.html` | Unico template HTML (sempre sincronizzati con `cp`) |
| `static/style.css` | CSS responsivo (1000+ righe con commenti) |
| `static/script.js` | Logica JS ES6+ — 11 sezioni commentate in italiano |
| `app.py` | Backend Flask — 6 sezioni con API esercizi + SMTP |
| `exercises.db` | SQLite — esercizi pratici scalabile a 3000+ |
| `init_db.py` | Crea il DB con 40 esercizi reali. Esegui: `python init_db.py` |
| `generate_exercises.py` | Aggiunge N esercizi. Esegui: `python generate_exercises.py [n]` |

## Stack Tecnologico

- **Backend**: Python 3.12 + Flask + SQLite (`sqlite3` stdlib)
- **Frontend**: HTML5, CSS3, Vanilla JS ES6+
- **UI Extras**: Tailwind CSS CDN (prefix `tw-`, preflight disabilitato), FontAwesome 6.4
- **Email**: SMTP configurabile via env vars, fallback localhost
- **Server Prod**: Gunicorn su porta 5000

## Sezioni dell'App

### Home
- Hero con CTA verso Corsi e Quiz
- Statistiche: 12+ corsi, 3000+ esercizi, 50+ quiz, 98% soddisfazione
- Showcase dei corsi principali + promo Marina Militare

### Corsi (`/` → tab Corsi)
- **Inglese Generale**: Base A1-A2, Pre-Intermedio, Intermedio B1-B2, Avanzato C1-C2, Viaggi, IELTS
- **Business & Professionale**: Business English, Negoziazioni, Presentazioni
- **Programmazione & Tech**: Web, PHP, Database, Python, Logica — link diretti agli esercizi filtrati
- FAQ con accordion
- Tutte le card hanno `border-left` via `.cat-card`

### Esercizi (`/` → tab Esercizi)
- **40 esercizi reali** nel DB + generatore per scalare a 3000+
- Categorie: Web (HTML5/CSS/JS/React), PHP, Database (SQL/NoSQL), Python, Logica
- Filtri: categoria (pulsanti colorati), difficoltà (select), ricerca full-text con debounce 350ms
- Paginazione: 12 per pagina, bottoni Prec/Succ con info pagina
- Card con badge colorati, testo esercizio, toggle "Mostra/Nascondi soluzione" con `<pre>` verde
- Navigazione da "Corsi" → Esercizi con categoria pre-filtrata (via `data-cat`)

### Marina Militare
- 6 navi: Portaerei, Cacciatorpediniere, Sottomarino, Fregata, Incrociatore, Nave Scuola
- 21 componenti tecnici unici, zero duplicati, zero tooltip
- Immagini Unsplash via modal al click sull'icona ⚓

### Quiz
- 4 categorie di domande con scoring real-time
- Pulsante CTA "Metti alla prova le tue conoscenze navali"

### Contatti
- Form con validazione frontend + backend
- Endpoint `/api/contact` SMTP

## API Backend

| Endpoint | Descrizione |
|---|---|
| `GET /` | Serve `templates/index.html` |
| `GET /api/exercises` | Lista esercizi con filtri (categoria, sotto, difficolta, q, page, per_page) |
| `GET /api/exercises/categories` | Categorie, sottocategorie, difficoltà e totale esercizi |
| `GET /api/exercises/<id>` | Singolo esercizio per ID |
| `POST /api/contact` | Invia email di contatto |

## Database Esercizi

**Tabella**: `esercizi`  
**Colonne**: `id, categoria, sotto, difficolta, titolo, testo, soluzione`  
**Indici**: `idx_categoria`, `idx_difficolta`

Categorie disponibili: `Web | PHP | Database | Python | Logica`  
Difficoltà: `Base | Intermedio | Avanzato`

Per aggiungere esercizi:
```bash
python generate_exercises.py 500   # aggiunge 500 esercizi
```

## Esecuzione

```bash
# Sviluppo
python app.py          # Port 5000

# Primo avvio: crea il database
python init_db.py

# Produzione
gunicorn --bind 0.0.0.0:5000 --reuse-port app:app
```

## Configurazione Email (opzionale)

Aggiungi env vars nel pannello Secrets:
```
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tua-email@gmail.com
SMTP_PASSWORD=app-password
CONTACT_EMAIL=info@example.com
```

## Note Sviluppo

- **Template sync**: dopo ogni modifica a `index.html` eseguire `cp index.html templates/index.html`
- **Tailwind**: prefix `tw-`, preflight disabilitato per coesistere con `style.css` esistente
- **JS Section 11**: logica esercizi — `statoEsercizi`, `caricaEsercizi()`, `inizializzaEsercizi()`, `toggleSoluzione()`
- **Navigazione con filtro**: `data-page-target="esercizi" data-cat="Web"` → apre Esercizi filtrato per Web

---

**Version**: 3.0 (Sistema Esercizi)  
**Last Update**: 2026-03-08  
**Status**: Production Ready
