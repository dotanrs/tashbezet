import { LucideProps } from 'lucide-react';
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  Icon: string | React.ComponentType<LucideProps>;
  text: string;
  hoverColor?: string;
  disabledStyle?: boolean;
  baseBgColor: string,
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  Icon,
  text,
  baseBgColor,
  hoverColor = 'hover:bg-highlight-200',
  disabledStyle = true,
}) => {
  const baseClasses = "px-3 py-2 rounded border-[1px] border-gray-800 whitespace-nowrap";
  const enabledClasses = `${baseClasses} ${hoverColor} ${baseBgColor} text-black`;
  const disabledClasses = `${baseClasses} bg-gray-300 text-gray-800 cursor-not-allowed`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={disabled && disabledStyle ? disabledClasses : enabledClasses}
    >
      <div className="flex flex-row justify-between">
        {(typeof Icon == 'string') ? Icon : <Icon className='w-3 h-3' />}
       {text && <div className="pl-2">
          {text}
        </div>}
      </div>
    </button>
  );
};

export default Button; 