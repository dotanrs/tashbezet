import React from 'react';
import Button from './Button';

interface SidebarProps {
  onMarkPuzzle: () => void;
  onHint: () => void;
  onReset: () => void;
  hasUntestedCells: boolean;
  hasAvailableHints: boolean;
  message?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  onMarkPuzzle,
  onHint,
  onReset,
  hasUntestedCells,
  hasAvailableHints,
  message,
}) => {
  return (
      <>
        {/* Status message */}
        {/* {message && (
          <div className="mb-6 p-2 rounded bg-green-100 text-green-800" style={{ direction: 'rtl' }}>
            {message}
          </div>
        )} */}

        {/* Buttons section */}
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