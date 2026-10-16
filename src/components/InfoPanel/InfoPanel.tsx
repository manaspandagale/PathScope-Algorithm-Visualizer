import React, { useState } from 'react';
import type { AlgorithmType, StepSnapshot } from '../../types/graph';
import { ALGORITHMS_METADATA } from '../../data/algorithmsInfo';
import { StepExplanation } from './StepExplanation';
import { PseudocodeViewer } from './PseudocodeViewer';
import { DataStructureViewer } from './DataStructureViewer';
import { ResultSummary } from './ResultSummary';

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

  const subtitle = algorithm === 'dijkstra' ? 'Weighted shortest path' : 'Unweighted shortest path';

  const tabs: { id: TabType; label: string }[] = [
    { id: 'explanation', label: 'Explanation' },
    { id: 'pseudocode', label: 'Pseudocode' },
    { id: 'data', label: 'Data' },
    { id: 'result', label: 'Result' },
  ];

  return (
    <aside
      className="w-full h-full flex flex-col overflow-hidden"
      style={{
        backgroundColor: 'var(--surface)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Simplified Algorithm Header */}
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

      {/* 4 Clean, Readable Tabs with Simple Underline */}
      <div
        className="px-4 border-b flex items-center gap-1 shrink-0"
        style={{
          backgroundColor: 'var(--background-secondary)',
          borderColor: 'var(--border)',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2.5 text-center text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none border-b-2"
              style={{
                borderColor: isActive ? 'var(--primary-action)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="flex-1 overflow-y-auto p-5">
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
