import random
import asyncio
import uuid
import copy

class BingoGameEngine():
    def __init__(self, callInterval=10, playerNumber=0):
        self.gameStatus = 0
        self.currNumber = -1
        self.playerNumber = playerNumber
        self.interval = callInterval
        self.boardSize = 5
        self.players = {}
        self.historyNum = []

    def _newBoard(self, boardSize):
        board = []
        for i in range (0, boardSize):
            new = []
            for j in range (0, boardSize):
                new.append(random.randint(0, 100))
            board.append(new)
        board[2][2] = -1
        return board

    def registerPlayers(self):
        playerId = str(uuid.uuid4())
        self.players[playerId] = {}
        self.players[playerId]['board'] = self._newBoard(self.boardSize)
        self.playerNumber += 1
        return playerId
    
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
        gameInfo['players'] = list(self.players.keys())
        return gameInfo
    
    def currNum(self):
        return self.currNumber
    
    def checkWinning(self, playerId):
        win = False
        board = copy.deepcopy(self.players[playerId]['board'])
        for y in range(0, self.boardSize):
            for x in range(0, self.boardSize):
                if board[x][y] in self.historyNum:
                    board[x][y] = -1
        
        if board[0][0] == board[1][1] == board[2][2] == board[3][3] == board[4][4] == -1\
            or board[0][4] == board[1][3] == board[2][2] == board[3][1] == board[4][0] == -1\
            or board[0][0] == board[0][1] == board[0][2] == board[0][3] == board[0][4] == -1\
            or board[1][0] == board[1][1] == board[1][2] == board[1][3] == board[1][4] == -1\
            or board[1][0] == board[1][1] == board[1][2] == board[1][3] == board[1][4] == -1\
            or board[2][0] == board[2][1] == board[2][2] == board[2][3] == board[2][4] == -1\
            or board[3][0] == board[3][1] == board[3][2] == board[3][3] == board[3][4] == -1\
            or board[4][0] == board[4][1] == board[4][2] == board[4][3] == board[4][4] == -1\
            or board[0][0] == board[1][0] == board[2][0] == board[3][0] == board[4][0] == -1\
            or board[0][1] == board[1][1] == board[2][1] == board[3][1] == board[4][1] == -1\
            or board[0][2] == board[1][2] == board[2][2] == board[3][2] == board[4][2] == -1\
            or board[0][3] == board[1][3] == board[2][3] == board[3][3] == board[4][3] == -1\
            or board[0][4] == board[1][4] == board[2][4] == board[3][4] == board[4][4] == -1:
            win = True
        return win
    
    def endGame(self):
        self.gameStatus = -1
        return

    async def runGame(self, interval):
        while self.status != -1:
            self.currNumber = random.randint(1,100)
            self.historyNum.append(self.currNumber)
            self.gameStatus += 1
            print(f"[Bingo] Turn{self.currNumber}: number is {self.currNumbernumber}, next number will reveal in {interval} second")
            await asyncio.sleep(interval)
        return