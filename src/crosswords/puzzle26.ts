import { CrosswordConfig, DefinitionHint } from "../types/crossword";

const defs = [
  "_אגדו",
  "_רוקי",
  "מגשדה",
  "גודו_",
  "_נמק_",
]

const words = defs.map(def => def.split("").reverse().map(char => char === "_" ? "blank" : char));

const fixedWords = words.map(word => word.reverse());

const puzzle: CrosswordConfig = {
  name: "2025-08-15",
  "grid": fixedWords,
  "rowClues": [
    "מה שבא לפני ״איש קטן עושה קפה״",
    "עם חולם הוא גיבור סרטי פעולה, עם שורוק הוא טירון בNBA",
    "כינוי אפשרי ל-1 מאונך שפועל רק בחוץ",
    "אחד שמחכים לו בתיאטרון האבסורד",
    "תוצאה אפשרית של בטלה ממושכת (או של 3 מאוזן)",
  ],
  "columnClues": [
    "קוסם",
    "מה שלא היה טוב באירוע שאין בו מספיק כיסאות, אולי",
    "כינוי אפשרי לקריש",
    "לפי איזה חוק אסור להגיד ״אני ילך״?",
    "בספרדית: דרך. באנגלית: דרך. אבל לא אותה דרך",
  ],
};

export default puzzle;
