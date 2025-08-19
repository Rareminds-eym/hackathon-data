import React from 'react';
import ProjectForm, { ProjectConfig } from './ProjectForm';
import ProjectList from './ProjectList';

interface ProjectsTabProps {
  projects: any[];
  loading: boolean;
  handleAddProject: (projectConfig: ProjectConfig) => void;
  handleRemoveProject: (id: string) => void;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects,
  loading,
  handleAddProject,
  handleRemoveProject,
}) => (
  <div className="flex justify-center w-full" id="projects">
    <div className="flex flex-col gap-8 w-full max-w-3xl">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
        <ProjectForm onAddProject={handleAddProject} loading={loading} />
      </div>
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
        <ProjectList 
          projects={projects} 
          onRemoveProject={handleRemoveProject}
          loading={loading}
        />
      </div>
    </div>
  </div>
);

export default ProjectsTab;
