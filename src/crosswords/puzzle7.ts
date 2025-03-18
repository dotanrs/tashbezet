import { CrosswordConfig } from "../types/crossword";

const words = [
  ["blank", "ז", "א", "ב", "blank"],
  ["ה", "א", "י", "ל", "מ"],
  ["ק", "ב", "ד", "י", "פ"],
  ["ת", "ו", "א", "ב", "צ"],
  ["blank", "נ", "ה", "כ", "blank"],
]

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-04-03",
  "grid": fixedWords,
  "rowClues": [
    "שנות אור, חבר של וודי",
    "המקום בו מתקבלות החלטות ממשלה",
    "משוב",
    "כינוי לוחמני לאלוהים",
    "אחים מפורסמים מהוליווד",
  ],
  "columnClues": [
    "כינוי לאירוע חדשותי מסעיר",
    "איפה ייתכן שיש לך שמש, לפי השיר?",
    "לפי אלפטון, היא קודמת לחומר",
    "חיה מסוכנת אבל בקטן",
    "מהו העקב של הרובה?",
  ]
}; 

export default puzzle; 