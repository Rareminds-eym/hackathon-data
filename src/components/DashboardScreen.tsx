import React from 'react';
import { Database, AlertCircle, Wifi, WifiOff, LogOut, Activity, Zap } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-bounce delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Database className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Supabase CSV Exporter</h1>
                <p className="text-lg text-gray-300">Export tables from multiple Supabase projects</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {connectionStatus === 'connected' ? (
                <div className="flex items-center gap-3 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl backdrop-blur-sm">
                  <div className="relative">
                    <Wifi size={18} className="text-green-400" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-green-100">Connected</span>
                </div>
              ) : connectionStatus === 'disconnected' ? (
                <div className="flex items-center gap-3 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                  <WifiOff size={18} className="text-red-400" />
                  <span className="text-sm font-medium text-red-100">Server Offline</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-500/20 border border-gray-500/30 rounded-xl backdrop-blur-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />
                  <span className="text-sm font-medium text-gray-100">Checking...</span>
                </div>
              )}
              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                title="Logout"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Error */}
        {connectionStatus === 'disconnected' && (
          <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-xl flex items-start gap-4 animate-in slide-in-from-top-4 duration-300">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertCircle className="text-red-400 flex-shrink-0" size={24} />
            </div>
            <div className="flex-1">
              <p className="text-red-100 font-semibold text-lg mb-2">Server Connection Failed</p>
              <p className="text-red-200 text-sm leading-relaxed">
                Make sure the backend server is running on port 3001. Run: 
                <code className="ml-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100 font-mono text-xs">
                  cd server && npm start
                </code>
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-300">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertCircle className="text-red-400 flex-shrink-0" size={24} />
            </div>
            <span className="text-red-100 flex-1">{error}</span>
            <button
              onClick={() => setError('')}
              className="p-1 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Project Form and List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
              <ProjectForm onAddProject={handleAddProject} loading={loading} />
            </div>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
              <ProjectList 
                projects={projects} 
                onRemoveProject={handleRemoveProject}
                loading={loading}
              />
            </div>
          </div>

          {/* Right Column - Export Section */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
              <ExportSection
                projectCount={projects.length}
                onExport={handleExport}
              />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 backdrop-blur-xl bg-blue-500/10 border border-blue-500/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Zap className="text-blue-400" size={24} />
            </div>
            <h3 className="text-2xl font-semibold text-blue-100">How to Use</h3>
          </div>
          <ol className="list-decimal list-inside space-y-4 text-blue-200 leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 text-sm font-bold mt-0.5">1</span>
              <span>Add your Supabase project credentials using the form above</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 text-sm font-bold mt-0.5">2</span>
              <span>The system will validate the connection and check for required tables</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 text-sm font-bold mt-0.5">3</span>
              <span>
                Required tables: 
                <code className="ml-2 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-100 font-mono text-xs">individual_attempts</code>
                <code className="ml-1 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-100 font-mono text-xs">attempt_details</code>
                <code className="ml-1 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-100 font-mono text-xs">teams</code>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 text-sm font-bold mt-0.5">4</span>
              <span>Click "Export All Tables as ZIP" to download CSV files from all projects</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 text-sm font-bold mt-0.5">5</span>
              <span>
                Files will be named as: 
                <code className="ml-2 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-100 font-mono text-xs">
                  projectname_tablename.csv
                </code>
              </span>
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
};

export default DashboardScreen;