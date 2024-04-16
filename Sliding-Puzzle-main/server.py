import json
import math
import random
from flask import Flask, url_for
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

# list of descriptions for each step
description = ["Move the '1' to the top left corner",
               "Move the '3' to the top center position", 3, 4, 5, 6]

# stores the layout of the puzzle at all times
layout = [6, 4, 7, 8, 5, 0, 3, 2, 1]


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
    MOVES = 25
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


@app.route('/learn/<int:id>')
def learn(id):

    if id == 1:
        shuffle()

    return render_template('learn.html', id=id, description=description[id-1], layout=to2D())


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
