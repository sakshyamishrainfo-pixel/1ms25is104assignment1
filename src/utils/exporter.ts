import { ResearchPaper, ReferenceItem } from '../types/research';

export function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function calculateTotalWordCount(paper: ResearchPaper): number {
  let count = 0;
  count += countWords(paper.paperTitle);
  count += countWords(paper.abstract);
  count += countWords(paper.introduction);
  count += countWords(paper.problemStatement);
  paper.researchObjectives?.forEach((obj) => {
    count += countWords(obj);
  });
  count += countWords(paper.literatureReview);
  if (paper.researchMethodology) {
    count += countWords(paper.researchMethodology.approach);
    count += countWords(paper.researchMethodology.dataCollectionOrSetup);
    count += countWords(paper.researchMethodology.analyticalProcedure);
    count += countWords(paper.researchMethodology.evaluationMetrics);
    count += countWords(paper.researchMethodology.ethicalAndValidityConsiderations);
  }
  if (paper.expectedResults) {
    count += countWords(paper.expectedResults.hypothesizedOutcomes);
    count += countWords(paper.expectedResults.theoreticalSignificance);
    count += countWords(paper.expectedResults.prospectiveDistinction);
  }
  count += countWords(paper.conclusion);
  paper.references?.forEach((ref) => {
    count += countWords(`${ref.authors} ${ref.title} ${ref.source}`);
  });
  return count;
}

export interface SectionCount {
  name: string;
  words: number;
  percentage: number;
}

export function getSectionWordCountBreakdown(paper: ResearchPaper): {
  total: number;
  readingTimeMinutes: number;
  sections: SectionCount[];
} {
  const total = calculateTotalWordCount(paper) || 1;
  const abstractWords = countWords(paper.abstract);
  const introWords = countWords(paper.introduction);
  const problemWords = countWords(paper.problemStatement);
  let objectivesWords = 0;
  paper.researchObjectives?.forEach((o) => (objectivesWords += countWords(o)));
  const litReviewWords = countWords(paper.literatureReview);

  let methWords = 0;
  if (paper.researchMethodology) {
    methWords += countWords(paper.researchMethodology.approach);
    methWords += countWords(paper.researchMethodology.dataCollectionOrSetup);
    methWords += countWords(paper.researchMethodology.analyticalProcedure);
    methWords += countWords(paper.researchMethodology.evaluationMetrics);
    methWords += countWords(paper.researchMethodology.ethicalAndValidityConsiderations);
  }

  let expWords = 0;
  if (paper.expectedResults) {
    expWords += countWords(paper.expectedResults.hypothesizedOutcomes);
    expWords += countWords(paper.expectedResults.theoreticalSignificance);
    expWords += countWords(paper.expectedResults.prospectiveDistinction);
  }

  const conclusionWords = countWords(paper.conclusion);

  let refWords = 0;
  paper.references?.forEach((r) => (refWords += countWords(`${r.authors} ${r.title} ${r.source}`)));

  const sections: SectionCount[] = [
    { name: 'Abstract & Keywords', words: abstractWords, percentage: Math.round((abstractWords / total) * 100) },
    { name: 'Introduction', words: introWords, percentage: Math.round((introWords / total) * 100) },
    { name: 'Problem Statement', words: problemWords, percentage: Math.round((problemWords / total) * 100) },
    { name: 'Objectives', words: objectivesWords, percentage: Math.round((objectivesWords / total) * 100) },
    { name: 'Literature Review', words: litReviewWords, percentage: Math.round((litReviewWords / total) * 100) },
    { name: 'Methodology', words: methWords, percentage: Math.round((methWords / total) * 100) },
    { name: 'Expected Results', words: expWords, percentage: Math.round((expWords / total) * 100) },
    { name: 'Conclusion', words: conclusionWords, percentage: Math.round((conclusionWords / total) * 100) },
    { name: 'References', words: refWords, percentage: Math.round((refWords / total) * 100) },
  ];

  return {
    total,
    readingTimeMinutes: Math.max(1, Math.ceil(total / 220)),
    sections,
  };
}

export function formatCitation(ref: ReferenceItem, style: 'IEEE' | 'APA' | 'Nature' = 'IEEE'): string {
  if (style === 'IEEE') {
    const doiPart = ref.doiOrUrl ? ` DOI: ${ref.doiOrUrl}` : '';
    return `${ref.id} ${ref.authors}, "${ref.title}," ${ref.source}, ${ref.year}.${doiPart}`;
  } else if (style === 'APA') {
    const doiPart = ref.doiOrUrl ? ` https://doi.org/${ref.doiOrUrl}` : '';
    return `${ref.authors} (${ref.year}). ${ref.title}. ${ref.source}.${doiPart}`;
  } else {
    // Nature style
    return `${ref.authors}. ${ref.title}. ${ref.source} (${ref.year}).`;
  }
}

export function formatBibTeX(paper: ResearchPaper): string {
  const entries: string[] = [];
  paper.references?.forEach((ref, index) => {
    const citeKey = `${ref.authors.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '') || 'ref'}${ref.year || '2024'}_${index + 1}`;
    entries.push(`@article{${citeKey},
  author    = {${ref.authors}},
  title     = {${ref.title}},
  journal   = {${ref.source}},
  year      = {${ref.year}},
  note      = {${ref.verificationStatus === 'verified_landmark' ? 'Verified Landmark' : 'Proposed Benchmark - Requires Verification'}}
}`);
  });
  return entries.join('\n\n');
}

export function downloadBibTeX(paper: ResearchPaper): void {
  const content = formatBibTeX(paper);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const sanitizedTitle = paper.paperTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${sanitizedTitle || 'citations'}.bib`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function formatPaperAsPlainText(paper: ResearchPaper): string {
  const divider = '='.repeat(76);
  const subDivider = '-'.repeat(76);
  const dateFormatted = new Date(paper.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fieldLabel = paper.field === 'Other' && paper.customField ? paper.customField : paper.field;

  const lines: string[] = [];

  lines.push(divider);
  lines.push(`RESEARCH PROPOSAL: ${paper.paperTitle.toUpperCase()}`);
  lines.push(`Academic Field: ${fieldLabel}`);
  lines.push(`Original Research Topic: ${paper.topic}`);
  lines.push(`Generated On: ${dateFormatted}`);
  lines.push(`Assistant: ResearchMate AI (Academic Synthesis Engine)`);
  lines.push(divider);
  lines.push('');

  lines.push('ACADEMIC INTEGRITY & METHODOLOGICAL NOTICE:');
  lines.push(paper.academicRigorNotice || 'This document is an academic research proposal formulated for scholarly exploration. References include verified landmark publications and recommended literature benchmarks. All empirical findings described under Expected Results are prospective theoretical hypotheses pending physical/computational verification.');
  lines.push('');
  lines.push(subDivider);
  lines.push('');

  lines.push('ABSTRACT');
  lines.push(paper.abstract);
  lines.push('');
  if (paper.keywords && paper.keywords.length > 0) {
    lines.push(`Keywords: ${paper.keywords.join(', ')}`);
    lines.push('');
  }

  lines.push('1. INTRODUCTION & BACKGROUND');
  lines.push(paper.introduction);
  lines.push('');

  lines.push('2. PROBLEM STATEMENT & RESEARCH GAP');
  lines.push(paper.problemStatement);
  lines.push('');

  lines.push('3. RESEARCH OBJECTIVES');
  paper.researchObjectives?.forEach((obj, idx) => {
    lines.push(`   ${idx + 1}. ${obj}`);
  });
  lines.push('');

  lines.push('4. THEMATIC LITERATURE REVIEW');
  lines.push(paper.literatureReview);
  lines.push('');

  lines.push('5. RESEARCH METHODOLOGY & EXPERIMENTAL DESIGN');
  lines.push('5.1 Methodological Approach');
  lines.push(paper.researchMethodology?.approach || '');
  lines.push('');
  lines.push('5.2 Data Collection & Experimental Setup');
  lines.push(paper.researchMethodology?.dataCollectionOrSetup || '');
  lines.push('');
  lines.push('5.3 Analytical Pipeline & Algorithms');
  lines.push(paper.researchMethodology?.analyticalProcedure || '');
  lines.push('');
  lines.push('5.4 Evaluation Metrics & Validation Benchmarks');
  lines.push(paper.researchMethodology?.evaluationMetrics || '');
  lines.push('');
  lines.push('5.5 Internal/External Validity & Ethical Considerations');
  lines.push(paper.researchMethodology?.ethicalAndValidityConsiderations || '');
  lines.push('');

  lines.push('6. EXPECTED RESULTS (PROSPECTIVE HYPOTHESES)');
  lines.push('6.1 Hypothesized Outcomes:');
  lines.push(paper.expectedResults?.hypothesizedOutcomes || '');
  lines.push('');
  lines.push('6.2 Theoretical & Practical Significance:');
  lines.push(paper.expectedResults?.theoreticalSignificance || '');
  lines.push('');
  lines.push('6.3 Empirical Verification Disclaimer:');
  lines.push(paper.expectedResults?.prospectiveDistinction || 'NOTE: These results represent theoretical predictions and hypothesized bounds. Empirical substantiation is subject to experimental trials.');
  lines.push('');

  lines.push('7. CONCLUSION & FUTURE RESEARCH TRAJECTORIES');
  lines.push(paper.conclusion);
  lines.push('');

  lines.push('8. REFERENCES & CITATION AUDIT');
  paper.references?.forEach((ref) => {
    const statusLabel =
      ref.verificationStatus === 'verified_landmark'
        ? '[VERIFIED HISTORICAL LANDMARK]'
        : '[PROPOSED BENCHMARK - REQUIRES INDEPENDENT VERIFICATION]';
    lines.push(`${formatCitation(ref, 'IEEE')} ${statusLabel}`);
    if (ref.verificationNote) {
      lines.push(`   -> Note: ${ref.verificationNote}`);
    }
    lines.push('');
  });

  lines.push(divider);
  lines.push('END OF RESEARCH PROPOSAL');
  lines.push(divider);

  return lines.join('\n');
}

export function downloadPaperAsTxt(paper: ResearchPaper): void {
  const content = formatPaperAsPlainText(paper);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const sanitizedTitle = paper.paperTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 40)
    .replace(/^-|-$/g, '');

  const filename = `${sanitizedTitle || 'research-proposal'}-${new Date().toISOString().slice(0, 10)}.txt`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
}
