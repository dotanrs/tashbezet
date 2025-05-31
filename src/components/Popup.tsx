import { HandHeart, LucideProps, Share2Icon, Trophy } from 'lucide-react';
import React, { useState } from 'react';
import { CrosswordConfig } from '../types/crossword';
import ReactConfetti from 'react-confetti';
import { getLatestPuzzleName } from '../crosswords';

interface ConfettiProps {
    showConfetti: boolean;
    windowSize: {width: number, height: number};
}

interface CommonPopupProps {
    confetti?: ConfettiProps;
    onClose: () => void;
}

interface PopupProps extends CommonPopupProps {
    currentConfig: CrosswordConfig;
    puzzleId: string | number;
}

interface BasePopupProps extends CommonPopupProps {
  message: string[];
  explanation?: string[];
  shareContent: string;
  shareLinkText?: string;
  addGlaze?: boolean;
  Icon: React.ComponentType<LucideProps>;
}

const getPuzzleName = (currentConfig: CrosswordConfig) => {
    const isLatestPuzzle = currentConfig.name === getLatestPuzzleName();
    return isLatestPuzzle ? `התשבצת השבועי (${currentConfig.name})` : `תשבצת ${currentConfig.name}`;
}

const drawCrossword = (currentConfig: CrosswordConfig) => {
    return currentConfig.grid.map(row => row.map(cell => cell === 'blank' ? '◼️' : '◻️').reverse().join('')).join('\n')
}

const getShareMessage = (currentConfig: CrosswordConfig, puzzleId: string) => {
        return `כרגע פתרתי את ${getPuzzleName(currentConfig)}, בא לך לנסות גם?
${drawCrossword(currentConfig)}
https://dotanrs.github.io/tashbezet/?puzzleId=${puzzleId}
`
}

const Popup: React.FC<BasePopupProps> = ({
    message,
    explanation = [],
    shareContent,
    shareLinkText = "לשתף את התשבץ",
    addGlaze = false,
    confetti = null,
    onClose,
    Icon,
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

    return (
    <div className='fixed z-40 w-[100%] h-[100%] px-10 top-0 left-0 bg-gray-500/50 pt-[8vh]' onClick={onClose}>
        {confetti && confetti.showConfetti && (
            <ReactConfetti
            width={confetti.windowSize.width}
            height={confetti.windowSize.height}
            recycle={false}
            numberOfPieces={400}
            gravity={0.2}
            colors={['#d1f7eb', '#98e0db', '#dbfcfa', '#2ea199', '#f2fcfb']}
            />
        )}
        <div className="p-8 border-gray-200 border-2 w-auto max-w-[400px] text-center mx-auto rounded-xl text-xl bg-background-300 text-white relative shadow-xl overflow-hidden"
            style={{ direction: 'rtl' }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            {addGlaze && <div className="absolute inset-0 translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />}
            <Icon className='w-[150px] h-[150px] mx-auto mb-6 max-w-[80%]' />
            {message.map((text: string, index: number) => <div key={index} className="relative">{text}</div>)}

            {explanation && (
                <div className='mt-3 text-sm'>
                    {explanation.map((text: string, index: number) => <div key={index} className="relative">{text}</div>)}
                </div>
            )}
            <div
            className={`text-sm ${shareLinkClicked ? '' : 'hover:underline cursor-pointer'} text-gray-300 mt-8`}
            onClick={handleShareButtonClicked}>
            <Share2Icon className='inline ml-1 w-4 h-4' /> 
            {shareLinkClicked ? 'הקישור הועתק!' : shareLinkText}
            </div>
        </div>
    </div>)
}

export const PuzzleDonePopup: React.FC<PopupProps> = ({ currentConfig, puzzleId, confetti, onClose }) => {
    return <Popup 
        shareContent={getShareMessage(currentConfig, `${puzzleId}`)}
        message={['כל הכבוד, פתרת את זה!', ' ביום חמישי יהיה תשבץ חדש ☺️']}
        addGlaze={true}
        confetti={confetti}
        onClose={onClose}
        Icon={Trophy}
    />
}

export const AllPuzzlesDonePopup: React.FC<PopupProps> = ({ currentConfig, puzzleId, confetti, onClose }) => {
    return <Popup 
        shareContent={getShareMessage(currentConfig, `${puzzleId}`)}
        message={['פתרת את כל התשבצים! ⭐️', 'נתראה בפעם הבאה ביום חמישי']}
        addGlaze={true}
        confetti={confetti}
        onClose={onClose}
        Icon={Trophy}
    />
}

export const SharePopup: React.FC<PopupProps> = ({ currentConfig, puzzleId, onClose }) => {
    const shareContent = `https://dotanrs.github.io/tashbezet/?puzzleId=${puzzleId}`
    return <Popup 
        shareContent={shareContent}
        message={['משתפים עם מי שאוהבים']}
        explanation={['או עם מי שיכולים לעזור בהגדרות קשות 🙃']}
        onClose={onClose}
        Icon={HandHeart}
        shareLinkText='קישור לתשבץ הנוכחי'
    />
}
