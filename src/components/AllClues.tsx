import React from 'react';
import { CrosswordConfig, Direction } from '../types/crossword';

interface AllCluesProps {
  currentConfig: CrosswordConfig;
  onSelectDef: (direction: Direction, index: number) => void;
}

interface ClueListProps {
    direction: Direction;
    clueList: string[];
    onSelectDef: (direction: Direction, index: number) => void;
}


const CluesList: React.FC<ClueListProps> = ({ direction, clueList, onSelectDef }) => {
    const directionName = direction === 'across' ? 'מאוזן' : 'מאונך';
    return (
        <div id={`clue-list-${direction}`} className='flex-1'>
            <div className='text-center mt-4 text-gray-600 text-sm'>{directionName}</div>
            {clueList.map((clue, index) => <>
                <div key={`all-clues-${direction}-${index}`} className='cursor-pointer flex flex-row hover:bg-highlight-100 border-r-[4px] border-highlight-200 px-2 py-2 mt-2 text-sm'
                onClick={() => onSelectDef(direction, index)}>
                   <div className='text-[12px] pl-2 font-bold'>{index + 1}</div>
                   <div className=''>{clue}</div>
                </div>
            </>)}
        </div>
    )
}

export const AllClues: React.FC<AllCluesProps> = ({ currentConfig, onSelectDef }) => {
    return (
        <div className='max-w-[500px] flex flex-row gap-4 text-right direction-rtl' style={{direction: 'rtl'}}>
            <CluesList clueList={currentConfig.rowClues} direction={'across'} onSelectDef={onSelectDef} />
            <CluesList clueList={currentConfig.columnClues} direction={'down'} onSelectDef={onSelectDef} />
        </div>
    )
}