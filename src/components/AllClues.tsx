import React from 'react';
import { CrosswordConfig, Direction, Selected } from '../types/crossword';
import { ArrowLeft, ArrowRight, CircleHelp } from 'lucide-react';

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
        <div className='whitespace-pre-wrap max-w-[500px] flex flex-row gap-4 text-right direction-rtl' style={{direction: 'rtl'}}>
            <CluesList currentDef={currentDef} clueList={currentConfig.rowClues} direction={'across'} onSelectDef={onSelectDef} isDefCompleted={isDefCompleted} />
            <CluesList currentDef={currentDef} clueList={currentConfig.columnClues} direction={'down'} onSelectDef={onSelectDef} isDefCompleted={isDefCompleted} />
        </div>
    )
}

interface MainClueProps {
    moveToNextDefinition: (forward: boolean) => void;
    hintsShown: boolean;
    isMobile: boolean;
    selected: Selected;
    direction: Direction;
    currentAvailableHint: string;
    currentConfig: CrosswordConfig;
    toggleHint: () => void;
}

export const MainClue: React.FC<MainClueProps> = ({moveToNextDefinition, hintsShown, toggleHint, isMobile, selected, direction, currentAvailableHint, currentConfig}) => {
    function HintText({defaultText}: {defaultText: string}) {
        return (
          (hintsShown && currentAvailableHint) ? (
            <span className='text-bold'>{currentAvailableHint}</span>
          ) : <span>{defaultText}</span>
        )
      }

    return <div className={`whitespace-pre-wrap min-h-[65px] w-[100%] ${hintsShown ? 'bg-yellow-200/70' : 'bg-highlight-200/80'} border-[0.5px] ${isMobile ? '' : 'rounded-lg'}`}>
    <div className="min-h-[65px] p-2 w-full max-w-[500px] mx-auto direction-rtl text-right flex gap-0 justify-between" style={{ direction: 'rtl' }}>
      <div className="flex-none cursor-pointer select-none text-xl pt-2 pl-3"
      onClick={() => moveToNextDefinition(true)}>
      {<ArrowRight />}
      </div>
      <div className="flex-1 gap-0">
      {selected && direction === 'across' && (
        <div>
          <span className="text-[12px] ml-2">{selected.row + 1} מאוזן</span> {<HintText defaultText={currentConfig.rowClues[selected.row]} />}
        </div>
      )}
      {selected && direction === 'down' && (
        <div>
          <span className="text-[12px] ml-2">{selected.col + 1} מאונך</span> {<HintText defaultText={currentConfig.columnClues[selected.col]} />}
        </div>
      )}
      </div>
      {currentAvailableHint && <div className="flex-none cursor-pointer select-none text-2xl px-2 pt-2" title='להציג/להסתיר רמז'
        onClick={toggleHint}>
      {<CircleHelp />}
      </div>}
      <div className="flex-none cursor-pointer select-none text-2xl pt-2 pr-3"
      onClick={() => moveToNextDefinition(false)}>
      {<ArrowLeft />}
      </div>
    </div>
  </div>
}