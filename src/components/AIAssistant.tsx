import React, { useState } from 'react';
import { ClaimElement, ChatMessage, Evidence } from '../types';
import {
  Sparkles,
  Send,
  Eye,
  Check,
  X,
  AlertTriangle,
  Upload,
  Globe,
  CornerDownRight,
  Edit3,
  HelpCircle,
} from 'lucide-react';

interface AIAssistantProps {
  selectedElement: ClaimElement;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onAcceptRefinement: (messageId: string) => void;
  onEditRefinement: (messageId: string, customReasoning: string) => void;
  onRejectRefinement: (messageId: string) => void;
  onOpenEvidence: (evidence: Evidence) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  selectedElement,
  messages,
  onSendMessage,
  onAcceptRefinement,
  onEditRefinement,
  onRejectRefinement,
  onOpenEvidence,
}) => {
  const [inputText, setInputText] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');

  // Inline edit state for proposed reasoning
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleStartEdit = (messageId: string, initialReasoning: string) => {
    setEditingMessageId(messageId);
    setEditedText(initialReasoning);
  };

  const handleSaveEdit = (messageId: string) => {
    if (!editedText.trim()) return;
    onEditRefinement(messageId, editedText);
    setEditingMessageId(null);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedText('');
  };

  return (
    <aside className="w-[420px] bg-white border-l border-slate-200 flex flex-col h-full shadow-lg">
      {/* Header Context */}
      <div className="p-4 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold">AI Assistant</h3>
        </div>
        <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
          Element #{selectedElement.elementNum} Context
        </span>
      </div>

      {/* Selected Element Mini Summary */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs text-slate-700">
        <span className="font-semibold text-slate-900">Active Element: </span>
        <span className="italic">"{selectedElement.claimText}"</span>
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isAI = msg.role === 'ai';
          const isEditingThisMsg = editingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center space-x-1.5 mb-1 text-[11px] text-slate-400">
                <span>{isAI ? 'iLumos AI' : 'Analyst'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[92%] p-3.5 rounded-lg text-xs leading-relaxed ${
                  isAI
                    ? 'bg-slate-100 text-slate-800 border border-slate-200'
                    : 'bg-indigo-600 text-white font-medium'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Structured Proposal Card */}
                {msg.isRefinementProposal && msg.proposal && (
                  <div className="mt-3 p-3 bg-white rounded-md border border-indigo-200 space-y-3 text-slate-800 shadow-sm">
                    <div className="text-[11px] font-semibold text-indigo-900 uppercase tracking-wider">
                      Proposed Claim Chart Refinement
                    </div>

                    {/* Reasoning Display vs Inline Edit Form */}
                    {!isEditingThisMsg ? (
                      <div className="text-xs italic bg-slate-50 p-2.5 rounded border border-slate-200">
                        "{msg.proposal.proposedReasoning}"
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase">
                          Modify Proposed AI Reasoning:
                        </label>
                        <textarea
                          rows={4}
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                          className="w-full p-2 text-xs border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-sans text-slate-800"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={handleCancelEdit}
                            className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(msg.id)}
                            className="px-3 py-1 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium cursor-pointer"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    )}

                    {msg.proposal.gapExplanation && !isEditingThisMsg && (
                      <div className="flex items-start space-x-1.5 text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{msg.proposal.gapExplanation}</span>
                      </div>
                    )}

                    {/* Proposal Action Toolbar: View Evidence | Edit | Accept | Reject */}
                    {msg.status === 'proposed' && !isEditingThisMsg && (
                      <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-100">
                        {msg.proposal.evidence.length > 0 && (
                          <button
                            onClick={() => onOpenEvidence(msg.proposal!.evidence[0])}
                            className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-[11px] transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Evidence</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleStartEdit(msg.id, msg.proposal!.proposedReasoning)}
                          className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-[11px] transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => onAcceptRefinement(msg.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium text-[11px] transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>

                        <button
                          onClick={() => onRejectRefinement(msg.id)}
                          className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[11px] cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}

                    {msg.status === 'accepted' && (
                      <div className="pt-2 text-[11px] font-semibold text-emerald-700 flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Refinement Accepted & Chart Updated</span>
                      </div>
                    )}

                    {msg.status === 'edited' && (
                      <div className="pt-2 text-[11px] font-semibold text-indigo-700 flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Custom Edited Reasoning Saved & Updated</span>
                      </div>
                    )}
                  </div>
                )}

                {/* No Evidence State Actions */}
                {msg.isNoEvidenceState && (
                  <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-700 block">
                      Required Analyst Decision:
                    </span>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => onSendMessage("Uploading additional technical documentation...")}
                        className="flex items-center space-x-2 text-[11px] text-indigo-700 bg-white hover:bg-indigo-50 p-2 rounded border border-slate-200 font-medium text-left cursor-pointer transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Upload Technical Document</span>
                      </button>

                      <button
                        onClick={() => setShowUrlInput(true)}
                        className="flex items-center space-x-2 text-[11px] text-indigo-700 bg-white hover:bg-indigo-50 p-2 rounded border border-slate-200 font-medium text-left cursor-pointer transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Provide Product URL</span>
                      </button>

                      <button
                        onClick={() => onSendMessage("Mark Element 3 as insufficiently supported.")}
                        className="flex items-center space-x-2 text-[11px] text-rose-700 bg-white hover:bg-rose-50 p-2 rounded border border-rose-200 font-medium text-left cursor-pointer transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Mark as Insufficiently Supported</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Web Page URL Form Overlay */}
      {showUrlInput && (
        <div className="p-3 bg-indigo-50 border-t border-b border-indigo-200 text-xs">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-semibold text-indigo-900">Enter Product Web Page URL:</span>
            <button onClick={() => setShowUrlInput(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="https://acme.com/tech-specs/autoschedule"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              className="flex-1 px-2 py-1 bg-white border border-indigo-300 rounded text-xs focus:outline-none"
            />
            <button
              onClick={() => {
                if (urlValue) {
                  onSendMessage(`Submitted URL: ${urlValue}`);
                  setUrlValue('');
                  setShowUrlInput(false);
                }
              }}
              className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-medium cursor-pointer"
            >
              Analyze URL
            </button>
          </div>
        </div>
      )}

      {/* Prompt Suggestion Chips (ONLY "Strengthen evidence" shown) */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-1.5">
        <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
          Suggested Action
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() =>
              onSendMessage(
                'The AI reasoning for the ML algorithm element is weak. Add more technical details.'
              )
            }
            className="text-[11px] bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 hover:border-indigo-300 px-3 py-1.5 rounded-full transition-colors flex items-center space-x-1.5 font-medium cursor-pointer shadow-xs"
          >
            <CornerDownRight className="w-3.5 h-3.5 text-indigo-600" />
            <span>Strengthen evidence</span>
          </button>
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Ask iLumos to verify or refine..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
        />
        <button
          type="submit"
          className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </aside>
  );
};
