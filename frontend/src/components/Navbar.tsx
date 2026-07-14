'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingCart, Heart, Search, Menu, X, User, ChevronDown, ChevronRight,
  LogOut, Package, MapPin, Settings, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavUser {
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

const CATEGORIES_NAV = [
  ['Bathroom Faucets', 'Rain Showers', 'Health Faucets', 'Wash Basins'],
  ['Kitchen Faucets', 'Soap Dispensers', 'Mirror Cabinets', 'Shower Panels'],
  ['Towel Holders', 'Toilet Seats', 'Flush Systems', 'Vanity Units'],
  ['PVC Accessories', 'Angle Valves', 'Bathroom Mirrors', 'Accessories'],
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<NavUser | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Load user from localStorage
    try {
      const token = localStorage.getItem('bathcrest_token');
      const userData = localStorage.getItem('bathcrest_user');
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch {}
  }, [pathname]);

  useEffect(() => {
    // Load cart count
    try {
      const cart = JSON.parse(localStorage.getItem('bathcrest_cart') || '{"items":[]}');
      setCartCount(cart.items?.length || 0);
    } catch {}
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('bathcrest_token');
    localStorage.removeItem('bathcrest_user');
    setUser(null);
    setProfileOpen(false);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products', hasMega: true },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0c0a09]/98 backdrop-blur-xl border-b border-white/8 shadow-2xl'
            : 'bg-[#0c0a09]/90 backdrop-blur-xl border-b border-white/5'
        }`}
        style={{ height: '72px' }}
      >
        <div className="section-container h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8b5e34] to-[#5c3a21] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/30">
              BC
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Bath<span className="text-gradient-blue">Crest</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.hasMega && setMegaMenuOpen(true)}
                onMouseLeave={() => link.hasMega && setMegaMenuOpen(false)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? 'text-white bg-white/8'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {link.hasMega && (
                    <ChevronDown size={14} className={`transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
                  )}
                </Link>

                {/* Mega Menu */}
                <AnimatePresence>
                  {link.hasMega && megaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[650px] bg-[#0f0f0f] rounded-2xl p-6 shadow-2xl border border-white/10 z-50 overflow-hidden"
                    >
                      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/10">
                        <div className="text-white font-bold text-lg tracking-tight">Browse Categories</div>
                        <Link href="/products" className="ml-auto text-[#8b5e34] text-sm hover:text-white transition-colors flex items-center gap-1 font-medium">
                          View All Collection <ChevronRight size={14} />
                        </Link>
                      </div>
                      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                        {CATEGORIES_NAV.flat().map((cat) => (
                          <Link
                            key={cat}
                            href={`/products?category=${encodeURIComponent(cat)}`}
                            className="text-white/60 hover:text-[#8b5e34] hover:bg-white/5 text-sm px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 group"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#8b5e34] transition-colors" />
                            {cat}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => {
                document.documentElement.classList.toggle('light-theme');
              }}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/6 transition-all"
              aria-label="Toggle Theme"
            >
              {/* Moon/Sun Icon can be done with lucide-react if imported, or just a simple circle. Let's use a generic icon or text, actually we can just use SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></span>
            </button>

            {/* Search */}
            <button
              onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/6 transition-all"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/6 transition-all"
              aria-label="Wishlist"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8b5e34] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/6 transition-all"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8b5e34] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            <div className="relative hidden md:block">
              {user ? (
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg glass text-white/80 hover:text-white transition-all text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8b5e34] to-[#5c3a21] flex items-center justify-center text-white text-xs font-bold">
                    {user.name[0]}
                  </div>
                  <span className="hidden lg:block max-w-24 truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={12} />
                </button>
              ) : (
                <Link href="/account/login" className="btn-primary py-2 px-5 text-sm">
                  Sign In
                </Link>
              )}

              {/* Profile Dropdown */}
              {profileOpen && user && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl glass-dark border border-white/8 overflow-hidden shadow-2xl py-2">
                  <div className="px-4 py-3 border-b border-white/6">
                    <div className="font-semibold text-white text-sm truncate">{user.name}</div>
                    <div className="text-white/40 text-xs truncate">{user.email}</div>
                  </div>
                  {[
                    { icon: <User size={14} />, label: 'My Profile', href: '/account/profile' },
                    { icon: <Package size={14} />, label: 'My Orders', href: '/account/orders' },
                    { icon: <Heart size={14} />, label: 'Wishlist', href: '/account/wishlist' },
                    { icon: <MapPin size={14} />, label: 'Addresses', href: '/account/addresses' },
                    ...(user.role === 'admin' ? [{ icon: <Shield size={14} />, label: 'Admin Panel', href: '/admin' }] : []),
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 text-sm transition-all"
                    >
                      {item.icon} {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 text-sm transition-all border-t border-white/6 mt-1"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0c0a09]/95 backdrop-blur-xl flex items-start pt-24 px-4">
          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search faucets, showers, basins..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch(e as any);
                  }
                }}
                className="input-dark text-lg flex-1 py-4 px-6"
                autoFocus
              />
              <button type="submit" className="btn-primary">
                <Search size={20} />
              </button>
            </form>
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Bathroom Faucets', 'Rain Showers', 'Matte Black', 'LED Mirror', 'Vanity Unit'].map(q => (
                <button
                  key={q}
                  onClick={() => { setSearchQuery(q); router.push(`/products?search=${encodeURIComponent(q)}`); setSearchOpen(false); }}
                  className="px-4 py-2 glass rounded-full text-white/60 hover:text-white text-sm transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-[#0c0a09]/98 backdrop-blur-xl pt-20 px-6 overflow-y-auto">
          <div className="space-y-1 mb-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-xl text-lg font-medium transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="divider mb-8" />

          <div className="mb-8">
            <p className="text-white/30 text-xs uppercase tracking-widest mb-4">Categories</p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES_NAV.flat().slice(0, 8).map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 glass rounded-lg text-white/60 hover:text-white text-sm transition-all"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div className="divider mb-8" />

          {user ? (
            <div className="space-y-2">
              <Link href="/account/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white rounded-xl transition-all">
                <User size={18} /> My Profile
              </Link>
              <Link href="/account/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white rounded-xl transition-all">
                <Package size={18} /> My Orders
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[#8b5e34] hover:text-white rounded-xl transition-all">
                  <Shield size={18} /> Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 w-full text-left rounded-xl">
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link href="/account/login" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center">
                Sign In
              </Link>
              <Link href="/account/signup" onClick={() => setMobileOpen(false)} className="btn-secondary w-full text-center">
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
