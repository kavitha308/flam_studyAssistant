import React from 'react';
import { Header } from '../components/Header';
import { StudyInputForm } from '../components/StudyInputForm';
import { Sparkles } from 'lucide-react';

export const StudyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Full Feature Complete Platform
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            StudyFlow AI
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal">
            Turn your free-form lecture notes, articles, or any study topic into interactive flashcards, practice quizzes, and targeted mistake retries.
          </p>
        </div>

        <StudyInputForm />
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
        <p>&copy; {new Date().getFullYear()} StudyFlow AI. All rights reserved.</p>
      </footer>
    </div>
  );
};
