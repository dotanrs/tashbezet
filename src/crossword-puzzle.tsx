import React, { useState, useEffect, useRef } from 'react';
import { Grid, Selected, CellStatusGrid, Direction, CrosswordConfig, SavedPuzzleState } from './types/crossword';
import { findNextDefinition, handleArrowNavigation } from './utils/navigationUtils';
import { clearPuzzleState, loadPuzzleState, savePuzzleState } from './utils/storageUtils';
import { createEmptyGrid, createEmptyCellStatus, checkPuzzle } from './utils/puzzleUtils';
import ReactConfetti from 'react-confetti';
import { puzzles, PuzzleId } from './crosswords';
import PreviousPuzzles from './components/PreviousPuzzles';
import CrosswordGrid from './components/CrosswordGrid';
import HebrewKeyboard from './components/HebrewKeyboard';
import Sidebar from './components/Sidebar';
import { findNextDirectCell, findNextDirectCellV2 } from './utils/crosswordNavigation';
import useIsMobile from './hooks/useIsMobile';

const CrosswordPuzzle = () => {
  const isMobile = useIsMobile();
  const cluesKeyboardRef = useRef<HTMLDivElement>(null);
  const [bottomPadding, setBottomPadding] = useState(0);

  // Add new state for game started
  const [gameStarted, setGameStarted] = useState(false);
  // Modify current puzzle state to be null initially
  const [currentPuzzleId, setCurrentPuzzleId] = useState<PuzzleId | null>(null);
  const [currentConfig, setCurrentConfig] = useState<CrosswordConfig | null>(null);
  const [hintsShown, setHintsShown] = useState<{[key: string]: boolean}>({});

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

  const [previousPuzzlesShown, setPreviousPuzzlesShown] = useState(false);

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

  useEffect(() => {
    if (isMobile && cluesKeyboardRef.current) {
      const updatePadding = () => {
        const height = cluesKeyboardRef.current?.offsetHeight || 0;
        setBottomPadding(height + 15);
      };

      updatePadding();
      // Update on resize
      window.addEventListener('resize', updatePadding);
      // Also update after a short delay to account for dynamic content
      const timeoutId = setTimeout(updatePadding, 100);

      return () => {
        window.removeEventListener('resize', updatePadding);
        clearTimeout(timeoutId);
      };
    }
  }, [isMobile, gameStarted]);

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
    setMessage('');
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
    forward: boolean = false,
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

  const hasEmptyCells = (): boolean => {
    if (!currentConfig) return false;
    
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (userGrid[row][col] === '') {
          return true;
        }
      }
    }
    return false;
  };

  const moveToNextCell = (row: number, col: number, forward: boolean = true, directNext: boolean = false) => {
    const nextCell = directNext ? findNextDirectCellV2(userGrid, cellStatus, row, col, direction, forward) : findNextEditableCell(row, col, direction, forward);
    if (nextCell) {
      setSelected(nextCell);
      cellRefs.current[nextCell.row][nextCell.col]?.focus();
    } else if (hasEditableCells()) {
      // Only try to find next definition if there are still editable cells somewhere
      const requireEmpty = true;
      const { row: nextRow, col: nextCol, newDirection } = findNextDefinition(userGrid, cellStatus, row, col, direction, false, requireEmpty);
      setSelected({ row: nextRow, col: nextCol });
      setDirection(newDirection);
      cellRefs.current[nextRow][nextCol]?.focus();
    }
    // If no editable cells left, do nothing
  };

  const backspaceToPreviousCell = (row: number, col: number, direction: Direction): { newRow: number, newCol: number, newDirection?: Direction } | null => {
    if (!hasEditableCells()) {
      return null;
    }

    let prevCell = findNextDirectCellV2(userGrid, cellStatus, row, col, direction, false);
    while (
      prevCell && (
        userGrid[prevCell.row][prevCell.col] === 'blank' ||
        cellStatus[prevCell.row][prevCell.col] === true
      )
    ) {
      prevCell = findNextDirectCellV2(userGrid, cellStatus, prevCell.row, prevCell.col, direction, false);
    }

    if (!prevCell) {
      // Should never happen
      return null;
    }

    return {newRow: prevCell.row, newCol: prevCell.col, newDirection: prevCell.newDirection};
  }

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
      const isOverwriting = newGrid[row][col] !== '';
      newGrid[row][col] = normalizeLetter(letter);
      setUserGrid(newGrid);

      // Clear validation state for this cell
      const newCellStatus = [...cellStatus];
      newCellStatus[row][col] = null;
      setCellStatus(newCellStatus);

      // Move to next cell and check completion
      const should_skip_to_open_cell = hasEmptyCells() && !isOverwriting;
      moveToNextCell(row, col, true, !should_skip_to_open_cell);
      if (currentPuzzleId) {
        checkComplete(newGrid, currentPuzzleId, true);
      }
    }
  };

  const moveToNextDefinition = (forward: boolean) => {
    if (!selected) return;
    const requireEmpty = hasEmptyCells();
    const { row: nextRow, col: nextCol, newDirection } = findNextDefinition(userGrid, cellStatus, selected.row, selected.col, direction, forward, requireEmpty);
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

      // On mobile, this is what happens when typing to a full cell, for some reason.
      // Since we don't know what the user typed, we'll treat it as a backspace.
      // Somehow this works and the letter is typed right after.
      const weirdKeyValueForFirefox = "Process";
      const weirdKeyValueForChrome = "Unidentified";
      if (e.key === weirdKeyValueForFirefox || e.key === weirdKeyValueForChrome) {
        e.preventDefault();
        const newGrid = [...userGrid];
        const newCellStatus = [...cellStatus];
        newGrid[selected.row][selected.col] = '';
        newCellStatus[selected.row][selected.col] = null;
        setUserGrid(newGrid);
        setCellStatus(newCellStatus);
        return;
      }

      // Handle backspace
      if (e.key === 'Backspace') {
        e.preventDefault();

        handleBackspace(row, col);
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


  // This is called on mobile when typing in an empty cell
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selected) return;
    
    const value = e.target.value;
    if (/^[א-ת]$/.test(value)) {
      // Type letter
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

  const allPuzzlesSolved = () => {
    return Object.keys(puzzles).every(puzzleId => {
      const savedState = loadPuzzleState(puzzleId);
      return savedState?.isComplete;
    });
  }

  const checkComplete = (grid: Grid, puzzleId: PuzzleId, allowConfetti: boolean = false) => {  
    const result = checkPuzzle(grid, currentConfig);
    savePuzzleState(puzzleId, {
      userGrid: grid,
      cellStatus: cellStatus,
      isComplete: result.isCorrect,
      puzzleId,
    });
    if (result.isCorrect) {
      setCellStatus(result.newCellStatus);
      if (allPuzzlesSolved()) {
        setMessage('וואו, פתרת הכל! זה בשבילך: ⭐️ נתראה בתשבץ הבא ביום חמישי 💪');
      } else {
        setMessage('כל הכבוד, פתרת את זה! 💪 ביום חמישי יהיה תשבץ חדש ☺️');
      }
      setPreviousPuzzlesShown(true);
      if (allowConfetti) {
        setShowConfetti(true);
      }
    }
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

  const handleBackspace = (row: number, col: number) => {
    const newGrid = [...userGrid];
    const newCellStatus = [...cellStatus];

    if (userGrid[row][col] === '') {
      // If current cell is empty, move to and clear previous cell
      const prevCell = backspaceToPreviousCell(row, col, direction);
      if (!prevCell) {
        return;
      }
      newGrid[prevCell.newRow][prevCell.newCol] = '';
      newCellStatus[prevCell.newRow][prevCell.newCol] = null;
      setSelected({row: prevCell.newRow, col: prevCell.newCol});
      cellRefs.current[prevCell.newRow][prevCell.newCol]?.focus();
      if (prevCell.newDirection) {
        setDirection(prevCell.newDirection);
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

  const handleBackspaceOnScreenKeyboard = () => {
    if (!selected) return;

    const row = selected.row;
    const col = selected.col;

    handleBackspace(row, col);
  };

  const cluesKeyboardLocation = (isMobile: boolean) => {
    if (isMobile) {
      return 'fixed bottom-0 right-0 max-w-[500px]';
    }
    return '';
  }

  const definitionName = `${currentConfig?.name}_${direction}_${direction === 'across' ? selected?.row : selected?.col}`

  const toggleHint = () => {
    setHintsShown({
      ...hintsShown,
      [definitionName]: !hintsShown[definitionName],
    });
  }

  const currentAvailableHint: string = (() => {
    if (!currentConfig || !selected || !direction) {
      return '';
    }
    if (direction === 'across') {
      return (currentConfig.rowHints && currentConfig.rowHints[selected.row]) || '';
    }
    if (direction === 'down') {
      return (currentConfig.colHints && currentConfig.colHints[selected.col]) || '';
    }
    return '';
  })()

  const currentVisibleHint = () => {
    if (!hintsShown[definitionName]) {
      return '';
    }
    return currentAvailableHint;
  }

  const pageWidth = 'sm:w-[500px] max-w-[500px]'

  function getTitle(size: string, width: string, noBottomBorder: boolean, fontColor: string, pencilPosition: string, withPen: boolean) {
    const word = withPen ? "תשבצת" : 'תשבצת';
    return <div className="relative">
      <div className='border-l-[1px] border-gray-400 grid grid-flow-col'>
        {Array.from(word).map((letter, index) => (
        <div
          key={index}
          className={`${width} aspect-square flex items-center justify-center ${size} font-bold m-0 border-y-[1px] border-r-[1px] ${noBottomBorder && 'border-b-0'} border-gray-400 bg-white`}
          style={{
            fontFamily: "'Rubik', sans-serif",
          }}
        >
          <span style={{
            background: fontColor,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {letter}
          </span>
        </div>
      ))}
        {withPen && <div
          key={999}
          className={`${width} aspect-square flex items-center justify-center ${size} font-bold m-0 border-y-[1px] mr-[-0.5px]
                  border-r-[1px] ${noBottomBorder && 'border-b-0'} border-gray-400 bg-[#f2fcfb]`}
          style={{
            fontFamily: "'Rubik', sans-serif",
          }}
        >
          <span>
            {<img className='w-5' alt='Pencil emoji' src="https://dotanrs.github.io/tashbezet/pencil_cyan.png"></img>}
          </span>
        </div>}
    </div>
    <img className={pencilPosition} alt='Pencil emoji' src="https://dotanrs.github.io/tashbezet/pencil.png"></img>
  </div>
  }

  function getGameTitle() {
    return <div className='fixed z-10 w-full bg-[#ceeae8] border-b-[1px] border-gray-600 mb-0'>
    <div className={`${pageWidth} flex flex-row items-center justify-end m-auto`}>
      <div className={`select-none border-black`} style={{ direction: 'rtl' }}>
        <a href="https://dotanrs.github.io/tashbezet">
          {getTitle('text-2xl', 'sm:w-10 w-[35px]', true, '#2ea199', 'hidden', true)}
        </a>
      </div>
    </div>
  </div>
  }

  function getWelcomeTitle() {
    return <div className='w-full mt-10'>
    <div className={`${pageWidth} flex flex-row items-center justify-center m-auto`}>
      <div className={`select-none border-black`} style={{ direction: 'rtl' }}>
        {getTitle('text-2xl', 'w-12', false, '#2ea199', 'absolute left-[-15px] top-[-12px] w-[35px]', false)}
      </div>
    </div>
  </div>
  }

  function containerStyle(gameStarted: boolean) {
    return gameStarted ? '' : 'absolute bg-[#ceeae8] h-full'
  }

  useEffect(() => {
    document.body.classList.add('lg:landscape:overflow-auto', 'landscape:overflow-hidden', 'portrait:overflow-auto');

    return () => {
      document.body.classList.remove('lg:landscape:overflow-auto', 'landscape:overflow-hidden', 'portrait:overflow-auto');
    };
  }, []);

  return (
    <>
    <div className="block lg:landscape:hidden landscape:block portrait:hidden fixed w-full h-full z-30 text-center p-20 text-gray-700 text-l bg-[#ceeae8]" style={{ direction: 'rtl' }}>
      <div className='text-xl direction-rtl'>אין במסך הזה מקום לתשבץ 😣</div>
      <div className='pt-4'>אפשר לסובב את המכשיר למצב אופקי?</div>
    </div>
    <div id="crossword-container"
      className={`w-full ${containerStyle(gameStarted)} right-0 left-0 m-x-0 flex flex-col items-center pt-0 mx-auto`}
      style={isMobile ? { paddingBottom: bottomPadding } : undefined}>
      {gameStarted ? getGameTitle() : getWelcomeTitle()}
      <div className={`${pageWidth}`}>
        {!gameStarted ? (
          <div id="whole-crossword" className="w-full pt-8 text-center">
            <div className='text-xl text-gray-600 mb-4' style={{fontFamily: "'Rubik', sans-serif"}}>תשבץ קטן כל יום חמישי</div>
            <img className='mb-16 mx-auto' alt='Tashbezet logo' src='https://dotanrs.github.io/tashbezet/favicon.ico'></img>
            <button
              onClick={handleStartGame}
              className="px-6 py-3 bg-[#2ea199] text-white rounded-lg text-xl relative overflow-hidden group hover:shadow-lg"
              style={{ direction: 'rtl' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
                <div className="absolute inset-0 translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
              <span className="relative whitespace-pre-wrap">להתחיל  ✍️</span>
            </button>
          </div>
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
              <div id="whole-crossword" className="sm:w-full w-[calc(100vw-70px)] sm:pt-10 pt-[35px] max-w-[500px]">
                <div id="main-content" style={isMobile ? { minHeight: `calc(100vh - ${bottomPadding}px - 15px)` } : undefined}>
                  <div id="crossword-and-buttons" className="flex space-x-5 flex-row justify-between items-start mt-0 mb-3">
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
                  </div>
                  {/* Status message */}
                  {message && (
                    <div className="p-2 w-auto px-4 rounded text-[13px] bg-[#2ea199] text-white relative overflow-hidden" style={{ direction: 'rtl' }}>
                      <div className="absolute inset-0 translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                      <span className="relative">{message}</span>
                    </div>
                  )}

                  {
                    currentVisibleHint() && (
                      <div className="mt-1 p-2 w-auto px-4 border-[0.5px] border-gray-600 rounded text-[13px] bg-[#d1f7eb] text-black relative overflow-hidden" style={{ direction: 'rtl' }}>
                        <div className="absolute" />
                        <span className="relative whitespace-pre-wrap">{currentVisibleHint()}</span>
                      </div>
                    )
                  }

                  {/* Buttons section */}
                  <div id="sidebar-container" className={`text-center flex mt-4 flex-row gap-2 text-[13px] w-[100px] p-x-4 pb-4`}>
                    <Sidebar
                      onMarkPuzzle={markPuzzle}
                      onHint={handleHint}
                      onReset={handlePuzzleReset}
                      hasUntestedCells={hasUntestedCells()}
                      hasAvailableHints={hasAvailableHints()}
                    />
                  </div>

                  {/* Clues display */}
                  <div id="clues-and-keyboard" ref={cluesKeyboardRef} className={`${cluesKeyboardLocation(isMobile)} whitespace-pre-wrap`}>
                    <div className={`min-h-[82px] max-w-[100%] bg-[#dbfcfa] border-[0.5px] border-black ${isMobile ? '' : 'rounded-lg'}`}>
                    <div className="p-4 w-full direction-rtl text-right flex gap-[15px] justify-between" style={{ direction: 'rtl' }}>
                      <div className="flex-none cursor-pointer select-none text-xl"
                      onClick={() => moveToNextDefinition(true)}>
                      {"▶️"}
                      </div>
                      <div className="flex-1 gap-2 px-3">
                      {selected && direction === 'across' && (
                        <div>
                          <span className="text-[12px] ml-2">{selected.row + 1} מאוזן</span> {currentConfig.rowClues[selected.row]}
                        </div>
                      )}
                      {selected && direction === 'down' && (
                        <div>
                          <span className="text-[12px] ml-2">{selected.col + 1} מאונך</span> {currentConfig.columnClues[selected.col]}
                        </div>
                      )}
                      </div>
                      {currentAvailableHint && <div className="flex-none cursor-pointer select-none text-2xl" title='להציג/להסתיר רמז'
                        onClick={toggleHint}>
                      {"💡"}
                      </div>}
                      <div className="flex-none cursor-pointer select-none text-2xl"
                      onClick={() => moveToNextDefinition(false)}>
                      {"◀️"}
                      </div>
                    </div>
                  </div>
                  {isMobile && <HebrewKeyboard onLetterClick={handleLetterInput} onBackspace={handleBackspaceOnScreenKeyboard} />}
                  </div>

                </div>
              </div>
              </>
            )}
            <PreviousPuzzles
              currentPuzzleId={currentPuzzleId}
              onPuzzleChange={handlePuzzleChange}
              shown={previousPuzzlesShown}
              setShown={setPreviousPuzzlesShown}
            />
          </>
        )}
        
        {gameStarted && (<div className="mt-8 mb-4 flex gap-3 text-[13px] justify-center">
          <div className="flex items-center gap-10">
            <a href="https://www.linkedin.com/in/dotanreis/" className="underline">
              <img src="https://dotanrs.github.io/tashbezet/linkedin.jpg" alt='Linkedin icon' className="w-4 h-4 rounded-full" />
            </a>
          </div>
          <div className="items-center gap-10">פותח על ידי דותן רייס ✍</div>
        </div>
      )}
      </div>
    </div>
    </>
  );
};

export default CrosswordPuzzle;
