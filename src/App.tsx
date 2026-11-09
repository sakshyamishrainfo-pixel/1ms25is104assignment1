import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { TopicForm } from './components/TopicForm';
import { ResearchPaperView } from './components/ResearchPaperView';
import { LoadingIndicator } from './components/LoadingIndicator';
import { AccuracyBanner } from './components/AccuracyBanner';
import { ResearchHistorySection } from './components/ResearchHistorySection';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ErrorBanner } from './components/ErrorBanner';
import { ResearchPaper, ResearchField } from './types/research';
import {
  GraduationCap,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ShieldCheck,
  History,
  FileText,
  Layers,
} from 'lucide-react';

const STORAGE_KEY = 'researchmate_saved_papers_v1';

export default function App() {
  const [currentPaper, setCurrentPaper] = useState<ResearchPaper | null>(null);
  const [savedPapers, setSavedPapers] = useState<ResearchPaper[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('generator');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [lastAttemptParams, setLastAttemptParams] = useState<{
    topic: string;
    field: ResearchField;
    customField?: string;
  } | null>(null);

  // Load saved papers from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: ResearchPaper[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedPapers(parsed);
          setCurrentPaper(parsed[0]);
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved papers from localStorage:', e);
    }
  }, []);

  // Save to localStorage when list changes
  const persistPapers = (papers: ResearchPaper[]) => {
    setSavedPapers(papers);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  };

  const handleGenerateResearch = async (
    topic: string,
    field: ResearchField,
    customField?: string
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLastAttemptParams({ topic, field, customField });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      const res = await fetch('/api/research/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          field,
          customField,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data: any;
      try {
        data = await res.json();
      } catch {
        throw new Error(`The research server returned an invalid response (Status ${res.status}).`);
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || `Research generation failed (Status ${res.status}). Please try again.`);
      }

      const newPaper: ResearchPaper = data.paper;
      setCurrentPaper(newPaper);

      // Add to saved papers (at the front)
      const updatedList = [
        newPaper,
        ...savedPapers.filter((p) => p.id !== newPaper.id),
      ].slice(0, 20); // keep up to 20 drafts
      persistPapers(updatedList);

      // Automatically switch to Active Paper Studio
      setActiveTab('active-paper');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('Research generation failed:', err);

      if (err.name === 'AbortError') {
        setErrorMessage(
          'The research synthesis timed out. The model is processing a heavy workload—please click "Retry Synthesis" to try again.'
        );
      } else if (err.message && err.message.includes('Failed to fetch')) {
        setErrorMessage(
          'Network connection interrupted or the research synthesis service restarted. Please verify your connection and click "Retry Synthesis".'
        );
      } else {
        setErrorMessage(
          err?.message || 'Failed to generate research paper proposal. Please check your topic and try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryLast = () => {
    if (lastAttemptParams) {
      handleGenerateResearch(
        lastAttemptParams.topic,
        lastAttemptParams.field,
        lastAttemptParams.customField
      );
    }
  };

  const handleSelectPaper = (paper: ResearchPaper) => {
    setCurrentPaper(paper);
    setActiveTab('active-paper');
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePaper = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedPapers.filter((p) => p.id !== id);
    persistPapers(updated);
    if (currentPaper?.id === id) {
      const remaining = updated.length > 0 ? updated[0] : null;
      setCurrentPaper(remaining);
      if (!remaining) {
        setActiveTab('generator');
      }
    }
  };

  const handleClearAllDrafts = () => {
    if (window.confirm('Are you sure you want to delete all saved research proposals?')) {
      persistPapers([]);
      setCurrentPaper(null);
      setActiveTab('generator');
    }
  };

  const handleNewResearch = () => {
    setActiveTab('generator');
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Clear Top Navigation Menu & Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewResearch={handleNewResearch}
        savedCount={savedPapers.length}
        hasActivePaper={Boolean(currentPaper)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Notification Banner */}
        {errorMessage && (
          <ErrorBanner
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
            onRetry={lastAttemptParams ? handleRetryLast : undefined}
          />
        )}

        {/* Loading Indicator with Radar Animation and Steps */}
        {isLoading && <LoadingIndicator />}

        {/* TAB 1: Proposal Generator View */}
        {!isLoading && activeTab === 'generator' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Academic Rigor Protocol Banner */}
            <AccuracyBanner />

            {/* Hero Introduction */}
            <div className="text-center max-w-3xl mx-auto pt-2 pb-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Scholarly Research Proposal Synthesizer</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 text-balance leading-tight">
                Accelerate Academic Inquiries with ResearchMate AI
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-2xl mx-auto leading-relaxed">
                Transform any research question or hypothesis into a structured, publication-grade proposal with verified landmark citations, rigorous methodology, and prospective results.
              </p>
            </div>

            {/* Input Form Card */}
            <div className="max-w-3xl mx-auto">
              <TopicForm onGenerate={handleGenerateResearch} isLoading={isLoading} />
            </div>

            {/* If user has saved papers, show quick recent preview strip */}
            {savedPapers.length > 0 && (
              <div className="max-w-3xl mx-auto bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-600 truncate">
                  <History className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-800">Recent Proposal:</span>
                  <span className="truncate text-slate-600">{savedPapers[0].paperTitle}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectPaper(savedPapers[0])}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Open in Studio
                </button>
              </div>
            )}

            {/* Academic Standards 3-Column Strip */}
            <section id="research-standards" className="pt-4">
              <div className="text-center mb-6">
                <h3 className="text-base font-bold text-slate-900">
                  Built to International Academic &amp; Peer-Review Standards
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Engineered specifically for university students, thesis candidates, and scientific researchers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs font-mono">
                    01
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Standard 9-Section Blueprint
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Generates Abstract, Introduction, Problem Formulation, Measurable Objectives, Literature Review, Methodology, Expected Results, Conclusion, and References.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs font-mono">
                    02
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Citation Integrity Engine
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Never fabricates fake authors, DOIs, or titles. Landmark literature is audited, and unverified benchmarks include 1-click links to Google Scholar and CrossRef.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs font-mono">
                    03
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Instant Academic Export
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Copy individual sections, copy full formatted text, or download as a structured TXT or BibTeX document ready for LaTeX, Word, Overleaf, or grant submission.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: Active Proposal Studio View */}
        {!isLoading && activeTab === 'active-paper' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {currentPaper ? (
              <>
                {/* Active Proposal Header Bar */}
                <div className="flex items-center justify-between gap-4 flex-wrap bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs text-slate-600 truncate">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-900">Active Proposal Studio:</span>
                    <span className="text-slate-700 truncate max-w-xs sm:max-w-md font-medium">
                      {currentPaper.paperTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('history')}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <History className="w-3.5 h-3.5 text-slate-500" />
                      <span>Archive ({savedPapers.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNewResearch}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>New Inquiry</span>
                    </button>
                  </div>
                </div>

                {/* Main Paper Document View */}
                <ResearchPaperView paper={currentPaper} onNewProposal={handleNewResearch} />
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center max-w-lg mx-auto">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No Active Proposal Loaded</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Select a paper from the Research Archive or generate a new inquiry to open the Active Studio.
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('generator')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
                  >
                    Generate Proposal
                  </button>
                  {savedPapers.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('history')}
                      className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 rounded-xl transition-colors"
                    >
                      Open Archive
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Dedicated Research Archive & History Section */}
        {!isLoading && activeTab === 'history' && (
          <div className="animate-in fade-in duration-150">
            <ResearchHistorySection
              papers={savedPapers}
              onSelectPaper={handleSelectPaper}
              onDeletePaper={handleDeletePaper}
              onClearAll={handleClearAllDrafts}
              onNewProposal={handleNewResearch}
              currentPaperId={currentPaper?.id}
            />
          </div>
        )}

        {/* TAB 4: Academic Integrity Protocol View */}
        {!isLoading && activeTab === 'protocol' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Academic Citation Integrity &amp; Verification Protocol
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Scientific standards enforced by ResearchMate AI to prevent citation hallucinations.
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    1. Landmark Verified Literature
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Foundational papers (such as Shannon 1948, Vaswani et al. 2017, He et al. 2016, Watson &amp; Crick 1953, Stokes et al. 2020) are marked as <strong>Verified Landmark</strong>. True authors, verified publication years, authentic titles, and sources are checked against historical publication records.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    2. Domain Benchmarks Requiring Independent Verification
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    In emerging, highly specialized sub-disciplines, the assistant never fabricates fake DOIs or hallucinated author clusters. Instead, citations are transparently labeled as <strong>Proposed Benchmark (Requires Independent Verification)</strong> with 1-click lookup buttons to Google Scholar, CrossRef, and PubMed.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    3. Isolation of Prospective Hypotheses
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Under Section 07 (Expected Results), all anticipated metrics are explicitly formulated in prospective hypothesis syntax. The system incorporates a mandatory <strong>Research Distinction Protocol</strong> reminding researchers that empirical verification is pending physical laboratory or computational trial execution.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-2xs text-slate-400">Standard Peer-Review Integrity Framework</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('generator')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                >
                  Return to Generator
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">ResearchMate AI</span>
            <span aria-hidden="true">·</span>
            <span>Academic Paper Proposal Assistant</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>IEEE / Nature / ACM Scholarly Guidelines</span>
            <span aria-hidden="true">·</span>
            <span>Citation Integrity Verified</span>
          </div>
        </div>
      </footer>

      {/* Sliding History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        papers={savedPapers}
        onSelectPaper={handleSelectPaper}
        onDeletePaper={handleDeletePaper}
        onClearAll={handleClearAllDrafts}
        currentPaperId={currentPaper?.id}
      />
    </div>
  );
}
