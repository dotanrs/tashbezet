import { CrosswordConfig } from "../types/crossword";

const defs = [
  "_שמטנ",
  "מיגרמ",
  "מגיפה",
  "פרפור",
  "המהנ_",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-07-10",
  "grid": fixedWords,
  "rowClues": [
    "אחד שדברים נופלים לו",
    "״מי אחראי למחדל הזה?״",
    "היא עוברת מאדם לאדם בקצב מהיר",
    "תזוזה בלי רצון",
    "גוף שלישי רבים אינקלוסיבי",
  ],
  "columnClues": [
    "מסמן מיקומים של דברים",
    "״שליט סין״ (כתשובה ל2 מאוזן)",
    "סוגרת את החלון",
    "רבי שהשתתף בסיפור יציאת מצרים לילה שלם, לפי ההגדה",
    "אחד ששולף מהמותן",
  ]
};

export default puzzle;
