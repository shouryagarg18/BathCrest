'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Award, Users, Globe, Zap, CheckCircle, Star, Truck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0c0a09]">
      {/* Hero */}
      <section className="section-py relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,94,52,0.15) 0%, #0c0a09 70%)' }}>
        <div className="section-container text-center">
          <div className="text-[#8b5e34] font-semibold text-sm uppercase tracking-widest mb-4">Our Story</div>
          <h1 className="section-heading text-gradient mb-6">Crafting Bathroom<br />Excellence Since 2010</h1>
          <p className="section-subheading max-w-2xl mx-auto mb-10">
            BathCrest was born from a simple conviction: that every Indian home deserves premium bathroom hardware without compromise. We set out to bring world-class design, engineering, and materials to bathrooms across the country.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: '14+', label: 'Years Experience' },
              { value: '5000+', label: 'Happy Customers' },
              { value: '50+', label: 'Premium Products' },
              { value: '18', label: 'Categories' },
            ].map(stat => (
              <div key={stat.label} className="glass rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-gradient-blue mb-1">{stat.value}</div>
                <div className="text-white/40 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-py">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass rounded-2xl p-8">
              <div className="text-[#8b5e34] mb-4"><Zap size={36} /></div>
              <h2 className="text-white font-bold text-2xl mb-4">Our Mission</h2>
              <p className="text-white/60 leading-relaxed">
                To democratize luxury bathroom hardware by offering international-grade products at accessible price points, backed by exceptional customer service and industry-leading warranties. We believe beautiful bathrooms inspire better living.
              </p>
            </div>
            <div className="glass rounded-2xl p-8">
              <div className="text-[#8b5e34] mb-4"><Globe size={36} /></div>
              <h2 className="text-white font-bold text-2xl mb-4">Our Vision</h2>
              <p className="text-white/60 leading-relaxed">
                To become India&apos;s most trusted premium bathroom hardware brand, known for innovative design, sustainable manufacturing, and products that stand the test of time — transforming bathrooms into personal sanctuaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing Quality */}
      <section className="section-py" style={{ background: 'linear-gradient(180deg, #110e0c, #0c0a09)' }}>
        <div className="section-container">
          <div className="text-center mb-16">
            <div className="text-[#8b5e34] font-semibold text-sm uppercase tracking-widest mb-4">Quality</div>
            <h2 className="section-heading text-gradient mb-4">Premium Manufacturing</h2>
            <p className="section-subheading max-w-xl mx-auto">Every BathCrest product undergoes rigorous quality control before reaching your home</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Shield size={32} />, title: 'Certified Materials', desc: 'We use only ISI-marked, lead-free brass, 304-grade stainless steel, and ceramic disc cartridges that meet international standards.' },
              { icon: <Award size={32} />, title: 'Rigorous Testing', desc: 'Every product undergoes 50,000+ operation cycle testing, pressure testing up to 10 bar, and salt spray corrosion testing before certification.' },
              { icon: <CheckCircle size={32} />, title: '5-Year Warranty', desc: 'Our confidence in our manufacturing quality is reflected in our industry-leading 5-year warranty on premium product lines.' },
            ].map(item => (
              <div key={item.title} className="glass rounded-2xl p-8 hover:border-[#8b5e34]/30 transition-all">
                <div className="text-[#8b5e34] mb-5">{item.icon}</div>
                <h3 className="text-white font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why BathCrest */}
      <section className="section-py">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="section-heading text-gradient mb-4">Why BathCrest?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: <Star size={20} />, title: '4.9/5 Average Rating', desc: 'Over 5,000 verified customer reviews across all platforms' },
              { icon: <Truck size={20} />, title: 'Pan-India Delivery', desc: 'Fast and reliable shipping to 500+ cities with real-time tracking' },
              { icon: <Users size={20} />, title: 'Expert Consultation', desc: 'Our design consultants help you choose the perfect products for your bathroom' },
              { icon: <Shield size={20} />, title: 'After-Sales Support', desc: '24/7 customer support and local service network for installation assistance' },
              { icon: <CheckCircle size={20} />, title: 'Genuine Products', desc: 'Every BathCrest product comes with a holographic authenticity seal' },
              { icon: <Globe size={20} />, title: 'Eco-Certified', desc: 'Water-efficient products certified by India Green Building Council' },
            ].map(item => (
              <div key={item.title} className="flex gap-4 glass rounded-2xl p-5 hover:border-[#8b5e34]/20 transition-all">
                <div className="text-[#8b5e34] mt-0.5 flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-white/50 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2d1b11, #3e2723)' }}>
        <div className="section-container text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to Transform Your Bathroom?</h2>
          <p className="text-center text-white/60 text-lg mb-8">Browse our premium collection and discover the BathCrest difference</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products" className="btn-primary text-lg px-10 py-4">Shop Now</Link>
            <Link href="/contact" className="btn-secondary text-lg px-10 py-4">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
