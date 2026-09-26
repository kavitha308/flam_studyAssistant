import React, { useState, useEffect } from 'react';
import { Layers, AlertCircle, RefreshCw } from 'lucide-react';
import { QuizQuestion as QuizQuestionType, UserQuizAnswer, QuizMode } from '../types/study';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';

interface QuizProps {
  questions: QuizQuestionType[];
  onBackToFlashcards: () => void;
  onNewTopicClick?: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onBackToFlashcards, onNewTopicClick }) => {
  const [quizMode, setQuizMode] = useState<QuizMode>('normal');
  const [currentIndex, setCurrentIndex] = useState(0);

  const [originalAnswers, setOriginalAnswers] = useState<Record<string, UserQuizAnswer>>({});

  const [retryQuestions, setRetryQuestions] = useState<QuizQuestionType[]>([]);
  const [retryAnswers, setRetryAnswers] = useState<Record<string, UserQuizAnswer>>({});
  const [retryRound, setRetryRound] = useState<number>(0);

  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setQuizMode('normal');
    setCurrentIndex(0);
    setOriginalAnswers({});
    setRetryQuestions([]);
    setRetryAnswers({});
    setRetryRound(0);
    setIsCompleted(false);
  }, [questions]);

  const validQuestions = (questions || []).filter(
    (q) =>
      q &&
      q.id &&
      typeof q.question === 'string' &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correctAnswer === 'number' &&
      q.correctAnswer >= 0 &&
      q.correctAnswer <= 3
  );

  if (!validQuestions || validQuestions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-slate-800">No Quiz Questions Available</h4>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            No valid quiz questions were generated for this topic. Please try generating a new study topic.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onBackToFlashcards}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Return to Flashcards</span>
          </button>
          {onNewTopicClick && (
            <button
              onClick={onNewTopicClick}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate New Topic</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const activeQuestions = quizMode === 'retry' ? retryQuestions : validQuestions;
  const currentQuestion = activeQuestions[currentIndex];
  const totalQuestions = activeQuestions.length;

  const currentAnswers = quizMode === 'retry' ? retryAnswers : originalAnswers;
  const answeredCount = Object.keys(currentAnswers).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const handleAnswerSubmit = (selectedOption: number, isCorrect: boolean) => {
    if (!currentQuestion) return;

    if (quizMode === 'normal') {
      setOriginalAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: { selectedOption, isCorrect },
      }));
    } else {
      setRetryAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: { selectedOption, isCorrect },
      }));
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleStartRetry = () => {
    let wrongSubset: QuizQuestionType[] = [];

    if (quizMode === 'normal') {
      wrongSubset = validQuestions.filter(
        (q) => originalAnswers[q.id] && !originalAnswers[q.id].isCorrect
      );
    } else {
      wrongSubset = retryQuestions.filter(
        (q) => retryAnswers[q.id] && !retryAnswers[q.id].isCorrect
      );
    }

    if (wrongSubset.length === 0) return;

    setRetryQuestions(wrongSubset);
    setRetryAnswers({});
    setQuizMode('retry');
    setRetryRound((prev) => prev + 1);
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  const handleRestartFullQuiz = () => {
    setQuizMode('normal');
    setCurrentIndex(0);
    setOriginalAnswers({});
    setRetryQuestions([]);
    setRetryAnswers({});
    setRetryRound(0);
    setIsCompleted(false);
  };

  const originalCorrectCount = Object.values(originalAnswers).filter((ans) => ans.isCorrect).length;

  const activeCorrectCount = Object.values(currentAnswers).filter((ans) => ans.isCorrect).length;
  const activeIncorrectCount = Object.values(currentAnswers).filter((ans) => !ans.isCorrect).length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              {quizMode === 'retry' && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  Retry #{retryRound}
                </span>
              )}
              <span>
                Question {currentIndex + 1} of {totalQuestions}
              </span>
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-xs text-slate-500 font-medium">{answeredCount} answered</span>
          </div>

          <button
            onClick={onBackToFlashcards}
            className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Back to Flashcards</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${
              quizMode === 'retry' ? 'bg-amber-600' : 'bg-indigo-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Completion View vs Active Question View */}
      {isCompleted ? (
        <QuizResults
          totalQuestions={totalQuestions}
          correctCount={activeCorrectCount}
          incorrectCount={activeIncorrectCount}
          isRetryMode={quizMode === 'retry'}
          retryRound={retryRound}
          originalScore={{
            total: validQuestions.length,
            correct: originalCorrectCount,
          }}
          onRetryWrongAnswers={handleStartRetry}
          onRestartQuiz={handleRestartFullQuiz}
          onBackToFlashcards={onBackToFlashcards}
        />
      ) : (
        currentQuestion && (
          <QuizQuestion
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
            savedAnswer={currentAnswers[currentQuestion.id]}
            onSubmitAnswer={handleAnswerSubmit}
            onNextQuestion={handleNextQuestion}
            isLastQuestion={currentIndex === totalQuestions - 1}
          />
        )
      )}
    </div>
  );
};
