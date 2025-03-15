import React from 'react';
import { PuzzleId } from '../crosswords';
import { loadPuzzleState } from '../utils/storageUtils';
import { puzzles } from '../crosswords';

interface PreviousPuzzlesProps {
  currentPuzzleId: PuzzleId | null;
  onPuzzleChange: (puzzleId: PuzzleId) => void;
}

const PreviousPuzzles: React.FC<PreviousPuzzlesProps> = ({ currentPuzzleId, onPuzzleChange }) => {
  const puzzleIds = Object.keys(puzzles) as PuzzleId[];

  const getPuzzleStatus = (puzzleId: PuzzleId) => {
    const savedState = loadPuzzleState(puzzleId);
    if (!savedState) return null;
    return savedState.isComplete ? '✓' : '•';
  };

  return (
    <div className="mt-8 w-full">
      <div className="flex flex-row justify-between space-x-5 items-center mb-4">
        <div className="h-[1px] bg-gray-300 flex-auto"></div>
        <div className="text-xl w-18 text-center">תשבצים קודמים</div>
        <div className="h-[1px] bg-gray-300 flex-auto"></div>
      </div>
      <div className="grid grid-cols-2 justify-center gap-2 flex-wrap">
        {puzzleIds.map((puzzleId) => {
          const status = getPuzzleStatus(puzzleId);
          return (
            <button
              key={puzzleId}
              onClick={() => onPuzzleChange(puzzleId)}
              className={`px-4 py-2 rounded flex items-center gap-2 justify-end border-[1px] border-gray-600 ${
                currentPuzzleId === puzzleId
                  ? 'bg-blue-200 cursor-default'
                  : 'bg-white hover:bg-gray-200'
              } ${status === '✓' && 'text-green-600'}`}
            >
              {puzzles[puzzleId].name}
              {status && (
                <span className={status === '✓' ? 'text-green-600' : 'text-blue-600'}>
                  {status}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PreviousPuzzles; 