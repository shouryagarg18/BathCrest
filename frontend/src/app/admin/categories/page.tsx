'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layers, Plus, Trash2, ArrowLeft, AlertCircle, Edit, Link as LinkIcon, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://measure-worship-fiber-mean.trycloudflare.com/api';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    sortOrder: '0'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('bathcrest_token');
      const currentUser = JSON.parse(localStorage.getItem('bathcrest_user') || '{}');
      
      if (!token || currentUser.role !== 'admin') {
        router.push('/account/login');
        return;
      }

      // We need to fetch ALL categories for admin, not just active ones.
      // Wait, the backend /api/categories endpoint currently only returns { isActive: true }.
      // Let's use it for now. If it's limited, we might need a dedicated admin route later.
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      
      if (data.success) {
        setCategories(data.categories);
      } else {
        throw new Error(data.message || 'Failed to fetch categories');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('bathcrest_token');
      
      const payload: any = {
        name: formData.name,
        isActive: formData.isActive,
        sortOrder: Number(formData.sortOrder)
      };
      
      if (formData.description) payload.description = formData.description;

      const res = await fetch(`${API_URL}/categories`, {
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
        setFormData({ name: '', description: '', isActive: true, sortOrder: '0' });
        fetchCategories(); // Refresh list
      } else {
        alert(data.message || 'Failed to create category');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category? Products assigned to it might become uncategorized.')) return;
    
    try {
      const token = localStorage.getItem('bathcrest_token');
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setCategories(categories.filter(c => c._id !== id));
      } else {
        alert(data.message || 'Failed to delete category');
      }
    } catch (err: any) {
      alert(err.message);
    }
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
                <Layers className="text-[#8b5e34]" /> Manage Categories
              </h1>
              <p className="text-white/40 text-sm">Organize your store's product hierarchy</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} /> Add Category
          </button>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} /> {error}
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Category Details</th>
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Slug URL</th>
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {categories.length > 0 ? categories.map((category) => (
                    <tr key={category._id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#8b5e34]/10 border border-[#8b5e34]/20 flex items-center justify-center text-[#8b5e34]">
                            <Layers size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-white text-base">{category.name}</div>
                            {category.description && <div className="text-white/40 text-xs truncate max-w-[250px]">{category.description}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-white/50 text-sm font-mono bg-white/5 px-2 py-1 rounded w-fit">
                          <LinkIcon size={12} />
                          /{category.slug}
                        </div>
                      </td>
                      <td className="p-4">
                        {category.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                            <Check size={12} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                            <X size={12} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDelete(category._id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100 ml-auto"
                          aria-label="Delete Category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-white/40">
                        <Layers size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg mb-2">No categories found</p>
                        <p className="text-sm">Click the "Add Category" button to organize your products.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create Category Modal */}
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
                className="relative w-full max-w-md glass-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Plus className="text-[#8b5e34]" /> New Category
                  </h2>
                </div>
                
                <form onSubmit={handleCreateCategory} className="p-6 overflow-y-auto custom-scrollbar">
                  <div className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1.5">Category Name *</label>
                      <input 
                        type="text" required
                        className="input-field"
                        placeholder="e.g. Bathtubs"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                      <p className="text-white/30 text-xs mt-1.5">URL slug will be auto-generated (e.g. /bathtubs)</p>
                    </div>
                    
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1.5">Description (Optional)</label>
                      <textarea 
                        className="input-field min-h-[100px] py-3 resize-y"
                        placeholder="Brief description of the category..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Sort Order */}
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">Display Order</label>
                        <input 
                          type="number" min="0"
                          className="input-field"
                          placeholder="0"
                          value={formData.sortOrder}
                          onChange={(e) => setFormData({...formData, sortOrder: e.target.value})}
                        />
                      </div>
                      
                      {/* Active Status */}
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">Status</label>
                        <div className="flex items-center h-[42px]">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={formData.isActive}
                              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                            />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8b5e34]"></div>
                            <span className="ml-3 text-sm font-medium text-white/70">
                              {formData.isActive ? 'Active' : 'Hidden'}
                            </span>
                          </label>
                        </div>
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
                        'Save Category'
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
