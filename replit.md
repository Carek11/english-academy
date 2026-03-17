# English Academy – replit.md

## Overview

English Academy è una piattaforma italiana per l'apprendimento dell'inglese, con focus speciale sull'inglese tecnico navale per la Marina Militare italiana. Deployed su `https://englishacademy-it.replit.app`, dominio custom `english-academy.it.com`.

**Stack:** React 18 + TypeScript (Vite) frontend, Express 5 backend, PostgreSQL via Drizzle ORM, express-session + memorystore, Passport.js (locale + Google OAuth).

---

## Regole Operative Fisse (OBBLIGATORIE)

### Regole sulle domande quiz
1. **Nessun duplicato** — prima di aggiungere domande, estrarre tutte quelle esistenti e verificare duplicati esatti E concettuali
2. **Nessuna copia** — ogni domanda è scritta originalmente, mai copiata da siti/libri/fonti esterne
3. **VIETATO** — non cercare MAI in banche dati non ufficiali o protette da copyright; tutte le domande sono create esclusivamente dall'agente, senza consultare fonti esterne di alcun tipo
4. **Tutto personalizzato** — ogni domanda ha scenario, contesto e formulazione propria e unica, inventata dall'agente
5. **Verifica obbligatoria** — lanciare il controllo automatico (node script) prima di salvare nuove domande
6. **Verifica con script:**
```bash
node -e "
const fs = require('fs');
const content = fs.readFileSync('./client/src/lib/quizData.ts', 'utf8');
const matches = [...content.matchAll(/question:\s*\"([^\"]+)\"/g)];
const questions = matches.map(m => m[1]);
const seen = {};
const dupes = [];
questions.forEach((q, i) => {
  const key = q.toLowerCase().trim();
  if (seen[key] !== undefined) dupes.push(q);
  else seen[key] = i;
});
console.log('Totale:', questions.length, '| Duplicati:', dupes.length);
dupes.forEach(d => console.log('DUPL:', d));
"
```

---

## Stato Corrente dell'Interfaccia

### Accesso (AUTENTICAZIONE ATTIVA)
- **Pulsante "🔐 Accedi"** presente nell'header desktop (dorato) e nella navbar mobile
- Quando loggato: mostra "👤 [Nome]" + pulsante "Esci"
- Pagina auth (`/auth`) con tab **Accedi** / **Registrati**
- Login con email+password oppure **Google OAuth**
- Checkbox **"Ricordami per 30 giorni"** nel form di login
- Registrazione: auto-login immediato (no verifica email obbligatoria)
- `AUTH_DISABLED=false`, `REGISTRATION_BLOCKED=false`, `MODAL_DISABLED=true`
- Tutti i contenuti restano liberi (no paywall)

### Google OAuth
- Implementato con `passport-google-oauth20`
- Route: `GET /auth/google` → redirect Google → `GET /auth/google/callback` → redirect `/?googleLogin=1`
- Callback URL produzione: `https://englishacademy-it.replit.app/auth/google/callback`
- Se le credenziali mancano, Google OAuth è disabilitato silenziosamente (email/password sempre disponibile)
- **Nota:** App Google in modalità test — aggiungere email utenti come "utenti di prova" in Google Cloud Console finché l'app non è pubblicata/verificata da Google

### Navbar (9 pulsanti)
Home | Corsi | Marina | Quiz Marina | Quiz Cultura | Statistiche | Glossario | Chi Siamo | Contatti

---

## Secrets Configurati
| Secret | Uso |
|---|---|
| `BREVO_API_KEY` | Invio email di contatto e registrazione |
| `SESSION_SECRET` | Firma cookie di sessione |
| `GOOGLE_CLIENT_ID` | Google OAuth — ID client |
| `GOOGLE_CLIENT_SECRET` | Google OAuth — Secret client |

---

## Modifiche Effettuate (Storico Completo)

### Autenticazione e Accesso
- Aggiunto pulsante "🔐 Accedi" nell'header desktop (colore gold) e navbar mobile
- Quando loggato: header mostra "👤 [Nome]" + "Esci"; mobile mostra "[Nome] · Esci"
- Registrazione: auto-login immediato (no verifica email obbligatoria)
- Login non blocca utenti con `verified === false`
- Cookie session: `secure: process.env.NODE_ENV === "production"`, `sameSite: "none"` in prod, `"lax"` in dev
- `app.set("trust proxy", 1)` aggiunto per HTTPS in produzione
- Checkbox "Ricordami per 30 giorni": se spuntato → cookie maxAge 30 giorni, altrimenti 7 giorni
- Attributi `autocomplete` corretti su tutti i campi form (salvataggio password browser)
- Google OAuth con passport-google-oauth20: crea account automaticamente al primo accesso Google

### Database (schema.ts)
Tabella `users`:
- `id` (varchar, PK)
- `username` (text, unique)
- `email` (text, unique)
- `password` (text, plain text — nessun hashing)
- `full_name` (text)
- `verification_token` (text, nullable)
- `verified` (boolean)
- `google_id` (text, unique, nullable) ← aggiunto per Google OAuth
- `avatar_url` (text, nullable) ← aggiunto per Google OAuth

### Sezione Corsi (`client/src/pages/courses.tsx`)
- Aggiunto **CourseModal** con informazioni corso e quiz integrato
- **CourseQuiz** con 4 opzioni A/B/C/D, feedback colori, barra progressione, punteggio
- Sistema limite giornaliero: max 50 domande/giorno, reset alle 03:00 AM via localStorage (`englishQuizDaily`)

### Quiz dei Corsi — Pool Domande (`buildQuizPool`)
| Corso | Categorie |
|---|---|
| Inglese Base (A1–A2) | base + preintermedio |
| Inglese Pre-Intermedio (A2–B1) | preintermedio + base + intermedio |
| Inglese Intermedio (B1–B2) | intermedio + preintermedio + avanzato |
| Inglese Avanzato (C1–C2) | avanzato + intermedio + ielts |
| Business English | business + intermedio + avanzato |
| Inglese per Viaggi | viaggi + base + preintermedio |
| Preparazione IELTS / Cambridge | ielts + avanzato + intermedio |

### Banca Domande (`client/src/lib/quizData.ts`)
**Totale domande: 437 (tutte verificate, nessun duplicato)**

| Categoria | N. Domande |
|---|---|
| `base` | 30 |
| `preintermedio` | 15 |
| `intermedio` | 30 |
| `avanzato` | 15 |
| `business` | 30 |
| `viaggi` | 15 |
| `ielts` | 15 |
| `marina` | 6 |
| `navigation` | 50 |
| `engine` | 50 |
| `communications` | 50 |
| `shipQuestions` | 6+ per nave |
| `storia` | 30 |
| `geografia` | 19 |
| `scienze` | 19 |
| `arte` | 19 |
| `astronomia` | 19 |
| `matematica` | 15 |

### Ship Quiz Modal (`client/src/pages/marina.tsx`)
- `ShipQuizModal` integrato in `ShipDetailModal`
- Pulsante "🎯 Fai il Quiz su [Nave]" dentro ogni scheda nave
- 10 domande/round, cicla con modulo

---

## Architettura Frontend

### Routing
```typescript
type PageType = "home" | "corsi" | "marina" | "quiz-marina" | "quiz-cultura" | 
                "chi-siamo" | "contatti" | "auth" | "glossario" | "statistiche";
```
Gestito in `App.tsx` con `useState<PageType>`. Nessun React Router.

### File Principali
| File | Scopo |
|---|---|
| `client/src/App.tsx` | Router principale, navbar, layout, header con auth |
| `client/src/pages/auth.tsx` | Pagina login/registrazione + Google OAuth button |
| `client/src/pages/courses.tsx` | Corsi + CourseModal + CourseQuiz + limite giornaliero |
| `client/src/pages/marina.tsx` | Sezione Marina + ShipDetailModal + ShipQuizModal |
| `client/src/pages/quiz.tsx` | Quiz Navale (quiz-marina) |
| `client/src/lib/quizData.ts` | Tutte le domande quiz + courseData + shipTypes + teamMembers |
| `client/src/lib/statsStorage.ts` | Statistiche quiz in localStorage |
| `server/routes.ts` | API + Google OAuth (passport) |
| `server/storage.ts` | DatabaseStorage (PostgreSQL via Drizzle) |
| `shared/schema.ts` | Schema Drizzle + tipi TypeScript |

---

## Backend & Database

- **PostgreSQL** via Drizzle ORM (`DatabaseStorage` in `server/storage.ts`)
- **Sessioni:** express-session + memorystore
- **Password:** plain text (nessun hashing)
- **Google OAuth:** passport + passport-google-oauth20
- **Email:** Brevo API, sender `info@english-academy.it.com`, BCC a `alainproject84@gmail.com`

### API Routes
| Route | Metodo | Scopo |
|---|---|---|
| `/api/register` | POST | Registrazione + auto-login |
| `/api/login` | POST | Login email/password + rememberMe |
| `/api/logout` | POST | Logout |
| `/api/me` | GET | Utente corrente |
| `/api/verify/:token` | GET | Verifica email (opzionale) |
| `/api/contact` | POST | Form contatti via Brevo |
| `/auth/google` | GET | Avvia flusso Google OAuth |
| `/auth/google/callback` | GET | Callback Google → redirect `/?googleLogin=1` |

---

## Colori e Design

```
academy-blue: #1f3c88
academy-gold: #caa54a
academy-dark: (variante scura del blu)
academy-gray: (grigio testo)
academy-bg: (sfondo chiaro)
```

---

## Deploy

- **Piattaforma:** Replit Autoscale
- **Build:** `npm run build` (Vite + TypeScript)
- **Run:** `npm run start` → `NODE_ENV=production node dist/index.cjs`
- **URL live:** `https://englishacademy-it.replit.app`
- **Dominio custom:** `english-academy.it.com`
- **NON usare Vercel** — incompatibile con l'architettura Express (non serverless)
- Workflow dev: `npm run dev` → Express su porta 5000, Vite HMR integrato

---

## Da Fare (Futuro)

- Aggiungere più domande per `preintermedio`, `avanzato`, `viaggi`, `ielts` (portare a 30+ ciascuna)
- "Eserciziario" per la sezione Marina
- 44 domande aggiuntive per ogni nave nel ship quiz (attualmente 6/nave, target 50/nave)
- Pubblicare app Google su Google Cloud Console (togliere modalità test) per aprire Google OAuth a tutti gli utenti
