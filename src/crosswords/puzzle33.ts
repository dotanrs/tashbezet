import { CrosswordConfig } from "../types/crossword";

const defs = [
  "מיאמר",
  "הוצאה",
  "בכבוד",
  "יודפת",
  "לסורו",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-10-02",
  "grid": fixedWords,
  "rowClues": [
    "״למה?״ בעגה של ילדים",
    "כמו בבל או פרדס",
    "״אין בעד מה, איש/ה יקר/ה״",
    "מושב ברכס יוטבת",
    "חזר לשם אחרי שנמאס לו להתנהג יפה",
  ],
  "columnClues": [
    "אולי זה עוד חם מדי בשביל לשתות?",
    "עם ״אנטי״: מלך סאלוקי שאכן היה ״אנטי״",
    "הוא ממהר בתוך התו",
    "מציג חזות משופצת",
    "התו הוא האמונה שלו",
  ]
};

export default puzzle;
