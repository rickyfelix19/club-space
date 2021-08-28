import time
from flask import Flask
from flask_restful import Api, Resource, reqparse
from flask import jsonify

# app = Flask(__name__)
# app.config["DEBUG"] == True

# @app.route('/time')
# def get_current_time():
#     return {'time': time.time()}

# @app.route('/hello')
# def hello():
#     return 'Hello, World!'
# if __name__ == '__main__':
#     app.run(debug=True)


# GET REQUESTS GET

# 1) GET game status
@app.route('/', methods=['GET'])
    
app.run()

# lists of game status: empty, ongoing, idle, finished

    # 5) GET CurrBingoNum 
@app.route('/', methods=['GET'])

app.run()

# POST REQUESTS POST/accounts

# 2) POST join game 
#/join
@app.route('/', methods=['POST'])

app.run()

# 3) POST start game
#/start
@app.route('/', methods=['POST'])

app.run()
    
# 6) POST send bingo number and position 
@app.route('/', methods=['POST'])

app.run()
    
# 4) POST win Bingo(recognized keyword Passing) 
@app.route('/', methods=['POST'])

app.run()