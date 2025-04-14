import { CrosswordConfig } from "../types/crossword";

const defs = [
  "שחונה",
  "בסימנ",
  "שכונה",
  "בולמ_",
  "תנה__",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-06-12",
  "grid": fixedWords,
  "rowClues": [
    "היא חמה ולא ירד בה גשם",
    "מושפע מ- (כמו טיול או טקס)",
    "היא לא מקצועית בעליל",
    "לוחץ על הדוושה השמאלית",
    "היא לפעמים עושה קולות מלחיצים בלילה",
  ],
  "columnClues": [
    "היא זזה לפי הרוח",
    "גם אם חצי מהמשכורת הולכת לשם זה לא נחשב בזבוז",
    "היא לא כינור ולא צ׳לו",
    "עשה שנ״ץ, למשל",
    "״מרוצה?״",
  ]
};

export default puzzle;
