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
    <div className="relative">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl blur-xl"></div>
      
      <div className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-white/20 rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Database className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Supabase Project</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Connect your Supabase database</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inputFields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.key} className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  {field.label}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon 
                      className={`h-5 w-5 transition-colors duration-200 ${
                        errors[field.key] 
                          ? 'text-red-400' 
                          : 'text-gray-400 group-focus-within:text-blue-500'
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
                    className={`w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                      errors[field.key]
                        ? 'border-red-500 focus:ring-red-500/50 bg-red-50/50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-600 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    disabled={loading}
                  />
                  {/* Focus ring effect */}
                  <div className={`absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-200 ${
                    errors[field.key] ? 'opacity-0' : 'opacity-0 group-focus-within:opacity-100'
                  } bg-gradient-to-r from-blue-500/10 to-purple-500/10`}></div>
                </div>
                {errors[field.key] && (
                  <div className="flex items-center gap-2 mt-2 p-3 bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-xl backdrop-blur-sm animate-in slide-in-from-top-1 duration-200">
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                    <span className="text-red-700 dark:text-red-300 text-sm font-medium">
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
          onClick={handleSubmit}
          disabled={loading}
          className="mt-8 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:translate-y-0 transition-all duration-200 flex items-center justify-center gap-3 relative overflow-hidden"
        >
          {/* Button background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
          
          <div className="relative z-10 flex items-center gap-3">
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
            ) : (
              <Plus size={20} className="transition-transform duration-200 group-hover:scale-110" />
            )}
            <span className="text-lg">
              {loading ? 'Adding Project...' : 'Add Project'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}