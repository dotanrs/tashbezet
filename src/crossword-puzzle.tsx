import React, { useState, useEffect, useRef } from 'react';
import { Grid, Selected, CellStatusGrid, Direction, CrosswordConfig, SavedPuzzleState } from './types/crossword';
import { findNextCell, findNextDefinition, handleArrowNavigation } from './utils/navigationUtils';
import { clearPuzzleState, loadPuzzleState, savePuzzleState } from './utils/storageUtils';
import { createEmptyGrid, createEmptyCellStatus, checkPuzzle } from './utils/puzzleUtils';
import ReactConfetti from 'react-confetti';
import { puzzles, PuzzleId } from './crosswords';
import PreviousPuzzles from './components/PreviousPuzzles';
import CrosswordGrid from './components/CrosswordGrid';
import { findNextDirectCell } from './utils/crosswordNavigation';

const CrosswordPuzzle = () => {
  // Add new state for game started
  const [gameStarted, setGameStarted] = useState(false);
  // Modify current puzzle state to be null initially
  const [currentPuzzleId, setCurrentPuzzleId] = useState<PuzzleId | null>(null);
  const [currentConfig, setCurrentConfig] = useState<CrosswordConfig | null>(null);

  // State for the user's input grid
  const [userGrid, setUserGrid] = useState<Grid>(createEmptyGrid());
  // Track selected cell
  const [selected, setSelected] = useState<Selected>(null);
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
        setCellStatus(savedState.cellStatus);
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
    setMessage('');
    const newGrid = getUpdatedGrid();
    resetCellStatus();

    const firstCell = placeCursor(newGrid);
    if (firstCell) {
      setSelected(firstCell);
      cellRefs.current[firstCell.row][firstCell.col]?.focus();
    } else {
      // We should never get here
    }

    setDirection('across');
    checkComplete(newGrid, currentPuzzleId);
  }, [currentPuzzleId]);

  // Modify handlePuzzleChange
  const handlePuzzleChange = (puzzleId: PuzzleId) => {
    setCurrentPuzzleId(puzzleId);
    setCurrentConfig(puzzles[puzzleId]);
    setGameStarted(true);
  };

  const handlePuzzleReset = () => {
    if (currentPuzzleId === null) {
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

  const placeCursor = (grid: Grid) => {
    // TODO: Not clear why the other methods are so complicated
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (grid[row][col] !== 'blank') {
          return { row, col };
        }
      }
    }
    return null;
  }

  const findNextEditableCell = (
    row: number,
    col: number,
    direction: Direction,
    forward: boolean = false
  ): { row: number; col: number } | null => {
    if (!hasEditableCells()) {
      return null;
    }

    let nextCell = findNextDirectCell(userGrid, row, col, direction, forward);

    // Only skip blank cells, allow navigation through completed cells
    while (nextCell && (
      userGrid[nextCell.row][nextCell.col] === 'blank' ||
      cellStatus[nextCell.row][nextCell.col] === true ||
      (userGrid[nextCell.row][nextCell.col] !== '' && cellStatus[nextCell.row][nextCell.col] !== false)
    )) {
      nextCell = findNextDirectCell(userGrid, nextCell.row, nextCell.col, direction, forward);
    }

    return nextCell;
  };

  const hasEditableCells = (): boolean => {
    if (!currentConfig) return false;
    
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (currentConfig.grid[row][col] !== 'blank' && cellStatus[row][col] !== true) {
          return true;
        }
      }
    }
    return false;
  };

  const moveToNextCell = (row: number, col: number) => {
    const nextCell = findNextEditableCell(row, col, direction, true);
    if (nextCell) {
      setSelected(nextCell);
      cellRefs.current[nextCell.row][nextCell.col]?.focus();
    } else if (hasEditableCells()) {
      // Only try to find next definition if there are still editable cells somewhere
      const { row: nextRow, col: nextCol, newDirection } = findNextDefinition(userGrid, cellStatus, row, col, direction, false);
      setSelected({ row: nextRow, col: nextCol });
      setDirection(newDirection);
      cellRefs.current[nextRow][nextCol]?.focus();
    }
    // If no editable cells left, do nothing
  };

  const normalizeLetter = (letter: string) => {
    if (letter === 'ם') return 'מ';
    if (letter === 'ץ') return 'צ';
    if (letter === 'ן') return 'נ';
    if (letter === 'ף') return 'פ';
    if (letter === 'ך') return 'כ';
    
    return letter;
  }

  // Shared function for handling letter input
  const handleLetterInput = (letter: string) => {
    if (!selected) return;
    
    const row = selected.row;
    const col = selected.col;

    // Don't handle input for blank or correct cells
    if (userGrid[row][col] === 'blank' || cellStatus[row][col] === true) {
      return;
    }

    // Validate Hebrew letter
    if (/^[א-ת]$/.test(letter)) {
      const newGrid = [...userGrid];
      newGrid[row][col] = normalizeLetter(letter);
      setUserGrid(newGrid);

      // Clear validation state for this cell
      const newCellStatus = [...cellStatus];
      newCellStatus[row][col] = null;
      setCellStatus(newCellStatus);

      // Move to next cell and check completion
      moveToNextCell(row, col);
      if (currentPuzzleId) {
        checkComplete(newGrid, currentPuzzleId, true);
      }
    }
  };

  const moveToNextDefinition = (forward: boolean) => {
    if (!selected) return;
    const { row: nextRow, col: nextCol, newDirection } = findNextDefinition(userGrid, cellStatus, selected.row, selected.col, direction, forward);
    setSelected({ row: nextRow, col: nextCol });
    setDirection(newDirection);
    cellRefs.current[nextRow][nextCol]?.focus();
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!selected) return;

    const row = selected.row;
    const col = selected.col;

    // Handle tab key
    if (e.key === 'Tab') {
      e.preventDefault(); // Prevent losing focus
      moveToNextDefinition(e.shiftKey);
      return;
    }

    // Only handle letter input and backspace if the cell is not completed
    if (!cellStatus[row][col]) {
      // Handle letter keys
      if (e.key.length === 1 && /^[א-ת]$/.test(e.key)) {
        e.preventDefault();
        handleLetterInput(e.key);
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
          if (prevCell && !cellStatus[prevCell.row][prevCell.col]) {
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
    }

    // Handle arrow keys - always allow navigation
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
    
    const value = e.target.value;
    if (/^[א-ת]$/.test(value)) {
      // Clear cell before typing the new letter
      const newGrid = [...userGrid];
      newGrid[selected.row][selected.col] = '';
      setUserGrid(newGrid);
      handleLetterInput(value);
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
      setMessage('כל הכבוד!');
      if (allowConfetti) {
        setShowConfetti(true);
      }
    }
    savePuzzleState(puzzleId, {
      userGrid: grid,
      cellStatus: cellStatus,
      isComplete: result.isCorrect,
      puzzleId,
    });
  };

  const markPuzzle = () => {
    const result = checkPuzzle(userGrid, currentConfig);
    setCellStatus(result.newCellStatus);
    if (currentPuzzleId) {
      checkComplete(userGrid, currentPuzzleId, true);
    }
  };

  const hasAvailableHints = (): boolean => {
    if (!currentConfig) return false;
    
    // Check if there are any unsolved cells
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (currentConfig.grid[row][col] !== 'blank' && 
            cellStatus[row][col] !== true && 
            userGrid[row][col] !== currentConfig.grid[row][col]) {
          return true;
        }
      }
    }
    return false;
  };

  const hasUntestedCells = (): boolean => {
    if (!currentConfig) return false;
    
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        // If the cell is not blank and has content but hasn't been validated yet
        if (currentConfig.grid[row][col] !== 'blank' && 
            userGrid[row][col] !== '' && 
            cellStatus[row][col] === null) {
          return true;
        }
      }
    }
    return false;
  };

  // Replace reveal functionality with hint
  const handleHint = () => {
    if (!currentConfig) return;
    
    // Get all unsolved cells (not blank, not correct)
    const unsolvedCells: Array<{ row: number; col: number }> = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (currentConfig.grid[row][col] !== 'blank' && 
            cellStatus[row][col] !== true && 
            userGrid[row][col] !== currentConfig.grid[row][col]) {
          unsolvedCells.push({ row, col });
        }
      }
    }

    // If no unsolved cells, return
    if (unsolvedCells.length === 0) return;

    // Pick a random unsolved cell
    const randomIndex = Math.floor(Math.random() * unsolvedCells.length);
    const { row, col } = unsolvedCells[randomIndex];

    // Update the grid and cell status
    const newGrid = [...userGrid];
    const newCellStatus = [...cellStatus];
    
    newGrid[row][col] = currentConfig.grid[row][col];
    newCellStatus[row][col] = true;

    setUserGrid(newGrid);
    setCellStatus(newCellStatus);

    // Check if puzzle is complete after hint
    if (currentPuzzleId) {
      checkComplete(newGrid, currentPuzzleId, true);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-lg mx-auto">
      <h1 className="mb-8 mt-8 select-none" style={{ direction: 'rtl' }}>
        <div className="relative">
          <div className="absolute left-[-20px] top-[-20px] w-12 h-12 flex items-center justify-center text-4xl opacity-20">
            🖋️
          </div>
          <div className="grid grid-flow-col gap-[1px] bg-gray-300 p-[1px] rounded">
            {Array.from("תשבצת").map((letter, index) => (
              <div
                key={index}
                className="w-12 h-12 flex items-center justify-center text-2xl font-bold bg-white"
                style={{
                  background: 'white',
                  fontFamily: "'Rubik', sans-serif",
                }}
              >
                <span style={{
                  background: 'linear-gradient(135deg, #4ECDC4 0%, rgb(56, 56, 56) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {letter}
                </span>
              </div>
            ))}
          </div>
        </div>
      </h1>

      {!gameStarted ? (
        <button
          onClick={handleStartGame}
          className="px-6 py-3 bg-[#4ECDC4] text-white rounded-lg text-xl hover:bg-blue-600 transition-colors"
          style={{ direction: 'rtl' }}
        >
          מוכנים לתשבצ?
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

              {/* Status message */}
              {message && (
                <div className="mt-4 mb-6 p-2 rounded bg-green-100 text-green-800" style={{ direction: 'rtl' }}>
                  {message}
                </div>
              )}

              {/* Clues display */}
              <div className="mb-4 p-4 bg-gray-100 rounded w-full direction-rtl text-right flex" style={{ direction: 'rtl' }}>
                <div className="flex-none gap-20 cursor-pointer select-none text-2xl"
                onClick={() => moveToNextDefinition(true)}>
                {"▶️"}
                </div>
                <div className="flex-1 gap-2 px-3">
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
                <div className="flex-none gap-20 cursor-pointer select-none text-2xl"
                onClick={() => moveToNextDefinition(false)}>
                {"◀️"}
                </div>
              </div>

              {/* Buttons section */}
              <div className="flex gap-2">
                <button
                  onClick={markPuzzle}
                  disabled={!hasUntestedCells()}
                  className={`px-4 py-2 text-white rounded ${
                    hasUntestedCells() 
                      ? 'bg-[#4ECDC4] hover:bg-blue-600' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  בדיקה
                </button>
                <button
                  onClick={handleHint}
                  disabled={!hasAvailableHints()}
                  className={`px-4 py-2 text-white rounded ${
                    hasAvailableHints() 
                      ? 'bg-yellow-500 hover:bg-yellow-600' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  רמז
                </button>
                <button
                  onClick={handlePuzzleReset}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  איפוס
                </button>
              </div>

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
