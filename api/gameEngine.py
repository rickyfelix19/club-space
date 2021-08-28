import random
import asyncio
import uuid

class BingoGameEngine():
    def __init__(self, callInterval, boardSize=5, playerNumber=0):
        self.gameStatus = 0
        self.playerNumber = playerNumber
        self.interval = callInterval
        self.boardSize = boardSize
        self.players = {}

    def _newBoard(self, boardSize):
        board = []
        for i in range (0, boardSize):
            new = []
            for j in range (0, boardSize):
                new.append(random.randint(0, 100))
            board.append(new)
        return board

    def registerPlayers(self):
        player_id = str(uuid.uuid4())
        self.players[player_id] = {}
        self.players[player_id]['board'] = self._newBoard(self.boardSize)
        self.playerNumber += 1
        return player_id
    
    def updateBoard(self, player, x, y, newNumebr):
        self.players[player]['board'][x][y] = newNumebr
        return

    def startGame(self):
        self.gameStatus = 1
        self.runGame(self.interval)
        return True

    def gameInfo(self):
        gameInfo = {}
        gameInfo['status'] = self.gameStatus
        gameInfo['players'] = []
        return gameInfo

    def currNumber(self):
        return self.currNumber
    
    def endGame(self):
        self.gameStatus = 0
        return

    async def runGame(self, interval):
        while self.status != 0:
            self.currNumber = random.randint(1,100)
            self.gameStatus += 1
            print(f"[Bingo] Turn{self.currNumber}: number is {self.currNumbernumber}, next number will reveal in {interval} second")
            await asyncio.sleep(interval)
        return