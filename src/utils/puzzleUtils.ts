import { Grid, CellStatusGrid, CrosswordConfig } from '../types/crossword';

export const createEmptyGrid = (): Grid => {
  return Array(5).fill(null).map(() => Array(5).fill(''));
};

export const createEmptyCellStatus = (): CellStatusGrid => {
  return Array(5).fill(null).map(() => Array(5).fill(null));
};

export const checkPuzzle = (userGrid: Grid, currentConfig: CrosswordConfig | null) => {
  if (!currentConfig) return {
    newCellStatus: Array(5).fill(null).map(() => Array(5).fill(null)), isCorrect: false
  };
  
  let isCorrect = true;
  const newCellStatus = Array(5).fill(null).map(() => Array(5).fill(null)) as CellStatusGrid;

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (currentConfig.grid[row][col] !== 'blank') {
        if (userGrid[row][col] !== '') {
          const cellCorrect = userGrid[row][col] === currentConfig.grid[row][col];
          newCellStatus[row][col] = cellCorrect;
          if (!cellCorrect) {
            isCorrect = false;
          }
        } else {
          isCorrect = false;
        }
      }
    }
  }
  return { newCellStatus, isCorrect };
};

export const revealPuzzle = (userGrid: Grid, cellStatus: CellStatusGrid, currentConfig: CrosswordConfig) => {
  const newGrid = [...userGrid];
  const newCellStatus = [...cellStatus];

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (currentConfig.grid[row][col] !== 'blank') {
        if (cellStatus[row][col] !== true) {
          newGrid[row][col] = currentConfig.grid[row][col];
          newCellStatus[row][col] = true;
        }
      }
    }
  }

  return { newGrid, newCellStatus };
}; 