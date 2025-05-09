import { CrosswordConfig } from "../types/crossword";

const defs = [
  "__של_",
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
    "״__ נעליך מעל רגליך״",
    "זמן גרוע להיזכר ששכחת משהו בבית",
    "כלום לא נדבק אליו, לכאורה",
    "בעל נשימה כבדה",
    "הוא   נלחץ  יותר   מדי  בהגדרה   הזאת  .",
  ],
  "columnClues": [
    "לא בהכרח אפוי עד הסוף (כמו מוצר טכנולוגי)",
    "מקביל לאלוף במכבי אש",
    "שמו כסף",
    "מדינה שהנקודה הכי נמוכה בה היא מעל 1,000 מטר",
    "שם",
  ]
};

export default puzzle;
