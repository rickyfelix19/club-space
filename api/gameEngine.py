import random
import asyncio



class BingoGameEngine():
    def _init_(self, playerNumber, callInterval, boardSize=5):
        self.gameStatus = 0
        self.playerNumber = playerNumber
        self.interval = callInterval
        self.boardSize = boardSize
        self.players = {}

    def registerPlayers(self):
        pass
    
    def updateBoard(self, player, newBoard):
        pass

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
    
    def endGame():
        self.gameStatus = 0
        return

    async def runGame(self, interval):
        while self.status != 0:
            self.currNumber = random.randint(1,100)
            self.gameStatus += 1
            print(f"[Bingo] Turn{self.currNumber}: number is {self.currNumbernumber}, next number will reveal in {interval} second")
            await asyncio.sleep(interval)
        return