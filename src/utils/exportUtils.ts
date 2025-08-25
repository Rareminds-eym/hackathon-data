import * as XLSX from 'xlsx';
import JSZip from 'jszip';

export interface ExportOptions {
  filename: string;
  format: 'csv' | 'xlsx';
  chunkSize?: number;
}

export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const convertToCSV = (data: any[]): string => {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Handle null/undefined values
      if (value === null || value === undefined) return '';
      
      // Convert objects/arrays to JSON strings
      if (typeof value === 'object') {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    }).join(',');
  });

  return [csvHeaders, ...csvRows].join('\n');
};

export const convertToExcel = (data: any[], sheetName: string = 'Sheet1'): ArrayBuffer => {
  if (!data || data.length === 0) {
    // Create empty workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([['No data']]);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
};

export const exportData = async (
  data: any[],
  options: ExportOptions,
  onProgress?: (progress: number) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const { filename, format } = options;
      
      if (format === 'csv') {
        // For large datasets, process in chunks to avoid UI freezing
        const chunkSize = options.chunkSize || 1000;
        let csvContent = '';
        
        if (data.length === 0) {
          csvContent = 'No data available';
        } else {
          const headers = Object.keys(data[0]);
          csvContent = headers.join(',') + '\n';
          
          const processChunk = (startIndex: number) => {
            const endIndex = Math.min(startIndex + chunkSize, data.length);
            const chunk = data.slice(startIndex, endIndex);
            
            const chunkCsv = chunk.map(row => {
              return headers.map(header => {
                const value = row[header];
                if (value === null || value === undefined) return '';
                
                if (typeof value === 'object') {
                  return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                }
                
                const stringValue = String(value);
                if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                  return `"${stringValue.replace(/"/g, '""')}"`;
                }
                
                return stringValue;
              }).join(',');
            }).join('\n');
            
            csvContent += chunkCsv;
            
            if (onProgress) {
              onProgress((endIndex / data.length) * 100);
            }
            
            if (endIndex < data.length) {
              csvContent += '\n';
              // Use setTimeout to prevent UI freezing
              setTimeout(() => processChunk(endIndex), 0);
            } else {
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              downloadFile(blob, `${filename}.csv`);
              resolve();
            }
          };
          
          processChunk(0);
        }
      } else if (format === 'xlsx') {
        // Process Excel export
        if (onProgress) onProgress(50);
        
        const buffer = convertToExcel(data, filename);
        
        if (onProgress) onProgress(100);
        
        const blob = new Blob([buffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        downloadFile(blob, `${filename}.xlsx`);
        resolve();
      } else {
        reject(new Error('Unsupported format'));
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const formatTableName = (tableName: string): string => {
  return tableName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getRowCount = (data: any[]): string => {
  const count = data?.length || 0;
  return count.toLocaleString();
};

// Export multiple tables as a ZIP file
export const exportMultipleTables = async (
  tablesData: { name: string; data: any[] }[],
  options: { format: 'csv' | 'xlsx'; zipFilename?: string },
  onProgress?: (progress: number, currentTable: string) => void
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const zip = new JSZip();
      const { format, zipFilename = 'level2_data_export' } = options;
      
      let completedTables = 0;
      const totalTables = tablesData.length;
      
      for (const tableData of tablesData) {
        if (onProgress) {
          onProgress((completedTables / totalTables) * 100, `Processing ${tableData.name}...`);
        }
        
        if (format === 'csv') {
          const csvContent = convertToCSV(tableData.data);
          zip.file(`${tableData.name}.csv`, csvContent);
        } else if (format === 'xlsx') {
          const buffer = convertToExcel(tableData.data, tableData.name);
          zip.file(`${tableData.name}.xlsx`, buffer);
        }
        
        completedTables++;
      }
      
      if (onProgress) {
        onProgress(95, 'Creating ZIP file...');
      }
      
      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      if (onProgress) {
        onProgress(100, 'Download starting...');
      }
      
      // Download the ZIP file
      const fileExtension = format === 'xlsx' ? 'xlsx' : 'csv';
      downloadFile(zipBlob, `${zipFilename}_${fileExtension}.zip`);
      
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

// Export all tables with full data (for bulk export)
export const exportAllTablesData = async (
  fetchAllDataFn: () => Promise<{ name: string; data: any[] }[]>,
  options: { format: 'csv' | 'xlsx'; zipFilename?: string },
  onProgress?: (progress: number, message: string) => void
): Promise<void> => {
  try {
    if (onProgress) {
      onProgress(10, 'Fetching data from all tables...');
    }
    
    const allTablesData = await fetchAllDataFn();
    
    if (onProgress) {
      onProgress(20, 'Starting export process...');
    }
    
    await exportMultipleTables(
      allTablesData,
      options,
      (progress, message) => {
        if (onProgress) {
          // Map 20-100% range for the export process
          const adjustedProgress = 20 + (progress * 0.8);
          onProgress(adjustedProgress, message);
        }
      }
    );
  } catch (error) {
    throw new Error(`Failed to export all tables: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
