'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Order {
  _id: string;
  orderId: string;
  items: { name: string; quantity: number; price: number }[];
  totalPrice: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  estimatedDelivery: string;
}

const STATUS_COLORS: Record<string, string> = {
  processing: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  confirmed: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  shipped: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  delivered: 'text-green-400 bg-green-400/10 border-green-400/30',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/30',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  processing: <Clock size={14} />,
  confirmed: <CheckCircle size={14} />,
  shipped: <Truck size={14} />,
  delivered: <CheckCircle size={14} />,
  cancelled: <XCircle size={14} />,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('bathcrest_token');
    if (!token) { setError('Please sign in to view your orders'); setLoading(false); return; }
    fetch(`${API_URL}/orders/my-orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setOrders(d.orders); else setError(d.message); })
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0c0a09] section-py">
      <div className="section-container max-w-3xl">
        <div className="skeleton h-8 w-48 rounded mb-8" />
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl mb-4" />)}
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
      <div className="text-center">
        <p className="text-white/40 mb-4">{error}</p>
        <Link href="/account/login" className="btn-primary">Sign In</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0c0a09] py-10">
      <div className="section-container max-w-3xl">
        <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
          <Link href="/" className="hover:text-white">Home</Link><span>/</span>
          <Link href="/account/profile" className="hover:text-white">Account</Link><span>/</span>
          <span className="text-white">My Orders</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-24">
            <Package size={64} className="text-white/10 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">No orders yet</h3>
            <p className="text-white/40 mb-6">Start shopping to see your orders here</p>
            <Link href="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="card-product p-6">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Order ID</p>
                    <p className="text-white font-bold font-mono">{order.orderId}</p>
                    <p className="text-white/40 text-xs mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${STATUS_COLORS[order.orderStatus] || 'text-white/60'}`}>
                      {STATUS_ICONS[order.orderStatus]}
                      {order.orderStatus}
                    </span>
                    <p className="text-white font-bold text-lg mt-2">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="divider mb-4" />

                <div className="space-y-2 mb-4">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white/60 truncate flex-1 pr-4">{item.name} ×{item.quantity}</span>
                      <span className="text-white/60">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && <p className="text-white/30 text-xs">+{order.items.length - 3} more items</p>}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-white/30">
                    {order.paymentMethod.toUpperCase()} · {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}
                  </div>
                  <Link
                    href={`/account/orders/${order._id}`}
                    className="flex items-center gap-1 text-[#8b5e34] text-sm hover:underline"
                  >
                    View Details <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
