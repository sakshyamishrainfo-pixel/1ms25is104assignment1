import React, { useState } from 'react';
import { ReferenceItem } from '../types/research';
import { Copy, Check, ExternalLink, Search, CheckCircle2, AlertCircle, BookMarked } from 'lucide-react';
import { copyTextToClipboard, formatCitation } from '../utils/exporter';

interface ReferencesCardProps {
  references: ReferenceItem[];
}

export const ReferencesCard: React.FC<ReferencesCardProps> = ({ references = [] }) => {
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const verifiedCount = references.filter((r) => r.verificationStatus === 'verified_landmark').length;
  const unverifiedCount = references.length - verifiedCount;

  const filteredRefs = references.filter((r) => {
    if (filter === 'verified') return r.verificationStatus === 'verified_landmark';
    if (filter === 'unverified') return r.verificationStatus === 'proposed_benchmark_unverified';
    return true;
  });

  const allReferencesText = references
    .map((r, i) => `${formatCitation(r, 'IEEE')} [${r.verificationStatus === 'verified_landmark' ? 'VERIFIED LANDMARK' : 'REQUIRES VERIFICATION'}]\nNote: ${r.verificationNote}`)
    .join('\n\n');

  const handleCopyAll = async () => {
    const success = await copyTextToClipboard(allReferencesText);
    if (success) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const handleCopySingle = async (ref: ReferenceItem) => {
    const text = `${formatCitation(ref, 'IEEE')}\nNote: ${ref.verificationNote}`;
    const success = await copyTextToClipboard(text);
    if (success) {
      setCopiedId(ref.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <article
      id="section-references"
      className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 sm:p-7 transition-all scroll-mt-20"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-semibold text-blue-600 tabular-nums">09.</span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              References &amp; Citation Integrity Audit
            </h3>
            <span className="font-mono text-xs text-slate-400 tabular-nums">
              ({references.length} citations)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Every reference is cataloged with strict provenance. Landmark historical works are verified; domain benchmarks carry database lookup directives.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyAll}
          className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs self-end sm:self-center shrink-0"
        >
          {copiedAll ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Copied All!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy All References</span>
            </>
          )}
        </button>
      </div>

      {/* Filter Tabs & Verification Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Citations ({references.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('verified')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === 'verified'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verified Landmarks ({verifiedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unverified')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === 'unverified'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Requires Verification ({unverifiedCount})
          </button>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-3 px-1">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Verified Landmark
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Needs Verification
          </span>
        </div>
      </div>

      {/* Reference List */}
      <div className="space-y-4">
        {filteredRefs.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No citations matching this filter.
          </div>
        ) : (
          filteredRefs.map((ref, index) => {
            const isVerified = ref.verificationStatus === 'verified_landmark';
            const scholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(
              `${ref.authors} ${ref.title}`
            )}`;
            const crossRefUrl = `https://search.crossref.org/?q=${encodeURIComponent(ref.title)}`;

            return (
              <div
                key={ref.id || index}
                className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-white transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-xs font-bold text-blue-600 shrink-0 mt-0.5">
                      {ref.id || `[${index + 1}]`}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                        "{ref.title}"
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        <span className="font-medium text-slate-800">{ref.authors}</span>{' '}
                        <span>({ref.year})</span>
                        <span className="mx-1.5 text-slate-300" aria-hidden="true">·</span>
                        <span className="italic text-slate-700">{ref.source}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopySingle(ref)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0"
                    title="Copy citation"
                  >
                    {copiedId === ref.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Verification Status & Explanatory Note */}
                <div
                  className={`text-xs rounded-lg p-2.5 flex items-start gap-2 ${
                    isVerified
                      ? 'bg-emerald-50/60 border border-emerald-100 text-emerald-800'
                      : 'bg-amber-50/70 border border-amber-100 text-amber-900'
                  }`}
                >
                  {isVerified ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div className="font-semibold">
                      {isVerified
                        ? 'Independently Verified Landmark Publication'
                        : 'Proposed Literature Benchmark (Pending Verification)'}
                    </div>
                    <p className="text-xs leading-relaxed opacity-90">
                      {ref.verificationNote}
                    </p>
                  </div>
                </div>

                {/* Database Search & DOI Links */}
                <div className="flex items-center gap-3 pt-1 text-xs text-slate-500 flex-wrap">
                  {ref.doiOrUrl && (
                    <a
                      href={ref.doiOrUrl.startsWith('http') ? ref.doiOrUrl : `https://doi.org/${ref.doiOrUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 font-mono text-2xs"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>DOI: {ref.doiOrUrl}</span>
                    </a>
                  )}

                  <a
                    href={scholarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-blue-600 flex items-center gap-1 font-medium transition-colors"
                  >
                    <Search className="w-3 h-3 text-slate-400" />
                    <span>Search Google Scholar</span>
                  </a>

                  <a
                    href={crossRefUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-blue-600 flex items-center gap-1 font-medium transition-colors"
                  >
                    <BookMarked className="w-3 h-3 text-slate-400" />
                    <span>Search CrossRef</span>
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </article>
  );
};
