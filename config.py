import os

from dotenv import load_dotenv

load_dotenv()

HOSTNAME = os.getenv('DB_HOSTNAME')
USER = os.getenv('DB_USERNAME')
PASSWORD = os.getenv('DB_PASSWORD')
DATABASE = os.getenv('DATABASE')
DEBUG = os.getenv('DEBUG')
EMAIL_ID = os.getenv('MAIL_USERNAME')
EMAIL_PASSWORD = os.getenv('MAIL_PASSWORD')