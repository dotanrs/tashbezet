import { CrosswordConfig } from "../types/crossword";

const defs = [
  "_כלא_",
  "בוולה",
  "לוכנס",
  "מנסרה",
  "_תנא_",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-07-24",
  "grid": fixedWords,
  "rowClues": [
    "מען אפשרי מצער לאנשי אופוזיציה במדינה טוטליטרית",
    "איך אפשר לבעוט בכדור כשהוא גבוה?",
    "אגם בבריטניה שהוא בית הגידול של ה-Rhombopteryx nessiteras",
    "היא שוברת את האור",
    "מחכמי ישראל",
  ],
  "columnClues": [
    "כשהוא עושה את 2 מאוזן, יותר סביר שזה כדי להרחיק את הכדור",
    "אמצעי לעידוד ראיית מנהרה",
    "אם כבר לקרוא להם רובים ושושנים, לגיטריסט אפשר לקרוא כך",
    "הלוואי שלא נפחד",
    "הרמן שכתב את ״זאב הערבות״",
  ]
};

export default puzzle;
