import Bingo from "./bingo";
import HandTracking from "./hand-tracking";
import VoiceRecognition from "./voice-recognition";
import FaceTracking from "./face-recognition";
import PingPong from "./ping-pong";
import Sea from "./sea";
import Humanity from "./humanity";

export type Application = {
  id: string;
  available: boolean;
  title: string;
  description: string;
  icon: string;
  Interface: ({
    onClose,
    isOpen,
    onOpen,
  }: {
    onClose: any;
    isOpen?: boolean;
    onOpen?: any;
  }) => JSX.Element;
};

const allApps: Application[] = [
  Bingo,
  VoiceRecognition,
  FaceTracking,
  HandTracking,
  PingPong,
  Sea,
  Humanity,
];

export { allApps };
