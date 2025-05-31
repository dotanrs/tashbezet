import { CrosswordConfig } from "../types/crossword";

const defs = [
  "__גל_",
  "בטיסה",
  "טפלונ",
  "אסמטי",
  "_רווח",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-08-07",
  "grid": fixedWords,
  "rowClues": [
    "התקדמות בתווך",
    "זמן גרוע להיזכר ששכחת משהו בבית",
    "משהו הידרופובי ברמות",
    "מישהו שצריך הרבה שאיפות, אולי",
    "הוא   נלחץ  יותר   מדי  בהגדרה   הזאת  .",
  ],
  "columnClues": [
    "לא בהכרח אפוי עד הסוף (כמו מוצר טכנולוגי)",
    "כבאי אלוף",
    "שילמו נטו, בעגת רואי חשבון",
    "מדינה עם הנקודה הנמוכה הגבוהה בעולם",
    "שם",
  ],
  "rowHints": {
    4: "ממש            הרבה",
  },
  "colHints": {
    4: "שין שמאלית",
    3: "מעל 1,000 מטר!",
  },
};

export default puzzle;
