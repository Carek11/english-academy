# English Academy - App Educativa

Piattaforma web semplice per imparare l'inglese, con focus su sezione Marina Militare.

## Tech Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Icons**: FontAwesome 6.4.0
- **Email**: SMTP configurabile via env vars
- **Server**: Gunicorn (production)

## Struttura Progetto

```
app.py              # Flask: GET /, POST /api/contact
requirements.txt    # flask, gunicorn
templates/index.html
static/
  style.css         # CSS completo + tooltips
  script.js         # JS: quiz, nav, ship modal, email form
```

## Sezioni Attive

- **Home**: Intro + statistiche + showcase corsi
- **Corsi**: Catalogo 8 corsi (Base, Intermedio, Business, IELTS, Navale, etc.)
- **Marina Militare**: 
  - 6 tipi navi (Carrier, Destroyer, Submarine, Frigate, Corvette, Patrol)
  - **Icone cliccabili** (fa-ship) → modal con immagini
  - **Hover tooltips** sui componenti navali (mostra parti della nave)
- **Quiz**: 4 categorie + punteggio in tempo reale
- **Contatti**: Form email semplice (no indirizzo, no team)

## Features

✅ **Contact Form Funzionale**
- Endpoint POST `/api/contact` 
- Supporta SMTP esterno (env vars): `SMTP_SERVER`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `CONTACT_EMAIL`
- Fallback: localhost SMTP porta 25
- Validazione campi frontend + backend
- Messaggio di successo con auto-reset

✅ **Ship Modal Interattivo**
- Click icona nave → modal popup
- Immagini da Unsplash (alta risoluzione)
- Chiusura: bottone X o click esterno
- Responsive mobile

✅ **Hover Tooltips Marina**
- Scorrere mouse su componenti navali
- Mostra nome inglese + italiano
- Tooltip floating con freccia

✅ **Quiz Interattivi**
- 4 categorie (Base, Intermedio, Business, Marina)
- Domande casuali
- Punteggio live
- Risultati + valutazione

## Configurazione Email

Per abilitare email reali, impostare env vars:

```bash
# Replit env vars o .env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
CONTACT_EMAIL=info@example.com
```

Senza env vars: usa localhost SMTP (porta 25) in fallback.

## Esecuzione

```bash
python app.py          # Dev: port 5000
gunicorn --bind 0.0.0.0:5000 app:app  # Prod
```

## Responsive Design

- Mobile: Stack verticale, modali adattivi
- Tablet: Griglia 2 colonne
- Desktop: Griglia 3+ colonne

## Removed

- ❌ Chi Siamo (team section)
- ❌ Address/Phone (solo email)
- ❌ Social links
