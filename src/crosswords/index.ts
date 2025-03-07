import { puzzle1 } from './puzzle1';
import { puzzle2 } from './puzzle2';
import { puzzle3 } from './puzzle3';
export const puzzles = {
  puzzle1,
  puzzle2,
  puzzle3,
};

export type PuzzleId = keyof typeof puzzles; 