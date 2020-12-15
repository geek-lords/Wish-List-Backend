import re

from connection_manager import connection
from exceptions import InvalidInput


class Wish:
    def __init__(self, id, name):
        self.id = id
        self.name = name

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name
        }


def wishes():
    with connection() as conn, conn.cursor() as cur:
        cur.execute('select id, name from wish')

        result = []

        for id, name in cur.fetchall():
            result.append(Wish(id, name))

        return result


def create_wish(name):
    name.strip()

    if re.search(r'^[\w\d\s]+$', name) is None:
        raise InvalidInput

    with connection() as conn, conn.cursor() as cur:
        cur.execute('Select id from wish where name = %s ', (name,))
        if cur.rowcount == 1:
            raise InvalidInput
        cur.execute("INSERT INTO wish(name) values(%s)", (name,))
        conn.commit()
        return cur.lastrowid


if __name__ == '__main__':
    create_wish("<script></script>")
