import time
from flask import Flask

app = Flask(__name__)


@app.route('/time')
def get_current_time():
    return {'time': time.time()}

# list of API needed: 

# GET 

# 1) GET game status

# 5) GET CurrBingoNum 

# POST

# 2) POST join game 

# 3) POST start game

# 4) POST win Bingo(recognized keyword Passing) 

# 6) POST send bingo number and position 

# DELETE