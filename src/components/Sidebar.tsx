import React from 'react';
import Button from './Button';

interface SidebarProps {
  onMarkPuzzle: () => void;
  onHint: () => void;
  onReset: () => void;
  hasUntestedCells: boolean;
  hasAvailableHints: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  onMarkPuzzle,
  onHint,
  onReset,
  hasUntestedCells,
  hasAvailableHints,
}) => {
  return (
      <>
      <Button
        onClick={onMarkPuzzle}
        disabled={!hasUntestedCells}
        icon="🖋️"
        text="בדיקה"
      />
      <Button
        onClick={onHint}
        disabled={!hasAvailableHints}
        icon="🤔"
        text="רמז"
        hoverColor="hover:bg-yellow-100"
      />
      <Button
        onClick={onReset}
        icon="🧹"
        text="איפוס"
        hoverColor="hover:bg-red-200"
        disabledStyle={false}
      />
    </>
  );
};

export default Sidebar; 