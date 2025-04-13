import { CrosswordConfig } from "../types/crossword";

const defs = [
  "__חמש",
  "_ארבע",
  "אומרמ",
  "הגוימ",
  "לינק_",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-05-29",
  "grid": fixedWords,
  "rowClues": [
    "2 מאוזן + 1",
    "מספר הריבועים השחורים בתשבץ",
    "בשמו מביאים את הדברים, לעתים קרובות",
    "מי אינם מקבלים טומאה?",
    "קישור",
  ],
  "columnClues": [
    "א׳, לפי השיר (כ.ח.)",
    "חבר של המקקים, בערוץ הילדים",
    "תפוח שקרוי על שם הר",
    "כמו מישהו שפותר תשבצים ממש קשים בקלות",
    "לא היה מעניין",
  ]
};

export default puzzle;
