import React, { useState } from 'react';
import { Plus, Database, AlertCircle } from 'lucide-react';

interface ProjectFormProps {
  onAddProject: (project: ProjectConfig) => void;
  loading: boolean;
}

export interface ProjectConfig {
  name: string;
  host: string;
  database: string;
  user: string;
  password: string;
  port: number;
}

export default function ProjectForm({ onAddProject, loading }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectConfig>({
    name: '',
    host: '',
    database: '',
    user: '',
    password: '',
    port: 5432
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.host.trim()) newErrors.host = 'Host is required';
    if (!formData.database.trim()) newErrors.database = 'Database name is required';
    if (!formData.user.trim()) newErrors.user = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.port || formData.port < 1 || formData.port > 65535) {
      newErrors.port = 'Valid port number is required (1-65535)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAddProject(formData);
    }
  };

  const handleInputChange = (field: keyof ProjectConfig, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Database className="text-blue-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Add Supabase Project</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="My Project"
            disabled={loading}
          />
          {errors.name && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle size={14} />
              {errors.name}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Host
          </label>
          <input
            type="text"
            value={formData.host}
            onChange={(e) => handleInputChange('host', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.host ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="db.xxx.supabase.co"
            disabled={loading}
          />
          {errors.host && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle size={14} />
              {errors.host}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Database Name
          </label>
          <input
            type="text"
            value={formData.database}
            onChange={(e) => handleInputChange('database', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.database ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="postgres"
            disabled={loading}
          />
          {errors.database && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle size={14} />
              {errors.database}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            value={formData.user}
            onChange={(e) => handleInputChange('user', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.user ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="postgres"
            disabled={loading}
          />
          {errors.user && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle size={14} />
              {errors.user}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Your database password"
            disabled={loading}
          />
          {errors.password && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle size={14} />
              {errors.password}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Port
          </label>
          <input
            type="number"
            value={formData.port}
            onChange={(e) => handleInputChange('port', parseInt(e.target.value) || 5432)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.port ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="5432"
            min="1"
            max="65535"
            disabled={loading}
          />
          {errors.port && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle size={14} />
              {errors.port}
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        ) : (
          <Plus size={18} />
        )}
        {loading ? 'Adding Project...' : 'Add Project'}
      </button>
    </form>
  );
}