import { Grid, CellStatusGrid } from '../types/crossword';
import { PuzzleId } from '../crosswords';

interface SavedPuzzleState {
  puzzleId: PuzzleId;
  userGrid: Grid;
  cellStatus: CellStatusGrid;
  isComplete: boolean;
  timerSeconds: number;
}

const STORAGE_KEY = 'crossword_puzzle_state_';

export const savePuzzleState = (puzzleId: PuzzleId, state: SavedPuzzleState): void => {
  localStorage.setItem(`${STORAGE_KEY}${puzzleId}`, JSON.stringify(state));
};

export const loadPuzzleState = (puzzleId: PuzzleId): SavedPuzzleState | null => {
  const savedState = localStorage.getItem(`${STORAGE_KEY}${puzzleId}`);
  if (savedState) {
    return JSON.parse(savedState);
  }
  return null;
}; 

export const clearPuzzleState = (puzzleId: PuzzleId): void => {
  localStorage.removeItem(`${STORAGE_KEY}${puzzleId}`);
};
