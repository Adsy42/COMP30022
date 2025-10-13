"""Email service for sending escalation notifications."""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from flask import current_app


class EmailService:
    """Service for sending email notifications."""

    @staticmethod
    def send_escalation_email(recipient_email, chat_data, attachments=None):
        """
        Send escalation email to legal team.

        Args:
            recipient_email: Recipient email address
            chat_data: Dictionary containing chat session data
            attachments: List of file paths to attach (optional)

        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            # Create message
            msg = MIMEMultipart()
            msg["From"] = current_app.config["EMAIL_USER"]
            msg["To"] = recipient_email
            msg["Subject"] = f"New Query Escalation - Chat {chat_data.get('chat_id', 'N/A')}"

            # Email body
            body = EmailService._format_escalation_body(chat_data)
            msg.attach(MIMEText(body, "html"))

            # Attach files if provided
            if attachments:
                for file_path in attachments:
                    try:
                        with open(file_path, "rb") as f:
                            part = MIMEBase("application", "octet-stream")
                            part.set_payload(f.read())
                            encoders.encode_base64(part)
                            filename = file_path.split("/")[-1]
                            part.add_header(
                                "Content-Disposition",
                                f"attachment; filename= {filename}",
                            )
                            msg.attach(part)
                    except Exception as e:
                        current_app.logger.error(f"Failed to attach file {file_path}: {str(e)}")

            # Send email
            with smtplib.SMTP(
                current_app.config["SMTP_SERVER"],
                current_app.config["SMTP_PORT"],
            ) as server:
                if current_app.config.get("EMAIL_USE_TLS", True):
                    server.starttls()
                server.login(
                    current_app.config["EMAIL_USER"],
                    current_app.config["EMAIL_PASSWORD"],
                )
                server.send_message(msg)

            current_app.logger.info(f"Escalation email sent to {recipient_email}")
            return True

        except Exception as e:
            current_app.logger.error(f"Failed to send escalation email: {str(e)}")
            return False

    @staticmethod
    def _format_escalation_body(chat_data):
        """Format email body with chat data."""
        chat_id = chat_data.get("chat_id", "N/A")
        status = chat_data.get("status", "N/A")
        escalation_reason = chat_data.get("escalation_reason", "No reason provided")
        created_at = chat_data.get("created_at", "N/A")

        # Format answers
        common_answers = chat_data.get("common_answers", [])
        template_answers = chat_data.get("template_answers", [])

        common_html = "<br>".join(
            [f"<strong>{a.get('q_id')}:</strong> {a.get('ans')}" for a in common_answers]
        )
        template_html = "<br>".join(
            [f"<strong>{a.get('q_id')}:</strong> {a.get('ans')}" for a in template_answers]
        )

        html = f"""
        <html>
        <body>
            <h2>Query Escalation Notification</h2>
            <p>A new query has been escalated and requires legal team attention.</p>

            <h3>Chat Information</h3>
            <p><strong>Chat ID:</strong> {chat_id}</p>
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Created:</strong> {created_at}</p>
            <p><strong>Escalation Reason:</strong> {escalation_reason}</p>

            <h3>Common Answers</h3>
            <p>{common_html if common_html else "No common answers provided"}</p>

            <h3>Template Answers</h3>
            <p>{template_html if template_html else "No template answers provided"}</p>

            <h3>Attachments</h3>
            <p>{len(chat_data.get('attachments', []))} file(s) attached</p>

            <hr>
            <p><small>This is an automated message from the Legal AI Query System.</small></p>
        </body>
        </html>
        """
        return html
