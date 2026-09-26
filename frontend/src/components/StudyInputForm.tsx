import React, { useState, useRef } from 'react';
import { Sparkles, ArrowRight, Layers, HelpCircle } from 'lucide-react';
import { generateStudyMaterial } from '../services/studyApi';
import { StudyMaterial, StudyMode } from '../types/study';
import { SAMPLE_TOPICS } from '../utils/constants';
import { StudySummary } from './StudySummary';
import { FlashcardDeck } from './FlashcardDeck';
import { Quiz } from './Quiz';
import { ErrorMessage } from './ErrorMessage';

type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';

export const StudyInputForm: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [errorDetails, setErrorDetails] = useState<{ code?: string; message: string } | null>(null);
  const [resultData, setResultData] = useState<StudyMaterial | null>(null);
  const [studyMode, setStudyMode] = useState<StudyMode>('flashcards');

  const abortControllerRef = useRef<AbortController | null>(null);
  const currentRequestIdRef = useRef<number>(0);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorDetails(null);

    const trimmedText = inputText.trim();
    if (!trimmedText) {
      setStatus('error');
      setErrorDetails({
        code: 'VALIDATION_ERROR',
        message: 'Please enter a topic or some notes to study.',
      });
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const requestId = ++currentRequestIdRef.current;
    setStatus('loading');

    try {
      const response = await generateStudyMaterial(trimmedText, controller.signal);

      if (currentRequestIdRef.current !== requestId || controller.signal.aborted) {
        return;
      }

      if (response.success && response.data) {
        setResultData(response.data);
        setStatus('success');
        setStudyMode('flashcards');
      } else if (response.error) {
        setStatus('error');
        setErrorDetails(response.error);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log(`[StudyFlow AI] Request #${requestId} aborted by user submit`);
        return;
      }

      if (currentRequestIdRef.current === requestId) {
        setStatus('error');
        setErrorDetails({
          code: 'NETWORK_ERROR',
          message: "We couldn't reach the study service. Please try again.",
        });
      }
    } finally {
      if (currentRequestIdRef.current === requestId) {
        abortControllerRef.current = null;
      }
    }
  };

  const handleSampleClick = (sample: string) => {
    setInputText(sample);
    setErrorDetails(null);
    setStatus('idle');
  };

  const handleNewTopicClick = () => {
    setResultData(null);
    setStatus('idle');
    setStudyMode('flashcards');
    setInputText('');
    setErrorDetails(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="study-notes" className="block text-sm font-semibold text-slate-800 mb-2">
              Enter Study Notes or Topic
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Paste lecture notes, textbook excerpts, or enter a topic to generate interactive study material.
            </p>
            <textarea
              id="study-notes"
              rows={6}
              disabled={status === 'loading'}
              className="w-full p-4 text-slate-900 placeholder-slate-400 bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y text-base font-normal disabled:opacity-60"
              placeholder="e.g. Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
              <span>{inputText.length} characters</span>
              {inputText.length > 0 && status !== 'loading' && (
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="text-slate-500 hover:text-slate-800 underline transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Or try an example topic:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_TOPICS.map((topic, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={status === 'loading'}
                  onClick={() => handleSampleClick(topic)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition-all text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + {topic}
                </button>
              ))}
            </div>
          </div>

          {status === 'error' && errorDetails && (
            <ErrorMessage
              code={errorDetails.code}
              message={errorDetails.message}
              onRetry={() => handleSubmit()}
            />
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              aria-busy={status === 'loading'}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Study Material...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Study Material</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {status === 'loading' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-slate-800">Generating Your Study Material...</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our AI study assistant is analyzing your topic and creating flashcards &amp; quiz questions.
            </p>
          </div>
        </div>
      )}

      {status === 'success' && resultData && (
        <div className="space-y-8 animate-fade-in">
          <StudySummary
            title={resultData.title}
            summary={resultData.summary}
            cardCount={resultData.cards.length}
            quizCount={resultData.quiz.length}
            onNewTopicClick={handleNewTopicClick}
          />

          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setStudyMode('flashcards')}
                className={`px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  studyMode === 'flashcards'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Flashcards ({resultData.cards.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setStudyMode('quiz')}
                className={`px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  studyMode === 'quiz'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Practice Quiz ({resultData.quiz.length})</span>
              </button>
            </div>

            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Mode: <strong className="text-slate-700 capitalize">{studyMode}</strong>
            </span>
          </div>

          {/* Active Study View */}
          {studyMode === 'flashcards' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Interactive Flashcards</h3>
                <span className="text-xs text-slate-500 font-medium">Click card or press Space to flip</span>
              </div>
              <FlashcardDeck
                cards={resultData.cards}
                onStartQuiz={() => setStudyMode('quiz')}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Practice Quiz</h3>
                <span className="text-xs text-slate-500 font-medium">Select an option and submit</span>
              </div>
              <Quiz
                questions={resultData.quiz}
                onBackToFlashcards={() => setStudyMode('flashcards')}
                onNewTopicClick={handleNewTopicClick}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
