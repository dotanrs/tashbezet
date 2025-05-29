import { useState, useEffect } from 'react';
import { CrosswordConfig } from './types/crossword';
import ReactConfetti from 'react-confetti';
import { puzzles, PuzzleId } from './crosswords';
import PreviousPuzzles from './components/PreviousPuzzles';
import useIsMobile from './hooks/useIsMobile';
import Puzzle from './components/Puzzle';

const CrosswordPuzzle = () => {
  const isMobile = useIsMobile();
  const [bottomPadding, setBottomPadding] = useState(0);

  // Add new state for game started
  const [gameStarted, setGameStarted] = useState(false);
  // Modify current puzzle state to be null initially
  const [currentPuzzleId, setCurrentPuzzleId] = useState<PuzzleId | null>(null);
  const [currentConfig, setCurrentConfig] = useState<CrosswordConfig | null>(null);

  const [previousPuzzlesShown, setPreviousPuzzlesShown] = useState(false);

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

            {(currentConfig && currentPuzzleId) && (
              <Puzzle
                currentConfig={currentConfig}
                setShowConfetti={setShowConfetti}
                setCurrentConfig={setCurrentConfig}
                setCurrentPuzzleId={setCurrentPuzzleId}
                currentPuzzleId={currentPuzzleId}
              />
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
