import React from 'react';
import { Database, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import ProjectForm, { ProjectConfig } from './ProjectForm';
import ProjectList from './ProjectList';
import ExportSection from './ExportSection';

interface DashboardScreenProps {
  projects: any[];
  loading: boolean;
  error: string;
  connectionStatus: 'connected' | 'disconnected' | 'checking';
  handleAddProject: (projectConfig: ProjectConfig) => void;
  handleRemoveProject: (id: string) => void;
  handleExport: () => Promise<void>;
  setError: (msg: string) => void;
  logout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  projects,
  loading,
  error,
  connectionStatus,
  handleAddProject,
  handleRemoveProject,
  handleExport,
  setError,
  logout,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="text-blue-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Supabase CSV Exporter</h1>
                <p className="text-sm text-gray-600">Export tables from multiple Supabase projects</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {connectionStatus === 'connected' ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Wifi size={16} />
                  <span className="text-sm font-medium">Connected</span>
                </div>
              ) : connectionStatus === 'disconnected' ? (
                <div className="flex items-center gap-2 text-red-600">
                  <WifiOff size={16} />
                  <span className="text-sm font-medium">Server Offline</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />
                  <span className="text-sm font-medium">Checking...</span>
                </div>
              )}
              {/* Logout Button */}
              <button
                onClick={logout}
                className="ml-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-800 font-medium"
                title="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Error */}
        {connectionStatus === 'disconnected' && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <div>
              <p className="text-red-800 font-medium">Server Connection Failed</p>
              <p className="text-red-700 text-sm">
                Make sure the backend server is running on port 3001. Run: <code className="bg-red-100 px-1 rounded">cd server && npm start</code>
              </p>
            </div>
          </div>
        )}
        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <span className="text-red-800">{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Project Form and List */}
          <div className="lg:col-span-2 space-y-8">
            <ProjectForm onAddProject={handleAddProject} loading={loading} />
            <ProjectList 
              projects={projects} 
              onRemoveProject={handleRemoveProject}
              loading={loading}
            />
          </div>
          {/* Right Column - Export Section */}
          <div className="lg:col-span-1">
            <ExportSection
              projectCount={projects.length}
              onExport={handleExport}
            />
          </div>
        </div>
        {/* Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">How to Use</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
            <li>Add your Supabase project credentials using the form above</li>
            <li>The system will validate the connection and check for required tables</li>
            <li>Required tables: <code>individual_attempts</code>, <code>attempt_details</code>, <code>teams</code></li>
            <li>Click "Export All Tables as ZIP" to download CSV files from all projects</li>
            <li>Files will be named as: <code>projectname_tablename.csv</code></li>
          </ol>
        </div>
      </main>
    </div>
  );
};

export default DashboardScreen;
