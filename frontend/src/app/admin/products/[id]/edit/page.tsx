'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Package, ArrowLeft, Save, IndianRupee, Hash, Image as ImageIcon, CheckCircle, Tag, Layers, Star } from 'lucide-react';

const API_URL = 'https://bathcrest.onrender.com/api';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    discountPrice: '',
    stock: '0',
    sku: '',
    category: '',
    brand: 'BathCrest',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    image1: '',
    image2: '',
    image3: ''
  });

  useEffect(() => {
    if (!id) return;
    // Auth Check & Fetch Data
    const token = localStorage.getItem('bathcrest_token');
    const currentUser = JSON.parse(localStorage.getItem('bathcrest_user') || '{}');
    
    if (!token || currentUser.role !== 'admin') {
      router.push('/account/login');
      return;
    }

    const fetchData = async () => {
      try {
        const catRes = await fetch(`${API_URL}/categories`);
        const catData = await catRes.json();
        if (catData.success) {
          setCategories(catData.categories);
        }

        const prodRes = await fetch(`${API_URL}/products/${id}`);
        const prodData = await prodRes.json();
        if (prodData.success) {
          const p = prodData.product;
          setFormData({
            name: p.name || '',
            description: p.description || '',
            shortDescription: p.shortDescription || '',
            price: p.price?.toString() || '',
            discountPrice: p.discountPrice?.toString() || '',
            stock: p.stock?.toString() || '0',
            sku: p.sku || '',
            category: p.category?._id || p.category || '',
            brand: p.brand || 'BathCrest',
            isFeatured: !!p.isFeatured,
            isNewArrival: !!p.isNewArrival,
            isBestSeller: !!p.isBestSeller,
            image1: p.images?.[0]?.url || '',
            image2: p.images?.[1]?.url || '',
            image3: p.images?.[2]?.url || ''
          });
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load product data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const generateSKU = () => {
    if (!formData.name) return;
    const prefix = formData.name.substring(0, 3).toUpperCase();
    const random = Math.floor(10000 + Math.random() * 90000);
    setFormData({ ...formData, sku: `${prefix}-${random}` });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('bathcrest_token');
      
      // Build images array
      const images = [];
      if (formData.image1) images.push({ url: formData.image1, alt: formData.name });
      if (formData.image2) images.push({ url: formData.image2, alt: formData.name });
      if (formData.image3) images.push({ url: formData.image3, alt: formData.name });

      // Construct Payload
      const payload: any = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        brand: formData.brand,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isBestSeller: formData.isBestSeller,
        images
      };

      if (formData.discountPrice) payload.discountPrice = Number(formData.discountPrice);
      if (formData.sku) payload.sku = formData.sku;

      const res = await fetch(`${API_URL}/products/${id}`, { method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert('Product updated successfully!');
        router.push('/admin/products');
      } else {
        throw new Error(data.message || 'Failed to update product');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center text-white">Loading product details...</div>;

  return (
    <div className="min-h-screen bg-[#0c0a09] py-10">
      <div className="section-container max-w-5xl">
        
        {/* Header */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin/products" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                <ArrowLeft size={18} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Package className="text-[#8b5e34]" /> Edit Product
                </h1>
                <p className="text-white/40 text-sm">Update existing product information</p>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2"
            >
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              ) : (
                <><Save size={18} /> Save Product</>
              )}
            </button>
          </div>

          {error && (
            <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Basic Info */}
              <div className="glass rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-white mb-6">Basic Information</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Product Name *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="input-field text-lg" placeholder="e.g. Luxury Freestanding Bathtub" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Short Description</label>
                    <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} className="input-field" placeholder="Brief tagline or summary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Full Description *</label>
                    <textarea name="description" required value={formData.description} onChange={handleInputChange} className="input-field min-h-[200px] resize-y" placeholder="Detailed product description, features, and materials..." />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="glass rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                  <ImageIcon size={20} className="text-[#8b5e34]" /> Product Images
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Primary Image URL</label>
                    <input type="url" name="image1" value={formData.image1} onChange={handleInputChange} className="input-field" placeholder="https://example.com/image1.jpg" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Gallery Image 2 URL</label>
                    <input type="url" name="image2" value={formData.image2} onChange={handleInputChange} className="input-field" placeholder="https://example.com/image2.jpg" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Gallery Image 3 URL</label>
                    <input type="url" name="image3" value={formData.image3} onChange={handleInputChange} className="input-field" placeholder="https://example.com/image3.jpg" />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column - Organization & Pricing */}
            <div className="space-y-8">
              
              {/* Pricing & Inventory */}
              <div className="glass rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-white mb-6">Pricing & Inventory</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Regular Price (₹) *</label>
                    <div className="relative">
                      <input type="number" name="price" required min="0" value={formData.price} onChange={handleInputChange} className="input-field pl-9" placeholder="0" />
                      <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Discount Price (₹)</label>
                    <div className="relative">
                      <input type="number" name="discountPrice" min="0" value={formData.discountPrice} onChange={handleInputChange} className="input-field pl-9" placeholder="0 (Optional)" />
                      <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Stock Quantity *</label>
                    <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleInputChange} className="input-field" placeholder="0" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-white/70">SKU Code</label>
                      <button type="button" onClick={generateSKU} className="text-xs text-[#8b5e34] hover:text-white transition-colors">Generate</button>
                    </div>
                    <div className="relative">
                      <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} className="input-field pl-9 uppercase" placeholder="e.g. TUB-12345" />
                      <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Organization */}
              <div className="glass rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                  <Layers size={20} className="text-[#8b5e34]" /> Organization
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Category *</label>
                    <select name="category" required value={formData.category} onChange={handleInputChange} className="input-field">
                      <option value="" disabled className="bg-[#0c0a09] text-white/40">Select a category...</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id} className="bg-[#0c0a09] text-white">{cat.name}</option>
                      ))}
                    </select>
                    {categories.length === 0 && (
                      <p className="text-red-400 text-xs mt-2">No categories found. Please create one first.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Brand</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="input-field" placeholder="BathCrest" />
                  </div>
                </div>
              </div>

              {/* Visibility Toggles */}
              <div className="glass rounded-2xl p-6 md:p-8">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                  <Star size={20} className="text-[#8b5e34]" /> Highlights
                </h2>
                <div className="space-y-4">
                  {[
                    { id: 'isFeatured', label: 'Featured Product', desc: 'Show on homepage hero sections' },
                    { id: 'isNewArrival', label: 'New Arrival', desc: 'Badge product as newly added' },
                    { id: 'isBestSeller', label: 'Best Seller', desc: 'Highlight as popular item' }
                  ].map((toggle) => (
                    <div key={toggle.id} className="flex items-start justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="pr-4">
                        <div className="text-sm font-bold text-white">{toggle.label}</div>
                        <div className="text-xs text-white/40">{toggle.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input 
                          type="checkbox" 
                          name={toggle.id} 
                          checked={formData[toggle.id as keyof typeof formData] as boolean} 
                          onChange={handleInputChange}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8b5e34]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
