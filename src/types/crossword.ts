export type Cell = string | 'blank';
export type Grid = Cell[][];
export type Selected = { row: number | null; col: number | null };
export type CellStatus = boolean | null;
export type CellStatusGrid = CellStatus[][];
export type Direction = 'across' | 'down';

export interface CrosswordConfig {
  grid: Grid;
  rowClues: string[];
  columnClues: string[];
} 