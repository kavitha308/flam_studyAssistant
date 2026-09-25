import React from 'react';
import { BookOpen, Sparkles, Layers, HelpCircle } from 'lucide-react';

interface StudySummaryProps {
  title: string;
  summary: string;
  cardCount: number;
  quizCount: number;
  onNewTopicClick?: () => void;
}

export const StudySummary: React.FC<StudySummaryProps> = ({
  title,
  summary,
  cardCount,
  quizCount,
  onNewTopicClick,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 inline-flex items-center gap-1 mb-2">
            <Sparkles className="w-3 h-3" /> Study Topic
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
        </div>
        {onNewTopicClick && (
          <button
            onClick={onNewTopicClick}
            className="self-start sm:self-auto text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-all cursor-pointer"
          >
            + New Topic
          </button>
        )}
      </div>

      <p className="text-slate-700 text-sm sm:text-base leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
        {summary}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
        <span className="flex items-center gap-1.5 font-medium px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-100">
          <Layers className="w-4 h-4 text-indigo-600" /> {cardCount} Flashcards
        </span>
        <span className="flex items-center gap-1.5 font-medium px-3 py-1.5 rounded-lg bg-purple-50 text-purple-800 border border-purple-100">
          <HelpCircle className="w-4 h-4 text-purple-600" /> {quizCount} Quiz Questions
        </span>
      </div>
    </div>
  );
};
