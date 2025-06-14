import { CrosswordConfig } from "../types/crossword";

const defs = [
  "__בלי",
  "_אוהו",
  "גבינה",
  "_לדינ",
  "__מפה",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-09-25",
  "grid": fixedWords,
  "rowClues": [
    "עם 2 מאונך: ... ובלי חבל",
    "״יש לי הרבה מה להגיד בנושא!״",
    "כמו תום או ברי",
    "פושעים - לשם",
    "תשובה אפשרית ל״מאיפה?״",
  ],
  "columnClues": [
    "אפשרות בקלפי שפונה בעיקר לחרדים",
    "ר׳ 1 מאוזן",
    "מקום ששולפים ממנו דברים שנשכחו, גם מטאפורית",
    "משהו שאפשר לעשות עם דגל",
    "המילה שמופיעה ב-5 מאונך כבר תשבץ שלישי ברצף",
  ]
};

export default puzzle;
