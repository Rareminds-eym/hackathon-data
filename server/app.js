const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for projects (in production, use a database)
let projects = [
  {
    id: 'default-gmp',
    name: 'GMP',
    host: 'aws-0-ap-south-1.pooler.supabase.com',
    database: 'postgres',
    username: 'postgres.cjwlorubdahdvvaxgnzx',
    password: '2ItrKs36snxHBjeE',
    port: 6543,
    createdAt: new Date().toISOString(),
    pool_mode: 'transaction'
  },
  {
    id: 'default-fsqm',
    name: 'FSQM',
    host: 'aws-0-ap-south-1.pooler.supabase.com',
    database: 'postgres',
    username: 'postgres.heatlbebbupsaqqwwkrq',
    password: 'soyy3sOaV6XbYKwc',
    port: 6543,
    createdAt: new Date().toISOString(),
    pool_mode: 'transaction'
  },
  {
    id: 'default-mc',
    name: 'MC',
    host: 'aws-0-ap-south-1.pooler.supabase.com',
    database: 'postgres',
    username: 'postgres.ilwwcxmvprihqcjvlpez',
    password: 'TyMP4aUevlyguq5q',
    port: 6543,
    createdAt: new Date().toISOString(),
    pool_mode: 'transaction'
  }
];

// Required tables to export
const REQUIRED_TABLES = ['individual_attempts', 'attempt_details', 'teams'];

// Utility function to extract team_code from email
function extractTeamCodeFromEmail(email) {
  if (!email) return '';
  
  // Extract the part before @ symbol
  const beforeAt = email.split('@')[0];
  
  // Look for common patterns that might represent team codes
  // Example patterns: team123, t123, team-abc, abc_team, etc.
  const teamCodePatterns = [
    /team[_-]?([a-zA-Z0-9]+)/i,  // team123, team_abc, team-xyz
    /([a-zA-Z0-9]+)[_-]?team/i,  // abc_team, xyz-team
    /^t([0-9]+)$/i,              // t123, t456
    /^([a-zA-Z]{2,6}[0-9]{1,4})$/i, // abc123, xyz1, abcd12
    /^([a-zA-Z0-9]{3,8})$/i      // general alphanumeric codes
  ];
  
  // Try each pattern
  for (const pattern of teamCodePatterns) {
    const match = beforeAt.match(pattern);
    if (match) {
      return match[1] || match[0]; // Return captured group or full match
    }
  }
  
  // If no pattern matches, return the part before @ as potential team code
  return beforeAt;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get all projects
app.get('/projects', (req, res) => {
  res.json(projects);
});

// Add a new project
app.post('/projects', async (req, res) => {
  try {
    const { name, host, database, username, password, port } = req.body;

    // Validate required fields
    if (!name || !host || !database || !username || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, host, database, username, password' 
      });
    }

    // Test connection
    const pool = new Pool({
      host,
      database,
      user: username,
      password,
      port: port || 5432,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    });

    try {
      // Test connection
      const client = await pool.connect();
      
      // Check if required tables exist
      const tableChecks = await Promise.all(
        REQUIRED_TABLES.map(async (tableName) => {
          const result = await client.query(
            `SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = $1
            )`,
            [tableName]
          );
          return { table: tableName, exists: result.rows[0].exists };
        })
      );

      client.release();
      await pool.end();

      const missingTables = tableChecks.filter(check => !check.exists);
      
      if (missingTables.length > 0) {
        return res.status(400).json({
          error: `Missing required tables: ${missingTables.map(t => t.table).join(', ')}`
        });
      }

      // Add project to memory
      const project = {
        id: uuidv4(),
        name,
        host,
        database,
        username,
        password,
        port: port || 5432,
        createdAt: new Date().toISOString()
      };

      projects.push(project);

      res.json({ 
        message: 'Project added successfully',
        project: {
          id: project.id,
          name: project.name,
          host: project.host,
          database: project.database,
          username: project.username,
          port: project.port,
          createdAt: project.createdAt
        }
      });

    } catch (dbError) {
      console.error('Database connection error:', dbError);
      res.status(400).json({ 
        error: 'Failed to connect to database. Please check your credentials.',
        details: dbError.message || dbError
      });
    }

  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove a project
app.delete('/projects/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = projects.length;
  projects = projects.filter(p => p.id !== id);
  
  if (projects.length === initialLength) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  res.json({ message: 'Project removed successfully' });
});

// Export tables as ZIP
app.post('/export', async (req, res) => {
  try {
    if (projects.length === 0) {
      return res.status(400).json({ error: 'No projects configured' });
    }

    // Create temporary directory for CSV files
    const tempDir = path.join(__dirname, 'temp', uuidv4());
    fs.mkdirSync(tempDir, { recursive: true });

    const exportResults = [];

    // Export data from each project
    for (const project of projects) {
      const pool = new Pool({
        host: project.host,
        database: project.database,
        user: project.username,
        password: project.password,
        port: project.port,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
      });

      try {
        const client = await pool.connect();

        // Export each required table
        for (const tableName of REQUIRED_TABLES) {
          try {
            const result = await client.query(`SELECT * FROM ${tableName}`);

            if (result.rows.length > 0) {
              const fileName = `${project.name}_${tableName}.csv`;
              const filePath = path.join(tempDir, fileName);

              // Get column names
              const columns = Object.keys(result.rows[0]).map(key => ({
                id: key,
                title: key
              }));

              // Stringify object/array/JSON fields for CSV output
              const rows = result.rows.map(row => {
                const newRow = {};
                for (const key of Object.keys(row)) {
                  const value = row[key];
                  if (value && typeof value === 'object') {
                    newRow[key] = JSON.stringify(value);
                  } else {
                    newRow[key] = value;
                  }
                }
                return newRow;
              });

              // Create CSV writer
              const csvWriter = createCsvWriter({
                path: filePath,
                header: columns
              });

              // Write data to CSV
              await csvWriter.writeRecords(rows);

              exportResults.push({
                project: project.name,
                table: tableName,
                fileName,
                rowCount: result.rows.length,
                status: 'success'
              });
            } else {
              exportResults.push({
                project: project.name,
                table: tableName,
                fileName: null,
                rowCount: 0,
                status: 'empty'
              });
            }
          } catch (tableError) {
            console.error(`Error exporting ${tableName} from ${project.name}:`, tableError);
            exportResults.push({
              project: project.name,
              table: tableName,
              fileName: null,
              rowCount: 0,
              status: 'error',
              error: tableError.message
            });
          }
        }

        client.release();
        await pool.end();

      } catch (projectError) {
        console.error(`Error connecting to project ${project.name}:`, projectError);
        REQUIRED_TABLES.forEach(tableName => {
          exportResults.push({
            project: project.name,
            table: tableName,
            fileName: null,
            rowCount: 0,
            status: 'error',
            error: projectError.message
          });
        });
      }
    }

    // Create ZIP file
    const zipFileName = `supabase_export_${new Date().toISOString().split('T')[0]}.zip`;
    const zipPath = path.join(tempDir, zipFileName);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);

    // Add CSV files to ZIP
    const csvFiles = fs.readdirSync(tempDir).filter(file => file.endsWith('.csv'));
    csvFiles.forEach(file => {
      archive.file(path.join(tempDir, file), { name: file });
    });

    await archive.finalize();

    // Wait for ZIP to be created
    await new Promise((resolve) => {
      output.on('close', resolve);
    });

    // Send ZIP file
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);
    
    const zipStream = fs.createReadStream(zipPath);
    zipStream.pipe(res);

    // Clean up temp directory after sending
    zipStream.on('end', () => {
      setTimeout(() => {
        try {
          fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (cleanupError) {
          console.error('Error cleaning up temp directory:', cleanupError);
        }
      }, 1000);
    });

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed: ' + error.message });
  }
});

// Get team members from all projects with pagination and filtering
app.get('/team-members', async (req, res) => {
  try {
    if (projects.length === 0) {
      return res.json({ 
        data: [], 
        total: 0, 
        page: 1, 
        limit: 12, 
        totalPages: 0 
      });
    }

    // Parse query parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 12), 100); // Max 100 per page
    const search = req.query.search ? req.query.search.toLowerCase().trim() : '';
    const project = req.query.project || '';
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';

    const allTeamMembers = [];

    // Fetch team members from each project
    for (const projectConfig of projects) {
      // Skip projects that don't match the filter
      if (project && project !== 'all' && projectConfig.name !== project) {
        continue;
      }

      const pool = new Pool({
        host: projectConfig.host,
        database: projectConfig.database,
        user: projectConfig.username,
        password: projectConfig.password,
        port: projectConfig.port,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
      });

      try {
        const client = await pool.connect();
        
        // Check if teams table exists
        const tableExists = await client.query(
          `SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'teams'
          )`
        );

        if (tableExists.rows[0].exists) {
          // Build the ORDER BY clause based on sortBy parameter
          let orderByClause = '';
          const validSortColumns = ['name', 'email', 'role', 'created_at', 'updated_at'];
          if (validSortColumns.includes(sortBy)) {
            orderByClause = `ORDER BY ${sortBy} ${sortOrder}`;
          } else if (sortBy === 'team_code') {
            // For team_code, we'll sort after processing since it's computed
            orderByClause = 'ORDER BY created_at DESC';
          } else {
            orderByClause = 'ORDER BY created_at DESC';
          }

          const result = await client.query(`SELECT * FROM teams ${orderByClause}`);
          
          // Add project name and extract team_code to each team member
          const projectMembers = result.rows.map(member => {
            // Use join_code as the main team code, fallback to team_code, then extract from email
            const extractedTeamCode = member.join_code || member.team_code || (member.email ? extractTeamCodeFromEmail(member.email) : '');
            return {
              ...member,
              project_name: projectConfig.name,
              team_code: extractedTeamCode,
              team_name: member.team_name || member.teamname || ''
            };
          });
          
          allTeamMembers.push(...projectMembers);
        }

        client.release();
        await pool.end();

      } catch (projectError) {
        console.error(`Error fetching team members from ${projectConfig.name}:`, projectError);
        // Continue with other projects even if one fails
      }
    }

    // Apply search filtering
    let filteredMembers = allTeamMembers;
    if (search) {
      filteredMembers = allTeamMembers.filter(member => {
        const searchableFields = [
          member.name || '',
          member.email || '',
          member.team_code || '',
          member.project_name || '',
          member.role || '',
          member.join_code || '' // Allow searching by join_code
        ];
        return searchableFields.some(field => 
          field.toLowerCase().includes(search)
        );
      });
    }

    // Apply sorting if it's team_code (since it's computed after DB query)
    if (sortBy === 'team_code') {
      filteredMembers.sort((a, b) => {
        const aValue = (a.team_code || '').toLowerCase();
        const bValue = (b.team_code || '').toLowerCase();
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === 'ASC' ? comparison : -comparison;
      });
    } else if (sortBy === 'project') {
      filteredMembers.sort((a, b) => {
        const aValue = (a.project_name || '').toLowerCase();
        const bValue = (b.project_name || '').toLowerCase();
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === 'ASC' ? comparison : -comparison;
      });
    }

    // Calculate pagination
    const total = filteredMembers.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedMembers = filteredMembers.slice(offset, offset + limit);

    res.json({
      data: paginatedMembers,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });

  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Export team members as CSV
app.post('/export-team-members', async (req, res) => {
  try {
    if (projects.length === 0) {
      return res.status(400).json({ error: 'No projects configured' });
    }

    const allTeamMembers = [];

    // Fetch team members from each project
    for (const project of projects) {
      const pool = new Pool({
        host: project.host,
        database: project.database,
        user: project.username,
        password: project.password,
        port: project.port,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
      });

      try {
        const client = await pool.connect();
        
        // Check if teams table exists
        const tableExists = await client.query(
          `SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'teams'
          )`
        );

        if (tableExists.rows[0].exists) {
          const result = await client.query('SELECT * FROM teams ORDER BY created_at DESC');
          
          // Add project name and extract team_code to each team member
          const projectMembers = result.rows.map(member => {
            const extractedTeamCode = member.team_code || (member.email ? extractTeamCodeFromEmail(member.email) : '');
            return {
              ...member,
              project_name: project.name,
              team_code: extractedTeamCode
            };
          });
          
          allTeamMembers.push(...projectMembers);
        }

        client.release();
        await pool.end();

      } catch (projectError) {
        console.error(`Error fetching team members from ${project.name}:`, projectError);
      }
    }

    if (allTeamMembers.length === 0) {
      return res.status(404).json({ error: 'No team members found' });
    }

    // Create temporary directory for CSV file
    const tempDir = path.join(__dirname, 'temp', uuidv4());
    fs.mkdirSync(tempDir, { recursive: true });

    const fileName = `team_members_${new Date().toISOString().split('T')[0]}.csv`;
    const filePath = path.join(tempDir, fileName);

    // Get all possible column names from all team members
    const allColumns = new Set(['project_name']);
    allTeamMembers.forEach(member => {
      Object.keys(member).forEach(key => {
        if (key !== 'project_name') {
          allColumns.add(key);
        }
      });
    });

    const columns = Array.from(allColumns).map(key => ({
      id: key,
      title: key
    }));

    // Stringify object/array/JSON fields for CSV output
    const rows = allTeamMembers.map(member => {
      const newRow = {};
      allColumns.forEach(key => {
        const value = member[key];
        if (value && typeof value === 'object') {
          newRow[key] = JSON.stringify(value);
        } else {
          newRow[key] = value || '';
        }
      });
      return newRow;
    });

    // Create CSV writer
    const csvWriter = createCsvWriter({
      path: filePath,
      header: columns
    });

    // Write data to CSV
    await csvWriter.writeRecords(rows);

    // Send CSV file
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    const csvStream = fs.createReadStream(filePath);
    csvStream.pipe(res);

    // Clean up temp directory after sending
    csvStream.on('end', () => {
      setTimeout(() => {
        try {
          fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (cleanupError) {
          console.error('Error cleaning up temp directory:', cleanupError);
        }
      }, 1000);
    });

  } catch (error) {
    console.error('Team members export error:', error);
    res.status(500).json({ error: 'Export failed: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
