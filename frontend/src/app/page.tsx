'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Star, Shield, Truck, Award, Phone, Mail, ArrowRight, Zap, CheckCircle } from 'lucide-react';

// =============================================
// HERO SECTION
// =============================================

function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 200,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 150,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-[#0c0a09] py-16 md:py-24"
      style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(139,94,52,0.12) 0%, #0c0a09 70%)' }}
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full opacity-20 blur-3xl"
          style={{
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(139,94,52,0.6) 0%, transparent 70%)',
            top: '10%', left: '10%',
            transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)`,
            transition: 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        />
        <div
          className="absolute rounded-full opacity-15 blur-3xl"
          style={{
            width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(212,184,149,0.5) 0%, transparent 70%)',
            bottom: '20%', right: '15%',
            transform: `translate(${-mousePos.x * 0.5}px, ${-mousePos.y * 0.5}px)`,
            transition: 'transform 6s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        />
        <div
          className="absolute rounded-full opacity-10 blur-2xl"
          style={{
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(139,94,52,0.4) 0%, transparent 70%)',
            top: '50%', right: '20%',
            transform: `translate(${mousePos.x * 1.2}px, ${mousePos.y * 1.2}px)`,
            transition: 'transform 5s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        />

        {/* Floating Particles */}
        {mounted && Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-40"
            style={{
              width: `${(i * 3.7) % 4 + 2}px`,
              height: `${(i * 3.7) % 4 + 2}px`,
              background: i % 3 === 0 ? '#8b5e34' : i % 3 === 1 ? '#d4b895' : '#ffffff',
              left: `${(i * 13.1) % 100}%`,
              top: `${(i * 29.3) % 100}%`,
              animation: `float ${15 + (i * 2.1) % 10}s ease-in-out ${(i * 1.5) % 5}s infinite`,
              transform: `translate(${mousePos.x * (i % 5 + 1) * 0.5}px, ${mousePos.y * (i % 5 + 1) * 0.5}px)`,
              transition: 'transform 8s cubic-bezier(0.1, 0.9, 0.2, 1)',
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(139,94,52,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,94,52,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Chrome Spheres */}
        {[
          { size: 80, top: '15%', left: '5%', delay: '0s' },
          { size: 50, top: '70%', left: '3%', delay: '1s' },
          { size: 60, top: '30%', right: '5%', left: 'auto', delay: '2s' },
          { size: 40, bottom: '20%', right: '8%', left: 'auto', delay: '0.5s' },
          { size: 30, top: '80%', left: '20%', delay: '1.5s' },
        ].map((sphere, i) => (
            <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: sphere.size,
              height: sphere.size,
              background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9) 0%, rgba(212,184,149,0.6) 30%, rgba(100,100,100,0.4) 60%, rgba(50,50,50,0.8) 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.5)',
              top: sphere.top,
              left: sphere.left,
              right: sphere.right,
              bottom: sphere.bottom,
              animationDelay: sphere.delay,
              opacity: 0.7,
              transform: `translate(${mousePos.x * (i + 0.5) * 0.3}px, ${mousePos.y * (i + 0.5) * 0.3}px)`,
              transition: 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="section-container relative z-10 text-center w-full">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm font-medium text-[#d4b895]">
          <div className="w-2 h-2 rounded-full bg-[#8b5e34] animate-pulse" />
          Premium Bathroom Hardware since 2010
        </div>

        {/* Main Heading */}
        <h1 className="text-gradient section-heading mb-8" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1.25 }}>
          Premium Bathroom<br />
          <span className="text-gradient-blue">Hardware &amp; Sanitary</span><br />
          Solutions
        </h1>

        {/* Subtitle */}
        <p className="section-subheading mb-40">
          Elevate your space with BathCrest's luxury collection of faucets, rain showers, basins, and sanitaryware — where elegance meets engineering.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Link href="/products" className="btn-primary text-lg px-10 py-4">
            Shop Now
            <ArrowRight size={20} />
          </Link>
          <Link href="/products?isFeatured=true" className="btn-secondary text-lg px-10 py-4">
            Explore Collection
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-16">
          {[
            { value: '50+', label: 'Products' },
            { value: '18', label: 'Categories' },
            { value: '5000+', label: 'Happy Customers' },
            { value: '5 Yrs', label: 'Avg Warranty' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-gradient-blue mb-1">{stat.value}</div>
              <div className="text-sm text-white/50">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-2 text-white/30 text-xs mt-8">
          <span>Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}

// =============================================
// CATEGORIES SECTION
// =============================================

const CATEGORIES = [
  { name: 'Bathroom Faucets', icon: '🚿', slug: 'bathroom-faucets', count: '12+ Products' },
  { name: 'Rain Showers', icon: '🌧️', slug: 'rain-showers', count: '8+ Products' },
  { name: 'Wash Basins', icon: '🪣', slug: 'wash-basins', count: '6+ Products' },
  { name: 'Vanity Units', icon: '🛁', slug: 'vanity-units', count: '4+ Products' },
  { name: 'Mirror Cabinets', icon: '🪞', slug: 'mirror-cabinets', count: '5+ Products' },
  { name: 'Shower Panels', icon: '🚿', slug: 'shower-panels', count: '4+ Products' },
  { name: 'Towel Holders', icon: '🛁', slug: 'towel-holders', count: '5+ Products' },
  { name: 'Kitchen Faucets', icon: '🍳', slug: 'kitchen-faucets', count: '5+ Products' },
  { name: 'Toilet Seats', icon: '🚽', slug: 'toilet-seats', count: '3+ Products' },
];

function CategoriesSection() {
  return (
    <section className="section-py bg-[#0c0a09]">
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="text-label mb-4">Explore</div>
          <h2 className="section-heading text-gradient mb-6">Shop by Category</h2>
          <p className="section-subheading">
            Discover our curated collections of premium bathroom and kitchen hardware
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.name}`}
              className="card-product p-6 group cursor-pointer flex flex-col items-center text-center"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
              <h3 className="font-semibold text-white text-lg mb-1">{cat.name}</h3>
              <p className="text-white/40 text-sm">{cat.count}</p>
              <div className="flex items-center justify-center gap-1 mt-4 text-[#8b5e34] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Browse <ChevronRight size={14} />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products" className="btn-secondary">
            View All Categories
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// =============================================
// FEATURED PRODUCTS SECTION
// =============================================

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    discountPercentage?: number;
    images: { url: string; alt: string }[];
    ratings: number;
    numReviews: number;
    slug: string;
    categoryName: string;
  };
}

function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="card-product group">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.images?.[0]?.url || `https://picsum.photos/seed/${product._id}/400/400`}
          alt={product.images?.[0]?.alt || product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-[#8b5e34] text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discountPercentage}%
          </div>
        )}
        {product.ratings >= 4.5 && (
          <div className="absolute top-3 right-3 bg-amber-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">
            ⭐ Top Rated
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-[#8b5e34] text-xs font-semibold uppercase tracking-wider mb-1">{product.categoryName}</p>
        <h3 className="text-white font-semibold text-sm leading-tight mb-2 line-clamp-2">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={12}
                className={s <= Math.round(product.ratings) ? 'text-amber-400 fill-amber-400' : 'text-white/20'}
              />
            ))}
          </div>
          <span className="text-white/40 text-xs">({product.numReviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-white font-bold">₹{displayPrice.toLocaleString('en-IN')}</span>
          {hasDiscount && (
            <span className="text-white/40 text-xs line-through">₹{product.price.toLocaleString('en-IN')}</span>
          )}
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="btn-primary w-full mt-3 text-sm py-2.5"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

function FeaturedProducts() {
  const [products, setProducts] = useState<ProductCardProps['product'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${'https://bathcrest.onrender.com/api'}/products/featured`)
      .then(r => r.json())
      .then(d => { if (d.success) setProducts(d.products.slice(0, 8)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-py" style={{ background: 'linear-gradient(180deg, #0c0a09 0%, #110e0c 100%)' }}>
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="text-label mb-4">Curated</div>
          <h2 className="section-heading text-gradient mb-4">Featured Products</h2>
          <p className="section-subheading">
            Handpicked luxury products that define modern bathroom aesthetics
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card-product">
                  <div className="skeleton aspect-square" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-3 w-20 rounded" />
                    <div className="skeleton h-4 rounded" />
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-8 rounded mt-3" />
                  </div>
                </div>
              ))
            : products.map((product) => <ProductCard key={product._id} product={product} />)
          }
        </div>

        <div className="text-center mt-12">
          <Link href="/products" className="btn-primary text-lg px-10 py-4">
            Shop All Products
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// =============================================
// WHY BATHCREST
// =============================================

function WhyBathCrest() {
  const features = [
    { icon: <Shield size={32} />, title: 'Premium Quality', desc: 'Manufactured to the highest international standards with certified materials' },
    { icon: <Award size={32} />, title: 'Award-Winning Design', desc: 'Recognized for excellence in bathroom hardware design and innovation' },
    { icon: <Truck size={32} />, title: 'Fast Delivery', desc: 'Free shipping on orders above ₹1999. Delivered in 5–7 business days' },
    { icon: <CheckCircle size={32} />, title: 'Warranty Assurance', desc: 'Every product comes with a minimum 1-year manufacturer warranty' },
    { icon: <Zap size={32} />, title: 'Water Efficient', desc: 'Eco-certified products that reduce water consumption without sacrificing performance' },
    { icon: <Star size={32} />, title: '5-Star Reviews', desc: 'Trusted by 5,000+ happy customers across India with industry-leading satisfaction' },
  ];

  return (
    <section className="section-py bg-[#0c0a09]">
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="text-label mb-4">Excellence</div>
          <h2 className="section-heading text-gradient mb-4">Why Choose BathCrest</h2>
          <p className="section-subheading">
            15+ years of engineering excellence, delivering luxury bathroom experiences to homes across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-8 group hover:border-[#8b5e34]/30 hover:bg-white/[0.06] transition-all duration-300 flex flex-col items-center text-center">
              <div className="text-[#8b5e34] mb-5 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
              <h3 className="text-white font-bold text-xl mb-3">{f.title}</h3>
              <p className="text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================
// BEST SELLERS
// =============================================

function BestSellers() {
  const [products, setProducts] = useState<ProductCardProps['product'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${'https://bathcrest.onrender.com/api'}/products/bestsellers`)
      .then(r => r.json())
      .then(d => { if (d.success) setProducts(d.products.slice(0, 4)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-py" style={{ background: 'linear-gradient(180deg,#110e0c,#0c0a09)' }}>
      <div className="section-container">
        <div className="text-center mb-12">
          <div className="text-label mb-3">Trending</div>
          <h2 className="section-heading text-gradient">Best Sellers</h2>
          <div className="mt-4">
            <Link href="/products?isBestSeller=true" className="btn-ghost">
              View All <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card-product">
                  <div className="skeleton aspect-square" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-4 rounded" />
                    <div className="skeleton h-8 rounded mt-3" />
                  </div>
                </div>
              ))
            : products.map((p) => <ProductCard key={p._id} product={p} />)
          }
        </div>
      </div>
    </section>
  );
}

// =============================================
// PROMO BANNER
// =============================================

function PromoBanner() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #2d1b11 0%, #3e2723 50%, #2d1b11 100%)' }}
      />
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139,94,52,0.8) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(212,184,149,0.4) 0%, transparent 50%)`,
        }}
      />

      <div className="section-container relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="text-[#8b5e34] font-semibold text-sm uppercase tracking-widest mb-3">Limited Time Offer</div>
            <h2 className="text-white font-black text-4xl md:text-5xl leading-tight mb-4">
              Up to <span className="text-gradient-blue">20% Off</span><br />
              Premium Showers
            </h2>
            <p className="text-white/60 text-lg max-w-md">
              Use code <span className="text-[#8b5e34] font-bold">BATH20</span> at checkout. Valid on all shower panels and rain shower systems.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="/products?category=Rain+Showers" className="btn-primary text-lg px-10 py-4">
              Shop Showers <ArrowRight size={20} />
            </Link>
            <p className="text-white/40 text-sm text-center">Free shipping on orders ₹1999+</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================
// TESTIMONIALS
// =============================================

const TESTIMONIALS = [
  { name: 'Arjun Sharma', city: 'Delhi', rating: 5, text: 'The Cascada Chrome Faucet is absolutely stunning. The quality is exceptional and the finish is perfect. BathCrest has transformed my bathroom completely.', product: 'Cascada Chrome Faucet' },
  { name: 'Priya Patel', city: 'Mumbai', rating: 5, text: 'Installed the CloudBurst Rain Shower last month. Best decision ever! The water pressure and spread is incredible. Feels like a 5-star hotel every morning.', product: 'CloudBurst Rain Shower' },
  { name: 'Rahul Gupta', city: 'Bangalore', rating: 5, text: 'Ordered 3 items for my bathroom renovation. All arrived well-packaged, exactly as described. The BidetSeat Pro is life-changing. Will definitely buy more!', product: 'BidetSeat Pro' },
  { name: 'Anita Reddy', city: 'Hyderabad', rating: 5, text: 'BathCrest quality is unmatched in India. The LuminaLED Mirror Cabinet is gorgeous. Customer support was also excellent when I had installation questions.', product: 'LuminaLED Mirror Cabinet' },
];

function Testimonials() {
  return (
    <section className="section-py bg-[#0c0a09]">
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="text-label mb-4">Customer Love</div>
          <h2 className="section-heading text-gradient mb-4">What Our Customers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-8">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} className={`${s <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
                ))}
              </div>
              <p className="text-white/70 leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5e34] to-[#5c3a21] flex items-center justify-center text-white font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-white/40 text-xs">{t.city} · Purchased: {t.product}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================
// NEWSLETTER
// =============================================

function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0a, #111)' }}>
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-label mb-4">Stay Updated</div>
          <h2 className="section-heading text-gradient mb-4">Join the BathCrest Family</h2>
          <p className="section-subheading mb-8">
            Get exclusive deals, new product launches, and interior inspiration delivered to your inbox
          </p>

          {submitted ? (
            <div className="glass rounded-2xl p-6 text-center">
              <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
              <p className="text-white font-semibold">You&apos;re subscribed! 🎉</p>
              <p className="text-white/50 text-sm mt-1">Check your inbox for a welcome gift.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-dark flex-1"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          )}

          <p className="text-white/30 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}

// =============================================
// CONTACT STRIP
// =============================================

function ContactStrip() {
  return (
    <section className="py-8 border-y border-white/5">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <a href="tel:7838382868" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
            <div className="w-10 h-10 rounded-full bg-[#8b5e34]/10 flex items-center justify-center text-[#8b5e34] group-hover:bg-[#8b5e34]/20 transition-colors">
              <Phone size={18} />
            </div>
            <div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Call Us</div>
              <div className="font-semibold">+91 7838382868</div>
            </div>
          </a>
          <div className="h-12 w-px bg-white/10 hidden md:block" />
          <a href="mailto:shouryagarg1808@gmail.com" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
            <div className="w-10 h-10 rounded-full bg-[#8b5e34]/10 flex items-center justify-center text-[#8b5e34] group-hover:bg-[#8b5e34]/20 transition-colors">
              <Mail size={18} />
            </div>
            <div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Email Us</div>
              <div className="font-semibold">shouryagarg1808@gmail.com</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

// =============================================
// MAIN PAGE
// =============================================

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ContactStrip />
      <CategoriesSection />
      <FeaturedProducts />
      <WhyBathCrest />
      <BestSellers />
      <PromoBanner />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
