from flask import Flask, render_template, request, jsonify
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/contact', methods=['POST'])
def send_contact():
    try:
        data = request.json
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        message = data.get('message', '').strip()
        
        if not name or not email or not message:
            return jsonify({'success': False, 'message': 'Compila tutti i campi'}), 400
        
        to_email = os.environ.get('CONTACT_EMAIL', 'info@englishacademy.it')
        smtp_server = os.environ.get('SMTP_SERVER', 'localhost')
        smtp_port = int(os.environ.get('SMTP_PORT', 25))
        smtp_user = os.environ.get('SMTP_USER', '')
        smtp_password = os.environ.get('SMTP_PASSWORD', '')
        
        subject = f"Nuovo messaggio da {name}"
        body = f"""
Nuovo messaggio da: {name}
Email: {email}

Messaggio:
{message}
        """
        
        try:
            if smtp_user and smtp_password:
                server = smtplib.SMTP(smtp_server, smtp_port)
                server.starttls()
                server.login(smtp_user, smtp_password)
            else:
                server = smtplib.SMTP(smtp_server, smtp_port)
            
            msg = MIMEMultipart()
            msg['From'] = email
            msg['To'] = to_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))
            
            server.send_message(msg)
            server.quit()
            
            return jsonify({'success': True, 'message': 'Messaggio inviato'})
        except Exception as e:
            print(f"Errore SMTP: {str(e)}")
            return jsonify({'success': False, 'message': 'Errore invio email'}), 500
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
