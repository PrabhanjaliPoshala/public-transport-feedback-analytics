import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  label?: string;
  value: number;
  onChange?: (val: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RATING_LABELS: Record<number, string> = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Acceptable',
  4: 'Good',
  5: 'Excellent',
};

export const StarRating: React.FC<StarRatingProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  size = 'md',
}) => {
  const [hoverVal, setHoverVal] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const displayVal = hoverVal !== null ? hoverVal : value;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">{label}</span>
          {displayVal > 0 && (
            <span className="text-xs font-semibold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
              {RATING_LABELS[displayVal] || `${displayVal}/5`}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayVal;
          return (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => onChange && onChange(star)}
              onMouseEnter={() => !disabled && setHoverVal(star)}
              onMouseLeave={() => !disabled && setHoverVal(null)}
              className={`p-1 rounded-lg transition-transform focus:outline-none ${
                disabled ? 'cursor-default' : 'hover:scale-110 active:scale-95 cursor-pointer'
              }`}
            >
              <Star
                className={`${starSizes[size]} ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                    : 'text-slate-600 fill-slate-800 hover:text-slate-500'
                } transition-all`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
