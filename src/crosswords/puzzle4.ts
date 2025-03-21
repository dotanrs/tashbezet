import { CrosswordConfig } from '../types/crossword';

const words = [
  ["נ", "מ", "ג", "ר", "א"],
  ["ו", "ד", "ר", "ו", "ב"],
  ["blank", "ו", "ל", "ר", "מ"],
  ["נ", "י", "י", "ש", "י"],
  ["ה", "ק", "ד", "כ", "blank"],
]

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-03-13",
  "grid": fixedWords,
  "rowClues": [
    "גוון של אדום",
    "כמו 1 מאוזן או 3 מאוזן",
    "המלצה אפשרית של סומלייה",
    "מצב עניינים אם מקבלים את ההמלצה מ3 מאוזן",
    "משך הזמן שלוקח לקומקום מלא לרתוח"
  ],
  "columnClues": [
    "תגובה ל: ״שלום, כאן א. ב. <לא ברור>״",
    "מבחן כתמים",
    "מאפיין סביר של לקוח קבוע בפיצוצייה",
    "לא הולך סחור סחור",
    "״לא״, מעבר לגבול בין מדינות באי הבריטי"
  ]
};

export default puzzle; 