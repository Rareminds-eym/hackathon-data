import React, { useState, useEffect, useCallback } from 'react';
import { Users, Search, Filter, Download, RefreshCw, AlertTriangle, ChevronLeft, ChevronRight, ArrowUpDown, SortAsc, SortDesc, ChevronDown } from 'lucide-react';
import TeamMemberCard from './TeamMemberCard';
import { apiService, TeamMember, PaginatedTeamMembersResponse } from '../services/api';

interface ViewTeamMembersTabProps {
  projectCount: number;
}

// Utility function to extract team_code from email
const extractTeamCodeFromEmail = (email: string): string => {
  if (!email) return '';
  
  // Extract the part before @ symbol
  const beforeAt = email.split('@')[0];
  
  // Look for common patterns that might represent team codes
  // Example patterns: team123, t123, team-abc, abc_team, etc.
  const teamCodePatterns = [
    /team[_-]?([a-zA-Z0-9]+)/i,  // team123, team_abc, team-xyz
    /([a-zA-Z0-9]+)[_-]?team/i,  // abc_team, xyz-team
    /^t([0-9]+)$/i,              // t123, t456
    /^([a-zA-Z]{2,6}[0-9]{1,4})$/i, // abc123, xyz1, abcd12
    /^([a-zA-Z0-9]{3,8})$/i      // general alphanumeric codes
  ];
  
  // Try each pattern
  for (const pattern of teamCodePatterns) {
    const match = beforeAt.match(pattern);
    if (match) {
      return match[1] || match[0]; // Return captured group or full match
    }
  }
  
  // If no pattern matches, return the part before @ as potential team code
  return beforeAt;
};

const ViewTeamMembersTab: React.FC<ViewTeamMembersTabProps> = ({ projectCount }) => {
  // Server response state
  const [paginationResponse, setPaginationResponse] = useState<PaginatedTeamMembersResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [availableProjects, setAvailableProjects] = useState<string[]>([]);
  
  // Search and filter parameters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'project' | 'created_at' | 'team_code'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Debounced search to avoid too many API calls
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load team members when filters change
  useEffect(() => {
    loadTeamMembers();
  }, [currentPage, itemsPerPage, debouncedSearch, selectedProject, sortBy, sortOrder]);

  // Reset to page 1 when filters change (except pagination controls)
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearch, selectedProject, sortBy, sortOrder]);

  // Load initial data
  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = useCallback(async () => {
    if (projectCount === 0) {
      setError('No projects configured. Please add projects first.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await apiService.getTeamMembers({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch || undefined,
        project: selectedProject === 'all' ? undefined : selectedProject,
        sortBy: sortBy,
        sortOrder: sortOrder
      });
      
      setPaginationResponse(response);
      
      // Extract unique projects for the filter dropdown
      // We need to get this from a separate call since we're only getting current page data
      if (response.data.length > 0) {
        const projects = [...new Set(response.data.map(member => member.project_name))];
        setAvailableProjects(prev => {
          const combined = [...new Set([...prev, ...projects])];
          return combined;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load team members');
      setPaginationResponse(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedSearch, selectedProject, sortBy, sortOrder, projectCount]);

  // Load available projects for filter dropdown
  useEffect(() => {
    const loadAvailableProjects = async () => {
      try {
        // Use the projects endpoint instead of loading team members
        const projects = await apiService.getProjects();
        if (projects && projects.length > 0) {
          setAvailableProjects(projects.map(p => p.name));
        }
      } catch (err) {
        console.error('Failed to load available projects:', err);
        // Fallback: extract projects from current page data if available
        if (paginationResponse?.data && paginationResponse.data.length > 0) {
          const projects = [...new Set(paginationResponse.data.map(member => member.project_name))];
          setAvailableProjects(prev => {
            const combined = [...new Set([...prev, ...projects])];
            return combined;
          });
        }
      }
    };
    
    if (projectCount > 0) {
      loadAvailableProjects();
    }
  }, [projectCount]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const handleExportTeamMembers = async () => {
    try {
      await apiService.exportTeamMembers({
        search: debouncedSearch || undefined,
        project: selectedProject === 'all' ? undefined : selectedProject,
        sortBy,
        sortOrder,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export team members');
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Team Members</h2>
              <p className="text-gray-300">View team members across all projects</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadTeamMembers}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={handleExportTeamMembers}
              disabled={!paginationResponse || paginationResponse.total === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 rounded-xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={16} />
            <input
              type="text"
              placeholder="Search by name, email, team code, project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white/15"
            />
          </div>

          {/* Project Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={16} />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="custom-select w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all hover:bg-white/15"
            >
              <option value="all" className="bg-gray-800 text-white">All Projects</option>
              {availableProjects.map((project) => (
                <option key={project} value={project} className="bg-gray-800 text-white">{project}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={16} />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'project' | 'created_at' | 'team_code')}
              className="custom-select w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all hover:bg-white/15"
            >
              <option value="name" className="bg-gray-800 text-white">Sort by Name</option>
              <option value="team_code" className="bg-gray-800 text-white">Sort by Team Code</option>
              <option value="project" className="bg-gray-800 text-white">Sort by Project</option>
              <option value="created_at" className="bg-gray-800 text-white">Sort by Date</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="relative">
            {sortOrder === 'asc' ? (
              <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={16} />
            ) : (
              <SortDesc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={16} />
            )}
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all hover:bg-white/15"
              style={{
                backgroundImage: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            >
              <option value="asc" className="bg-gray-800 text-white">↑ Ascending</option>
              <option value="desc" className="bg-gray-800 text-white">↓ Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-400" size={20} />
            <p className="text-red-100">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300">Loading team members...</p>
        </div>
      )}

      {/* Team Members Grid */}
      {!loading && !error && (
        <div className="space-y-4">
          {/* Pagination Controls and Stats */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-300">
                  {paginationResponse ? (
                    <>Showing {((paginationResponse.page - 1) * paginationResponse.limit) + 1}-{Math.min(paginationResponse.page * paginationResponse.limit, paginationResponse.total)} of {paginationResponse.total} results</>
                  ) : (
                    <>No results</>
                  )}
                </span>
                <div className="relative">
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="pl-3 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:bg-white/15 transition-all"
                    style={{
                      backgroundImage: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none'
                    }}
                  >
                    <option value={6} className="bg-gray-800 text-white">6 per page</option>
                    <option value={12} className="bg-gray-800 text-white">12 per page</option>
                    <option value={24} className="bg-gray-800 text-white">24 per page</option>
                    <option value={48} className="bg-gray-800 text-white">48 per page</option>
                  </select>
                </div>
              </div>
              <span className="text-sm text-gray-300">{availableProjects.length} projects</span>
            </div>
          </div>

          {/* Members List */}
          {paginationResponse && paginationResponse.data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginationResponse.data.map((member) => (
                  <TeamMemberCard key={`${member.project_name}-${member.id}`} member={member} formatDate={formatDate} />
                ))}
              </div>
              
              {/* Pagination Navigation */}
              {paginationResponse && paginationResponse.totalPages > 1 && (
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-2xl">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(paginationResponse.page - 1)}
                      disabled={!paginationResponse.hasPrevPage}
                      className="flex items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 rounded-lg text-white text-sm transition-all"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, paginationResponse.totalPages) }, (_, i) => {
                        let pageNum;
                        if (paginationResponse.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (paginationResponse.page <= 3) {
                          pageNum = i + 1;
                        } else if (paginationResponse.page >= paginationResponse.totalPages - 2) {
                          pageNum = paginationResponse.totalPages - 4 + i;
                        } else {
                          pageNum = paginationResponse.page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                              paginationResponse.page === pageNum
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(paginationResponse.page + 1)}
                      disabled={!paginationResponse.hasNextPage}
                      className="flex items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 rounded-lg text-white text-sm transition-all"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  
                  <div className="text-center text-sm text-gray-400 mt-3">
                    Page {paginationResponse.page} of {paginationResponse.totalPages}
                  </div>
                </div>
              )}
            </>
          ) : (!paginationResponse || paginationResponse.total === 0) ? (
            !loading && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center shadow-2xl">
                <Users className="text-gray-400 mx-auto mb-4" size={48} />
                <h3 className="text-white font-semibold mb-2">No Team Members Found</h3>
                <p className="text-gray-300">
                  {searchTerm || selectedProject !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : projectCount === 0
                      ? 'Please add projects first to view team members.'
                      : 'No team members data available in the configured projects.'}
                </p>
              </div>
            )
          ) : (
            !loading && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center shadow-2xl">
                <Users className="text-gray-400 mx-auto mb-4" size={48} />
                <h3 className="text-white font-semibold mb-2">No Team Members Found</h3>
                <p className="text-gray-300">
                  {searchTerm || selectedProject !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : projectCount === 0
                      ? 'Please add projects first to view team members.'
                      : 'No team members data available in the configured projects.'}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ViewTeamMembersTab;
