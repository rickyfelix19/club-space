import Bingo from "./bingo";
import HandTracking from "./hand-tracking";
import VoiceRecognition from "./voice-recognition";

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

const allApps: Application[] = [Bingo, VoiceRecognition, HandTracking];

export { allApps };
