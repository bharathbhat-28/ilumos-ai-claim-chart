import { useClaimChart } from './hooks/useClaimChart';
import { Header } from './components/Header';
import { ClaimChart } from './components/ClaimChart';
import { AIAssistant } from './components/AIAssistant';
import { EvidenceViewer } from './components/EvidenceViewer';
import { UploadFlow } from './components/UploadFlow';

export function App() {
  const {
    appStep,
    setAppStep,
    claimElements,
    selectedElementId,
    selectedElement,
    selectElement,
    chatMessages,
    sendAnalystMessage,
    acceptRefinement,
    editRefinement,
    rejectRefinement,
    activeEvidence,
    isViewerOpen,
    openEvidence,
    closeEvidence,
    undoLastChange,
    canUndo,
    isExporting,
    exportNotification,
    exportToWord,
  } = useClaimChart();

  if (appStep === 'upload') {
    return <UploadFlow onStartAnalysis={() => setAppStep('workspace')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header Controls */}
      <Header
        canUndo={canUndo}
        onUndo={undoLastChange}
        onExport={exportToWord}
        isExporting={isExporting}
        exportNotification={exportNotification}
      />

      {/* Main Workspace Layout: Claim Chart + AI Assistant */}
      <main className="flex-1 flex overflow-hidden">
        <ClaimChart
          elements={claimElements}
          selectedElementId={selectedElementId}
          onSelectElement={selectElement}
          onOpenEvidence={openEvidence}
        />

        <AIAssistant
          selectedElement={selectedElement}
          messages={chatMessages}
          onSendMessage={sendAnalystMessage}
          onAcceptRefinement={acceptRefinement}
          onEditRefinement={editRefinement}
          onRejectRefinement={rejectRefinement}
          onOpenEvidence={openEvidence}
        />
      </main>

      {/* Document Evidence Viewer Modal */}
      <EvidenceViewer
        evidence={activeEvidence}
        isOpen={isViewerOpen}
        onClose={closeEvidence}
      />
    </div>
  );
}

export default App;
