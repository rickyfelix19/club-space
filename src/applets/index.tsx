import Bingo from "./bingo";

export type Application = {
  id: string;
  available: boolean;
  title: string;
  description: string;
  icon: string;
};

const allApps: Application[] = [Bingo];

export { allApps };
