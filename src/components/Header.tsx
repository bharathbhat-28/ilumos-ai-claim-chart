import React from 'react';
import { Shield, RotateCcw, FileDown, CheckCircle2, Sparkles } from 'lucide-react';

interface HeaderProps {
  canUndo: boolean;
  onUndo: () => void;
  onExport: () => void;
  isExporting: boolean;
  exportNotification: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  canUndo,
  onUndo,
  onExport,
  isExporting,
  exportNotification,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white px-6 py-3.5 flex items-center justify-between shadow-md">
      {/* Brand & Context */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">iLumos</span>
        </div>
        
        <div className="h-4 w-px bg-slate-700" />

        <div className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700/60">
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-medium text-slate-200">US123456</span>
          <span className="text-slate-500">vs.</span>
          <span className="font-medium text-slate-200">Acme Corp (Acme Thermostat)</span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center space-x-3">
        {exportNotification && (
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1.5 rounded-md animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{exportNotification}</span>
          </div>
        )}

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-md border transition-all ${
            canUndo
              ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white cursor-pointer'
              : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-60'
          }`}
          title="Undo previous claim chart modification"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Undo Refinement</span>
        </button>

        <button
          onClick={onExport}
          disabled={isExporting}
          className="flex items-center space-x-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-md shadow transition-colors cursor-pointer"
        >
          <FileDown className="w-4 h-4" />
          <span>{isExporting ? 'Exporting...' : 'Export to Word'}</span>
        </button>
      </div>
    </header>
  );
};
