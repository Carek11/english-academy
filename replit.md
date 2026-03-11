# English Academy – Piattaforma Educativa

Piattaforma web italiana per imparare l'inglese. Corsi A1–C2, sezione Marina Militare, sezione Avanzato, quiz interattivi per 8 categorie e form contatti. Autenticazione via Supabase Auth.

## Architettura (React / Next.js)

| File | Ruolo |
|---|---|
| `pages/index.js` | Pagina principale React — tutte le sezioni SPA |
| `pages/_app.js` | Wrapper Next.js — importa CSS globale |
| `pages/_document.js` | Document custom — Font Awesome nel Head |
| `pages/api/login.js` | API login via Supabase Auth |
| `pages/api/register.js` | API registrazione via Supabase Auth |
| `pages/api/contact.js` | API form contatti |
| `lib/supabase.js` | Client Supabase (anon key) |
| `styles/globals.css` | CSS responsivo completo |
| `next.config.js` | Configurazione Next.js |
| `vercel.json` | Configurazione deploy Vercel |

## Stack Tecnologico

- **Framework**: Next.js 14 + React 18
- **Database/Auth**: Supabase (PostgreSQL + Auth)
- **Hosting target**: Vercel con dominio `english-academy.it.com`
- **Dev locale**: `npm run dev` su porta 5000
- **Styling**: CSS puro (Source Sans 3 + Playfair Display da Google Fonts)
- **Icone**: Font Awesome 6.4.0 CDN

## Variabili d'Ambiente

```
NEXT_PUBLIC_SUPABASE_URL=https://tyriikuhauhoxryfpqre.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## Navigazione (SPA)

Nav: **Corsi · Marina Militare · Avanzato · Quiz · Contatti · Iscriviti/Entra**

- App si apre su **Corsi** per default
- Navigazione React state — funzione `handleNaviga(pagina, quizIdx?)`
- Utente salvato in `localStorage('ea_utente')`

## Sezioni dell'App

### Corsi — default
- 3 gruppi: Inglese Generale, Business & Professionale, Marina Militare
- FAQ con accordion

### Marina Militare
- 6 navi (portaerei, cacciatorpediniere, sottomarino, fregata, incrociatore, nave scuola)
- Modal con immagini Unsplash + tabella componenti bilingue
- 4 card componenti (Navigation, Engine Room, Communications, Safety) → pannello esercizi interattivi
- Esercizi interattivi: Flashcard, Fill in the Blank, Matching

### Inglese Avanzato
- 4 tab: Grammatica, Idiomi, Vocabolario, Scrittura
- Card con esempi C1–C2

### Quiz
- **8 categorie** (indici 0–7):
  - 0: Base A1–A2 | 1: Pre-Intermedio A2–B1 | 2: Intermedio B1–B2 | 3: Avanzato C1–C2
  - 4: Viaggi | 5: IELTS/Cambridge | 6: Business English | 7: Marina Militare
- 10 domande per quiz, feedback immediato, schermata risultati

### Contatti
- Form + API `/api/contact`

### Auth Modal
- Tab Accedi / Iscriviti usando Supabase Auth (`signInWithPassword` / `signUp`)
- Dopo login: nome salvato in localStorage, nav button diventa verde

## API Routes

| Endpoint | Descrizione |
|---|---|
| `POST /api/login` | Supabase signInWithPassword |
| `POST /api/register` | Supabase signUp con metadata nome/cognome/corso |
| `POST /api/contact` | Risponde 200 (email SMTP futuro) |

## Esecuzione

```bash
npm run dev   # porta 5000
npm run build # build produzione
npm run start # avvia produzione su porta 5000
```

## Deploy Vercel

1. Push il repo su GitHub
2. Import su Vercel → aggiungi variabili env Supabase
3. Collega dominio `english-academy.it.com` nelle impostazioni Vercel

## Note

- I vecchi file PHP (`index.php`, `router.php`, `api/*.php`, `app.py`) esistono ma non vengono usati da Next.js
- Il workflow Replit usa `npm run dev`
- Contenuto quiz e navale hardcoded in `pages/index.js` — nessun DB necessario per il contenuto

---

**Version**: 6.0 (React/Next.js + Supabase)
**Last Update**: 2026-03-11
**Status**: Running on Replit, ready for Vercel deploy
