import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const UserRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-500 text-sm font-medium">Loading Your Account...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location, error: 'Please log in to access your portal.' }} replace />;
  }

  return <Outlet />;
};

export default UserRoute;
