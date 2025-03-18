import { CrosswordConfig } from "../types/crossword";

const words = [
  ["ל", "מ", "ג", "ר", "ג"],
  ["ח", "ו", "ר", "פ", "א"],
  ["י", "ו", "ד", "י", "ו"],
  ["blank", "ת", "ו", "ד", "נ"],
  ["blank", "ר", "מ", "י", "ה"],
]

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-04-10",
  "grid": fixedWords,
  "rowClues": [
    "הוא שונא דרדסים",
    "זה הקטן תרנגול יהיה",
    "משהו שעושים בתא פרטי בכנסיה",
    "נעות ו___ (לא מוצאות את עצמן)",
    "לקח סיכון",
  ],
  "columnClues": [
    "מהסכינים היותר חדות במגירה",
    "מספיק, רפאל",
    "סוף עגום למי שמסתבך עם החוק",
    "״לא מוכן להתאמץ בשביל זה יותר״",
    "ישו לימד להפנות את השניה",
  ]
};  

export default puzzle; 