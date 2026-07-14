'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Truck, MapPin, Check, ChevronRight, Shield } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://measure-worship-fiber-mean.trycloudflare.com/api';
const SHIPPING_THRESHOLD = 1999;
const SHIPPING_COST = 299;
const TAX_RATE = 0.18;

interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  stock: number;
}

interface Address {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

const INDIA_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra',
  'Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
];

export default function CheckoutPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#0c0a09] flex items-center justify-center"><div className="w-10 h-10 border-2 border-[#8b5e34]/30 border-t-[#8b5e34] rounded-full animate-spin" /></div>}>
      <CheckoutContent />
    </React.Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [items, setItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<Address>({
    name: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay' | 'upi' | 'cod'>('stripe');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const couponCode = searchParams.get('coupon') || '';
  const couponDiscount = parseFloat(searchParams.get('couponDiscount') || '0');

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('bathcrest_cart') || '{"items":[]}');
    setItems(cart.items || []);

    // Pre-fill address from saved user
    try {
      const user = JSON.parse(localStorage.getItem('bathcrest_user') || '{}');
      if (user.name) setAddress(prev => ({ ...prev, name: user.name, phone: user.phone || '' }));
    } catch {}
  }, []);

  const subtotal = items.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax - couponDiscount;

  const validateAddress = () => {
    const required = ['name', 'phone', 'addressLine1', 'city', 'state', 'pincode'] as const;
    return required.every(f => address[f]?.trim());
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) { setError('Please fill all required shipping fields'); return; }
    const token = localStorage.getItem('bathcrest_token');
    if (!token) { router.push('/account/login?redirect=/checkout'); return; }

    setPlacing(true);
    setError('');
    try {
      const orderItems = items.map(item => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.discountPrice || item.price,
        quantity: item.quantity,
      }));

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: address,
          paymentMethod,
          itemsTotal: subtotal,
          shippingPrice: shipping,
          taxPrice: tax,
          discountAmount: couponDiscount,
          totalPrice: total,
          coupon: couponCode || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const orderId = data.order._id;

      // Simulate payment for stripe/razorpay/upi; COD is instant
      if (paymentMethod !== 'cod') {
        await fetch(`${API_URL}/payments/simulate-success`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ orderId, paymentMethod }),
        });
      } else {
        await fetch(`${API_URL}/orders/${orderId}/pay`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ paymentResult: { id: 'COD-' + Date.now(), status: 'pending' } }),
        });
      }

      // Clear cart
      localStorage.setItem('bathcrest_cart', JSON.stringify({ items: [] }));
      router.push(`/order-success?orderId=${data.order.orderId}&total=${total}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Order failed. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const steps = [
    { num: 1, label: 'Shipping' },
    { num: 2, label: 'Payment' },
    { num: 3, label: 'Review' },
  ];

  return (
    <div className="min-h-screen bg-[#0c0a09] py-10">
      <div className="section-container max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-white transition-colors">Cart</Link>
          <span>/</span>
          <span className="text-white">Checkout</span>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <React.Fragment key={s.num}>
              <div
                onClick={() => step > s.num && setStep(s.num as 1 | 2 | 3)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  step === s.num
                    ? 'bg-[#8b5e34] text-white'
                    : step > s.num
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-pointer'
                    : 'glass text-white/40'
                }`}
              >
                {step > s.num ? <Check size={14} /> : <span>{s.num}</span>}
                {s.label}
              </div>
              {i < steps.length - 1 && (
                <div className="h-px w-8 bg-white/10" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-2">
            {/* STEP 1: Shipping */}
            {step === 1 && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-3">
                  <MapPin size={22} className="text-[#8b5e34]" /> Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { field: 'name', label: 'Full Name', placeholder: 'John Doe', col: 1 },
                    { field: 'phone', label: 'Phone Number', placeholder: '+91 9876543210', col: 1 },
                    { field: 'addressLine1', label: 'Address Line 1', placeholder: 'House/Flat No., Street', col: 2 },
                    { field: 'addressLine2', label: 'Address Line 2 (Optional)', placeholder: 'Landmark, Area', col: 2 },
                    { field: 'city', label: 'City', placeholder: 'Mumbai', col: 1 },
                    { field: 'pincode', label: 'PIN Code', placeholder: '400001', col: 1 },
                  ].map(f => (
                    <div key={f.field} className={f.col === 2 ? 'md:col-span-2' : ''}>
                      <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">{f.label}</label>
                      <input
                        type="text"
                        placeholder={f.placeholder}
                        value={address[f.field as keyof Address] || ''}
                        onChange={e => setAddress(prev => ({ ...prev, [f.field]: e.target.value }))}
                        className="input-dark"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">State</label>
                    <select
                      value={address.state}
                      onChange={e => setAddress(prev => ({ ...prev, state: e.target.value }))}
                      className="input-dark bg-[#111] appearance-none cursor-pointer"
                    >
                      <option value="">Select State</option>
                      {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Country</label>
                    <input type="text" value="India" disabled className="input-dark opacity-50" />
                  </div>
                </div>
                <button
                  onClick={() => { if (validateAddress()) { setStep(2); setError(''); } else setError('Please fill all required fields'); }}
                  className="btn-primary mt-6 w-full"
                >
                  Continue to Payment <ChevronRight size={18} />
                </button>
                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
              </div>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-3">
                  <CreditCard size={22} className="text-[#8b5e34]" /> Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      id: 'stripe' as const,
                      label: 'Credit / Debit Card',
                      sublabel: 'Powered by Stripe (Test Mode)',
                      icon: '💳',
                      badge: 'Recommended'
                    },
                    {
                      id: 'razorpay' as const,
                      label: 'Razorpay',
                      sublabel: 'UPI, Cards, Net Banking, Wallets',
                      icon: '⚡',
                    },
                    {
                      id: 'upi' as const,
                      label: 'UPI Payment',
                      sublabel: 'Pay with Google Pay, PhonePe, Paytm',
                      icon: '📱',
                    },
                    {
                      id: 'cod' as const,
                      label: 'Cash on Delivery',
                      sublabel: 'Pay when your order arrives',
                      icon: '🏠',
                    },
                  ].map(method => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-[#8b5e34] bg-[#8b5e34]/8'
                          : 'border-white/8 hover:border-white/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        paymentMethod === method.id ? 'border-[#8b5e34]' : 'border-white/30'
                      }`}>
                        {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-[#8b5e34]" />}
                      </div>
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <div className="text-white font-semibold text-sm flex items-center gap-2">
                          {method.label}
                          {method.badge && (
                            <span className="text-xs bg-[#8b5e34]/20 text-[#8b5e34] px-2 py-0.5 rounded-full border border-[#8b5e34]/30">
                              {method.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-white/40 text-xs">{method.sublabel}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'stripe' && (
                  <div className="mt-4 glass rounded-xl p-4 border border-[#8b5e34]/20">
                    <p className="text-white/50 text-sm mb-3">Test Card Details:</p>
                    <div className="space-y-2 font-mono text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/40">Card Number</span>
                        <span className="text-white">4242 4242 4242 4242</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Expiry</span>
                        <span className="text-white">12/26</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">CVC</span>
                        <span className="text-white">123</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                    ← Back
                  </button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-1">
                    Review Order <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review */}
            {step === 3 && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-3">
                  <Truck size={22} className="text-[#8b5e34]" /> Review & Place Order
                </h2>

                {/* Shipping Summary */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider">Delivering to</h3>
                    <button onClick={() => setStep(1)} className="text-[#8b5e34] text-xs hover:underline">Change</button>
                  </div>
                  <div className="glass rounded-xl p-4 text-sm text-white/70">
                    <p className="font-semibold text-white">{address.name} · {address.phone}</p>
                    <p>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}</p>
                    <p>{address.city}, {address.state} — {address.pincode}</p>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider">Payment via</h3>
                    <button onClick={() => setStep(2)} className="text-[#8b5e34] text-xs hover:underline">Change</button>
                  </div>
                  <div className="glass rounded-xl p-4 text-sm">
                    <span className="text-white font-semibold capitalize">
                      {paymentMethod === 'cod' ? 'Cash on Delivery' :
                       paymentMethod === 'stripe' ? 'Credit / Debit Card (Stripe)' :
                       paymentMethod === 'razorpay' ? 'Razorpay' : 'UPI Payment'}
                    </span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="mb-6">
                  <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-3">Items ({items.length})</h3>
                  <div className="space-y-2">
                    {items.map(item => (
                      <div key={item.product} className="flex justify-between text-sm">
                        <span className="text-white/70 line-clamp-1 flex-1 pr-4">{item.name} × {item.quantity}</span>
                        <span className="text-white font-medium">₹{((item.discountPrice || item.price) * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm mb-4">{error}</div>}

                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="btn-primary w-full text-lg py-4"
                >
                  {placing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <>Place Order · ₹{total.toLocaleString('en-IN')}</>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-white/30 text-xs">
                  <Shield size={12} />
                  <span>256-bit SSL encrypted · Secure checkout</span>
                </div>

                <button onClick={() => setStep(2)} className="btn-ghost w-full mt-3 text-sm justify-center">
                  ← Back to Payment
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="glass rounded-2xl p-5 sticky top-24">
              <h3 className="text-white font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm mb-4">
                {items.map(item => (
                  <div key={item.product} className="flex justify-between text-white/60">
                    <span className="truncate flex-1 pr-2">{item.name.slice(0, 30)}... ×{item.quantity}</span>
                    <span className="flex-shrink-0">₹{((item.discountPrice || item.price) * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="divider mb-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/60"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-white/60"><span>Shipping</span>{shipping === 0 ? <span className="text-green-400">FREE</span> : <span>₹{shipping}</span>}</div>
                <div className="flex justify-between text-white/60"><span>GST (18%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
                {couponDiscount > 0 && <div className="flex justify-between text-green-400"><span>Coupon</span><span>-₹{couponDiscount.toLocaleString('en-IN')}</span></div>}
                <div className="divider" />
                <div className="flex justify-between text-white font-bold text-base"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
