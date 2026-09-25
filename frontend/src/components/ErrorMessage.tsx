import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  code?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ code, message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 space-y-4 animate-fade-in text-red-900">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-red-100 text-red-600 shrink-0 mt-0.5">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-red-950">Something went wrong</h4>
            {code && (
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-red-200/80 text-red-900 border border-red-300">
                {code}
              </span>
            )}
          </div>
          <p className="text-sm text-red-800 leading-relaxed">{message}</p>
        </div>
      </div>

      {onRetry && (
        <div className="pt-2 border-t border-red-200/60 flex justify-end">
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
