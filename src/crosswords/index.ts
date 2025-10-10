import { CrosswordConfig } from "../types/crossword";

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const today = new Date();
// Return a future date s.t. all puzzles will be shown
const formattedDate = process.env.REACT_APP_SHOW_ALL_PUZZLES ? '9999-99-99' : formatDate(today);

function missing_next_puzzle(relevantPuzzles: CrosswordConfig[]) {
  // Based on the data of the last puzzle in display, check if the next one is overdue
  const latest_date = relevantPuzzles[relevantPuzzles.length - 1].name
  const sevenDaysFromNow = new Date(latest_date);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  return formatDate(new Date()) > formatDate(sevenDaysFromNow);
}

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
  puzzle17: require('./puzzle17').default,
  puzzle18: require('./puzzle18').default,
  puzzle19: require('./puzzle19').default,
  puzzle20: require('./puzzle20').default,
  puzzle21: require('./puzzle21').default,
  puzzle22: require('./puzzle22').default,
  puzzle23: require('./puzzle23').default,
  puzzle24: require('./puzzle24').default,
  puzzle25: require('./puzzle25').default,
  puzzle26: require('./puzzle26').default,
  puzzle27: require('./puzzle27').default,
  puzzle28: require('./puzzle28').default,
  puzzle29: require('./puzzle29').default,
  puzzle30: require('./puzzle30').default,
  puzzle31: require('./puzzle31').default,
  puzzle32: require('./puzzle32').default,
  puzzle33: require('./puzzle33').default,
  puzzle34: require('./puzzle34').default,
  puzzle35: require('./puzzle35').default,
  puzzle36: require('./puzzle36').default,
  puzzle37: require('./puzzle37').default,
  puzzle38: require('./puzzle38').default,
  puzzle39: require('./puzzle39').default,
  puzzle40: require('./puzzle40').default,
  puzzle41: require('./puzzle41').default,
}

const relevantPuzzles = Object.fromEntries(
  Object.entries(allPuzzles)
    .filter(([_, puzzle]) => puzzle.name <= formattedDate)
);

// Add 'last' puzzle if needed
if (missing_next_puzzle(Object.values(relevantPuzzles))) {
  relevantPuzzles[formattedDate] = require('./last').default;
}

const sortedPuzzles = Object.fromEntries(
  Object.entries(relevantPuzzles)
  .sort((a, b) => a[1].name.localeCompare(b[1].name))
  .reverse()
);

export const getLatestPuzzleName = () => Object.values(sortedPuzzles)[0].name;

export const puzzles = sortedPuzzles;

export const PUZZLE_ID_404 = '404';

export const viewablePuzzles = relevantPuzzles;
viewablePuzzles[PUZZLE_ID_404] = require('./notFound').default;

export type PuzzleId = string;
