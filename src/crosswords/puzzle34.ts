import { CrosswordConfig } from "../types/crossword";

const defs = [
  "תרתי_",
  "מתנהג",
  "שחללז",
  "שחרור",
  "_משמע",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-10-09",
  "grid": fixedWords,
  "rowClues": [
    "יחד עם 5 מאוזן: הרמז מצוין (כלומר כתוב) פה",
    "״איך הוא ____?״ (שואלים כשהתשובה היא: לא טוב)",
    "אומר להוא",
    "אירוע שמחכים לו בכלא",
    "יחד עם 1 מאוזן: הרמז מצוין (כלומר ממש טוב) פה",
  ],
  "columnClues": [
    "הנחיה לעיוור במשל העיוורים והפיל",
    "ההפך מ״קפא קר״",
    "״תרום למישהו שצריך את זה״",
    "מישהו שמירי רגב תשקיע בו הרבה, לכאורה",
    "תספורת לא טובה לכבשה",
  ]
};

export default puzzle;
