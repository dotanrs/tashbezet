import React from 'react';
import { PuzzleId } from '../crosswords';
import { loadPuzzleState } from '../utils/storageUtils';
import { puzzles } from '../crosswords';
import { HOST_NAME } from '../utils/crosswordNavigation';

interface PreviousPuzzlesProps {
  currentPuzzleId: PuzzleId | null;
}

const PreviousPuzzles: React.FC<PreviousPuzzlesProps> = ({ currentPuzzleId }) => {
  const puzzleIds = Object.keys(puzzles) as PuzzleId[];

  const getPuzzleStatus = (puzzleId: PuzzleId) => {
    const savedState = loadPuzzleState(puzzleId);
    if (!savedState) return null;
    return savedState.isComplete ? '✓' : '•';
  };

  return (
    <div className="mt-20 w-full px-8" style={{fontFamily: "'Rubik', sans-serif"}}>
      <h1 className='text-xl text-gray-700 text-center mb-8'>תשבצת - תשבץ קטן אחד בשבוע</h1>
      <div className="mt-8 mb-10 flex gap-3 text-[13px] justify-center">
        <div className="flex items-center gap-10">
          <a href="https://www.linkedin.com/in/dotanreis/" className="underline">
            <img src="https://dotanrs.github.io/tashbezet/linkedin.jpg" alt='Linkedin icon' className="w-4 h-4 rounded-full" />
          </a>
        </div>
        <div className="items-center gap-10">פותח על ידי דותן רייס ✍</div>
      </div>
      <div className="flex flex-row justify-between space-x-5 items-center mb-4">
        <div className="h-[1px] bg-gray-300 flex-auto"></div>
        <div className="text-xl w-18 text-center">תשבצים קודמים</div>
        <div className="h-[1px] bg-gray-300 flex-auto"></div>
      </div>
      <div className="grid grid-cols-2 justify-center gap-2 flex-wrap mb-4" style={{ direction: 'rtl' }}>
      {puzzleIds.map((puzzleId) => {
        const status = getPuzzleStatus(puzzleId);
        return (
          <a href={`${HOST_NAME}?puzzleId=${puzzleId}`}>
            <button
              key={puzzleId}
              style={{ direction: 'ltr' }}
              className={`px-4 py-2 w-full rounded flex items-center gap-2 justify-end border-[1px] border-gray-600 ${
                currentPuzzleId === puzzleId
                  ? 'bg-highlight-200 cursor-default'
                  : 'bg-white hover:bg-background-100'
              } ${status === '✓' && 'text-green-600'}`}
            >
              {puzzles[puzzleId].name}
              {status && (
                <span className={status === '✓' ? 'text-green-600' : 'text-blue-600'}>
                  {status}
                </span>
              )}
            </button>
          </a>
        );
      })}
      </div>
    </div>
  );
};

export default PreviousPuzzles; 