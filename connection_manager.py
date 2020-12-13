import pymysql
from contextlib2 import contextmanager

from config import HOSTNAME, USER, PASSWORD, DATABASE


@contextmanager
def connection():
    conn = pymysql.connect(
        host=HOSTNAME,
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )

    try:
        yield conn
    finally:
        conn.close()
