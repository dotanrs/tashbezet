import { CrosswordConfig } from "../types/crossword";

const words = [
    ["י", "ר", "ו", "ב", "ת"],
    ["מ", "ו", "ר", "ב", "א"],
    ["י", "ו", "ב", "י", "ר"],
    ["ה", "ר", "ל", "ו", "כ"],
    ["blank", "ס", "י", "blank", "blank"],
  ]
  
  const fixedWords = words.map(word => word.reverse());
  
  export const puzzle7: CrosswordConfig = {
    name: "2025-04-03",
    "grid": fixedWords,
    "rowClues": [
      "אחד השימים",
      "בורג מפורסם",
      "כשזה תארים זה טוב, כשזה נשים עשוי להיות פשע",
      "בחורות ערומים זה",
      "נוט הוט"
    ],
    "columnClues": [
      "נתן בו זמנים",
      "איפה נמצא הלינק? (אינסטגרם)",
      "מבטא את עצמו בעזרת מילים",
      "מצב לא טוב כשרוצים להתקדם",
      "צי",
    ]
  }; 