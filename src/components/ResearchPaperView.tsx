import React, { useState } from 'react';
import { ResearchPaper } from '../types/research';
import { SectionCard } from './SectionCard';
import { ReferencesCard } from './ReferencesCard';
import { PaperOutlineNav } from './PaperOutlineNav';
import { WordCountModal } from './WordCountModal';
import {
  Download,
  Copy,
  Check,
  FileText,
  AlertTriangle,
  Printer,
  Calendar,
  BarChart3,
  Clock,
  BookOpen,
  Share2,
  Bookmark,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  copyTextToClipboard,
  downloadPaperAsTxt,
  downloadBibTeX,
  formatPaperAsPlainText,
  calculateTotalWordCount,
  getSectionWordCountBreakdown,
} from '../utils/exporter';

interface ResearchPaperViewProps {
  paper: ResearchPaper;
  onNewProposal?: () => void;
}

export const ResearchPaperView: React.FC<ResearchPaperViewProps> = ({
  paper,
  onNewProposal,
}) => {
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedBib, setCopiedBib] = useState(false);
  const [citationStyle, setCitationStyle] = useState<'IEEE' | 'APA' | 'Nature'>('IEEE');
  const [isWordCountModalOpen, setIsWordCountModalOpen] = useState(false);

  const stats = getSectionWordCountBreakdown(paper);
  const totalWords = stats.total;
  const estimatedPages = (totalWords / 350).toFixed(1);

  const handleCopyFullPaper = async () => {
    const text = formatPaperAsPlainText(paper);
    const success = await copyTextToClipboard(text);
    if (success) {
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    downloadPaperAsTxt(paper);
  };

  const handleDownloadBibTeX = () => {
    downloadBibTeX(paper);
  };

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(paper.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fieldDisplay = paper.field === 'Other' && paper.customField ? paper.customField : paper.field;

  return (
    <div className="space-y-6">
      {/* Interactive Academic Toolbar & Live Word Counter Strip */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Word Counter Strip (Item 2 in user request) */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs text-slate-600">
          <button
            type="button"
            onClick={() => setIsWordCountModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 text-blue-800 font-semibold transition-all border border-blue-200/60 shadow-2xs group"
            title="Open comprehensive section word count distribution"
          >
            <BarChart3 className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="font-mono tabular-nums">{totalWords} Words</span>
            <span className="text-2xs text-blue-600 font-normal underline decoration-blue-300">
              Details
            </span>
          </button>

          <div className="flex items-center gap-3 font-mono text-2xs text-slate-500 tabular-nums">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              ~{stats.readingTimeMinutes} min read
            </span>
            <span aria-hidden="true">·</span>
            <span>~{estimatedPages} pages</span>
            <span aria-hidden="true">·</span>
            <span>{paper.references?.length || 0} citations</span>
          </div>
        </div>

        {/* Right: Academic Format Toolbar */}
        <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
          {/* Citation Style Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <span className="text-2xs text-slate-400 px-2 uppercase font-mono">Format:</span>
            {(['IEEE', 'APA', 'Nature'] as const).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setCitationStyle(style)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  citationStyle === style
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'hover:text-slate-900 text-slate-500'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* BibTeX Export */}
          <button
            type="button"
            onClick={handleDownloadBibTeX}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
            title="Export all references as a .bib BibTeX file"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            <span>.BIB</span>
          </button>

          {/* TXT Download */}
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            title="Download full proposal formatted as plain text"
          >
            <Download className="w-3.5 h-3.5" />
            <span>TXT</span>
          </button>

          {/* Full Copy */}
          <button
            type="button"
            onClick={handleCopyFullPaper}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
            title="Copy entire document text"
          >
            {copiedFull ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Formal Academic Typeset Paper Masthead */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-10 text-center space-y-4 relative overflow-hidden">
        {/* Subtle Journal Preprint Header Bar */}
        <div className="inline-flex items-center gap-2 text-2xs font-mono font-semibold tracking-wider text-slate-500 uppercase border-b border-slate-200 pb-1 mb-2">
          <span>Research Working Paper</span>
          <span aria-hidden="true">/</span>
          <span className="text-blue-700">{fieldDisplay}</span>
          <span aria-hidden="true">/</span>
          <span>Peer Review Scaffold</span>
        </div>

        {/* Paper Title in Refined Display Font */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight text-balance">
          {paper.paperTitle}
        </h1>

        {/* Scholarly Metadata Byline */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium flex-wrap pt-1">
          <span className="text-slate-800 font-semibold">Author Inquiry: {paper.topic}</span>
          <span aria-hidden="true">·</span>
          <span>Synthesized via ResearchMate AI Engine</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{formattedDate}</span>
        </div>

        {/* Abstract Box (Indented Academic Callout) */}
        <div className="max-w-3xl mx-auto text-left pt-6 pb-2">
          <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                Abstract
              </span>
              <span className="font-mono text-2xs text-slate-400 tabular-nums">
                {stats.sections[0].words} words
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic">
              {paper.abstract}
            </p>

            {paper.keywords && paper.keywords.length > 0 && (
              <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2 text-xs text-slate-600 flex-wrap">
                <span className="font-bold text-slate-800">Keywords:</span>
                {paper.keywords.map((kw, idx) => (
                  <span key={idx} className="font-mono text-2xs text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Two-Column Viewport: Sticky Outline Navigator + Content Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Sticky Outline */}
        <div className="hidden lg:block lg:col-span-1">
          <PaperOutlineNav />
        </div>

        {/* Right Content Stream */}
        <div className="lg:col-span-3 space-y-6">
          {/* Section 02: Introduction */}
          <SectionCard
            id="section-introduction"
            sectionNumber="02."
            title="Introduction &amp; Background"
            description="Theoretical backdrop, societal significance, and investigative scope."
            copyContent={`INTRODUCTION & BACKGROUND\n\n${paper.introduction}`}
          >
            <div className="space-y-3.5 text-slate-800 text-sm leading-relaxed">
              {paper.introduction.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </SectionCard>

          {/* Section 03: Problem Statement */}
          <SectionCard
            id="section-problem"
            sectionNumber="03."
            title="Problem Statement &amp; Research Gap"
            description="Articulation of core research gaps, empirical bottlenecks, and current literature limitations."
            copyContent={`PROBLEM STATEMENT & RESEARCH GAP\n\n${paper.problemStatement}`}
          >
            <div className="space-y-3.5 text-slate-800 text-sm leading-relaxed">
              {paper.problemStatement.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </SectionCard>

          {/* Section 04: Research Objectives */}
          <SectionCard
            id="section-objectives"
            sectionNumber="04."
            title="Research Objectives"
            description="Measurable, actionable milestones defining the experimental and theoretical scope."
            copyContent={`RESEARCH OBJECTIVES\n\n${paper.researchObjectives
              ?.map((obj, i) => `${i + 1}. ${obj}`)
              .join('\n')}`}
          >
            <ul className="space-y-3">
              {paper.researchObjectives?.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-800 bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{obj}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Section 05: Literature Review */}
          <SectionCard
            id="section-lit-review"
            sectionNumber="05."
            title="Thematic Literature Review"
            description="Thematic analysis of established literature, historical paradigms, and unresolved tensions."
            copyContent={`THEMATIC LITERATURE REVIEW\n\n${paper.literatureReview}`}
          >
            <div className="space-y-3.5 text-slate-800 text-sm leading-relaxed">
              {paper.literatureReview.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </SectionCard>

          {/* Section 06: Research Methodology */}
          <SectionCard
            id="section-methodology"
            sectionNumber="06."
            title="Research Methodology &amp; Experimental Architecture"
            description="Systematic experimental paradigm, data protocols, pipeline algorithms, and validity checks."
            copyContent={`RESEARCH METHODOLOGY\n\n1. Approach: ${paper.researchMethodology?.approach}\n\n2. Data Collection & Setup: ${paper.researchMethodology?.dataCollectionOrSetup}\n\n3. Analytical Procedure: ${paper.researchMethodology?.analyticalProcedure}\n\n4. Evaluation Metrics: ${paper.researchMethodology?.evaluationMetrics}\n\n5. Validity & Ethical Considerations: ${paper.researchMethodology?.ethicalAndValidityConsiderations}`}
          >
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
                  <span className="font-mono text-blue-600">§6.1</span>
                  <span>Methodological Approach &amp; Paradigm</span>
                </h4>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {paper.researchMethodology?.approach}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
                    <span className="font-mono text-blue-600">§6.2</span>
                    <span>Data Collection &amp; Setup</span>
                  </h4>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {paper.researchMethodology?.dataCollectionOrSetup}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
                    <span className="font-mono text-blue-600">§6.3</span>
                    <span>Evaluation Metrics &amp; Benchmarks</span>
                  </h4>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {paper.researchMethodology?.evaluationMetrics}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
                  <span className="font-mono text-blue-600">§6.4</span>
                  <span>Analytical Algorithm &amp; Computational Pipeline</span>
                </h4>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {paper.researchMethodology?.analyticalProcedure}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
                  <span className="font-mono text-blue-600">§6.5</span>
                  <span>Threats to Validity &amp; Ethical Safeguards</span>
                </h4>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {paper.researchMethodology?.ethicalAndValidityConsiderations}
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Section 07: Expected Results */}
          <SectionCard
            id="section-results"
            sectionNumber="07."
            title="Expected Results &amp; Theoretical Significance"
            description="Theoretical predictions, hypothesized performance gains, and prospective findings."
            badge={
              <span className="text-2xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                Prospective Hypotheses
              </span>
            }
            copyContent={`EXPECTED RESULTS\n\n1. Hypothesized Outcomes:\n${paper.expectedResults?.hypothesizedOutcomes}\n\n2. Theoretical & Practical Significance:\n${paper.expectedResults?.theoreticalSignificance}\n\n3. Empirical Verification Disclaimer:\n${paper.expectedResults?.prospectiveDistinction}`}
          >
            {/* Academic Rigor Advisory Box */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Research Distinction Protocol: </span>
                <span>
                  The outcomes described below represent prospective theoretical hypotheses formulated for experimental inquiry. Empirical validation is subject to execution of the methodology described in Section 06.
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-2">
                  <span className="font-mono text-blue-600">§7.1</span>
                  <span>Hypothesized Outcomes &amp; Performance Boundaries</span>
                </h4>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {paper.expectedResults?.hypothesizedOutcomes}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-2">
                  <span className="font-mono text-blue-600">§7.2</span>
                  <span>Theoretical &amp; Scientific Significance</span>
                </h4>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {paper.expectedResults?.theoreticalSignificance}
                </p>
              </div>

              <div className="pt-2 text-xs text-slate-500 italic">
                {paper.expectedResults?.prospectiveDistinction}
              </div>
            </div>
          </SectionCard>

          {/* Section 08: Conclusion */}
          <SectionCard
            id="section-conclusion"
            sectionNumber="08."
            title="Conclusion &amp; Future Trajectories"
            description="Synthesis of research vision, scholarly contribution, and roadmap for future investigations."
            copyContent={`CONCLUSION\n\n${paper.conclusion}`}
          >
            <div className="space-y-3.5 text-slate-800 text-sm leading-relaxed">
              {paper.conclusion.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </SectionCard>

          {/* Section 09: References & Citation Audit */}
          <ReferencesCard references={paper.references} />

          {/* Bottom Export Strip */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-900 block">
                Completed Proposal Package Ready for Submission
              </span>
              <span>
                Export in standard formats (TXT, BibTeX) or copy individual sections directly into Overleaf, Word, or LaTeX.
              </span>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => setIsWordCountModalOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-50 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Word Breakdown</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadBibTeX}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-50 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                <span>Export BibTeX</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadTxt}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download TXT</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Word Count Audit Modal */}
      <WordCountModal
        paper={paper}
        isOpen={isWordCountModalOpen}
        onClose={() => setIsWordCountModalOpen(false)}
      />
    </div>
  );
};
