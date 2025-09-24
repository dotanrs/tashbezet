import { CrosswordConfig } from "../types/crossword";

const defs = [
  "__דדי",
  "שמונה",
  "ישלפו",
  "פורימ",
  "טל___",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-11-06",
  "grid": fixedWords,
  "rowClues": [
    "מילה שאבא טרי שירד מהארץ עשוי לשמוע הרבה",
    "כוכבית",
    "״והריקו חרבותם״",
    "זמן שבו אנשים לא כנים לגבי מי שהם",
    "התעבות לילית",
  ],
  "columnClues": [
    "מה במקלדת מקשר בין ההגדרה לפתרון ב-3 מאוזן ו-2 מאונך?",
    "אדם עצלן, בסיפור על הצרצר והנמלה",
    "ארבע",
    "פיל ממשפחה מודרנית",
    "מה יעשה הסער מסביב?",
  ]
};

export default puzzle;
