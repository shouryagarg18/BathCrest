'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#0c0a09] flex items-center justify-center"><div className="w-10 h-10 border-2 border-[#8b5e34]/30 border-t-[#8b5e34] rounded-full animate-spin" /></div>}>
      <OrderSuccessContent />
    </React.Suspense>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const total = searchParams.get('total');

  return (
    <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center py-16">
      <div className="text-center max-w-xl mx-auto px-6">
        {/* Animated Success Icon */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-green-500/10 flex items-center justify-center animate-pulse">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle size={56} className="text-green-400" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-black text-white mb-3">Order Placed! 🎉</h1>
        <p className="text-white/50 text-lg mb-8">
          Thank you for shopping with BathCrest. Your order has been confirmed and is being prepared.
        </p>

        {/* Order Details */}
        <div className="glass rounded-2xl p-6 mb-8 text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/50 text-sm">Order ID</span>
            <span className="text-white font-bold font-mono text-sm">{orderId}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/50 text-sm">Amount Paid</span>
            <span className="text-white font-bold">₹{parseFloat(total || '0').toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-sm">Estimated Delivery</span>
            <span className="text-white font-semibold">
              {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-10 text-sm">
          {[
            { icon: <CheckCircle size={20} />, label: 'Order Confirmed', done: true },
            { icon: <Package size={20} />, label: 'Processing', done: false },
            { icon: <Truck size={20} />, label: 'Shipping Soon', done: false },
          ].map((step, i) => (
            <React.Fragment key={step.label}>
              <div className={`flex flex-col items-center gap-1 ${step.done ? 'text-green-400' : 'text-white/30'}`}>
                {step.icon}
                <span className="text-xs">{step.label}</span>
              </div>
              {i < 2 && <div className="h-px w-8 bg-white/10" />}
            </React.Fragment>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account/orders" className="btn-primary">
            Track Order <ArrowRight size={16} />
          </Link>
          <Link href="/products" className="btn-secondary">
            Continue Shopping
          </Link>
        </div>

        <p className="text-white/30 text-sm mt-8">
          Order confirmation sent to your registered email.
          Need help? <a href="mailto:shouryagarg1808@gmail.com" className="text-[#8b5e34] hover:underline">Contact support</a>
        </p>
      </div>
    </div>
  );
}
