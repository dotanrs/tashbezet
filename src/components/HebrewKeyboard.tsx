import React from 'react';

interface HebrewKeyboardProps {
  onLetterClick: (letter: string) => void;
  onBackspace: () => void;
}

const HebrewKeyboard: React.FC<HebrewKeyboardProps> = ({ onLetterClick, onBackspace }) => {
  // Hebrew keyboard layout in three rows
  const keyboardRows = [
    ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'פ'],
    ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל'],
    ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת']
  ];

  return (
    <div className="w-full bg-gray-100 p-2 rounded-b-lg border-[0.5px] border-t-0 border-gray-800">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 mb-1">
          {rowIndex === 0 && (
            <>
              {row.map((letter) => (
                <button
                  key={letter}
                  onClick={() => onLetterClick(letter)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded border-[1px] border-gray-800 hover:bg-gray-200 active:bg-gray-300 text-sm"
                >
                  {letter}
                </button>
              ))}
              <button
                onClick={onBackspace}
                className="w-12 h-8 flex items-center justify-center bg-white rounded border-[1px] border-gray-800 hover:bg-gray-200 active:bg-gray-300 text-sm"
              >
                ⌫
              </button>
            </>
          )}
          {rowIndex !== 0 && row.map((letter) => (
            <button
              key={letter}
              onClick={() => onLetterClick(letter)}
              className="w-8 h-8 flex items-center justify-center bg-white rounded border-[1px] border-gray-800 hover:bg-gray-200 active:bg-gray-300 text-sm"
            >
              {letter}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HebrewKeyboard; 