import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from 'lucide-react';

interface ScoreSelectorProps {
  value: number;
  onChange: (v: number) => void;
  teamName: string;
  disabled?: boolean;
}

export function ScoreSelector({
  value,
  onChange,
  teamName,
  disabled
}: ScoreSelectorProps) {
  return (
    <div>
      <div
        role="radiogroup"
        aria-label={`Score for ${teamName}`}
        className="grid grid-cols-5 gap-2"
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const active = value === n;
          return (
            <motion.button
              whileHover={disabled ? {} : { scale: 1.05 }}
              whileTap={disabled ? {} : { scale: 0.9 }}
              key={n}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={`${n} out of 5`}
              disabled={disabled}
              onClick={() => onChange(n)}
              className={`relative flex h-14 items-center justify-center rounded-sm border text-xl font-extrabold transition-colors duration-300 disabled:opacity-50 ${
                active ?
                'border-brand bg-brand text-ink-950 shadow-[0_0_20px_rgba(212,175,55,0.4)]' :
                'border-line-strong bg-ink-950 text-fg-muted hover:border-brand/50 hover:bg-ink-800 hover:text-brand'
              }`}
            >
              {active && (
                <motion.div
                  layoutId={`highlight-${teamName}`}
                  className="absolute inset-0 rounded-sm bg-brand"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{n}</span>
            </motion.button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-1" aria-hidden>
          {[1, 2, 3, 4, 5].map((n) => (
            <motion.div
              key={n}
              animate={n <= value ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <StarIcon
                className={`h-4 w-4 transition-colors duration-300 ${
                  n <= value ? 'fill-brand text-brand drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]' : 'text-ink-700'
                }`}
                strokeWidth={1.5}
              />
            </motion.div>
          ))}
        </div>
        <span className="num text-sm font-extrabold text-fg">
          {value ? `${value} / 5` : '— / 5'}
        </span>
      </div>
    </div>
  );
}