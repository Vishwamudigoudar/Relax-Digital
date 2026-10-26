import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  Package,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  ChevronRight,
  Receipt,
  RotateCcw,
  Loader2,
} from 'lucide-react';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/orders/my-orders');
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

  const getStepStatus = (orderStatus, stepName) => {
    if (orderStatus === 'Cancelled') return 'cancelled';
    const orderIndex = steps.indexOf(orderStatus);
    const stepIndex = steps.indexOf(stepName);

    if (stepIndex <= orderIndex) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-emerald-600" />
          My Orders & Delivery Tracking
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View your order history, track real-time delivery milestones, and inspect invoices
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
          <span className="text-xs font-medium">Retrieving your orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-3">
          <Package className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">No past orders found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven&apos;t placed any orders yet. Visit our product catalog and start shopping!
          </p>
          <a
            href="/user/dashboard"
            className="inline-block px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700"
          >
            Browse Collections
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all space-y-5"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'Shipped'
                          ? 'bg-indigo-100 text-indigo-800'
                          : order.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Total Paid:</span>
                  <p className="text-lg font-black text-slate-900">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              {/* Visual Order Timeline Tracker */}
              {order.status !== 'Cancelled' ? (
                <div className="py-2">
                  <div className="grid grid-cols-4 gap-2 relative">
                    {steps.map((stepName, sIdx) => {
                      const status = getStepStatus(order.status, stepName);
                      return (
                        <div key={sIdx} className="text-center space-y-1.5 relative">
                          <div
                            className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                              status === 'completed'
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : sIdx + 1}
                          </div>
                          <span
                            className={`block text-[11px] font-semibold ${
                              status === 'completed' ? 'text-emerald-700' : 'text-slate-400'
                            }`}
                          >
                            {stepName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>This order was cancelled. Payment has been refunded to your original method.</span>
                </div>
              )}

              {/* Order Items Snapshot */}
              <div className="divide-y divide-slate-100">
                {order.products.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-xl border border-slate-100"
                      />
                      <div>
                        <h4 className="font-semibold text-slate-900">{item.name}</h4>
                        <p className="text-slate-400 text-[11px]">
                          ${item.price.toFixed(2)} &times; {item.quantity} unit{item.quantity > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Shipping info footer */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Delivering to: <strong>{order.shippingAddress.fullName}</strong>, {order.shippingAddress.address},{' '}
                    {order.shippingAddress.city} {order.shippingAddress.postalCode}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Method: {order.paymentMethod}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
