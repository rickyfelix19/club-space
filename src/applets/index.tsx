import Bingo from "./bingo";

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

const allApps: Application[] = [Bingo];

export { allApps };
