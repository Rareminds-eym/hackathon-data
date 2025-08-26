import React, { useState } from 'react';
import { Download, FileText, AlertTriangle, CheckCircle, Zap, Package } from 'lucide-react';

interface HL2ExportSectionProps {
  projectCount: number;
  onExport: () => Promise<void>;
}

export default function HL2ExportSection({ projectCount, onExport }: HL2ExportSectionProps) {
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
      setExportMessage('HL2 tables exported successfully! Download will start automatically.');
    } catch (error) {
      setExportStatus('error');
      setExportMessage(error instanceof Error ? error.message : 'HL2 export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const requiredTables = ['hl2_progress', 'selected_cases', 'selected_solution', 'level2_screen3_progress'];

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-2xl md:rounded-3xl blur-xl"></div>
      
      <div className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 md:mb-8">
          <div className="p-2 md:p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl md:rounded-2xl shadow-lg">
            <FileText className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">Export HL2 Tables</h2>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Download HL2 data as CSV files</p>
          </div>
        </div>

        {/* Tables to Export */}
        <div className="mb-4 md:mb-8">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Package className="text-gray-600 dark:text-gray-300" size={16} />
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm md:text-base">HL2 Tables to Export:</h3>
          </div>
          <div className="grid grid-cols-1 gap-2 md:gap-3">
            {requiredTables.map((table, index) => (
              <div key={table} className="group flex items-center gap-3 p-3 md:p-4 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 border border-white/20 rounded-lg md:rounded-xl backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg">
                <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-md">
                  <span className="text-white font-bold text-xs md:text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <span className="text-xs md:text-sm font-mono text-gray-800 dark:text-gray-100 font-semibold">{table}</span>
                </div>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-green-400 to-teal-500 rounded-full animate-pulse group-hover:animate-bounce"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Messages */}
        {projectCount === 0 ? (
          <div className="flex items-start gap-3 p-4 md:p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl md:rounded-2xl mb-4 md:mb-6 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="text-yellow-500 flex-shrink-0" size={20} />
            </div>
            <div>
              <p className="text-yellow-700 dark:text-yellow-300 font-semibold mb-1 text-sm md:text-base">No Projects Added</p>
              <p className="text-yellow-600 dark:text-yellow-400 text-xs md:text-sm">Add at least one project to enable HL2 export functionality.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-4 md:p-6 bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-xl md:rounded-2xl mb-4 md:mb-6 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
            </div>
            <div>
              <p className="text-green-700 dark:text-green-300 font-semibold mb-1 text-sm md:text-base">Ready to Export HL2 Data</p>
              <p className="text-green-600 dark:text-green-400 text-xs md:text-sm">
                Export HL2 data from {projectCount} project{projectCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Export Status */}
        {exportStatus !== 'idle' && (
          <div
            className={`flex items-start gap-3 p-4 md:p-6 rounded-xl md:rounded-2xl mb-4 md:mb-6 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300 ${
              exportStatus === 'success'
                ? 'bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20'
                : 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20'
            }`}
          >
            <div className={`p-2 rounded-lg ${
              exportStatus === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {exportStatus === 'success' ? (
                <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
              ) : (
                <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
              )}
            </div>
            <div>
              <p className={`font-semibold mb-1 text-sm md:text-base ${
                exportStatus === 'success' 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {exportStatus === 'success' ? 'HL2 Export Complete!' : 'HL2 Export Failed'}
              </p>
              <p className={`text-xs md:text-sm ${
                exportStatus === 'success' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
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
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 md:py-4 px-4 md:px-6 rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 md:gap-3 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          
          <div className="relative z-10 flex items-center gap-2 md:gap-3">
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-2 border-white/30 border-t-white" />
                <span className="text-sm md:text-lg">Exporting HL2 Tables...</span>
              </>
            ) : (
              <>
                <div className="p-1 bg-white/20 rounded-lg">
                  <Download size={16} className="transition-transform duration-200 group-hover:scale-110" />
                </div>
                <span className="text-sm md:text-lg">Export HL2 Tables as ZIP</span>
              </>
            )}
          </div>
        </button>

        {/* Footer Description */}
        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gradient-to-r from-gray-500/10 to-slate-500/10 border border-gray-500/20 rounded-lg md:rounded-xl backdrop-blur-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="text-gray-500 dark:text-gray-400" size={14} />
            <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">HL2 Export Information</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            This will download a ZIP file containing HL2 CSV exports from all connected projects.
            Files are automatically organized by project name.
          </p>
        </div>
      </div> 
    </div>
  );
}