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
  if (projects.length === 0) {
    return (
      <div className="relative">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-teal-500/5 rounded-3xl blur-xl"></div>
        
        <div className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl shadow-lg">
              <Database className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Project List</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Manage your connected projects</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-gray-500/10 to-slate-500/10 border border-gray-500/20 rounded-2xl backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
            <div className="p-2 bg-gray-500/20 rounded-lg">
              <AlertCircle className="text-gray-500 flex-shrink-0" size={24} />
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1">No Projects Added</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Add your first Supabase project to get started with exporting tables.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-teal-500/5 rounded-3xl blur-xl"></div>
      
      <div className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-white/20 rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl shadow-lg">
            <Database className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Connected Projects</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Manage your Supabase connections</p>
          </div>
        </div>

        {/* Project Count */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-gray-600 dark:text-gray-300" size={18} />
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              Active Projects ({projects.length}):
            </h3>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="group flex items-center justify-between p-6 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 border border-white/20 rounded-xl backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg animate-in slide-in-from-left-2 duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-md">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse group-hover:animate-bounce"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg mb-1">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <ExternalLink size={14} />
                      <span className="font-mono">{project.host}</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="flex items-center gap-1">
                      <Database size={14} />
                      <span className="font-mono">{project.database}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onRemoveProject(project.id)}
                disabled={loading}
                className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-110 border border-transparent hover:border-red-500/20 backdrop-blur-sm"
                title="Remove project"
              >
                <Trash2 size={18} className="transition-transform duration-200 hover:scale-110" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-teal-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Database className="text-blue-500 dark:text-blue-400" size={16} />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Connection Status</span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
            All projects are actively connected and ready for data export.
            <br />
            Click the trash icon to remove a project from the list.
          </p>
        </div>
      </div>
    </div>
  );
}