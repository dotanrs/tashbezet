import { PuzzleId } from "../crosswords";
import { CrosswordConfig } from "../types/crossword";
import { HOST_NAME } from "./crosswordNavigation";

interface TitleProps {
    currentConfig: CrosswordConfig;
    currentPuzzleId: PuzzleId;
    size: string;
    width: string;
    showBottomBorder?: boolean;
    pencilPosition: string;
    showPen?: boolean;
    showPuzzleName?: boolean;
}

export const TashbezetTitle: React.FC<TitleProps> = ({
    currentConfig,
    currentPuzzleId,
    size,
    width,
    showBottomBorder = true,
    pencilPosition,
    showPen = false,
    showPuzzleName = false,
}) => {
    const word = 'תשבצת';
    return (
    <div className="relative flex flex-row justify-between">
        <div className='border-l-[1px] border-gray-400 grid grid-flow-col'>
          {Array.from(word).map((letter, index) => (
          <div
            key={index}
            className={`${width} max-w-[15vw] min-w-[30px] aspect-square flex items-center justify-center ${size} font-bold m-0 border-y-[1px] border-r-[1px] ${!showBottomBorder && 'border-b-0'} border-gray-400 bg-white`}
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
          {showPen && <div
            key={999}
            className={`${width} aspect-square flex items-center justify-center ${size} font-bold m-0 border-y-[1px] mr-[-0.5px]
                    border-r-[1px] ${!showBottomBorder && 'border-b-0'} border-gray-400 bg-background-10`}
            style={{
              fontFamily: "'Rubik', sans-serif",
            }}
          >
            <span>
              {<img className='w-5' alt='Pencil emoji' src="https://dotanrs.github.io/tashbezet/pencil_cyan.png"></img>}
            </span>
          </div>}
          {(showPuzzleName && currentConfig) && <div
            key={1000}
            className={`flex items-center justify-center ${size} m-0 border-y-[1px] mr-[-0.5px] px-2 overflow-hidden truncate text-sm
                    border-r-[1px] ${!showBottomBorder && 'border-b-0'} border-gray-400 bg-white`}
          >
            <a href={`${HOST_NAME}?puzzleId=${currentPuzzleId}`} title={`תשבצת ${currentConfig.name}`}>
            <span className={'text-sm text-gray-500'}>
              {currentConfig.name}
            </span>
            </a>
          </div>}
        </div>
      <img className={pencilPosition} alt='Pencil emoji' src="https://dotanrs.github.io/tashbezet/pencil.png"></img>
    </div>
  );
}
