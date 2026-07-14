'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface WishlistProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: { url: string; alt: string }[];
  ratings: number;
  stock: number;
  categoryName: string;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const loadWishlist = async () => {
    const token = localStorage.getItem('bathcrest_token');
    if (!token) {
      // Load from localStorage for guest
      const wlIds = JSON.parse(localStorage.getItem('bathcrest_wishlist') || '[]');
      if (wlIds.length === 0) { setLoading(false); return; }
      const products = await Promise.all(
        wlIds.slice(0, 20).map((id: string) =>
          fetch(`${API_URL}/products/${id}`).then(r => r.json()).then(d => d.success ? d.product : null)
        )
      );
      setItems(products.filter(Boolean));
      setLoading(false);
      return;
    }
    const res = await fetch(`${API_URL}/wishlist`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.success) setItems(data.wishlist || []);
    setLoading(false);
  };

  useEffect(() => { loadWishlist(); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const removeFromWishlist = async (productId: string) => {
    const token = localStorage.getItem('bathcrest_token');
    if (token) {
      await fetch(`${API_URL}/wishlist/remove/${productId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    } else {
      const wl: string[] = JSON.parse(localStorage.getItem('bathcrest_wishlist') || '[]');
      localStorage.setItem('bathcrest_wishlist', JSON.stringify(wl.filter(id => id !== productId)));
    }
    setItems(prev => prev.filter(i => i._id !== productId));
    showToast('Removed from wishlist');
  };

  const addToCart = (product: WishlistProduct) => {
    const cart = JSON.parse(localStorage.getItem('bathcrest_cart') || '{"items":[]}');
    const existing = cart.items.find((i: { product: string }) => i.product === product._id);
    if (existing) { existing.quantity += 1; }
    else {
      cart.items.push({
        product: product._id, name: product.name,
        image: product.images?.[0]?.url || '', price: product.price,
        discountPrice: product.discountPrice, quantity: 1, stock: product.stock,
      });
    }
    localStorage.setItem('bathcrest_cart', JSON.stringify(cart));
    showToast(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] py-10">
      <div className="section-container">
        <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
          <Link href="/" className="hover:text-white">Home</Link><span>/</span>
          <span className="text-white">Wishlist</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8">
          My Wishlist {items.length > 0 && <span className="text-white/30">({items.length})</span>}
        </h1>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card-product">
                <div className="skeleton aspect-square" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-4 rounded" />
                  <div className="skeleton h-8 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={72} className="text-white/10 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">Your wishlist is empty</h3>
            <p className="text-white/40 mb-6">Save products you love to buy them later</p>
            <Link href="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map(product => (
              <div key={product._id} className="card-product group">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.images?.[0]?.url || `https://picsum.photos/seed/${product._id}/400/400`}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="25vw"
                  />
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center text-red-400 hover:bg-red-400/20 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-[#8b5e34] text-xs font-semibold mb-1">{product.categoryName}</p>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-white text-sm font-semibold line-clamp-2 hover:text-[#8b5e34] transition-colors mb-2">{product.name}</h3>
                  </Link>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-white font-bold">₹{(product.discountPrice || product.price).toLocaleString('en-IN')}</span>
                    {product.discountPrice && product.discountPrice < product.price && (
                      <span className="text-white/40 text-xs line-through">₹{product.price.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="btn-primary w-full py-2 text-xs"
                  >
                    <ShoppingCart size={13} />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl glass-dark border border-white/10 text-white text-sm font-medium shadow-2xl">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
