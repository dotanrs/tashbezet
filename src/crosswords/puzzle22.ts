import { CrosswordConfig } from "../types/crossword";

const defs = [
  "_נזקפ",
  "לשמוט",
  "איזמל",
  "חמוצ_",
  "רהמ__",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-07-17",
  "grid": fixedWords,
  "rowClues": [
    "נרשם לזכות או חובה",
    "לפי המצווה, זה מה שצריך לעשות לקרקע כל כמה זמן",
    "אחד חוצב בעץ ואחד חותך בעור",
    "״הוא אף פעם לא מרוצה״",
    "אחד שמחבב את הכינוי ב-4 מאוזן",
  ],
  "columnClues": [
    "להגיע בצורה ״אופנתית״",
    "כדאי לקחת אותה לפני שעושים דברים נמהרים",
    "מה ששומעים כשיש טיניטוס",
    "״הם אלה שעושים את כל הבעיות״",
    "מיץ ___",
  ]
};

export default puzzle;
