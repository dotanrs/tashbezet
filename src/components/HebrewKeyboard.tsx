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

  const keyClasses = 'aspect-square text-gray-700 w-full flex items-center justify-center rounded border-[0.5px] border-gray-800 hover:bg-gray-200 active:bg-gray-300 text-lg';

  return (
    <div className="w-full bg-gray-100 p-2 rounded-b-lg border-[0.5px] border-t-0 border-gray-800">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid gap-1 mb-1" style={{
          gridTemplateColumns: rowIndex === 0 ? 'repeat(8, 1fr)' : 'repeat(8, 1fr)',
        }}>
          {rowIndex === 0 && (
            <>
              {row.map((letter) => (
                <button
                  key={letter}
                  onClick={() => onLetterClick(letter)}
                  className={`${keyClasses} bg-white`}
                >
                  {letter}
                </button>
              ))}
              <button
                onClick={onBackspace}
                className={`${keyClasses} bg-gray-200`}
              >
                ⌫
              </button>
            </>
          )}
          {rowIndex !== 0 && row.map((letter) => (
            <button
              key={letter}
              onClick={() => onLetterClick(letter)}
              className={`${keyClasses} bg-white `}
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