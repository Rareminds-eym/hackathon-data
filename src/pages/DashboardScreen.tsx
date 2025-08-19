import React from 'react';
import { Database, AlertCircle, Wifi, WifiOff, LogOut, Activity, Zap } from 'lucide-react';
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-bounce delay-500"></div>
      </div>
      {/* Layout: Sidebar + Main Content */}
  <div className="flex min-h-screen relative z-10 ml-20 lg:ml-64">
        {/* Sidebar Navigation */}
        <aside className="fixed z-20 left-0 top-0 w-20 lg:w-64 h-screen max-h-screen bg-slate-950/80 border-r border-white/10 flex flex-col items-center lg:items-stretch py-8 px-2 lg:px-4 shadow-2xl overflow-y-auto">
          <div className="flex flex-col items-center lg:items-start gap-8 w-full min-h-0 flex-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Database className="text-white" size={32} />
              </div>
              <span className="hidden lg:block text-xl font-bold text-white">Supabase CSV Exporter</span>
            </div>
            <nav className="flex flex-col gap-4 w-full">
              <button
                className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all w-full text-left ${activeTab === 'export' ? 'bg-white/10 text-purple-400' : 'text-white hover:bg-white/10'}`}
                onClick={() => setActiveTab('export')}
              >
                <Zap size={20} className={activeTab === 'export' ? 'text-purple-400' : 'text-purple-400 opacity-70'} />
                <span className="hidden lg:inline">Export</span>
              </button>
              <button
                className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all w-full text-left ${activeTab === 'projects' ? 'bg-white/10 text-blue-400' : 'text-white hover:bg-white/10'}`}
                onClick={() => setActiveTab('projects')}
              >
                <Activity size={20} className={activeTab === 'projects' ? 'text-blue-400' : 'text-blue-400 opacity-70'} />
                <span className="hidden lg:inline">Projects</span>
              </button>
              <button
                className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all w-full text-left ${activeTab === 'instructions' ? 'bg-white/10 text-pink-400' : 'text-white hover:bg-white/10'}`}
                onClick={() => setActiveTab('instructions')}
              >
                <AlertCircle size={20} className={activeTab === 'instructions' ? 'text-pink-400' : 'text-pink-400 opacity-70'} />
                <span className="hidden lg:inline">Instructions</span>
              </button>
            </nav>
            <div className="mt-auto w-full flex flex-col items-center lg:items-stretch">
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 backdrop-blur-sm w-full justify-center lg:justify-start"
                title="Logout"
              >
                <LogOut size={16} />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl font-bold text-white">Supabase CSV Exporter</h1>
                  <p className="text-lg text-gray-300">Export tables from multiple Supabase projects</p>
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
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Tabs Content */}
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

      {/* End main layout and background */}
    </div>
  );
};

export default DashboardScreen;