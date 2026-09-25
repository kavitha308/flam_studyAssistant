import React from 'react';
import { RotateCw, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Flashcard as FlashcardType } from '../types/study';

interface FlashcardProps {
  card: FlashcardType;
  isFlipped: boolean;
  onFlip: () => void;
  status?: 'known' | 'unknown';
}

export const Flashcard: React.FC<FlashcardProps> = ({ card, isFlipped, onFlip, status }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onFlip();
    }
  };

  return (
    <div
      className="w-full cursor-pointer select-none perspective-1000 group focus:outline-none"
      onClick={onFlip}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Flashcard: ${isFlipped ? 'Answer' : 'Question'}. Click or press Space/Enter to flip.`}
      aria-expanded={isFlipped}
    >
      <div
        className={`relative w-full min-h-[260px] sm:min-h-[300px] rounded-2xl transition-transform duration-500 transform-style-3d shadow-md group-hover:shadow-lg border ${
          status === 'known'
            ? 'border-emerald-300 bg-white'
            : status === 'unknown'
            ? 'border-amber-300 bg-white'
            : 'border-slate-200 bg-white'
        } ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* FRONT: QUESTION */}
        <div className="absolute inset-0 w-full h-full p-6 sm:p-8 flex flex-col justify-between backface-hidden rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              <HelpCircle className="w-3.5 h-3.5" /> Question
            </span>
            {status && (
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  status === 'known'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {status === 'known' ? '✓ I knew this' : '✕ Needs review'}
              </span>
            )}
          </div>

          <div className="my-auto py-4 text-center">
            <p className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed max-w-xl mx-auto">
              {card.question}
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Click to reveal answer</span>
          </div>
        </div>

        {/* BACK: ANSWER */}
        <div className="absolute inset-0 w-full h-full p-6 sm:p-8 flex flex-col justify-between backface-hidden rotate-y-180 rounded-2xl bg-indigo-900 text-white">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-indigo-800/80 px-3 py-1 rounded-full border border-indigo-700">
              <CheckCircle2 className="w-3.5 h-3.5" /> Answer
            </span>
            {status && (
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  status === 'known'
                    ? 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                    : 'bg-amber-900 text-amber-200 border border-amber-700'
                }`}
              >
                {status === 'known' ? '✓ Known' : '✕ Review'}
              </span>
            )}
          </div>

          <div className="my-auto py-4 text-center">
            <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed max-w-xl mx-auto">
              {card.answer}
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-300 group-hover:text-white transition-colors">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Click to flip back to question</span>
          </div>
        </div>
      </div>
    </div>
  );
};
