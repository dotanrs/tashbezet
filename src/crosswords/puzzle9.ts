import { CrosswordConfig } from "../types/crossword";

const words = [
  ["ל", "ב", "נ", "ר", "ק"],
  ["י", "ח", "י", "ב", "ר"],
  ["ד", "ו", "ג", "י", "נ"],
  ["ה", "פ", "ו", "צ", "פ"],
  ["ד", "ה", "ד", "ה", "blank"],
];

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-04-17",
  "grid": fixedWords,
  "rowClues": [
    "עדנה שהיא ממקורות ה״ברזל״ של טלי גוטליב",
    "לאחר מותו נוסף לו הכינוי 'לא מת'",
    "ביחד עם 3 מאונך: יום, למשל",
    "דיברו",
    "חזר אחרי",
  ],
  "columnClues": [
    "חד קרן שקיים במציאות",
    "הכורסא נקראת על שם הפעולה שעושים בה",
    "ביחד עם 3 מאוזן: לילה, למשל",
    "איפה לשבור זכוכיות לא נחשב ונדליזם?",
    "ב5 מאוזן, איפה מופיעה הה׳?",
  ]
}; 

export default puzzle; 