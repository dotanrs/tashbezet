import { Grid, Direction } from '../types/crossword';

export const findNextCell = (
  grid: Grid,
  row: number,
  col: number,
  direction: Direction,
  forward: boolean
): { row: number; col: number } | null => {
  let nextRow = row;
  let nextCol = col;

  if (direction === 'across') {
    nextCol = forward ? col + 1 : col - 1;
    if (nextCol < 0 || nextCol >= 5) {
      nextRow = forward ? row + 1 : row - 1;
      nextCol = forward ? 0 : 4;
    }
  } else {
    nextRow = forward ? row + 1 : row - 1;
    if (nextRow < 0 || nextRow >= 5) {
      nextCol = forward ? col + 1 : col - 1;
      nextRow = forward ? 0 : 4;
    }
  }

  if (nextRow < 0 || nextRow >= 5 || nextCol < 0 || nextCol >= 5) {
    return null;
  }

  return { row: nextRow, col: nextCol };
};

export const findFirstAvailableCell = (
  grid: Grid,
  row: number,
  col: number,
  direction: Direction
): { row: number; col: number; newDirection: Direction } => {
  if (direction === 'across') {
    // Search along the row
    for (let c = 0; c < 5; c++) {
      if (grid[row][c] === 'blank') continue;
      if (grid[row][c] === '') {
        return { row, col: c, newDirection: 'across' };
      }
    }

    if (row < 4) {
      return findFirstAvailableCell(grid, row + 1, 0, direction);
    } else {
      return findFirstAvailableCell(grid, 0, 0, 'down');
    }
  } else {
    // Search along the column
    for (let r = 0; r < 5; r++) {
      if (grid[r][col] === 'blank') continue;
      if (grid[r][col] === '') {
        return { row: r, col, newDirection: 'down' };
      }
    }
    if (col < 4) {
      return findFirstAvailableCell(grid, 0, col + 1, direction);
    } else {
      return findFirstAvailableCell(grid, 0, 0, 'across');
    }
  }
};

export const findNextDefinition = (
  grid: Grid,
  currentRow: number,
  currentCol: number,
  currentDirection: Direction,
  forward: boolean = false
): { row: number; col: number; newDirection: Direction } => {
  if (currentDirection === 'across') {
    // Moving through rows
    let newRow = currentRow + (forward ? -1 : 1);

    // If we went past the edges, switch to columns
    if (newRow < 0 || newRow >= 5) {
      // Switch to down direction
      const newCol = forward ? 4 : 0;  // Start from first/last column
      const startDirection = 'down';
      // Find first available cell in the column
      return findFirstAvailableCell(grid, 0, newCol, startDirection);
    }

    // Stay in across mode, find first available cell in the new row
    return findFirstAvailableCell(grid, newRow, 0, 'across');
  } else {
    // Moving through columns
    let newCol = currentCol + (forward ? -1 : 1);

    // If we went past the edges, switch to rows
    if (newCol < 0 || newCol >= 5) {
      // Switch to across direction
      const newRow = forward ? 4 : 0;  // Start from first/last row
      const startDirection = 'across';
      // Find first available cell in the row
      return findFirstAvailableCell(grid, newRow, newCol, startDirection);
    }

    // Stay in down mode, find first available cell in the new column
    return findFirstAvailableCell(grid, 0, newCol, 'down');
  }
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
      newPosition = findNextCell(grid, row, col, 'across', false) || undefined;
      break;
    case 'ArrowRight':
      newDirection = 'across';
      newPosition = findNextCell(grid, row, col, 'across', true) || undefined;
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