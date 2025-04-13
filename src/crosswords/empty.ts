import { CrosswordConfig } from "../types/crossword";

const defs = [
  "מלחמה",
  "אגרול",
  "   _ ",
  "     ",
  "ר_כדש",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-12-31",
  "grid": fixedWords,
  "rowClues": [
    "",
    "",
    "",
    "",
    "",
  ],
  "columnClues": [
    "",
    "",
    "",
    "",
    "",
  ]
};

export default puzzle;
