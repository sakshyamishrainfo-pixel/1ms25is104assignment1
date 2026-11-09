import React from 'react';
import { ResearchPaper } from '../types/research';
import { X, Trash2, Clock, BookOpen, ChevronRight, FileText } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  papers: ResearchPaper[];
  onSelectPaper: (paper: ResearchPaper) => void;
  onDeletePaper: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
  currentPaperId?: string;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  papers,
  onSelectPaper,
  onDeletePaper,
  onClearAll,
  currentPaperId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Saved Research Proposals
              </h3>
              <span className="font-mono text-xs text-slate-500 tabular-nums">
                ({papers.length})
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {papers.length === 0 ? (
              <div className="text-center py-16 px-4">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700">No saved papers yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Generated proposals are automatically saved to your local workspace for quick retrieval.
                </p>
              </div>
            ) : (
              papers.map((paper) => {
                const isSelected = paper.id === currentPaperId;
                const formattedDate = new Date(paper.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <div
                    key={paper.id}
                    onClick={() => {
                      onSelectPaper(paper);
                      onClose();
                    }}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all relative group ${
                      isSelected
                        ? 'border-blue-400 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-2xs font-semibold text-blue-700">
                        {paper.field}
                      </span>
                      <span className="font-mono text-2xs text-slate-400 tabular-nums">
                        {formattedDate}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1.5 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
                      {paper.paperTitle}
                    </h4>

                    <p className="text-2xs text-slate-500 mt-1 line-clamp-1">
                      Inquiry: {paper.topic}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400">
                      <span>{paper.references?.length || 0} citations</span>
                      <button
                        type="button"
                        onClick={(e) => onDeletePaper(paper.id, e)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Delete from saved drafts"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {papers.length > 0 && (
            <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-400">Stored locally in browser</span>
              <button
                type="button"
                onClick={onClearAll}
                className="text-rose-600 hover:text-rose-700 font-medium transition-colors"
              >
                Clear All Drafts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
