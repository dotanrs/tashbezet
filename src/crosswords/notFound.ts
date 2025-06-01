import { CrosswordConfig } from "../types/crossword";

const defs = [
  "_נמצא",
  "_שבור",
  "_וודו",
  "חביק_",
  "נהמת_",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "404",
  "grid": fixedWords,
  "rowClues": [
    "404 - התשבץ לא ____ (מה שחווית כרגע)",
    "בהמשך ל1 מאוזן - כנראה שהלינק שלך ____",
    "סיבה ופתרון אפשריים למצב",
    "בינתיים אפשר להתכרבל עם משהו כזה",
    "סימן שהתרגזת באמת",
  ],
  "columnClues": [
    "קיווינו שבהודעת שגיאה הזאת יהיה כזה",
    "מקווים שעוד _____ לראותך בתשבצים אחרים",
    "מקרה שבו נכנסת בכוונה ללינק שבור כדי להגיע לפה, למשל",
    "אם מישהי אמרה לך שהלינק שבור, אז כנראה שהיא -",
    "אהרון הספרדי",
  ]
};

export default puzzle;
