import React, { useState } from 'react';
import { AlertCircle, RefreshCw, X, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onDismiss,
  onRetry,
}) => {
  const [showTips, setShowTips] = useState(false);

  const isTimeout = message.toLowerCase().includes('time') || message.toLowerCase().includes('abort');
  const isNetwork = message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch');

  return (
    <div className="bg-rose-50 border border-rose-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-950">
              {isTimeout
                ? 'Synthesis Timeout Notice'
                : isNetwork
                ? 'Connection Interruption'
                : 'Research Proposal Formulation Issue'}
            </h4>
            <p className="text-xs text-rose-900 leading-relaxed max-w-2xl">{message}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="p-1.5 text-rose-400 hover:text-rose-700 hover:bg-rose-100/60 rounded-lg transition-colors shrink-0"
          aria-label="Dismiss error notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-1 flex-wrap">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Synthesis</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowTips(!showTips)}
          className="text-xs font-medium text-rose-800 hover:text-rose-950 flex items-center gap-1 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>{showTips ? 'Hide Guidance' : 'Troubleshooting Tips'}</span>
          {showTips ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expandable Tips */}
      {showTips && (
        <div className="mt-3 pt-3 border-t border-rose-200/60 text-xs text-rose-800 space-y-1.5">
          <p className="font-semibold text-rose-900">Recommended Steps:</p>
          <ul className="list-disc list-inside space-y-1 text-2xs text-rose-800 pl-1">
            <li>Ensure your topic is specific (e.g., mention target algorithms, datasets, or hypotheses).</li>
            <li>If the AI service was briefly busy, clicking "Retry Synthesis" will re-attempt generation.</li>
            <li>You can also click any of the 1-click preset topics below to instantly test generation.</li>
          </ul>
        </div>
      )}
    </div>
  );
};
