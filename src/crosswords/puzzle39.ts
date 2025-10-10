import { CrosswordConfig } from "../types/crossword";

const defs = [
  "__מימ",
  "_שבוש",
  "לבובו",
  "אוטוב",
  "תרחיש",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-11-13",
  "grid": fixedWords,
  "rowClues": [
    "טוב לבריאות של אנשים, רע מאוד למחשבים",
    "ל-5 מאונך יש כזה",
    "מפלצת לאספנים",
    "״או רע...״",
    "כדאי להיות מוכנים לכל אחד",
  ],
  "columnClues": [
    "עם ״חרב״ - מושב בעמק חפר",
    "דרך חדה יותר להגיד את 5 מאונך",
    "בהמשך ל-2 ו-5 מאונך, כדאי לקוות שזה -",
    "״שלום, נער״ בסלנג לועזי",
    "לא עובד טוב",
  ]
};

export default puzzle;
