import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle, Info } from 'lucide-react';
import { QuizQuestion as QuizQuestionType, UserQuizAnswer } from '../types/study';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  savedAnswer?: UserQuizAnswer;
  onSubmitAnswer: (selectedOption: number, isCorrect: boolean) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  savedAnswer,
  onSubmitAnswer,
  onNextQuestion,
  isLastQuestion,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(
    savedAnswer ? savedAnswer.selectedOption : null
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(Boolean(savedAnswer));

  useEffect(() => {
    if (savedAnswer) {
      setSelectedOption(savedAnswer.selectedOption);
      setIsSubmitted(true);
    } else {
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  }, [question.id, savedAnswer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption === null || isSubmitted) return;

    const isCorrect = selectedOption === question.correctAnswer;
    setIsSubmitted(true);
    onSubmitAnswer(selectedOption, isCorrect);
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            <HelpCircle className="w-3.5 h-3.5" /> Question {questionNumber} of {totalQuestions}
          </span>
          {isSubmitted && (
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                selectedOption === question.correctAnswer
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              {selectedOption === question.correctAnswer ? '✓ Correct' : '✕ Incorrect'}
            </span>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          {question.question}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3" role="radiogroup" aria-label="Quiz answer options">
          {question.options.map((optionText, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === question.correctAnswer;

            let optionStyle =
              'bg-slate-50 border-slate-200 text-slate-800 hover:bg-indigo-50/50 hover:border-indigo-300';

            if (isSubmitted) {
              if (isCorrectOption) {
                optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-xs';
              } else if (isSelected && !isCorrectOption) {
                optionStyle = 'bg-red-50 border-red-400 text-red-950 font-semibold';
              } else {
                optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            } else if (isSelected) {
              optionStyle = 'bg-indigo-50 border-indigo-600 text-indigo-950 font-semibold ring-2 ring-indigo-500/20';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isSubmitted}
                onClick={() => setSelectedOption(idx)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-3 text-sm sm:text-base cursor-pointer disabled:cursor-default ${optionStyle}`}
                role="radio"
                aria-checked={isSelected}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSubmitted
                        ? isCorrectOption
                          ? 'bg-emerald-600 text-white'
                          : isSelected
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                        : isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {optionLetters[idx]}
                  </span>
                  <span className="leading-relaxed">{optionText}</span>
                </div>

                {isSubmitted && (
                  <div className="shrink-0">
                    {isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-500" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div
            className={`p-5 rounded-xl border space-y-2 animate-fade-in ${
              selectedOption === question.correctAnswer
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-red-50/80 border-red-200 text-red-950'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {selectedOption === question.correctAnswer ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span>
                    Incorrect. Correct answer:{' '}
                    <span className="underline">
                      {optionLetters[question.correctAnswer]}: {question.options[question.correctAnswer]}
                    </span>
                  </span>
                </>
              )}
            </div>

            <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 pt-1 border-t border-slate-200/60">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-semibold text-slate-900">Explanation: </span>
                {question.explanation}
              </p>
            </div>
          </div>
        )}

        <div className="pt-3">
          {!isSubmitted ? (
            <button
              type="submit"
              disabled={selectedOption === null}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Submit Answer</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onNextQuestion}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isLastQuestion ? 'View Final Score' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
