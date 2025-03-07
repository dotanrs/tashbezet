export type Cell = string;
export type Grid = Cell[][];
export type Selected = { row: number; col: number } | null;
export type CellStatus = boolean | null;
export type CellStatusGrid = CellStatus[][];
export type Direction = 'across' | 'down';

export interface CrosswordConfig {
  name: string;
  grid: Grid;
  rowClues: string[];
  columnClues: string[];
}

export interface SavedPuzzleState {
  userGrid: Grid;
  cellStatus: CellStatusGrid;
  isComplete: boolean;
}

export interface SavedPuzzles {
  [puzzleId: string]: SavedPuzzleState;
} 