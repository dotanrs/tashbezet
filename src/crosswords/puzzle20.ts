import { CrosswordConfig } from "../types/crossword";

const defs = [
  "_רעמ_",
  "בולענ",
  "אגמונ",
  "שלגיה",
  "_השנה",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-07-03",
  "grid": fixedWords,
  "rowClues": [
    "הוא נהמת הדרקון, במיתולוגיה הטיבטית",
    "כשהאדמה פוערת את פיה",
    "זה לא ים, לא ימה, אפילו לא אגם.",
    "היריבה הקולנועית האחרונה של גל גדות",
    "תשובה חסרת תועלת לשאלה מתי יש לך יום הולדת",
  ],
  "columnClues": [
    "אולי הוא התיישן, אבל כמו גבינה ולא כמו יין",
    "נוזקה שמטרתה איננה להרוס",
    "דרך נאותה להגיש תה",
    "סוג של דלתון שעשוי להיות ריבוע",
    "נלך אחרי באופן עיוור",
  ]
};

export default puzzle;
