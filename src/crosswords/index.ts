import { puzzle1 } from './puzzle1';
import { puzzle2 } from './puzzle2';
import { puzzle3 } from './puzzle3';
import { puzzle4 } from './puzzle4';
import { puzzle5 } from './puzzle5';
import { puzzle6 } from './puzzle6';
import { puzzle7 } from './puzzle7';
import { puzzle8 } from './puzzle8';
import { puzzle9 } from './puzzle9';
import { puzzle10 } from './puzzle10';
import { puzzle11 } from './puzzle11';
import { puzzle12 } from './puzzle12';
import { puzzle13 } from './puzzle13';
import { puzzle14 } from './puzzle14';

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// Example usage:
const today = new Date();
const formattedDate = formatDate(today);

const allPuzzles = {
  puzzle14,
  puzzle13,
  puzzle12,
  puzzle11,
  puzzle10,
  puzzle9,
  puzzle8,
  puzzle7,
  puzzle6,
  puzzle5,
  puzzle4,
  puzzle3,
  puzzle2,
  puzzle1,
}

const relevantPuzzles = Object.fromEntries(
  Object.entries(allPuzzles)
    .filter(([_, puzzle]) => puzzle.name <= formattedDate)
    .sort((a, b) => a[1].name.localeCompare(b[1].name))
    .reverse()
);

export const puzzles = relevantPuzzles;

export type PuzzleId = keyof typeof puzzles; 