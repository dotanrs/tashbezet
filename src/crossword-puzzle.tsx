import React, { useState, useEffect, useRef } from 'react';
import { Grid, Selected, CellStatusGrid, Direction, CrosswordConfig } from './types/crossword';
import { findNextCell, handleArrowNavigation } from './utils/crosswordNavigation';
import { loadPuzzleState, savePuzzleState } from './utils/storage';
import ReactConfetti from 'react-confetti';
import { puzzles, PuzzleId } from './crosswords';
import PreviousPuzzles from './components/PreviousPuzzles';
import CrosswordGrid from './components/CrosswordGrid';

const CrosswordPuzzle = () => {
  // Add new state for game started
  const [gameStarted, setGameStarted] = useState(false);
  // Modify current puzzle state to be null initially
  const [currentPuzzleId, setCurrentPuzzleId] = useState<PuzzleId | null>(null);
  const [currentConfig, setCurrentConfig] = useState<CrosswordConfig | null>(null);

  // State for the user's input grid
  const [userGrid, setUserGrid] = useState<Grid>(Array(5).fill(null).map(() => Array(5).fill('')));
  // Track selected cell
  const [selected, setSelected] = useState<Selected>({ row: 0, col: 0 });
  // Status message
  const [message, setMessage] = useState('');
  // Track cell validation status
  const [cellStatus, setCellStatus] = useState<CellStatusGrid>(Array(5).fill(null).map(() => Array(5).fill(null)));
  // Track direction
  const [direction, setDirection] = useState<Direction>('across');

  // Create refs for all cells
  const cellRefs = useRef<(HTMLInputElement | null)[][]>(Array(5).fill(null).map(() => Array(5).fill(null)));
  
  // Modify useEffect to only run when a puzzle is selected
  useEffect(() => {
    if (!currentPuzzleId) return;

    const savedState = loadPuzzleState(currentPuzzleId);
    
    if (savedState && puzzles[savedState.puzzleId]) {
      setCurrentConfig(puzzles[savedState.puzzleId]);
      const newGrid = puzzles[savedState.puzzleId].grid.map((row, rowIndex) => 
        row.map((cell, colIndex) => {
          if (cell === 'blank') return 'blank';
          return savedState.userGrid[rowIndex][colIndex] || '';
        })
      );
      setUserGrid(newGrid);
      checkComplete();
    } else {
      const initialGrid = puzzles[currentPuzzleId].grid.map(row => 
        row.map(cell => cell === 'blank' ? 'blank' : '')
      );
      setUserGrid(initialGrid);
      setCellStatus(Array(5).fill(null).map(() => Array(5).fill(null)));
    }
    
    setSelected({ row: 0, col: 0 });
    setDirection('across');
    setMessage('');
    resetCellStatus();
  }, [currentPuzzleId]);

  // Save puzzle state whenever it changes
  useEffect(() => {
    if (!currentPuzzleId || !currentConfig) return;
    
    const isComplete = cellStatus.every((row, rowIndex) => 
      row.every((status, colIndex) => {
        if (currentConfig.grid[rowIndex][colIndex] === 'blank') {
          return true;
        }
        return status === true;
      })
    );
    
    if (currentPuzzleId) {
      savePuzzleState(currentPuzzleId, {
        userGrid,
        cellStatus,
        isComplete,
        puzzleId: currentPuzzleId
      });
    }
  }, [currentPuzzleId, userGrid, cellStatus, currentConfig]);

  // Modify handlePuzzleChange
  const handlePuzzleChange = (puzzleId: PuzzleId) => {
    setCurrentPuzzleId(puzzleId);
    setCurrentConfig(puzzles[puzzleId]);
    setGameStarted(true);
  };

  // Add handleStartGame
  const handleStartGame = () => {
    const firstPuzzleId = Object.keys(puzzles)[0] as PuzzleId;
    handlePuzzleChange(firstPuzzleId);
  };

  // Handle cell selection and direction changes
  const handleCellClick = (row: number, col: number) => {
    if (userGrid[row][col] === 'blank') return;

    if (selected && selected.row === row && selected.col === col) {
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

  const findFirstAvailableCell = (row: number, col: number, direction: Direction): { row: number; col: number; newDirection: Direction } => {
    if (direction === 'across') {
      // Search along the row
      for (let c = 0; c < 5; c++) {
        if (userGrid[row][c] === 'blank') continue;
        if (userGrid[row][c] === '') {
          return { row, col: c, newDirection: 'across' };
        };
      }

      if (row < 4) {
        return findFirstAvailableCell(row + 1, 0, direction);
      } else {
        return findFirstAvailableCell(0, 0, "down");
      }
    } else {
      // Search along the column
      for (let r = 0; r < 5; r++) {
        if (userGrid[r][col] === 'blank') continue;
        if (userGrid[r][col] === '') {
          return { row: r, col, newDirection: 'down' };
        }
      }
      if (col < 4) {
        return findFirstAvailableCell(0, col + 1, direction);
      } else {
        return findFirstAvailableCell(0, 0, "across");
      }
    }
  };

  const findNextDefinition = (currentRow: number, currentCol: number, currentDirection: Direction, forward: boolean = false): { row: number; col: number; newDirection: Direction } => {
    if (currentDirection === 'across') {
      // Moving through rows
      let newRow = currentRow + (forward ? -1 : 1);

      // If we went past the edges, switch to columns
      if (newRow < 0 || newRow >= 5) {
        // Switch to down direction
        const newCol = forward ? 4 : 0;  // Start from first/last column
        const startDirection = 'down';
        // Find first available cell in the column
        return findFirstAvailableCell(0, newCol, startDirection);
      }

      // Stay in across mode, find first available cell in the new row
      return findFirstAvailableCell(newRow, 0, 'across');
    } else {
      // Moving through columns
      let newCol = currentCol + (forward ? -1 : 1);

      // If we went past the edges, switch to rows
      if (newCol < 0 || newCol >= 5) {
        // Switch to across direction
        const newRow = forward ? 4 : 0;  // Start from first/last row
        const startDirection = 'across';
        // Find first available cell in the row
        return findFirstAvailableCell(newRow, newCol, startDirection);
      }

      // Stay in down mode, find first available cell in the new column
      return findFirstAvailableCell(0, newCol, 'down');
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!selected) return;

    const row = selected.row;
    const col = selected.col;

    // Handle tab key
    if (e.key === 'Tab') {
      e.preventDefault(); // Prevent losing focus
      const { row: nextRow, col: nextCol, newDirection } = findNextDefinition(row, col, direction, e.shiftKey);
      setSelected({ row: nextRow, col: nextCol });
      setDirection(newDirection);
      cellRefs.current[nextRow][nextCol]?.focus();
      return;
    }

    // Don't allow changes to correct cells
    if (cellStatus[row][col] === true) {
      e.preventDefault();
      return;
    }

    // Handle letter keys - now checking for Hebrew letters
    if (e.key.length === 1 && /^[א-ת]$/.test(e.key)) {
      e.preventDefault();
      const value = e.key;  // No need for toUpperCase() as Hebrew doesn't have case
      const newGrid = [...userGrid];
      newGrid[row][col] = value;
      setUserGrid(newGrid);

      // Clear validation state for this cell
      const newCellStatus = [...cellStatus];
      newCellStatus[row][col] = null;
      setCellStatus(newCellStatus);

      moveToNextCell(row, col);
      checkComplete()
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
    if (!selected) return;

    const row = selected.row;
    const col = selected.col;
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

  const findNextEditableCell = (
    row: number,
    col: number,
    direction: Direction,
    forward: boolean = false
  ): { row: number; col: number } | null => {
    let nextCell = findNextCell(userGrid, row, col, direction, forward);

    // Keep looking for the next cell until we find an editable one or run out of cells
    while (nextCell && cellStatus[nextCell.row][nextCell.col] === true) {
      nextCell = findNextCell(userGrid, nextCell.row, nextCell.col, direction, forward);
    }

    return nextCell;
  };

  const moveToNextCell = (row: number, col: number) => {
    const nextCell = findNextEditableCell(row, col, direction, true);
    if (nextCell) {
      setSelected(nextCell);
      cellRefs.current[nextCell.row][nextCell.col]?.focus();
    }
  };

  // Track confetti state
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Add window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const resetCellStatus = () => {
    setCellStatus(Array(5).fill(null).map(() => Array(5).fill(null)));
  }

  // Modify checkPuzzle to trigger confetti
  const checkPuzzle = () => {
    if (!currentConfig) return {
      newCellStatus: Array(5).fill(null).map(() => Array(5).fill(null)), isCorrect: false
    };
    
    let isCorrect = true;
    const newCellStatus = Array(5).fill(null).map(() => Array(5).fill(null)) as CellStatusGrid;

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (currentConfig.grid[row][col] !== 'blank') {
          if (userGrid[row][col] !== '') {
            const cellCorrect = userGrid[row][col] === currentConfig.grid[row][col];
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
    return { newCellStatus, isCorrect };
  };

  const checkComplete = () => {
    const result = checkPuzzle();
    if (result.isCorrect) {
      markPuzzle();
      setMessage('כל הכבוד, פתרת את התשבץ!');
      setShowConfetti(true);
    }
  };

  const markPuzzle = () => {
    const result = checkPuzzle();
    setCellStatus(result.newCellStatus);
  };

  // Get the background color for a cell based on selection and validation status
  const getCellStyle = (row: number, col: number, isSelected: boolean | null) => {
    if (userGrid[row][col] === 'blank') {
      return 'bg-black';
    }

    if (cellStatus[row][col] !== null) {
      if (cellStatus[row][col]) {
        return 'bg-green-200';
      }
    }

    if (isSelected) {
      return 'bg-blue-200';
    } else if (
      selected && (
        (direction === 'across' && selected.row === row) ||
        (direction === 'down' && selected.col === col)
      )
    ) {
      return 'bg-blue-100';
    }

    return 'bg-white';
  };

  // Helper function to convert between display and logical column positions
  const displayToLogicalCol = (displayCol: number) => 4 - displayCol;

  // Get all available puzzle IDs
  const puzzleIds = Object.keys(puzzles) as PuzzleId[];

  // Add function to check puzzle status
  const getPuzzleStatus = (puzzleId: PuzzleId) => {
    const savedState = loadPuzzleState(puzzleId);
    if (!savedState) return null;
    return savedState.isComplete ? '✓' : '•';
  };

  // Add reveal functionality
  const handleReveal = () => {
    if (!currentConfig) return;
    
    const newGrid = [...userGrid];
    const newCellStatus = [...cellStatus];

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (currentConfig.grid[row][col] !== 'blank') {
          if (cellStatus[row][col] !== true) {
            newGrid[row][col] = currentConfig.grid[row][col];
            newCellStatus[row][col] = true;
          }
        }
      }
    }

    setUserGrid(newGrid);
    setCellStatus(newCellStatus);
  };

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-lg mx-auto">
      <h1 className="text-3xl mb-6">תשבצת</h1>

      {!gameStarted ? (
        <button
          onClick={handleStartGame}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg text-xl hover:bg-blue-600 transition-colors"
        >
          Ready to start?
        </button>
      ) : (
        <>
          {showConfetti && (
            <ReactConfetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={200}
              gravity={0.2}
              colors={['#FFD700', '#FFA500', '#FF6347', '#87CEEB', '#98FB98']}
            />
          )}

          {currentConfig && (
            <>
              <CrosswordGrid
                userGrid={userGrid}
                cellStatus={cellStatus}
                selected={selected}
                direction={direction}
                cellRefs={cellRefs}
                onCellClick={handleCellClick}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />

              {/* Clues display */}
              <div className="mb-4 p-4 bg-gray-100 rounded w-full direction-rtl text-right">
                {selected && direction === 'across' && (
                  <div className="mb-2">
                    <span className="font-bold">מאוזן:</span> {currentConfig.rowClues[selected.row]}
                  </div>
                )}
                {selected && direction === 'down' && (
                  <div>
                    <span className="font-bold">מאונך:</span> {currentConfig.columnClues[selected.col]}
                  </div>
                )}
              </div>

              {/* Buttons section */}
              <div className="flex gap-2">
                <button
                  onClick={markPuzzle}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  בדיקה
                </button>
                <button
                  onClick={handleReveal}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  גילוי
                </button>
              </div>

              {/* Status message */}
              {message && (
                <div className="mt-4 p-2 rounded bg-green-100 text-green-800">
                  {message}
                </div>
              )}

              <PreviousPuzzles
                currentPuzzleId={currentPuzzleId}
                onPuzzleChange={handlePuzzleChange}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CrosswordPuzzle;
