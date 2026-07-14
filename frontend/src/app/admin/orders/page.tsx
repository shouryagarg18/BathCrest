'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, LogOut, ArrowLeft, Search, Eye } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://measure-worship-fiber-mean.trycloudflare.com/api';

const STATUS_COLORS: Record<string, string> = {
  processing: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  confirmed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  shipped: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  delivered: 'text-green-400 bg-green-400/10 border-green-400/20',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const STATUS_OPTIONS = ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchOrders = () => {
    const token = localStorage.getItem('bathcrest_token');
    const user = JSON.parse(localStorage.getItem('bathcrest_user') || '{}');
    
    if (!token || user.role !== 'admin') {
      router.push('/account/login');
      return;
    }

    fetch(`${API_URL}/orders?limit=50`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(d => {
      if (d.success) setOrders(d.orders);
      else setError(d.message);
    })
    .catch(() => setError('Failed to load orders'))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [router]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem('bathcrest_token');
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state to reflect change instantly
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bathcrest_token');
    localStorage.removeItem('bathcrest_user');
    router.push('/');
  };

  const filteredOrders = orders.filter(o => 
    o.orderId.toLowerCase().includes(search.toLowerCase()) ||
    (o.user?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#8b5e34]/30 border-t-[#8b5e34] rounded-full animate-spin" />
          <p className="text-white/40">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0a09] py-10">
      {/* Admin Header */}
      <div className="border-b border-white/6 sticky z-30 glass-dark" style={{ top: '80px' }}>
        <div className="section-container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-white font-bold text-xl flex items-center gap-2">
                <ShoppingCart className="text-[#8b5e34]" size={22} /> Manage Orders
              </h1>
              <p className="text-white/40 text-sm">{orders.length} total orders found</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-ghost text-sm text-red-400 hover:text-red-300">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      <div className="section-container py-8">
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer Name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#8b5e34]/50 transition-colors"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  {['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-white/40 text-xs uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <tr key={order._id} className="hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4 font-mono text-[#8b5e34] text-sm">#{order.orderId.substring(4)}</td>
                      <td className="px-6 py-4 text-white/70 text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-6 py-4">
                        <div className="text-white text-sm font-medium">{order.user?.name || 'Guest'}</div>
                        <div className="text-white/40 text-xs">{order.user?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-white/70 text-sm">{order.items?.length || 0} items</td>
                      <td className="px-6 py-4 text-white font-bold text-sm">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <select 
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`appearance-none text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg border outline-none cursor-pointer ${STATUS_COLORS[order.orderStatus] || 'text-white/60 bg-white/10 border-white/20'}`}
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt} value={opt} className="bg-[#111] text-white normal-case">{opt}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 hover:bg-[#8b5e34]/10 rounded-lg text-[#8b5e34] transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-white/40">
                      No orders found matching your search.
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
