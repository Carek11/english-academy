"""
ENGLISH ACADEMY - BACKEND FLASK
Applicazione educativa per l'insegnamento dell'inglese con AI Tutor
"""

from flask import Flask, render_template, request, jsonify
import os, sqlite3, logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from openai import OpenAI

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Database paths
DB_PROG     = "exercises.db"      # Esercizi programmazione
DB_ENGLISH  = "learning_hub.db"   # Esercizi inglese

# OpenAI client (Replit AI Integrations — no API key needed)
openai_client = OpenAI(
    api_key=os.environ.get("AI_INTEGRATIONS_OPENAI_API_KEY"),
    base_url=os.environ.get("AI_INTEGRATIONS_OPENAI_BASE_URL"),
)


# ========================================
# SEZIONE 1: UTILITÀ DATABASE
# ========================================

def get_db(path):
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    return conn


# ========================================
# SEZIONE 2: ROTTE PRINCIPALI
# ========================================

@app.route('/')
def index():
    try:
        return render_template('index.html')
    except Exception as e:
        logger.error(f"Errore index: {e}")
        return "Errore caricamento pagina", 500


# ========================================
# SEZIONE 3: API ESERCIZI PROGRAMMAZIONE
# ========================================

@app.route('/api/exercises')
def get_exercises():
    if not os.path.exists(DB_PROG):
        return jsonify({'errore': 'DB programmazione non trovato. Esegui: python init_db.py'}), 503
    try:
        categoria  = request.args.get('categoria', '').strip()
        sotto      = request.args.get('sotto', '').strip()
        difficolta = request.args.get('difficolta', '').strip()
        q          = request.args.get('q', '').strip()
        page       = max(1, int(request.args.get('page', 1)))
        per_page   = min(50, max(1, int(request.args.get('per_page', 20))))

        cond, vals = [], []
        if categoria:  cond.append("categoria = ?");  vals.append(categoria)
        if sotto:      cond.append("sotto = ?");      vals.append(sotto)
        if difficolta: cond.append("difficolta = ?"); vals.append(difficolta)
        if q:
            cond.append("(titolo LIKE ? OR testo LIKE ?)");
            vals += [f"%{q}%", f"%{q}%"]

        where  = ("WHERE " + " AND ".join(cond)) if cond else ""
        offset = (page - 1) * per_page

        conn   = get_db(DB_PROG)
        totale = conn.execute(f"SELECT COUNT(*) FROM esercizi {where}", vals).fetchone()[0]
        righe  = conn.execute(
            f"SELECT id,categoria,sotto,difficolta,titolo,testo,soluzione FROM esercizi {where} ORDER BY id LIMIT ? OFFSET ?",
            vals + [per_page, offset]
        ).fetchall()
        conn.close()

        return jsonify({
            'esercizi':   [dict(r) for r in righe],
            'totale':     totale,
            'page':       page,
            'per_page':   per_page,
            'pagine_tot': -(-totale // per_page)
        })
    except Exception as e:
        logger.error(f"get_exercises: {e}")
        return jsonify({'errore': str(e)}), 500


@app.route('/api/exercises/categories')
def get_exercise_categories():
    if not os.path.exists(DB_PROG):
        return jsonify({'errore': 'DB non trovato'}), 503
    try:
        conn = get_db(DB_PROG)
        categorie  = [r[0] for r in conn.execute("SELECT DISTINCT categoria FROM esercizi ORDER BY categoria")]
        sottocats  = [r[0] for r in conn.execute("SELECT DISTINCT sotto    FROM esercizi ORDER BY sotto")]
        difficolta = [r[0] for r in conn.execute("SELECT DISTINCT difficolta FROM esercizi ORDER BY difficolta")]
        totale     = conn.execute("SELECT COUNT(*) FROM esercizi").fetchone()[0]
        conn.close()
        return jsonify({'categorie': categorie, 'sottocats': sottocats, 'difficolta': difficolta, 'totale': totale})
    except Exception as e:
        return jsonify({'errore': str(e)}), 500


@app.route('/api/exercises/<int:eid>')
def get_exercise(eid):
    if not os.path.exists(DB_PROG):
        return jsonify({'errore': 'DB non trovato'}), 503
    try:
        conn = get_db(DB_PROG)
        riga = conn.execute("SELECT * FROM esercizi WHERE id = ?", (eid,)).fetchone()
        conn.close()
        if not riga:
            return jsonify({'errore': 'Esercizio non trovato'}), 404
        return jsonify(dict(riga))
    except Exception as e:
        return jsonify({'errore': str(e)}), 500


# ========================================
# SEZIONE 4: API ESERCIZI INGLESE (Hub)
# ========================================

@app.route('/api/english')
def get_english_exercises():
    """
    Esercizi inglese con paginazione e filtri.
    Params: corso, argomento, livello, q, page, per_page
    """
    if not os.path.exists(DB_ENGLISH):
        return jsonify({'errore': 'DB inglese non trovato. Esegui: python init_english_db.py'}), 503
    try:
        corso    = request.args.get('corso',    '').strip()
        argomento= request.args.get('argomento','').strip()
        livello  = request.args.get('livello',  '').strip()
        q        = request.args.get('q',        '').strip()
        page     = max(1, int(request.args.get('page', 1)))
        per_page = min(50, max(1, int(request.args.get('per_page', 20))))

        cond, vals = [], []
        if corso:     cond.append("corso = ?");     vals.append(corso)
        if argomento: cond.append("argomento = ?"); vals.append(argomento)
        if livello:   cond.append("livello = ?");   vals.append(livello)
        if q:
            cond.append("(testo LIKE ? OR argomento LIKE ?)")
            vals += [f"%{q}%", f"%{q}%"]

        where  = ("WHERE " + " AND ".join(cond)) if cond else ""
        offset = (page - 1) * per_page

        conn   = get_db(DB_ENGLISH)
        totale = conn.execute(f"SELECT COUNT(*) FROM esercizi {where}", vals).fetchone()[0]
        righe  = conn.execute(
            f"SELECT id,corso,argomento,livello,testo,soluzione FROM esercizi {where} ORDER BY id LIMIT ? OFFSET ?",
            vals + [per_page, offset]
        ).fetchall()
        conn.close()

        return jsonify({
            'esercizi':   [dict(r) for r in righe],
            'totale':     totale,
            'page':       page,
            'per_page':   per_page,
            'pagine_tot': -(-totale // per_page)
        })
    except Exception as e:
        logger.error(f"get_english: {e}")
        return jsonify({'errore': str(e)}), 500


@app.route('/api/english/courses')
def get_english_courses():
    """Lista corsi, argomenti e totale esercizi."""
    if not os.path.exists(DB_ENGLISH):
        return jsonify({'errore': 'DB inglese non trovato'}), 503
    try:
        conn   = get_db(DB_ENGLISH)
        corsi  = [r[0] for r in conn.execute("SELECT DISTINCT corso FROM esercizi ORDER BY corso")]
        args   = [r[0] for r in conn.execute("SELECT DISTINCT argomento FROM esercizi ORDER BY argomento")]
        totale = conn.execute("SELECT COUNT(*) FROM esercizi").fetchone()[0]
        # Conta per corso
        conteggi = {}
        for row in conn.execute("SELECT corso, COUNT(*) FROM esercizi GROUP BY corso"):
            conteggi[row[0]] = row[1]
        conn.close()
        return jsonify({'corsi': corsi, 'argomenti': args, 'totale': totale, 'conteggi': conteggi})
    except Exception as e:
        return jsonify({'errore': str(e)}), 500


# ========================================
# SEZIONE 5: AI TUTOR (OpenAI)
# ========================================

@app.route('/api/ai-tutor', methods=['POST'])
def ai_tutor():
    """
    Riceve: { esercizio: str, domanda: str, cronologia: [...] }
    Risponde con spiegazione grammaticale senza dare la soluzione.
    """
    try:
        data      = request.json or {}
        esercizio = data.get('esercizio', '').strip()
        domanda   = data.get('domanda', '').strip()
        cronologia= data.get('cronologia', [])  # lista di {role, content}

        if not domanda:
            return jsonify({'errore': 'Domanda mancante'}), 400

        # Sistema: tutor che spiega senza dare la risposta
        system_prompt = (
            "Sei un tutor di inglese esperto e paziente. "
            "Il tuo compito è spiegare le regole grammaticali, il vocabolario e i concetti "
            "legati all'esercizio fornito dallo studente, senza mai dare direttamente la soluzione. "
            "Usa esempi chiari, spiega il 'perché' dietro la regola e incoraggia lo studente a ragionare. "
            "Rispondi sempre in italiano, a meno che lo studente non scriva in inglese. "
            "Sii conciso: massimo 3-4 frasi per risposta. Non usare markdown eccessivo."
        )

        messaggi = [{"role": "system", "content": system_prompt}]

        # Aggiungi il contesto dell'esercizio
        if esercizio:
            messaggi.append({
                "role": "user",
                "content": f"Sto lavorando su questo esercizio:\n\n«{esercizio}»"
            })
            messaggi.append({
                "role": "assistant",
                "content": "Perfetto! Sono qui per aiutarti a capire la regola grammaticale. Cosa vorresti sapere?"
            })

        # Cronologia conversazione precedente
        for msg in cronologia[-6:]:  # max 6 messaggi precedenti per token
            if msg.get('role') in ('user', 'assistant') and msg.get('content'):
                messaggi.append({"role": msg['role'], "content": msg['content']})

        # Nuova domanda dello studente
        messaggi.append({"role": "user", "content": domanda})

        risposta = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messaggi,
            max_tokens=300,
            temperature=0.7,
        )

        testo = risposta.choices[0].message.content.strip()
        return jsonify({'risposta': testo})

    except Exception as e:
        logger.error(f"AI Tutor errore: {e}")
        return jsonify({'errore': f'Errore AI Tutor: {str(e)}'}), 500


# ========================================
# SEZIONE 6: API CONTATTI
# ========================================

@app.route('/api/contact', methods=['POST'])
def send_contact():
    try:
        data      = request.json or {}
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
            msg['From'] = email; msg['To'] = email_dest
            msg['Subject'] = f"Nuovo messaggio da {nome}"
            msg.attach(MIMEText(corpo, 'plain', 'utf-8'))
            server.send_message(msg); server.quit()
            return jsonify({'success': True, 'message': 'Messaggio inviato'})
        except Exception as e:
            logger.error(f"SMTP: {e}")
            return jsonify({'success': False, 'message': 'Errore invio email'}), 500
    except Exception as e:
        logger.error(f"contact: {e}")
        return jsonify({'success': False, 'message': 'Errore interno'}), 500


# ========================================
# SEZIONE 7: GESTIONE ERRORI + AVVIO
# ========================================

@app.errorhandler(404)
def non_trovato(e): return jsonify({'error': 'Non trovato'}), 404

@app.errorhandler(500)
def errore_interno(e): return jsonify({'error': 'Errore interno'}), 500


if __name__ == "__main__":
    for db, script in [(DB_PROG, 'init_db.py'), (DB_ENGLISH, 'init_english_db.py')]:
        if not os.path.exists(db):
            logger.warning(f"DB {db} mancante. Esegui: python {script}")
    porta = int(os.environ.get("PORT", 5000))
    logger.info(f"Avvio English Academy su porta {porta}")
    app.run(host='0.0.0.0', port=porta, debug=os.environ.get("DEBUG") == "True")
