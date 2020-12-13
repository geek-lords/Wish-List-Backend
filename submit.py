import logging

from connection_manager import connection
from exceptions import InvalidInput


def submit(country, wishes):
    if len(wishes) != 3:
        raise InvalidInput

    with connection() as conn, conn.cursor() as cur:
        if not _country_exists(country, cur):
            raise InvalidInput

        if not _wishes_exist(wishes, cur):
            raise InvalidInput

        for wish in wishes:
            cur.execute(
                'insert into country_wish(country_id, wish_id, count) '
                'values (%s, %s, 1) '
                'on duplicate key update '
                'count = count + 1',
                (country, wish,)
            )

        wishes_in_same_country = _wishes_in_same_country(country, wishes, cur)
        wishes_world_wide = _wishes_world_wide(wishes, cur)

        conn.commit()

        return wishes_in_same_country, wishes_world_wide


def _wishes_in_same_country(country, wishes, cur):
    cur.execute(
        'select coalesce(sum(count), 0) '
        'from country_wish '
        'where country_id = %s',
        (country,)
    )

    # Sum returns a decimal which cannot be parsed by json.
    # Json can parse a float. So using float
    total_count = float(cur.fetchone()[0])

    gifts_in_same_country = {}

    for wish in wishes:
        cur.execute(
            'select coalesce(sum(count), 0) '
            'from country_wish '
            'where wish_id = %s '
            'and country_id = %s',
            (wish, country)
        )
        # Sum returns a decimal which cannot be parsed by json.
        # Json can parse a float. So using float
        wish_count = float(cur.fetchone()[0])

        gifts_in_same_country[wish] = wish_count / total_count * 100

    return gifts_in_same_country


def _wishes_world_wide(wishes, cur):
    cur.execute(
        'select coalesce(sum(count), 0) '
        'from country_wish '
    )
    # Sum returns a decimal which cannot be parsed by json.
    # Json can parse a float. So using float
    total_count = float(cur.fetchone()[0])

    gifts_world_wide = {}

    for wish in wishes:
        cur.execute(
            'select coalesce(sum(count), 0) '
            'from country_wish '
            'where wish_id = %s ',
            (wish,)
        )
        # Sum returns a decimal which cannot be parsed by json.
        # Json can parse a float. So using float
        wish_count = float(cur.fetchone()[0])

        gifts_world_wide[wish] = wish_count / total_count * 100

    return gifts_world_wide


def _country_exists(country, cur):
    cur.execute(
        'select name from country where id = %s',
        (country,)
    )

    return cur.rowcount == 1


def _wishes_exist(wishes, cur):
    cur.execute(
        'select name from wish where id in %s',
        (wishes,)
    )

    return cur.rowcount == 3


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG, format='%(levelname)s %(name)s %(asctime)s %(message)s')
    print(submit(1, [1, 2, 3]))
