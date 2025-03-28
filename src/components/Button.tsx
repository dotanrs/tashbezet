import React from 'react';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  icon: string;
  text: string;
  hoverColor?: string;
  disabledStyle?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  icon,
  text,
  hoverColor = 'hover:bg-[#98e0db]',
  disabledStyle = true,
}) => {
  const baseClasses = "px-3 py-2 rounded border-[1px] border-gray-800";
  const enabledClasses = `${baseClasses} ${hoverColor} bg-[#dbfcfa] text-black`;
  const disabledClasses = `${baseClasses} bg-gray-300 text-gray-800 cursor-not-allowed`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={disabled && disabledStyle ? disabledClasses : enabledClasses}
    >
      <div className="flex flex-row justify-between">
        {icon}
        <div className="pl-2">
          {text}
        </div>
      </div>
    </button>
  );
};

export default Button; 