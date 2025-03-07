import { puzzle1 } from './puzzle1';
import { puzzle2 } from './puzzle2';

export const puzzles = {
  puzzle1,
  puzzle2,
};

export type PuzzleId = keyof typeof puzzles; 