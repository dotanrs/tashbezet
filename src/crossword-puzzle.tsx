import React, { useState, useEffect, useRef } from 'react';

type Cell = string | 'blank';
type Grid = Cell[][];
type Selected = { row: number | null; col: number | null };
type CellStatus = boolean | null;
type CellStatusGrid = CellStatus[][];
type Direction = 'across' | 'down';

const CrosswordPuzzle = () => {
  // Sample configuration - you would pass this in as a prop in a real implementation
  const sampleConfig = {
    grid: [
      ['C', 'A', 'T', 'S', 'P'],
      ['A', 'R', 'E', 'A', 'L'],
      ['R', 'E', 'blank', 'I', 'A'],
      ['D', 'A', 'T', 'L', 'N'],
      ['S', 'M', 'A', 'S', 'H']
    ] as Grid,
    rowClues: [
      "Feline animals",
      "Actually existing",
      "Car part",
      "Information bits",
      "Hit forcefully"
    ],
    columnClues: [
      "Playing cards",
      "Metric measure",
      "Drinking vessel",
      "All over",
      "Writing implement"
    ]
  };

  // State for the user's input grid
  const [userGrid, setUserGrid] = useState<Grid>(Array(5).fill(null).map(() => Array(5).fill('')));
  // Track selected cell
  const [selected, setSelected] = useState<Selected>({ row: null, col: null });
  // Status message
  const [message, setMessage] = useState('');
  // Track cell validation status
  const [cellStatus, setCellStatus] = useState<CellStatusGrid>(Array(5).fill(null).map(() => Array(5).fill(null)));
  // Flag to indicate if check was performed
  const [isChecked, setIsChecked] = useState(false);
  // Track direction
  const [direction, setDirection] = useState<Direction>('across');
  
  // Create refs for all cells
  const cellRefs = useRef<(HTMLInputElement | null)[][]>(Array(5).fill(null).map(() => Array(5).fill(null)));
  
  // Initialize the grid with empty cells (except for blanks)
  useEffect(() => {
    const initialGrid = sampleConfig.grid.map(row => 
      row.map(cell => cell === 'blank' ? 'blank' : '')
    );
    setUserGrid(initialGrid);
  }, []);
  
  // Handle cell selection and direction changes
  const handleCellClick = (row: number, col: number) => {
    if (userGrid[row][col] === 'blank') return;

    if (selected.row === row && selected.col === col) {
      // If clicking the same cell, switch direction
      setDirection(prev => prev === 'across' ? 'down' : 'across');
    } else {
      setSelected({ row, col });
      // Keep the same direction when moving to a new cell
    }
    
    const cellRef = cellRefs.current[row]?.[col];
    if (cellRef) {
      cellRef.focus();
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (row: number, col: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && userGrid[row][col] === '') {
      // Move backwards based on direction
      if (direction === 'across' && col > 0) {
        let newCol = col - 1;
        while (newCol >= 0 && userGrid[row][newCol] === 'blank') {
          newCol--;
        }
        if (newCol >= 0) {
          setSelected({ row, col: newCol });
          cellRefs.current[row][newCol]?.focus();
        }
      } else if (direction === 'down' && row > 0) {
        let newRow = row - 1;
        while (newRow >= 0 && userGrid[newRow][col] === 'blank') {
          newRow--;
        }
        if (newRow >= 0) {
          setSelected({ row: newRow, col });
          cellRefs.current[newRow][col]?.focus();
        }
      }
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      setDirection('across');
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      setDirection('down');
    }
  };
  
  // Handle key input
  const handleKeyInput = (row: number, col: number, value: string) => {
    if (userGrid[row][col] === 'blank') return;
    
    // Allow only letters
    if (value === '' || /^[A-Za-z]$/.test(value)) {
      const newGrid = [...userGrid];
      newGrid[row][col] = value.toUpperCase();
      setUserGrid(newGrid);
      
      // If check was performed, update the status of this cell
      if (isChecked) {
        const newCellStatus = [...cellStatus];
        if (value === '') {
          newCellStatus[row][col] = null;
        } else {
          newCellStatus[row][col] = (value.toUpperCase() === sampleConfig.grid[row][col]);
        }
        setCellStatus(newCellStatus);
      }
      
      // Move to next cell if letter entered
      if (value !== '') {
        if (direction === 'across' && col < 4) {
          let newCol = col + 1;
          while (newCol < 5 && userGrid[row][newCol] === 'blank') {
            newCol++;
          }
          if (newCol < 5) {
            setSelected({ row, col: newCol });
            cellRefs.current[row][newCol]?.focus();
          }
        } else if (direction === 'down' && row < 4) {
          let newRow = row + 1;
          while (newRow < 5 && userGrid[newRow][col] === 'blank') {
            newRow++;
          }
          if (newRow < 5) {
            setSelected({ row: newRow, col });
            cellRefs.current[newRow][col]?.focus();
          }
        }
      }
    }
  };

  // Check if the puzzle is solved correctly
  const checkPuzzle = () => {
    let isCorrect = true;
    const newCellStatus = Array(5).fill(null).map(() => Array(5).fill(null)) as CellStatusGrid;
    
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (sampleConfig.grid[row][col] !== 'blank') {
          // Only mark as incorrect if the user entered a wrong letter
          // Leave blank cells as null status
          if (userGrid[row][col] !== '') {
            const cellCorrect = userGrid[row][col] === sampleConfig.grid[row][col];
            newCellStatus[row][col] = cellCorrect;
            if (!cellCorrect) {
              isCorrect = false;
            }
          } else {
            isCorrect = false;
          }
        }
      }
    }
    
    setCellStatus(newCellStatus);
    setIsChecked(true);
    setMessage(isCorrect ? 'Congratulations! The puzzle is correct!' : 'Not quite right. Keep trying!');
  };

  // Get the background color for a cell based on selection and validation status
  const getCellBackgroundColor = (row: number, col: number, isSelected: boolean) => {
    if (userGrid[row][col] === 'blank') {
      return 'bg-black';
    }
    
    if (isChecked && cellStatus[row][col] !== null) {
      return cellStatus[row][col] ? 'bg-green-200' : 'bg-red-200';
    }
    
    if (isSelected) {
      return 'bg-blue-200';
    } else if (
      (direction === 'across' && selected.row === row) ||
      (direction === 'down' && selected.col === col)
    ) {
      return 'bg-blue-100';
    }
    
    return 'bg-white';
  };
  
  return (
    <div className="flex flex-col items-center p-4 w-full max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">5×5 Crossword Puzzle</h1>
      
      {/* Clues display */}
      <div className="mb-4 p-4 bg-gray-100 rounded w-full">
        {selected.row !== null && direction === 'across' && (
          <div className="mb-2">
            <span className="font-bold">Across:</span> {sampleConfig.rowClues[selected.row]}
          </div>
        )}
        {selected.col !== null && direction === 'down' && (
          <div>
            <span className="font-bold">Down:</span> {sampleConfig.columnClues[selected.col]}
          </div>
        )}
      </div>
      
      {/* Crossword grid */}
      <div className="grid grid-cols-5 gap-0 border-2 border-black mb-4">
        {userGrid.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div 
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-12 h-12 border border-gray-400 flex items-center justify-center
                ${getCellBackgroundColor(rowIndex, colIndex, selected.row === rowIndex && selected.col === colIndex)}
              `}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell !== 'blank' && (
                <input
                  ref={el => cellRefs.current[rowIndex][colIndex] = el}
                  type="text"
                  value={cell}
                  onChange={(e) => handleKeyInput(rowIndex, colIndex, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(rowIndex, colIndex, e)}
                  className="w-full h-full text-center text-xl font-bold outline-none bg-transparent"
                  maxLength={1}
                />
              )}
            </div>
          ))
        ))}
      </div>
      
      {/* Check button */}
      <button 
        onClick={checkPuzzle}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Check Puzzle
      </button>
      
      {/* Status message */}
      {message && (
        <div className={`mt-4 p-2 rounded ${message.includes('Congratulations') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default CrosswordPuzzle;
