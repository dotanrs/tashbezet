import { HandHeart, Share2Icon, Trophy, LucideProps, X, Bird, LampDesk, Hourglass } from 'lucide-react';
import React, { useState } from 'react';
import { CrosswordConfig } from '../types/crossword';
import ReactConfetti from 'react-confetti';
import { getLatestPuzzleName, PuzzleId } from '../crosswords';
import { TashbezetTitle } from '../utils/logo';
import { CountdownTimer } from '../utils/countdown';
import useIsMobile from '../hooks/useIsMobile';
import { formatAsText, formatTime } from '../utils/useGameTimer';

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
    puzzleId: string;
}

interface GamePopupProps extends PopupProps {
    puzzleDoneMessage: boolean;
    secondsElapsed: number;
}

interface BasePopupProps extends CommonPopupProps {
  message?: string;
  explanation?: string[];
  shareContent: string;
  shareLinkText?: string;
  addGlaze?: boolean;
  Icon: React.ComponentType<LucideProps>;
  ContentOverride?: React.ComponentType<any>;
  showCloseButton?: boolean;
  buttonText?: string;
}

const getPuzzleName = (currentConfig: CrosswordConfig) => {
    const isLatestPuzzle = currentConfig.name === getLatestPuzzleName();
    return isLatestPuzzle ? `התשבצת השבועי (${currentConfig.name})` : `תשבצת ${currentConfig.name}`;
}

const drawCrossword = (currentConfig: CrosswordConfig) => {
    return currentConfig.grid.map(row => row.map(cell => cell === 'blank' ? '◼️' : '◻️').reverse().join('')).join('\n')
}

const getShareMessage = (currentConfig: CrosswordConfig, puzzleId: string, secondsElapsed?: number) => {
    const challenge = secondsElapsed ? `ב-${formatAsText(secondsElapsed)}, רוצה לנסות לעקוף אותי?` : 'רוצה לנסות גם?';
        return `כרגע פתרתי את ${getPuzzleName(currentConfig)} ${challenge}
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
    message = null,
    explanation = [],
    shareContent,
    addGlaze = false,
    confetti = null,
    onClose,
    Icon,
    ContentOverride = null,
    showCloseButton = true,
    shareLinkText = 'שיתוף',
    buttonText = null,
}) => {
    return (
    <div id='popup-container' className='fixed z-40 w-[100%] h-[100%] top-0 left-0 bg-gray-500/50 pt-[8vh] inset-0 overflow-y-auto' onClick={onClose}>
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
        <div className={`p-8 pb-6 w-auto max-w-[400px] text-center mb-8 mx-auto sm:rounded-xl text-xl bg-background-10 text-gray-700 relative shadow-xl overflow-hidden`}
            style={{ direction: 'rtl' }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            {showCloseButton && <div className='text-sm flex flex-end flex-col' style={{direction: 'ltr'}}><X onClick={onClose} className='cursor-pointer' /></div>}
            
            {
                ContentOverride ? <ContentOverride /> :
            (<>
                {/* Default popup content */}
                <div className='relative'>
                {addGlaze && <div className="absolute inset-0 translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />}
                <Icon className='w-[150px] h-[150px] mx-auto mb-2 max-w-[80%] text-background-300' />
                </div>
                {message && <div className="font-bold text-2xl text-background-300">{message}</div>}

                {explanation && (
                    <div className='mt-3 text-sm'>
                        {explanation.map((text: string, index: number) => <div key={index} className="relative">{text}</div>)}
                    </div>
                )}
                {shareContent && ShareLink(shareLinkText, 'text-sm text-gray-700 mt-4', shareContent)}
                {buttonText && <button
                    onClick={onClose}
                    className="px-6 py-3 bg-background-300 text-white rounded-lg text-xl relative overflow-hidden group hover:shadow-lg mt-4"
                    style={{ direction: 'rtl' }}
                    >
                    <span className="relative whitespace-pre-wrap">{buttonText}</span>
                </button>}
            </>)
            }
        </div>
    </div>)
}

export const PuzzleDonePopup: React.FC<GamePopupProps> = ({ currentConfig, puzzleId, confetti, onClose, puzzleDoneMessage, secondsElapsed }) => {
    if (puzzleDoneMessage) {
        return <Popup
            shareContent={getShareMessage(currentConfig, `${puzzleId}`)}
            message={'כל הכבוד, פתרת את זה!'}
            explanation={['תזכורת: כל יום חמישי תשבץ חדש 🙂']}
            addGlaze={true}
            confetti={confetti}
            onClose={onClose}
            Icon={Trophy}
            shareLinkText={`שיתוף (תשבצת ${currentConfig.name})`}
        />
    }
    if (secondsElapsed > 0) {
        return <Popup
            shareContent={''}
            message={'המשחק נעצר'}
            explanation={[formatTime(secondsElapsed)]}
            buttonText={'שנמשיך?'}
            addGlaze={false}
            onClose={onClose}
            Icon={Hourglass}
        />
    }
    return <Popup
        shareContent={''}
        message={`ארכיון תשבצת`}
        explanation={[currentConfig.name]}
        buttonText={'שנתחיל?'}
        addGlaze={false}
        onClose={onClose}
        Icon={LampDesk}
    />
}

export const SharePopup: React.FC<PopupProps> = ({ currentConfig, puzzleId, onClose }) => {
    const shareContent = `https://dotanrs.github.io/tashbezet/?puzzleId=${puzzleId}`
    return <Popup 
        shareContent={shareContent}
        message={'משתפים עם מי שאוהבים'}
        explanation={['(או עם מי שיכולים לעזור בהגדרות קשות)']}
        onClose={onClose}
        Icon={HandHeart}
        shareLinkText='קישור לתשבץ הנוכחי'
    />
}

const wellDoneDescription = (currentConfig: CrosswordConfig, currentPuzzleId: PuzzleId, onClose: () => void, secondsElapsed: number) => {
    return <>
         <div className='relative'>
            <img className='relative top-[12px] mx-auto' alt='Tashbezet logo' src='https://dotanrs.github.io/tashbezet/favicon.ico'></img>
            <div className="absolute inset-0 translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <Trophy className='mx-auto mt-0 w-[150px] h-[150px] text-gold text-background-300' strokeWidth={'2px'} />
         </div>
         <div className='text-3xl text-background-300 font-bold mb-1'>כל הכבוד!</div>
         <div className='text-base'>פתרת את התשבצת השבועי</div>
         {secondsElapsed && (<div className='text-l'>ב-<span className='font-bold'>{formatTime(secondsElapsed)}</span></div>)}
         {ShareLink('לאתגר חברים', 'text-base text-background-300 mt-4 font-bold', getShareMessage(currentConfig, `${currentPuzzleId}`, secondsElapsed))}
        <div className='text-sm mt-4 text-black mb-6'>
            <div className='text-gray-500'>תשבץ חדש בעוד:</div>
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

const welcomeDescription = (currentConfig: CrosswordConfig, currentPuzzleId: PuzzleId, onClose: () => void, isMobile: boolean, iStarted: boolean, secondsElapsed: number) => {
    return (
        <div id='popup-container' className='fixed z-40 w-[100%] h-[100%] top-0 left-0 bg-background-300 pt-[8vh] inset-0 overflow-y-auto'>
        <div className={`p-8 pb-6 w-auto sm:max-w-[400px] sm:h-auto ${isMobile && 'min-h-[90%]'} text-center mb-8 mx-auto sm:rounded-xl text-xl
                    bg-background-10 text-gray-700 relative shadow-xl overflow-hidden flex flex-col`}
            style={{ direction: 'rtl' }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <div className='grow'></div>
              <div>
                <div className='w-full flex font-rubik'>
                    <div className={`$flex flex-row items-center justify-center m-auto mb-4`}>
                    <div className={`select-none border-black`} style={{ direction: 'rtl' }}>
                        {<TashbezetTitle
                        currentConfig={currentConfig}
                        currentPuzzleId={currentPuzzleId}
                        size={'text-2xl'}
                        width={'w-12'}
                        pencilPosition={'absolute left-[-15px] top-[-12px] w-[35px]'}
                        showPen={false}
                        showPuzzleName={false}
                        />}
                    </div>
                    </div>
                </div>
                <div className='text-xl text-gray-600 mb-4 font-rubik'>תשבץ קטן אחד בשבוע</div>
                <Bird className='mx-auto z-1 mt-0 w-[80px] h-[80px] text-gold text-background-300' strokeWidth={'2px'} />
                <img className='relative top-[-22px] left-[30px] mx-auto' alt='Tashbezet logo' src='https://dotanrs.github.io/tashbezet/favicon.ico'></img>
                <div className='text-sm text-gray-600'>התשבצת השבועי:</div><div className='text-sm text-black mb-6'>יום חמישי {currentConfig.name}</div>
                {iStarted && <div className='text-base text-background-300 mb-2'>המשחק נעצר ({formatTime(secondsElapsed)})</div>}
                <button
                    onClick={onClose}
                    className="px-6 py-3 bg-background-300 text-white rounded-lg text-xl relative overflow-hidden group hover:shadow-lg"
                    style={{ direction: 'rtl' }}
                    >
                    <div className={`absolute inset-0 opacity-0 ${isMobile ? 'opacity-100' : 'group-hover:opacity-100'}`}>
                        <div className={`absolute inset-0 translate-x-full ${isMobile ? 'animate-shimmer' : 'group-hover:animate-shimmer'} bg-gradient-to-r from-transparent via-white/30 to-transparent`} />
                    </div>
                    <span className="relative whitespace-pre-wrap">{iStarted ? 'לחזור לתשבץ' : 'להתחיל'}</span>
                </button>
            </div>
            <div className='grow'></div>
        </div>
    </div>)
}

const welcomeContent = (currentConfig:CrosswordConfig, currentPuzzleId: PuzzleId, onClose: () => void, isMobile: boolean, iStarted: boolean, secondsElapsed: number) => {
    return (
        <div className='fixed z-40 w-[100%] h-[100%] top-0 left-0 bg-gray-500/50 pt-[8vh] inset-0 overflow-y-auto'>
            {welcomeDescription(currentConfig, currentPuzzleId, onClose, isMobile, iStarted, secondsElapsed)}
        </div>
    )
}

interface WelcomePopupProps extends GamePopupProps {
    confetti?: ConfettiProps;
    iStarted: boolean;
}

export const WelcomePopup: React.FC<WelcomePopupProps> = ({currentConfig, puzzleId, onClose, puzzleDoneMessage, confetti = undefined, iStarted, secondsElapsed }) => {
    const isMobile = useIsMobile();
    if (!puzzleDoneMessage) {
        return welcomeContent(currentConfig, puzzleId, onClose, isMobile, iStarted, secondsElapsed);
    }
    return <Popup
        shareContent={''} // No effect} // No effect
        explanation={[]} // No effect
        onClose={onClose}
        Icon={HandHeart} // No effect
        ContentOverride={() => wellDoneDescription(currentConfig, puzzleId, onClose, secondsElapsed)}
        showCloseButton={false}
        confetti={confetti}
    />
}
