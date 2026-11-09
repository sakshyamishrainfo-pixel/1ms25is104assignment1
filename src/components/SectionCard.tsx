import React, { useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';
import { copyTextToClipboard, countWords } from '../utils/exporter';

interface SectionCardProps {
  id: string;
  sectionNumber: string;
  title: string;
  description?: string;
  copyContent: string;
  children: React.ReactNode;
  badge?: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  id,
  sectionNumber,
  title,
  description,
  copyContent,
  children,
  badge,
}) => {
  const [copied, setCopied] = useState(false);
  const wordCount = countWords(copyContent);

  const handleCopy = async () => {
    const success = await copyTextToClipboard(copyContent);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article
      id={id}
      className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 sm:p-7 transition-all scroll-mt-20"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-semibold text-blue-600 tabular-nums">
              {sectionNumber}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {title}
            </h3>
            {badge}
          </div>
          {description && (
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <span className="font-mono text-xs text-slate-400 tabular-nums" title="Estimated word count">
            {wordCount} words
          </span>

          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Copy this section to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Section</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="text-sm text-slate-700 leading-relaxed space-y-4">
        {children}
      </div>
    </article>
  );
};
