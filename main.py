from flask import Flask, request, send_from_directory

from config import DEBUG
from country import countries
from exceptions import InvalidInput
from submit import submit
from wish import create_wish, wishes

app = Flask(__name__)


@app.route('/v1/countries')
def get_countries():
    temp = countries()
    temp = list(map(lambda c: c.serialize(), temp))
    return {
        'countries': temp
    }


@app.route('/v1/wishes')
def get_wishes():
    temp = wishes()
    temp = list(map(lambda x: x.serialize(), temp))
    return {
        'wishes': temp
    }


@app.route('/v1/submit', methods=['POST'])
def clicked_submit():
    try:
        if not request.is_json:
            raise InvalidInput
        country_id = request.json['country_id']
        wishlist = request.json['wishes']
        wishes_in_same_country, wishes_worldwide = submit(country_id, wishlist)

        wishes_in_same_country = _to_json(wishes_in_same_country)
        wishes_worldwide = _to_json(wishes_worldwide)

        return {
            'wishes_in_same_country': wishes_in_same_country,
            'wishes_worldwide': wishes_worldwide
        }

    except (KeyError, InvalidInput):
        return {'error': 0}, 400, {'Content-Type': 'application/json'}


@app.route('/v1/createwish', methods=['POST'])
def createwish():
    try:
        if not request.is_json:
            raise InvalidInput
        name = request.json['name']
        return {'wish_id' : create_wish(name)}
    except (KeyError, InvalidInput):
        return {'error': 0}, 400, {'Content-Type': 'application/json'}


@app.route('/<path:path>')
def front_end_routes(path):
    return send_from_directory('static', path)


@app.route('/')
def index():
    return send_from_directory('static', 'index.html')


@app.route('/form')
def form():
    return send_from_directory('static', 'form.html')


def _to_json(gifts):
    gifts = list(map(lambda x: {'wish_id': x[0], 'percentage': x[1]}, gifts.items()))
    return gifts


if __name__ == "__main__":
    app.run(debug=DEBUG)
