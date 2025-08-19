import React from 'react';
import ExportSection from './ExportSection';

interface ExportTabProps {
  projectCount: number;
  onExport: () => Promise<void>;
}

const ExportTab: React.FC<ExportTabProps> = ({ projectCount, onExport }) => (
  <div className="max-w-xl mx-auto" id="export">
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
      <ExportSection projectCount={projectCount} onExport={onExport} />
    </div>
  </div>
);

export default ExportTab;
