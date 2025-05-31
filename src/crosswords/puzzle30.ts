import { CrosswordConfig } from "../types/crossword";

const defs = [
  "כוחגי",
  "יוגלו",
  "קמילה",
  "רבגפנ",
  "_טהרה",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-09-11",
  "grid": fixedWords,
  "rowClues": [
    "משהו שאסטרונאוטים צריכים לחיות בלעדיו לפעמים",
    "יזרקו אותם מהארץ",
    "הזדקנות בעולם הצומח",
    "תרגום אפשרי של Super Vine",
    "משהו שנשים יהודיות צריכות לחיות בלעדיו לפעמים",
  ],
  "columnClues": [
    "למה הלחם כל כך דחוס?",
    "תרגום אפשרי של רחמעטלף",
    "תרגום אפשרי של circulation",
    "תרגום אפשרי של בולשיט",
    "״אני רואה את זה עכשיו! איזה התרגשות!״",
  ],
  "rowHints": {
  },
  "colHints": {
    0: "סטגדיש",
    1: "ואולי יש משהו ״עטלפי״ בזה שלחיה יש מעין רחם חיצוני?"
  }
};

export default puzzle;
