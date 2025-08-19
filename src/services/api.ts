const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://datadump.rareminds.in/api'
    : 'http://localhost:3001';

export interface Project {
  id: string;
  name: string;
  host: string;
  database: string;
}

export interface ProjectConfig {
  name: string;
  host: string;
  database: string;
  username: string;
  password: string;
  port: number;
}

class ApiService {
  async addProject(project: ProjectConfig): Promise<{ message: string; project: Project }> {
  const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add project');
    }

    return response.json();
  }

  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/projects`);

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    return response.json();
  }

  async removeProject(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove project');
    }

    return response.json();
  }

  async exportTables(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/export`, {
      method: 'POST',
    });

    if (!response.ok) {
      // Try to parse error as JSON, otherwise fallback to text
      let errorMsg = 'Failed to export tables';
      try {
        const error = await response.json();
        errorMsg = error.error || errorMsg;
      } catch {
        errorMsg = await response.text();
      }
      throw new Error(errorMsg);
    }

    // Handle file download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exported_tables.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  async healthCheck(): Promise<{ status: string; projects: number }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return response.json();
  }
}

export const apiService = new ApiService();