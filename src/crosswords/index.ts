import { CrosswordConfig } from "../types/crossword";

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// Example usage:
const today = new Date();
const formattedDate = formatDate(today);

// Dynamically import all puzzle files
const allPuzzles: CrosswordConfig[] = [
  require('./puzzle1').default,
  require('./puzzle2').default,
  require('./puzzle3').default,
  require('./puzzle4').default,
  require('./puzzle5').default,
  require('./puzzle6').default,
  require('./puzzle7').default,
  require('./puzzle8').default,
  require('./puzzle9').default,
  require('./puzzle10').default,
  require('./puzzle11').default,
  require('./puzzle12').default,
]

const relevantPuzzles = Object.fromEntries(
  Object.entries(allPuzzles)
    .filter(([_, puzzle]) => puzzle.name <= formattedDate)
    .sort((a, b) => a[1].name.localeCompare(b[1].name))
    .reverse()
);

export const puzzles = relevantPuzzles;

export type PuzzleId = keyof typeof puzzles; 