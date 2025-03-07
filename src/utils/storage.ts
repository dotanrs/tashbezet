import { SavedPuzzles, SavedPuzzleState } from '../types/crossword';

const STORAGE_KEY = 'crossword_puzzles';

export const loadSavedPuzzles = (): SavedPuzzles => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved puzzles:', e);
      return {};
    }
  }
  return {};
};

export const savePuzzleState = (puzzleId: string, state: SavedPuzzleState) => {
  const saved = loadSavedPuzzles();
  saved[puzzleId] = state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
};

export const loadPuzzleState = (puzzleId: string): SavedPuzzleState | null => {
  const saved = loadSavedPuzzles();
  return saved[puzzleId] || null;
}; 