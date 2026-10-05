import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrismProvider, usePrism } from './context/PrismContext';
import { AppLayout } from './components/layout/AppLayout';
import { ToastContainer } from './components/common/ToastContainer';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SkillsPage } from './pages/SkillsPage';
import { SkillGapsPage } from './pages/SkillGapsPage';
import { NextActionsPage } from './pages/NextActionsPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, hasCompletedOnboarding } = usePrism();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

export function App() {
  return (
    <PrismProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <SkillsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gaps"
            element={
              <ProtectedRoute>
                <SkillGapsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/next-actions"
            element={
              <ProtectedRoute>
                <NextActionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <NextActionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <RoadmapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opportunities"
            element={
              <ProtectedRoute>
                <OpportunitiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </PrismProvider>
  );
}

export default App;
