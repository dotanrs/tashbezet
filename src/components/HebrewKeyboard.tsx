import React, { useState } from 'react';

interface HebrewKeyboardProps {
  onLetterClick: (letter: string) => void;
  onBackspace: () => void;
}

const HebrewKeyboard: React.FC<HebrewKeyboardProps> = ({ onLetterClick, onBackspace }) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  // Hebrew keyboard layout in three rows
  const keyboardRows = [
    ['ק', 'ר', 'א', 'ט', 'ו', 'פ'],
    ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל'],
    ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת']
  ];

  const handleKeyPress = (letter: string) => {
    setPressedKey(letter);
    onLetterClick(letter);
    setTimeout(() => setPressedKey(null), 500);
  };

  const handleBackspace = () => {
    setPressedKey('backspace');
    onBackspace();
    setTimeout(() => setPressedKey(null), 500);
  };

  const keyClasses = 'aspect-square max-h-10 text-gray-700 w-full flex items-center justify-center rounded border-[0.5px] border-inset border-gray-800 text-lg';

  return (
    <div className="w-full bg-gray-100 p-2 border-[0.5px] border-t-0 border-gray-800 max-w-[100%]">
      <div className='max-w-[500px] mx-auto'>
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid gap-1 mb-1" style={{
            gridTemplateColumns: rowIndex === 0 ? 'repeat(8, 1fr)' : 'repeat(8, 1fr)',
          }}>
            {rowIndex === 0 && (
              <>
                {row.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleKeyPress(letter)}
                    className={`${keyClasses} bg-white ${pressedKey === letter ? 'animate-keypress' : ''}`}
                  >
                    {letter}
                  </button>
                ))}
                <button
                  onClick={handleBackspace}
                  className={`${keyClasses} bg-gray-200 col-span-2 ${pressedKey === 'backspace' ? 'animate-keypress' : ''}`}
                >
                  ⌫
                </button>
              </>
            )}
            {rowIndex !== 0 && row.map((letter) => (
              <button
                key={letter}
                onClick={() => handleKeyPress(letter)}
                className={`${keyClasses} bg-white ${pressedKey === letter ? 'animate-keypress' : ''}`}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HebrewKeyboard; 