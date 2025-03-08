import React, { useState, useEffect, useRef } from 'react';
import { Grid, Selected, CellStatusGrid, Direction, CrosswordConfig, SavedPuzzleState } from './types/crossword';
import { findNextCell, findNextDefinition, handleArrowNavigation } from './utils/navigationUtils';
import { clearPuzzleState, loadPuzzleState, savePuzzleState } from './utils/storageUtils';
import { createEmptyGrid, createEmptyCellStatus, checkPuzzle, revealPuzzle } from './utils/puzzleUtils';
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
  const [userGrid, setUserGrid] = useState<Grid>(createEmptyGrid());
  // Track selected cell
  const [selected, setSelected] = useState<Selected>({ row: 0, col: 0 });
  // Status message
  const [message, setMessage] = useState('');
  // Track cell validation status
  const [cellStatus, setCellStatus] = useState<CellStatusGrid>(createEmptyCellStatus());
  // Track direction
  const [direction, setDirection] = useState<Direction>('across');

  // Create refs for all cells
  const cellRefs = useRef<(HTMLInputElement | null)[][]>(Array(5).fill(null).map(() => Array(5).fill(null)));

  const getNewGrid = (puzzleId: PuzzleId): Grid => {
    return puzzles[puzzleId].grid.map((row, rowIndex) => 
      row.map((cell) => {
        if (cell === 'blank') return 'blank';
        return '';
      })
    );
  }

  const mergeStateWithPuzzle = (puzzleId: PuzzleId, savedState: SavedPuzzleState): Grid => {
    try {
      const newGrid = puzzles[puzzleId].grid.map((row, rowIndex) => 
        row.map((cell, colIndex) => {
          if (cell === 'blank') return 'blank';
          if (savedState.userGrid[rowIndex][colIndex] === 'blank') {
            console.log(`Invalid puzzle state: {savedState}`);
            throw new Error('Invalid puzzle state');
          };
          return savedState.userGrid[rowIndex][colIndex] || '';
        })
      );
      return newGrid;
    } catch (error) {
      console.error('Error merging state with puzzle:', error);
      clearPuzzleState(puzzleId);
      return getNewGrid(puzzleId);
    }
  }

  // Modify useEffect to only run when a puzzle is selected
  useEffect(() => {
    if (!currentPuzzleId) return;

    const getUpdatedGrid = () => {
      const savedState = loadPuzzleState(currentPuzzleId);
      if (savedState && puzzles[savedState.puzzleId]) {
        setCurrentConfig(puzzles[savedState.puzzleId]);
        const newGrid = mergeStateWithPuzzle(currentPuzzleId, savedState);
        setUserGrid(newGrid);
        return newGrid;
      } else {
        const initialGrid = puzzles[currentPuzzleId].grid.map(row => 
          row.map(cell => cell === 'blank' ? 'blank' : '')
        );
        setUserGrid(initialGrid);
        setCellStatus(createEmptyCellStatus());
        return initialGrid;
      }
    }
    const newGrid = getUpdatedGrid();

    setSelected({ row: 0, col: 0 });
    setDirection('across');
    setMessage('');
    resetCellStatus();
    checkComplete(newGrid, currentPuzzleId);
  }, [currentPuzzleId]);

  // Modify handlePuzzleChange
  const handlePuzzleChange = (puzzleId: PuzzleId) => {
    setCurrentPuzzleId(puzzleId);
    setCurrentConfig(puzzles[puzzleId]);
    setGameStarted(true);
  };

  const handlePuzzleReset = () => {
    if (currentPuzzleId == null) {
      return;
    }
    clearPuzzleState(currentPuzzleId);
    const newGrid = getNewGrid(currentPuzzleId);
    setUserGrid(newGrid);
    setCellStatus(createEmptyCellStatus());
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

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!selected) return;

    const row = selected.row;
    const col = selected.col;

    // Handle tab key
    if (e.key === 'Tab') {
      e.preventDefault(); // Prevent losing focus
      const { row: nextRow, col: nextCol, newDirection } = findNextDefinition(userGrid, row, col, direction, e.shiftKey);
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
      if (currentPuzzleId) {
        checkComplete(newGrid, currentPuzzleId, true);
      }
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

    // Don't allow changes to correct cells
    if (cellStatus[row][col] === true) {
      return;
    }

    // Handle both new input and overwriting existing values
    // On mobile, when overwriting, the value might include the previous character
    const lastChar = value.slice(-1);
    
    // Check if the last character is a Hebrew letter
    if (/^[א-ת]$/.test(lastChar)) {
      const newGrid = [...userGrid];
      newGrid[row][col] = lastChar;
      setUserGrid(newGrid);

      // Clear validation state for this cell
      const newCellStatus = [...cellStatus];
      newCellStatus[row][col] = null;
      setCellStatus(newCellStatus);

      // Move to next cell after input (for both keyboard and mobile)
      moveToNextCell(row, col);
      if (currentPuzzleId) {
        checkComplete(newGrid, currentPuzzleId, true);
      }
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
    setCellStatus(createEmptyCellStatus());
  };

  const checkComplete = (grid: Grid, puzzleId: PuzzleId, allowConfetti: boolean = false) => {  
    const result = checkPuzzle(grid, currentConfig);
    if (result.isCorrect) {
      setCellStatus(result.newCellStatus);
      setMessage('כל הכבוד, פתרת את התשבץ!');
      if (allowConfetti) {
        setShowConfetti(true);
      }
    }
    savePuzzleState(puzzleId, {
      userGrid: grid,
      cellStatus: result.newCellStatus,
      isComplete: result.isCorrect,
      puzzleId,
    });
  };

  const markPuzzle = () => {
    const result = checkPuzzle(userGrid, currentConfig);
    setCellStatus(result.newCellStatus);
  };

  // Add reveal functionality
  const handleReveal = () => {
    if (!currentConfig) return;
    
    const { newGrid, newCellStatus } = revealPuzzle(userGrid, cellStatus, currentConfig);
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
          style={{ direction: 'rtl' }}
        >
          מתחילים?
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
                <button
                  onClick={handlePuzzleReset}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  איפוס
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
