import { useState, useEffect } from 'react';
import { CrosswordConfig } from './types/crossword';
import { puzzles, PuzzleId } from './crosswords';
import PreviousPuzzles from './components/PreviousPuzzles';
import Puzzle from './components/Puzzle';
import { Menu, X } from 'lucide-react';

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
    setCurrentPuzzleId(puzzleId);
    setCurrentConfig(puzzles[puzzleId]);
    setGameStarted(true);
    setPreviousPuzzlesShown(false);
    if (!keepUrl) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  // Add handleStartGame
  const handleStartGame = () => {
    handlePuzzleChange(firstPuzzleId);
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
    if (puzzleIdFromParam && puzzles[puzzleIdFromParam]) {
      handlePuzzleChange(puzzleIdFromParam, true);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const pageWidth = 'sm:w-[500px] max-w-[500px]'

  function getTitle(size: string, width: string, noBottomBorder: boolean, pencilPosition: string, withPen: boolean) {
    const word = withPen ? "תשבצת" : 'תשבצת';
    return (
      <div className="relative flex flex-row justify-between">
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
              background: '#2ea199',  // background-300
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
                    border-r-[1px] ${noBottomBorder && 'border-b-0'} border-gray-400 bg-background-10`}
            style={{
              fontFamily: "'Rubik', sans-serif",
            }}
          >
            <span>
              {<img className='w-5' alt='Pencil emoji' src="https://dotanrs.github.io/tashbezet/pencil_cyan.png"></img>}
            </span>
          </div>}
          {(withPen && currentConfig) && <div
            key={1000}
            className={`flex items-center justify-center ${size} m-0 border-y-[1px] mr-[-0.5px] px-2 overflow-hidden truncate text-sm
                    border-r-[1px] ${noBottomBorder && 'border-b-0'} border-gray-400 bg-white`}
          >
            <a href={`https://dotanrs.github.io/tashbezet?puzzleId=${currentPuzzleId}`} title={`תשבצת ${currentConfig.name}`}>
            <span className={'text-sm text-gray-500'}>
              {currentConfig.name}
            </span>
            </a>
          </div>}
        </div>
      <img className={pencilPosition} alt='Pencil emoji' src="https://dotanrs.github.io/tashbezet/pencil.png"></img>
    </div>
    )
  }

  function getGameTitle() {
    return <div className='fixed z-10 w-full bg-background-50 border-b-[1px] border-gray-600 mb-0'>
    <div className={`${pageWidth} flex flex-row items-center justify-between m-auto pl-4 sm:pl-0 leading-[15px]`}>
      <div id="options">
        <button onClick={() => setPreviousPuzzlesShown(!previousPuzzlesShown)}>
          {previousPuzzlesShown ? <X size={24} className='text-gray-500' /> : <Menu size={24} className='text-gray-500' />}
        </button>
      </div>
      <div className={`select-none border-black`} style={{ direction: 'rtl' }}>
        {getTitle('text-2xl', 'sm:w-10 w-[35px]', true, 'hidden', true)}
      </div>
    </div>
  </div>
  }

  function getWelcomeTitle() {
    return <div className='w-full mt-10'>
    <div className={`${pageWidth} flex flex-row items-center justify-center m-auto`}>
      <div className={`select-none border-black`} style={{ direction: 'rtl' }}>
        {getTitle('text-2xl', 'w-12', false, 'absolute left-[-15px] top-[-12px] w-[35px]', false)}
      </div>
    </div>
  </div>
  }

  function containerStyle(gameStarted: boolean) {
    return gameStarted ? '' : 'absolute bg-background-50 h-full'
  }

  useEffect(() => {
    document.body.classList.add('lg:landscape:overflow-auto', 'landscape:overflow-hidden', 'portrait:overflow-auto');

    return () => {
      document.body.classList.remove('lg:landscape:overflow-auto', 'landscape:overflow-hidden', 'portrait:overflow-auto');
    };
  }, []);

  return (
    <>
    <div className="block md:landscape:hidden landscape:block portrait:hidden fixed w-full h-full z-50 text-center p-20 text-gray-700 text-l bg-background-50" style={{ direction: 'rtl' }}>
      <div className='text-xl direction-rtl'>אין במסך הזה מקום לתשבץ 😣</div>
      <div className='pt-4'>אפשר לסובב את המכשיר למצב אנכי?</div>
    </div>
    <div id="crossword-container"
      className={`w-full ${containerStyle(gameStarted)} right-0 left-0 m-x-0 flex flex-col items-center pt-0 mx-auto`}>
      {gameStarted ? getGameTitle() : getWelcomeTitle()}
      <div className={`${pageWidth} w-[100%]`}>
        {!gameStarted ? (
          <div id="whole-crossword" className="w-full pt-8 text-center">
            <div className='text-xl text-gray-600 mb-4' style={{fontFamily: "'Rubik', sans-serif"}}>תשבץ קטן כל יום חמישי</div>
            <img className='mb-16 mx-auto' alt='Tashbezet logo' src='https://dotanrs.github.io/tashbezet/favicon.ico'></img>
            <button
              onClick={handleStartGame}
              className="px-6 py-3 bg-background-300 text-white rounded-lg text-xl relative overflow-hidden group hover:shadow-lg"
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
              />
            )}
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default CrosswordPuzzle;
