import { CrosswordConfig } from "../types/crossword";

const words = [
  ["blank", "ק", "י", "ק", "blank"],
  ["נ", "ו", "פ", "ל", "א"],
  ["ת", "צ", "ב", "ש", "ת"],
  ["נ", "י", "ר", "ו", "ל"],
  ["blank", "מ", "ק", "נ", "blank"],
]

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-03-27",
  "grid": fixedWords,
  "rowClues": [
    "אחד השמנים",
    "מקום שבו אהבה קודמת לשנאה והמוצא מגיע אחרי היעד",
    "זהו שם המשחק",
    "זמרת שוודית שזכתה פעמיים באירוויזיון",
    "ביצע עין תחת עין, למשל",
  ],
  "columnClues": [
    "קנדי, אלמנתו של בובי",
    "מין מזלג חקלאי",
    "ימציא סיפור",
    "משהו להזהר ממנו כשמרימים זר ורדים",
    "זך, אלתרמן ויונתן",
  ]
};

export default puzzle; 
