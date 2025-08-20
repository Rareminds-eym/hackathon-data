import React from 'react';
import { Database, AlertCircle, Wifi, WifiOff, LogOut, Activity, Zap, Menu, X } from 'lucide-react';
import ProjectForm, { ProjectConfig } from '../components/ProjectForm';
import ProjectsTab from '../components/ProjectsTab';
import ExportTab from '../components/ExportTab';
import InstructionsTab from '../components/InstructionsTab';

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
  const [activeTab, setActiveTab] = React.useState<'projects' | 'export' | 'instructions'>('export');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements - reduced for mobile */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-blue-500/5 md:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 md:w-80 md:h-80 bg-purple-500/5 md:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Mobile Header */}
      <header className="md:hidden backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl sticky top-0 z-30">
        <div className="px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
                <Database className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">CSV Exporter</h1>
                <p className="text-xs text-gray-300">Supabase Data Export</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {connectionStatus === 'connected' ? (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <Wifi size={12} className="text-green-400" />
                  <span className="text-xs font-medium text-green-100">Online</span>
                </div>
              ) : connectionStatus === 'disconnected' ? (
                <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <WifiOff size={12} className="text-red-400" />
                  <span className="text-xs font-medium text-red-100">Offline</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-500/20 border border-gray-500/30 rounded-lg">
                  <div className="animate-spin rounded-full h-3 w-3 border border-gray-400 border-t-transparent" />
                  <span className="text-xs font-medium text-gray-100">...</span>
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Tabs */}
      <div className="md:hidden backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-16 z-20">
        <div className="flex">
          <button
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-all ${
              activeTab === 'export' ? 'bg-white/10 text-purple-400 border-b-2 border-purple-400' : 'text-white hover:bg-white/5'
            }`}
            onClick={() => setActiveTab('export')}
          >
            <Zap size={16} />
            <span>Export</span>
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-all ${
              activeTab === 'projects' ? 'bg-white/10 text-blue-400 border-b-2 border-blue-400' : 'text-white hover:bg-white/5'
            }`}
            onClick={() => setActiveTab('projects')}
          >
            <Activity size={16} />
            <span>Projects</span>
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-all ${
              activeTab === 'instructions' ? 'bg-white/10 text-pink-400 border-b-2 border-pink-400' : 'text-white hover:bg-white/5'
            }`}
            onClick={() => setActiveTab('instructions')}
          >
            <AlertCircle size={16} />
            <span>Help</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-64 bg-slate-950/95 backdrop-blur-xl border-l border-white/10 p-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold">Menu</h3>
              <button onClick={() => setSidebarOpen(false)} className="text-white p-1">
                <X size={20} />
              </button>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen relative z-10 ml-64">
        {/* Desktop Sidebar */}
        <aside className="fixed z-20 left-0 top-0 w-64 h-screen bg-slate-950/80 border-r border-white/10 flex flex-col py-6 px-4 shadow-2xl">
          <div className="flex flex-col gap-6 flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Database className="text-white" size={28} />
              </div>
              <div>
                <span className="text-lg font-bold text-white">CSV Exporter</span>
                <p className="text-xs text-gray-300">Supabase Data Export</p>
              </div>
            </div>
            <nav className="flex flex-col gap-3">
              <button
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${
                  activeTab === 'export' ? 'bg-white/10 text-purple-400' : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setActiveTab('export')}
              >
                <Zap size={18} />
                <span>Export</span>
              </button>
              <button
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${
                  activeTab === 'projects' ? 'bg-white/10 text-blue-400' : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setActiveTab('projects')}
              >
                <Activity size={18} />
                <span>Projects</span>
              </button>
              <button
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${
                  activeTab === 'instructions' ? 'bg-white/10 text-pink-400' : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setActiveTab('instructions')}
              >
                <AlertCircle size={18} />
                <span>Instructions</span>
              </button>
            </nav>
            <div className="mt-auto">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Desktop Header */}
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl sticky top-0 z-20">
            <div className="max-w-6xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">Supabase CSV Exporter</h1>
                  <p className="text-sm text-gray-300">Export tables from multiple projects</p>
                </div>
                <div className="flex items-center gap-3">
                  {connectionStatus === 'connected' ? (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-xl">
                      <Wifi size={16} className="text-green-400" />
                      <span className="text-sm font-medium text-green-100">Connected</span>
                    </div>
                  ) : connectionStatus === 'disconnected' ? (
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-xl">
                      <WifiOff size={16} className="text-red-400" />
                      <span className="text-sm font-medium text-red-100">Offline</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-500/20 border border-gray-500/30 rounded-xl">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />
                      <span className="text-sm font-medium text-gray-100">Checking...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-6xl mx-auto px-6 py-6 w-full">
            {activeTab === 'projects' && (
              <ProjectsTab
                projects={projects}
                loading={loading}
                handleAddProject={handleAddProject}
                handleRemoveProject={handleRemoveProject}
              />
            )}
            {activeTab === 'export' && (
              <ExportTab
                projectCount={projects.length}
                onExport={handleExport}
              />
            )}
            {activeTab === 'instructions' && <InstructionsTab />}
          </main>
        </div>
      </div>

      {/* Mobile Main Content */}
      <main className="md:hidden px-3 py-4">
        {activeTab === 'projects' && (
          <ProjectsTab
            projects={projects}
            loading={loading}
            handleAddProject={handleAddProject}
            handleRemoveProject={handleRemoveProject}
          />
        )}
        {activeTab === 'export' && (
          <ExportTab
            projectCount={projects.length}
            onExport={handleExport}
          />
        )}
        {activeTab === 'instructions' && <InstructionsTab />}
      </main>
    </div>
  );
};

export default DashboardScreen;