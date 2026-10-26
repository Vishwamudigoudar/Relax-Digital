import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AdminRoute = () => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-400 text-sm font-medium">Verifying Administrative Privileges...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    // Redirect unauthorized visitor or regular user to the admin login portal
    return <Navigate to="/admin/login" state={{ from: location, error: 'Administrative credentials required.' }} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
