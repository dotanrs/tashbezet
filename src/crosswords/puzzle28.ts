import { CrosswordConfig } from "../types/crossword";

const defs = [
  "אגס__",
  "פרילי",
  "אפצימ",
  "צביטה",
  "יודל_",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-08-28",
  "grid": fixedWords,
  "rowClues": [
    "___ קימל (דמות של תום יער בארץ נהדרת)",
    "מעדן נוסטלגי",
    "דברים שיכולים להופיע בגלל אבק או חיידק",
    "מקבלים כזאת בלב כשרואים משהו עצוב",
    "בשירה, מעבר מהיר מצליל גבוה לנמוך",
  ],
  "columnClues": [
    "מסוק קרב או שבט אינדיאני",
    "מאפיין של מסמך שמעיד שהוא מבוסס על מידע",
    "ברוורס: הכינוי שבו ״בן גביר״ קורא למנחה בארץ נהדרת",
    "צ׳יקן ___ (סרט מצויר)",
    "מוקם בין אגם לים בתשבץ של 3.7",
  ],
  "rowHints": {
    0: "״לא חוקית״",
  },
  "colHints": {
    1: "ושאולי עשו חלק ממנו בתוכנה כמו אקסל",
  },
};

export default puzzle;
