import React, { useState } from 'react';
import { Plus, Database, AlertCircle, Server, User, Key, Hash } from 'lucide-react';

interface ProjectFormProps {
  onAddProject: (project: ProjectConfig) => void;
  loading: boolean;
}

export interface ProjectConfig {
  name: string;
  host: string;
  database: string;
  username: string;
  password: string;
  port: number;
}

export default function ProjectForm({ onAddProject, loading }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectConfig>({
    name: '',
    host: '',
    database: '',
    username: '',
    password: '',
    port: 6543
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.host.trim()) newErrors.host = 'Host is required';
    if (!formData.database.trim()) newErrors.database = 'Database name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
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

  const inputFields = [
    {
      key: 'name' as keyof ProjectConfig,
      label: 'Project Name',
      type: 'text',
      placeholder: 'My Project',
      icon: Database,
    },
    {
      key: 'host' as keyof ProjectConfig,
      label: 'Host',
      type: 'text',
      placeholder: 'db.xxx.supabase.co',
      icon: Server,
    },
    {
      key: 'database' as keyof ProjectConfig,
      label: 'Database Name',
      type: 'text',
      placeholder: 'postgres',
      icon: Database,
    },
    {
      key: 'username' as keyof ProjectConfig,
      label: 'Username',
      type: 'text',
      placeholder: 'postgres',
      icon: User,
    },
    {
      key: 'password' as keyof ProjectConfig,
      label: 'Password',
      type: 'password',
      placeholder: 'Your database password',
      icon: Key,
    },
    {
      key: 'port' as keyof ProjectConfig,
      label: 'Port',
      type: 'number',
      placeholder: '5432',
      icon: Hash,
      min: 1,
      max: 65535,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/25">
          <Database className="text-white" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Add Supabase Project</h2>
          <p className="text-slate-600">Connect your Supabase database</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inputFields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.key} className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">
                  {field.label}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon 
                      className={`h-5 w-5 transition-colors duration-200 ${
                        errors[field.key] 
                          ? 'text-red-500' 
                          : 'text-slate-400 group-focus-within:text-blue-600'
                      }`} 
                    />
                  </div>
                  <input
                    type={field.type}
                    value={formData[field.key]}
                    onChange={(e) => 
                      handleInputChange(
                        field.key, 
                        field.type === 'number' ? parseInt(e.target.value) || 5432 : e.target.value
                      )
                    }
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      errors[field.key]
                        ? 'border-red-300 focus:ring-red-500 bg-red-50'
                        : 'border-slate-200 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-300'
                    }`}
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    disabled={loading}
                  />
                </div>
                {errors[field.key] && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl animate-in slide-in-from-top-1 duration-200">
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                    <span className="text-red-700 text-sm font-medium">
                      {errors[field.key]}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-0.5 disabled:hover:translate-y-0 transition-all duration-200 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
              <span className="text-lg">Adding Project...</span>
            </>
          ) : (
            <>
              <Plus size={20} />
              <span className="text-lg">Add Project</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}