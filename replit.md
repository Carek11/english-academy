# English Academy – replit.md

## Overview

English Academy è una piattaforma italiana per l'apprendimento dell'inglese, con focus speciale sull'inglese tecnico navale per la Marina Militare italiana. Deployed su `https://englishacademy-it.replit.app`, dominio custom `english-academy.it.com`.

**Stack:** React 18 + TypeScript (Vite) frontend, Express 5 backend, PostgreSQL via Drizzle ORM, express-session + memorystore.

---

## Regole Operative Fisse (OBBLIGATORIE)

### Regole sulle domande quiz
1. **Nessun duplicato** — prima di aggiungere domande, estrarre tutte quelle esistenti e verificare duplicati esatti E concettuali
2. **Nessuna copia** — ogni domanda è scritta originalmente, mai copiata da siti/libri/fonti esterne
3. **Nessuna ricerca in banche esterne** — vietato cercare argomenti attinenti in banche domande non ufficiali o protette da copyright; tutte le domande nascono esclusivamente dall'elaborazione interna dell'agente
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

### Accesso
- **Tutto libero, nessun login richiesto** — rimosso ogni pulsante "Accedi" dall'interfaccia
- La pagina `/auth` esiste ancora nel codice ma NON è linkata da nessuna parte nella navbar
- Nessun modal di registrazione, nessun banner di prova gratuita
- `MODAL_DISABLED=true`, `TRIAL_DURATION=Infinity` in App.tsx

### Navbar (9 pulsanti)
Home | Corsi | Marina | Quiz Marina | Quiz Cultura | Statistiche | Glossario | Chi Siamo | Contatti

---

## Modifiche Effettuate (Storico Completo)

### Autenticazione e Accesso
- Rimosso pulsante "🔐 Accedi" dall'header desktop e navbar mobile
- Rimosso banner "Bentornato [utente]"
- Rimosso banner "Prova gratuita attiva — Accedi per continuare"
- Cambiato "Iscriviti ora" in modal corsi → eliminato completamente il blocco
- Registrazione ora fa auto-login immediato (no verifica email obbligatoria)
- Login non blocca utenti con `verified === false`
- Cookie session: `secure: process.env.NODE_ENV === "production"`, `sameSite: "none"` in prod, `"lax"` in dev
- `app.set("trust proxy", 1)` aggiunto per HTTPS in produzione

### Sezione Corsi (`client/src/pages/courses.tsx`)
- Rimosso modal con blocco "Accesso Libero — Iscriviti"
- Aggiunto **CourseModal** con:
  - Informazioni corso
  - Barra domande disponibili oggi (es. 50/50)
  - Pulsante "🎯 Inizia il Quiz — [nome corso]"
- Aggiunto **CourseQuiz** integrato nel modal:
  - Domande specifiche del corso + categorie affini
  - 4 opzioni A/B/C/D con feedback colori (verde=giusto, rosso=sbagliato)
  - Barra di progressione
  - Punteggio in tempo reale
  - Schermata risultati con percentuale e emoji
- Aggiunto **sistema limite giornaliero**:
  - Max 50 domande al giorno per utente
  - Reset automatico ogni giorno alle **03:00 AM**
  - Tracking via `localStorage` (chiave: `englishQuizDaily`)
  - Messaggio "Limite raggiunto" con orario prossimo reset
- Aggiunto pulsante **"🔄 Rifai con 50 nuove domande"** alla fine del quiz (se rimangono domande giornaliere)

### Quiz dei Corsi — Pool Domande (`buildQuizPool`)
Ogni corso pesca solo da categorie affini:
| Corso | Categorie |
|---|---|
| Inglese Base (A1–A2) | base + preintermedio |
| Inglese Pre-Intermedio (A2–B1) | preintermedio + base + intermedio |
| Inglese Intermedio (B1–B2) | intermedio + preintermedio + avanzato |
| Inglese Avanzato (C1–C2) | avanzato + intermedio + ielts |
| Business English | business + intermedio + avanzato |
| Inglese per Viaggi | viaggi + base + preintermedio |
| Preparazione IELTS / Cambridge | ielts + avanzato + intermedio |

- Domande specifiche del corso hanno priorità, poi si aggiungono le affini
- Shuffle casuale a ogni sessione → ogni round è diverso
- Deduplication automatica per testo domanda
- Totale: max 50 domande per sessione

### Banca Domande (`client/src/lib/quizData.ts`)
**Totale domande: 437 (tutte verificate, nessun duplicato)**

Categorie e conteggi:
| Categoria | N. Domande | Argomento |
|---|---|---|
| `base` | 30 | Grammatica A1-A2, vocabolario, verbi to be, articoli |
| `preintermedio` | 15 | Tempi verbali, comparativi, condizionali, passivo |
| `intermedio` | 30 | Grammatica avanzata, phrasal verbs, Second/Third conditional |
| `avanzato` | 15 | Idiomi, congiuntivi, stile formale, prefissi |
| `business` | 30 | Email formali, riunioni, negoziazioni, termini aziendali |
| `viaggi` | 15 | Aeroporti, alberghi, ristoranti, indicazioni, emergenze |
| `ielts` | 15 | Writing Task, Reading, Band, essay, vocabolario accademico |
| `marina` | 6 | Terminologia navale base |
| `navigation` | 50 | Navigazione, GPS, rotte, maree, strumenti |
| `engine` | 50 | Sala macchine, motori, sistemi meccanici |
| `communications` | 50 | Radio VHF/HF, GMDSS, alfabeto NATO, soccorso |
| `shipQuestions` | 6+ per nave | Domande specifiche per ogni tipo di nave |

### Ship Quiz Modal (`client/src/pages/marina.tsx`)
- Aggiunto `ShipQuizModal` all'interno di `ShipDetailModal`
- Pulsante "🎯 Fai il Quiz su [Nave]" dentro ogni scheda nave
- 10 domande per round, cicla con modulo sulle domande disponibili
- `shipQuestions` importato correttamente (fix bug `require()`)

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
| `client/src/App.tsx` | Router principale, navbar, layout |
| `client/src/pages/courses.tsx` | Corsi + CourseModal + CourseQuiz + limite giornaliero |
| `client/src/pages/marina.tsx` | Sezione Marina + ShipDetailModal + ShipQuizModal |
| `client/src/pages/quiz.tsx` | Quiz Navale (quiz-marina) |
| `client/src/pages/quiz-cultura.tsx` | Quiz Cultura Generale |
| `client/src/pages/quiz-marina.tsx` | Quiz Naval English |
| `client/src/lib/quizData.ts` | Tutte le domande quiz + courseData + shipTypes + teamMembers |
| `client/src/lib/statsStorage.ts` | Statistiche quiz in localStorage |
| `server/routes.ts` | API: /api/register, /api/login, /api/logout, /api/me, /api/contact |
| `server/storage.ts` | DatabaseStorage (PostgreSQL via Drizzle) |
| `shared/schema.ts` | Schema Drizzle + tipi TypeScript |

---

## Backend & Database

- **PostgreSQL** via Drizzle ORM (`DatabaseStorage` in `server/storage.ts`)
- **Sessioni:** express-session + memorystore (in-memory, non persistito su DB)
- **Password:** plain text (nessun hashing implementato)
- **Email:** Brevo API (`BREVO_API_KEY` in secrets), sender `info@english-academy.it.com`, BCC a `alainproject84@gmail.com`

### Secrets configurati
| Secret | Uso |
|---|---|
| `BREVO_API_KEY` | Invio email di contatto e registrazione |
| `SESSION_SECRET` | Firma cookie di sessione |

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

- **Piattaforma:** Replit Deployments
- **URL live:** `https://englishacademy-it.replit.app`
- **Dominio custom:** `english-academy.it.com`
- **NON usare Vercel** — incompatibile con l'architettura Express (non serverless)
- Workflow dev: `npm run dev` → Express su porta 5000, Vite HMR integrato

---

## Da Fare (Futuro)

- Aggiungere più domande per `preintermedio`, `avanzato`, `viaggi`, `ielts` (portare a 30+ ciascuna)
- "Eserciziario" per la sezione Marina (esercizi pratici)
- 44 domande aggiuntive per ogni nave nel ship quiz (attualmente 6/nave, target 50/nave)
- Eventuale riattivazione del sistema auth (vedere sezione "Per Riattivare Auth" sotto)

### Per Riattivare Auth (quando necessario)
1. In `App.tsx`: aggiungere "🔐 Accedi" nel header, impostare `MODAL_DISABLED=false`, `TRIAL_DURATION=5*60*1000`
2. In `quiz.tsx`: `DAILY_LIMIT_PER_TOPIC=50`, `MONTHLY_LIMIT=1000`
3. In `auth.tsx`: `AUTH_DISABLED=false`, `REGISTRATION_BLOCKED=false`
