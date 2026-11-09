import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lightbulb, Compass } from 'lucide-react';
import { ResearchField } from '../types/research';

interface TopicFormProps {
  onGenerate: (topic: string, field: ResearchField, customField?: string) => void;
  isLoading: boolean;
}

const RESEARCH_FIELDS: ResearchField[] = [
  'Computer Science',
  'Engineering',
  'Medicine',
  'Environment',
  'Business',
  'Other',
];

const PRESET_TOPICS: { field: ResearchField; label: string; topic: string }[] = [
  {
    field: 'Computer Science',
    label: 'AI & Vision',
    topic: 'Self-Supervised Contrastive Learning for Robust Medical Image Segmentation Under Extreme Class Imbalance',
  },
  {
    field: 'Medicine',
    label: 'Gene Therapy',
    topic: 'Targeted mRNA-Lipid Nanoparticle Formulations to Attenuate Myocardial Reperfusion Injury in Ischemic Models',
  },
  {
    field: 'Environment',
    label: 'Carbon Monitoring',
    topic: 'Multi-Sensor Satellite Remote Sensing and Deep Spatial Regression for Real-Time Wetland Methane Flux Estimation',
  },
  {
    field: 'Engineering',
    label: 'Energy Storage',
    topic: 'Mitigation of Dendritic Growth and Thermal Runaway in All-Solid-State Lithium Batteries via Polymeric Electrolyte Interlayers',
  },
  {
    field: 'Business',
    label: 'Digital Markets',
    topic: 'Algorithmic Pricing and Collusion Risks in Asymmetric Platform Economies: A Mechanism Design Framework',
  },
];

export const TopicForm: React.FC<TopicFormProps> = ({ onGenerate, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [field, setField] = useState<ResearchField>('Computer Science');
  const [customField, setCustomField] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      setValidationError('Please enter a research topic or hypothesis before generating.');
      return;
    }
    if (cleanTopic.length < 5) {
      setValidationError('Topic description is too brief. Provide at least a few keywords or research question.');
      return;
    }
    setValidationError(null);
    onGenerate(cleanTopic, field, field === 'Other' ? customField.trim() : undefined);
  };

  const handleApplyPreset = (presetTopic: string, presetField: ResearchField) => {
    setTopic(presetTopic);
    setField(presetField);
    setValidationError(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Formulate Your Research Proposal
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Specify your research topic and academic domain. ResearchMate AI will synthesize a complete, peer-review-structured paper outline with verified citations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Research Topic Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="topic-input" className="block text-sm font-semibold text-slate-800">
              Research Topic or Working Title <span className="text-blue-600">*</span>
            </label>
            <div className="flex items-center gap-2 text-2xs text-slate-400 font-mono tabular-nums">
              <span>{topic.trim().split(/\s+/).filter(Boolean).length} words</span>
              <span aria-hidden="true">·</span>
              <span>{topic.length} chars</span>
              {topic.length > 0 && !isLoading && (
                <button
                  type="button"
                  onClick={() => setTopic('')}
                  className="text-slate-400 hover:text-slate-600 ml-1 underline decoration-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="relative">
            <textarea
              id="topic-input"
              rows={3}
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="e.g., Evaluating quantum error mitigation techniques in NISQ-era superconducting quantum processors..."
              disabled={isLoading}
              className="w-full px-4 py-3 text-sm text-slate-900 bg-slate-50/50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-y min-h-[95px] placeholder:text-slate-400"
            />
          </div>
          {validationError && (
            <p className="mt-2 text-xs font-medium text-rose-600 flex items-center gap-1">
              <span>{validationError}</span>
            </p>
          )}
        </div>

        {/* Research Field Selection & Custom Field */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field-select" className="block text-sm font-semibold text-slate-800 mb-2">
              Academic Research Field <span className="text-blue-600">*</span>
            </label>
            <div className="relative">
              <select
                id="field-select"
                value={field}
                onChange={(e) => setField(e.target.value as ResearchField)}
                disabled={isLoading}
                className="w-full px-4 py-2.5 text-sm font-medium text-slate-900 bg-slate-50/50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer"
              >
                {RESEARCH_FIELDS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {field === 'Other' ? (
            <div>
              <label htmlFor="custom-field-input" className="block text-sm font-semibold text-slate-800 mb-2">
                Specify Domain / Sub-discipline
              </label>
              <input
                id="custom-field-input"
                type="text"
                value={customField}
                onChange={(e) => setCustomField(e.target.value)}
                placeholder="e.g., Cognitive Neuroscience, Materials Physics..."
                disabled={isLoading}
                className="w-full px-4 py-2.5 text-sm text-slate-900 bg-slate-50/50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          ) : (
            <div className="flex flex-col justify-end">
              <div className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Synthesis will tailor methodology &amp; benchmarks to standard {field} norms.</span>
              </div>
            </div>
          )}
        </div>

        {/* Preset Topic Inspiration Chips */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Sample Research Inquiries (Click to Load):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_TOPICS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset.topic, preset.field)}
                disabled={isLoading}
                className="text-left text-xs text-slate-700 bg-slate-100/70 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200/60 rounded-lg px-3 py-1.5 transition-all"
                title={preset.topic}
              >
                <span className="font-semibold text-blue-800 mr-1.5">{preset.field}:</span>
                <span className="text-slate-600 line-clamp-1">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-xs text-slate-500">
            <span>Generates 9 standard academic sections</span>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <span>Verified Citation Integrity</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Synthesizing Proposal...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Research</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
