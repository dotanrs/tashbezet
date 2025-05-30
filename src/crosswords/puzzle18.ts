import { CrosswordConfig } from "../types/crossword";

const defs = [
  "_בור_",
  "לוישנ",
  "פרימו",
  "מוביל",
  "_תרמ_",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-06-19",
  "grid": fixedWords,
  "rowClues": [
    "יכול להיות בתקציב או באדמה",
    "תפילה של הורים לגבי התינוק שלהם, כשכבר נהיה מאוחר",
    "שדרן ספורט שידוע בפרסום ברווזים עיתונאיים",
    "קוראים לו כשלא רוצים לסחוב",
    "עשה מצווה?",
  ],
  "columnClues": [
    "ארגון שמפרסם משרדי ממשלה",
    "מילה שכבר מופיעה בתשבץ, אבל הפעם ברבים",
    "כמעט-יוניקורן ישראלי בשנת 2014",
    "אנשים חולקים אותם אחרי חוויות מעניינות",
    "שם מחמיא לקרטון שמתוחים עליו חוטים",
  ]
};

export default puzzle;
