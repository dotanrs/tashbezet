import { Share2Icon, Trophy } from 'lucide-react';
import React, { useState } from 'react';
import { CrosswordConfig } from '../types/crossword';

interface PopupProps {
    currentConfig: CrosswordConfig;
    puzzleId: string | number;
}

interface BasePopupProps {
  message: string[];
  shareContent: string;
  shareLinkText?: string;
  addGlaze?: boolean;
}

const drawCrossword = (currentConfig: CrosswordConfig) => {
    return currentConfig.grid.map(row => row.map(cell => cell === 'blank' ? '◼️' : '◻️').reverse().join('')).join('\n')
}

const getShareMessage = (currentConfig: CrosswordConfig, puzzleId: string) => {
        return `כרגע פתרתי את תשבצת ${currentConfig.name}, בא לך לנסות גם?
${drawCrossword(currentConfig)}
https://dotanrs.github.io/tashbezet/?puzzleId=${puzzleId}
`
}

const Popup: React.FC<BasePopupProps> = ({
    message,
    shareContent,
    shareLinkText = "לשתף את התשבץ",
    addGlaze = false,
}) => {
    const [shareLinkClicked, setShareLinkClicked] = useState(false); 

    const handleShareButtonClicked = async (e: React.MouseEvent) => {
        try {
          await navigator.clipboard.writeText(shareContent);
          setShareLinkClicked(true);
          setTimeout(() => setShareLinkClicked(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      };

    return <div className="p-8 w-auto max-w-[400px] text-center mx-auto mx-2 rounded-xl text-xl bg-background-300 text-white relative shadow-xl overflow-hidden"
        style={{ direction: 'rtl' }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        {addGlaze && <div className="absolute inset-0 translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />}
        <Trophy className='w-[150px] h-[150px] mx-auto mb-6' />
        {message.map((text: string) => <div key={text} className="relative">{text}</div>)}
        <div
          className={`text-sm ${shareLinkClicked ? '' : 'hover:underline cursor-pointer'} text-gray-300 mt-8`}
          onClick={handleShareButtonClicked}>
          <Share2Icon className='inline ml-1 w-4 h-4' /> 
          {shareLinkClicked ? 'הקישור הועתק!' : shareLinkText}
        </div>
    </div>
}

export const PuzzleDonePopup: React.FC<PopupProps> = ({ currentConfig, puzzleId }) => {
    return <Popup 
        shareContent={getShareMessage(currentConfig, `${puzzleId}`)}
        message={['כל הכבוד, פתרת את זה!', ' ביום חמישי יהיה תשבץ חדש ☺️']}
        addGlaze={true}
    />
}

export const AllPuzzlesDonePopup: React.FC<PopupProps> = ({ currentConfig, puzzleId }) => {
    return <Popup 
        shareContent={getShareMessage(currentConfig, `${puzzleId}`)}
        message={['פתרת את כל התשבצים! ⭐️', 'נתראה בפעם הבאה ביום חמישי']}
        addGlaze={true}
    />
}
