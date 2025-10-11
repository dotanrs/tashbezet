import { CrosswordConfig } from "../types/crossword";

const defs = [
  "קאע__",
  "רקלבד",
  "וונדר",
  "לואיס",
  "_הנרי",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-12-04",
  "grid": fixedWords,
  "rowClues": [
    "בקעה בערבית, למשל אל-יהוד שהוקמה מחוץ לצנעה",
    "תשובה שלילית לשאלה: ״אפשר גם ביחד?״",
    "סטיבי, מוזיקאי שמחזיק בשיא הזכיות בגראמי",
    "המילטון שמחזיק בשיא הנצחונות בפורמולה 1",
    "קיסינג׳ר שהיה היהודי הראשון שכיהן כמזכיר המדינה בארה״ב",
  ],
  "columnClues": [
    "לואיס שכתוב את אליסה בארץ הפלאות",
    "להקה סקנדינבית שהתפרסמה בזכות השיר Barbie Girl",
    "אפשרות הגשה במטבח ההודי",
    "איפה גר החזיר?",
    "מרסי מנשואים פלוס, לאחר שנישאה בשנית",
  ]
};

export default puzzle;
