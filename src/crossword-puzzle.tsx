import { useState, useEffect, useCallback } from 'react';
import { CrosswordConfig } from './types/crossword';
import { puzzles, PuzzleId, viewablePuzzles, PUZZLE_ID_404 } from './crosswords';
import PreviousPuzzles from './components/PreviousPuzzles';
import Puzzle from './components/Puzzle';
import { Menu, X } from 'lucide-react';
import { TashbezetTitle } from './utils/logo';
import useIsMobile from './hooks/useIsMobile';

const CrosswordPuzzle = () => {
  const firstPuzzleId = Object.keys(puzzles)[0] as PuzzleId;
  const isMobile = useIsMobile();

  // Add new state for game started
  const [gameStarted, setGameStarted] = useState(false);
  // Modify current puzzle state to be null initially
  const [currentPuzzleId, setCurrentPuzzleId] = useState<PuzzleId>(firstPuzzleId);
  const [currentConfig, setCurrentConfig] = useState<CrosswordConfig>(puzzles[firstPuzzleId]);

  const [previousPuzzlesShown, setPreviousPuzzlesShown] = useState(false);

  // Modify handlePuzzleChange
  const handlePuzzleChange = (puzzleId: PuzzleId, keepUrl: boolean = false) => {
    const finalPuzzleId = puzzleId in puzzles ? puzzleId : PUZZLE_ID_404;
    setCurrentPuzzleId(finalPuzzleId);
    setCurrentConfig(viewablePuzzles[finalPuzzleId]);
    setGameStarted(false);
    setPreviousPuzzlesShown(false);
    if (!keepUrl) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const getWindowHeight = () => {
    return window.visualViewport ? window.visualViewport.height : window.innerHeight;
  }

  const setAppHeight = useCallback(() => {
    // Set a variable --app-height to be used on mobile instead of the less accurate 100vh
    document.documentElement.style.setProperty('--app-height', `${getWindowHeight()}px`);
  }, [])

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: getWindowHeight(),
  });

  // Add window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: getWindowHeight(),
      });
      setAppHeight();
    };
    setAppHeight();

    const params = new URLSearchParams(window.location.search);
    const puzzleIdFromParam = params.get("puzzleId");
    if (puzzleIdFromParam) {
      handlePuzzleChange(puzzleIdFromParam, true);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setAppHeight]);


  const showWideScreen = !isMobile && windowSize.width > 1000;
  const pageWidth = showWideScreen ? 'sm:w-[900px] max-w-[900px]' : 'sm:w-[500px] max-w-[500px]';
  const showPuzzleName = windowSize.width > 350;

  const GameTitle = () => {
    return <div className='fixed z-10 w-full bg-highlight-200 border-b-[1px] border-gray-600 mb-0'>
    <div className={`${pageWidth} flex flex-row items-center justify-between m-auto pl-2 sm:pl-0 leading-[15px]`}>
      <div id="options">
        <button onClick={() => setPreviousPuzzlesShown(!previousPuzzlesShown)} className='px-2 py-1'>
          {previousPuzzlesShown ? <X size={24} className='text-gray-800' /> : <Menu size={24} className='text-gray-800' />}
        </button>
      </div>
      <div className={`select-none border-black`} style={{ direction: 'rtl' }}>
        {<TashbezetTitle
         currentConfig={currentConfig}
         currentPuzzleId={currentPuzzleId}
         size={'text-2xl'}
         width={'sm:w-10 w-[35px]'}
         showBottomBorder={false}
         pencilPosition={'hidden'}
         showPen={true}
         showPuzzleName={showPuzzleName}
        />}
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
      className={`w-full overflow-auto absolute h-full right-0 left-0 m-x-0 flex flex-col items-center pt-0 mx-auto ${previousPuzzlesShown && 'bg-background-0'}`}>
      <GameTitle />
      <div className={`${pageWidth} w-[100%]`}>
        <>
          {previousPuzzlesShown && (
            <PreviousPuzzles
              currentPuzzleId={currentPuzzleId}
              showWideScreen={showWideScreen}
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
              showWideScreen={showWideScreen}
            />
          )}
        </>
      </div>
    </div>
    </>
  );
};

export default CrosswordPuzzle;
