import { CrosswordConfig } from "../types/crossword";

const defs = [
  "השנאי",
  "מרבלו",
  "כמצרה",
  "אורגנ",
  "נטויה",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-09-18",
  "grid": fixedWords,
  "rowClues": [
    "אחד החשודים בהפסקות חשמל",
    "שם אפשרי לגיבור על שנלחם במוצרים מזיקים בכלי מיסוי",
    "דרך לתאר משהו שמפריד בין שני חלקי יבשה",
    "מרעיד את האוויר בכנסיה",
    "מה מצב הזרוע? (סימן שאפשר להמשיך)",
  ],
  "columnClues": [
    "צעקה אפשרית שנשמעת אחרי דפיקה בדלת",
    "מקבילה גברית סבירה למילת גנאי שאין לה מקבילה גברית",
    "היו מנועים מלתפקד",
    "נתרע ממשהו ברמה הגופנית",
    "האפיפיורית הראשונה והיחידה (אם היא היתה קיימת)",
  ]
};

export default puzzle;
