import { SavedPuzzles, SavedPuzzleState, Grid } from '../types/crossword';
import { puzzles, PuzzleId } from '../crosswords';

const STORAGE_KEY = 'crossword_puzzles';

// Helper function to validate grid against puzzle definition
const validateGrid = (userGrid: Grid, puzzleGrid: Grid): boolean => {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      // If puzzle has a blank cell, user grid should have a blank cell
      if (puzzleGrid[row][col] === 'blank' && userGrid[row][col] !== 'blank') {
        console.error('Invalid saved state: blank cell mismatch');
        return false;
      }
      // If puzzle has a letter, user grid should have either the same letter or be empty
      if (puzzleGrid[row][col] !== 'blank' && 
          userGrid[row][col] !== '' && 
          userGrid[row][col] !== puzzleGrid[row][col]) {
        console.error('Invalid saved state: letter mismatch');
        return false;
      }
    }
  }
  return true;
};

// Helper function to convert grid for storage
const gridToStorage = (grid: Grid): Grid => {
  return grid.map(row => 
    row.map(cell => cell === 'blank' ? 'blank' : cell)
  );
};

// Helper function to convert grid from storage
const gridFromStorage = (grid: Grid): Grid => {
  return grid.map(row => 
    row.map(cell => cell === 'blank' ? 'blank' : cell)
  );
};

export const loadSavedPuzzles = (): SavedPuzzles => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Validate and convert all grids in the saved state
      Object.keys(parsed).forEach(puzzleId => {
        if (parsed[puzzleId] && parsed[puzzleId].userGrid) {
          const puzzle = puzzles[puzzleId as PuzzleId];
          if (puzzle) {
            parsed[puzzleId].userGrid = gridFromStorage(parsed[puzzleId].userGrid);
            // Validate the grid against the puzzle definition
            if (!validateGrid(parsed[puzzleId].userGrid, puzzle.grid)) {
              console.error(`Invalid saved state for puzzle ${puzzleId}, resetting to initial state`);
              delete parsed[puzzleId];
            }
          } else {
            console.error(`Puzzle ${puzzleId} not found in definitions, removing from storage`);
            delete parsed[puzzleId];
          }
        }
      });
      return parsed;
    } catch (e) {
      console.error('Error loading saved puzzles:', e);
      return {};
    }
  }
  return {};
};

export const savePuzzleState = (puzzleId: PuzzleId, state: SavedPuzzleState) => {
  if (!state || !state.userGrid) return;
  
  const saved = loadSavedPuzzles();
  saved[puzzleId] = {
    ...state,
    puzzleId,
    userGrid: gridToStorage(state.userGrid)
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
};

export const loadPuzzleState = (puzzleId: PuzzleId): SavedPuzzleState | null => {
  const saved = loadSavedPuzzles();
  return saved[puzzleId] || null;
}; 