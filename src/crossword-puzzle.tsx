import { useState, useEffect } from 'react';
import { CrosswordConfig } from './types/crossword';
import { puzzles, PuzzleId, notFoundPuzzle } from './crosswords';
import PreviousPuzzles from './components/PreviousPuzzles';
import Puzzle from './components/Puzzle';
import { Menu, X } from 'lucide-react';
import { getTitle } from './utils/logo';

const CrosswordPuzzle = () => {
  const firstPuzzleId = Object.keys(puzzles)[0] as PuzzleId;

  // Add new state for game started
  const [gameStarted, setGameStarted] = useState(false);
  // Modify current puzzle state to be null initially
  const [currentPuzzleId, setCurrentPuzzleId] = useState<PuzzleId>(firstPuzzleId);
  const [currentConfig, setCurrentConfig] = useState<CrosswordConfig>(puzzles[firstPuzzleId]);

  const [previousPuzzlesShown, setPreviousPuzzlesShown] = useState(false);

  // Modify handlePuzzleChange
  const handlePuzzleChange = (puzzleId: PuzzleId, keepUrl: boolean = false) => {
    if (puzzleId in puzzles) {
      setCurrentPuzzleId(puzzleId);
      setCurrentConfig(puzzles[puzzleId]);
    } else {
      puzzleId = '404'
      setCurrentPuzzleId(puzzleId);
      setCurrentConfig(notFoundPuzzle);
    }
    setGameStarted(true);
    setPreviousPuzzlesShown(false);
    if (!keepUrl) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  // Track confetti state
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

    const params = new URLSearchParams(window.location.search);
    const puzzleIdFromParam = params.get("puzzleId");
    if (puzzleIdFromParam) {
      handlePuzzleChange(puzzleIdFromParam, true);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const pageWidth = 'sm:w-[500px] max-w-[500px]'

  const GameTitle = () => {
    return <div className='fixed z-10 w-full bg-background-50 border-b-[1px] border-gray-600 mb-0'>
    <div className={`${pageWidth} flex flex-row items-center justify-between m-auto pl-4 sm:pl-0 leading-[15px]`}>
      <div id="options">
        <button onClick={() => setPreviousPuzzlesShown(!previousPuzzlesShown)}>
          {previousPuzzlesShown ? <X size={24} className='text-gray-500' /> : <Menu size={24} className='text-gray-500' />}
        </button>
      </div>
      <div className={`select-none border-black`} style={{ direction: 'rtl' }}>
        {getTitle(currentConfig, currentPuzzleId, 'text-2xl', 'sm:w-10 w-[35px]', true, 'hidden', true)}
      </div>
    </div>
  </div>
  }

  useEffect(() => {
    document.body.classList.add('lg:landscape:overflow-auto', 'landscape:overflow-hidden', 'portrait:overflow-auto');

    return () => {
      document.body.classList.remove('lg:landscape:overflow-auto', 'landscape:overflow-hidden', 'portrait:overflow-auto');
    };
  }, []);

  const shortWindow = windowSize.height < 520;

  return (
    <>
    {shortWindow && <div className="block fixed w-full h-full z-50 text-center p-20 text-gray-700 text-l bg-background-50" style={{ direction: 'rtl' }}>
      <div className='text-xl direction-rtl'>אין במסך הזה מקום לתשבץ 😣</div>
      <div className='pt-4'>אפשר לסובב את המכשיר למצב אנכי?</div>
    </div>}
    <div id="crossword-container"
      className={`w-full absolute h-full right-0 left-0 m-x-0 flex flex-col items-center pt-0 mx-auto ${previousPuzzlesShown && 'bg-background-0'}`}>
      <GameTitle />
      <div className={`${pageWidth} w-[100%]`}>
        <>
          {previousPuzzlesShown && (
            <PreviousPuzzles
              currentPuzzleId={currentPuzzleId}
              onPuzzleChange={handlePuzzleChange}
            />
          )}

          {(
            <Puzzle
              hidden={previousPuzzlesShown}
              currentConfig={currentConfig}
              setCurrentConfig={setCurrentConfig}
              currentPuzzleId={currentPuzzleId}
              windowSize={windowSize}
              gameStarted={gameStarted}
              setGameStarted={setGameStarted}
            />
          )}
        </>
      </div>
    </div>
    </>
  );
};

export default CrosswordPuzzle;
