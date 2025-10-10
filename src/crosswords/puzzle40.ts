import { CrosswordConfig } from "../types/crossword";

const defs = [
  "__קשב",
  "מפורר",
  "קוביד",
  "פטירה",
  "_רה__",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-11-20",
  "grid": fixedWords,
  "rowClues": [
    "משהו שלא אוהבים לתת ליריבים פוליטיים",
    "כמו הבצק בקראמבל תפוחים",
    "קורונה לועזית",
    "התעודה האחרונה שרוב האנשים יקבלו",
    "בין דו למי",
  ],
  "columnClues": [
    "סימן מסגיר שמשהו נכתב על ידי Chat GPT",
    "קוסם ספרותי (שמ)",
    "שם עממי ל-4 מאונך שנמצאת בבטן",
    "כמו הלב או הלשון",
    "אליניב, שחקן עבר ומאמן כדורגל",
  ]
};

export default puzzle;
