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
const allPuzzles: { [key: string]: CrosswordConfig } = {
  puzzle1: require('./puzzle1').default,
  puzzle2: require('./puzzle2').default,
  puzzle3: require('./puzzle3').default,
  puzzle4: require('./puzzle4').default,
  puzzle5: require('./puzzle5').default,
  puzzle6: require('./puzzle6').default,
  puzzle7: require('./puzzle7').default,
  puzzle8: require('./puzzle8').default,
  puzzle9: require('./puzzle9').default,
  puzzle10: require('./puzzle10').default,
  puzzle11: require('./puzzle11').default,
  puzzle12: require('./puzzle12').default,
  puzzle13: require('./puzzle13').default,
  puzzle14: require('./puzzle14').default,
  puzzle15: require('./puzzle15').default,
  puzzle16: require('./puzzle16').default,
}

const relevantPuzzles = Object.fromEntries(
  Object.entries(allPuzzles)
    .filter(([_, puzzle]) => puzzle.name <= formattedDate)
    .sort((a, b) => a[1].name.localeCompare(b[1].name))
    .reverse()
);

export const puzzles = relevantPuzzles;

export type PuzzleId = keyof typeof puzzles; 