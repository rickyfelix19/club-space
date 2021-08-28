import React from "react";
import AppSideMenu from "../../components/app-side-menu";

const available = true;
const id = "bingo";
const title = "Bingo";
const icon = "https://image.flaticon.com/icons/png/512/1254/1254291.png";
const description =
  "Play an interactive game of bingo with your friends and yell 'BINGO!' to win";

interface IProps {
  onClose?: any;
  isOpen?: boolean;
}

const Interface = ({ onClose, isOpen }: IProps) => {
  return (
    <>
      {isOpen && (
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
            }}
          >
            Start Game
          </button>
        </AppSideMenu>
      )}
    </>
  );
};

const Applet = { id, title, icon, description, available, Interface };

export default Applet;
