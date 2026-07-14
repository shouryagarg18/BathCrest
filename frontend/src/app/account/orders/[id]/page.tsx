'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Package, ChevronRight, Clock, Truck, CheckCircle, XCircle, MapPin, CreditCard } from 'lucide-react';

const API_URL = 'https://measure-worship-fiber-mean.trycloudflare.com/api';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  totalPrice: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
}

const STATUS_COLORS: Record<string, string> = {
  processing: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  confirmed: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  shipped: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  delivered: 'text-green-400 bg-green-400/10 border-green-400/30',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/30',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  processing: <Clock size={16} />,
  confirmed: <CheckCircle size={16} />,
  shipped: <Truck size={16} />,
  delivered: <CheckCircle size={16} />,
  cancelled: <XCircle size={16} />,
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem('bathcrest_token');
    if (!token) {
      router.push('/account/login');
      return;
    }

    fetch(`${API_URL}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) setOrder(d.order);
        else setError(d.message || 'Order not found');
      })
      .catch(() => setError('Failed to load order details'))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0a09] py-10">
        <div className="section-container max-w-4xl">
          <div className="skeleton h-8 w-48 rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="skeleton h-64 rounded-2xl" />
              <div className="skeleton h-48 rounded-2xl" />
            </div>
            <div className="skeleton h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-4">{error || 'Order not found'}</p>
          <button onClick={() => router.push('/account/orders')} className="btn-primary">Back to Orders</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0a09] py-10">
      <div className="section-container max-w-4xl">
        <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link><span>/</span>
          <Link href="/account/profile" className="hover:text-white transition-colors">Account</Link><span>/</span>
          <Link href="/account/orders" className="hover:text-white transition-colors">Orders</Link><span>/</span>
          <span className="text-white font-mono">{order.orderId}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Order Details</h1>
            <p className="text-white/40 font-mono">#{order.orderId} • {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold border capitalize ${STATUS_COLORS[order.orderStatus] || 'text-white/60'}`}>
            {STATUS_ICONS[order.orderStatus]}
            {order.orderStatus}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Items List */}
            <div className="glass-dark rounded-2xl p-6 border border-white/5">
              <h2 className="text-xl font-bold text-white mb-6">Items Ordered</h2>
              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl glass border border-white/5">
                    <div className="w-20 h-20 bg-black/40 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={24} className="text-white/20" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-white font-semibold mb-1">{item.name}</h3>
                      <p className="text-white/40 text-sm mb-2">Quantity: {item.quantity}</p>
                      <p className="text-[#8b5e34] font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Order Summary */}
            <div className="glass-dark rounded-2xl p-6 border border-white/5">
              <h2 className="text-xl font-bold text-white mb-6">Summary</h2>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="divider my-4" />
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                  <CreditCard size={14} /> Payment Method
                </div>
                <p className="text-white uppercase font-semibold">{order.paymentMethod}</p>
                <div className={`text-xs font-semibold mt-2 ${order.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {order.paymentStatus === 'paid' ? '✓ Payment Received' : 'Pending Payment'}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="glass-dark rounded-2xl p-6 border border-white/5">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <MapPin size={20} className="text-[#8b5e34]" /> Shipping Address
                </h2>
                <div className="space-y-1 text-sm text-white/70">
                  <p className="text-white font-bold mb-2">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p className="pt-2 text-white/40">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
