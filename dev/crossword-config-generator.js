/**
 * Crossword Puzzle Configuration Generator
 * 
 * This script validates and generates configuration for a 5x5 crossword puzzle.
 * Edit the rows and columns arrays below, then run the script to generate a configuration.
 */

// ===== EDIT YOUR CROSSWORD DEFINITIONS HERE =====
// Format: [definition, word] where '_' represents blank squares
// Example: ["A lovable animal", "CAT__"]

// Row definitions and words (across)
const rows = [
  ["אותה לא בוחרים", "משפחה"],
["בשביל זה יש כפילים", "פעלול"],
["כשהמים קרים מדי בשביל לשחות, זה מה שנשאר", "לטבול"],
["שם אפשרי לפעוטון של בירן", "גנלי_"],
["״כל כך מופרך״", "הזיה_"],
];

// Column definitions and words (down)
// You can either:
// 1. Leave the word empty ("") to derive it from rows, or
// 2. Specify the expected column word for extra validation
const cols = [
  ["אותה כן בוחרים", "מפלגה"],
["ערבוב של צמר ופשתן", "שעטנז"],
["תעשי את זה עם העיניים כדי לבלבל אותו", "פלבלי"],
["כל אירוע שמכבד את עצמו, בזמן האחרון", "חוויה"],
["תעשו את זה בשביל יה, כמו בשיר", "הלל__"],
];
// =================================================

// Self-executing function to generate the configuration
(function() {
  /**
   * Creates a grid from a list of words
   * @param {Array} words - Array of words (with '_' for blank squares)
   * @param {Boolean} isColumn - Whether these are column words
   * @returns {Array} 2D grid representation
   */
  function createGridFromWords(words, isColumn = false) {
    // Initialize an empty 5x5 grid
    const grid = Array(5).fill().map(() => Array(5).fill(null));
    
    // Fill the grid based on the words
    words.forEach((word, index) => {
      const letters = word.split('');
      for (let i = 0; i < 5; i++) {
        if (isColumn) {
          // For columns, we place letters vertically
          grid[i][index] = letters[i] === '_' ? 'blank' : letters[i].toUpperCase();
        } else {
          // For rows, we place letters horizontally
          grid[index][i] = letters[i] === '_' ? 'blank' : letters[i].toUpperCase();
        }
      }
    });
    
    return grid;
  }
  
  /**
   * Extract words from a grid
   * @param {Array} grid - 2D grid representation
   * @param {Boolean} getColumns - Whether to extract column words
   * @returns {Array} Extracted words
   */
  function extractWordsFromGrid(grid, getColumns = false) {
    const words = [];
    
    for (let i = 0; i < 5; i++) {
      let word = '';
      for (let j = 0; j < 5; j++) {
        const cell = getColumns ? grid[j][i] : grid[i][j];
        word += cell === 'blank' ? '_' : cell;
      }
      words.push(word);
    }
    
    return words;
  }
  
  /**
   * Checks if a word has isolated letters
   * @param {String} word - Word to check
   * @returns {Boolean} Whether the word has isolated letters
   */
  function hasIsolatedLetters(word) {
    const letterSections = word.replace(/_/g, ' ').trim().split(/\s+/).filter(s => s);
    return letterSections.some(section => section.length === 1);
  }
  
  /**
   * Displays the grid in ASCII format
   * @param {Array} rowGrid - Grid created from row words
   * @param {Array} colGrid - Grid created from column words
   * @param {Boolean} hasError - Whether there's an error to highlight
   * @returns {String} ASCII representation of the grid
   */
  function displayGrid(rowGrid, colGrid, hasError = false) {
    let output = '\n';
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const rowLetter = rowGrid[i][j] === 'blank' ? '_' : rowGrid[i][j];
        const colLetter = colGrid[i][j] === 'blank' ? '_' : colGrid[i][j];
        
        if (hasError && rowLetter !== colLetter) {
          output += `[${rowLetter}${colLetter}]`;
        } else {
          output += ` ${rowLetter} `;
        }
      }
      output += '\n';
    }
    return output;
  }
  
  /**
   * Validates and creates a crossword puzzle configuration
   * @returns {Object|null} The configuration object or null if validation fails
   */
  function createCrosswordConfig() {
    try {
      // Validate input lengths
      if (rows.length !== 5) {
        throw new Error(`Must provide exactly 5 rows (found ${rows.length})`);
      }
      if (cols.length !== 5) {
        throw new Error(`Must provide exactly 5 columns (found ${cols.length})`);
      }

      // Extract row words and definitions
      const rowWords = rows.map(row => row[1]);
      const rowDefinitions = rows.map(row => row[0]);
      const columnDefinitions = cols.map(col => col[0]);
      const columnWords = cols.map(col => col[1]);

      // Validate each row word has exactly 5 characters (including '_')
      rowWords.forEach((word, index) => {
        if (word.length !== 5) {
          throw new Error(`Row ${index + 1} word "${word}" must have exactly 5 characters`);
        }
      });
      
      // Validate provided column words (if any) have exactly 5 characters
      columnWords.forEach((word, index) => {
        if (word && word.length !== 5) {
          throw new Error(`Column ${index + 1} word "${word}" must have exactly 5 characters`);
        }
      });

      // Create grid from row words
      const rowBasedGrid = createGridFromWords(rowWords, false);
      
      // Derive column words from the row-based grid
      const derivedColumnWords = extractWordsFromGrid(rowBasedGrid, true);
      
      // If column words were provided, create a grid from them and compare
      if (columnWords.some(word => word)) {
        // Replace empty column words with derived ones
        const filledColumnWords = columnWords.map((word, index) => 
          word || derivedColumnWords[index]
        );
        
        // Create grid from column words
        const columnBasedGrid = createGridFromWords(filledColumnWords, true);
        
        // Compare grids
        let hasError = false;
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 5; j++) {
            if (rowBasedGrid[i][j] !== columnBasedGrid[i][j]) {
              hasError = true;
              const rowLetter = rowBasedGrid[i][j];
              const colLetter = columnBasedGrid[i][j];
              console.log(displayGrid(rowBasedGrid, columnBasedGrid, true));
              throw new Error(
                `Mismatch at position [${i+1},${j+1}]: ` +
                `Row ${i+1} says "${rowLetter === 'blank' ? '_' : rowLetter}" but ` +
                `Column ${j+1} says "${colLetter === 'blank' ? '_' : colLetter}"`
              );
            }
          }
        }
        
        console.log("Row and column words match perfectly!");
        console.log(displayGrid(rowBasedGrid, columnBasedGrid, false));
      }
      
      // Validate that there are no isolated letters in rows or columns
      rowWords.forEach((word, index) => {
        if (hasIsolatedLetters(word)) {
          throw new Error(`Row ${index + 1} has isolated letters which is not valid in crosswords`);
        }
      });
      
      derivedColumnWords.forEach((word, index) => {
        if (hasIsolatedLetters(word)) {
          throw new Error(`Column ${index + 1} has isolated letters which is not valid in crosswords`);
        }
      });
      
      // Create the configuration object
      const config = {
        grid: rowBasedGrid,
        rowClues: rowDefinitions,
        columnClues: columnDefinitions,
        derivedColumnWords: derivedColumnWords
      };
      
      return config;
    } catch (error) {
      console.error("Error creating configuration:", error.message);
      return null;
    }
  }

  // Generate and display the configuration
  const config = createCrosswordConfig();
  if (config) {
    console.log("Configuration created successfully!");
    
    // Create a formatted version for direct use in the React component
    const formattedConfig = {
      grid: config.grid,
      rowClues: config.rowClues,
      columnClues: config.columnClues
    };
    
    console.log("\nFormatted configuration for React component:");
    console.log(JSON.stringify(formattedConfig, null, 2));
  }

  // Make functions available globally if in browser
  if (typeof window !== 'undefined') {
    window.createCrosswordConfig = createCrosswordConfig;
    console.log("Crossword Configuration Generator loaded!");
    console.log("Edit the rows and cols arrays at the top of the file to customize your crossword.");
  }
})();
