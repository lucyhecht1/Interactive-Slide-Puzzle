import json
from flask import Flask, url_for
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

# list of descriptions for each step
description = ["Move the '1' to the top left corner",
               "Move the '3' to the top center position", 3, 4, 5, 6]

# stores the layout of the puzzle at all times
layout = [[6, 4, 7], [8, 5, 0], [3, 2, 1]]


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

    return render_template('learn.html', id=id, description=description[id-1], layout=layout)


@app.route('/edit/<int:entry_id>')
def edit(entry_id):
    global games
    game = games[entry_id]
    return render_template('edit.html', game=game)


@app.route('/send_layout', methods=['POST'])
def send_layout():
    global layout
    data_received = request.get_json()
    data = data_received.get('layout')
    layout = data
# Example usage:
    return jsonify({'message': 'Layout data stored successfully'})


if __name__ == '__main__':
    app.run(debug=True)
