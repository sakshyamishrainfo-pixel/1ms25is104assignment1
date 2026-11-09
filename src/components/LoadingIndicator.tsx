import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Sparkles, Compass, ShieldCheck } from 'lucide-react';

const STAGES = [
  {
    title: 'Scoping Literature Gaps',
    description: 'Analyzing state-of-the-art benchmarks and defining the theoretical research gap...',
  },
  {
    title: 'Structuring Problem & Objectives',
    description: 'Synthesizing scholarly abstract and measurable, actionable research objectives...',
  },
  {
    title: 'Thematic Literature Synthesis',
    description: 'Formulating historical foundations, comparative paradigms, and literature critique...',
  },
  {
    title: 'Designing Rigorous Methodology',
    description: 'Architecting experimental paradigm, algorithms, metrics, and threats to validity...',
  },
  {
    title: 'Auditing Citation Integrity',
    description: 'Cross-verifying seminal landmark publications and flagging prospective queries...',
  },
  {
    title: 'Finalizing Academic Proposal',
    description: 'Typesetting 9 structured sections according to international peer-review standards...',
  },
];

const SCHOLARLY_TIPS = [
  'Tip: ResearchMate AI distinguishes theoretical projections from empirical data in Section 07.',
  'Tip: Foundational landmark literature is audited so you never encounter hallucinated citations.',
  'Tip: Use the BibTeX and TXT exporters to import your proposal directly into Overleaf or Word.',
  'Tip: Review the Methodology section for concrete statistical benchmarks and validity safeguards.',
];

export const LoadingIndicator: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setCurrentStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 2200);

    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % SCHOLARLY_TIPS.length);
    }, 4000);

    return () => {
      clearInterval(stageTimer);
      clearInterval(tipTimer);
    };
  }, []);

  const progressPercent = Math.min(95, Math.round(((currentStage + 1) / STAGES.length) * 100));

  return (
    <div className="space-y-6 my-6 max-w-3xl mx-auto">
      {/* Main Synthesizer Card */}
      <div className="bg-white rounded-2xl border border-blue-200/80 shadow-md p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600 animate-pulse" />

        {/* Orbiting Radar Visualizer */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-300 animate-spin" style={{ animationDuration: '8s' }} />
            {/* Middle pulsing ring */}
            <div className="absolute inset-2 rounded-full border-2 border-blue-100 animate-ping opacity-30" style={{ animationDuration: '2.5s' }} />
            {/* Inner core */}
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md relative z-10">
              <BookOpen className="w-7 h-7 text-white animate-pulse" />
            </div>
            {/* Orbiting dot */}
            <div className="absolute w-3 h-3 rounded-full bg-blue-600 top-0 left-1/2 -translate-x-1/2 shadow-xs" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Synthesizing Research Proposal
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
          {STAGES[currentStage].description}
        </p>

        {/* Progress Bar & Percentage */}
        <div className="mt-6 max-w-md mx-auto space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-blue-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              <span>{STAGES[currentStage].title}</span>
            </span>
            <span className="font-mono text-slate-500 tabular-nums">{progressPercent}%</span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step-by-Step Stage Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-6 max-w-xl mx-auto text-left">
          {STAGES.map((stage, idx) => {
            const isDone = idx < currentStage;
            const isCurrent = idx === currentStage;

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-2xs transition-all ${
                  isCurrent
                    ? 'border-blue-400 bg-blue-50/60 font-semibold text-blue-900 shadow-2xs'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50/40 text-emerald-800'
                    : 'border-slate-100 bg-slate-50/50 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <span className="font-mono text-3xs text-slate-400 shrink-0 tabular-nums">0{idx + 1}</span>
                  )}
                  <span className="truncate">{stage.title}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scholarly Advice Ticker */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 italic max-w-lg mx-auto transition-opacity duration-300">
          {SCHOLARLY_TIPS[tipIndex]}
        </div>
      </div>

      {/* Realistic Document Skeleton Preview */}
      <div className="bg-white/80 rounded-2xl border border-slate-200/80 p-6 space-y-4 opacity-75 animate-pulse">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-6 bg-slate-300 rounded w-3/4" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-5/6" />
          <div className="h-3 bg-slate-200 rounded w-4/6" />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="h-20 bg-slate-100 rounded-xl" />
          <div className="h-20 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
