import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  BarChart3,
  Download,
  TrendingUp,
  DollarSign,
  Package,
  Layers,
  ArrowUpRight,
  Calendar,
  Loader2,
} from 'lucide-react';

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const { data } = await API.get('/reports/dashboard-stats');
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const response = await API.get('/reports/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relax_digital_sales_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to export CSV: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-sm">Generating Performance Reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            Executive Reports & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Business performance metrics, category distribution, and revenue exports
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 shrink-0"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>Download Orders CSV Report</span>
        </button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">
            <span>Cumulative Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">
            ${(stats?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-emerald-400 mt-1 inline-block">+14.2% quarter-over-quarter</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">
            <span>Fulfilled Orders</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalOrders || 0}</p>
          <span className="text-[11px] text-indigo-300 mt-1 inline-block">
            {stats?.ordersByStatus?.Delivered || 0} successfully delivered
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">
            <span>Active Product Catalog</span>
            <Package className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalProducts || 0}</p>
          <span className="text-[11px] text-amber-300 mt-1 inline-block">Across active categories</span>
        </div>
      </div>

      {/* Category Distribution Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Inventory Value by Category
          </h3>
          <div className="divide-y divide-slate-800/80 text-xs">
            {stats?.categoryStats?.map((cat) => (
              <div key={cat._id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{cat._id}</p>
                  <p className="text-[11px] text-slate-400">{cat.count} listings in stock</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">${cat.totalValue.toLocaleString()}</p>
                  <span className="text-[10px] text-slate-400">Total Asset Value</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            Monthly Growth Projection
          </h3>
          <div className="space-y-3">
            {stats?.monthlyData?.map((m, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-300">{m.month} Growth</span>
                  <span className="text-indigo-400 font-bold">${m.revenue.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${Math.min(100, Math.round((m.revenue / 8000) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
