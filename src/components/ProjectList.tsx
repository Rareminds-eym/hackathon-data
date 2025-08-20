import React from 'react';
import { Database, Trash2, ExternalLink, Users, AlertCircle } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  host: string;
  database: string;
}

interface ProjectListProps {
  projects: Project[];
  onRemoveProject: (id: string) => void;
  loading: boolean;
}

export default function ProjectList({ projects, onRemoveProject, loading }: ProjectListProps) {
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  const handleDelete = (id: string) => {
    setConfirmId(id);
  };
  const confirmDelete = () => {
    if (confirmId) onRemoveProject(confirmId);
    setConfirmId(null);
  };
  const cancelDelete = () => setConfirmId(null);

  if (projects.length === 0) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-teal-500/5 rounded-2xl md:rounded-3xl blur-xl"></div>
        
        <div className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl text-center">
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-8">
            <div className="p-2 md:p-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl md:rounded-2xl shadow-lg">
              <Database className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">Project List</h2>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Manage your connections</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 md:p-6 bg-gradient-to-r from-gray-500/10 to-slate-500/10 border border-gray-500/20 rounded-xl md:rounded-2xl backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
            <div className="p-2 bg-gray-500/20 rounded-lg">
              <AlertCircle className="text-gray-500 flex-shrink-0" size={20} />
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1 text-sm md:text-base">No Projects Added</p>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Add your first Supabase project to get started.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-teal-500/5 rounded-2xl md:rounded-3xl blur-xl"></div>
      
      <div className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 md:mb-8">
          <div className="p-2 md:p-3 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl md:rounded-2xl shadow-lg">
            <Database className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">Connected Projects</h2>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Manage your Supabase connections</p>
          </div>
        </div>

        {/* Project Count */}
        <div className="mb-4 md:mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Users className="text-gray-600 dark:text-gray-300" size={16} />
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm md:text-base">
              Active Projects ({projects.length}):
            </h3>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-3 md:space-y-4">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="group flex items-center justify-between p-3 md:p-6 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 border border-white/20 rounded-lg md:rounded-xl backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg animate-in slide-in-from-left-2 duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg md:rounded-xl shadow-md flex-shrink-0">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full animate-pulse group-hover:animate-bounce"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm md:text-lg mb-1 truncate">
                    {project.name}
                  </h3>
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1 min-w-0">
                      <ExternalLink size={12} className="flex-shrink-0" />
                      <span className="font-mono truncate">{project.host}</span>
                    </div>
                    <div className="hidden md:block w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></div>
                    <div className="flex items-center gap-1 min-w-0">
                      <Database size={12} className="flex-shrink-0" />
                      <span className="font-mono truncate">{project.database}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(project.id)}
                disabled={loading}
                className="p-2 md:p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg md:rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-110 border border-transparent hover:border-red-500/20 backdrop-blur-sm flex-shrink-0"
                title="Remove project"
              >
                <Trash2 size={16} className="transition-transform duration-200 hover:scale-110" />
              </button>
            </div>
          ))}
        </div>

        {/* Confirmation Dialog */}
        {confirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 max-w-xs w-full border border-gray-200 dark:border-gray-700 flex flex-col items-center">
              <AlertCircle className="text-red-500 mb-3" size={32} />
              <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white text-center">Delete Project?</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-6 text-center">Are you sure you want to remove this project? This action cannot be undone.</p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-all dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-4 md:mt-8 p-3 md:p-4 bg-gradient-to-r from-blue-500/10 to-teal-500/10 border border-blue-500/20 rounded-lg md:rounded-xl backdrop-blur-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Database className="text-blue-500 dark:text-blue-400" size={14} />
            <span className="text-xs md:text-sm font-medium text-blue-700 dark:text-blue-300">Connection Status</span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
            All projects are actively connected and ready for data export.
          </p>
        </div>
      </div>
    </div>
  );
}