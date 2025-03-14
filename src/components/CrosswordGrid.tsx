import React from 'react';
import { Grid, Selected, CellStatusGrid, Direction } from '../types/crossword';

interface CrosswordGridProps {
  userGrid: Grid;
  cellStatus: CellStatusGrid;
  selected: Selected;
  direction: Direction;
  cellRefs: React.MutableRefObject<(HTMLInputElement | null)[][]>;
  onCellClick: (row: number, col: number) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  userGrid,
  cellStatus,
  selected,
  direction,
  cellRefs,
  onCellClick,
  onChange,
  onKeyDown,
}) => {
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

    if (isCompleted) {
      if (isSelected) {
        return 'bg-[#e8f5e9]'; // Lighter green with a hint of yellow
      } else if (isInCurrentWord) {
        return 'bg-[#c8e6c9]'; // Very light green
      }
      return 'bg-green-200';
    }

    if (isSelected) {
      return 'bg-blue-200';
    } else if (isInCurrentWord) {
      return 'bg-blue-100';
    }

    return 'bg-white';
  };

  const displayToLogicalCol = (displayCol: number) => 4 - displayCol;

  return (
    <div className="grid grid-cols-5 gap-0 border border-gray-800">
      {userGrid.map((row, rowIndex) => (
        row.map((_, displayColIndex) => {
          const colIndex = displayToLogicalCol(displayColIndex);
          const cell = userGrid[rowIndex][colIndex];
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-[40px] md:w-[55px] h-[40px] md:h-[55px] border-[0.5px] border-gray-800 flex items-center justify-center
                ${getCellStyle(rowIndex, colIndex, selected && selected.row === rowIndex && selected.col === colIndex)}
              `}
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {cell !== 'blank' && (
                <input
                  ref={el => cellRefs.current[rowIndex][colIndex] = el}
                  type="text"
                  value={cell}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  className={`w-full h-full text-center text-2xl outline-none bg-transparent font-rubik
                    ${cellStatus[rowIndex][colIndex] === true ? 'cursor-default' : ''}
                    ${cellStatus[rowIndex][colIndex] === false ? 'line-through text-red-500' : 'text-gray-700'}`}
                  maxLength={1}
                  dir="rtl"
                  lang="he"
                />
              )}
            </div>
          );
        })
      ))}
    </div>
  );
};

export default CrosswordGrid; 