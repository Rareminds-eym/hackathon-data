import React, { useState } from 'react';
import { Download, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

interface ExportSectionProps {
  projectCount: number;
  onExport: () => Promise<void>;
}

export default function ExportSection({ projectCount, onExport }: ExportSectionProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [exportMessage, setExportMessage] = useState('');

  const handleExport = async () => {
    if (projectCount === 0) return;
    
    setIsExporting(true);
    setExportStatus('idle');
    
    try {
      await onExport();
      setExportStatus('success');
      setExportMessage('Tables exported successfully! Download will start automatically.');
    } catch (error) {
      setExportStatus('error');
      setExportMessage(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const requiredTables = ['individual_attempts', 'attempt_details', 'teams'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="text-orange-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Export Tables</h2>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-3">Tables to Export:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {requiredTables.map((table) => (
            <div key={table} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-mono text-gray-700">{table}</span>
            </div>
          ))}
        </div>
      </div>

      {projectCount === 0 ? (
        <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
          <span className="text-yellow-800">Add at least one project to enable export functionality.</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
          <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
          <span className="text-green-800">
            Ready to export from {projectCount} project{projectCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {exportStatus !== 'idle' && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg mb-4 ${
            exportStatus === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {exportStatus === 'success' ? (
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
          ) : (
            <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
          )}
          <span className={exportStatus === 'success' ? 'text-green-800' : 'text-red-800'}>
            {exportMessage}
          </span>
        </div>
      )}

      <button
        onClick={handleExport}
        disabled={projectCount === 0 || isExporting}
        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isExporting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            Exporting Tables...
          </>
        ) : (
          <>
            <Download size={20} />
            Export All Tables as ZIP
          </>
        )}
      </button>

      <p className="mt-3 text-sm text-gray-600 text-center">
        This will download a ZIP file containing CSV exports from all connected projects.
      </p>
    </div>
  );
}