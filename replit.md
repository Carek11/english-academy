# English Academy

Un'app web educativa italiana per imparare l'inglese, con sezione specializzata per l'inglese tecnico della Marina Militare.

## Tecnologie

- **Backend**: Python / Flask
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Icons**: FontAwesome 6.4.0
- **Server Produzione**: Gunicorn
- **Design**: Responsive (mobile-first)

## Architettura

```
app.py              # Flask entry point, serve /
requirements.txt    # Dependencies: flask, gunicorn
templates/
  index.html        # Jinja2 template principale
static/
  style.css         # Styling completo (corrected da HTML corrupted)
  script.js         # Quiz logic, ship modal, navigation
```

## Funzionalità

- **Home**: Panoramica corsi con statistiche
- **Corsi**: Catalogo completo (Base, Intermedio, Business, IELTS, Navale)
- **Marina Militare**: 
  - 6 tipi di navi (Aircraft Carrier, Destroyer, Submarine, Frigate, Corvette, Patrol Vessel)
  - **Icone cliccabili** (FontAwesome fa-ship) su ogni carta nave
  - **Modal popup responsive** che mostra immagine alta risoluzione della nave
  - Terminologia tecnica bilingue
- **Quiz Interattivi**: 4 categorie (Base, Intermedio, Business, Marina)
  - Domande casuali
  - Punteggio in tempo reale
  - Risultati con valutazione
  - Leaderboard locale
- **Team**: Presentazione team
- **Contatti**: Form contatti con validazione

## Novità - Sezione Marina Militare Interattiva

Ogni nave ha un pulsante cliccabile con icona di nave (fa-ship):
- **Click → Modal popup** con immagine della nave in alta risoluzione
- **Layout responsive**: Centrato, proporzionale, funziona su mobile
- **Chiusura facile**: Bottone X o click esterno al modal
- **Immagini da Unsplash**: Placeholder di alta qualità

## Esecuzione

```bash
# Dev
python app.py                    # Avvia server su http://0.0.0.0:5000

# Production
gunicorn --bind=0.0.0.0:5000 --reuse-port app:app
```

## Port Configuration

- **Dev**: Port 5000 (webview)
- **Production**: Autoscale con Gunicorn su port 5000

## Deployment

Configurato con Autoscale:
```
gunicorn --bind=0.0.0.0:5000 --reuse-port app:app
```

## Responsive Design

- Mobile: 100% width, stack verticale
- Tablet: Grid 2 colonne
- Desktop: Grid 3+ colonne
- Modal: Adattivo a viewport
