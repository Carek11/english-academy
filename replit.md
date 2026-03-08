# English Academy - Applicazione Educativa

Piattaforma web per imparare l'inglese con focus sulla sezione Marina Militare.

## 🏗️ Architettura Refactored

### Modularità Completa
- **HTML** (`index.html`) - Struttura semantica
- **CSS** (`style.css`) - Styling responsive con commenti
- **JavaScript** (`script.js`) - Logica applicativa documentata
- **Backend** (`app.py`) - Flask con error handling robusto

### Stack Tecnologico
- Backend: Python 3.12 + Flask
- Frontend: HTML5, CSS3, Vanilla JavaScript (ES6+)
- Icons: FontAwesome 6.4.0
- Email: SMTP configurabile (fallback localhost)
- Server Prod: Gunicorn on port 5000

## 🚢 Sezione Marina Militare - FINALE

### 6 Navi Principali
1. **Portaerei** (Aircraft Carrier) - Flight deck, Catapult, Island
2. **Cacciatorpediniere** (Destroyer) - Hull, Bow, Stern
3. **Sottomarino** (Submarine) - Conning tower, Periscope, Propeller
4. **Fregata** (Frigate) - Bridge, Mast, Helipad
5. **Incrociatore** (Cruiser) - Main battery, Gun turret, Armored belt
6. **Nave Scuola** (Training Ship) - Classroom deck, Training rigging, Practice bridge

### Componenti Tecnici - Pulizia Completa ✓
- **Zero duplicati**: 21 componenti unici, nessuna ripetizione
- **Descrizioni univoche**: Ogni termine appare una sola volta
- **Testi sincronizzati**: HTML e JS perfettamente allineati
- **Tooltip rimossi**: Nessun effetto hover sui termini

### Immagini Stock
- Ogni nave ha immagine Unsplash dedicata (w=1200, h=800)
- Placeholder SVG automatico se immagine non carica
- Modal popup interattivo al click su icona ⚓

## 🎯 Ottimizzazioni Implementate

### 1. **Codice Pulito**
✅ Commenti chiari in italiano per ogni sezione  
✅ Nomi variabili descrittivi in italiano  
✅ Funzioni ben nominate e strutturate  
✅ Zero testi fantasma o commentati  

### 2. **Prestazioni Ottimizzate**
✅ Vanilla JS senza jQuery  
✅ CSS3 transitions per smoothness  
✅ Lazy image loading con fallback  
✅ Minified selectors performanti  

### 3. **Gestione Errori Robusta**
✅ **Try...catch** in tutte le funzioni JavaScript  
✅ **Error logging** per debugging  
✅ **Placeholder immagini** - SVG fallback  
✅ **Validazione input** - Frontend + Backend  
✅ **SMTP error handling** - 4 eccezioni gestite  

### 4. **Configurazione Replit Stabile**
✅ **Port 5000** - Standard configurato  
✅ **Deployment target** - Autoscale con Gunicorn  
✅ **Modules** - Python 3.12, Node.js 20, web  
✅ **Workflow** - Configurazione standard webview  

## 📋 Funzionalità

### Sezioni Attive
- **Home**: Intro + statistiche + showcase corsi
- **Corsi**: 8 corsi disponibili
- **Marina Militare**: 6 navi con immagini e descrizioni
- **Quiz**: 4 categorie con punteggio real-time
- **Contatti**: Form email funzionale

### Features
✅ **Modal Interattivo** - Icone navi → immagini Unsplash  
✅ **Quiz Dinamico** - Domande casuali + scoring  
✅ **Email Funzionale** - Endpoint `/api/contact` SMTP  
✅ **Responsive** - Mobile-first, tutti i device  
✅ **Pulizia Totale** - Zero tooltip, layout essenziale  

## 🚀 Esecuzione

```bash
# Sviluppo
python app.py          # Port 5000

# Produzione
gunicorn --bind 0.0.0.0:5000 --reuse-port app:app
```

## ⚙️ Configurazione Email

Per email reali, aggiungi env vars:
```
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tua-email@gmail.com
SMTP_PASSWORD=app-password
CONTACT_EMAIL=info@example.com
```

## 📊 Performance

- Vanilla JavaScript ES6+
- CSS3 animations
- Lazy image loading con fallback
- Error logging per debugging
- Zero tooltip overhead

## ✨ Stabilità

- 21 componenti navali, ZERO duplicati
- Descrizioni univoche per ogni termine
- Nessun effetto hover confusionario
- Layout pulito e professionale
- JavaScript validato, zero errori

---

**Version**: 2.2 (Tooltip Removed)  
**Last Update**: 2026-03-08  
**Status**: Production Ready ✅
