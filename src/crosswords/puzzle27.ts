import { CrosswordConfig } from "../types/crossword";

const defs = [
  "מטרד_",
  "גופיה",
  "פרלוד",
  "_טקטי",
  "__סהר",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-08-22",
  "grid": fixedWords,
  "rowClues": [
    "משהו שלא בא בטוב",
    "פריט לבוש שקרוב לה׳?",
    "מבוא מוזיקלי",
    "לא מתייחס לטווח הארוך",
    "הלאל",
  ],
  "columnClues": [
    "לפי כוורת, שניים כאלה ומכנסיים תמיד קונים ״קומפלט״",
    "גורמת לטיקים",
    "כמו מתיחה או הקאה",
    "אחד שלא יבין שזו אנגרמה, אולי",
    "עשה חרם",
  ],
  "colHints": {
    3: "תלוי באיזה תחום הכינוי הזה מתאים לו",
  }
};

export default puzzle;
