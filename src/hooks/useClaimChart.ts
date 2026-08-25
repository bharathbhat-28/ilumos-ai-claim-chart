import { useState, useCallback } from 'react';
import {
  ClaimElement,
  ChatMessage,
  Evidence,
  AppStep,
} from '../types';
import {
  INITIAL_CLAIM_ELEMENTS,
  INITIAL_CHAT_MESSAGES,
  REFINEMENT_EVIDENCE_EL3,
} from '../data/mockData';

export function useClaimChart() {
  const [appStep, setAppStep] = useState<AppStep>('upload');
  const [claimElements, setClaimElements] = useState<ClaimElement[]>(INITIAL_CLAIM_ELEMENTS);
  const [selectedElementId, setSelectedElementId] = useState<string>('element-3');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  
  // Traceability & Undo history
  const [history, setHistory] = useState<ClaimElement[][]>([]);
  
  // Evidence viewer modal state
  const [activeEvidence, setActiveEvidence] = useState<Evidence | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  
  // Export feedback state
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  // Quick helper to fetch currently selected element
  const selectedElement = claimElements.find((el) => el.id === selectedElementId) || claimElements[0];

  const selectElement = useCallback((id: string) => {
    setSelectedElementId(id);
    const element = claimElements.find((e) => e.id === id);
    if (!element) return;

    // Add contextual message from AI when element switches
    const contextMsg: ChatMessage = {
      id: `ctx-${Date.now()}`,
      role: 'ai',
      content: `Selected Element ${element.elementNum}: "${element.claimText}".\n\nCurrent evidence strength: **${element.evidenceStrength.toUpperCase()}**. ${
        element.evidenceStrength === 'indirect'
          ? 'Notice: The underlying technical implementation is inferred from product behavior.'
          : 'Sufficient direct source documentation found.'
      }`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      elementId: element.id,
    };

    setChatMessages((prev) => [...prev, contextMsg]);
  }, [claimElements]);

  const openEvidence = useCallback((evidence: Evidence) => {
    setActiveEvidence(evidence);
    setIsViewerOpen(true);
  }, []);

  const closeEvidence = useCallback(() => {
    setIsViewerOpen(false);
  }, []);

  // Save previous state before modifying
  const pushToHistory = useCallback(() => {
    setHistory((prev) => [...prev, JSON.parse(JSON.stringify(claimElements))]);
  }, [claimElements]);

  // Undo implementation
  const undoLastChange = useCallback(() => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setClaimElements(previousState);
    setHistory((prev) => prev.slice(0, prev.length - 1));

    const undoMsg: ChatMessage = {
      id: `undo-${Date.now()}`,
      role: 'ai',
      content: 'Reverted previous change. Element 3 has been restored to its previous reasoning and evidence state.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, undoMsg]);
  }, [history]);

  // Handle Analyst Chat Prompts & AI Logic
  const sendAnalystMessage = useCallback((text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'analyst',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    const lower = text.toLowerCase();

    // A. FIX: Check edge cases FIRST before general refinement matchers

    // 1. EDGE CASE: Wrong evidence correction (High priority)
    if (lower.includes('pro model') || lower.includes('wrong') || lower.includes("don't use")) {
      setTimeout(() => {
        const wrongEvMsg: ChatMessage = {
          id: `ai-wrong-${Date.now()}`,
          role: 'ai',
          content:
            "You're right. I used evidence for the wrong product variant (Pro model).\n\nI've removed that source from the proposed refinement and will restrict analysis strictly to standard model documentation.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isWrongEvidenceCorrection: true,
        };
        setChatMessages((prev) => [...prev, wrongEvMsg]);
      }, 700);
      return;
    }

    // 2. EDGE CASE: No evidence / Explicit confirm trigger
    if (lower.includes('explicitly confirm') || lower.includes('confirm the ml') || lower.includes('find technical evidence')) {
      setTimeout(() => {
        const noEvMsg: ChatMessage = {
          id: `ai-noev-${Date.now()}`,
          role: 'ai',
          content:
            "I couldn't find sufficient evidence in the available documentation to explicitly confirm the underlying implementation as a machine-learning algorithm.\n\nTo keep the chart defensible, I will not infer this from product behavior alone.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isNoEvidenceState: true,
        };
        setChatMessages((prev) => [...prev, noEvMsg]);
      }, 700);
      return;
    }

    // 3. EDGE CASE: Undo requested in chat
    if (lower.includes('undo')) {
      undoLastChange();
      return;
    }

    // 4. HERO INTERACTION: Strengthen ML Algorithm Evidence
    if (lower.includes('weak') || lower.includes('technical details') || lower.includes('strengthen')) {
      setTimeout(() => {
        const aiProposal: ChatMessage = {
          id: `ai-prop-${Date.now()}`,
          role: 'ai',
          content: 'I analyzed **Acme Thermostat Technical Specifications — p. 14** and extracted technical details regarding the scheduling engine.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          elementId: 'element-3',
          isRefinementProposal: true,
          status: 'proposed',
          proposal: {
            proposedReasoning:
              "Acme's adaptive scheduling engine analyzes historical temperature selections and occupancy data to generate future schedules, demonstrating adaptive learning behavior. However, the available technical documentation does not explicitly disclose whether the implementation uses machine-learning algorithms.",
            evidence: [REFINEMENT_EVIDENCE_EL3],
            strength: 'indirect',
            gapExplanation:
              'Provides stronger proof of adaptive data-driven behavior, but algorithm details remain undisclosed.',
          },
        };
        setChatMessages((prev) => [...prev, aiProposal]);
      }, 700);
      return;
    }

    // Standard Fallback Chat Response
    setTimeout(() => {
      const genericResp: ChatMessage = {
        id: `ai-gen-${Date.now()}`,
        role: 'ai',
        content: `I've registered your instruction regarding "${selectedElement.claimText}". You can inspect evidence or request technical verification anytime.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, genericResp]);
    }, 600);
  }, [selectedElement, undoLastChange]);

  // Analyst Action: Accept Suggestion
  const acceptRefinement = useCallback((messageId: string) => {
    const targetMessage = chatMessages.find((m) => m.id === messageId);
    if (!targetMessage || !targetMessage.proposal) return;

    pushToHistory();

    const { proposedReasoning, evidence, strength } = targetMessage.proposal;

    setClaimElements((prev) =>
      prev.map((el) => {
        if (el.id === 'element-3') {
          return {
            ...el,
            reasoning: proposedReasoning,
            evidence: evidence,
            evidenceStrength: strength,
            isUpdated: true,
            version: el.version + 1,
          };
        }
        return el;
      })
    );

    setChatMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, status: 'accepted' as const } : m))
    );

    const confirmMsg: ChatMessage = {
      id: `confirm-${Date.now()}`,
      role: 'ai',
      content: '✓ Claim Chart updated for **Element 3**. Evidence strength remains **Indirect / Inferred** as requir
