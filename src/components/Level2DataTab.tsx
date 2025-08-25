import React, { useState, useEffect } from 'react';
import { Database, Download, RefreshCw, AlertTriangle, FileSpreadsheet, Table, FileJson, FileBarChart2, Search, Filter, DownloadCloud } from 'lucide-react';
import { level2DataService, TableMetadata, LEVEL2_TABLES } from '../services/supabaseService';
import { exportData, formatTableName, getRowCount, exportAllTablesData } from '../utils/exportUtils';

interface Level2DataTabProps {
  projectCount: number;
}

// Table export status states
type TableStatus = 'idle' | 'loading' | 'exporting' | 'success' | 'error';

interface TableState {
  status: TableStatus;
  message: string;
  data: any[];
  exportProgress: number;
}

// Data table component
const Level2DataTab: React.FC<Level2DataTabProps> = ({ projectCount }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [tablesMetadata, setTablesMetadata] = useState<TableMetadata[]>(LEVEL2_TABLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<string>('all');
  
  // Bulk export state
  const [bulkExportStatus, setBulkExportStatus] = useState<'idle' | 'loading' | 'exporting' | 'success' | 'error'>('idle');
  const [bulkExportMessage, setBulkExportMessage] = useState('');
  const [bulkExportProgress, setBulkExportProgress] = useState(0);
  
  // Table data states
  const [tableStates, setTableStates] = useState<Record<string, TableState>>(() => {
    const initialStates: Record<string, TableState> = {};
    LEVEL2_TABLES.forEach(table => {
      initialStates[table.name] = {
        status: 'idle',
        message: '',
        data: [],
        exportProgress: 0
      };
    });
    return initialStates;
  });

  // Load tables metadata
  useEffect(() => {
    if (projectCount === 0) {
      setError('No projects configured. Please add projects first.');
      return;
    }

    loadTablesMetadata();
  }, [projectCount]);

  // Load table metadata
  const loadTablesMetadata = async () => {
    if (loading) return;
    
    setLoading(true);
    setError('');
    
    try {
      const metadata = await level2DataService.getTableMetadata();
      setTablesMetadata(metadata);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load table metadata');
    } finally {
      setLoading(false);
    }
  };

  // Load data from a specific table
  const loadTableData = async (tableName: string) => {
    if (tableStates[tableName].status === 'loading') return;
    
    setTableStates(prev => ({
      ...prev,
      [tableName]: {
        ...prev[tableName],
        status: 'loading',
        message: 'Loading data...'
      }
    }));
    
    try {
      const data = await level2DataService.fetchTableData(tableName, true); // Use preview mode
      setTableStates(prev => ({
        ...prev,
        [tableName]: {
          ...prev[tableName],
          status: 'idle',
          message: '',
          data
        }
      }));
    } catch (err) {
      setTableStates(prev => ({
        ...prev,
        [tableName]: {
          ...prev[tableName],
          status: 'error',
          message: err instanceof Error ? err.message : 'Failed to load data'
        }
      }));
    }
  };

  // Export data from a table
  const handleExportTable = async (tableName: string, format: 'csv' | 'xlsx') => {
    const tableState = tableStates[tableName];
    if (tableState.status === 'exporting') return;
    
    // Load data if not already loaded
    if (tableState.data.length === 0) {
      setTableStates(prev => ({
        ...prev,
        [tableName]: {
          ...prev[tableName],
          status: 'loading',
          message: 'Loading data for export...'
        }
      }));
      
      try {
        const data = await level2DataService.fetchTableData(tableName, false); // Full data for export
        setTableStates(prev => ({
          ...prev,
          [tableName]: {
            ...prev[tableName],
            data
          }
        }));
      } catch (err) {
        setTableStates(prev => ({
          ...prev,
          [tableName]: {
            ...prev[tableName],
            status: 'error',
            message: err instanceof Error ? err.message : 'Failed to load data for export'
          }
        }));
        return;
      }
    }
    
    // Start export
    setTableStates(prev => ({
      ...prev,
      [tableName]: {
        ...prev[tableName],
        status: 'exporting',
        message: `Exporting ${format.toUpperCase()}...`,
        exportProgress: 0
      }
    }));
    
    try {
      await exportData(
        tableState.data, 
        { 
          filename: tableName, 
          format,
          chunkSize: 1000 // Process 1000 rows at a time
        },
        (progress) => {
          setTableStates(prev => ({
            ...prev,
            [tableName]: {
              ...prev[tableName],
              exportProgress: progress
            }
          }));
        }
      );
      
      setTableStates(prev => ({
        ...prev,
        [tableName]: {
          ...prev[tableName],
          status: 'success',
          message: `Export completed successfully!`,
          exportProgress: 100
        }
      }));
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setTableStates(prev => ({
          ...prev,
          [tableName]: {
            ...prev[tableName],
            status: 'idle',
            message: '',
            exportProgress: 0
          }
        }));
      }, 3000);
    } catch (err) {
      setTableStates(prev => ({
        ...prev,
        [tableName]: {
          ...prev[tableName],
          status: 'error',
          message: err instanceof Error ? err.message : 'Export failed',
          exportProgress: 0
        }
      }));
    }
  };

  // Handle bulk export of all tables
  const handleBulkExport = async (format: 'csv' | 'xlsx') => {
    if (bulkExportStatus === 'exporting') return;
    
    setBulkExportStatus('exporting');
    setBulkExportMessage(`Preparing to export all tables as ${format.toUpperCase()}...`);
    setBulkExportProgress(0);
    
    try {
      await exportAllTablesData(
        async () => {
          // Fetch full data from all tables
          const allTablesData: { name: string; data: any[] }[] = [];
          
          for (const table of LEVEL2_TABLES) {
            try {
              const data = await level2DataService.fetchTableData(table.name, false); // Full data for bulk export
              allTablesData.push({
                name: table.name,
                data
              });
            } catch (error) {
              console.error(`Failed to fetch ${table.name}:`, error);
              // Add empty table to maintain structure
              allTablesData.push({
                name: table.name,
                data: []
              });
            }
          }
          
          return allTablesData;
        },
        {
          format,
          zipFilename: 'level2_data_complete'
        },
        (progress, message) => {
          setBulkExportProgress(progress);
          setBulkExportMessage(message);
        }
      );
      
      setBulkExportStatus('success');
      setBulkExportMessage('All tables exported successfully!');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setBulkExportStatus('idle');
        setBulkExportMessage('');
        setBulkExportProgress(0);
      }, 3000);
    } catch (error) {
      setBulkExportStatus('error');
      setBulkExportMessage(error instanceof Error ? error.message : 'Bulk export failed');
      setBulkExportProgress(0);
    }
  };

  // Get filtered tables based on search and filter
  const getFilteredTables = () => {
    return tablesMetadata.filter(table => {
      // Handle "all" filter case
      if (selectedTable !== 'all' && table.name !== selectedTable) {
        return false;
      }
      
      // Search by name or description
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          table.name.toLowerCase().includes(search) ||
          table.displayName.toLowerCase().includes(search) ||
          table.description.toLowerCase().includes(search)
        );
      }
      
      return true;
    });
  };

  // Get table icon based on name
  const getTableIcon = (tableName: string) => {
    if (tableName.includes('progress')) {
      return <FileBarChart2 className="text-green-400" size={20} />;
    } else if (tableName.includes('case')) {
      return <FileJson className="text-blue-400" size={20} />;
    } else if (tableName.includes('winners')) {
      return <FileSpreadsheet className="text-purple-400" size={20} />;
    } else {
      return <Table className="text-orange-400" size={20} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
              <Database className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Level 2 Data</h2>
              <p className="text-gray-300">Export data from Level 2 tables</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadTablesMetadata}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            
            {/* Bulk Export Buttons */}
            <div className="flex items-center">
              <button
                onClick={() => handleBulkExport('csv')}
                disabled={bulkExportStatus === 'exporting' || projectCount === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-l-xl border-y border-l border-white/20 text-white font-medium transition-all disabled:opacity-50"
              >
                <DownloadCloud size={16} />
                All CSV
              </button>
              <button
                onClick={() => handleBulkExport('xlsx')}
                disabled={bulkExportStatus === 'exporting' || projectCount === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 rounded-r-xl border-y border-r border-white/20 text-white font-medium transition-all disabled:opacity-50"
              >
                <FileSpreadsheet size={16} />
                All Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={16} />
            <input
              type="text"
              placeholder="Search tables by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-white/15"
            />
          </div>

          {/* Table Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={16} />
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer transition-all hover:bg-white/15"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '20px'
              }}
            >
              <option value="all" className="bg-gray-800 text-white">All Tables</option>
              {tablesMetadata.map((table) => (
                <option key={table.name} value={table.name} className="bg-gray-800 text-white">
                  {table.displayName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Export Status */}
      {bulkExportStatus !== 'idle' && (
        <div className={`rounded-2xl p-6 border ${
          bulkExportStatus === 'error' 
            ? 'bg-red-500/20 border-red-500/30' 
            : bulkExportStatus === 'success'
              ? 'bg-green-500/20 border-green-500/30'
              : 'bg-blue-500/20 border-blue-500/30'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            {bulkExportStatus === 'exporting' && (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
            )}
            {bulkExportStatus === 'error' && (
              <AlertTriangle className="text-red-400" size={20} />
            )}
            {bulkExportStatus === 'success' && (
              <div className="p-1 bg-green-500/20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <div>
              <h3 className={`font-semibold ${
                bulkExportStatus === 'error' 
                  ? 'text-red-200' 
                  : bulkExportStatus === 'success'
                    ? 'text-green-200'
                    : 'text-blue-200'
              }`}>
                {bulkExportStatus === 'exporting' ? 'Exporting All Tables' : 
                 bulkExportStatus === 'success' ? 'Export Complete!' : 'Export Failed'}
              </h3>
              <p className={`text-sm ${
                bulkExportStatus === 'error' 
                  ? 'text-red-300' 
                  : bulkExportStatus === 'success'
                    ? 'text-green-300'
                    : 'text-blue-300'
              }`}>
                {bulkExportMessage}
              </p>
            </div>
          </div>
          
          {/* Bulk Export Progress Bar */}
          {bulkExportStatus === 'exporting' && bulkExportProgress > 0 && (
            <div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${bulkExportProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {Math.round(bulkExportProgress)}% complete
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-400" size={20} />
            <p className="text-red-100">{error}</p>
          </div>
        </div>
      )}

      {/* Tables List */}
      <div className="space-y-4">
        {getFilteredTables().map((table) => {
          const tableState = tableStates[table.name];
          return (
            <div key={table.name} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Table Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/10 rounded-xl">
                      {getTableIcon(table.name)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{table.displayName}</h3>
                      <p className="text-gray-300">{table.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">
                      {table.estimatedRows.toLocaleString()} rows
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Table Status & Actions */}
              <div className="p-6">
                {/* Status Messages */}
                {tableState.status !== 'idle' && (
                  <div className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${
                    tableState.status === 'error' 
                      ? 'bg-red-500/20 border border-red-500/30' 
                      : tableState.status === 'success'
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-blue-500/20 border border-blue-500/30'
                  }`}>
                    {tableState.status === 'loading' && (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                    )}
                    {tableState.status === 'error' && (
                      <AlertTriangle className="text-red-400" size={18} />
                    )}
                    {tableState.status === 'success' && (
                      <div className="p-1 bg-green-500/20 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <span className={`text-sm ${
                      tableState.status === 'error' 
                        ? 'text-red-200' 
                        : tableState.status === 'success'
                          ? 'text-green-200'
                          : 'text-blue-200'
                    }`}>
                      {tableState.message}
                    </span>
                  </div>
                )}
                
                {/* Export Progress Bar */}
                {tableState.status === 'exporting' && tableState.exportProgress > 0 && (
                  <div className="mb-4">
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${tableState.exportProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {Math.round(tableState.exportProgress)}% complete
                    </p>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Preview button */}
                  <button
                    onClick={() => loadTableData(table.name)}
                    disabled={tableState.status === 'loading' || tableState.status === 'exporting'}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all disabled:opacity-50"
                  >
                    <Table size={16} />
                    {tableState.data.length > 0 
                      ? `Preview (${getRowCount(tableState.data)} rows)`
                      : 'Load Preview'}
                  </button>
                  
                  {/* Export buttons */}
                  <div className="flex items-center">
                    <button
                      onClick={() => handleExportTable(table.name, 'csv')}
                      disabled={tableState.status === 'loading' || tableState.status === 'exporting'}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-l-xl border-y border-l border-white/20 text-white font-medium transition-all disabled:opacity-50"
                    >
                      <Download size={16} />
                      CSV
                    </button>
                    <button
                      onClick={() => handleExportTable(table.name, 'xlsx')}
                      disabled={tableState.status === 'loading' || tableState.status === 'exporting'}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-700 hover:to-purple-600 rounded-r-xl border-y border-r border-white/20 text-white font-medium transition-all disabled:opacity-50"
                    >
                      <FileSpreadsheet size={16} />
                      Excel
                    </button>
                  </div>
                </div>
                
                {/* Data Preview */}
                {tableState.data.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden border border-white/10 rounded-xl">
                        <table className="min-w-full divide-y divide-white/10">
                          <thead className="bg-white/5">
                            <tr>
                              {Object.keys(tableState.data[0]).map((key) => (
                                <th 
                                  key={key}
                                  scope="col" 
                                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                                >
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white/5 divide-y divide-white/10">
                            {tableState.data.slice(0, 5).map((row, rowIndex) => (
                              <tr key={rowIndex} className="hover:bg-white/10 transition-colors">
                                {Object.keys(row).map((key) => {
                                  let cellValue = row[key];
                                  
                                  // Format cell value for display
                                  if (cellValue === null || cellValue === undefined) {
                                    cellValue = '';
                                  } else if (typeof cellValue === 'object') {
                                    cellValue = JSON.stringify(cellValue);
                                  }
                                  
                                  return (
                                    <td 
                                      key={key} 
                                      className="px-4 py-2 whitespace-nowrap text-sm text-gray-200 font-mono"
                                    >
                                      <div className="max-w-xs truncate">
                                        {String(cellValue)}
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        {/* Show more rows indicator */}
                        {tableState.data.length > 5 && (
                          <div className="py-2 px-4 bg-white/5 border-t border-white/10 text-center text-xs text-gray-400">
                            {tableState.data.length - 5} more rows not shown in preview
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Empty State */}
        {getFilteredTables().length === 0 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center shadow-2xl">
            <Database className="text-gray-400 mx-auto mb-4" size={48} />
            <h3 className="text-white font-semibold mb-2">No Tables Found</h3>
            <p className="text-gray-300">
              {searchTerm || selectedTable !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No Level 2 tables are available in the current project.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Level2DataTab;
