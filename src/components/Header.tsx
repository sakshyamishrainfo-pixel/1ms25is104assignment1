import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  History,
  FileText,
  ShieldCheck,
  Plus,
  Menu,
  X,
  GraduationCap,
  ChevronRight,
  Download,
} from 'lucide-react';

export type ActiveTab = 'generator' | 'active-paper' | 'history' | 'protocol';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onNewResearch: () => void;
  savedCount: number;
  hasActivePaper: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onNewResearch,
  savedCount,
  hasActivePaper,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={() => handleTabClick(hasActivePaper ? 'active-paper' : 'generator')}
            className="text-lg font-bold tracking-tight text-slate-900 hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 text-left"
          >
            ResearchMate AI
          </button>
        </div>

        {/* Zone 2: Navigation Links / Segmented Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <button
            type="button"
            onClick={() => handleTabClick('generator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'generator'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Generator</span>
          </button>

          {hasActivePaper && (
            <button
              type="button"
              onClick={() => handleTabClick('active-paper')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'active-paper'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Active Studio</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleTabClick('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Research Archive</span>
            <span className="font-mono text-2xs text-slate-400 tabular-nums">({savedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('protocol')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'protocol'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Citation Integrity</span>
          </button>
        </nav>

        {/* Zone 3: Actions + Mobile Menu Button */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/api/project/download-zip"
            download="researchmate-ai-github.zip"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 active:bg-blue-100 rounded-xl transition-colors border border-slate-200/80 shadow-2xs whitespace-nowrap shrink-0"
            title="Download clean, GitHub-ready project ZIP archive"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>GitHub ZIP</span>
          </a>

          <button
            type="button"
            onClick={() => {
              onNewResearch();
              setActiveTab('generator');
              setMobileMenuOpen(false);
            }}
            className="px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Proposal</span>
            <span className="sm:hidden">New</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top duration-150">
          <button
            type="button"
            onClick={() => handleTabClick('generator')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
              activeTab === 'generator'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Proposal Generator</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {hasActivePaper && (
            <button
              type="button"
              onClick={() => handleTabClick('active-paper')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'active-paper'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Active Proposal Studio</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          )}

          <button
            type="button"
            onClick={() => handleTabClick('history')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              <span>Research Archive &amp; History ({savedCount})</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('protocol')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
              activeTab === 'protocol'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Citation Integrity Standards</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <a
            href="/api/project/download-zip"
            download="researchmate-ai-github.zip"
            className="w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors text-slate-700 hover:bg-slate-50"
          >
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4 text-slate-600" />
              <span>Download Project ZIP (GitHub Ready)</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>
      )}
    </header>
  );
};
