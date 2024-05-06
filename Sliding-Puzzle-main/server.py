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
               "Move the 2 to the center of the entire board",
               "Shuffle the 2 and 3 around to be in order in the top row",
               "Move the 7 to the middle of the first column",
               "Move the 4 to the center of the entire board without moving the 7",
               "Now you can shuffle the 7 and 4 around to be in order in the first column",
               "Shuffle around the last 3 boxes and you are done!"]

why_it_works = ["We are trying to set up our board for long term success. To complete the top row, we need the 2 and the 3 to be positioned on top of each other so that they eventually can slide into their correct locations. We specifically want the 3 to be on top of the 2 so that we can slide the 3 into the right-most corner, and then the 2 gets pushed up into the middle. Hence, we call this strategy the Stack and Slide Strategy. Can you picture it?",
                "We are trying to set up our board for long term success. To complete the top row, we need the 2 and the 3 to be positioned on top of each other so that they eventually can slide into their correct locations. We specifically want the 3 to be on top of the 2 so that we can slide the 3 into the right-most corner, and then the 2 gets pushed up into the middle. Hence, we call this strategy the Stack and Slide! Can you picture it?",
                "Our tiles are all setup! All you have to do now is create an empty space so that the 3 can slide over and the 2 can slide up. Then you've completed your top row!",
                "We are similarly getting our board ready for a simple shuffle. This time, instead of stacking our two numbers, we want to position them side by side (since our goal is the column not row). If we put the 7 in the leftmost middle spot and then 4 right next to it, we will then be able to slide the 7 down and the 4 over. Hence, we call this strategy the Side and Slide! Can you picture it?",
                "We are similarly getting our board ready for a simple shuffle. This time, instead of stacking our two numbers, we want to position them side by side (since our goal is the column not row). If we put the 7 in the leftmost middle spot and then 4 right next to it, we will then be able to slide the 7 down and the 4 over. Hence, we call this strategy the Side and Slide! Can you picture it?",
                "Our tiles are all setup! All you have to do now is create an empty space so that the 7 can slide down and the 4 can slide over. Then you've completed your left column!",
                "filler", "filler"]

video = ["images/1.mp4", "images/2.mp4", "images/3.mp4", "images/4.mp4",
         "images/5.mp4", "images/6.mp4", "images/7.mp4", "images/8.mp4"]


question = ["Solve the top row in 30 seconds", "Solve the left most column in 30 seconds",
            "Solve the remainder of the puzzle in 30 seconds"]

step_layout = [[7, 6, 8, 4, 1, 3, 2, 5, 0], [1, 7, 8, 4, 6, 3, 2, 5, 0], [1, 3, 7, 4, 6, 8, 2, 5, 0],
               [1, 3, 7, 6, 2, 8, 4, 5, 0], [1, 2, 3, 6, 5,
                                             7, 4, 8, 0], [1, 2, 3, 7, 8, 5, 6, 4, 0],
               [1, 2, 3, 7, 4, 8, 6, 5, 0], [1, 2, 3, 4, 0, 8, 7, 6, 5]]

quest_layout = [[1, 2, 3, 6, 5, 7, 4, 8, 0], [1, 2, 3, 4, 0, 8, 7, 6, 5]]


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
    why_works = why_it_works[id - 2]

    return render_template('learn.html', id=id, description=description[id-1], why_it_works=why_works, video=video[id-1], layout=to2D(layout), solution=solution, lay_list=layout)


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
    global layout
    data_received = request.get_json()
    question = int(data_received.get('question'))
    quiz_results[question-1] = [False]
    time_taken = data_received.get('timeTaken')
    time[question - 1] = time_taken
    if question < 3:
        layout = list(quest_layout[question - 1])
    print(f'Question {question} failed')
    return jsonify({"message": "Failed"})


@app.route('/results')
def quizResults():
    print(quiz_results)
    return render_template('quizResults.html', time=time, quiz_results=quiz_results)


if __name__ == '__main__':
    app.run(debug=True)
