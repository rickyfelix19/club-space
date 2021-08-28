import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./styles.css";
import AppSideMenu from "../../components/app-side-menu";
import axios from "axios";
import { clubCodeFromPageUrl } from "../../lib/urls";

const available = true;
const id = "bingo";
const title = "Bingo";
const icon = "https://image.flaticon.com/icons/png/512/1254/1254291.png";
const description =
  "Play an interactive game of bingo with your friends and yell 'BINGO!' to win";

interface IProps {
  onClose?: any;
  isOpen?: boolean;
  onOpen?: any;
}
const joinGame = async () => {
  const userId = await axios.post(
    "https://api.clubspace.link/bingo/join",
    {
      roomid: clubCodeFromPageUrl(),
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return userId.data;
};

const checkGameStatus = async (userId: string) => {
  const res = await axios.post(
    "https://api.clubspace.link/bingo/gameinfo",

    {
      uuid: userId,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data;
};

const triggerGameStart = async () => {
  const res = await axios.post("https://api.clubspace.link/bingo/start");
  return res.data;
};

const getCurrentNumber = async () => {
  const res = await axios.post("https://api.clubspace.link/bingo/currnumber");
  return res.data;
};

const Interface = ({ onClose, isOpen, onOpen }: IProps) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [userId, setUserId] = useState<string>();
  const [numbers, setNumbers] = useState<number[][]>([]);
  const [currentNumber, setCurrentNumber] = useState<number>();

  const fetchUser = async () => {
    const gameData = await joinGame();
    setUserId(gameData.data.uuid);
    setNumbers(gameData.data.board);
  };

  const checkGame = async () => {
    const data = await getCurrentNumber();
    if (data.data.currNum !== -1 && !gameStarted) {
      setGameStarted(true);
    } else if (data.data.currNum === -1 && gameStarted) {
      // TODO: display game over
      setGameStarted(false);
    }
    if (data.data.currNum !== currentNumber) {
      setCurrentNumber(parseInt(`${data.data.currNum}`));
    }
  };

  useEffect(() => {
    if (!userId) {
      fetchUser();
    }
    const intervalId = window.setInterval(() => {
      if (userId) {
        checkGame();
      }
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [userId]);

  return (
    <>
      {!gameStarted && isOpen && (
        <AppSideMenu
          title={title}
          onClose={() => {
            onClose && onClose();
          }}
        >
          <p>How to use:</p>
          <ul>
            <li>
              Players are automatically joined into the game when the game is
              added to server
            </li>
            <li>Pressing "Start Game" will bring up everyone's bingo card</li>
            <li>Click each square when your number is called onto the card</li>
            <li>
              When you believe you have won, yell: "BINGO!" and your card will
              be checked
            </li>
          </ul>

          <button
            onClick={() => {
              onClose && onClose();
              triggerGameStart();
              // setGameStarted(true);
            }}
          >
            Start Game
          </button>
        </AppSideMenu>
      )}
      {gameStarted && (
        <AppInterface
          onClose={() => {
            setGameStarted(false);
          }}
          numbers={numbers}
          onOpen={() => {
            onOpen && onOpen();
          }}
          isOpen={isOpen}
        />
      )}
      {currentNumber && gameStarted && (
        <DisplayNewNumber number={currentNumber} />
      )}
    </>
  );
};

const AppInterface = ({ numbers, onClose, isOpen, onOpen }: any) => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [matchedIndex, setMatchedIndex] = useState(-1);
  const [checkingWin, setCheckingWin] = useState(false);

  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true });
    console.log("Now listening...");
    return () => {
      SpeechRecognition.stopListening();
      console.log("Stopped Listening");
    };
  }, []);

  const checkCardStatus = async () => {
    setCheckingWin(true);
    setTimeout(() => {
      setCheckingWin(false);
    }, 4000);
  };

  useEffect(() => {
    if (transcript && transcript.length > 0) {
      const testWords = transcript.toLowerCase();
      const matchIndex = testWords.lastIndexOf("bingo");
      if (matchIndex !== matchedIndex) {
        console.log("BINGO!!");
        setMatchedIndex(matchIndex);
        checkCardStatus();
      }
    }
  }, [transcript]);

  return (
    <>
      <div
        className={`bingo-wrapper ${isOpen ? "open-bingo" : "close-bingo"}`}
        onClick={() => {
          !isOpen && onOpen && onOpen();
        }}
      >
        <div className="bingo-card">
          <h3 className="bingo-heading">BINGO</h3>
          <div className="number-wrapper">
            {numbers.map((row: number[]) => (
              <div className="number-row">
                {row.map((number) => (
                  <NumberDisplay number={number} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {checkingWin && <LoadingOverlay />}
    </>
  );
};

const NumberDisplay = ({ number }: any) => {
  const [selected, setSelected] = useState(false);
  return (
    <div
      onClick={() => {
        setSelected(!selected);
      }}
      className={`${number !== -1 ? "" : "free-number"} ${
        selected ? "number-selected" : ""
      }`}
    >
      {number !== -1 ? number : "FREE"}
    </div>
  );
};

const LoadingOverlay = () => {
  return (
    <div className="bingo-load">
      <div className="spinner" />
      <p>Checking Bingo</p>
    </div>
  );
};

const DisplayNewNumber = ({ number }: any) => {
  return <div className="number-display">{number}</div>;
};

const Applet = { id, title, icon, description, available, Interface };

export default Applet;
