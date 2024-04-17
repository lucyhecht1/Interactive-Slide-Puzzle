import json
import math
import random
from flask import Flask, url_for
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

# list of descriptions for each step
description = ["Move the '1' to the top left corner",
               "Move the '3' to the top center position",
               "Place the  2 in the center of the entire board",
               "Now you can move  the 2 and 3 around to be in order in the top row",
               "Use the Stack and Slide Strategy! Start by moving the 7 to the middle of the first column",
               "Now place the 4 in the center of the entire board",
               "Now you can move  the 7 and 4 around to be in order in the first column",
               "Shuffle around the last 4 boxes and you are done!"]

INIT_LAYOUT = [6, 4, 7, 8, 5, 0, 3, 2, 1]
# stores the layout of the puzzle at all times
layout = INIT_LAYOUT


def to2D():
    return [layout[:3], layout[3:6], layout[6:]]


# function which returns a list of the index's surrounding the empty tile
def surroundingPieces(index):
    DIMENSION = 3
    x = index % DIMENSION
    y = math.floor(index / DIMENSION)

    left = None if x == 0 else index - 1
    up = None if y == 0 else index - DIMENSION
    right = None if x == (DIMENSION-1) else index + 1
    down = None if y == (DIMENSION-1) else index + DIMENSION

    return list(filter(None, [left, up, right, down]))


def shuffle():
    global layout
    MOVES = 20
    empty = layout.index(0)  # find initial empty index
    lastPiece = empty  # init lastPiece

    for _ in range(MOVES):
        # get surrounding pieces
        pieces = surroundingPieces(empty)

        # remove the last piece we moved
        if lastPiece in pieces:
            pieces.remove(lastPiece)

        # select a piece
        pieceIndex = random.choice(pieces)

        # swap
        layout[empty] = layout[pieceIndex]
        lastPiece = empty  # store this piece index

        layout[pieceIndex] = 0
        empty = pieceIndex  # store new empty index


@app.route('/')
def hello_world():
    return render_template('home.html')


@app.route('/row')
def row():
    return render_template('learnRow.html')


@app.route('/col')
def col():
    return render_template('learnCol.html')


@app.route('/strategy/<int:origin_page>')
def strategy(origin_page):
    return render_template('strategy.html', origin_page=origin_page)


@app.route('/result', methods=["GET"])
def results():
    global games
    search_query = request.args.get('query', '').strip().lower()
    title_results = [
        game for game in games if search_query in game["title"].lower()]
    maker_results = [
        game for game in games if search_query in game["maker"].lower()]
    cat_results = [
        game for game in games if search_query in game["category"].lower()]
    results = {"title": title_results,
               "maker": maker_results, "cat": cat_results}
    num_matches = len(title_results) + len(maker_results) + len(cat_results)
    return render_template('search_results.html', results=results, search_query=search_query, num_matches=num_matches)


@app.route('/learn/<int:id>')
def learn(id):
    global layout
    if id == 1:
        layout = INIT_LAYOUT
    return render_template('learn.html', id=id, description=description[id-1], layout=to2D())


@app.route('/edit/<int:entry_id>')
def edit(entry_id):
    global games
    game = games[entry_id]
    return render_template('edit.html', game=game)


@app.route('/autocomplete_data')
def autocomplete_data():
    global games
    titles = [game.get('title') for game in games]
    makers = [game.get('maker') for game in games]
    cat = [game.get('category') for game in games]
    data = list(set(titles + makers + cat))
    return jsonify(data)


@app.route('/send_layout', methods=['POST'])
def send_layout():
    global layout
    data_received = request.get_json()
    data = data_received.get('layout')
    layout_1d = []
    for row in data:
        layout_1d.extend(row)
    layout = layout_1d
# Example usage:
    return jsonify({'message': 'Layout data stored successfully'})


if __name__ == '__main__':
    app.run(debug=True)
