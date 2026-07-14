'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TrendingUp, ArrowLeft, Download, DollarSign, Calendar, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminRevenuePage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOrders = async (currentPage: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('bathcrest_token');
      const currentUser = JSON.parse(localStorage.getItem('bathcrest_user') || '{}');
      
      if (!token || currentUser.role !== 'admin') {
        router.push('/account/login');
        return;
      }

      const res = await fetch(`${API_URL}/orders?page=${currentPage}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setOrders(data.orders);
        setPages(Math.ceil(data.total / 10));
        setTotal(data.total);
      } else {
        throw new Error(data.message || 'Failed to fetch revenue data');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page, router]);

  // If no orders exist (database reset), use Demo Data
  const isDemo = orders.length === 0 && !loading && !error;
  
  const displayOrders = isDemo ? [
    { _id: 'ORD7890123', createdAt: '2026-07-13T10:30:00Z', user: { name: 'Rahul Sharma', email: 'rahul@example.com' }, itemsTotal: 12500, taxPrice: 2250, shippingPrice: 249, discountAmount: 0, totalPrice: 14999, paymentMethod: 'UPI', paymentStatus: 'paid' },
    { _id: 'ORD4567890', createdAt: '2026-07-12T14:15:00Z', user: { name: 'Priya Patel', email: 'priya@example.com' }, itemsTotal: 7200, taxPrice: 1296, shippingPrice: 249, discountAmount: 245, totalPrice: 8500, paymentMethod: 'Credit Card', paymentStatus: 'paid' },
    { _id: 'ORD1234567', createdAt: '2026-07-11T09:45:00Z', user: { name: 'Amit Kumar', email: 'amit@example.com' }, itemsTotal: 21000, taxPrice: 3780, shippingPrice: 0, discountAmount: 280, totalPrice: 24500, paymentMethod: 'Net Banking', paymentStatus: 'pending' },
    { _id: 'ORD8901234', createdAt: '2026-07-10T16:20:00Z', user: { name: 'Neha Singh', email: 'neha@example.com' }, itemsTotal: 2500, taxPrice: 450, shippingPrice: 250, discountAmount: 0, totalPrice: 3200, paymentMethod: 'UPI', paymentStatus: 'paid' },
    { _id: 'ORD5678901', createdAt: '2026-07-09T11:10:00Z', user: { name: 'Vikram Reddy', email: 'vikram@example.com' }, itemsTotal: 10500, taxPrice: 1890, shippingPrice: 0, discountAmount: 391, totalPrice: 11999, paymentMethod: 'Debit Card', paymentStatus: 'paid' },
    { _id: 'ORD9876543', createdAt: '2026-07-08T18:05:00Z', user: { name: 'Sneha Gupta', email: 'sneha@example.com' }, itemsTotal: 45000, taxPrice: 8100, shippingPrice: 0, discountAmount: 5100, totalPrice: 48000, paymentMethod: 'Credit Card', paymentStatus: 'paid' },
    { _id: 'ORD1122334', createdAt: '2026-07-07T09:30:00Z', user: { name: 'Karan Malhotra', email: 'karan@example.com' }, itemsTotal: 15000, taxPrice: 2700, shippingPrice: 0, discountAmount: 0, totalPrice: 17700, paymentMethod: 'UPI', paymentStatus: 'paid' },
    { _id: 'ORD2233445', createdAt: '2026-07-06T14:45:00Z', user: { name: 'Anjali Desai', email: 'anjali@example.com' }, itemsTotal: 8900, taxPrice: 1602, shippingPrice: 250, discountAmount: 500, totalPrice: 10252, paymentMethod: 'Credit Card', paymentStatus: 'pending' },
    { _id: 'ORD3344556', createdAt: '2026-07-06T10:10:00Z', user: { name: 'Rohan Joshi', email: 'rohan@example.com' }, itemsTotal: 34000, taxPrice: 6120, shippingPrice: 0, discountAmount: 1500, totalPrice: 38620, paymentMethod: 'Net Banking', paymentStatus: 'paid' },
    { _id: 'ORD4455667', createdAt: '2026-07-05T16:20:00Z', user: { name: 'Meera Iyer', email: 'meera@example.com' }, itemsTotal: 5600, taxPrice: 1008, shippingPrice: 250, discountAmount: 0, totalPrice: 6858, paymentMethod: 'UPI', paymentStatus: 'paid' },
    { _id: 'ORD5566778', createdAt: '2026-07-04T12:05:00Z', user: { name: 'Arjun Nair', email: 'arjun@example.com' }, itemsTotal: 11200, taxPrice: 2016, shippingPrice: 0, discountAmount: 1200, totalPrice: 12016, paymentMethod: 'Debit Card', paymentStatus: 'paid' },
    { _id: 'ORD6677889', createdAt: '2026-07-03T08:50:00Z', user: { name: 'Pooja Bhatia', email: 'pooja@example.com' }, itemsTotal: 22500, taxPrice: 4050, shippingPrice: 0, discountAmount: 2000, totalPrice: 24550, paymentMethod: 'Credit Card', paymentStatus: 'paid' },
    { _id: 'ORD7788990', createdAt: '2026-07-02T15:30:00Z', user: { name: 'Varun Verma', email: 'varun@example.com' }, itemsTotal: 18000, taxPrice: 3240, shippingPrice: 0, discountAmount: 1000, totalPrice: 20240, paymentMethod: 'UPI', paymentStatus: 'pending' },
    { _id: 'ORD8899001', createdAt: '2026-07-01T11:15:00Z', user: { name: 'Sanya Kapoor', email: 'sanya@example.com' }, itemsTotal: 9500, taxPrice: 1710, shippingPrice: 250, discountAmount: 0, totalPrice: 11460, paymentMethod: 'Net Banking', paymentStatus: 'paid' },
    { _id: 'ORD9900112', createdAt: '2026-06-30T17:40:00Z', user: { name: 'Dev Saxena', email: 'dev@example.com' }, itemsTotal: 42000, taxPrice: 7560, shippingPrice: 0, discountAmount: 4000, totalPrice: 45560, paymentMethod: 'Credit Card', paymentStatus: 'paid' },
    { _id: 'ORD1011121', createdAt: '2026-06-29T13:25:00Z', user: { name: 'Tara Menon', email: 'tara@example.com' }, itemsTotal: 6800, taxPrice: 1224, shippingPrice: 250, discountAmount: 500, totalPrice: 7774, paymentMethod: 'UPI', paymentStatus: 'paid' },
    { _id: 'ORD1213141', createdAt: '2026-06-28T09:10:00Z', user: { name: 'Yash Thakur', email: 'yash@example.com' }, itemsTotal: 27500, taxPrice: 4950, shippingPrice: 0, discountAmount: 2500, totalPrice: 29950, paymentMethod: 'Debit Card', paymentStatus: 'paid' },
    { _id: 'ORD1415161', createdAt: '2026-06-27T14:55:00Z', user: { name: 'Nisha Pillai', email: 'nisha@example.com' }, itemsTotal: 13400, taxPrice: 2412, shippingPrice: 0, discountAmount: 1000, totalPrice: 14812, paymentMethod: 'Credit Card', paymentStatus: 'pending' },
    { _id: 'ORD1617181', createdAt: '2026-06-26T10:40:00Z', user: { name: 'Ravi Teja', email: 'ravi@example.com' }, itemsTotal: 31000, taxPrice: 5580, shippingPrice: 0, discountAmount: 3000, totalPrice: 33580, paymentMethod: 'Net Banking', paymentStatus: 'paid' },
    { _id: 'ORD1819202', createdAt: '2026-06-25T16:25:00Z', user: { name: 'Simran Kaur', email: 'simran@example.com' }, itemsTotal: 8200, taxPrice: 1476, shippingPrice: 250, discountAmount: 0, totalPrice: 9926, paymentMethod: 'UPI', paymentStatus: 'paid' },
  ] : orders;

  const totalDemoRevenue = displayOrders.reduce((sum, ord) => sum + ord.totalPrice, 0);

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Customer Email', 'Items Total', 'Tax', 'Shipping', 'Discount', 'Grand Total', 'Payment Method', 'Status'];
    
    const csvRows = displayOrders.map(order => [
      order._id,
      new Date(order.createdAt).toLocaleDateString('en-IN'),
      order.user?.name || 'Guest User',
      order.user?.email || 'N/A',
      order.itemsTotal || 0,
      order.taxPrice || 0,
      order.shippingPrice || 0,
      order.discountAmount || 0,
      order.totalPrice || 0,
      order.paymentMethod || 'Unknown',
      order.paymentStatus || 'Unknown'
    ].map(val => `"${val}"`).join(','));
    
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BathCrest_Revenue_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] py-10">
      <div className="section-container">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <TrendingUp className="text-[#8b5e34]" /> Revenue Ledger
              </h1>
              <p className="text-white/40 text-sm">Detailed financial tracking and transaction history {isDemo && <span className="text-amber-400 font-medium ml-2">(Demo Data Mode)</span>}</p>
            </div>
          </div>
          <button onClick={handleExportCSV} className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#8b5e34]/30 border-t-[#8b5e34] rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
            {error}
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="glass rounded-2xl p-6 border-l-4 border-l-green-500">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign size={20} className="text-green-500" />
                  <h3 className="text-white/60 text-sm font-medium">Net Revenue</h3>
                </div>
                <div className="text-3xl font-black text-white">₹{(isDemo ? totalDemoRevenue : 0).toLocaleString('en-IN')}</div>
              </div>
              <div className="glass rounded-2xl p-6 border-l-4 border-l-blue-500">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard size={20} className="text-blue-500" />
                  <h3 className="text-white/60 text-sm font-medium">Total Transactions</h3>
                </div>
                <div className="text-3xl font-black text-white">{isDemo ? displayOrders.length : total}</div>
              </div>
              <div className="glass rounded-2xl p-6 border-l-4 border-l-amber-500">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar size={20} className="text-amber-500" />
                  <h3 className="text-white/60 text-sm font-medium">Current Month</h3>
                </div>
                <div className="text-3xl font-black text-white">July 2026</div>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-black/40">
                <h3 className="text-white font-semibold">Transaction Ledger</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20">
                      <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Date & ID</th>
                      <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Customer</th>
                      <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider text-right">Items</th>
                      <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider text-right">Tax/Ship</th>
                      <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider text-right">Total</th>
                      <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {displayOrders.map(order => (
                      <tr key={order._id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-4">
                          <div className="text-white font-medium text-sm">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                          <div className="text-white/30 text-xs mt-1">#{order._id.substring(0, 8).toUpperCase()}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-white font-medium text-sm">{order.user?.name || 'Guest User'}</div>
                          <div className="text-white/40 text-xs mt-1">{order.user?.email || 'N/A'}</div>
                        </td>
                        <td className="p-4 text-right text-white/70 text-sm">
                          ₹{order.itemsTotal?.toLocaleString('en-IN') || 0}
                          {order.discountAmount > 0 && <div className="text-green-400 text-xs mt-1">-₹{order.discountAmount}</div>}
                        </td>
                        <td className="p-4 text-right text-white/70 text-sm">
                          ₹{order.taxPrice?.toLocaleString('en-IN') || 0}
                          <div className="text-white/40 text-xs mt-1">+₹{order.shippingPrice || 0} ship</div>
                        </td>
                        <td className="p-4 text-right text-white font-bold text-sm">
                          ₹{order.totalPrice?.toLocaleString('en-IN') || 0}
                          <div className="text-white/40 text-[10px] mt-1">{order.paymentMethod || 'Unknown'}</div>
                        </td>
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
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!isDemo && pages > 1 && (
                <div className="p-4 border-t border-white/5 flex items-center justify-between bg-black/20">
                  <p className="text-xs text-white/40">
                    Showing page <span className="text-white font-medium">{page}</span> of <span className="text-white font-medium">{pages}</span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(pages, p + 1))}
                      disabled={page === pages}
                      className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
