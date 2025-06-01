import { CrosswordConfig } from "../types/crossword";

const defs = [
  "נגמרו",
  "סליחה",
  "וושימ",
  "בקרוב",
  "__קשר",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "999 הודעת מערכת",
  hidden: true,
  "grid": fixedWords,
  "rowClues": [
    "מה קרה לתשבצים?",
    "מה יש ליוצר שלהם להגיד בנושא?",
    "צלילי הרוח שנשמעים בזמן שתיקה דרמטית, אולי",
    "מתי אולי יהיה תשבץ נוסף?",
    "צור ___ (משהו שאפשר לעשות בנושא, כגולשים)",
  ],
  "columnClues": [
    "מה העולם עושה סביב תשבצת?",
    "איזה נשק יש לקמלה האריס?",
    "שאלה ששואלים כששומעים מרחוק את הפתיח של ״קח לך אישה״, אולי",
    "שם חיבה אפשרי למישהו ששמו רחי",
    "מאותיות הא״ב (הגדרה שמסמלת את זה שנגמרו התשבצים)",
  ]
};

export default puzzle;
