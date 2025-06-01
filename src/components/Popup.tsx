import { HandHeart, Share2Icon, Trophy, LucideProps, X, Bird } from 'lucide-react';
import React, { useState } from 'react';
import { CrosswordConfig } from '../types/crossword';
import ReactConfetti from 'react-confetti';
import { getLatestPuzzleName, PuzzleId } from '../crosswords';
import { getTitle } from '../utils/logo';
import { CountdownTimer } from '../utils/countdown';

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
  showCloseButton?: boolean;
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

const ShareLink = (shareLinkText: string, shareLinkDesign: string, shareContent: string) => {
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

    return <div
      className={`${shareLinkClicked ? '' : 'hover:underline cursor-pointer'} ${shareLinkDesign}`}
      onClick={handleShareButtonClicked}>
      <Share2Icon className='inline ml-1 w-4 h-4' />
      {shareLinkClicked ? 'הקישור הועתק!' : shareLinkText}
    </div>
}

const Popup: React.FC<BasePopupProps> = ({
    message,
    explanation = [],
    shareContent,
    addGlaze = false,
    confetti = null,
    onClose,
    Icon,
    ContentOverride = null,
    showCloseButton = true,
    shareLinkText = 'שיתוף',
}) => {

    return (
    <div id='popup-container' className='fixed z-40 w-[100%] h-[100%] px-10 top-0 left-0 bg-gray-500/50 pt-[8vh] inset-0 overflow-y-auto' onClick={onClose}>
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
        <div className={`p-8 pb-6 w-auto max-w-[400px] text-center mb-8 mx-auto rounded-xl text-xl bg-background-10 text-gray-700 relative shadow-xl overflow-hidden`}
            style={{ direction: 'rtl' }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            {showCloseButton && <div className='text-sm flex flex-end flex-col' style={{direction: 'ltr'}}><X onClick={onClose} className='cursor-pointer' /></div>}
            
            {
                ContentOverride ? <ContentOverride /> :
            (<>
                {/* Default popup content */}
                <div className='relative'>
                {addGlaze && <div className="absolute inset-0 translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />}
                <Icon className='w-[150px] h-[150px] mx-auto mb-6 max-w-[80%] text-background-300' />
                </div>
                {message.map((text: string, index: number) => <div key={index} className="relative">{text}</div>)}

                {explanation && (
                    <div className='mt-3 text-sm'>
                        {explanation.map((text: string, index: number) => <div key={index} className="relative">{text}</div>)}
                    </div>
                )}
                {ShareLink(shareLinkText, 'text-sm text-gray-700 mt-4', shareContent)}
            </>)
            }
        </div>
    </div>)
}

export const PuzzleDonePopup: React.FC<PopupProps> = ({ currentConfig, puzzleId, confetti, onClose }) => {
    return <Popup 
        shareContent={getShareMessage(currentConfig, `${puzzleId}`)}
        message={['כל הכבוד, פתרת את זה!']}
        explanation={['תזכורת: כל יום חמישי תשבץ חדש 🙂']}
        addGlaze={true}
        confetti={confetti}
        onClose={onClose}
        Icon={Trophy}
    />
}

export const AllPuzzlesDonePopup: React.FC<PopupProps> = ({ currentConfig, puzzleId, confetti, onClose }) => {
    return <Popup 
        shareContent={getShareMessage(currentConfig, `${puzzleId}`)}
        message={['פתרת את כל התשבצים!']}
        explanation={['נתראה בתשבץ הבא ביום חמישי ☺️']}
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
        explanation={['(או עם מי שיכולים לעזור בהגדרות קשות)']}
        onClose={onClose}
        Icon={HandHeart}
        shareLinkText='קישור לתשבץ הנוכחי'
    />
}

const wellDoneDescription = (currentConfig: CrosswordConfig, currentPuzzleId: PuzzleId, onClose: () => void) => {
    return <>
         <div className='relative'>
            <img className='relative top-[12px] mx-auto' alt='Tashbezet logo' src='https://dotanrs.github.io/tashbezet/favicon.ico'></img>
            <div className="absolute inset-0 translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <Trophy className='mx-auto mt-0 w-[150px] h-[150px] text-gold text-background-300' strokeWidth={'2px'} />
         </div>
         <div className='text-xl'>פתרת את התשבצת השבועי!</div>
         {ShareLink('שיתוף', 'text-base text-gray-700 mt-4 font-bold', getShareMessage(currentConfig, `${currentPuzzleId}`))}
        <div className='text-sm mt-4 text-black mb-6'>
            <div className='text-gray-500'>התשבץ הבא בעוד:</div>
            <CountdownTimer />
        </div>
          <button
            onClick={onClose}
          className="px-6 py-3 bg-background-300 text-white rounded-lg text-xl relative overflow-hidden hover:shadow-lg"
          style={{ direction: 'rtl' }}
          >
        <span className="relative whitespace-pre-wrap">לחזור לתשבץ</span>
       </button>
    </>
}

const welcomeDescription = (puzzleName: string, onClose: () => void) => {
    return <>
    <div className='text-xl text-gray-600 mb-4 font-rubik'>תשבץ קטן אחד בשבוע</div>
        <Bird className='mx-auto z-1 mt-0 w-[80px] h-[80px] text-gold text-background-300' strokeWidth={'2px'} />
        <img className='relative top-[-22px] left-[30px] mx-auto' alt='Tashbezet logo' src='https://dotanrs.github.io/tashbezet/favicon.ico'></img>
        <div className='text-sm text-gray-600'>התשבצת השבועי:</div><div className='text-sm text-black mb-6'>יום חמישי {puzzleName}</div>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-background-300 text-white rounded-lg text-xl relative overflow-hidden group hover:shadow-lg"
          style={{ direction: 'rtl' }}
          >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
            <div className="absolute inset-0 translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
        <span className="relative whitespace-pre-wrap">להתחיל</span>
       </button>
    </>
}

const WelcomeContent = (currentConfig: CrosswordConfig, currentPuzzleId: PuzzleId, isAlreadySolved: boolean, onClose: () => void) => {
    return () => (
    <div className='mb-2 text-gray-700'>
      <div className='w-full mt-4 flex font-rubik'>
        <div className={`$flex flex-row items-center justify-center m-auto mb-4`}>
          <div className={`select-none border-black`} style={{ direction: 'rtl' }}>
            {getTitle(currentConfig, currentPuzzleId, 'text-2xl', 'w-12', false, 'absolute left-[-15px] top-[-12px] w-[35px]', false)}
          </div>
        </div>
      </div>
      {isAlreadySolved ? wellDoneDescription(currentConfig, currentPuzzleId, onClose) : welcomeDescription(currentConfig.name, onClose)}
    </div>
)}

interface WelcomePopupProps extends PopupProps {
    isAlreadySolved: boolean;
    confetti?: ConfettiProps;
}

export const WelcomePopup: React.FC<WelcomePopupProps> = ({currentConfig, puzzleId, onClose, isAlreadySolved, confetti = undefined }) => {
    return <Popup
        shareContent={''} // No effect
        message={[]} // No effect
        explanation={[]} // No effect
        onClose={onClose}
        Icon={HandHeart} // No effect
        ContentOverride={WelcomeContent(currentConfig, puzzleId, isAlreadySolved, onClose)}
        showCloseButton={false}
        confetti={confetti}
    />
}
