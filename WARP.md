# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a full-stack web application for exporting Supabase database tables to CSV files. It consists of:
- **Frontend**: React + TypeScript + Vite with TailwindCSS
- **Backend**: Express.js server with PostgreSQL connectivity
- **Purpose**: Tool for exporting specific tables (`individual_attempts`, `attempt_details`, `teams`) from multiple Supabase projects

## Development Commands

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server (Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Backend Development
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start server (both dev and production use same command)
npm run start
# or
npm run dev
```

### Full Stack Development
```bash
# Terminal 1: Start frontend (from root)
npm run dev

# Terminal 2: Start backend (from server/)
cd server && npm run start
```

## Architecture Overview

### Frontend Structure
- **Component Organization**: Pages in `/pages`, reusable components in `/components`
- **Routing**: React Router v7 with protected routes via AuthContext
- **State Management**: React Context for authentication, component state for data
- **Styling**: TailwindCSS with responsive design
- **API Communication**: Centralized service in `/services/api.ts`

### Backend Architecture
- **Express Server**: RESTful API on port 3001
- **Database Connections**: Multiple PostgreSQL connections via `pg` Pool
- **Data Export**: CSV generation with `csv-writer`, ZIP compression with `archiver`
- **Project Management**: In-memory storage with hardcoded default projects
- **File Handling**: Temporary file creation and cleanup for exports

### Key Components
- **AuthContext**: Simple localStorage-based authentication
- **ApiService**: Centralized HTTP client with error handling
- **Project Management**: CRUD operations for database connection configurations
- **Export System**: Multi-project CSV export with ZIP packaging

### Required Database Tables
The application expects these tables in each connected database:
- `individual_attempts`
- `attempt_details`  
- `teams`

### API Endpoints
- `GET /health` - Server health check
- `GET /projects` - List all configured projects
- `POST /projects` - Add new project (validates connection and required tables)
- `DELETE /projects/:id` - Remove project
- `POST /export` - Export all tables from all projects as ZIP

## Development Notes

### Environment Configuration
- Frontend uses Vite for development server (port 3000 by default)
- Backend runs on port 3001
- Production API endpoint: `https://datadump.rareminds.in/api`
- Development API endpoint: `http://localhost:3001`

### TypeScript Configuration
- Uses TypeScript project references with separate configs for app and node
- ESLint configured with React hooks and TypeScript rules
- Vite optimizes `lucide-react` separately

### Database Connection Security
- SSL connections with `rejectUnauthorized: false` for Supabase compatibility
- Connection timeout set to 10 seconds
- Credentials stored in-memory (not persistent)

### File Export Process
1. Creates temporary directory for CSV files
2. Connects to each configured project database
3. Exports required tables to CSV format
4. Handles JSON/object fields by stringifying them
5. Creates ZIP archive of all CSV files
6. Streams ZIP to client and cleans up temp files

### Error Handling Patterns
- Frontend: Try-catch with user-friendly error messages
- Backend: Detailed error logging with sanitized client responses
- Database: Connection validation and table existence checking
- File operations: Automatic cleanup with error handling

### Authentication Flow
- Simple localStorage-based session management
- Protected routes redirect to login if not authenticated
- No server-side authentication - client-side only

This codebase follows a straightforward full-stack pattern optimized for database export functionality with multiple project support.
