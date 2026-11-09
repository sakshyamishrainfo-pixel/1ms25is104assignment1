import React from 'react';
import { ListFilter } from 'lucide-react';

interface NavItem {
  id: string;
  number: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'section-abstract', number: '01', label: 'Abstract' },
  { id: 'section-introduction', number: '02', label: 'Introduction' },
  { id: 'section-problem', number: '03', label: 'Problem Statement' },
  { id: 'section-objectives', number: '04', label: 'Objectives' },
  { id: 'section-lit-review', number: '05', label: 'Literature Review' },
  { id: 'section-methodology', number: '06', label: 'Methodology' },
  { id: 'section-results', number: '07', label: 'Expected Results' },
  { id: 'section-conclusion', number: '08', label: 'Conclusion' },
  { id: 'section-references', number: '09', label: 'References' },
];

export const PaperOutlineNav: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sticky top-20">
      <div className="flex items-center gap-2 pb-3 mb-2 border-b border-slate-100 text-xs font-bold text-slate-800 uppercase tracking-wider">
        <ListFilter className="w-3.5 h-3.5 text-blue-600" />
        <span>Document Outline</span>
      </div>

      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => scrollTo(item.id)}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/70 transition-colors flex items-center gap-2 group"
            >
              <span className="font-mono text-2xs text-slate-400 group-hover:text-blue-500 tabular-nums">
                {item.number}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
