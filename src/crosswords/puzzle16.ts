import { CrosswordConfig } from "../types/crossword";

const defs = [
  "_בומב",
  "_מיצו",
  "מחשיד",
  "הונאה",
  "אלוהה",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-06-05",
  "grid": fixedWords,
  "rowClues": [
    "💣 + E",
    "הוציאו את המיץ",
    "כמו מייל לא צפוי שמודיע שזכית בהרבה כסף",
    "כמו ההסבר ל-3 מאונך, כנראה",
    "ברכה שמגיעה לפעמים עם זר פרחים על הצוואר",
  ],
  "columnClues": [
    "כשמנסים להקליד ״מהר״ מהר, אולי",
    "כשנעלזה ונשמחה, כך נצאה",
    "האל המשמר בהינדואיזם",
    "כמו משהו יד שניה במצב מעולה ובזול",
    "סידהרתא גאוטמה, בבגרותו",
  ],
};

export default puzzle;
