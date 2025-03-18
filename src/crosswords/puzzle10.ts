import { CrosswordConfig } from "../types/crossword";

const words = [
    ["י", "ש", "מ", "ש", "ש"],
    ["ע", "י", "ר", "פ", "י"],
    ["ל", "ד", "מ", "ע", "נ"],
    ["ו", "ה", "ש", "י", "מ"],
    ["נ", "blank", "ה", "ש", "מ"],
    ]
    
const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-04-24",
  "grid": fixedWords,
  "rowClues": [
    "איזה כיף ___ (אמירה נפוצה בסוף החורף)",
    "לא יועיל, בלשון המעטה",
    "...כבוד המורה?",
    "לעתים קרובות הוא צריך לעשות משהו",
    "דרך סבירה לקרוא למוזס נוימן",
  ],
  "columnClues": [
    "שם משפחה בקיצור, באריכות",
    "הסופר בקופה ראשית, בלי משכורות",
    "עם 5 מאוזן: דרך רשמית יותר",
    "אחד הרהיטים",
    "משה שהיה רמטכ״ל",
  ]
};

export default puzzle; 