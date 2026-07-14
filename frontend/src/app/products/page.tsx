'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search, SlidersHorizontal, Star, Heart, ShoppingCart, X, ChevronDown, Filter
} from 'lucide-react';
import type { Product } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const CATEGORIES_LIST = [
  'Bathroom Faucets', 'Rain Showers', 'Health Faucets', 'Wash Basins',
  'Bathroom Sinks', 'Kitchen Faucets', 'Soap Dispensers', 'Mirror Cabinets',
  'Shower Panels', 'Towel Holders', 'Toilet Seats', 'Flush Systems',
  'PVC Accessories', 'Angle Valves', 'Bathroom Mirrors', 'Vanity Units',
  'Shower Enclosures', 'Accessories',
];

function ProductCard({ product, onAddToCart, onToggleWishlist, wishlisted, isAdmin, onEditImage }: {
  product: Product;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (id: string) => void;
  wishlisted: boolean;
  isAdmin?: boolean;
  onEditImage?: (id: string, currentUrl: string) => void;
}) {
  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="card-product group relative">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#111]">
        <Image
          src={product.images?.[0]?.url || `https://picsum.photos/seed/${product._id}/400/400`}
          alt={product.images?.[0]?.alt || product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
        />
        {/* Badges */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-[#8b5e34] text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{product.discountPercentage}%
          </div>
        )}
        {product.isNewArrival && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            NEW
          </div>
        )}
        {product.isBestSeller && !product.isNewArrival && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            BESTSELLER
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist(product._id)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 ${
            wishlisted ? 'text-red-400 bg-red-400/10' : 'text-white/70 hover:text-red-400'
          }`}
        >
          <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Admin Edit Image Button */}
        {isAdmin && onEditImage && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEditImage(product._id, product.images?.[0]?.url || ''); }}
            className="absolute top-3 right-14 w-8 h-8 rounded-full bg-blue-500/80 hover:bg-blue-500 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
            title="Edit Image"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
        )}

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="btn-primary w-full py-2.5 text-sm"
          >
            <ShoppingCart size={15} />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[#8b5e34] text-xs font-semibold uppercase tracking-wider mb-1 truncate">{product.categoryName}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2 hover:text-[#8b5e34] transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} size={11} className={s <= Math.round(product.ratings) ? 'text-amber-400 fill-amber-400' : 'text-white/15'} />
            ))}
          </div>
          <span className="text-white/35 text-xs">({product.numReviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-white font-bold text-base">₹{displayPrice.toLocaleString('en-IN')}</span>
          {hasDiscount && <span className="text-white/40 text-xs line-through">₹{product.price.toLocaleString('en-IN')}</span>}
          {product.stock === 0 && <span className="text-red-400 text-xs font-medium ml-auto">Out of Stock</span>}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toast, setToast] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('bathcrest_user') || 'null');
      setCurrentUser(user);
    } catch {}
  }, []);

  const handleEditImage = async (id: string, currentUrl: string) => {
    const newUrl = prompt('Enter new image URL:', currentUrl);
    if (!newUrl || newUrl === currentUrl) return;

    try {
      const token = localStorage.getItem('bathcrest_token');
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ images: [{ url: newUrl, alt: 'Product Image' }] })
      });
      const data = await res.json();
      if (data.success) {
        setToast('Image updated successfully!');
        setTimeout(() => setToast(''), 3000);
        // We could call fetchProducts() but updating local state is faster
        setProducts(prev => prev.map(p => p._id === id ? { ...p, images: [{ url: newUrl, alt: 'Product Image' }] } : p));
      } else {
        alert(data.message || 'Failed to update image');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1'),
    isFeatured: searchParams.get('isFeatured') || '',
    isNewArrival: searchParams.get('isNewArrival') || '',
    isBestSeller: searchParams.get('isBestSeller') || '',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.category) params.set('category', filters.category);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.sort) params.set('sort', filters.sort);
      if (filters.isFeatured) params.set('isFeatured', 'true');
      if (filters.isNewArrival) params.set('isNewArrival', 'true');
      if (filters.isBestSeller) params.set('isBestSeller', 'true');
      params.set('page', String(filters.page));
      params.set('limit', '12');

      const res = await fetch(`${API_URL}/products?${params}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Load wishlist from localStorage
  useEffect(() => {
    try {
      const wl = JSON.parse(localStorage.getItem('bathcrest_wishlist') || '[]');
      setWishlist(wl);
    } catch {}
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddToCart = (product: Product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('bathcrest_cart') || '{"items":[]}');
      const existing = cart.items.find((i: { product: string }) => i.product === product._id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, product.stock);
      } else {
        cart.items.push({
          product: product._id,
          name: product.name,
          image: product.images?.[0]?.url || '',
          price: product.price,
          discountPrice: product.discountPrice,
          quantity: 1,
          stock: product.stock,
        });
      }
      localStorage.setItem('bathcrest_cart', JSON.stringify(cart));
      showToast(`"${product.name}" added to cart`);
    } catch {}
  };

  const handleToggleWishlist = async (id: string) => {
    const newWL = wishlist.includes(id)
      ? wishlist.filter(w => w !== id)
      : [...wishlist, id];
    setWishlist(newWL);
    localStorage.setItem('bathcrest_wishlist', JSON.stringify(newWL));
    showToast(wishlist.includes(id) ? 'Removed from wishlist' : 'Added to wishlist');
    
    // Sync with backend if logged in
    const token = localStorage.getItem('bathcrest_token');
    if (token) {
      try {
        await fetch(`${API_URL}/wishlist/toggle/${id}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Failed to sync wishlist with server', err);
      }
    }
  };

  const updateFilter = (key: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1, isFeatured: '', isNewArrival: '', isBestSeller: '' });
    router.push('/products');
  };

  const activeFilterCount = [filters.category, filters.minPrice, filters.maxPrice, filters.isFeatured, filters.isNewArrival, filters.isBestSeller].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#0c0a09] py-10">
      <div className="section-container">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-white/40 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Products</span>
            {filters.category && (
              <>
                <span>/</span>
                <span className="text-white">{filters.category}</span>
              </>
            )}
          </nav>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {filters.category || filters.search ? (filters.category || `Search: "${filters.search}"`) : 'All Products'}
              </h1>
              <p className="text-white/40 mt-1">{total} product{total !== 1 ? 's' : ''} found</p>
            </div>
          </div>
        </div>

        {/* Search + Controls Bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
              className="input-dark !pl-10"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={filters.sort}
              onChange={e => updateFilter('sort', e.target.value)}
              className="input-dark pr-8 appearance-none bg-[#111] min-w-48 cursor-pointer"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all text-sm font-medium ${
              filtersOpen || activeFilterCount > 0
                ? 'bg-[#8b5e34]/10 border-[#8b5e34]/30 text-[#8b5e34]'
                : 'glass border-white/10 text-white/70 hover:text-white'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#8b5e34] text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {filtersOpen && (
          <div className="glass rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Filters</h3>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-white/40 hover:text-white text-sm flex items-center gap-1 transition-colors">
                  <X size={14} /> Clear All
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Category */}
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-3 block">Category</label>
                <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                  {CATEGORIES_LIST.map(cat => (
                    <button
                      key={cat}
                      onClick={() => updateFilter('category', filters.category === cat ? '' : cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        filters.category === cat
                          ? 'bg-[#8b5e34]/15 text-[#8b5e34] font-medium'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-3 block">Price Range</label>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={filters.minPrice}
                    onChange={e => updateFilter('minPrice', e.target.value)}
                    className="input-dark"
                  />
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={filters.maxPrice}
                    onChange={e => updateFilter('maxPrice', e.target.value)}
                    className="input-dark"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="text-white/50 text-xs uppercase tracking-wider mb-3 block">Quick Filters</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '⭐ Featured', key: 'isFeatured' },
                    { label: '🆕 New Arrivals', key: 'isNewArrival' },
                    { label: '🔥 Best Sellers', key: 'isBestSeller' },
                  ].map(f => (
                    <button
                      key={f.key}
                      onClick={() => updateFilter(f.key, filters[f.key as keyof typeof filters] ? '' : 'true')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                        filters[f.key as keyof typeof filters]
                          ? 'bg-[#8b5e34]/15 border-[#8b5e34]/40 text-[#8b5e34]'
                          : 'border-white/10 text-white/60 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card-product">
                <div className="skeleton aspect-square" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-3 w-24 rounded" />
                  <div className="skeleton h-4 rounded" />
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-8 rounded mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-white text-2xl font-bold mb-2">No products found</h3>
            <p className="text-white/40 mb-6">Try adjusting your search or filter criteria</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlisted={wishlist.includes(product._id)}
                  isAdmin={currentUser?.role === 'admin'}
                  onEditImage={handleEditImage}
                />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      filters.page === i + 1
                        ? 'bg-[#8b5e34] text-white'
                        : 'glass text-white/60 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl glass-dark border border-white/10 text-white text-sm font-medium shadow-2xl animate-fade-in">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
