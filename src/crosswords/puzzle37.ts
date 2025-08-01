import { CrosswordConfig } from "../types/crossword";

const defs = [
  "_מגפ_",
  "מצרימ",
  "כבודה",
  "סופלה",
  "_ריו_",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-10-30",
  "grid": fixedWords,
  "rowClues": [
    "״ארץ ה-״ (סוג של נעל)",
    "מנכדיו של נוח, וגם מדינה ערבית",
    "לפעמים צריך לשלם כדי להעלות אותה למטוס",
    "תפיחה במטבח",
    "שם פמיליארי לעיר ״נהר של ינואר״",
  ],
  "columnClues": [
    "לפעמים צריך לשלם אותו על 3 מאוזן",
    "מלאי ליום גשום?",
    "אוהד שרוף",
    "משהו שהמתחרים בטור דה פראנס עשו הרבה",
    "איך עושה כבשה?",
  ]
};

export default puzzle;
