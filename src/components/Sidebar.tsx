import React from 'react';
import { Database, Activity, Zap, AlertCircle, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: 'projects' | 'export' | 'instructions';
  setActiveTab: (tab: 'projects' | 'export' | 'instructions') => void;
  logout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, logout }) => (
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
          className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all w-full text-left ${activeTab === 'projects' ? 'bg-white/10 text-blue-400' : 'text-white hover:bg-white/10'}`}
          onClick={() => setActiveTab('projects')}
        >
          <Activity size={20} className={activeTab === 'projects' ? 'text-blue-400' : 'text-blue-400 opacity-70'} />
          <span className="hidden lg:inline">Projects</span>
        </button>
        <button
          className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all w-full text-left ${activeTab === 'export' ? 'bg-white/10 text-purple-400' : 'text-white hover:bg-white/10'}`}
          onClick={() => setActiveTab('export')}
        >
          <Zap size={20} className={activeTab === 'export' ? 'text-purple-400' : 'text-purple-400 opacity-70'} />
          <span className="hidden lg:inline">Export</span>
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
);

export default Sidebar;
