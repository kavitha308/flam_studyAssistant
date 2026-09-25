import React from 'react';
import { Header } from '../components/Header';
import { StudyInputForm } from '../components/StudyInputForm';
import { Sparkles, Brain, CreditCard, HelpCircle, RefreshCw } from 'lucide-react';

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

        {/* Phase Roadmap */}
        <div className="mt-12 border-t border-slate-200 pt-8">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-6">
            Assignment Roadmap Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 opacity-80 flex items-start gap-2.5">
              <Brain className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-slate-800">Phase 2: AI Backend</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Gemini API &amp; Zod JSON validation.</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 opacity-80 flex items-start gap-2.5">
              <CreditCard className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-slate-800">Phase 3: Flashcards</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Interactive card flip &amp; recall tracking.</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 opacity-80 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-slate-800">Phase 4: Practice Quiz</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Multiple choice &amp; explanations.</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-2.5">
              <RefreshCw className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-emerald-950 flex items-center justify-between">
                  <span>Phase 5: Retry</span>
                  <span className="text-[9px] bg-emerald-200 text-emerald-800 px-1 py-0.2 rounded font-bold">Active</span>
                </h4>
                <p className="text-[11px] text-emerald-800 mt-0.5">Targeted retry of wrong answers.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
        <p>StudyFlow AI Frontend Internship Assignment &bull; Phase 5 Retry Wrong Answers Complete</p>
      </footer>
    </div>
  );
};
