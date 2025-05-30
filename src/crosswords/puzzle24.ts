import { CrosswordConfig } from "../types/crossword";

const defs = [
  "אגרופ",
  "שרביט",
  "מבינה",
  "הווה_",
  "_זל__",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-07-31",
  "grid": fixedWords,
  "rowClues": [
    "אמצעי להפעלת כוח, כאדם לא חמוש",
    "אמצעי להפעלת כח, כקוסם",
    "״הכל ___/ ואין בעיה״",
    "מה שלא היה ולא יהיה",
    "מי שהיה ולא יהיה",
   ],
  "columnClues": [
    "יש הבדל בינה לבין אחריות, לפי יו״ר הכנסת זוהר",
    "יאיר שעלה לכותרות כשגינה את ״מנשקי הקמעות״",
    "פסטה ממולאת בודדה",
    "כשאומרים את 3 מאונך במבטא, אפשר לחשוב שזה משם",
    "ביוונית: ״פרוסה״",
  ],
  "rowHints": {
    2: "(שיר של פורטרט)"
  },
  "colHints": {
    4: "בלשון עממית: סוג של גבינה"
  },
};

export default puzzle;
