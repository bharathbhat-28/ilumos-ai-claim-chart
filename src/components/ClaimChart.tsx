import React from 'react';
import { ClaimElement, Evidence } from '../types';
import { ExternalLink, Check, AlertCircle, HelpCircle } from 'lucide-react';

interface ClaimChartProps {
  elements: ClaimElement[];
  selectedElementId: string;
  onSelectElement: (id: string) => void;
  onOpenEvidence: (evidence: Evidence) => void;
}

export const ClaimChart: React.FC<ClaimChartProps> = ({
  elements,
  selectedElementId,
  onSelectElement,
  onOpenEvidence,
}) => {
  const getBadgeStyle = (strength: ClaimElement['evidenceStrength']) => {
    switch (strength) {
      case 'direct':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <Check className="w-3 h-3 mr-1" />,
          label: 'Direct',
        };
      case 'indirect':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <AlertCircle className="w-3 h-3 mr-1" />,
          label: 'Indirect / Inferred',
        };
      case 'insufficient':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <HelpCircle className="w-3 h-3 mr-1" />,
          label: 'Insufficient',
        };
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      {/* Table Header / Workspace Title */}
      <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Claim Analysis Matrix</h2>
          <p className="text-xs text-slate-500">Select an element row to review evidence or refine reasoning with AI assistance.</p>
        </div>
        <span className="text-xs font-mono text-slate-400">{elements.length} Claim Elements</span>
      </div>

      {/* 3-Column Table */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 w-1/3">Patent Claim Element</th>
                <th className="py-3 px-4 w-1/4">Accused Product Feature</th>
                <th className="py-3 px-4">AI Reasoning & Cited Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {elements.map((el) => {
                const isSelected = el.id === selectedElementId;
                const badge = getBadgeStyle(el.evidenceStrength);

                return (
                  <tr
                    key={el.id}
                    onClick={() => onSelectElement(el.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50/70 ring-2 ring-indigo-500 ring-inset'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Index */}
                    <td className="py-4 px-4 text-center font-semibold text-slate-500 align-top">
                      {el.elementNum}
                    </td>

                    {/* Patent Claim Element */}
                    <td className="py-4 px-4 align-top font-medium text-slate-900 leading-relaxed">
                      {el.claimText}
                    </td>

                    {/* Accused Feature */}
                    <td className="py-4 px-4 align-top">
                      <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-medium border border-slate-200">
                        {el.accusedFeature}
                      </span>
                    </td>

                    {/* Reasoning & Evidence */}
                    <td className="py-4 px-4 align-top space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[11px] font-medium ${badge.bg}`}>
                          {badge.icon}
                          {badge.label}
                        </span>

                        {el.isUpdated && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-semibold tracking-wide">
                            UPDATED
                          </span>
                        )}
                      </div>

                      <p className="text-slate-700 leading-relaxed">{el.reasoning}</p>

                      {/* Evidence Citations */}
                      {el.evidence.length > 0 && (
                        <div className="pt-1 flex flex-wrap gap-2">
                          {el.evidence.map((ev) => (
                            <button
                              key={ev.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenEvidence(ev);
                              }}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-900 border border-slate-200 hover:border-indigo-300 rounded text-[11px] transition-colors group cursor-pointer"
                            >
                              <span>{ev.documentName} — p. {ev.page}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
