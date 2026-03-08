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

## 🎯 Ottimizzazioni Implementate

### 1. **Codice Pulito**
✅ Commenti chiari in italiano per ogni sezione JavaScript  
✅ Nomi variabili descrittivi in italiano (`datiQuiz`, `datiNavi`, `nomeStudente`, `stato`)  
✅ Funzioni ben nominate e strutturate (es. `collegaNavigazione()`, `apriModalNave()`)  
✅ Commenti Python nel backend (`app.py`)  

### 2. **Prestazioni Ottimizzate**
✅ **Debouncing tooltip** - Previene ricalcoli browser su hover veloce (100ms)  
✅ **classList.toggle** - Uso di classi CSS per animazioni senza DOM ricalcoli  
✅ **Event delegation** - Un handler per più elementi  
✅ **Lazy loading immagini** - Placeholder SVG per immagini mancanti  
✅ **Minified CSS selectors** - Selezioni performanti  

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
  - 6 tipi navi (Aircraft Carrier, Destroyer, Submarine, Frigate, Corvette, Patrol)
  - Icone cliccabili (fa-ship) → modal con immagini
  - **Hover tooltips** su componenti navali con debouncing
- **Quiz**: 4 categorie con punteggio real-time
- **Contatti**: Form email funzionale con backend

### Features Avanzate
✅ **Modal Interattivo** - Icone navi → immagini ad alta risoluzione  
✅ **Tooltip Intelligenti** - Mouse hover con debouncing 100ms  
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
datiQuiz[]          // Array quiz con domande
datiNavi{}          // Oggetto navi Marina
stato{}             // Stato applicazione (nome, score, etc.)
debounceTimer       // Timer debouncing tooltip
```

## 🔧 Sezioni JavaScript

1. **Dati** - Quiz + Navi + Config
2. **Stato Globale** - Variabili applicazione
3. **Inizializzazione** - DOMContentLoaded handlers
4. **Navigazione** - Page routing
5. **Modal Navi** - Immagini con fallback
6. **Tooltip** - Debounced hover events
7. **Accordion** - Toggle sections
8. **Quiz** - Sistema completo domande/risposte
9. **Contatti** - Form email
10. **Utilità** - Helper functions

## 📊 Performance

- Debouncing: 100ms (tooltip)
- No jQuery, vanilla JS
- CSS3 transitions for smoothness
- Lazy image loading con fallback
- Error logging per debugging

## ✨ Stabilità

- Try...catch su tutte funzioni principali
- Validazione email frontend + backend
- SMTP error handling (4 eccezioni)
- Logging con Python logger
- Graceful degradation per immagini mancanti

---

**Version**: 2.0 (Refactored)  
**Last Update**: 2026-03-08  
**Status**: Production Ready ✅
