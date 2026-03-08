"""
ENGLISH ACADEMY - BACKEND FLASK
Applicazione educativa per l'insegnamento dell'inglese
"""

from flask import Flask, render_template, request, jsonify
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

# Configurazione logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# ========================================
# SEZIONE 1: ROTTE PRINCIPALI
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
# SEZIONE 2: API CONTATTI
# ========================================

@app.route('/api/contact', methods=['POST'])
def send_contact():
    """
    Endpoint per inviare messaggi di contatto via email
    Gestisce SMTP esterno e fallback localhost
    """
    try:
        data = request.json
        nome = data.get('name', '').strip()
        email = data.get('email', '').strip()
        messaggio = data.get('message', '').strip()
        
        # Validazione input
        if not nome or not email or not messaggio:
            logger.warning(f"Contatto incompleto: nome={nome}, email={email}")
            return jsonify({'success': False, 'message': 'Compila tutti i campi'}), 400
        
        # Validazione email basic
        if '@' not in email:
            return jsonify({'success': False, 'message': 'Email non valida'}), 400
        
        # Configurazione SMTP da env vars
        email_dest = os.environ.get('CONTACT_EMAIL', 'info@englishacademy.it')
        smtp_server = os.environ.get('SMTP_SERVER', 'localhost')
        smtp_port = int(os.environ.get('SMTP_PORT', 25))
        smtp_user = os.environ.get('SMTP_USER', '')
        smtp_password = os.environ.get('SMTP_PASSWORD', '')
        
        oggetto = f"Nuovo messaggio da {nome}"
        corpo = f"""
Nuovo messaggio da: {nome}
Email: {email}

Messaggio:
{messaggio}
        """
        
        try:
            # Connessione SMTP con autenticazione opzionale
            if smtp_user and smtp_password:
                server = smtplib.SMTP(smtp_server, smtp_port)
                server.starttls()
                server.login(smtp_user, smtp_password)
            else:
                server = smtplib.SMTP(smtp_server, smtp_port)
            
            # Creazione e invio email
            msg = MIMEMultipart()
            msg['From'] = email
            msg['To'] = email_dest
            msg['Subject'] = oggetto
            msg.attach(MIMEText(corpo, 'plain', 'utf-8'))
            
            server.send_message(msg)
            server.quit()
            
            logger.info(f"Email inviata da {email} a {email_dest}")
            return jsonify({'success': True, 'message': 'Messaggio inviato con successo'})
        
        except smtplib.SMTPAuthenticationError:
            logger.error("Errore autenticazione SMTP")
            return jsonify({'success': False, 'message': 'Errore autenticazione email'}), 500
        except smtplib.SMTPException as e:
            logger.error(f"Errore SMTP: {str(e)}")
            return jsonify({'success': False, 'message': 'Errore invio email'}), 500
        except ConnectionRefusedError:
            logger.error("Connessione SMTP rifiutata")
            return jsonify({'success': False, 'message': 'Server email non disponibile'}), 500
    
    except Exception as e:
        logger.error(f"Errore inviaContatto: {str(e)}")
        return jsonify({'success': False, 'message': 'Errore interno server'}), 500


# ========================================
# SEZIONE 3: GESTIONE ERRORI
# ========================================

@app.errorhandler(404)
def non_trovato(error):
    """Gestione errore 404"""
    return jsonify({'error': 'Pagina non trovata'}), 404


@app.errorhandler(500)
def errore_interno(error):
    """Gestione errore 500"""
    logger.error(f"Errore interno: {str(error)}")
    return jsonify({'error': 'Errore interno del server'}), 500


# ========================================
# SEZIONE 4: AVVIO SERVER
# ========================================

if __name__ == "__main__":
    porta = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("DEBUG", "False") == "True"
    
    logger.info(f"Avvio English Academy su porta {porta}")
    app.run(host='0.0.0.0', port=porta, debug=debug_mode)
