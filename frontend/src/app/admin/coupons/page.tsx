'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tag, Plus, Trash2, ArrowLeft, Percent, IndianRupee, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://measure-worship-fiber-mean.trycloudflare.com/api';

export default function AdminCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '0',
    maxDiscount: '',
    usageLimit: '',
    validTill: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('bathcrest_token');
      const currentUser = JSON.parse(localStorage.getItem('bathcrest_user') || '{}');
      
      if (!token || currentUser.role !== 'admin') {
        router.push('/account/login');
        return;
      }

      const res = await fetch(`${API_URL}/coupons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setCoupons(data.coupons);
      } else {
        throw new Error(data.message || 'Failed to fetch coupons');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('bathcrest_token');
      
      // Clean up data before sending
      const payload: any = {
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        validTill: new Date(formData.validTill).toISOString()
      };
      
      if (formData.description) payload.description = formData.description;
      if (formData.minOrderValue) payload.minOrderValue = Number(formData.minOrderValue);
      if (formData.maxDiscount) payload.maxDiscount = Number(formData.maxDiscount);
      if (formData.usageLimit) payload.usageLimit = Number(formData.usageLimit);

      const res = await fetch(`${API_URL}/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (data.success) {
        setIsModalOpen(false);
        setFormData({ code: '', description: '', discountType: 'percentage', discountValue: '', minOrderValue: '0', maxDiscount: '', usageLimit: '', validTill: '' });
        fetchCoupons(); // Refresh list
      } else {
        alert(data.message || 'Failed to create coupon');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      const token = localStorage.getItem('bathcrest_token');
      const res = await fetch(`${API_URL}/coupons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setCoupons(coupons.filter(c => c._id !== id));
      } else {
        alert(data.message || 'Failed to delete coupon');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getStatusBadge = (coupon: any) => {
    const now = new Date();
    const validTill = new Date(coupon.validTill);
    const validFrom = new Date(coupon.validFrom);
    
    if (!coupon.isActive) return <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">Inactive</span>;
    if (now > validTill) return <span className="px-2 py-1 rounded text-xs font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20">Expired</span>;
    if (now < validFrom) return <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">Upcoming</span>;
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return <span className="px-2 py-1 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Depleted</span>;
    
    return <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">Active</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#8b5e34]/30 border-t-[#8b5e34] rounded-full animate-spin" />
      </div>
    );
  }

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
                <Tag className="text-[#8b5e34]" /> Manage Coupons
              </h1>
              <p className="text-white/40 text-sm">Create and manage discount codes for your customers</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} /> Create New Coupon
          </button>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} /> {error}
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Code</th>
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Discount</th>
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Usage</th>
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Expiry</th>
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {coupons.length > 0 ? coupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#8b5e34]/10 border border-[#8b5e34]/20 flex items-center justify-center text-[#8b5e34]">
                            <Tag size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-white text-lg tracking-wider">{coupon.code}</div>
                            {coupon.description && <div className="text-white/40 text-xs truncate max-w-[200px]">{coupon.description}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-white font-medium">
                          {coupon.discountType === 'percentage' ? (
                            <><span className="text-xl">{coupon.discountValue}</span><Percent size={14} className="text-[#8b5e34]"/></>
                          ) : (
                            <><IndianRupee size={14} className="text-[#8b5e34]"/><span className="text-xl">{coupon.discountValue}</span></>
                          )}
                        </div>
                        {coupon.minOrderValue > 0 && <div className="text-white/40 text-[10px]">Min: ₹{coupon.minOrderValue}</div>}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(coupon)}
                      </td>
                      <td className="p-4">
                        <div className="text-white text-sm">
                          {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : 'used'}
                        </div>
                        {coupon.usageLimit && (
                          <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
                            <div 
                              className="bg-[#8b5e34] h-1.5 rounded-full" 
                              style={{ width: `${Math.min(100, (coupon.usedCount / coupon.usageLimit) * 100)}%` }}
                            />
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-white/70 text-sm">
                          <Clock size={14} />
                          {new Date(coupon.validTill).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDelete(coupon._id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100 ml-auto"
                          aria-label="Delete Coupon"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-white/40">
                        <Tag size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg mb-2">No coupons created yet</p>
                        <p className="text-sm">Click the "Create New Coupon" button to get started.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create Coupon Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setIsModalOpen(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg glass-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Plus className="text-[#8b5e34]" /> Create New Coupon
                  </h2>
                </div>
                
                <form onSubmit={handleCreateCoupon} className="p-6 overflow-y-auto custom-scrollbar">
                  <div className="space-y-5">
                    {/* Code */}
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1.5">Coupon Code *</label>
                      <input 
                        type="text" required
                        className="input-field uppercase tracking-widest font-bold placeholder:font-normal placeholder:tracking-normal"
                        placeholder="e.g. SUMMER20"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      />
                    </div>
                    
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1.5">Description (Optional)</label>
                      <input 
                        type="text" 
                        className="input-field"
                        placeholder="e.g. 20% off all summer items"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Discount Type */}
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">Discount Type</label>
                        <select 
                          className="input-field"
                          value={formData.discountType}
                          onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                        >
                          <option value="percentage" className="bg-[#0c0a09] text-white">Percentage (%)</option>
                          <option value="fixed" className="bg-[#0c0a09] text-white">Fixed Amount (₹)</option>
                        </select>
                      </div>
                      
                      {/* Discount Value */}
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">Value *</label>
                        <div className="relative">
                          <input 
                            type="number" required min="1"
                            className="input-field pl-8"
                            placeholder={formData.discountType === 'percentage' ? '20' : '500'}
                            value={formData.discountValue}
                            onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                            {formData.discountType === 'percentage' ? <Percent size={14} /> : <IndianRupee size={14} />}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Min Order Value */}
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">Min Order (₹)</label>
                        <input 
                          type="number" min="0"
                          className="input-field"
                          placeholder="0"
                          value={formData.minOrderValue}
                          onChange={(e) => setFormData({...formData, minOrderValue: e.target.value})}
                        />
                      </div>
                      
                      {/* Max Discount */}
                      {formData.discountType === 'percentage' && (
                        <div>
                          <label className="block text-sm font-medium text-white/70 mb-1.5">Max Discount (₹)</label>
                          <input 
                            type="number" min="0"
                            className="input-field"
                            placeholder="No limit"
                            value={formData.maxDiscount}
                            onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Valid Till */}
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">Expiry Date *</label>
                        <input 
                          type="date" required
                          className="input-field"
                          min={new Date().toISOString().split('T')[0]}
                          value={formData.validTill}
                          onChange={(e) => setFormData({...formData, validTill: e.target.value})}
                        />
                      </div>
                      
                      {/* Usage Limit */}
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">Usage Limit</label>
                        <input 
                          type="number" min="1"
                          className="input-field"
                          placeholder="Unlimited"
                          value={formData.usageLimit}
                          onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-white transition-all font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#8b5e34] to-[#5c3a21] hover:shadow-[0_0_20px_rgba(139,94,52,0.4)] text-white transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                      ) : (
                        'Save Coupon'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
