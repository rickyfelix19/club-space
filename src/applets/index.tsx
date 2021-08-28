import Bingo from "./bingo";
import HandTracking from "./hand-tracking";

export type Application = {
  id: string;
  available: boolean;
  title: string;
  description: string;
  icon: string;
  Interface: ({
    onClose,
    isOpen,
  }: {
    onClose: any;
    isOpen?: boolean;
  }) => JSX.Element;
};

const allApps: Application[] = [Bingo, HandTracking];

export { allApps };
