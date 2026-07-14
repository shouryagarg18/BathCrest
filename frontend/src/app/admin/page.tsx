'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package, ShoppingCart, Users, DollarSign, TrendingUp,
  Plus, Settings, BarChart2, Tag, LogOut
} from 'lucide-react';

const API_URL = 'https://measure-worship-fiber-mean.trycloudflare.com/api';

interface Stats {
  totalRevenue?: number;
  totalOrders?: number;
  totalProducts?: number;
  totalUsers?: number;
  recentOrders?: {
    _id: string; orderId: string; totalPrice: number;
    orderStatus: string; createdAt: string;
    user?: { name: string };
  }[];
}

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('bathcrest_token');
    const user = JSON.parse(localStorage.getItem('bathcrest_user') || '{}');
    if (!token || user.role !== 'admin') {
      router.push('/account/login');
      return;
    }
    fetch(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { 
        if (d.success) {
          setStats(d);
        } else if (d.message === 'User not found' || d.message === 'Not authorized' || d.message === 'Not authorized, token failed') {
          localStorage.removeItem('bathcrest_token');
          localStorage.removeItem('bathcrest_user');
          router.push('/account/login');
        } else {
          setError(d.message); 
        }
      })
      .catch(() => setError('Failed to load stats'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('bathcrest_token');
    localStorage.removeItem('bathcrest_user');
    router.push('/');
  };

  const STATUS_COLORS: Record<string, string> = {
    processing: 'text-yellow-400 bg-yellow-400/10',
    confirmed: 'text-blue-400 bg-blue-400/10',
    shipped: 'text-purple-400 bg-purple-400/10',
    delivered: 'text-green-400 bg-green-400/10',
    cancelled: 'text-red-400 bg-red-400/10',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#8b5e34]/30 border-t-[#8b5e34] rounded-full animate-spin" />
          <p className="text-white/40">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0a09] py-10">
      {/* Admin Header */}
      <div className="border-b border-white/6 sticky z-30 glass-dark" style={{ top: '80px' }}>
        <div className="section-container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">Admin Dashboard</h1>
            <p className="text-white/40 text-sm">BathCrest Management Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/products/new" className="btn-primary text-sm py-2 px-4">
              <Plus size={15} /> Add Product
            </Link>
            <button onClick={handleLogout} className="btn-ghost text-sm text-red-400 hover:text-red-300">
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="section-container py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`, icon: <DollarSign size={22} />, color: 'text-green-400', bg: 'bg-green-400/10' },
            { label: 'Total Orders', value: stats.totalOrders || 0, icon: <ShoppingCart size={22} />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { label: 'Total Products', value: stats.totalProducts || 0, icon: <Package size={22} />, color: 'text-purple-400', bg: 'bg-purple-400/10' },
            { label: 'Total Users', value: stats.totalUsers || 0, icon: <Users size={22} />, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          ].map(stat => (
            <div key={stat.label} className="glass rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-4`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-white/40 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Manage Products', href: '/admin/products', icon: <Package size={20} /> },
            { label: 'Manage Orders', href: '/admin/orders', icon: <ShoppingCart size={20} /> },
            { label: 'Manage Users', href: '/admin/users', icon: <Users size={20} /> },
            { label: 'Analytics', href: '/admin/analytics', icon: <BarChart2 size={20} /> },
            { label: 'Categories', href: '/admin/categories', icon: <Tag size={20} /> },
            { label: 'Coupons', href: '/admin/coupons', icon: <Tag size={20} /> },
            { label: 'Revenue', href: '/admin/revenue', icon: <TrendingUp size={20} /> },
            { label: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="glass rounded-xl p-4 flex items-center gap-3 text-white/70 hover:text-white hover:border-[#8b5e34]/30 transition-all group"
            >
              <div className="text-[#8b5e34] group-hover:scale-110 transition-transform">{link.icon}</div>
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/6 flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">Recent Orders</h2>
            <Link href="/admin/orders" className="text-[#8b5e34] text-sm hover:underline">View All →</Link>
          </div>
          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-white/40 text-xs uppercase tracking-wider font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats.recentOrders.map(order => (
                    <tr key={order._id} className="hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4 font-mono text-[#8b5e34] text-sm">{order.orderId}</td>
                      <td className="px-6 py-4 text-white/70 text-sm">{order.user?.name || 'Guest'}</td>
                      <td className="px-6 py-4 text-white font-semibold text-sm">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.orderStatus] || 'text-white/60'}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/40 text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-white/40">No orders yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
