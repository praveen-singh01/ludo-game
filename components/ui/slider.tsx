import React from 'react';
import { cn } from '../../lib/utils';

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  max?: number;
  min?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  max = 100,
  min = 0,
  step = 1,
  className,
  disabled = false
}) => {
  const currentValue = value[0] || 0;
  const percentage = ((currentValue - min) / (max - min)) * 100;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    onValueChange([newValue]);
  };

  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <div className="relative w-full">
        {/* Track */}
        <div className="w-full h-2 bg-gray-200 rounded-full">
          {/* Progress */}
          <div
            className="h-2 bg-purple-600 rounded-full transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            "absolute inset-0 w-full h-2 opacity-0 cursor-pointer",
            disabled && "cursor-not-allowed"
          )}
        />
        
        {/* Thumb */}
        <div
          className={cn(
            "absolute top-1/2 w-4 h-4 bg-white border-2 border-purple-600 rounded-full shadow-md transform -translate-y-1/2 transition-all duration-200",
            "hover:scale-110 active:scale-95",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  );
};

export { Slider };
