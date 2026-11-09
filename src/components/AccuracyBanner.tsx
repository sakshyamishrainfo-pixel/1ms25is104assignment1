import React, { useState } from 'react';
import { ShieldCheck, Info, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export const AccuracyBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div id="academic-guidelines" className="bg-white rounded-xl border border-blue-100 shadow-xs p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-slate-900">
                Academic Integrity & Citation Verification Protocol
              </h3>
              <span className="text-xs text-blue-600 font-medium">Peer-Review Standard</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              ResearchMate AI enforces strict scientific integrity. Citations are categorized as verified foundational landmarks or prospective literature queries, and all projected outcomes are explicitly distinguished from empirical data.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium whitespace-nowrap shrink-0 transition-colors p-1"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? 'Hide Protocol' : 'Read Protocol'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="space-y-1.5">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              <span>1. Zero Hallucinated Citations</span>
            </div>
            <p className="leading-relaxed text-slate-500">
              Only authentic landmark literature carries verified badges. In specialized subfields, benchmark literature queries are transparently marked with instructions to verify in IEEE Xplore, PubMed, or Scopus.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              <span>2. Proposed vs. Empirical Findings</span>
            </div>
            <p className="leading-relaxed text-slate-500">
              Expected results are prospective hypotheses and mathematical predictions. Theoretical formulations are clearly distinguished from physical experimental measurements.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              <span>3. Ethical Academic Workflow</span>
            </div>
            <p className="leading-relaxed text-slate-500">
              This synthesis provides a graduate-level proposal scaffold for grants, thesis charters, and journal submissions, ready for researcher refinement and laboratory execution.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
