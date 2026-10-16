import React, { useState } from 'react';
import type { AlgorithmType, StepSnapshot } from '../../types/graph';
import { ALGORITHMS_METADATA } from '../../data/algorithmsInfo';
import { StepExplanation } from './StepExplanation';
import { PseudocodeViewer } from './PseudocodeViewer';
import { DataStructureViewer } from './DataStructureViewer';
import { ResultSummary } from './ResultSummary';
import { TabList } from '../UI/TabList';
import { BookOpen, Code, Layers, CheckCircle2 } from 'lucide-react';

interface InfoPanelProps {
  algorithm: AlgorithmType;
  snapshot: StepSnapshot | null;
  currentStepIndex: number;
  totalSteps: number;
}

type TabType = 'explanation' | 'pseudocode' | 'data' | 'result';

export const InfoPanel: React.FC<InfoPanelProps> = ({
  algorithm,
  snapshot,
  currentStepIndex,
  totalSteps,
}) => {
  const metadata = ALGORITHMS_METADATA[algorithm];
  const [activeTab, setActiveTab] = useState<TabType>('explanation');

  const subtitle = algorithm === 'dijkstra' ? 'Greedy weighted path' : 'Level-order unweighted search';

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'explanation', label: 'Explanation', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'pseudocode', label: 'Pseudocode', icon: <Code className="w-3.5 h-3.5" /> },
    { id: 'data', label: 'Data', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'result', label: 'Result', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <aside
      className="w-full h-full flex flex-col overflow-hidden"
      style={{
        backgroundColor: 'var(--surface)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Algorithm Header */}
      <div
        className="px-5 py-4 border-b flex items-center justify-between shrink-0"
        style={{ borderColor: 'var(--border)' }}
      >
        <div>
          <h2
            className="text-base font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {metadata.name}
          </h2>
          <p
            className="text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
            {subtitle}
          </p>
        </div>
        <span
          className="text-xs font-mono font-medium px-2 py-0.5 rounded border"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          {metadata.timeComplexity.worst}
        </span>
      </div>

      {/* Accessible TabList */}
      <TabList
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id)}
        ariaLabel="Inspector sections"
      />

      {/* Tab Content Panel */}
      <div className="flex-1 overflow-y-auto p-5" id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
        {activeTab === 'explanation' && (
          <StepExplanation
            snapshot={snapshot}
            currentStepIndex={currentStepIndex}
            totalSteps={totalSteps}
          />
        )}

        {activeTab === 'pseudocode' && (
          <PseudocodeViewer
            metadata={metadata}
            activeLine={snapshot?.codeLine}
          />
        )}

        {activeTab === 'data' && (
          <DataStructureViewer snapshot={snapshot} />
        )}

        {activeTab === 'result' && (
          <ResultSummary snapshot={snapshot} algorithm={algorithm} />
        )}
      </div>
    </aside>
  );
};

export default InfoPanel;
