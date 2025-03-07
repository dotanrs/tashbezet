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
      return 'bg-black';
    }

    if (cellStatus[row][col] !== null) {
      if (cellStatus[row][col]) {
        return 'bg-green-200';
      }
    }

    if (isSelected) {
      return 'bg-blue-200';
    } else if (
      selected && (
        (direction === 'across' && selected.row === row) ||
        (direction === 'down' && selected.col === col)
      )
    ) {
      return 'bg-blue-100';
    }

    return 'bg-white';
  };

  const displayToLogicalCol = (displayCol: number) => 4 - displayCol;

  return (
    <div className="grid grid-cols-5 gap-0 border border-black mb-4">
      {userGrid.map((row, rowIndex) => (
        row.map((_, displayColIndex) => {
          const colIndex = displayToLogicalCol(displayColIndex);
          const cell = userGrid[rowIndex][colIndex];
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-12 h-12 border-[0.5px] border-gray-400 flex items-center justify-center
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
                  className={`w-full h-full text-center text-xl outline-none bg-transparent font-rubik
                    ${cellStatus[rowIndex][colIndex] === true ? 'cursor-not-allowed' : ''}
                    ${cellStatus[rowIndex][colIndex] === false ? 'line-through text-red-500' : ''}`}
                  maxLength={1}
                  dir="rtl"
                  lang="he"
                  disabled={cellStatus[rowIndex][colIndex] === true}
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