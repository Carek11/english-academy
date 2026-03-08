# English Academy - Applicazione Educativa

Piattaforma web italiana per imparare l'inglese. Corsi, sezione Marina Militare, sezione Avanzato con argomenti selezionabili, quiz interattivi per 8 livelli e contatti.

## Architettura

| File | Ruolo |
|---|---|
| `index.php` | Template HTML principale — tutte le sezioni SPA |
| `router.php` | Router PHP — blocca `/data/`, gestisce route API |
| `static/style.css` | CSS responsivo (Tailwind prefix `tw-`, preflight off) |
| `static/script.js` | Logica JS ES6+ — navigazione, quiz, marina, auth, avanzato |
| `api/register.php` | API registrazione utente (bcrypt, SQLite) |
| `api/login.php` | API login utente |
| `api/contact.php` | API form contatti |
| `api/_auth.php` | Middleware CSRF — `verificaToken()`, chiama `session_start()` |
| `data/hub_inglese.db` | SQLite — tabella `utenti` per autenticazione |

## Stack Tecnologico

- **Backend**: PHP 8.4 built-in server (`php -S 0.0.0.0:5000 router.php`)
- **Database**: SQLite via PDO — `data/hub_inglese.db`
- **Frontend**: HTML5, CSS3, Vanilla JS ES6+
- **UI Extras**: Tailwind CSS CDN (prefix `tw-`, preflight disabilitato)
- **Sicurezza**: CSRF token in `$_SESSION['token']`, header `X-CSRF-Token`, bcrypt password hash

## Navigazione (SPA)

Nav: **Corsi · Marina Militare · Avanzato · Quiz · Contatti · Iscriviti/Entra**

- Nessuna Home — l'app si apre direttamente su **Corsi**
- Navigazione gestita con `data-page` e `data-page-target` in JS (`mostraPagina()`)

## Sezioni dell'App

### Corsi (`#corsi`) — default attivo
- 3 gruppi: Inglese Generale, Business & Professionale, Marina Militare
- Card con `data-page-target="quiz"` o `"marina"` per navigazione
- FAQ con accordion

### Marina Militare (`#marina`)
- 6 navi con componenti tecnici, modal con immagini Unsplash
- Quiz navale CTA (`#naval-quiz-cta`) → avvia quiz indice 7

### Inglese Avanzato (`#avanzato`)
- **4 pannelli selezionabili** via tab `.avanzato-tab` / `.avanzato-panel`:
  - 🔧 Grammatica — Inversione, Congiuntivo, Cleft, Nominalizzazione, Passivo Avanzato
  - 💬 Idiomi — Idiomi C1/C2, Collocazioni, Phrasal Verbs, Connettori
  - 📚 Vocabolario — AWL, Registro formale, Parole IELTS/C2
  - ✍️ Scrittura — Struttura saggio, Thesis, Coesione, Email formale
- Ogni pannello ha CTA quiz `data-quiz-direct="3"` o `"5"`

### Quiz (`#quiz`)
- **8 categorie** con domande appropriate per argomento:
  - 0: Base A1-A2 | 1: Pre-Intermedio A2-B1 | 2: Intermedio B1-B2 | 3: Avanzato C1-C2
  - 4: Viaggi | 5: IELTS/Cambridge | 6: Business English | 7: Marina Militare
- Utente loggato: salta step-name, va diretto a step-select
- Punteggio real-time, leaderboard sessione

### Contatti (`#contatti`)
- Form con validazione frontend + API PHP

### Auth Modal
- Tab Accedi / Iscriviti con pannello successo
- Login: `POST /api/login` | Registrazione: `POST /api/register`
- Nome salvato in `localStorage("ea_utente")` dopo login/registrazione
- Nav button `#nav-auth-btn`: mostra "✅ Nome" se loggato (verde), "👤 Iscriviti / Entra" se no

## Database Utenti

**File**: `data/hub_inglese.db`
**Tabella**: `utenti`
**Colonne**: `id, nome, cognome, email, password_hash, corso_interesse, creato_il`

## API PHP

| Endpoint | Descrizione |
|---|---|
| `POST /api/register` | Registra utente, bcrypt hash, salva in `utenti` |
| `POST /api/login` | Verifica credenziali, restituisce nome |
| `POST /api/contact` | Invia email di contatto |

## Note Sviluppo

- **CSRF**: `api/_auth.php` chiama `session_start()` — NON richiamare in register/login
- **Cache busting**: `Cache-Control: no-store` + versioned CSS/JS (`?v=filemtime(...)`)
- **Protezione dati**: `/data/` → HTTP 403 nel router
- **Tailwind prefix**: `tw-`, preflight off — non usare classi Tailwind senza prefisso
- **`index.html.bak`**: NON ripristinare, NON usare
- **Flask `app.py`**: esiste ma NON è in uso — il workflow usa solo PHP

## Funzioni JS Principali

| Funzione | Descrizione |
|---|---|
| `mostraPagina(id)` | Naviga tra sezioni SPA, auto-skip step-name se loggato |
| `selezionaQuiz(idx)` | Avvia quiz per indice (0-7) |
| `salvaUtenteLoggato(nome)` | Salva in localStorage, aggiorna nav button |
| `aggiornaNavAuthBtn()` | Aggiorna testo/colore del pulsante auth in nav |
| `apriModalAuth(corso)` | Apre modal Accedi/Iscriviti |
| `inizializzaAuth()` | Collega tutti gli eventi del modal auth |

## Rimozioni Permanenti (non ripristinare)

- Hub Inglese AI
- AI Tutor
- Esercizi di Programmazione
- Sezione Home
- Varianti esercizi numerati

## Esecuzione

```bash
php -S 0.0.0.0:5000 router.php
```

---

**Version**: 5.0 (PHP SPA — Avanzato con topic selector, 8 quiz categories)
**Last Update**: 2026-03-08
**Status**: Production Ready
