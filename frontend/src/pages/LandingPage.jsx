import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  ShoppingBag,
  ArrowRight,
  Lock,
  Users,
  BarChart3,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

const LandingPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // One-click demo login helpers
  const handleQuickAdminLogin = async () => {
    try {
      await login('admin@example.com', 'Admin@123', 'admin');
      navigate('/admin/dashboard');
    } catch (e) {
      navigate('/admin/login');
    }
  };

  const handleQuickUserLogin = async () => {
    try {
      await login('user@example.com', 'User@123', 'user');
      navigate('/user/dashboard');
    } catch (e) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Bar */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            RELAX <span className="text-indigo-400">digital</span>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/login"
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/80 transition"
          >
            User Sign In
          </Link>
          <Link
            to="/admin/login"
            className="px-4 py-2 text-xs font-semibold text-indigo-300 bg-indigo-950/80 border border-indigo-500/30 hover:bg-indigo-900/50 rounded-lg transition"
          >
            Admin Portal
          </Link>
        </div>
      </header>

      {/* Main Gateway Hero */}
      <main className="max-w-7xl w-full mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Role-Based Authentication & Management Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl leading-tight">
          Unified Full-Stack Experience for{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Admins & Consumers
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Select your portal to experience dedicated administrative controls, inventory tracking, and analytics, or explore the retail shopping catalog with instant order placement.
        </p>

        {/* The Two Main Options */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl text-left">
          {/* Card 1: Admin Login */}
          <div className="group relative rounded-3xl p-8 bg-gradient-to-b from-slate-900 to-slate-900/60 border border-indigo-500/30 hover:border-indigo-500 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
              <span className="px-3 py-1 bg-indigo-600 text-white font-bold text-[10px] rounded-full uppercase tracking-wider shadow">
                Role: Admin
              </span>
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Admin Login</h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Access executive analytics, user directory, product inventory CRUD, order tracking, and store configurations.
              </p>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400 mb-6 space-y-1">
                <p className="flex justify-between">
                  <span className="text-slate-500 font-mono">Email:</span>
                  <span className="font-mono text-indigo-300">admin@example.com</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500 font-mono">Password:</span>
                  <span className="font-mono text-indigo-300">Admin@123</span>
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <Link
                to="/admin/login"
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-indigo-600/30"
              >
                <span>Enter Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={handleQuickAdminLogin}
                className="w-full py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium transition text-center"
              >
                ⚡ 1-Click Test Login as Admin
              </button>
            </div>
          </div>

          {/* Card 2: User Login */}
          <div className="group relative rounded-3xl p-8 bg-gradient-to-b from-slate-900 to-slate-900/60 border border-emerald-500/30 hover:border-emerald-500 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
              <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded-full uppercase tracking-wider shadow">
                Role: Customer
              </span>
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-7 h-7" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">User Login</h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Browse the modern catalog, filter products, manage your shopping cart, place live simulated orders, and view order receipts.
              </p>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400 mb-6 space-y-1">
                <p className="flex justify-between">
                  <span className="text-slate-500 font-mono">Email:</span>
                  <span className="font-mono text-emerald-300">user@example.com</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500 font-mono">Password:</span>
                  <span className="font-mono text-emerald-300">User@123</span>
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <Link
                to="/login"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-600/30"
              >
                <span>Enter User Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={handleQuickUserLogin}
                className="w-full py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium transition text-center"
              >
                ⚡ 1-Click Test Login as User
              </button>
            </div>
          </div>
        </div>

        {/* Feature badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl text-left">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
            <Lock className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">JWT + bcrypt</p>
              <p className="text-[11px] text-slate-400">Secure hashed tokens</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
            <Users className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Role Segregation</p>
              <p className="text-[11px] text-slate-400">Admin & User gates</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
            <Layers className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Full CRUD Matrix</p>
              <p className="text-[11px] text-slate-400">Products & Users</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Live Analytics</p>
              <p className="text-[11px] text-slate-400">Revenue & charts</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-6 text-center text-xs text-slate-400 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>RELAX digital &bull; Modern Full-Stack Web Platform</p>
        <p className="text-slate-400">Created for Seamless Admin & User Experience</p>
      </footer>
    </div>
  );
};

export default LandingPage;
