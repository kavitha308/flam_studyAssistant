import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Trophy,
  HelpCircle,
  RotateCw,
} from 'lucide-react';
import { Flashcard as FlashcardType, CardReviewStatus } from '../types/study';
import { Flashcard } from './Flashcard';

interface FlashcardDeckProps {
  cards: FlashcardType[];
  onStartQuiz?: () => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ cards, onStartQuiz }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<Record<string, CardReviewStatus>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewStatus({});
    setIsCompleted(false);
  }, [cards]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        setCurrentIndex((prev) => prev - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < cards.length - 1) {
        e.preventDefault();
        setCurrentIndex((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length]);

  if (!cards || cards.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
        No flashcards available. Please generate study material above.
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const totalCards = cards.length;
  const answeredCount = Object.keys(reviewStatus).length;
  const knownCount = Object.values(reviewStatus).filter((status) => status === 'known').length;
  const unknownCount = Object.values(reviewStatus).filter((status) => status === 'unknown').length;
  const progressPercent = Math.round((answeredCount / totalCards) * 100);

  const handleMarkStatus = (status: CardReviewStatus) => {
    const updated = {
      ...reviewStatus,
      [currentCard.id]: status,
    };
    setReviewStatus(updated);

    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">
              Card {currentIndex + 1} of {totalCards}
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-xs text-slate-500 font-medium">{answeredCount} answered</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ✓ {knownCount} Known
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              ✕ {unknownCount} Review
            </span>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {isCompleted ? (
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-md p-8 sm:p-10 text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900">Flashcards Complete!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Great job reviewing your study deck! Here is your session breakdown:
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 block">{totalCards}</span>
              <span className="text-xs text-slate-500 font-medium">Total Cards</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-700 block">{knownCount}</span>
              <span className="text-xs text-emerald-800 font-medium">Known</span>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-xl sm:text-2xl font-extrabold text-amber-700 block">{unknownCount}</span>
              <span className="text-xs text-amber-800 font-medium">To Review</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Flashcards</span>
            </button>

            <button
              onClick={onStartQuiz}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Start Quiz</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Flashcard
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
            status={reviewStatus[currentCard.id]}
          />

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => handleMarkStatus('unknown')}
                className={`py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  reviewStatus[currentCard.id] === 'unknown'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                }`}
              >
                <X className="w-4 h-4 shrink-0" />
                <span>✕ I didn't know</span>
              </button>

              <button
                type="button"
                onClick={() => handleMarkStatus('known')}
                className={`py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  reviewStatus[currentCard.id] === 'known'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}
              >
                <Check className="w-4 h-4 shrink-0" />
                <span>✓ I knew this</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Flip Card</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex === totalCards - 1 && isCompleted}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
