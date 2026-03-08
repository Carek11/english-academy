# English Academy - Applicazione Educativa

Piattaforma web per imparare l'inglese con focus sulla sezione Marina Militare.

## 🏗️ Architettura Refactored

### Modularità Completa
- **HTML** (`index.html`) - Struttura semantica
- **CSS** (`style.css`) - Styling responsive con commenti per ogni sezione
- **JavaScript** (`script.js`) - Logica applicativa completamente documentata
- **Backend** (`app.py`) - Flask con error handling robusto

### Stack Tecnologico
- Backend: Python 3.12 + Flask
- Frontend: HTML5, CSS3, Vanilla JavaScript (ES6+)
- Icons: FontAwesome 6.4.0
- Email: SMTP configurabile (fallback localhost)
- Server Prod: Gunicorn on port 5000

## 🚢 Sezione Marina Militare - AGGIORNATA

### 6 Navi Principali
1. **Portaerei** (Aircraft Carrier) - Grande nave con ponte di volo
2. **Cacciatorpediniere** (Destroyer) - Nave veloce e manovrabile
3. **Incrociatore** (Cruiser) - Nave corazzata e potentemente armata
4. **Fregata** (Frigate) - Nave multiruolo di medie dimensioni
5. **Sommergibile** (Submarine) - Nave militare sommersa
6. **Nave Scuola** (Training Ship) - Nave specializzata per formazione

### Componenti Tecnici - Pulizia Testi ✓
- **Zero duplicati**: Ogni termine (Bridge, Hull, Helipad, etc.) appare una sola volta
- **Descrizioni singole e chiare**: No ripetizioni
- **Mapping componenti → zone nave**: Ogni componente ha una posizione unica nell'immagine

### Immagini Stock di Alta Qualità ✓
- Ogni nave ha immagine Unsplash dedicata (w=1200, h=800)
- Placeholder SVG automatico se immagine non carica
- Modal popup interattivo al click su icona ⚓

### Sincronizzazione Hover ✓
- Ogni termine tecnico (es. "Flight deck") illumina la zona corrispondente nell'immagine
- Overlay con bordo oro (#c9a961) e animazione pulse infinito
- Debouncing 100ms per evitare flicker
- Tooltip con descrizione inglese + italiano

## 🎯 Ottimizzazioni Implementate

### 1. **Codice Pulito**
✅ Commenti chiari in italiano per ogni sezione JavaScript  
✅ Nomi variabili descrittivi in italiano (`datiQuiz`, `datiNavi`, `nomeStudente`, `stato`)  
✅ Funzioni ben nominate e strutturate (es. `collegaNavigazione()`, `apriModalNave()`, `evidenziaZonaNave()`)  
✅ Commenti Python nel backend (`app.py`)  

### 2. **Prestazioni Ottimizzate**
✅ **Debouncing tooltip** - 100ms per evitare ricalcoli browser su hover veloce  
✅ **classList.toggle** - Uso di classi CSS per animazioni senza DOM ricalcoli  
✅ **Event delegation** - Un handler per più elementi  
✅ **Lazy loading immagini** - Placeholder SVG per immagini mancanti  
✅ **Minified CSS selectors** - Selezioni performanti  
✅ **Animazione pulse CSS** - @keyframes per evidenziazione zone nave  

### 3. **Gestione Errori Robusta**
✅ **Try...catch** in tutte le funzioni JavaScript principali  
✅ **Error logging** - Console logging per debugging  
✅ **Placeholder immagini** - SVG fallback se immagine manca  
✅ **Validazione input** - Frontend + Backend validazione  
✅ **Error handling SMTP** - 4 tipi di eccezione gestite  

### 4. **Configurazione Replit Stabile**
✅ **Port 5000** - Standard Replit, configurato in `.replit`  
✅ **Deployment target** - Autoscale con Gunicorn  
✅ **Modules** - Python 3.12, Node.js 20, web module  
✅ **Workflow** - Configurazione standard webview  

## 📋 Funzionalità

### Sezioni Attive
- **Home**: Intro + statistiche + showcase corsi
- **Corsi**: 8 corsi disponibili (Base, Intermedio, Business, IELTS, Navale, etc.)
- **Marina Militare**: 
  - 6 tipi navi (Portaerei, Cacciatorpediniere, Incrociatore, Fregata, Sommergibile, Nave Scuola)
  - Icone cliccabili (fa-ship) → modal con immagini stock
  - **Hover tooltips** su componenti navali con debouncing
  - **Sincronizzazione zone nave** - Ogni termine illumina area immagine
- **Quiz**: 4 categorie con punteggio real-time
- **Contatti**: Form email funzionale con backend

### Features Avanzate
✅ **Modal Interattivo** - Icone navi → immagini Unsplash ad alta risoluzione  
✅ **Tooltip Intelligenti** - Mouse hover con debouncing 100ms + sincronizzazione zone  
✅ **Quiz Dinamico** - Domande casuali + scoring + leaderboard  
✅ **Email Funzionale** - Endpoint `/api/contact` con SMTP  
✅ **Responsive** - Mobile-first, funziona su tutti i device  

## 🚀 Esecuzione

```bash
# Sviluppo
python app.py          # Port 5000

# Produzione
gunicorn --bind 0.0.0.0:5000 --reuse-port app:app
```

## ⚙️ Configurazione Email

Per email reali, aggiungi env vars in Replit (Tools → Secrets):
```
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tua-email@gmail.com
SMTP_PASSWORD=app-password
CONTACT_EMAIL=info@example.com
DEBUG=False
```

Senza config: fallback localhost SMTP porta 25 (non invia).

## 📦 Variabili Globali (JavaScript)

```javascript
datiQuiz[]              // Array quiz con domande
datiNavi{}              // Oggetto 6 navi Marina con componentiZone
stato{}                 // Stato applicazione (nome, score, etc.)
debounceTimer           // Timer debouncing tooltip
URL_PLACEHOLDER         // SVG placeholder per immagini mancanti
```

## 🔧 Sezioni JavaScript

1. **Dati** - Quiz + 6 Navi + Config
2. **Stato Globale** - Variabili applicazione
3. **Inizializzazione** - DOMContentLoaded handlers
4. **Navigazione** - Page routing
5. **Modal Navi** - Immagini con fallback
6. **Tooltip + Sync Zone Nave** - Debounced hover + evidenziazione
7. **Accordion** - Toggle sections
8. **Quiz** - Sistema completo domande/risposte
9. **Contatti** - Form email
10. **Utilità** - Helper functions

## 📊 Performance

- Debouncing: 100ms (tooltip)
- No jQuery, vanilla JS
- CSS3 transitions + animations
- Lazy image loading con fallback
- Error logging per debugging
- Pulse animation @keyframes per zone nave

## ✨ Stabilità Marina Militare

### Testi Puliti
- Zero ripetizioni (es. "Helipad" appare una volta)
- Descrizioni chiare e sintetiche
- Componenti univoci per nave

### Immagini Sincronizzate
- Ogni nave ha immagine dedicata (Unsplash)
- Placeholder SVG automatico
- Overlay oro con pulse animation
- Modal interattivo al click

### Hover Sincronizzato
- Ogni termine tecnico → zona specifica dell'immagine
- No conflitti tra nomi componenti
- Evidenziazione visibile e intuitiva
- Debouncing per smooth interaction

---

**Version**: 2.1 (Marina Militare Enhanced)  
**Last Update**: 2026-03-08  
**Status**: Production Ready ✅
