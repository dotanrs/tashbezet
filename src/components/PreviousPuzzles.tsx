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
      <h2 className="text-xl mb-4 text-center">תשבצים קודמים</h2>
      <div className="flex justify-center gap-2 flex-wrap" style={{direction: 'rtl'}}>
        {puzzleIds.map((puzzleId) => {
          const status = getPuzzleStatus(puzzleId);
          return (
            <button
              key={puzzleId}
              onClick={() => onPuzzleChange(puzzleId)}
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                currentPuzzleId === puzzleId
                  ? 'bg-blue-200'
                  : 'bg-gray-200 hover:bg-gray-300'
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