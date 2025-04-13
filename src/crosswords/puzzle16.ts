import { CrosswordConfig } from "../types/crossword";

const defs = [
  "__מהא",
  "במחול",
  "וישנו",
  "מציאה",
  "בודהה",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-06-05",
  "grid": fixedWords,
  "rowClues": [
    "כשמנסים להקליד ״מהר״ מהר, אולי",
    "כשנעלזה ונשמחה, כך נצאה",
    "האל המשמר בהינדואיזם",
    "כמו משהו יד שניה במצב מעולה ובזול",
    "סידהרתא גאוטמה, בבגרותו",
  ],
  "columnClues": [
    "💣 בלעז",
    "הספיק להם",
    "כשמקבלים מייל שמודיע שזכית בהרבה כסף, למשל",
    "כמו 3 מאונך, כנראה",
    "ברכה שמגיעה לפעמים עם זר פרחים על הצוואר",
  ]
};

export default puzzle;
