import { Grid, Direction, CellStatus, CellStatusGrid } from '../types/crossword';

// Helper function to check if there are any empty cells in the grid
const hasEmptyCells = (grid: Grid): boolean => {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (grid[row][col] !== 'blank' && grid[row][col] === '') {
        return true;
      }
    }
  }
  return false;
};

// Helper function to find the next cell in a specific row
const findCellInRow = (grid: Grid, cellStatus: CellStatusGrid, row: number, startCol: number = 0, requireEmpty: boolean): { row: number, col: number } | null => {
  for (let col = startCol; col < 5; col++) {
    if (grid[row][col] !== 'blank') {
      if (!requireEmpty || grid[row][col] === '' || cellStatus[row][col] === false) {
        return { col, row };
      }
    }
  }
  return null;
};

// Helper function to find the next cell in a specific column
const findCellInColumn = (grid: Grid, cellStatus: CellStatusGrid, col: number, startRow: number = 0, requireEmpty: boolean): { row: number, col: number } | null => {
  for (let row = startRow; row < 5; row++) {
    if (grid[row][col] !== 'blank') {
      if (!requireEmpty || grid[row][col] === '' || cellStatus[row][col] === false) {
        return { col, row };
      }
    }
  }
  return null;
};


export const findNextCell = (
  grid: Grid,
  row: number,
  col: number,
  direction: Direction,
  forward: boolean,
): { row: number; col: number } | null => {
  if (direction === 'across') {
    const nextCol = forward ? col + 1 : col - 1;
    if (nextCol >= 0 && nextCol < 5 && grid[row][nextCol] !== 'blank') {
      return { row, col: nextCol };
    }
  } else {
    const nextRow = forward ? row + 1 : row - 1;
    if (nextRow >= 0 && nextRow < 5 && grid[nextRow][col] !== 'blank') {
      return { row: nextRow, col };
    }
  }
  return null;
};

export const findNextDefinition = (
  grid: Grid,
  cellStatus: CellStatusGrid,
  currentRow: number,
  currentCol: number,
  currentDirection: Direction,
  forward: boolean = false
): { row: number; col: number; newDirection: Direction } => {
  // Check if we should look for empty cells or any non-blank cells
  const requireEmpty = hasEmptyCells(grid);

  const searchOptions = []
  for (let i = 0; i < 5; i++) {
    searchOptions.push({ row: i, col: 0, direction: 'across' });
  }
  for (let i = 0; i < 5; i++) {
    searchOptions.push({ row: 0, col: i, direction:'down' });
  }
  if (forward) {
    searchOptions.reverse();
  }

  const currentOption = {
    col: currentDirection === 'across' ? 0 : currentCol,
    row: currentDirection === 'across' ? currentRow : 0,
    direction: currentDirection,
  }
  const currentOptionIndex = searchOptions.findIndex(option => option.row === currentOption.row && option.col === currentOption.col && option.direction === currentOption.direction);

  if (currentOptionIndex === -1) {
  } else {
    for (let i = currentOptionIndex + 1; i < searchOptions.length; i++) {
      const currentOption = searchOptions[i];
      const found = currentOption.direction === 'across'
        ? findCellInRow(grid, cellStatus, currentOption.row, currentOption.col, requireEmpty)
        : findCellInColumn(grid, cellStatus, currentOption.col, currentOption.row, requireEmpty);
      if (found !== null) {
        return { row: found.row, col: found.col, newDirection: currentOption.direction as Direction };
      }
    }

    for (let i = 0; i < currentOptionIndex; i++) {
      const currentOption = searchOptions[i];
      const found = currentOption.direction === 'across'
        ? findCellInRow(grid, cellStatus, currentOption.row, currentOption.col, requireEmpty)
        : findCellInColumn(grid, cellStatus, currentOption.col, currentOption.row, requireEmpty);
      if (found !== null) {
        return { row: found.row, col: found.col, newDirection: currentOption.direction as Direction };
      }
    }
  }

  // No definitions found, move to the next definition
  const nextDefinition = searchOptions[(currentOptionIndex + 1) % searchOptions.length];
  return { row: nextDefinition.row, col: nextDefinition.col, newDirection: nextDefinition.direction as Direction };
};

export const handleArrowNavigation = (
  key: string,
  direction: Direction,
  row: number,
  col: number,
  grid: Grid
): { newDirection?: Direction; newPosition?: { row: number; col: number } } => {
  let newDirection = direction;
  let newPosition: { row: number; col: number } | undefined;

  switch (key) {
    case 'ArrowLeft':
      newDirection = 'across';
      newPosition = findNextCell(grid, row, col, 'across', true) || undefined;
      break;
    case 'ArrowRight':
      newDirection = 'across';
      newPosition = findNextCell(grid, row, col, 'across', false) || undefined;
      break;
    case 'ArrowUp':
      newDirection = 'down';
      newPosition = findNextCell(grid, row, col, 'down', false) || undefined;
      break;
    case 'ArrowDown':
      newDirection = 'down';
      newPosition = findNextCell(grid, row, col, 'down', true) || undefined;
      break;
  }

  return { newDirection, newPosition };
}; 