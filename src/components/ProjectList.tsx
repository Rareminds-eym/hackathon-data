import React from 'react';
import { Database, Trash2, ExternalLink, Users, AlertCircle, CheckCircle } from 'lucide-react';

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
      <div>
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl shadow-lg">
            <Database className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Project List</h2>
            <p className="text-slate-600">Manage your connected projects</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-slate-50 border border-slate-200 rounded-2xl animate-in slide-in-from-top-2 duration-300">
          <div className="p-3 bg-slate-100 rounded-xl">
            <AlertCircle className="text-slate-500 flex-shrink-0" size={24} />
          </div>
          <div>
            <p className="text-slate-800 font-semibold text-lg mb-1">No Projects Added</p>
            <p className="text-slate-600">Add your first Supabase project to get started with exporting tables.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl shadow-lg shadow-green-500/25">
          <Database className="text-white" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Connected Projects</h2>
          <p className="text-slate-600">Manage your Supabase connections</p>
        </div>
      </div>

      {/* Project Count */}
      <div className="mb-6">
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle className="text-green-600" size={20} />
          <span className="font-semibold text-green-800">
            {projects.length} Active Project{projects.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="group flex items-center justify-between p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] animate-in slide-in-from-left-2 duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">
                  {project.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <ExternalLink size={14} />
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded">{project.host}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database size={14} />
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded">{project.database}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => onRemoveProject(project.id)}
              disabled={loading}
              className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-red-200"
              title="Remove project"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Database className="text-blue-600" size={16} />
          <span className="text-sm font-semibold text-blue-800">Connection Status</span>
        </div>
        <p className="text-xs text-blue-700 leading-relaxed">
          All projects are actively connected and ready for data export.
          <br />
          Click the trash icon to remove a project from the list.
        </p>
      </div>
    </div>
  );
}