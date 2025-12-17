import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';

// Public Pages
import Home from './pages/Home';
import ArticleView from './pages/ArticleView';
import CategoriesView from './pages/CategoriesView';
import Contact from './pages/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminArticles from './pages/admin/Articles';
import AdminCategories from './pages/admin/Categories';
import AdminComments from './pages/admin/Comments';
import AdminMessages from './pages/admin/Messages';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading auth...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="articles/:id" element={<ArticleView />} />
            <Route path="categories" element={<CategoriesView />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="comments" element={<AdminComments />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
          
          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;