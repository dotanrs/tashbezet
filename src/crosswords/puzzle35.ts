import { CrosswordConfig } from "../types/crossword";

const defs = [
  "_נאקה",
  "אתמול",
  "זנובה",
  "קינלי",
  "_היטב",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-10-16",
  "grid": fixedWords,
  "rowClues": [
    "״גמלה״",
    "תשובה תובענית לשאלה ״למתי צריך את זה?״",
    "פנדה אדומה",
    "שם נוסטלגי לפאנטה בישראל",
    "ברמה גבוהה, כמו פעולה",
  ],
  "columnClues": [
    "קשר, כמו שוטר",
    "״הריביירה של ישראל״ (לפי עצמה)",
    "משהו שהמרכיב העיקרי בו הוא NH3?",
    "מס׳ 27 בטבלה המחזורית",
    "יצר הייפ",
  ]
};

export default puzzle;
