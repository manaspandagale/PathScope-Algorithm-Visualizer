import React, { useState } from 'react';
import type { AlgorithmType, StepSnapshot } from '../../types/graph';
import { ALGORITHMS_METADATA } from '../../data/algorithmsInfo';
import { PseudocodeViewer } from './PseudocodeViewer';
import { StepExplanation } from './StepExplanation';
import { DataStructureViewer } from './DataStructureViewer';
import { ResultSummary } from './ResultSummary';
import { BookOpen, Code2, Database } from 'lucide-react';

interface InfoPanelProps {
  algorithm: AlgorithmType;
  snapshot: StepSnapshot | null;
  currentStepIndex: number;
  totalSteps: number;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  algorithm,
  snapshot,
  currentStepIndex,
  totalSteps,
}) => {
  const metadata = ALGORITHMS_METADATA[algorithm];
  const [activeTab, setActiveTab] = useState<'pseudocode' | 'datastructure'>('pseudocode');

  return (
    <aside className="w-96 h-full border-l border-slate-800 bg-slate-950/80 backdrop-blur-md flex flex-col overflow-y-auto p-4 space-y-4">
      {/* Algorithm Header */}
      <div className="pb-3 border-b border-slate-800/80 space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold text-slate-100">{metadata.name}</h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {metadata.shortDescription}
        </p>

        {/* Complexity Badges */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-500 font-medium">Time Complexity</div>
            <div className="font-mono font-bold text-blue-300">
              {metadata.timeComplexity.worst}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-500 font-medium">Space Complexity</div>
            <div className="font-mono font-bold text-indigo-300">
              {metadata.spaceComplexity}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Step Explanation */}
      <StepExplanation
        snapshot={snapshot}
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
      />

      {/* Final Result Card (when complete or found) */}
      <ResultSummary snapshot={snapshot} algorithm={algorithm} />

      {/* Tabs for Pseudocode & Live Data Structure */}
      <div className="space-y-2">
        <div className="flex border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('pseudocode')}
            className={`flex items-center gap-1.5 px-3 py-2 font-medium border-b-2 cursor-pointer transition-colors ${
              activeTab === 'pseudocode'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Pseudocode</span>
          </button>
          <button
            onClick={() => setActiveTab('datastructure')}
            className={`flex items-center gap-1.5 px-3 py-2 font-medium border-b-2 cursor-pointer transition-colors ${
              activeTab === 'datastructure'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Data Structure</span>
          </button>
        </div>

        {activeTab === 'pseudocode' ? (
          <PseudocodeViewer
            metadata={metadata}
            activeLine={snapshot?.codeLine}
          />
        ) : (
          <DataStructureViewer snapshot={snapshot} />
        )}
      </div>
    </aside>
  );
};
