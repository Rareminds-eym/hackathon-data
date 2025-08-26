import React from 'react';
import HL2ExportSection from './HL2ExportSection';

interface HL2ExportTabProps {
  projectCount: number;
  onExport: () => Promise<void>;
}

const HL2ExportTab: React.FC<HL2ExportTabProps> = ({ projectCount, onExport }) => (
  <div className="max-w-2xl mx-auto" id="hl2-export">
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-2xl">
      <HL2ExportSection projectCount={projectCount} onExport={onExport} />
    </div>
  </div>
);

export default HL2ExportTab;