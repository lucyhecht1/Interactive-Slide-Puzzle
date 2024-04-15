import json
from flask import Flask, url_for
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

# list of descriptions for each step
description = [1, 2, 3, 4, 5, 6]

# stores the layout of the puzzle at all times
layout = [[6, 4, 7], [8, 5, None], [3, 2, 1]]


@app.route('/')
def hello_world():
    return render_template('home.html')

@app.route('/row')
def row():
    return render_template('learnRow.html')

@app.route('/col')
def col():
    return render_template('learnCol.html')



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

    return render_template('learn.html', id=id, description=description[id-1], layout=layout)


@app.route('/edit/<int:entry_id>')
def edit(entry_id):
    global games
    game = games[entry_id]
    return render_template('edit.html', game=game)


@app.route('/add')
def add():
    return render_template('add.html')


@app.route('/autocomplete_data')
def autocomplete_data():
    global games
    titles = [game.get('title') for game in games]
    makers = [game.get('maker') for game in games]
    cat = [game.get('category') for game in games]
    data = list(set(titles + makers + cat))
    return jsonify(data)


@app.route('/send_game', methods=['GET'])
def send_game():
    global games
    id = int(request.args.get("id"))
    return jsonify(games[id])


@app.route('/add_game', methods=['POST'])
def add_game():
    global games
    data = request.get_json()
    same_games = [game["id"]
                  for game in games if data["maker"].lower() == game["maker"].lower()]
    for id in same_games:
        games[id]["same_maker_games"].append(len(games))

    steps = data["rules"].split(",")

    new_game = {"id": len(games), "title": data["title"], "image": data["image"], "year": data["year"],
                "description": data["description"], "maker": data["maker"], "player_number": data["players"],
                "time": data["time"], "category": data["category"], "steps": steps, "same_maker_games": same_games}
    games.append(new_game)
    return jsonify(new_game["id"])


@app.route('/edit_game', methods=['POST'])
def edit_game():
    global games
    data = request.get_json()
    same_games = [game["id"]
                  for game in games if data["maker"].lower() == game["maker"].lower() and data["id"] != game["id"]]
    steps = data["rules"].split(",")

    for id in same_games:
        if int(data["id"]) not in games[id]["same_maker_games"]:
            games[id]["same_maker_games"].append(int(data["id"]))

    edited_game = {"id": int(data["id"]), "title": data["title"], "image": data["image"], "year": data["year"],
                   "description": data["description"], "maker": data["maker"], "player_number": data["players"],
                   "time": data["time"], "category": data["category"], "steps": steps, "same_maker_games": same_games}
    games[int(data["id"])] = edited_game

    return jsonify(edited_game["id"])


if __name__ == '__main__':
    app.run(debug=True)
