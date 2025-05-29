import React from 'react';
import Button from './Button';

interface SidebarProps {
  onMarkPuzzle: () => void;
  onHint: () => void;
  onReset: () => void;
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
}) => {
  return (
      <>
      <Button
        onClick={onMarkPuzzle}
        disabled={!hasUntestedCells}
        icon="🖋️"
        text="בדיקה"
        baseBgColor={baseBgColor}
      />
      <Button
        onClick={onHint}
        disabled={!hasAvailableHints}
        icon="🤔"
        text="תן אות"
        hoverColor="hover:bg-yellow-100"
        baseBgColor={baseBgColor}
      />
      <Button
        onClick={onReset}
        icon="🧹"
        text="איפוס"
        hoverColor="hover:bg-red-200"
        disabledStyle={false}
        baseBgColor={baseBgColor}
      />
    </>
  );
};

export default Sidebar; 