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
}

const Sidebar: React.FC<SidebarProps> = ({
  onMarkPuzzle,
  onHint,
  onReset,
  hasUntestedCells,
  hasAvailableHints,
  baseBgColor,
  openSharePopup,
}) => {
  return (
      <>
      <Button
        onClick={openSharePopup}
        Icon={Share2}
        text=""
        baseBgColor={baseBgColor}
      />
      <Button
        onClick={onMarkPuzzle}
        disabled={!hasUntestedCells}
        Icon="🖋️"
        text="בדיקה"
        baseBgColor={baseBgColor}
      />
      <Button
        onClick={onHint}
        disabled={!hasAvailableHints}
        Icon="🤔"
        text="תן אות"
        hoverColor="hover:bg-yellow-100"
        baseBgColor={baseBgColor}
      />
      <Button
        onClick={onReset}
        Icon="🧹"
        text="איפוס"
        hoverColor="hover:bg-red-200"
        disabledStyle={false}
        baseBgColor={baseBgColor}
      />
    </>
  );
};

export default Sidebar; 