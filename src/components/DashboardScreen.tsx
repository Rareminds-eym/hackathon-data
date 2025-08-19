import React from 'react';
import { Database, AlertCircle, Wifi, WifiOff, LogOut, Activity, BookOpen } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/25">
                <Database className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Supabase CSV Exporter</h1>
                <p className="text-lg text-slate-600">Export tables from multiple Supabase projects</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {connectionStatus === 'connected' ? (
                <div className="flex items-center gap-3 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
                  <div className="relative">
                    <Wifi size={18} className="text-green-600" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-semibold text-green-700">Connected</span>
                </div>
              ) : connectionStatus === 'disconnected' ? (
                <div className="flex items-center gap-3 px-4 py-2 bg-red-50 border border-red-200 rounded-xl">
                  <WifiOff size={18} className="text-red-600" />
                  <span className="text-sm font-semibold text-red-700">Server Offline</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-400 border-t-transparent" />
                  <span className="text-sm font-semibold text-slate-700">Checking...</span>
                </div>
              )}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 font-semibold transition-all duration-200 hover:scale-105"
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
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4 animate-in slide-in-from-top-4 duration-300">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
            </div>
            <div className="flex-1">
              <p className="text-red-800 font-semibold text-lg mb-2">Server Connection Failed</p>
              <p className="text-red-700 text-sm leading-relaxed">
                Make sure the backend server is running on port 3001. Run: 
                <code className="ml-2 px-3 py-1 bg-red-100 border border-red-200 rounded-lg text-red-800 font-mono text-xs">
                  cd server && npm start
                </code>
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-300">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
            </div>
            <span className="text-red-800 flex-1 font-medium">{error}</span>
            <button
              onClick={() => setError('')}
              className="p-1 hover:bg-red-100 rounded-lg text-red-600 hover:text-red-700 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Project Form and List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-lg shadow-blue-500/5">
              <ProjectForm onAddProject={handleAddProject} loading={loading} />
            </div>
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-lg shadow-blue-500/5">
              <ProjectList 
                projects={projects} 
                onRemoveProject={handleRemoveProject}
                loading={loading}
              />
            </div>
          </div>

          {/* Right Column - Export Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-lg shadow-blue-500/5">
              <ExportSection
                projectCount={projects.length}
                onExport={handleExport}
              />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-lg shadow-blue-500/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg shadow-blue-500/25">
              <BookOpen className="text-white" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">How to Use</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl border border-white/20">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Add Projects</h4>
                  <p className="text-slate-600 text-sm">Add your Supabase project credentials using the form above</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl border border-white/20">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Validation</h4>
                  <p className="text-slate-600 text-sm">The system will validate the connection and check for required tables</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl border border-white/20">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Required Tables</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <code className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-slate-700 font-mono text-xs">individual_attempts</code>
                    <code className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-slate-700 font-mono text-xs">attempt_details</code>
                    <code className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-slate-700 font-mono text-xs">teams</code>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl border border-white/20">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Export Data</h4>
                  <p className="text-slate-600 text-sm">Click "Export All Tables as ZIP" to download CSV files from all projects</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl border border-white/20">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">5</div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">File Naming</h4>
                  <p className="text-slate-600 text-sm mb-2">Files will be named as:</p>
                  <code className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-slate-700 font-mono text-xs">
                    projectname_tablename.csv
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardScreen;