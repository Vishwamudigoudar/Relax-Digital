import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Plus,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  RotateCcw,
  Loader2,
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/reports/dashboard-stats');
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-sm">Loading Real-Time Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-2xl text-red-300 text-sm flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Users',
      value: stats?.totalUsers + (stats?.totalAdmins || 0) || 0,
      subtext: `${stats?.totalUsers || 0} Customers &bull; ${stats?.totalAdmins || 0} Admins`,
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      badge: '+12% this month',
      link: '/admin/users',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      subtext: 'Active live catalog',
      icon: Package,
      color: 'from-emerald-600 to-teal-600',
      badge: 'In stock items',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      subtext: `${stats?.ordersByStatus?.Delivered || 0} Completed`,
      icon: ShoppingCart,
      color: 'from-purple-600 to-pink-600',
      badge: '+18.4%',
      link: '/admin/orders',
    },
    {
      title: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtext: 'Gross revenue to date',
      icon: DollarSign,
      color: 'from-amber-500 to-orange-600',
      badge: '+24.6% vs avg',
      link: '/admin/reports',
    },
  ];

  // Helper for monthly chart max value
  const maxRevenue = Math.max(...(stats?.monthlyData?.map((m) => m.revenue) || [1000]));

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Executive Administration
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Operations & Performance Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Monitor active customer transactions, supervise store inventory, review system health, and adjust store parameters in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/products"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>
            <Link
              to="/admin/reports"
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center space-x-1.5 transition"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Generate Report</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={idx}
              to={kpi.link}
              className="group p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${kpi.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">{kpi.value}</h3>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px]">
                  <span className="text-slate-400" dangerouslySetInnerHTML={{ __html: kpi.subtext }} />
                  <span className="font-semibold text-emerald-400 flex items-center">
                    {kpi.badge}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Bar Chart (SVG based) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Revenue Trajectory (Past 6 Months)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated monthly gross sales volume
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-950 border border-indigo-500/30 text-indigo-300">
              USD ($)
            </span>
          </div>

          {/* Responsive SVG Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2">
            {stats?.monthlyData?.map((item, i) => {
              const heightPercent = Math.max(15, Math.round((item.revenue / (maxRevenue || 1)) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-slate-800 text-indigo-300 px-2 py-1 rounded shadow mb-2 pointer-events-none whitespace-nowrap">
                    ${item.revenue.toFixed(0)} ({item.orders} ord.)
                  </div>
                  {/* Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[42px] bg-gradient-to-t from-indigo-700 via-indigo-600 to-indigo-400 rounded-t-xl transition-all duration-500 group-hover:brightness-125 shadow-lg shadow-indigo-600/20"
                  />
                  {/* Month Label */}
                  <span className="mt-3 text-xs font-medium text-slate-400 group-hover:text-white transition-colors">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <ShoppingCart className="w-4 h-4 text-purple-400" />
              Order Status Breakdown
            </h3>
            <p className="text-xs text-slate-400 mb-6">Fulfillment cycle overview</p>

            <div className="space-y-3.5">
              {[
                { label: 'Delivered', count: stats?.ordersByStatus?.Delivered || 0, color: 'bg-emerald-500', icon: CheckCircle },
                { label: 'Shipped', count: stats?.ordersByStatus?.Shipped || 0, color: 'bg-indigo-500', icon: Truck },
                { label: 'Processing', count: stats?.ordersByStatus?.Processing || 0, color: 'bg-blue-500', icon: Clock },
                { label: 'Pending', count: stats?.ordersByStatus?.Pending || 0, color: 'bg-amber-500', icon: RotateCcw },
                { label: 'Cancelled', count: stats?.ordersByStatus?.Cancelled || 0, color: 'bg-red-500', icon: AlertCircle },
              ].map((statusItem, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${statusItem.color}`} />
                    <span className="text-slate-300 font-medium">{statusItem.label}</span>
                  </div>
                  <span className="font-mono font-bold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    {statusItem.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center justify-between"
            >
              <span>Manage all orders</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Transactions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Latest customer purchases</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Items</th>
                <th className="py-3 px-6">Total Amount</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {stats?.recentOrders?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No recent transactions found.
                  </td>
                </tr>
              ) : (
                stats?.recentOrders?.map((order) => {
                  const statusColors = {
                    Delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    Shipped: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                    Processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                    Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                    Cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
                  };

                  return (
                    <tr key={order._id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-6 font-mono text-indigo-300">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-6">
                        <p className="font-semibold text-white">{order.userId?.name || 'Customer'}</p>
                        <p className="text-[11px] text-slate-400">{order.userId?.email || ''}</p>
                      </td>
                      <td className="py-3.5 px-6">
                        {order.products.reduce((acc, p) => acc + p.quantity, 0)} items
                      </td>
                      <td className="py-3.5 px-6 font-bold text-white">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusColors[order.status] || 'bg-slate-800 text-slate-400'
                            }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
