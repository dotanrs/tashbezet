import { Grid, Direction } from '../types/crossword';

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
const findCellInRow = (grid: Grid, row: number, startCol: number = 0, requireEmpty: boolean): number | null => {
  for (let col = startCol; col < 5; col++) {
    if (grid[row][col] !== 'blank') {
      if (!requireEmpty || grid[row][col] === '') {
        return col;
      }
    }
  }
  return null;
};

// Helper function to find the next cell in a specific column
const findCellInColumn = (grid: Grid, col: number, startRow: number = 0, requireEmpty: boolean): number | null => {
  for (let row = startRow; row < 5; row++) {
    if (grid[row][col] !== 'blank') {
      if (!requireEmpty || grid[row][col] === '') {
        return row;
      }
    }
  }
  return null;
};

// Find the first cell in any row after the given row
const findFirstInRows = (grid: Grid, afterRow: number = -1, requireEmpty: boolean): { row: number, col: number } | null => {
  for (let row = afterRow + 1; row < 5; row++) {
    const col = findCellInRow(grid, row, 0, requireEmpty);
    if (col !== null) {
      return { row, col };
    }
  }
  return null;
};

// Find the first cell in any column after the given column
const findFirstInColumns = (grid: Grid, afterCol: number = -1, requireEmpty: boolean): { row: number, col: number } | null => {
  for (let col = afterCol + 1; col < 5; col++) {
    const row = findCellInColumn(grid, col, 0, requireEmpty);
    if (row !== null) {
      return { row, col };
    }
  }
  return null;
};

export const findNextCell = (
  grid: Grid,
  row: number,
  col: number,
  direction: Direction,
  forward: boolean
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
  currentRow: number,
  currentCol: number,
  currentDirection: Direction,
  forward: boolean = false
): { row: number; col: number; newDirection: Direction } => {
  // Check if we should look for empty cells or any non-blank cells
  const requireEmpty = hasEmptyCells(grid);

  // First try to find next cell in current direction
  if (currentDirection === 'across') {
    // Try next row
    const targetRow = currentRow + (forward ? -1 : 1);
    if (targetRow >= 0 && targetRow < 5) {
      const foundCol = findCellInRow(grid, targetRow, 0, requireEmpty);
      if (foundCol !== null) {
        return { row: targetRow, col: foundCol, newDirection: 'across' };
      }
    }
    
    // If no cells in next row, switch to columns
    const startCol = forward ? 4 : 0;
    const foundRow = findCellInColumn(grid, startCol, 0, requireEmpty);
    if (foundRow !== null) {
      return { row: foundRow, col: startCol, newDirection: 'down' };
    }
  } else {
    // Try next column
    const targetCol = currentCol + (forward ? -1 : 1);
    if (targetCol >= 0 && targetCol < 5) {
      const foundRow = findCellInColumn(grid, targetCol, 0, requireEmpty);
      if (foundRow !== null) {
        return { row: foundRow, col: targetCol, newDirection: 'down' };
      }
    }
    
    // If no cells in next column, switch to rows
    const startRow = forward ? 4 : 0;
    const foundCol = findCellInRow(grid, startRow, 0, requireEmpty);
    if (foundCol !== null) {
      return { row: startRow, col: foundCol, newDirection: 'across' };
    }
  }

  // If no cells found in preferred direction, search all remaining cells
  let result = null;
  if (currentDirection === 'across') {
    // Search remaining rows first
    result = findFirstInRows(grid, currentRow, requireEmpty);
    if (!result) {
      // Then try all columns
      result = findFirstInColumns(grid, -1, requireEmpty);
      if (result) {
        return { ...result, newDirection: 'down' };
      }
    } else {
      return { ...result, newDirection: 'across' };
    }
  } else {
    // Search remaining columns first
    result = findFirstInColumns(grid, currentCol, requireEmpty);
    if (!result) {
      // Then try all rows
      result = findFirstInRows(grid, -1, requireEmpty);
      if (result) {
        return { ...result, newDirection: 'across' };
      }
    } else {
      return { ...result, newDirection: 'down' };
    }
  }

  // If no cells found with current requirement, and we were looking for empty cells,
  // try again without requiring empty cells
  if (requireEmpty) {
    return findNextDefinition(grid, currentRow, currentCol, currentDirection, forward);
  }

  // If no cells found anywhere, return to start
  const firstCol = findCellInRow(grid, 0, 0, false);
  if (firstCol !== null) {
    return { row: 0, col: firstCol, newDirection: 'across' };
  }
  return { row: 0, col: 0, newDirection: 'across' };  // Fallback if grid is all blank
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