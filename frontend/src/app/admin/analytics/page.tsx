'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart2, DollarSign, Users, Package, ShoppingCart, ArrowLeft, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://measure-worship-fiber-mean.trycloudflare.com/api';

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('bathcrest_token');
    const currentUser = JSON.parse(localStorage.getItem('bathcrest_user') || '{}');
    
    if (!token || currentUser.role !== 'admin') {
      router.push('/account/login');
      return;
    }

    fetch(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(d => {
        if (d.success) setData(d);
        else throw new Error(d.message || 'Failed to fetch analytics');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#8b5e34]/30 border-t-[#8b5e34] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center max-w-md w-full">
          <AlertTriangle size={32} className="mx-auto mb-4 opacity-80" />
          <h3 className="text-lg font-bold text-white mb-2">Error Loading Analytics</h3>
          <p className="mb-4">{error}</p>
          <Link href="/admin" className="btn-primary w-full inline-block">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const { stats, monthlyRevenue, lowStock, recentOrders } = data;

  // Format chart data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData = monthlyRevenue.map((item: any) => ({
    name: `${months[item._id.month - 1]} ${item._id.year}`,
    revenue: item.revenue,
    orders: item.orders
  }));

  // If no chart data or 0 revenue, provide mock data for presentation
  const isDemo = stats?.totalRevenue === 0;
  
  const displayStats = isDemo ? {
    totalRevenue: 124500,
    totalOrders: 342,
    totalProducts: 52,
    totalUsers: 128
  } : stats;

  const displayChartData = isDemo ? [
    { name: 'Aug 2025', revenue: 4500, orders: 12 },
    { name: 'Sep 2025', revenue: 8200, orders: 25 },
    { name: 'Oct 2025', revenue: 11000, orders: 30 },
    { name: 'Nov 2025', revenue: 15400, orders: 42 },
    { name: 'Dec 2025', revenue: 22000, orders: 55 },
    { name: 'Jan 2026', revenue: 18000, orders: 48 },
    { name: 'Feb 2026', revenue: 16500, orders: 40 },
    { name: 'Mar 2026', revenue: 25000, orders: 60 },
    { name: 'Apr 2026', revenue: 28000, orders: 65 },
    { name: 'May 2026', revenue: 32000, orders: 75 },
    { name: 'Jun 2026', revenue: 45000, orders: 90 },
    { name: 'Jul 2026', revenue: 58000, orders: 110 },
  ] : chartData.length > 0 ? chartData : [{ name: 'No Data', revenue: 0, orders: 0 }];

  const displayLowStock = isDemo ? [
    { _id: '1', name: 'Premium Brass Angle Valve 15mm', stock: 2, sku: '9d3ebe65' },
    { _id: '2', name: 'CleanLift Toilet Brush Set Chrome', stock: 4, sku: '9d3ebe8e' },
    { _id: '3', name: 'Waterfall Spout Deck Faucet Gold', stock: 1, sku: '9d3ebe94' }
  ] : lowStock;

  const displayRecentOrders = isDemo ? [
    { _id: 'ORD7890123', user: { name: 'Rahul Sharma' }, totalPrice: 14999, paymentStatus: 'paid' },
    { _id: 'ORD4567890', user: { name: 'Priya Patel' }, totalPrice: 8500, paymentStatus: 'paid' },
    { _id: 'ORD1234567', user: { name: 'Amit Kumar' }, totalPrice: 24500, paymentStatus: 'pending' },
    { _id: 'ORD8901234', user: { name: 'Neha Singh' }, totalPrice: 3200, paymentStatus: 'paid' },
    { _id: 'ORD5678901', user: { name: 'Vikram Reddy' }, totalPrice: 11999, paymentStatus: 'paid' },
  ] : recentOrders;

  return (
    <div className="min-h-screen bg-[#0c0a09] py-10">
      <div className="section-container">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <BarChart2 className="text-[#8b5e34]" /> Analytics & Reports
            </h1>
            <p className="text-white/40 text-sm">Detailed insights and store performance {isDemo && <span className="text-amber-400 font-medium ml-2">(Demo Data Mode)</span>}</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue', value: `₹${(displayStats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: <DollarSign size={22} />, color: 'text-green-400', bg: 'bg-green-400/10' },
            { label: 'Total Orders', value: displayStats?.totalOrders || 0, icon: <ShoppingCart size={22} />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { label: 'Total Products', value: displayStats?.totalProducts || 0, icon: <Package size={22} />, color: 'text-purple-400', bg: 'bg-purple-400/10' },
            { label: 'Total Users', value: displayStats?.totalUsers || 0, icon: <Users size={22} />, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-5 border-l-4 border-l-transparent hover:border-l-[#8b5e34] transition-all">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-4`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-white/40 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <div className="glass rounded-2xl p-6 lg:col-span-2 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
                <p className="text-white/40 text-sm">Monthly revenue generation</p>
              </div>
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white/70">
                Last 12 Months
              </div>
            </div>
            <div className="flex-1 w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5e34" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#8b5e34" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0c0a09', borderColor: '#ffffff20', borderRadius: '12px' }}
                    itemStyle={{ color: '#d4b895' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#8b5e34" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="glass rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle size={18} className="text-amber-400" />
              <h3 className="text-lg font-bold text-white">Low Stock Alerts</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {displayLowStock?.length > 0 ? (
                <div className="space-y-4">
                  {displayLowStock.map((item: any) => (
                    <div key={item._id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                      <div className="overflow-hidden pr-3">
                        <div className="text-white font-medium text-sm truncate">{item.name}</div>
                        <div className="text-white/40 text-xs">SKU: {item.sku || item._id.substring(item._id.length - 8)}</div>
                      </div>
                      <div className="bg-amber-400/10 border border-amber-400/20 text-amber-400 px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap">
                        {item.stock} left
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mb-3">
                    <CheckCircle size={20} />
                  </div>
                  <div className="text-white font-medium">Inventory Healthy</div>
                  <div className="text-white/40 text-sm">No items are running low.</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
              <p className="text-white/40 text-sm">Latest orders placed on your store</p>
            </div>
            <Link href="/admin/orders" className="text-[#8b5e34] hover:text-white transition-colors text-sm font-medium">
              View All Orders &rarr;
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Order ID</th>
                  <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Customer</th>
                  <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayRecentOrders?.map((order: any) => (
                  <tr key={order._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white font-medium text-sm">#{order._id.substring(0, 8).toUpperCase()}</td>
                    <td className="p-4 text-white/70 text-sm">{order.user?.name || 'Guest User'}</td>
                    <td className="p-4 text-white font-medium text-sm">₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        order.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                        'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!displayRecentOrders || displayRecentOrders.length === 0) && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-white/40">
                      No recent transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Ensure CheckCircle is imported correctly if used
const CheckCircle = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
