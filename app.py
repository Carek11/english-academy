"""
ENGLISH ACADEMY - BACKEND FLASK
Applicazione educativa per l'insegnamento dell'inglese
"""

from flask import Flask, render_template, request, jsonify
import os
import smtplib
import sqlite3
import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

DB_PATH = "exercises.db"


# ========================================
# SEZIONE 1: UTILITÀ DATABASE
# ========================================

def get_db():
    """Restituisce una connessione al database SQLite."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def db_esiste():
    """Verifica che il database esercizi esista."""
    return os.path.exists(DB_PATH)


# ========================================
# SEZIONE 2: ROTTE PRINCIPALI
# ========================================

@app.route('/')
def index():
    """Rotta principale - serve index.html"""
    try:
        return render_template('index.html')
    except Exception as e:
        logger.error(f"Errore caricamento index: {str(e)}")
        return "Errore caricamento pagina", 500


# ========================================
# SEZIONE 3: API ESERCIZI
# ========================================

@app.route('/api/exercises')
def get_exercises():
    """
    Ritorna esercizi con paginazione e filtri.
    Query params:
      - categoria: Web | PHP | Database | Python | Logica
      - sotto: HTML5 | CSS | JavaScript | SQL | ...
      - difficolta: Base | Intermedio | Avanzato
      - q: testo ricerca libera
      - page: numero pagina (default 1)
      - per_page: elementi per pagina (default 12, max 50)
    """
    if not db_esiste():
        return jsonify({'errore': 'Database non trovato. Esegui: python init_db.py'}), 503

    try:
        categoria  = request.args.get('categoria', '').strip()
        sotto      = request.args.get('sotto', '').strip()
        difficolta = request.args.get('difficolta', '').strip()
        q          = request.args.get('q', '').strip()
        page       = max(1, int(request.args.get('page', 1)))
        per_page   = min(50, max(1, int(request.args.get('per_page', 12))))

        condizioni = []
        valori     = []

        if categoria:
            condizioni.append("categoria = ?")
            valori.append(categoria)
        if sotto:
            condizioni.append("sotto = ?")
            valori.append(sotto)
        if difficolta:
            condizioni.append("difficolta = ?")
            valori.append(difficolta)
        if q:
            condizioni.append("(titolo LIKE ? OR testo LIKE ?)")
            valori += [f"%{q}%", f"%{q}%"]

        where = ("WHERE " + " AND ".join(condizioni)) if condizioni else ""
        offset = (page - 1) * per_page

        conn = get_db()
        totale = conn.execute(
            f"SELECT COUNT(*) FROM esercizi {where}", valori
        ).fetchone()[0]

        righe = conn.execute(
            f"SELECT id, categoria, sotto, difficolta, titolo, testo, soluzione "
            f"FROM esercizi {where} ORDER BY id LIMIT ? OFFSET ?",
            valori + [per_page, offset]
        ).fetchall()
        conn.close()

        esercizi = [dict(r) for r in righe]
        return jsonify({
            'esercizi':    esercizi,
            'totale':      totale,
            'page':        page,
            'per_page':    per_page,
            'pagine_tot':  -(-totale // per_page)  # ceil
        })

    except Exception as e:
        logger.error(f"Errore get_exercises: {e}")
        return jsonify({'errore': str(e)}), 500


@app.route('/api/exercises/categories')
def get_categories():
    """Ritorna tutte le categorie/sottocategorie/difficoltà disponibili."""
    if not db_esiste():
        return jsonify({'errore': 'Database non trovato'}), 503
    try:
        conn = get_db()
        categorie  = [r[0] for r in conn.execute(
            "SELECT DISTINCT categoria FROM esercizi ORDER BY categoria")]
        sottocats  = [r[0] for r in conn.execute(
            "SELECT DISTINCT sotto FROM esercizi ORDER BY sotto")]
        difficolta = [r[0] for r in conn.execute(
            "SELECT DISTINCT difficolta FROM esercizi ORDER BY difficolta")]
        totale     = conn.execute("SELECT COUNT(*) FROM esercizi").fetchone()[0]
        conn.close()
        return jsonify({
            'categorie':  categorie,
            'sottocats':  sottocats,
            'difficolta': difficolta,
            'totale':     totale
        })
    except Exception as e:
        logger.error(f"Errore get_categories: {e}")
        return jsonify({'errore': str(e)}), 500


@app.route('/api/exercises/<int:eid>')
def get_exercise(eid):
    """Ritorna un singolo esercizio per ID."""
    if not db_esiste():
        return jsonify({'errore': 'Database non trovato'}), 503
    try:
        conn = get_db()
        riga = conn.execute(
            "SELECT * FROM esercizi WHERE id = ?", (eid,)
        ).fetchone()
        conn.close()
        if not riga:
            return jsonify({'errore': 'Esercizio non trovato'}), 404
        return jsonify(dict(riga))
    except Exception as e:
        logger.error(f"Errore get_exercise: {e}")
        return jsonify({'errore': str(e)}), 500


# ========================================
# SEZIONE 4: API CONTATTI
# ========================================

@app.route('/api/contact', methods=['POST'])
def send_contact():
    """Endpoint per inviare messaggi di contatto via email."""
    try:
        data      = request.json
        nome      = data.get('name', '').strip()
        email     = data.get('email', '').strip()
        messaggio = data.get('message', '').strip()

        if not nome or not email or not messaggio:
            return jsonify({'success': False, 'message': 'Compila tutti i campi'}), 400
        if '@' not in email:
            return jsonify({'success': False, 'message': 'Email non valida'}), 400

        email_dest    = os.environ.get('CONTACT_EMAIL', 'info@englishacademy.it')
        smtp_server   = os.environ.get('SMTP_SERVER', 'localhost')
        smtp_port     = int(os.environ.get('SMTP_PORT', 25))
        smtp_user     = os.environ.get('SMTP_USER', '')
        smtp_password = os.environ.get('SMTP_PASSWORD', '')

        corpo = f"Da: {nome}\nEmail: {email}\n\n{messaggio}"

        try:
            if smtp_user and smtp_password:
                server = smtplib.SMTP(smtp_server, smtp_port)
                server.starttls()
                server.login(smtp_user, smtp_password)
            else:
                server = smtplib.SMTP(smtp_server, smtp_port)

            msg = MIMEMultipart()
            msg['From']    = email
            msg['To']      = email_dest
            msg['Subject'] = f"Nuovo messaggio da {nome}"
            msg.attach(MIMEText(corpo, 'plain', 'utf-8'))
            server.send_message(msg)
            server.quit()
            return jsonify({'success': True, 'message': 'Messaggio inviato'})

        except (smtplib.SMTPAuthenticationError, smtplib.SMTPException, ConnectionRefusedError) as e:
            logger.error(f"SMTP errore: {e}")
            return jsonify({'success': False, 'message': 'Errore invio email'}), 500

    except Exception as e:
        logger.error(f"Errore send_contact: {e}")
        return jsonify({'success': False, 'message': 'Errore interno'}), 500


# ========================================
# SEZIONE 5: GESTIONE ERRORI
# ========================================

@app.errorhandler(404)
def non_trovato(error):
    return jsonify({'error': 'Pagina non trovata'}), 404

@app.errorhandler(500)
def errore_interno(error):
    logger.error(f"Errore interno: {error}")
    return jsonify({'error': 'Errore interno del server'}), 500


# ========================================
# SEZIONE 6: AVVIO SERVER
# ========================================

if __name__ == "__main__":
    if not db_esiste():
        logger.warning("Database esercizi non trovato. Esegui: python init_db.py")
    porta      = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("DEBUG", "False") == "True"
    logger.info(f"Avvio English Academy su porta {porta}")
    app.run(host='0.0.0.0', port=porta, debug=debug_mode)
