import { CrosswordConfig } from "../types/crossword";

const defs = [
  "אשמה_",
  "גרבוז",
  "רביול",
  "וינה_",
  "פטה__",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-07-31",
  "grid": fixedWords,
  "rowClues": [
    "יש הבדל בינה לבין אחריות, לפי יו״ר הכנסת זוהר",
    "יאיר שעלה לכותרות כשגינה את ״מנשקי הקמעות״",
    "פסטה ממולאת בודדה",
    "כשאומרים את 3 מאונך במבטא, אפשר לחשוב שזה משם",
    "ביוונית: ״פרוסה״ (סוג של גבינה)",
  ],
  "columnClues": [
   "אמצעי להפעלת כוח, כאדם לא חמוש",
   "אמצעי להפעלת כח, כקוסם",
   "״הכל ___/ ואין בעיה״ (שיר של פורטרט)",
   "מה שלא היה ולא יהיה",
   "מי שהיה ולא יהיה",
  ],
};

export default puzzle;
