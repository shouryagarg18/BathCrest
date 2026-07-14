'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Star, Heart, ShoppingCart, Package, Shield, Truck, RotateCcw, ChevronRight, Plus, Minus, Check } from 'lucide-react';
import type { Product } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://measure-worship-fiber-mean.trycloudflare.com/api';

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={size} className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-white/20'} />
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`${API_URL}/products/slug/${slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setProduct(d.product);
          // Fetch related
          fetch(`${API_URL}/products?category=${encodeURIComponent(d.product.categoryName)}&limit=4`)
            .then(r => r.json())
            .then(rd => {
              if (rd.success) setRelated(rd.products.filter((p: Product) => p._id !== d.product._id).slice(0, 4));
            });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    const wl = JSON.parse(localStorage.getItem('bathcrest_wishlist') || '[]');
    setWishlisted(wl.includes(product._id));
  }, [product]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('bathcrest_cart') || '{"items":[]}');
    const existing = cart.items.find((i: { product: string }) => i.product === product._id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url || '',
        price: product.price,
        discountPrice: product.discountPrice,
        quantity,
        stock: product.stock,
      });
    }
    localStorage.setItem('bathcrest_cart', JSON.stringify(cart));
    setAdded(true);
    showToast(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    const wl: string[] = JSON.parse(localStorage.getItem('bathcrest_wishlist') || '[]');
    const newWL = wishlisted ? wl.filter(id => id !== product._id) : [...wl, product._id];
    localStorage.setItem('bathcrest_wishlist', JSON.stringify(newWL));
    setWishlisted(!wishlisted);
    showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');

    // Sync with backend if logged in
    const token = localStorage.getItem('bathcrest_token');
    if (token) {
      try {
        await fetch(`${API_URL}/wishlist/toggle/${product._id}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Failed to sync wishlist with server', err);
      }
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    const token = localStorage.getItem('bathcrest_token');
    if (!token) { showToast('Please sign in to leave a review'); return; }
    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_URL}/products/${product._id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(reviewForm),
      });
      const data = await res.json();
      if (data.success) {
        setProduct(prev => prev ? { ...prev, reviews: data.reviews } : prev);
        showToast('Review submitted! Thank you.');
        setReviewForm({ rating: 5, title: '', comment: '' });
      } else {
        showToast(data.message || 'Failed to submit review');
      }
    } catch { showToast('Failed to submit review'); }
    finally { setSubmittingReview(false); }
  };

  if (loading) {
    return (
      <div className="section-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="skeleton aspect-square rounded-2xl" />
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton aspect-square rounded-xl" />)}
            </div>
          </div>
          <div className="space-y-4 pt-8">
            {[...Array(8)].map((_, i) => <div key={i} className={`skeleton rounded ${i === 0 ? 'h-8 w-3/4' : 'h-4'}`} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section-container py-24 text-center">
        <div className="text-6xl mb-4">🚿</div>
        <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-white/40 mb-6">This product may have been removed or the link is incorrect.</p>
        <Link href="/products" className="btn-primary">Browse All Products</Link>
      </div>
    );
  }

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="min-h-screen bg-[#0c0a09]">
      <div className="section-container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <ChevronRight size={12} />
          <Link href={`/products?category=${encodeURIComponent(product.categoryName)}`} className="hover:text-white transition-colors">{product.categoryName}</Link>
          <ChevronRight size={12} />
          <span className="text-white/70 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Main */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#111]">
              <Image
                src={product.images?.[selectedImage]?.url || `https://picsum.photos/seed/${product._id}/800/800`}
                alt={product.images?.[selectedImage]?.alt || product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-[#8b5e34] text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{product.discountPercentage}% OFF
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-[#8b5e34]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img.url} alt={img.alt || ''} fill className="object-cover" sizes="120px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6 lg:pt-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#8b5e34] text-sm font-semibold">{product.categoryName}</span>
                {product.isBestSeller && <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-500/30">BESTSELLER</span>}
                {product.isNewArrival && <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full border border-green-500/30">NEW</span>}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">{product.name}</h1>
              <p className="text-white/50 text-base leading-relaxed">{product.shortDescription || product.description.slice(0, 160) + '...'}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating rating={product.ratings} />
              <span className="text-white font-semibold">{product.ratings}</span>
              <span className="text-white/40 text-sm">({product.numReviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-black text-white">₹{displayPrice.toLocaleString('en-IN')}</span>
                {hasDiscount && (
                  <>
                    <span className="text-white/40 text-xl line-through">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="text-green-400 text-sm font-bold">Save ₹{(product.price - displayPrice).toLocaleString('en-IN')}</span>
                  </>
                )}
              </div>
              {product.stock > 0 ? (
                <span className="text-green-400 text-sm flex items-center gap-1"><Check size={14} /> In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-400 text-sm">Out of Stock</span>
              )}
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Material', value: product.material },
                { label: 'Finish', value: product.finish },
                { label: 'Warranty', value: product.warranty },
              ].filter(s => s.value).map(spec => (
                <div key={spec.label} className="glass rounded-xl p-3 text-center">
                  <div className="text-white/40 text-xs mb-1">{spec.label}</div>
                  <div className="text-white text-sm font-semibold">{spec.value}</div>
                </div>
              ))}
            </div>

            {/* Quantity + Actions */}
            {product.stock > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-white/50 text-sm">Quantity:</span>
                  <div className="flex items-center gap-1 glass rounded-xl px-1">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-white font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`btn-primary flex-1 ${added ? 'bg-green-600' : ''}`}
                  >
                    {added ? <><Check size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className={`w-12 h-12 rounded-xl glass flex items-center justify-center border transition-all ${wishlisted ? 'text-red-400 border-red-400/30 bg-red-400/10' : 'text-white/60 border-white/10 hover:text-red-400'}`}
                  >
                    <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <button onClick={handleBuyNow} className="btn-secondary w-full">
                  Buy Now
                </button>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Shield size={16} />, text: `${product.warranty || '1 Year'} Warranty` },
                { icon: <Truck size={16} />, text: 'Free Shipping ₹1999+' },
                { icon: <RotateCcw size={16} />, text: '7-Day Returns' },
                { icon: <Package size={16} />, text: 'SKU: ' + product.sku },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-white/40 text-sm">
                  <span className="text-[#8b5e34]">{badge.icon}</span>
                  {badge.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Description, Specs, Reviews */}
        <div className="mb-16">
          <div className="flex gap-1 mb-8 border-b border-white/8">
            {(['description', 'specs', 'reviews'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-[#8b5e34] text-white'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                {tab === 'reviews' ? `Reviews (${product.numReviews})` : tab}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="max-w-3xl">
              <p className="text-white/70 leading-relaxed text-base">{product.description}</p>
              {product.dimensions && Object.values(product.dimensions).some(Boolean) && (
                <div className="mt-8">
                  <h3 className="text-white font-bold text-lg mb-4">Dimensions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(product.dimensions).filter(([, v]) => v).map(([k, v]) => (
                      <div key={k} className="glass rounded-xl p-4 text-center">
                        <div className="text-white/40 text-xs capitalize mb-1">{k}</div>
                        <div className="text-white font-semibold">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              {product.specifications && product.specifications.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="flex py-4">
                      <span className="text-white/50 w-48 flex-shrink-0 text-sm">{spec.key}</span>
                      <span className="text-white text-sm font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/40">No specifications available.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-3xl space-y-8">
              {/* Review Summary */}
              {product.numReviews > 0 && (
                <div className="glass rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-center">
                  <div className="text-center">
                    <div className="text-6xl font-black text-white">{product.ratings.toFixed(1)}</div>
                    <StarRating rating={product.ratings} size={20} />
                    <div className="text-white/40 text-sm mt-1">{product.numReviews} reviews</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = product.reviews.filter(r => Math.round(r.rating) === star).length;
                      const pct = product.numReviews ? (count / product.numReviews) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-3 text-sm">
                          <span className="text-white/40 w-4">{star}</span>
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-white/40 w-6 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {product.reviews.slice().reverse().map(review => (
                  <div key={review._id} className="glass rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5e34] to-[#5c3a21] flex items-center justify-center text-white font-bold flex-shrink-0">
                        {review.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold text-sm">{review.name}</span>
                          {review.verified && <span className="text-green-400 text-xs border border-green-400/30 px-1.5 py-0.5 rounded">Verified</span>}
                          <span className="text-white/30 text-xs ml-auto">{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        <StarRating rating={review.rating} size={13} />
                        {review.title && <p className="text-white font-semibold mt-2 text-sm">{review.title}</p>}
                        <p className="text-white/60 mt-2 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Write Review */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-5">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Your Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: s }))}
                          className="transition-transform hover:scale-110"
                        >
                          <Star size={28} className={s <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Review title (optional)"
                    value={reviewForm.title}
                    onChange={e => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                    className="input-dark"
                  />
                  <textarea
                    placeholder="Write your review..."
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    className="input-dark min-h-24 resize-y"
                    required
                  />
                  <button type="submit" disabled={submittingReview} className="btn-primary">
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => (
                <div key={p._id} className="card-product group">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={p.images?.[0]?.url || `https://picsum.photos/seed/${p._id}/400/400`}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="25vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[#8b5e34] text-xs font-semibold mb-1">{p.categoryName}</p>
                    <Link href={`/products/${p.slug}`}>
                      <h3 className="text-white text-sm font-semibold line-clamp-2 hover:text-[#8b5e34] transition-colors">{p.name}</h3>
                    </Link>
                    <div className="mt-2 font-bold text-white">₹{(p.discountPrice || p.price).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl glass-dark border border-white/10 text-white text-sm font-medium shadow-2xl">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
