from connection_manager import connection


class Country:
    def __init__(self, id, name):
        self.id = id
        self.name = name

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name
        }


def countries():
    with connection() as conn, conn.cursor() as cur:
        cur.execute('select id, name from country')

        result = []

        for id, name in cur.fetchall():
            result.append(Country(id, name))

        return result


if __name__ == '__main__':
    print(countries())
