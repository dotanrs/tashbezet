import React, { useState, useEffect, useRef } from 'react';
import { Cell, Grid, Selected, CellStatus, CellStatusGrid, Direction, CrosswordConfig } from './types/crossword';
import { findNextCell, handleArrowNavigation } from './utils/crosswordNavigation';

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
  
  const findNextDefinition = (currentRow: number, currentCol: number, currentDirection: Direction, backward: boolean = false): { row: number; col: number; newDirection: Direction } => {
    if (currentDirection === 'across') {
      // Moving through rows
      let newRow = currentRow + (backward ? -1 : 1);
      
      // If we went past the edges, switch to columns
      if (newRow < 0 || newRow >= 5) {
        // Switch to down direction
        const newCol = backward ? 4 : 0;  // Start from first/last column
        const newRow = backward ? 4 : 0;  // Start from first/last row
        return { row: newRow, col: newCol, newDirection: 'down' };
      }
      
      // Stay in across mode, keep same column position
      return { row: newRow, col: currentCol, newDirection: 'across' };
    } else {
      // Moving through columns
      let newCol = currentCol + (backward ? -1 : 1);
      
      // If we went past the edges, switch to rows
      if (newCol < 0 || newCol >= 5) {
        // Switch to across direction
        const newRow = backward ? 4 : 0;  // Start from first/last row
        const newCol = backward ? 4 : 0;  // Start from first/last column
        return { row: newRow, col: newCol, newDirection: 'across' };
      }
      
      // Stay in down mode, keep same row position
      return { row: currentRow, col: newCol, newDirection: 'down' };
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const row = selected.row!;
    const col = selected.col!;
    
    // Handle tab key
    if (e.key === 'Tab') {
      e.preventDefault(); // Prevent losing focus
      const { row: nextRow, col: nextCol, newDirection } = findNextDefinition(row, col, direction, e.shiftKey);
      
      // Skip blank cells
      if (userGrid[nextRow][nextCol] === 'blank') {
        const { row: skipRow, col: skipCol, newDirection: skipDirection } = 
          findNextDefinition(nextRow, nextCol, newDirection, e.shiftKey);
        setSelected({ row: skipRow, col: skipCol });
        setDirection(skipDirection);
        cellRefs.current[skipRow][skipCol]?.focus();
      } else {
        setSelected({ row: nextRow, col: nextCol });
        setDirection(newDirection);
        cellRefs.current[nextRow][nextCol]?.focus();
      }
      return;
    }

    // Handle letter keys
    if (e.key.length === 1 && /^[A-Za-z]$/.test(e.key)) {
      e.preventDefault();
      const value = e.key.toUpperCase();
      const newGrid = [...userGrid];
      newGrid[row][col] = value;
      setUserGrid(newGrid);
      
      // Clear validation state for this cell
      const newCellStatus = [...cellStatus];
      newCellStatus[row][col] = null;
      setCellStatus(newCellStatus);
      
      moveToNextCell(row, col);
      return;
    }

    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      const newGrid = [...userGrid];
      const newCellStatus = [...cellStatus];

      if (userGrid[row][col] === '') {
        // If current cell is empty, move to and clear previous cell
        const prevCell = findNextCell(userGrid, row, col, direction, false);
        if (prevCell) {
          newGrid[prevCell.row][prevCell.col] = '';
          newCellStatus[prevCell.row][prevCell.col] = null;
          setSelected(prevCell);
          cellRefs.current[prevCell.row][prevCell.col]?.focus();
        }
      } else {
        // If current cell has content, just clear it
        newGrid[row][col] = '';
        newCellStatus[row][col] = null;
      }

      setUserGrid(newGrid);
      setCellStatus(newCellStatus);
      return;
    }

    // Handle arrow keys
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      const { newDirection, newPosition } = handleArrowNavigation(e.key, direction, row, col, userGrid);
      
      if (newDirection) {
        setDirection(newDirection);
      }
      if (newPosition) {
        setSelected(newPosition);
        cellRefs.current[newPosition.row][newPosition.col]?.focus();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const row = selected.row!;
    const col = selected.col!;
    const value = e.target.value;

    if (userGrid[row][col] === 'blank') return;
    
    // Only handle actual input changes, not backspace
    // (backspace is handled in handleKeyDown)
    if (value !== '') {
      const newGrid = [...userGrid];
      newGrid[row][col] = value.toUpperCase();
      setUserGrid(newGrid);
      
      // Clear validation state for this cell
      const newCellStatus = [...cellStatus];
      newCellStatus[row][col] = null;
      setCellStatus(newCellStatus);
    }
  };

  const moveToNextCell = (row: number, col: number) => {
    const nextCell = findNextCell(userGrid, row, col, direction, true);
    if (nextCell) {
      setSelected(nextCell);
      cellRefs.current[nextCell.row][nextCell.col]?.focus();
    }
  };

  // Check if the puzzle is solved correctly
  const checkPuzzle = () => {
    let isCorrect = true;
    const newCellStatus = Array(5).fill(null).map(() => Array(5).fill(null)) as CellStatusGrid;
    
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (sampleConfig.grid[row][col] !== 'blank') {
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
    setMessage(isCorrect ? 'Congratulations! The puzzle is correct!' : 'Not quite right. Keep trying!');
  };

  // Get the background color for a cell based on selection and validation status
  const getCellBackgroundColor = (row: number, col: number, isSelected: boolean) => {
    if (userGrid[row][col] === 'blank') {
      return 'bg-black';
    }
    
    if (cellStatus[row][col] !== null) {
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
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
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
