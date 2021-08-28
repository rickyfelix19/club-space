import React, { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import AppSideMenu from "../../components/app-side-menu";
import Icon from "../../components/icon";
import PopUp from "../../components/pop-up";

import "./styles.css";

const available = true;
const id = "voice-recognition";
const title = "Voice Tracking";
const icon =
  "https://icons-for-free.com/iconfiles/png/512/text+icon-1320166904007805068.png";
const description =
  "Microphone transcriber that can be enabled in games and applications to help to blend the digital world with reality";

interface IProps {
  onClose?: any;
  isOpen?: boolean;
}

const Interface = ({ onClose, isOpen }: IProps) => {
  const [appOpen, setAppOpen] = useState(false);
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
            <li>Press "Start Experience" to start transcribing;</li>
            <li>
              Close the experience by pressing the cross in the top right corner
            </li>
          </ul>

          <button
            onClick={() => {
              onClose && onClose();
              setAppOpen(true);
            }}
          >
            Start Experience
          </button>
        </AppSideMenu>
      )}
      {appOpen && (
        <PopUp>
          <AppInterface
            onClose={() => {
              setAppOpen(false);
            }}
          />
        </PopUp>
      )}
    </>
  );
};

const AppInterface = ({ onClose }: any) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  return (
    <div className="voice-wrapper">
      <div className="voice-heading">
        <p>{title}</p>
        <button
          onClick={() => {
            onClose && onClose(false);
          }}
        >
          <Icon type="cross" />
        </button>
      </div>
      <div className="voice-body">
        <div>
          <p>
            <b>Listening: {listening ? "yes" : "no"}</b>
          </p>
          {/** 
           // @ts-ignore */}
          <button onClick={SpeechRecognition.startListening}>Start</button>
          <button onClick={SpeechRecognition.stopListening}>Stop</button>
          <button onClick={resetTranscript}>Reset</button>
          <p>{transcript}</p>
        </div>
      </div>
    </div>
  );
};

const Applet = { id, title, icon, description, available, Interface };

export default Applet;
