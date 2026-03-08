# English Academy - Applicazione Educativa

Piattaforma web italiana per imparare l'inglese, con sezione Marina Militare, sistema esercizi di programmazione e AI-Powered English Learning Hub con Tutor AI.

## Architettura

| File | Ruolo |
|---|---|
| `index.html` + `templates/index.html` | Unico template HTML (sempre sincronizzati con `cp`) |
| `static/style.css` | CSS responsivo con skeleton loader, AI Tutor sidebar, hub card |
| `static/script.js` | Logica JS ES6+ — 12 sezioni commentate in italiano |
| `app.py` | Backend Flask — 7 sezioni con API esercizi, inglese, AI Tutor, SMTP |
| `exercises.db` | SQLite — 140 esercizi di programmazione |
| `learning_hub.db` | SQLite — 3000 esercizi di inglese su 8 corsi |
| `init_db.py` | Crea exercises.db. Esegui: `python init_db.py` |
| `init_english_db.py` | Crea learning_hub.db con 3000 esercizi. Esegui: `python init_english_db.py` |

## Stack Tecnologico

- **Backend**: Python 3.11 + Flask + SQLite (`sqlite3` stdlib) + OpenAI SDK
- **Frontend**: HTML5, CSS3, Vanilla JS ES6+
- **AI**: OpenAI `gpt-4o-mini` via Replit AI Integrations (nessuna API key utente necessaria)
- **UI Extras**: Tailwind CSS CDN (prefix `tw-`, preflight disabilitato), FontAwesome 6.4
- **Email**: SMTP configurabile via env vars
- **Server Prod**: Gunicorn su porta 5000

## Sezioni dell'App

### Home
- Hero con CTA verso Esercizi e Quiz
- Statistiche: 3000+ esercizi inglese, AI Tutor, Marina Militare

### Corsi (`/` → tab Corsi)
- 3 gruppi: Inglese Generale, Business & Professionale, Programmazione & Tech
- Card con `data-page-target="esercizi"` e `data-cat` per navigazione filtrata
- FAQ con accordion

### Hub Inglese AI (`/` → tab Hub Inglese AI)
- **Griglia 8 corsi**: Inglese Base, Pre-Intermedio, Intermedio, Avanzato, Business English, Viaggi, IELTS, Navale
- **3000 esercizi** con paginazione Load More (20 per pagina), ricerca testuale debounce
- Ogni card: badge argomento, testo esercizio, bottone "Mostra soluzione", bottone "Chiedi al Tutor"
- **AI Tutor Sidebar**: chat laterale su sfondo scuro, spiega grammatica senza dare la risposta, multi-turn conversation con cronologia

### Esercizi (`/` → tab Esercizi)
- 140 esercizi di programmazione (Web, PHP, Database, Python, Logica)
- Skeleton loader, filtri, ricerca, Load More infinito

### Marina Militare
- 6 navi con 21 componenti tecnici, modal con immagini Unsplash

### Quiz
- 4 categorie con scoring real-time

### Contatti
- Form SMTP con validazione frontend + backend

## API Backend

| Endpoint | Descrizione |
|---|---|
| `GET /` | Serve `templates/index.html` |
| `GET /api/exercises` | Lista esercizi programmazione con filtri |
| `GET /api/exercises/categories` | Categorie e statistiche |
| `GET /api/exercises/<id>` | Singolo esercizio programmazione |
| `GET /api/english` | Lista esercizi inglese (cors, argomento, livello, q, page, per_page) |
| `GET /api/english/courses` | Corsi, argomenti e conteggi |
| `POST /api/ai-tutor` | AI Tutor: spiega grammatica senza dare la soluzione |
| `POST /api/contact` | Invia email di contatto |

## Database Esercizi Inglese

**File**: `learning_hub.db`  
**Tabella**: `esercizi`  
**Colonne**: `id, corso, argomento, livello, testo, soluzione`  
**Indici**: `idx_corso`, `idx_argomento`, `idx_livello`

Corsi: `Inglese Base | Pre-Intermedio | Intermedio | Avanzato | Business English | Inglese per Viaggi | IELTS / Cambridge | Inglese Navale`

## AI Tutor

**Endpoint**: `POST /api/ai-tutor`  
**Body**: `{ esercizio: str, domanda: str, cronologia: [{role, content}] }`  
**Modello**: `gpt-4o-mini`  
**Comportamento**: Risponde in italiano, spiega regole grammaticali, NON dà la soluzione diretta, max 300 token  
**Auth**: Replit AI Integrations (`AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`)

## Esecuzione

```bash
# Sviluppo
python app.py          # Port 5000

# Primo avvio: crea i database
python init_db.py
python init_english_db.py

# Produzione
gunicorn --bind 0.0.0.0:5000 --reuse-port app:app
```

## Note Sviluppo

- **Template sync**: dopo ogni modifica a `index.html` eseguire `cp index.html templates/index.html`
- **Tailwind**: prefix `tw-`, preflight disabilitato
- **JS Section 12**: Hub Inglese — `hubStato`, `apriCorso()`, `caricaEserciziHub()`, `apriTutor()`, `inviaTutor()`
- **AI Tutor Sidebar**: `#ai-tutor-sidebar` fixed right, slide-in con classe `.aperto`, overlay `#tutor-overlay`

---

**Version**: 4.0 (AI-Powered English Learning Hub)  
**Last Update**: 2026-03-08  
**Status**: Production Ready
