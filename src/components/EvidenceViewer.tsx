import React from 'react';
import { Evidence } from '../types';
import { X, FileText, ChevronLeft, Search } from 'lucide-react';

interface EvidenceViewerProps {
  evidence: Evidence | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({
  evidence,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !evidence) return null;

  // Split excerpt around the exact highlighted passage for inline rendering
  const hasHighlight = evidence.excerpt.includes(evidence.highlightText);
  const [beforeText, afterText] = hasHighlight
    ? evidence.excerpt.split(evidence.highlightText)
    : ['', ''];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Back to Claim Chart"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold">{evidence.documentName}</h3>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded border border-slate-700">
              Page {evidence.page}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Viewer Canvas */}
        <div className="flex-1 overflow-auto p-8 bg-slate-200/80 flex justify-center">
          {/* Simulated PDF / Paper Sheet */}
          <div className="bg-white w-full max-w-2xl min-h-[560px] p-12 shadow-xl border border-slate-300 rounded-sm font-serif text-slate-800 space-y-6 relative">
            
            {/* Page Header Bar */}
            <div className="border-b border-slate-200 pb-4 mb-6 flex justify-between items-baseline font-sans">
              <div>
                <h1 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                  {evidence.documentName}
                </h1>
                <span className="text-[11px] text-slate-500">
                  {evidence.sourceType || 'Technical Specification'} — Section 4.2
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Page {evidence.page}</span>
            </div>

            {/* Document Content Paragraph 1 */}
            <p className="text-sm leading-relaxed text-slate-600 font-sans">
              4.2.1 Operating Principles — The device continuously measures thermal dynamics within the ambient zone. Integrated sensor logs establish baseline environmental metrics over recurring 24-hour cycles.
            </p>

            {/* Document Content Paragraph 2 with INLINE HIGHLIGHT */}
            <div className="p-1 font-sans">
              <p className="text-sm leading-relaxed text-slate-800">
                4.2.2 Scheduling Engine —{' '}
                {hasHighlight ? (
                  <>
                    <span>{beforeText}</span>
                    <mark className="bg-amber-200 text-amber-950 font-medium px-1 py-0.5 rounded-xs border-b-2 border-amber-400 shadow-xs">
                      {evidence.highlightText}
                    </mark>
                    <span>{afterText}</span>
                  </>
                ) : (
                  <mark className="bg-amber-200 text-amber-950 font-medium px-1 py-0.5 rounded-xs border-b-2 border-amber-400 shadow-xs">
                    {evidence.excerpt}
                  </mark>
                )}
              </p>
            </div>

            {/* Document Content Paragraph 3 */}
            <p className="text-sm leading-relaxed text-slate-600 font-sans">
              4.2.3 Manual Overrides — Manual temperature adjustments performed via the physical dial or wireless application override pre-calculated setpoints until the next scheduled transition block.
            </p>

            {/* Page Footer Marker */}
            <div className="absolute bottom-6 left-12 right-12 pt-4 border-t border-slate-100 flex justify-between text-[10px] text-slate-400 font-sans">
              <span>Acme Corp Confidential Document</span>
              <span>Doc Ref: ACME-TS-2024-V3</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (Item 3A fix applied) */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <Search className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-medium text-slate-700">
              Source: {evidence.documentName} · Page {evidence.page}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium transition-colors cursor-pointer"
          >
            Return to Claim Chart
          </button>
        </div>
      </div>
    </div>
  );
};
