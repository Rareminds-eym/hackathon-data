import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { apiService, Project } from './services/api';
import LoginScreen from './pages/LoginScreen';
import DashboardScreen from './pages/DashboardScreen';
import InstructionsScreen from './components/InstructionsScreen';
import NotFoundScreen from './components/NotFoundScreen';
import { useAuth } from './context/AuthContext';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const { isLoggedIn, login, logout } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      loadProjects();
      checkServerConnection();
    }
  }, [isLoggedIn]);

  const checkServerConnection = async () => {
    try {
      await apiService.healthCheck();
      setConnectionStatus('connected');
    } catch (error) {
      setConnectionStatus('disconnected');
    }
  };

  const loadProjects = async () => {
    try {
      const projectList = await apiService.getProjects();
      setProjects(projectList);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleAddProject = async (projectConfig: any) => {
    setLoading(true);
    setError('');
    try {
      const result = await apiService.addProject(projectConfig);
      setProjects((prev) => [...prev, result.project]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProject = async (id: string) => {
    setLoading(true);
    try {
      await apiService.removeProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to remove project');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    await apiService.exportTables();
  };

  const handleHL2Export = async () => {
    await apiService.exportHL2Tables();
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginScreen onLogin={login} />}
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <DashboardScreen
                projects={projects}
                loading={loading}
                error={error}
                connectionStatus={connectionStatus}
                handleAddProject={handleAddProject}
                handleRemoveProject={handleRemoveProject}
                handleExport={handleExport}
                handleHL2Export={handleHL2Export}
                setError={setError}
                logout={logout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
        <Route path="/instructions" element={<InstructionsScreen />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;