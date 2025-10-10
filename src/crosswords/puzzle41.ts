import { CrosswordConfig } from "../types/crossword";

const defs = [
  "_בגד_",
  "שונרא",
  "קרביצ",
  "שישבת",
  "קורל_",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-11-27",
  "grid": fixedWords,
  "rowClues": [
    "סדין, פיריון או שלמה",
    "חתול ארמי",
    "אשר שכתב את ״הכלב היהודי״",
    "סופ״ש בלשון עממית",
    "יחידה חשאית בחיל האוויר",
  ],
  "columnClues": [
    "הנחיה על בקבוקי מיץ מסוימים",
    "דִיוּקו",
    "תיאור אפשרי למצב בו מורשע בפלילים מקבל תפקיד בממשלה",
    "כדרוּר",
    "רצת",
  ]
};

export default puzzle;
