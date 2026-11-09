import React, { useState } from 'react';
import { ResearchPaper } from '../types/research';
import { getSectionWordCountBreakdown, copyTextToClipboard } from '../utils/exporter';
import { X, FileText, Clock, BarChart3, Check, Copy, BookOpen } from 'lucide-react';

interface WordCountModalProps {
  paper: ResearchPaper;
  isOpen: boolean;
  onClose: () => void;
}

export const WordCountModal: React.FC<WordCountModalProps> = ({
  paper,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const stats = getSectionWordCountBreakdown(paper);
  const estimatedPages = (stats.total / 350).toFixed(1);
  const proposalTarget = 1500;
  const targetPct = Math.min(100, Math.round((stats.total / proposalTarget) * 100));

  const handleCopySummary = async () => {
    const lines = [
      `ACADEMIC WORD COUNT AUDIT`,
      `Document: ${paper.paperTitle}`,
      `Total Words: ${stats.total}`,
      `Reading Time: ~${stats.readingTimeMinutes} min`,
      `Estimated Academic Pages: ~${estimatedPages} pages`,
      '',
      'Section Breakdown:',
      ...stats.sections.map((s) => `• ${s.name}: ${s.words} words (${s.percentage}%)`),
    ];
    const success = await copyTextToClipboard(lines.join('\n'));
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Document Word Counter</h3>
              <p className="text-2xs text-slate-500">Live academic length &amp; section distribution</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top KPI Metrics Grid */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="block font-mono text-xl sm:text-2xl font-bold text-blue-600 tabular-nums">
                {stats.total}
              </span>
              <span className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Words
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="block font-mono text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                ~{stats.readingTimeMinutes}m
              </span>
              <span className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">
                Reading Time
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="block font-mono text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                {estimatedPages}
              </span>
              <span className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">
                Est. Pages
              </span>
            </div>
          </div>

          {/* Proposal Target Benchmark */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                Standard Proposal Benchmark (1,500 words)
              </span>
              <span className="font-mono text-blue-700 tabular-nums">{targetPct}%</span>
            </div>
            <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${targetPct}%` }}
              />
            </div>
            <p className="text-2xs text-slate-500">
              Optimal length for NSF/IEEE thesis proposals and initial conference workshop submissions.
            </p>
          </div>

          {/* Section by Section Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Section Distribution
            </h4>
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {stats.sections.map((sec, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium truncate max-w-[200px]">
                      {sec.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-2xs text-slate-400 tabular-nums">
                        {sec.percentage}%
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-900 tabular-nums w-12 text-right">
                        {sec.words} w
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(2, sec.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-2xs text-slate-500">Standard Academic Metric (WPM: 220)</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-white border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Audit</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
