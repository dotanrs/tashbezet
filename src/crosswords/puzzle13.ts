import { CrosswordConfig } from "../types/crossword";

const defs = [
  "_מעכל",
  "מדיומ",
  "מחשמל",
  "צוותא",
  "אמנה_",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-05-15",
  "grid": fixedWords,
  "rowClues": [
    "נותן לזה לשקוע",
    "המסר זה הוא, לפי האימרה",
    "עושה זרמים בגוף",
    "״מרכז לתרבות מתקדמת״ בתל אביב",
    "יש כאלה בשם וינה, ג׳נבה, אנטרקטיקה",
  ],
  "columnClues": [
    "משהו שעולה בתחקיר",
    "נמצא בפה של האמוג׳י החולה",
    "דרך לשמר בשר",
    "כובע צבאי",
    "מה שצריך לעשות עם טפסים, לרוב",
  ]
};

export default puzzle;
