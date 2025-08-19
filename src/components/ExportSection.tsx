import React, { useState } from 'react';
import { Download, FileText, AlertTriangle, CheckCircle, Package, Zap } from 'lucide-react';

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
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl shadow-lg shadow-orange-500/25">
          <FileText className="text-white" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Export Tables</h2>
          <p className="text-slate-600">Download your data as CSV files</p>
        </div>
      </div>

      {/* Tables to Export */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Package className="text-slate-600" size={18} />
          <h3 className="font-semibold text-slate-700">Tables to Export:</h3>
        </div>
        <div className="space-y-3">
          {requiredTables.map((table, index) => (
            <div key={table} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200 hover:bg-slate-100">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
              <div className="flex-1">
                <span className="text-sm font-mono text-slate-800 font-semibold bg-white px-3 py-1 rounded border border-slate-200">{table}</span>
              </div>
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Messages */}
      {projectCount === 0 ? (
        <div className="flex items-start gap-4 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl mb-6 animate-in slide-in-from-top-2 duration-300">
          <div className="p-3 bg-yellow-100 rounded-xl">
            <AlertTriangle className="text-yellow-600 flex-shrink-0" size={24} />
          </div>
          <div>
            <p className="text-yellow-800 font-semibold text-lg mb-1">No Projects Added</p>
            <p className="text-yellow-700">Add at least one project to enable export functionality.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4 p-6 bg-green-50 border border-green-200 rounded-2xl mb-6 animate-in slide-in-from-top-2 duration-300">
          <div className="p-3 bg-green-100 rounded-xl">
            <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
          </div>
          <div>
            <p className="text-green-800 font-semibold text-lg mb-1">Ready to Export</p>
            <p className="text-green-700">
              Export data from {projectCount} project{projectCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Export Status */}
      {exportStatus !== 'idle' && (
        <div
          className={`flex items-start gap-4 p-6 rounded-2xl mb-6 animate-in slide-in-from-top-2 duration-300 ${
            exportStatus === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className={`p-3 rounded-xl ${
            exportStatus === 'success' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {exportStatus === 'success' ? (
              <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
            ) : (
              <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
            )}
          </div>
          <div>
            <p className={`font-semibold text-lg mb-1 ${
              exportStatus === 'success' 
                ? 'text-green-800' 
                : 'text-red-800'
            }`}>
              {exportStatus === 'success' ? 'Export Complete!' : 'Export Failed'}
            </p>
            <p className={`${
              exportStatus === 'success' 
                ? 'text-green-700' 
                : 'text-red-700'
            }`}>
              {exportMessage}
            </p>
          </div>
        </div>
      )}

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={projectCount === 0 || isExporting}
        className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transform hover:-translate-y-0.5 disabled:hover:translate-y-0 transition-all duration-200 flex items-center justify-center gap-3"
      >
        {isExporting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
            <span className="text-lg">Exporting Tables...</span>
          </>
        ) : (
          <>
            <Download size={20} />
            <span className="text-lg">Export All Tables as ZIP</span>
          </>
        )}
      </button>

      {/* Footer Description */}
      <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="text-slate-600" size={16} />
          <span className="text-sm font-semibold text-slate-700">Export Information</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          This will download a ZIP file containing CSV exports from all connected projects.
          <br />
          Files are automatically organized by project name.
        </p>
      </div>
    </div>
  );
}