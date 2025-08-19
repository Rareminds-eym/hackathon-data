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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});