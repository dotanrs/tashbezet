import { Grid, Direction, CellStatusGrid } from '../types/crossword';

export const HOST_NAME = process.env.REACT_APP_HOST_NAME ? process.env.REACT_APP_HOST_NAME : 'https://dotanrs.github.io/tashbezet';

export const findNextDirectCellV2 = (
  grid: Grid,
  cellStatus: CellStatusGrid,
  row: number,
  col: number,
  direction: Direction,
  forward: boolean = true,
): { row: number; col: number, newDirection?: Direction } | null => {
  let nextCol = col;
  let nextRow = row;
  let newDirection = direction;

  const resetDirection = () => {
    newDirection = direction === 'across' ? 'down' : 'across';
    nextCol = forward ? 0 : 4;
    nextRow = forward ? 0 : 4;
  }
  
  const step = () => {
    if (direction === 'across') {
      nextCol += (forward ? 1 : -1);
      if (nextCol < 0 || nextCol >= 5) {
        nextRow += (forward ? 1 : -1);
        nextCol = forward ? 0 : 4;
        if (nextRow < 0 || nextRow >= 5) {
          resetDirection();
        }
      }
    } else {
      nextRow += (forward ? 1 : -1);
      if (nextRow < 0 || nextRow >= 5) {
        nextCol += (forward ? 1 : -1);
        nextRow = forward ? 0 : 4;
        if (nextCol < 0 || nextCol >= 5) {
          resetDirection();
        }
      }
    }
  }

  step();
  while (grid[nextRow][nextCol] === 'blank' || cellStatus[nextRow][nextCol] === true) {
    step();
  }

  return { row: nextRow, col: nextCol, newDirection };
}

export const findNextDirectCell = (
  grid: Grid,
  row: number,
  col: number,
  direction: Direction,
  forward: boolean = true
): { row: number; col: number } | null => {
  if (direction === 'across') {
    let newCol = col + (forward ? 1 : -1);
    while (newCol >= 0 && newCol < 5 && grid[row][newCol] === 'blank') {
      newCol += (forward ? 1 : -1);
    }
    if (newCol >= 0 && newCol < 5) {
      return { row, col: newCol };
    }
  } else {
    let newRow = row + (forward ? 1 : -1);
    while (newRow >= 0 && newRow < 5 && grid[newRow][col] === 'blank') {
      newRow += (forward ? 1 : -1);
    }
    if (newRow >= 0 && newRow < 5) {
      return { row: newRow, col };
    }
  }
  return null;
};

export const handleArrowNavigation = (
  key: string,
  currentDirection: Direction,
  row: number,
  col: number,
  grid: Grid
): { newDirection?: Direction; newPosition?: { row: number; col: number } } => {
  // If moving perpendicular to current direction, switch direction
  if ((currentDirection === 'down' && ['ArrowRight', 'ArrowLeft'].includes(key)) ||
      (currentDirection === 'across' && ['ArrowUp', 'ArrowDown'].includes(key))) {
    return { newDirection: currentDirection === 'across' ? 'down' : 'across' };
  }

  // Move in the current direction
  const forward = ['ArrowLeft', 'ArrowDown'].includes(key);
  const nextCell = findNextDirectCell(grid, row, col, currentDirection, forward);
  
  return nextCell ? { newPosition: nextCell } : {};
}; 