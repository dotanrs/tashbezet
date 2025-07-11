import { CrosswordConfig } from "../types/crossword";

const defs = [
  "פנקס_",
  "רשימה",
  "כיסונ",
  "סמודי",
  "__סיד",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-10-23",
  "grid": fixedWords,
  "rowClues": [
    "מקום לשים בו את 2 מאוזן, אולי",
    "דרך לשים דברים בסדר מסוים",
    "כמו מומו או גיוזה",
    "כינוי קוסמופוליטי לשייק?",
    "השקעה מוקדמת בסטארטאפ",
  ],
  "columnClues": [
    "זז בלי רצון",
    "הן מנהלות את העולם, לפי ביונסה",
    "״ליגה״ בארצות הברית של מוסדות השכלה גבוהה",
    "עוד אחד בבקשה",
    "הביע התרגשות בעזרת העפעף?",
  ],
  colHints: {
    3: "בשילוב עם הגדרה אחרת בתשבץ"
  }
};

export default puzzle;
