import React from 'react';
import { Trophy, RotateCcw, Layers, RefreshCw, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

interface QuizResultsProps {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  isRetryMode?: boolean;
  retryRound?: number;
  originalScore?: { total: number; correct: number };
  onRetryWrongAnswers: () => void;
  onRestartQuiz: () => void;
  onBackToFlashcards: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  totalQuestions,
  correctCount,
  incorrectCount,
  isRetryMode = false,
  retryRound = 1,
  originalScore,
  onRetryWrongAnswers,
  onRestartQuiz,
  onBackToFlashcards,
}) => {
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const isPerfectScore = incorrectCount === 0;

  return (
    <div className="bg-white rounded-2xl border border-indigo-200 shadow-md p-8 sm:p-10 text-center space-y-6 animate-fade-in">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner ${
          isPerfectScore ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'
        }`}
      >
        {isPerfectScore ? <Sparkles className="w-8 h-8" /> : <Trophy className="w-8 h-8" />}
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isRetryMode ? (isPerfectScore ? 'All Caught Up! 🎉' : 'Retry Complete!') : 'Quiz Complete!'}
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          {isRetryMode
            ? isPerfectScore
              ? "Awesome! You've mastered all the questions you previously missed."
              : `You still have ${incorrectCount} question${incorrectCount > 1 ? 's' : ''} to review.`
            : isPerfectScore
            ? 'Perfect score! You mastered all questions on your first attempt.'
            : `You have ${incorrectCount} question${incorrectCount > 1 ? 's' : ''} to review.`}
        </p>
      </div>

      {/* Main Score Cards */}
      {isRetryMode && originalScore ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          {/* Original Score Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Original Attempt
            </span>
            <span className="text-2xl font-black text-slate-700 mt-1 block">
              {originalScore.correct} / {originalScore.total}
            </span>
            <span className="text-[11px] text-slate-500">
              {Math.round((originalScore.correct / originalScore.total) * 100)}% Initial Score
            </span>
          </div>

          {/* Retry Score Card */}
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider block">
              Retry Attempt #{retryRound}
            </span>
            <span className="text-2xl font-black text-indigo-700 mt-1 block">
              {correctCount} / {totalQuestions}
            </span>
            <span className="text-[11px] text-indigo-600 font-semibold">{percentage}% Correct on Retry</span>
          </div>
        </div>
      ) : (
        /* Normal Score Card */
        <div className="p-6 rounded-2xl bg-indigo-50/70 border border-indigo-100 max-w-md mx-auto space-y-1">
          <span className="text-4xl sm:text-5xl font-black text-indigo-700 block tracking-tight">
            {percentage}%
          </span>
          <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block">
            {correctCount} / {totalQuestions} Questions Correct
          </span>
        </div>
      )}

      {/* Breakdown Grid */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
          <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-bold text-lg">
            <CheckCircle2 className="w-5 h-5" />
            <span>{correctCount}</span>
          </div>
          <span className="text-xs text-emerald-800 font-medium">Correct</span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
          <div className="flex items-center justify-center gap-1.5 text-amber-700 font-bold text-lg">
            <XCircle className="w-5 h-5" />
            <span>{incorrectCount}</span>
          </div>
          <span className="text-xs text-amber-800 font-medium">Needs Review</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100 max-w-md mx-auto">
        {!isPerfectScore ? (
          <button
            type="button"
            onClick={onRetryWrongAnswers}
            className="w-full sm:w-auto px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isRetryMode ? 'Retry Remaining Mistakes' : 'Retry Wrong Answers'}</span>
            <span className="text-xs font-bold bg-amber-800/80 px-2 py-0.5 rounded-full text-amber-100 ml-1">
              {incorrectCount}
            </span>
          </button>
        ) : (
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>All Mastered!</span>
          </div>
        )}

        <button
          type="button"
          onClick={onRestartQuiz}
          className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restart Full Quiz</span>
        </button>

        <button
          type="button"
          onClick={onBackToFlashcards}
          className="w-full sm:w-auto px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
        >
          <Layers className="w-4 h-4" />
          <span>Flashcards</span>
        </button>
      </div>
    </div>
  );
};
