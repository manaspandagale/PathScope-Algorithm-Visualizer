import React, { useState } from 'react';
import type { AlgorithmType, StepSnapshot } from '../../types/graph';
import { ALGORITHMS_METADATA } from '../../data/algorithmsInfo';
import { StepExplanation } from './StepExplanation';
import { PseudocodeViewer } from './PseudocodeViewer';
import { DataStructureViewer } from './DataStructureViewer';
import { ResultSummary } from './ResultSummary';
import { MessageSquareText, Code2, Database, Award } from 'lucide-react';

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

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'explanation', label: 'Explanation', icon: MessageSquareText },
    { id: 'pseudocode', label: 'Pseudocode', icon: Code2 },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'result', label: 'Result', icon: Award },
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
        className="p-5 border-b space-y-2 shrink-0"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between">
          <h2
            className="text-base font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {metadata.name}
          </h2>
          <span
            className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded border"
            style={{
              backgroundColor: 'var(--background-secondary)',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            {metadata.timeComplexity.worst}
          </span>
        </div>
        <p
          className="text-xs leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {metadata.shortDescription}
        </p>
      </div>

      {/* 4-Tab Segmented Navigation */}
      <div
        className="px-3 pt-2.5 pb-2 border-b grid grid-cols-4 gap-1 shrink-0"
        style={{
          backgroundColor: 'var(--background-secondary)',
          borderColor: 'var(--border)',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-md text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none min-h-[36px]"
              style={{
                backgroundColor: isActive ? 'var(--surface-elevated)' : 'transparent',
                border: isActive ? '1px solid var(--border-strong)' : '1px solid transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{tab.label}</span>
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
