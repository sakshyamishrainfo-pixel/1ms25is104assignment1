# ResearchMate AI

> An AI-powered research paper assistant and thesis proposal synthesizer for university students, thesis candidates, and academic researchers.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Gemini_API-3.8_Flash-orange.svg)](https://ai.google.dev/)

---

## 📌 Overview

**ResearchMate AI** is designed to bridge the gap between preliminary academic hypotheses and publication-grade research proposals. It transforms any scientific inquiry into a complete, peer-reviewed 9-section proposal conforming to international academic publishing standards (IEEE, Nature, ACM, Lancet).

### 🛡️ Citation Integrity & Anti-Hallucination Protocol
Unlike generic AI tools, ResearchMate AI enforces strict scientific integrity:
- **Zero Fabricated Citations**: Never invents fake authors, DOIs, or titles.
- **Landmark Citation Verification**: Historical foundational publications (e.g. Vaswani et al. 2017, Shannon 1948) are categorized as **Verified Landmarks**.
- **Transparent Benchmarking**: Domain-specific citations that cannot be verified verbatim with 100% certainty are explicitly labeled as **Proposed Benchmarks (Requires Independent Verification)** with one-click direct lookup links to **Google Scholar** and **CrossRef**.
- **Prospective Findings Isolation**: Theoretical expectations under Section 07 (Expected Results) are explicitly distinguished from physical laboratory measurements.

---

## ✨ Features

- **Standard 9-Section Blueprint**:
  1. Formal Academic Title
  2. Abstract & Keywords
  3. Introduction & Background
  4. Problem Statement & Research Gap
  5. Measurable Research Objectives (3–5 operational goals)
  6. Thematic Literature Review
  7. Comprehensive Research Methodology & Experimental Architecture
  8. Expected Results & Theoretical Significance (Prospective Hypotheses)
  9. Conclusion & Future Trajectories
  10. References & Citation Integrity Audit
- **Interactive Academic Word Counter**: Live document word count, reading time calculator (~220 WPM), estimated academic journal pages, and section-by-section percentage distribution.
- **Multi-Style Typesetting**: Live citation formatting toggle between **IEEE**, **APA 7th Edition**, and **Nature** styles.
- **Academic Export Suite**:
  - One-click copy for individual sections or full paper text.
  - Download as structured, formatted `.txt` document.
  - Export citations as `.bib` (BibTeX) for direct import into LaTeX or Overleaf.
- **Research Archive & History Dashboard**: Client-side storage of proposals, aggregate metrics (total words synthesized, landmark citations verified, disciplines explored), search bar, and field filters.
- **Sticky Document Outline**: Smooth-scrolling table of contents with progress tracking.
- **Fast Failover AI Cascade**: Integrated with Google Gemini models (`gemini-3.8-flash` and `gemini-3.1-flash-lite`) using `@google/genai` for rapid synthesis under 10 seconds.

---

## 📂 Project Structure

```text
├── research-agent-config.json    # Agent configuration & output schemas
├── research-agent-prompt.txt     # System prompt specification & example
├── README.md                     # Documentation & setup instructions
├── package.json                  # Dependencies & full-stack scripts
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite frontend bundler config
├── server.ts                     # Express server & Gemini API proxy
├── index.html                    # Application HTML entry point
├── metadata.json                 # AI Studio metadata
├── .env.example                  # Environment template
└── src/
    ├── main.tsx                  # React application entry point
    ├── index.css                 # Global Tailwind styling & fonts
    ├── App.tsx                   # Main state & view coordinator
    ├── types/
    │   └── research.ts           # TypeScript interfaces & types
    ├── utils/
    │   └── exporter.ts           # Word counter, BibTeX, & TXT exporter
    └── components/
        ├── Header.tsx            # Navigation bar & mobile drawer
        ├── TopicForm.tsx         # Research topic input & presets
        ├── ResearchPaperView.tsx # 9-section paper view & format toggles
        ├── SectionCard.tsx       # Individual section cards with copy
        ├── ReferencesCard.tsx    # Audited citations with lookup links
        ├── ResearchHistorySection.tsx # Dedicated archive & stats dashboard
        ├── HistoryDrawer.tsx     # Quick slide-out drawer
        ├── WordCountModal.tsx    # Section word count distribution modal
        ├── LoadingIndicator.tsx  # Multi-phase radar synthesis animation
        ├── AccuracyBanner.tsx    # Academic integrity protocol banner
        ├── ErrorBanner.tsx       # Contextual error alerts & troubleshooting
        └── PaperOutlineNav.tsx   # Sticky table of contents outline
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 18.0.0`
- NPM or PNPM
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ResearchMate-AI.git
   cd ResearchMate-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

---

## 📄 License

Distributed under the Apache 2.0 License. See `LICENSE` for more information.
