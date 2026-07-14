'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight, X } from 'lucide-react';

interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  stock: number;
}

interface CouponData {
  code: string;
  discountType: string;
  discountValue: number;
}

const API_URL = 'https://bathcrest.onrender.com/api';
const SHIPPING_THRESHOLD = 1999;
const SHIPPING_COST = 299;
const TAX_RATE = 0.18;

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [toast, setToast] = useState('');

  const loadCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('bathcrest_cart') || '{"items":[]}');
      setItems(cart.items || []);
    } catch { setItems([]); }
  };

  useEffect(() => { loadCart(); }, []);

  const saveCart = (newItems: CartItem[]) => {
    localStorage.setItem('bathcrest_cart', JSON.stringify({ items: newItems }));
    setItems(newItems);
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const updateQty = (productId: string, delta: number) => {
    const newItems = items.map(item => {
      if (item.product !== productId) return item;
      const newQty = item.quantity + delta;
      return newQty < 1 ? null : { ...item, quantity: Math.min(newQty, item.stock) };
    }).filter(Boolean) as CartItem[];
    saveCart(newItems);
  };

  const removeItem = (productId: string) => {
    saveCart(items.filter(i => i.product !== productId));
    showToast('Item removed from cart');
  };

  const subtotal = items.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax - couponDiscount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    const token = localStorage.getItem('bathcrest_token');
    if (!token) { setCouponError('Please sign in to apply coupons'); setCouponLoading(false); return; }
    try {
      const res = await fetch(`${API_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: couponCode.trim().toUpperCase(), orderTotal: subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponDiscount(data.discount);
        showToast(`Coupon applied! Saved ₹${data.discount}`);
      } else {
        setCouponError(data.message);
      }
    } catch { setCouponError('Failed to validate coupon'); }
    finally { setCouponLoading(false); }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
    setCouponError('');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={80} className="text-white/10 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-3">Your cart is empty</h2>
          <p className="text-white/40 mb-8">Add some premium products to get started</p>
          <Link href="/products" className="btn-primary text-lg px-10 py-4">
            Shop Now <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0a09] py-10">
      <div className="section-container">
        <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Cart</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart ({items.length} item{items.length !== 1 ? 's' : ''})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.product} className="card-product flex gap-4 p-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#111]">
                  <Image
                    src={item.image || `https://picsum.photos/seed/${item.product}/200/200`}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm leading-snug mb-1 line-clamp-2">{item.name}</h3>
                  <div className="text-white/40 text-xs mb-3">
                    {item.stock > 0 ? `In Stock (${item.stock})` : 'Out of Stock'}
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-1 glass rounded-lg px-1">
                      <button onClick={() => updateQty(item.product, -1)} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-white text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQty(item.product, 1)} disabled={item.quantity >= item.stock} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors disabled:opacity-30">
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold">
                        ₹{((item.discountPrice || item.price) * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.discountPrice && item.discountPrice < item.price && (
                        <span className="text-white/30 text-xs line-through">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      )}
                      <button onClick={() => removeItem(item.product)} className="text-white/30 hover:text-red-400 transition-colors ml-1">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Tag size={16} className="text-[#8b5e34]" /> Apply Coupon
              </h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                  <div>
                    <span className="text-green-400 font-bold text-sm">{appliedCoupon.code}</span>
                    <p className="text-green-400/70 text-xs">-₹{couponDiscount.toLocaleString('en-IN')} saved</p>
                  </div>
                  <button onClick={removeCoupon} className="text-white/40 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      className="input-dark flex-1 text-sm py-2.5"
                      onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="btn-primary px-4 py-2 text-sm"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-red-400 text-xs mt-2">{couponError}</p>}
                  <p className="text-white/30 text-xs mt-2">Try: WELCOME10, BATH20, FLAT500</p>
                </>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-5">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  {shipping === 0
                    ? <span className="text-green-400">FREE</span>
                    : <span>₹{shipping}</span>
                  }
                </div>
                {shipping > 0 && (
                  <div className="text-white/30 text-xs -mt-1">
                    Add ₹{(SHIPPING_THRESHOLD - subtotal).toLocaleString('en-IN')} more for free shipping
                  </div>
                )}
                <div className="flex justify-between text-white/60">
                  <span>GST (18%)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="divider my-3" />
                <div className="flex justify-between text-white text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Link
                href={`/checkout?coupon=${appliedCoupon?.code || ''}&couponDiscount=${couponDiscount}`}
                className="btn-primary w-full mt-5 text-center justify-center"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              <div className="flex items-center justify-center gap-6 mt-4 text-white/30 text-xs">
                <span>🔒 Secure Checkout</span>
                <span>💳 Multiple Payment Options</span>
              </div>
            </div>

            <Link href="/products" className="btn-ghost w-full justify-center text-sm">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl glass-dark border border-white/10 text-white text-sm font-medium shadow-2xl">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
