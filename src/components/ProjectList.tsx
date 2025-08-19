import React from 'react';
import { Database, Trash2, ExternalLink } from 'lucide-react';

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
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Database className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No Projects Added</h3>
        <p className="text-gray-500">Add your first Supabase project to get started with exporting tables.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Database className="text-teal-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">
          Connected Projects ({projects.length})
        </h2>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <h3 className="font-medium text-gray-800">{project.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ExternalLink size={14} />
                  <span>{project.host}</span>
                  <span className="text-gray-400">•</span>
                  <span>{project.database}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => onRemoveProject(project.id)}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Remove project"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}