import { PuzzleId } from '../crosswords';

export type Cell = string;
export type Grid = Cell[][];
export type Selected = { row: number; col: number } | null;
export type CellStatus = boolean | null;
export type CellStatusGrid = CellStatus[][];
export type Direction = 'across' | 'down';

export interface DefinitionHint {
  direction: Direction;
  index: number;
  hint: string;
}

export interface CrosswordConfig {
  name: string;
  grid: Grid;
  rowClues: string[];
  columnClues: string[];
  rowHints?: {[key: number]: string};
  colHints?: {[key: number]: string};
}

export interface SavedPuzzleState {
  puzzleId: PuzzleId;
  userGrid: Grid;
  cellStatus: CellStatusGrid;
  isComplete: boolean;
}

export interface SavedPuzzles {
  [puzzleId: string]: SavedPuzzleState;
} 