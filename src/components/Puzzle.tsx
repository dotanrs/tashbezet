import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getLatestPuzzleName, PuzzleId, viewablePuzzles } from '../crosswords';
import { clearPuzzleState, loadPuzzleState, savePuzzleState } from '../utils/storageUtils';
import CrosswordGrid from './CrosswordGrid';
import { CellStatusGrid, CrosswordConfig, Direction, Grid, SavedPuzzleState, Selected } from '../types/crossword';
import Sidebar from './Sidebar';
import { findNextDirectCell, findNextDirectCellV2 } from '../utils/crosswordNavigation';
import { findNextDefinition, handleArrowNavigation } from '../utils/navigationUtils';
import useIsMobile from '../hooks/useIsMobile';
import { checkPuzzle, createEmptyCellStatus, createEmptyGrid } from '../utils/puzzleUtils';
import HebrewKeyboard from './HebrewKeyboard';
import { Pause } from 'lucide-react';
import { SharePopup, WelcomeNonLatestPopup, WelcomePopup } from './Popup';
import { useGameTimer } from '../utils/useGameTimer';
import { AllClues, MainClue } from './AllClues';

interface PuzzlesProps {
  currentConfig: CrosswordConfig;
  setCurrentConfig: (newConfig: CrosswordConfig) => void;
  currentPuzzleId: PuzzleId;
  windowSize: {width: number, height: number};
  hidden: boolean;
  gameStarted: boolean;
  setGameStarted: (val: boolean) => void;
  showWideScreen: boolean;
  scrollTop: () => void;
}

const Puzzle: React.FC<PuzzlesProps> = ({ currentConfig, currentPuzzleId, scrollTop, setCurrentConfig, windowSize, hidden, gameStarted, showWideScreen, setGameStarted }) => {
    const isMobile = useIsMobile();
    const cluesKeyboardRef = useRef<HTMLDivElement>(null);
    const [bottomPadding, setBottomPadding] = useState(0);
    const [isDone, setIsDone] = useState(false);
  
    // Modify current puzzle state to be null initially
    const [hintsShown, setHintsShown] = useState<boolean>(false);
    // State for the user's input grid
    const [userGrid, setUserGrid] = useState<Grid>(createEmptyGrid());
    // Track selected cell
    const [selected, setSelectedIn] = useState<Selected>(null);
    // Status message
    const [puzzleDoneMessage, setPuzzleDoneMessage] = useState(false);
    // Track cell validation status
    const [cellStatus, setCellStatus] = useState<CellStatusGrid>(createEmptyCellStatus());
    // Track direction
    const [direction, setDirection] = useState<Direction>('across');
    const [showConfetti, setShowConfetti] = useState(false);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [pageReady, setPageReady] = useState(false);
    const [isFirstClick, setIsFirstClick] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [didAtLeastOneMove, setDidAtLeastOneMove] = useState(false);
    const { secondsElapsed, formattedGameTime, resetTimer } = useGameTimer(isPaused);
  
    // Create refs for all cells
    const cellRefs = useRef<(HTMLInputElement | null)[][]>(Array(5).fill(null).map(() => Array(5).fill(null)));


    const getNewGrid = (puzzleId: PuzzleId): Grid => {
      return viewablePuzzles[puzzleId].grid.map((row) =>
        row.map((cell) => {
          if (cell === 'blank') return 'blank';
          return '';
        })
      );
    }
  
    const mergeStateWithPuzzle = (puzzleId: PuzzleId, savedState: SavedPuzzleState): Grid => {
      try {
        const newGrid = viewablePuzzles[puzzleId].grid.map((row, rowIndex) =>
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

    const stateWithNullTimer = (() => {
      const puzzleState = loadPuzzleState(currentPuzzleId);
      return puzzleState && puzzleState.timerSeconds === undefined && puzzleState.isComplete;
    })();

    const setSelected = (value: { row: number; col: number }) => {
      setSelectedIn(value);
      const cellRef = cellRefs.current[value.row]?.[value.col];
      if (cellRef) {
        cellRef.focus();
      }
    }

    // Modify useEffect to only run when a puzzle is selected
    useEffect(() => {
      if (!currentPuzzleId) return;
      setDidAtLeastOneMove(false);
  
      const getUpdatedGrid = () => {
        const savedState = loadPuzzleState(currentPuzzleId);
        if (savedState && viewablePuzzles[savedState.puzzleId]) {
          resetTimer(savedState.timerSeconds || 0);
          setCurrentConfig(viewablePuzzles[savedState.puzzleId]);
          const newGrid = mergeStateWithPuzzle(currentPuzzleId, savedState);
          setUserGrid(newGrid);
          setCellStatus(savedState.cellStatus);
          return newGrid;
        } else {
          resetTimer(0);
          const initialGrid = currentConfig.grid.map(row => 
            row.map(cell => cell === 'blank' ? 'blank' : '')
          );
          setUserGrid(initialGrid);
          setCellStatus(createEmptyCellStatus());
          return initialGrid;
        }
      }
      const newGrid = getUpdatedGrid();
  
      const firstCell = placeCursor(newGrid);
      if (firstCell) {
        setSelected(firstCell);
      } else {
        // We should never get here
      }
  
      setDirection('across');
      checkComplete(newGrid, currentPuzzleId);
      // eslint-disable-next-line
    }, [currentPuzzleId, setCurrentConfig]);
  
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
    }, [isMobile]);
  
    const handlePuzzleReset = () => {
      if (currentPuzzleId === null) {
        return;
      }
      const newGrid = getNewGrid(currentPuzzleId);
      setUserGrid(newGrid);
      resetCellStatus();
      // Treat this like a new game - state won't be saved until user makes a move.
      // must be before clearPuzzleState to prevetn race conditions
      setDidAtLeastOneMove(false);
      clearPuzzleState(currentPuzzleId);
      resetTimer(0);
    };
  
    // Add handleStartGame
  
    // Handle cell selection and direction changes
    const handleCellClick = (row: number, col: number, isFocused: boolean) => {
      if (userGrid[row][col] === 'blank') return;
  
      if (selected && selected.row === row && selected.col === col) {
        // If clicking the same cell, switch direction
        if (isFirstClick || isFocused) {
          setDirection(prev => prev === 'across' ? 'down' : 'across');
        } else {
          setIsFirstClick(true);
        }
      } else {
        setIsFirstClick(false);
        setSelected({ row, col });
        // Keep the same direction when moving to a new cell
      }
    };
  
    const setDefinition = (direction: Direction, index: number) => {
      setDirection(direction);
      setIsFirstClick(false);

      let nextCell = (direction === 'across') ? { row: index, col: 0 } : { row: 0, col: index };

      // Check cell status is right
      let secondaryIndex = 0;
      let allowCompleted = false;
      while (
        (userGrid[nextCell.row][nextCell.col] === 'blank') ||
        (!allowCompleted && cellStatus[nextCell.row][nextCell.col] === true)
      ) {
        nextCell = (direction === 'across') ? { row: index, col: secondaryIndex } : { row: secondaryIndex, col: index };
        secondaryIndex += 1;

        // if whole def is complete, go to first non-blank cell
        if (secondaryIndex > 4 && !allowCompleted) {
          allowCompleted = true;
          secondaryIndex = 0;
          nextCell = (direction === 'across') ? { row: index, col: secondaryIndex } : { row: secondaryIndex, col: index };
          continue;
        }

        // Whole def is blank - should never happen
        if (secondaryIndex > 4) {
          nextCell = (direction === 'across') ? { row: index, col: 0 } : { row: 0, col: index };
          break;
        }
      }

      setSelected(nextCell);
      scrollTop();
    }

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
      setDidAtLeastOneMove(true);
      
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
    }
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!selected) return;
      setDidAtLeastOneMove(true);
  
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
  
    const resetCellStatus = () => {
      setIsDone(false);
      setCellStatus(createEmptyCellStatus());
      setPuzzleDoneMessage(false);
    };
  
    const checkComplete = (grid: Grid, puzzleId: PuzzleId, allowConfetti: boolean = false) => {  
      const result = checkPuzzle(grid, currentConfig);
      // Resetting the message because there can be leftovers from previous puzzle
      setPuzzleDoneMessage(false);
      setShowConfetti(false);
      if (result.isCorrect) {
        setIsDone(true);
        setCellStatus(result.newCellStatus);
        setPuzzleDoneMessage(true);
        if (allowConfetti) {
          setShowConfetti(true);
        }
      } else {
        setIsDone(false);
      }
      setPageReady(true);
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
      setDidAtLeastOneMove(true);
  
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
        return 'fixed bottom-0 right-0 w-[100%]';
      }
      return '';
    }
  
  
    const toggleHint = () => {
      setHintsShown(!hintsShown);
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

    useEffect(() => {
      document.body.classList.add('lg:landscape:overflow-auto', 'landscape:overflow-hidden', 'portrait:overflow-auto');
  
      return () => {
        document.body.classList.remove('lg:landscape:overflow-auto', 'landscape:overflow-hidden', 'portrait:overflow-auto');
      };
    }, []);

    useEffect(() => {
      if (!gameStarted) {
        setIsPaused(true);
        return;
      }
      setIsPaused(isDone);
      if (!didAtLeastOneMove) {
        return;
      }
      savePuzzleState(currentPuzzleId, {
        userGrid: userGrid.map(row => [...row]),
        cellStatus: cellStatus.map(row => [...row]),
        isComplete: isDone,
        puzzleId: currentPuzzleId,
        timerSeconds: secondsElapsed,
      });
    }, [isDone, cellStatus, userGrid, currentPuzzleId, gameStarted, secondsElapsed, didAtLeastOneMove])

    const backgroundColorUi = 'bg-background-100';

    // Id the definition changes, reset the hint
    const definitionName = `${currentConfig?.name}_${direction}_${direction === 'across' ? selected?.row : selected?.col}`
    useEffect(() => {
      setHintsShown(false);
    }, [definitionName]);


  const pauseGame = useCallback(() => {
    setGameStarted(false);
  }, [setGameStarted]);

  const resumeGame = () => {
    if (!puzzleDoneMessage) {
      setIsPaused(false);
    }
    setPuzzleDoneMessage(false);
    setGameStarted(true);
  }

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isDone) {
        pauseGame();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pauseGame, isDone]);

  const isDefCompleted = (direction: Direction, index: number) => {
    const indexes = [0,1,2,3,4];
    const cellCompleted = (row: number, col: number) => {
      return cellStatus[row][col] === true || currentConfig.grid[row][col] === 'blank';
    }
    if (direction === "across") {
        return indexes.every(cell => cellCompleted(index, cell));
    } else {
      return indexes.every(cell => cellCompleted(cell, index));
    }
  }

  const useSmallScreenAdjustments = showWideScreen ? windowSize.height < 650 : windowSize.width < 388;
  const useVerySmallScreenAdjustments = windowSize.width < 325;
  const sideBarSpacing = useSmallScreenAdjustments ? 'px-1 gap-1' : 'px-2 gap-2'
  // Will return true if the game started, but will revert to false if no user actions were made
  const gameAlreadyStarted = secondsElapsed > 0;
  const currentDef = {
    row: selected?.row,
    col: selected?.col,
    direction,
  }

  return currentConfig && <>
  <div id="whole-crossword" className={`sm:w-full w-[100%] sm:pt-10 pt-[35px] ${showWideScreen ? 'flex flex-row' : 'max-w-[500px]'} ${hidden && 'hidden'}`}>
    <div id="main-content" className='max-w-[500px]'  style={isMobile ? { minHeight: `calc(var(--app-height) - ${bottomPadding}px - 15px)` } : undefined}>
      <div id="crossword-and-buttons" className={`flex space-x-5 flex-row justify-between items-start mx-auto mt-0 mb-3`}
        style={{
          maxWidth: isMobile ? 'calc(var(--app-height) - 350px)' : 'calc(100vh - 250px)',
          minWidth: isMobile ? '170px' : (showWideScreen ? '350px' : '270px'),
          }}>

        <CrosswordGrid
          userGrid={userGrid}
          cellStatus={cellStatus}
          selected={selected}
          direction={direction}
          cellRefs={cellRefs}
          onCellClick={handleCellClick}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          isDone={isDone}
        />
      </div>
      {/* Status message */}
      {(pageReady && (puzzleDoneMessage || !gameStarted)) && (<>
        {(currentConfig.name === getLatestPuzzleName()) ? <WelcomePopup
            onClose={resumeGame}
            currentConfig={currentConfig}
            puzzleId={currentPuzzleId}
            puzzleDoneMessage={puzzleDoneMessage}
            confetti={{showConfetti, windowSize}}
            iStarted={gameAlreadyStarted}
            secondsElapsed={secondsElapsed}
        /> :
          <WelcomeNonLatestPopup
              currentConfig={currentConfig}
              puzzleId={currentPuzzleId}
              confetti={{showConfetti, windowSize}}
              onClose={resumeGame}
              puzzleDoneMessage={puzzleDoneMessage}
              secondsElapsed={secondsElapsed}
          />}
      </>)}
      {showSharePopup && (
          <SharePopup currentConfig={currentConfig} puzzleId={currentPuzzleId} onClose={() => setShowSharePopup(false)} />
        )}

      {/* Buttons section */}
      <div id="sidebar-container" className='flex flex-row place-content-between mt-4'>
        <div className={`text-center flex flex-row text-[13px] w-[100px] ${sideBarSpacing} pb-4`}>
          <Sidebar
            onMarkPuzzle={markPuzzle}
            onHint={handleHint}
            onReset={handlePuzzleReset}
            hasUntestedCells={hasUntestedCells()}
            hasAvailableHints={hasAvailableHints()}
            openSharePopup={() => setShowSharePopup(true)}
            baseBgColor={backgroundColorUi}
            showShareButton={!useSmallScreenAdjustments}
            showHintButton={!useVerySmallScreenAdjustments}
          />
        </div>
        {!stateWithNullTimer && <div className='text-right mt-1 font-[courier] mr-2'>
          {(!isDone) && <Pause onClick={() => pauseGame()} className='inline text-gray-600 mr-2' width={'16px'} strokeWidth={1} />}
          {formattedGameTime}
        </div>}
      </div>

      {/* Clues display */}
      {(pageReady && !showWideScreen) && <div id="clues-and-keyboard" ref={cluesKeyboardRef} className={`${cluesKeyboardLocation(isMobile)}`}>
        <MainClue moveToNextDefinition={moveToNextDefinition} hintsShown={hintsShown} isMobile={isMobile} selected={selected} direction={direction} currentAvailableHint={currentAvailableHint} currentConfig={currentConfig} toggleHint={toggleHint} />
        {isMobile
          ? <HebrewKeyboard onLetterClick={handleLetterInput} onBackspace={handleBackspaceOnScreenKeyboard} onTabClicked={() => moveToNextDefinition(false)} />
          : (!showWideScreen && <AllClues currentDef={currentDef} currentConfig={currentConfig} onSelectDef={setDefinition} isDefCompleted={isDefCompleted} />)
        }
      </div>}

    </div>
    {(pageReady && showWideScreen) && <div className='ml-4 mt-4'>
      <MainClue moveToNextDefinition={moveToNextDefinition} hintsShown={hintsShown} isMobile={isMobile} selected={selected} direction={direction} currentAvailableHint={currentAvailableHint} currentConfig={currentConfig} toggleHint={toggleHint} />
      <AllClues currentDef={currentDef} currentConfig={currentConfig} onSelectDef={setDefinition} isDefCompleted={isDefCompleted} />
    </div>}
  </div>
  </>;
};

export default Puzzle; 
