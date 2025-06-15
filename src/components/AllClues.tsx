import React from 'react';
import { CrosswordConfig, Direction } from '../types/crossword';

interface AllCluesProps {
  currentConfig: CrosswordConfig;
  onSelectDef: (direction: Direction, index: number) => void;
  isDefCompleted: (direction: Direction, index: number) => boolean;
  currentDef: {row: number | undefined, col: number | undefined, direction: Direction};
}

interface ClueListProps {
    direction: Direction;
    clueList: string[];
    onSelectDef: (direction: Direction, index: number) => void;
    isDefCompleted: (direction: Direction, index: number) => boolean;
    currentDef: {row: number | undefined, col: number | undefined, direction: Direction};
}

const CluesList: React.FC<ClueListProps> = ({ direction, clueList, onSelectDef, isDefCompleted, currentDef }) => {
    const directionName = direction === 'across' ? 'מאוזן' : 'מאונך';
    const isDefCompletedClass = (index: number) => {
        return isDefCompleted(direction, index) ? 'line-through' : ''
    }
    const isCurrentDefClass = (index: number) => {
        // Is current def
        if (
            direction === currentDef.direction &&
            ((direction === 'across' && index === currentDef.row) || (direction === 'down' && index === currentDef.col))
        ) {
            return 'border-highlight-300 bg-highlight-100';
        }

        // Is orthogonal to current def
        if (
            direction !== currentDef.direction &&
            ((direction === 'across' && index === currentDef.row) || (direction === 'down' && index === currentDef.col))
        ) {
            return 'border-highlight-300';
        }

        // Not in play
        return 'border-highlight-200';
    }
    return (
        <div id={`clue-list-${direction}`} className='flex-1'>
            <div className='text-center mt-4 text-gray-600 text-sm'>{directionName}</div>
            {clueList.map((clue, index) => <div
                key={`all-clues-${direction}-${index}`} className={`cursor-pointer flex flex-row hover:border-highlight-300 hover:bg-highlight-100 border-r-[4px] ${isCurrentDefClass(index)} px-2 py-2 mt-2 text-sm`}
                onClick={() => onSelectDef(direction, index)}>
                   <div className='text-[12px] pl-2 font-bold'>{index + 1}</div>
                   <div className={`${isDefCompletedClass(index)}`}>{clue}</div>
            </div>
            )}
        </div>
    )
}

export const AllClues: React.FC<AllCluesProps> = ({ currentConfig, onSelectDef, isDefCompleted, currentDef }) => {
    return (
        <div className='max-w-[500px] flex flex-row gap-4 text-right direction-rtl' style={{direction: 'rtl'}}>
            <CluesList currentDef={currentDef} clueList={currentConfig.rowClues} direction={'across'} onSelectDef={onSelectDef} isDefCompleted={isDefCompleted} />
            <CluesList currentDef={currentDef} clueList={currentConfig.columnClues} direction={'down'} onSelectDef={onSelectDef} isDefCompleted={isDefCompleted} />
        </div>
    )
}