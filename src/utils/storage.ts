import { SavedPuzzleState } from '../types/crossword';
import { PuzzleId } from '../crosswords';

const getStorageKey = (puzzleId: PuzzleId) => `crossword_puzzle_${puzzleId}`;

export const savePuzzleState = (puzzleId: PuzzleId, state: SavedPuzzleState) => {
  if (!state || !state.userGrid) return;
  
  localStorage.setItem(getStorageKey(puzzleId), JSON.stringify({
    ...state,
    puzzleId
  }));
};

export const loadPuzzleState = (puzzleId: PuzzleId): SavedPuzzleState | null => {
  const saved = localStorage.getItem(getStorageKey(puzzleId));
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(`Error loading puzzle state for ${puzzleId}:`, e);
      return null;
    }
  }
  return null;
}; 