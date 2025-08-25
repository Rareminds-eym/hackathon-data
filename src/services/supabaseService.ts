import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Since this dashboard connects to multiple projects, we need a way to create clients dynamically
// We'll use the MCP tools to fetch data directly from the connected Supabase instance
// For now, we'll create a service that interfaces with our existing MCP setup

export interface Level2TableData {
  tableName: string;
  data: any[];
  rowCount: number;
  lastUpdated: Date;
}

export interface TableMetadata {
  name: string;
  displayName: string;
  description: string;
  estimatedRows: number;
}

// Define the tables we want to export
export const LEVEL2_TABLES: TableMetadata[] = [
  {
    name: 'hl2_progress',
    displayName: 'HL2 Progress',
    description: 'Progress tracking for Hackathon Level 2',
    estimatedRows: 0
  },
  {
    name: 'level2_screen3_progress', 
    displayName: 'Level 2 Screen 3 Progress',
    description: 'Progress data for Level 2 Screen 3 activities',
    estimatedRows: 0
  },
  {
    name: 'selected_cases',
    displayName: 'Selected Cases',
    description: 'Cases selected by participants',
    estimatedRows: 0
  },
  {
    name: 'selected_solution',
    displayName: 'Selected Solutions', 
    description: 'Solutions selected by participants',
    estimatedRows: 0
  },
  {
    name: 'winners_list_l1',
    displayName: 'Winners List L1',
    description: 'Level 1 winners list',
    estimatedRows: 0
  }
];

// Import the direct MCP service with realistic data
import { directMcpService } from './directMcpService';

// Interface with the MCP tools to execute SQL queries directly
const callMCPTool = async (toolName: string, input: any): Promise<any> => {
  try {
    if (toolName === 'execute_sql' && input.query) {
      const data = await directMcpService.executeQuery(input.query);
      return { data };
    }
    throw new Error(`Unsupported MCP tool: ${toolName}`);
  } catch (error) {
    console.error('MCP tool call error:', error);
    throw error;
  }
};

export class Level2DataService {
  private static instance: Level2DataService;

  private constructor() {}

  public static getInstance(): Level2DataService {
    if (!Level2DataService.instance) {
      Level2DataService.instance = new Level2DataService();
    }
    return Level2DataService.instance;
  }

  /**
   * Fetch data from a specific table
   */
  async fetchTableData(tableName: string, preview: boolean = false): Promise<any[]> {
    try {
      // Use execute_sql MCP tool to get data
      const query = preview 
        ? `SELECT * FROM ${tableName} ORDER BY created_at DESC LIMIT 25`
        : `SELECT * FROM ${tableName} ORDER BY created_at DESC`;
        
      const result = await callMCPTool('execute_sql', {
        query
      });
      
      return result.data || [];
    } catch (error) {
      console.error(`Error fetching data from ${tableName}:`, error);
      throw new Error(`Failed to fetch data from ${tableName}: ${error.message}`);
    }
  }

  /**
   * Get table row count
   */
  async getTableRowCount(tableName: string): Promise<number> {
    try {
      const result = await callMCPTool('execute_sql', {
        query: `SELECT COUNT(*) as count FROM ${tableName}`
      });
      
      return result.data?.[0]?.count || 0;
    } catch (error) {
      console.error(`Error getting row count for ${tableName}:`, error);
      return 0;
    }
  }

  /**
   * Fetch all Level 2 table data
   */
  async fetchAllLevel2Data(): Promise<Level2TableData[]> {
    const results: Level2TableData[] = [];
    
    for (const table of LEVEL2_TABLES) {
      try {
        const [data, rowCount] = await Promise.all([
          this.fetchTableData(table.name),
          this.getTableRowCount(table.name)
        ]);
        
        results.push({
          tableName: table.name,
          data,
          rowCount,
          lastUpdated: new Date()
        });
      } catch (error) {
        console.error(`Error fetching ${table.name}:`, error);
        // Add empty result for failed table
        results.push({
          tableName: table.name,
          data: [],
          rowCount: 0,
          lastUpdated: new Date()
        });
      }
    }
    
    return results;
  }

  /**
   * Get table metadata with current row counts
   */
  async getTableMetadata(): Promise<TableMetadata[]> {
    const updatedMetadata: TableMetadata[] = [];
    
    for (const table of LEVEL2_TABLES) {
      try {
        const rowCount = await this.getTableRowCount(table.name);
        updatedMetadata.push({
          ...table,
          estimatedRows: rowCount
        });
      } catch (error) {
        console.error(`Error getting metadata for ${table.name}:`, error);
        updatedMetadata.push(table);
      }
    }
    
    return updatedMetadata;
  }

  /**
   * Check if tables exist and are accessible
   */
  async validateTables(): Promise<{ [tableName: string]: boolean }> {
    const results: { [tableName: string]: boolean } = {};
    
    for (const table of LEVEL2_TABLES) {
      try {
        await this.getTableRowCount(table.name);
        results[table.name] = true;
      } catch (error) {
        console.error(`Table ${table.name} not accessible:`, error);
        results[table.name] = false;
      }
    }
    
    return results;
  }
}

// Export singleton instance
export const level2DataService = Level2DataService.getInstance();
