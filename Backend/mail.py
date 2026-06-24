import smtplib
from email.mime.text import MIMEText

def send_alert_mail():
    # Email configuration
    sender_email = "jafriirfan36@gmail.com"
    receiver_email = "jafriirfan39@gmail.com"
    subject = "Campus Alert: Cleanliness Issue Detected"
    body = "Dear Campus Authorities,\n\nAn alert has been triggered due to a cleanliness issue detected in one of the monitored zones. Please take immediate action to address the situation.\n\nBest regards,\nSwactha Dashboard"

    # Create the email message
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = receiver_email
    # Send the email
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(sender_email, "voxa bpzs itck griy")  # Use an app password for Gmail
        server.send_message(msg)


