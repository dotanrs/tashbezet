import { HandHeart, Share2Icon, Trophy, LucideProps } from 'lucide-react';
import React, { useState } from 'react';
import { CrosswordConfig } from '../types/crossword';
import ReactConfetti from 'react-confetti';
import { getLatestPuzzleName, PuzzleId } from '../crosswords';
import { getTitle } from '../utils/logo';

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
  ContentOverride?: React.ComponentType<any>;
  backgroundColor?: string;
  borderColor?: string;
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
    ContentOverride = null,
    backgroundColor = 'bg-background-300',
    borderColor = 'border-gray-200',
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
        <div className={`p-8 ${borderColor} border-2 w-auto max-w-[400px] text-center mx-auto rounded-xl text-xl ${backgroundColor} text-white relative shadow-xl overflow-hidden`}
            style={{ direction: 'rtl' }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            {addGlaze && <div className="absolute inset-0 translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />}
            
            {
                ContentOverride ? <ContentOverride /> :
            (<>
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
            </>)
            }
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

const WelcomeContent = (currentConfig: CrosswordConfig, currentPuzzleId: PuzzleId, onClose: () => void) => {
    return () => (<>
<div className='w-full mt-10 flex'>
    <div className={`$flex flex-row items-center justify-center m-auto mb-8`}>
      <div className={`select-none border-black`} style={{ direction: 'rtl' }}>
        {getTitle(currentConfig, currentPuzzleId, 'text-2xl', 'w-12', false, 'absolute left-[-15px] top-[-12px] w-[35px]', false)}
      </div>
    </div>
  </div>
<div className='text-xl text-gray-600 mb-4' style={{fontFamily: "'Rubik', sans-serif"}}>תשבצת {currentConfig.name}</div>
<img className='mb-16 mx-auto' alt='Tashbezet logo' src='https://dotanrs.github.io/tashbezet/favicon.ico'></img>
  <button
  onClick={onClose}
  className="px-6 py-3 bg-background-300 text-white rounded-lg text-xl relative overflow-hidden group hover:shadow-lg"
  style={{ direction: 'rtl' }}
  >
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
      <div className="absolute inset-0 translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
  </div>
  <span className="relative whitespace-pre-wrap">להתחיל  ✍️</span>
 </button>
</>)
}

export const WelcomePopup: React.FC<PopupProps> = ({currentConfig, puzzleId, onClose }) => {
    return <Popup
        shareContent={''}
        message={[]}
        explanation={[]}
        onClose={onClose}
        Icon={HandHeart}
        shareLinkText='קישור לתשבץ הנוכחי'
        ContentOverride={WelcomeContent(currentConfig, puzzleId, onClose)}
        backgroundColor={'bg-background-50'}
        borderColor={'border-background-50'}
    />
}
