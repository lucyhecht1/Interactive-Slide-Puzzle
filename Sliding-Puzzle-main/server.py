import json
import math
import random
from flask import Flask, url_for
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

# list of descriptions for each step
description = ["Move the 1 to the top left corner",
               "Move the 3 to the top center position",
               "Place the  2 in the center of the entire board",
               "Use the Stack and Slide Strategy! shuffle the 2 and 3 around to be in order in the top row",
               "Use the Stack and Slide Strategy! Start by moving the 7 to the middle of the first column",
               "Now place the 4 in the center of the entire board without moving the 7",
               "Now you can move  the 7 and 4 around to be in order in the first column",
               "Shuffle around the last 3 boxes and you are done!"]

question = ["Solve the top row in 60 seconds", "Solve the left most column",
            "Solve the remainder of the puzzle"]

step_layout = [[7, 6, 8, 4, 1, 3, 2, 5, 0], [1, 7, 8, 4, 6, 3, 2, 5, 0], [1, 3, 7, 4, 6, 8, 2, 5, 0],
               [1, 3, 7, 6, 2, 8, 4, 5, 0], [1, 2, 3, 6, 5,
                                             7, 4, 8, 0], [1, 2, 3, 7, 8, 5, 6, 4, 0],
               [1, 2, 3, 7, 4, 8, 6, 5, 0], [1, 2, 3, 4, 0, 8, 7, 6, 5]]

INIT_LAYOUT = [6, 4, 7, 8, 5, 0, 3, 2, 1]
goal = [1, 2, 3, 4, 5, 6, 7, 8, 0]
# stores the layout of the puzzle at all times
layout = list(INIT_LAYOUT)

quiz_results = [None, None, None]
time = [0, 0, 0]
solution = []


def to2D(layout_list):
    return [layout_list[:3], layout_list[3:6], layout_list[6:]]


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


def shuffle(moves):
    global layout
    global solution
    empty = layout.index(0)  # find initial empty index
    lastPiece = empty  # init lastPiece
    solution.clear()
    for _ in range(moves):
        # get surrounding pieces
        pieces = surroundingPieces(empty)

        # remove the last piece we moved
        if lastPiece in pieces:
            pieces.remove(lastPiece)

        # select a piece
        pieceIndex = random.choice(pieces)

        solution.insert(0, layout[pieceIndex])

        # swap
        layout[empty] = layout[pieceIndex]
        lastPiece = empty  # store this piece index

        layout[pieceIndex] = 0
        empty = pieceIndex  # store new empty index


@app.route('/')
def hello_world():
    global solution
    global layout
    layout = list(goal)
    shuffle(15)
    lay_list = list(layout)
    return render_template('home.html', solution=solution, lay_list=lay_list)


@app.route('/row')
def row():
    return render_template('learnRow.html')


@app.route('/col')
def col():
    return render_template('learnCol.html')


@app.route('/practice')
def practice():
    global layout
    layout = list(step_layout[0])
    shuffle(6)
    return render_template('practice.html', layout=to2D(layout))


@app.route('/strategy/<int:origin_page>')
def strategy(origin_page):
    return render_template('strategy.html', origin_page=origin_page)


@app.route('/quiz/<int:question_num>')
def quiz(question_num):
    global layout
    if question_num == 1:
        layout = list(INIT_LAYOUT)
        shuffle(15)

    return render_template('quiz.html', question=question[question_num - 1], question_num=question_num, layout=to2D(layout))


@app.route('/learn/<int:id>')
def learn(id):
    global layout
    global solution
    layout = list(step_layout[id - 1])
    return render_template('learn.html', id=id, description=description[id-1], layout=to2D(layout), solution=solution, lay_list=layout)


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


@app.route('/success-attempt', methods=['POST'])
def handle_success_attempt():
    global time
    data_received = request.get_json()
    question = int(data_received.get('question'))
    time_remaining = data_received.get('timeRemaining')
    time[question - 1] = time_remaining
    quiz_results[question-1] = [True]
    # Process the successful attempt data as needed
    # print("Successful attempt! Time remaining:", time_remaining)
    print(f'Question {question} passed')
    return jsonify({"message": "Success"})


@app.route('/failed-attempt', methods=['POST'])
def handle_failed_attempt():
    global time_taken
    data_received = request.get_json()
    question = int(data_received.get('question'))
    quiz_results[question-1] = [False]
    time_taken = data_received.get('timeTaken')
    time[question - 1] = time_taken
    # Process the failed attempt data as needed
    # print("Failed attempt! Time taken:", time_taken)
    print(f'Question {question} failed')
    return jsonify({"message": "Failed"})


@app.route('/results')
def quizResults():
    return render_template('quizResults.html', time=time, quiz_results=quiz_results)


if __name__ == '__main__':
    app.run(debug=True)
