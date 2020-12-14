from connection_manager import connection
from exceptions import InvalidInput
import logging
import os
import email_validator
from email.message import EmailMessage
from email.mime.text import MIMEText
from smtplib import SMTP_SSL, SMTPException, SMTP
from threading import Thread
from dotenv import load_dotenv
from config import EMAIL_ID, EMAIL_PASSWORD
logger = logging.getLogger(__name__)

def send_email_sync(to, subject, body, html=False):
    try:
        with SMTP_SSL('smtp.gmail.com') as smtp:
            smtp.ehlo()
            smtp.login(EMAIL_ID, EMAIL_PASSWORD)

            msg = MIMEText(body, 'plain' if not html else 'html')
            msg['Subject'] = subject
            msg['From'] = EMAIL_ID
            msg['To'] = to
            smtp.send_message(msg)
            logger.info('mail sent')
    except SMTPException as e:
        logger.critical(e)


def send_email_async(to, subject, body, html=False):
    thread = Thread(target=send_email_sync, args=[to, subject, body, html])
    thread.start()


class Email :
    def __init__(self,email):
        self.email = email


def sendNotification(emailid):
    subject = "Hell Yeah, Geek Lords got a new account."
    body = """Hello User,\n
        SHARKS, This is our email address for this project.\n
        We're planning to send Chrismas Greetings and Notifications about our Result Declaration date.\n\n
        \t\t\t\tFrom - Sarvesh Joshi 
    """
    send_email_async(emailid,subject,body)


def email(emailaddress):
    try :
        email_validator.validate_email(emailaddress)
    except email_validator.EmailNotValidError: 
        raise InvalidInput 
    with connection() as conn, conn.cursor() as cur :
        cur.execute("SELECT email_id from email where email_id = %s ",(emailaddress,))
        if cur.rowcount == 1 :
            raise InvalidInput
        cur.execute("INSERT INTO email(email_id) values (%s)",(emailaddress,))
        conn.commit()

def emailNotification():
    with connection() as conn, conn.cursor() as cur :
        cur.execute("SELECT * FROM email")
        for ids in cur : 
            sendNotification(ids[0])
            

if __name__ == "__main__":
    pass 
