import { Grid, Direction } from '../types/crossword';

export const findNextCell = (
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
  const nextCell = findNextCell(grid, row, col, currentDirection, forward);
  
  return nextCell ? { newPosition: nextCell } : {};
}; 