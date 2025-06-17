import React from 'react';
import Button from './Button';
import { Share2 } from 'lucide-react';

interface SidebarProps {
  onMarkPuzzle: () => void;
  onHint: () => void;
  onReset: () => void;
  openSharePopup: () => void;
  hasUntestedCells: boolean;
  hasAvailableHints: boolean;
  baseBgColor: string;
  showShareButton: boolean;
  showHintButton: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  onMarkPuzzle,
  onHint,
  onReset,
  hasUntestedCells,
  hasAvailableHints,
  baseBgColor,
  openSharePopup,
  showShareButton,
  showHintButton,
}) => {
  return (
      <>
      {showShareButton && <Button
        onClick={openSharePopup}
        Icon={Share2}
        text=""
        baseBgColor={baseBgColor}
        title='לשתף את התשבץ הנוכחי'
      />}
      <Button
        onClick={onMarkPuzzle}
        disabled={!hasUntestedCells}
        Icon="🖋️"
        text="בדיקה"
        baseBgColor={baseBgColor}
        title='לסמן את האותיות הנכונות והשגויות'
      />
      {showHintButton && <Button
        onClick={onHint}
        disabled={!hasAvailableHints}
        Icon="🤔"
        text="תן אות"
        hoverColor="hover:bg-yellow-100"
        baseBgColor={baseBgColor}
        title='לחשוף אות אקראית בתשבץ'
      />}
      <Button
        onClick={onReset}
        Icon="🧹"
        text="איפוס"
        hoverColor="hover:bg-red-200"
        disabledStyle={false}
        baseBgColor={baseBgColor}
        title='להתחיל מחדש (ינקה את התשבץ ויאפס את השעון)'
      />
    </>
  );
};

export default Sidebar; 