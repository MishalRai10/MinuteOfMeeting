from flask import Blueprint, request, jsonify, current_app
import base64
import requests

email_bp = Blueprint('email', __name__)

@email_bp.route('/send-email', methods=['POST'])
def send_email():
    try:
        emails = request.form.get('emails').split(',')
        subject = request.form.get('subject')
        message = request.form.get('message')
        attachment = request.files.get('attachment')

        payload = {
            "from": {
                "email": "mishalkulung10@gmail.com",
                "name": "Mishal Rai"
            },
            "to": [{"email": email.strip()} for email in emails],
            "subject": subject,
            "text": message,
        }

        if attachment:
            payload["attachments"] = [
                {
                    "content": base64.b64encode(attachment.read()).decode('utf-8'),
                    "filename": attachment.filename,
                    "type": attachment.content_type
                }
            ]

        headers = {
            "Authorization": f"Bearer {current_app.config['MAILTRAP_API_KEY']}",
            "Content-Type": "application/json"
        }

        response = requests.post(
            "https://sandbox.api.mailtrap.io/api/send/3596086",
            json=payload,
            headers=headers
        )

        if response.status_code == 200:
            return jsonify(success=True, message="Email sent successfully!")
        return jsonify(success=False, message="Failed to send email", error=response.text), 500

    except Exception as e:
        return jsonify(success=False, message=str(e)), 500