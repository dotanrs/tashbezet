import { puzzle1 } from './puzzle1';
import { puzzle2 } from './puzzle2';
import { puzzle3 } from './puzzle3';
export const puzzles = {
  puzzle3,
  puzzle2,
  puzzle1,
};

export type PuzzleId = keyof typeof puzzles; 