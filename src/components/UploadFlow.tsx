import React, { useState } from 'react';
import { UploadedFile } from '../types';
import { INITIAL_MOCK_FILES } from '../data/mockData';
import { FileCheck, Sparkles, FileSpreadsheet, FileText, ArrowRight, Loader2 } from 'lucide-react';

interface UploadFlowProps {
  onStartAnalysis: () => void;
}

export const UploadFlow: React.FC<UploadFlowProps> = ({ onStartAnalysis }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  const mockFiles: UploadedFile[] = INITIAL_MOCK_FILES;

  const handleAnalyze = () => {
    setIsProcessing(true);
    setProgressStep(1);
    setTimeout(() => setProgressStep(2), 800);
    setTimeout(() => setProgressStep(3), 1600);
    setTimeout(() => {
      onStartAnalysis();
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-8 space-y-6">
        {/* Logo & Headline */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">iLumos Claim Chart Refinement</h1>
          <p className="text-xs text-slate-400">
            Evidence-grounded AI copilot for patent infringement analysis.
          </p>
        </div>

        {!isProcessing ? (
          <>
            {/* Upload File List Card */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Uploaded Ingestion Files
              </span>
              <div className="space-y-2">
                {mockFiles.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between p-3 bg-slate-900/80 border border-slate-700/80 rounded-lg text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      {f.type === 'claim_chart' ? (
                        <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <FileText className="w-5 h-5 text-indigo-400" />
                      )}
                      <div>
                        <div className="font-medium text-slate-200">{f.name}</div>
                        <div className="text-[11px] text-slate-500">{f.size} {f.pages ? `• ${f.pages} pages` : ''}</div>
                      </div>
                    </div>
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* System Instructions Summary */}
            <div className="p-3.5 bg-slate-900/50 rounded-lg border border-slate-700/50 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 block">System Instruction Guidelines:</span>
              <p>• Require strict source grounding for claim element mappings.</p>
              <p>• Explicitly distinguish direct evidence from inferred behavior.</p>
            </div>

            {/* Action Trigger */}
            <button
              onClick={handleAnalyze}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
            >
              <span>Initialize Workspace & Analyze Documents</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          /* Processing Progress Overlay */
          <div className="py-8 space-y-6 text-center">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
            <div className="space-y-2 text-xs">
              <div className={progressStep >= 1 ? 'text-indigo-300 font-medium' : 'text-slate-500'}>
                {progressStep >= 1 && '✓ '}Parsing claim chart elements...
              </div>
              <div className={progressStep >= 2 ? 'text-indigo-300 font-medium' : 'text-slate-500'}>
                {progressStep >= 2 && '✓ '}Indexing product and technical documentation...
              </div>
              <div className={progressStep >= 3 ? 'text-indigo-300 font-medium' : 'text-slate-500'}>
                {progressStep >= 3 && '✓ '}Building evidence matrix & initializing AI copilot...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
