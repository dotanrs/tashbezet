import React, { useState } from 'react';
import { Grid, Selected, CellStatusGrid, Direction } from '../types/crossword';
import useIsMobile from '../hooks/useIsMobile';

interface CrosswordGridProps {
  userGrid: Grid;
  cellStatus: CellStatusGrid;
  selected: Selected;
  direction: Direction;
  cellRefs: React.MutableRefObject<(HTMLInputElement | null)[][]>;
  onCellClick: (row: number, col: number, isFocused: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDone: boolean;
}

const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  userGrid,
  cellStatus,
  selected,
  direction,
  cellRefs,
  onCellClick,
  onChange,
  isDone,
}) => {
  const isMobile = useIsMobile();

  const [gridFocued, setGridFocused] = useState(false);

  const getCellStyle = (row: number, col: number, isSelected: boolean | null) => {
    if (userGrid[row][col] === 'blank') {
      return 'bg-gray-800';
    }

    // First check if it's completed
    const isCompleted = cellStatus[row][col] === true;
    
    // Then check if it's selected or in the current word
    const isInCurrentWord = selected && (
      (direction === 'across' && selected.row === row) ||
      (direction === 'down' && selected.col === col)
    );

    return getBackgroundColor(isCompleted, isSelected, isInCurrentWord);
  }

  const getBackgroundColor = (isCompleted: boolean, isSelected: boolean | null, isInCurrentWord: boolean | null) => {
    if (isCompleted) {
      if (isSelected) {
        return 'bg-highlight-200/80';
      } else if (isInCurrentWord) {
        return 'bg-highlight-200/30';
      }
      return;
    }

    if (isSelected) {
      return 'bg-highlight-200';
    } else if (isInCurrentWord) {
      return 'bg-highlight-100';
    }

    return 'bg-white';
  };

  const displayToLogicalCol = (displayCol: number) => 4 - displayCol;
  const victoryGradient = 'bg-[linear-gradient(45deg,_white_20%,_#e1f2f1_35%,_white_55%)]'

  return (
    <div className={` grid grid-cols-5 gap-0 border-[0.5px] border-gray-800 w-full ${isDone && victoryGradient}`} tabIndex={-1} onFocus={() => setGridFocused(true)} onBlur={() => setGridFocused(false)}>
      {userGrid.map((row, rowIndex) => (
        row.map((_, displayColIndex) => {
          const colIndex = displayToLogicalCol(displayColIndex);
          const cell = userGrid[rowIndex][colIndex];
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-full aspect-square border-[0.5px] border-gray-800 flex items-center justify-center
                ${getCellStyle(rowIndex, colIndex, selected && selected.row === rowIndex && selected.col === colIndex)}
              `}
              onMouseDown={() => onCellClick(rowIndex, colIndex, gridFocued)}
            >
              {cell !== 'blank' && (
                <div className={`w-full h-full flex items-center justify-center text-[clamp(2vw,14vw,80px)] font-rubik
                  ${cellStatus[rowIndex][colIndex] === true ? 'cursor-default text-highlight-300 text-bold' : ''}
                  ${cellStatus[rowIndex][colIndex] === false ? 'line-through text-red-300' : ''}`}>
                  {cell}
                </div>
              )}
            </div>
          );
        })
      ))}
    </div>
  );
};

export default CrosswordGrid; 