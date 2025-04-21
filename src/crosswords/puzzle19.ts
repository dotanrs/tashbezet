import { CrosswordConfig } from "../types/crossword";

const defs = [
  "מוצצ_",
  "בויל_",
  "זולו_",
  "הונפה",
  "__יחס",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-06-26",
  "grid": fixedWords,
  "rowClues": [
    "הוא סיים את תפקידו? בוא נתלה אותו על עץ ",
    "סוזן שהיממה את השופטים ב-Britian's got talent",
    "המילה האחרונה בא״ב של נאטו",
    "נתלתה על עמוד גבוה (כמו דגל)",
    "לפעמים כשילדה משתוללת זה מה שהיא בעצם רוצה",
  ],
  "columnClues": [
    "לא נותן כבוד, בלשון המעטה",
    "ארבע אותיות זהות שיוצרות מילה",
    "כמו רוברטו בולניו או פבלו נרודה",
    "דג נחש",
    "שקט!",
  ]
};

export default puzzle;
