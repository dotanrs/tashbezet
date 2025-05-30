import { CrosswordConfig } from "../types/crossword";

const defs = [
  "שטוחה",
  "טרלול",
  "איגלו",
  "זפזפ_",
  "יה___",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-09-04",
  "grid": fixedWords,
  "rowClues": [
    "״הארץ לא ____״ (תשובה לקונספירטורים)",
    "מילת השנה בישראל 2021",
    "בית קר",
    "תמשיך הלאה",
    "בעברית אלוהים, באנגלית ״כה״",
  ],
  "columnClues": [
    "שם גנאי היסטורי למשטרה שלא בוחלת באמצעים",
    "דרוסה, נפולה או שבורה, למשל",
    "הטור הזה עושה את זה ויוצר אנגרמה",
    "כל שלטון, אירוע או כאב עושה את זה בסוף",
    "ככל שמסמסים יותר, אומרים את זה פחות",
  ],
  "rowHints": {
    1: "יש שיגידו ש-1 מאוזן זה דוגמא טובה",
    2: "אבל האנשים חמים (אולי)",
    3: "(מטאפורה טלוויזיונית)"
  }
};

export default puzzle;
