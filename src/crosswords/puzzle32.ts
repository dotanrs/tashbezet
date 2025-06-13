import { CrosswordConfig } from "../types/crossword";

const defs = [
  "__בלי",
  "_אוהו",
  "גבינה",
  "_כדינ",
  "__מפה",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-09-25",
  "grid": fixedWords,
  "rowClues": [
    "עם או ___?",
    "״יש לי הרבה מה להגיד בנושא!״",
    "מרכיב מרכזי בפונדו",
    "לפי החוק",
    "תשובה אפשרית ל״מאיפה?״",
  ],
  "columnClues": [
    "אפשרות בקלפי שפונה בעיקר לחרדים",
    "ראשי תיבות של נשקים להשמדה המונית",
    "מקום ששולפים ממנו דברים שנשכחו, מטאפורית",
    "משהו שאפשר לעשות עם דגל",
    "המילה שמופיעה ב-5 מאונך כבר תשבץ שלישי ברצף",
  ]
};

export default puzzle;
