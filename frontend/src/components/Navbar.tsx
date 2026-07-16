'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingCart, Heart, Search, Menu, X, User, ChevronDown, ChevronRight,
  LogOut, Package, MapPin, Shield, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

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

const SPRING = { type: 'spring', stiffness: 380, damping: 30 };
const EASE_OUT = { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] };

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<NavUser | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [activeLink, setActiveLink] = useState('');
  const lastScrollY = useRef(0);

  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Smart hide-on-scroll
  useMotionValueEvent(scrollY, 'change', (y) => {
    const delta = y - lastScrollY.current;
    setScrolled(y > 40);
    if (y > 120 && delta > 8) setHidden(true);
    else if (delta < -8) setHidden(false);
    lastScrollY.current = y;
  });

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  useEffect(() => {
    try {
      const token = localStorage.getItem('bathcrest_token');
      const userData = localStorage.getItem('bathcrest_user');
      if (token && userData) setUser(JSON.parse(userData));
    } catch {}
  }, [pathname]);

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('bathcrest_cart') || '{"items":[]}');
      setCartCount(cart.items?.length || 0);
    } catch {}
  }, [pathname]);

  useEffect(() => {
    try {
      const wl = JSON.parse(localStorage.getItem('bathcrest_wishlist') || '[]');
      setWishlistCount(Array.isArray(wl) ? wl.length : 0);
    } catch {}
  }, [pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when mobile menu or search is open
  useEffect(() => {
    document.body.style.overflow = (mobileOpen || searchOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, searchOpen]);

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

  const profileItems = [
    { icon: <User size={15} />, label: 'My Profile', href: '/account/profile' },
    { icon: <Package size={15} />, label: 'My Orders', href: '/account/orders' },
    { icon: <Heart size={15} />, label: 'Wishlist', href: '/account/wishlist' },
    { icon: <MapPin size={15} />, label: 'Addresses', href: '/account/addresses' },
    ...(user?.role === 'admin' ? [{ icon: <Shield size={15} />, label: 'Admin Panel', href: '/admin' }] : []),
  ];

  return (
    <>
      {/* ── Main Nav ───────────────────────────────────── */}
      <motion.nav
        initial={false}
        animate={{
          y: hidden ? -110 : 0,
          opacity: hidden ? 0 : 1,
        }}
        transition={SPRING}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ height: '72px' }}
      >
        {/* Background layer — morphs from transparent → frosted glass */}
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundColor: scrolled ? 'rgba(10, 8, 7, 0.88)' : 'rgba(10, 8, 7, 0)',
            backdropFilter: scrolled ? 'blur(28px) saturate(180%)' : 'blur(0px)',
            borderBottomColor: scrolled ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0)',
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ borderBottomWidth: 1, borderBottomStyle: 'solid' }}
        />

        <div className="section-container h-full flex items-center justify-between gap-4 relative">

          {/* ── Logo ───────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#a06832] via-[#8b5e34] to-[#5c3a21] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[#8b5e34]/30"
            >
              BC
            </motion.div>
            <span className="text-white font-bold text-xl tracking-tight">
              Bath<span className="text-gradient-blue">Crest</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ───────────────── */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = activeLink === link.href;
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.hasMega && setMegaMenuOpen(true)}
                  onMouseLeave={() => link.hasMega && setMegaMenuOpen(false)}
                  ref={link.hasMega ? megaRef : undefined}
                >
                  <Link
                    href={link.href}
                    className={`relative flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-white/55 hover:text-white'
                    }`}
                  >
                    {/* Animated pill background */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl bg-white/10"
                        transition={SPRING}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                    {link.hasMega && (
                      <motion.span
                        className="relative z-10"
                        animate={{ rotate: megaMenuOpen ? 180 : 0 }}
                        transition={EASE_OUT}
                      >
                        <ChevronDown size={13} />
                      </motion.span>
                    )}
                  </Link>

                  {/* ── Mega Menu ──────────────────── */}
                  <AnimatePresence>
                    {link.hasMega && megaMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 14, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 14, scale: 0.97 }}
                        transition={EASE_OUT}
                        className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-[680px] rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)] border border-white/[0.08]"
                        style={{ background: 'rgba(13,11,10,0.97)', backdropFilter: 'blur(32px)' }}
                      >
                        {/* Header */}
                        <div className="px-7 pt-6 pb-4 border-b border-white/[0.07] flex items-center justify-between">
                          <div>
                            <p className="text-[11px] font-semibold text-[#8b5e34] uppercase tracking-widest mb-0.5">Explore</p>
                            <h3 className="text-white font-bold text-lg tracking-tight">All Categories</h3>
                          </div>
                          <Link
                            href="/products"
                            className="flex items-center gap-1.5 text-[#8b5e34] hover:text-[#d4b895] text-sm font-semibold transition-colors group"
                          >
                            View Full Collection
                            <motion.span whileHover={{ x: 3 }} transition={SPRING}>
                              <ArrowRight size={14} />
                            </motion.span>
                          </Link>
                        </div>

                        {/* Grid */}
                        <div className="p-5 grid grid-cols-4 gap-1">
                          {CATEGORIES_NAV.flat().map((cat, i) => (
                            <motion.div
                              key={cat}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.018, ...EASE_OUT }}
                            >
                              <Link
                                href={`/products?category=${encodeURIComponent(cat)}`}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.06] text-[13px] transition-all group"
                              >
                                <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[#8b5e34] group-hover:scale-125 transition-all" />
                                {cat}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* ── Right Actions ──────────────────── */}
          <div className="flex items-center gap-1">

            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              transition={SPRING}
              onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 80); }}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/[0.07] transition-colors"
              aria-label="Search"
            >
              <Search size={17} />
            </motion.button>

            {/* Wishlist */}
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} transition={SPRING}>
              <Link
                href="/account/wishlist"
                className="relative w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/[0.07] transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={17} />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={SPRING}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#8b5e34] text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} transition={SPRING}>
              <Link
                href="/cart"
                className="relative w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/[0.07] transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart size={17} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={SPRING}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#8b5e34] text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>

            {/* ── User / Profile ──────────────── */}
            <div className="relative hidden md:block ml-1" ref={profileRef}>
              {user ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={SPRING}
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-white/[0.09] bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white transition-all text-sm"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#a06832] to-[#5c3a21] flex items-center justify-center text-white text-[11px] font-bold">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="hidden lg:block max-w-[80px] truncate text-[13px] font-medium">
                      {user.name.split(' ')[0]}
                    </span>
                    <motion.span
                      animate={{ rotate: profileOpen ? 180 : 0 }}
                      transition={EASE_OUT}
                    >
                      <ChevronDown size={12} className="text-white/40" />
                    </motion.span>
                  </motion.button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.96 }}
                        transition={EASE_OUT}
                        className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.6)] border border-white/[0.08]"
                        style={{ background: 'rgba(13,11,10,0.97)', backdropFilter: 'blur(32px)' }}
                      >
                        {/* User info */}
                        <div className="px-4 py-3.5 border-b border-white/[0.07]">
                          <div className="font-semibold text-white text-sm truncate">{user.name}</div>
                          <div className="text-white/35 text-xs truncate mt-0.5">{user.email}</div>
                        </div>

                        <div className="py-1.5">
                          {profileItems.map((item, i) => (
                            <motion.div
                              key={item.href}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04, ...EASE_OUT }}
                            >
                              <Link
                                href={item.href}
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/[0.05] text-[13px] transition-all"
                              >
                                <span className="text-white/30">{item.icon}</span>
                                {item.label}
                              </Link>
                            </motion.div>
                          ))}
                        </div>

                        <div className="border-t border-white/[0.07] py-1.5">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.07] text-[13px] transition-all"
                          >
                            <LogOut size={14} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={SPRING}>
                  <Link href="/account/login" className="btn-primary py-2 px-5 text-sm">
                    Sign In
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile hamburger */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              transition={SPRING}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/[0.07] transition-colors ml-1"
              aria-label="Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? 'x' : 'menu'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ── Search Overlay ─────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[22vh] px-4"
            style={{ background: 'rgba(10,8,7,0.9)', backdropFilter: 'blur(32px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, y: -24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.97 }}
              transition={EASE_OUT}
              className="w-full max-w-2xl"
            >
              {/* Search bar */}
              <form onSubmit={handleSearch} className="relative">
                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search faucets, showers, basins…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/[0.12] rounded-2xl text-white text-lg pl-14 pr-32 py-4.5 outline-none placeholder:text-white/25 focus:border-[#8b5e34]/60 focus:bg-[#8b5e34]/[0.04] transition-all"
                  style={{ padding: '18px 130px 18px 56px' }}
                  autoFocus
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <kbd className="hidden sm:flex items-center px-2 py-1 rounded-lg bg-white/[0.06] text-white/25 text-xs border border-white/[0.08]">
                    ↵ Enter
                  </kbd>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSearchOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.07] text-white/50 hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </motion.button>
                </div>
              </form>

              {/* Quick suggestions */}
              <div className="mt-5">
                <p className="text-[11px] text-white/25 uppercase tracking-widest mb-3 font-semibold">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Bathroom Faucets', 'Rain Showers', 'Matte Black', 'LED Mirror', 'Vanity Unit', 'Towel Holder'].map((q, i) => (
                    <motion.button
                      key={q}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, ...EASE_OUT }}
                      onClick={() => { router.push(`/products?search=${encodeURIComponent(q)}`); setSearchOpen(false); }}
                      className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.09] hover:border-white/[0.15] text-sm transition-all"
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Drawer ──────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ ...SPRING, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 lg:hidden overflow-y-auto"
              style={{ background: 'rgba(12,10,9,0.98)', backdropFilter: 'blur(40px)', borderLeft: '1px solid rgba(255,255,255,0.07)' }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.07]">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-[#a06832] to-[#5c3a21] flex items-center justify-center text-white font-black text-xs">
                    BC
                  </div>
                  <span className="text-white font-bold tracking-tight">BathCrest</span>
                </Link>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/[0.07] transition-colors"
                >
                  <X size={18} />
                </motion.button>
              </div>

              <div className="px-4 py-4">
                {/* Nav links */}
                <div className="space-y-0.5 mb-6">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, ...EASE_OUT }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                          pathname === link.href
                            ? 'text-white bg-white/[0.08]'
                            : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                        }`}
                      >
                        {link.label}
                        {pathname === link.href && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8b5e34]" />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="h-px bg-white/[0.07] mb-6" />

                {/* Category grid */}
                <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-3 px-1">Categories</p>
                <div className="grid grid-cols-2 gap-1.5 mb-6">
                  {CATEGORIES_NAV.flat().slice(0, 8).map((cat, i) => (
                    <motion.div
                      key={cat}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, ...EASE_OUT }}
                    >
                      <Link
                        href={`/products?category=${encodeURIComponent(cat)}`}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/50 hover:text-white hover:bg-white/[0.08] text-[13px] transition-all"
                      >
                        {cat}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="h-px bg-white/[0.07] mb-6" />

                {/* Account */}
                {user ? (
                  <div>
                    <div className="flex items-center gap-3 px-4 py-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#a06832] to-[#5c3a21] flex items-center justify-center text-white text-sm font-bold">
                        {user.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white text-sm font-semibold">{user.name}</div>
                        <div className="text-white/35 text-xs">{user.email}</div>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      {profileItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/[0.05] rounded-xl text-sm transition-all"
                        >
                          <span className="text-white/30">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.07] rounded-xl text-sm transition-all"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 px-1">
                    <Link
                      href="/account/login"
                      onClick={() => setMobileOpen(false)}
                      className="btn-primary w-full text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/account/signup"
                      onClick={() => setMobileOpen(false)}
                      className="btn-secondary w-full text-center"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
