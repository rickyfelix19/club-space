import flask
from api import gameEngine

app = flask.Flask(__name__)
game = gameEngine.BingoGameEngine(callInterval=10)

@app.route('/bingo/join', methods=['POST'])
def bingoJoin():
    retval = flask.request.get_json()
    roomId = retval["roomid"]
    playerId = game.registerPlayers()
    return {"status": "success",
                "data": {
                    "uuid": playerId,
                    "board": game.players[playerId]['board']
                },
                "message": ""
            }

@app.route('/bingo/update', methods=['POST'])
def bingoUpdate():
    retval = flask.request.get_json()
    playerId = retval["uuid"]
    x = retval["x"]
    y = retval["y"]
    newNumebr = retval["newNumebr"]
    game.updateBoard(playerId, x, y, newNumebr)
    return {"status": "success",
            "data": {
                "board": game.players[playerId]['board']
            },
            "message": "",
            }

@app.route('/bingo/gameinfo', methods=['GET'])
def bingoGameInfo():
    retval = flask.request.get_json()
    playerId = retval["uuid"]

    return {"status": "success",
            "data": game.gameInfo(),
            "message": "",
            }

@app.route('/bingo/currnumber', methods=['GET'])
def bingoCurrNum():
    return {"status": "success",
            "data": {
                "currNum": game.currNum()
            },
            "message": "",
            }

@app.route('/bingo/start', methods=['POST'])
def bingoStartGame():
    game.startGame()
    return {"status": "success",
            "data": None,
            "message": "",
            }

@app.route('/bingo/keyword', methods=['POST'])
def bingoEndGame():
    retval = flask.request.get_json()
    playerId = retval["uuid"]
    winning = game.checkWinning(playerId)
    if winning:
        return {"status": "success",
                "data": None,
                "message": "Winning is verified",
                }
    else:
        return {"status": "error",
                "code": 404,
                "data": None,
                "message": "Player did not win"
                }

@app.route('/bingo/stop', methods=['POST'])
def bingoStopGame():
    game.endGame()
    return {"status": "success",
            "data": None,
            "message": "Game Stopped",
            }