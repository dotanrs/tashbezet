import React from 'react';

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
  message
}) => {
  return (
    <div id="sidebar">
      <div>
        {/* Status message */}
        {message && (
          <div className="mb-6 p-2 rounded bg-green-100 text-green-800" style={{ direction: 'rtl' }}>
            {message}
          </div>
        )}

        {/* Buttons section */}
        <div className="flex flex-col gap-2 text-[13px] w-[90px]">
          <button
            onClick={onMarkPuzzle}
            disabled={!hasUntestedCells}
            className={`px-3 py-2 rounded border-[1px] border-gray-800 ${
              hasUntestedCells 
                ? 'hover:bg-[#98e0db] bg-[#dbfcfa] text-black' 
                : 'bg-gray-300 text-gray-800 cursor-not-allowed'
            }`}
          >
            <div className="flex flex-row justify-between">
              🖋️
              <div>
                בדיקה
              </div>
            </div>
          </button>
          <button
            onClick={onHint}
            disabled={!hasAvailableHints}
            className={`px-3 py-2 rounded border-[1px] border-gray-800 ${
              hasAvailableHints 
                ? 'hover:bg-yellow-100 bg-[#dbfcfa] text-black' 
                : 'bg-gray-300 text-gray-800 cursor-not-allowed'
            }`}
          >
            <div className="flex flex-row justify-between">
              🤔
              <div>
                רמז
              </div>
            </div>
          </button>
          <button
            onClick={onReset}
            className="px-3 py-2 text-black border-[1px] border-gray-800 text-black rounded bg-[#dbfcfa] hover:bg-red-200"
          >
            <div className="flex flex-row justify-between">
              🧹
              <div>
                איפוס
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 