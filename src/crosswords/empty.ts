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

export const puzzle15: CrosswordConfig = {
  name: "2023-05-22",
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
