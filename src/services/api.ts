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

export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  team_code?: string;
  team_name?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
  project_name: string;
  [key: string]: any;
}

export interface PaginatedTeamMembersResponse {
  data: TeamMember[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TeamMembersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  project?: string;
  sortBy?: 'name' | 'team_code' | 'project' | 'created_at' | 'email' | 'role';
  sortOrder?: 'asc' | 'desc';
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

  async getTeamMembers(params: TeamMembersQueryParams = {}): Promise<PaginatedTeamMembersResponse> {
    // Build query string from parameters
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }
    if (params.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.search) {
      queryParams.append('search', params.search);
    }
    if (params.project) {
      queryParams.append('project', params.project);
    }
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }

    const url = `${API_BASE_URL}/team-members${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to fetch team members' }));
      throw new Error(error.error || 'Failed to fetch team members');
    }

    const data = await response.json();
    
    // Handle both paginated response format and raw array format
    if (Array.isArray(data)) {
      // Server returned raw array format, convert to paginated format
      const page = params.page || 1;
      const limit = params.limit || 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = data.slice(startIndex, endIndex);
      const total = data.length;
      const totalPages = Math.ceil(total / limit);
      
      return {
        data: paginatedData,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      };
    }
    
    // Server returned paginated format
    return data;
  }

  async exportTeamMembers(params: TeamMembersQueryParams = {}): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/export-team-members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      let errorMsg = 'Failed to export team members';
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
    link.download = 'team_members.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export const apiService = new ApiService();