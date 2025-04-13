import { CrosswordConfig } from "../types/crossword";

const defs = [
  "__תשא",
  "__נפו",
  "חורימ",
  "זימרר",
  "מהזאת",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-05-22",
  "grid": fixedWords,
  "rowClues": [
    "שנת הקמת גטו ורשה",
    "״__ שגיאות״ (דַבגוּ)",
    "לא טוב שיש אותם בעלילה",
    "דיקלם בשירה",
    "יחד עם 5 מאונך: ״?!״",
  ],
  "columnClues": [
    "חלקם הקדמי",
    "חד קרן ישראלי",
    "״חבר, תעזור לי לפתור את זה״",
    "ענר שהיה מגיבורי ה-7.10",
    "ר׳ 5 מאוזן",
  ]
};

export default puzzle;
