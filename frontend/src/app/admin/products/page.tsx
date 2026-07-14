'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Package, Search, Plus, ArrowLeft, Edit2, Trash2, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';

const API_URL = 'https://bathcrest.onrender.com/api';

function AdminProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination & Search state
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const fetchProducts = async (currentPage: number, search: string = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('bathcrest_token');
      const currentUser = JSON.parse(localStorage.getItem('bathcrest_user') || '{}');
      
      if (!token || currentUser.role !== 'admin') {
        router.push('/account/login');
        return;
      }

      const res = await fetch(`${API_URL}/products?page=${currentPage}&limit=10${search ? `&search=${search}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setProducts(data.products);
        setPages(data.pages);
        setTotal(data.total);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, searchQuery);
  }, [page, router]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(1, searchQuery);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('bathcrest_token');
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        showToast('Product deleted successfully', 'success');
        fetchProducts(page, searchQuery); // Refresh list
      } else {
        throw new Error(data.message || 'Failed to delete product');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] py-10">
      <div className="section-container">
        
        {/* Toast Notification */}
        {toast.show && (
          <div className={`fixed top-24 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-md animate-fade-in ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Package className="text-[#8b5e34]" /> Product Management
              </h1>
              <p className="text-white/40 text-sm">Manage inventory, pricing, and catalog</p>
            </div>
          </div>
          <Link href="/admin/products/new" className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
            <Plus size={16} /> Add Product
          </Link>
        </div>

        {/* Toolbar */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-sm">
          <form onSubmit={handleSearch} className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-md bg-black/40 border border-white/10 rounded-xl px-4 py-2.5">
            <Search size={18} className="text-white/40" />
            <input 
              type="text"
              placeholder="Search products by name or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-white w-full placeholder-white/30 text-sm"
            />
          </form>
          <div className="text-white/40 text-sm w-full md:w-auto text-right">
            Total Products: <span className="text-white font-semibold">{total}</span>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#8b5e34]/30 border-t-[#8b5e34] rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
            {error}
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-black/20">
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Product</th>
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Category</th>
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Price</th>
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map(product => (
                    <tr key={product._id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 overflow-hidden flex-shrink-0">
                            {product.images?.[0] ? (
                              <img src={product.images[0].url || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/20">
                                <Package size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm line-clamp-1">{product.name}</div>
                            <div className="text-white/30 text-xs">SKU: {product._id.substring(product._id.length - 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-white/60 text-sm">
                        {product.category?.name || product.categoryName || 'Uncategorized'}
                      </td>
                      <td className="p-4 text-white font-medium text-sm">
                        ₹{product.price.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        {product.countInStock > 0 ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                            In Stock ({product.countInStock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/products/${product._id}/edit`} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 hover:bg-blue-400/10 transition-colors">
                            <Edit2 size={14} />
                          </Link>
                          <button onClick={() => handleDelete(product._id)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-red-400 hover:bg-red-400/10 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-white/40">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pages > 1 && (
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
        )}
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0c0a09] flex items-center justify-center"><div className="w-10 h-10 border-2 border-[#8b5e34]/30 border-t-[#8b5e34] rounded-full animate-spin" /></div>}>
      <AdminProductsContent />
    </Suspense>
  );
}
