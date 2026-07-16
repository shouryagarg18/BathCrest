'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface NavUser {
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

const CATEGORIES_NAV = [
  'Bathroom Faucets', 'Rain Showers', 'Health Faucets', 'Wash Basins',
  'Kitchen Faucets', 'Soap Dispensers', 'Mirror Cabinets', 'Shower Panels',
  'Towel Holders', 'Toilet Seats', 'Flush Systems', 'Vanity Units',
  'PVC Accessories', 'Angle Valves', 'Bathroom Mirrors', 'Accessories',
];

// ── SVG Icons (inline for crisp rendering at small sizes) ──────────────────
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IconHeart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const IconCart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>
  </svg>
);
const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconPackage = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconMapPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

// ── Custom Gold Cursor ──────────────────────────────────────────────────────
function GoldCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const animateRing = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      rafId.current = requestAnimationFrame(animateRing);
    };

    const onEnterLink = () => ringRef.current?.classList.add('cursor-hover');
    const onLeaveLink = () => ringRef.current?.classList.remove('cursor-hover');

    document.addEventListener('mousemove', onMove);
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', onEnterLink);
      el.addEventListener('mouseleave', onLeaveLink);
    });
    rafId.current = requestAnimationFrame(animateRing);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

// ── Main Navbar ─────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [megaOpen, setMegaOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<NavUser | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    try {
      const token = localStorage.getItem('bathcrest_token');
      const userData = localStorage.getItem('bathcrest_user');
      if (token && userData) setUser(JSON.parse(userData));
      else setUser(null);
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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const profileItems = [
    { icon: <IconUser />, label: 'My Profile', href: '/account/profile' },
    { icon: <IconPackage />, label: 'My Orders', href: '/account/orders' },
    { icon: <IconHeart />, label: 'Wishlist', href: '/account/wishlist' },
    { icon: <IconMapPin />, label: 'Addresses', href: '/account/addresses' },
    ...(user?.role === 'admin' ? [{ icon: <IconShield />, label: 'Admin Panel', href: '/admin' }] : []),
  ];

  return (
    <>
      <GoldCursor />

      {/* ── Navbar ───────────────────────────────────────────── */}
      <nav
        className="navbar-luxury"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          transition: 'background 0.5s ease, border-color 0.5s ease, backdrop-filter 0.5s ease',
          background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        }}
      >
        <div className="lux-wrap lux-nav-inner">

          {/* Logo */}
          <Link href="/" className="lux-logo">
            <span className="lux-logo-text">
              BATH<span className="lux-gold">CREST</span>
            </span>
            <span className="lux-logo-sub">Luxury Bathroom Hardware</span>
          </Link>

          {/* Desktop Links */}
          <div className="lux-nav-links">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="lux-nav-item"
                onMouseEnter={() => link.hasMega && setMegaOpen(true)}
                onMouseLeave={() => link.hasMega && setMegaOpen(false)}
              >
                <Link
                  href={link.href}
                  className={`lux-nav-link gold-underline${pathname === link.href ? ' lux-nav-link-active' : ''}`}
                >
                  {link.label.toUpperCase()}
                  {link.hasMega && (
                    <span style={{
                      marginLeft: 4, display: 'inline-block',
                      transition: 'transform 0.3s ease',
                      transform: megaOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      verticalAlign: 'middle'
                    }}>
                      <IconChevronDown />
                    </span>
                  )}
                </Link>

                {/* Mega menu */}
                <AnimatePresence>
                  {link.hasMega && megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="lux-mega"
                    >
                      <div className="lux-mega-header">
                        <span className="lux-eyebrow">Browse Collection</span>
                        <Link href="/products" className="lux-mega-viewall">View All →</Link>
                      </div>
                      <div className="lux-mega-grid">
                        {CATEGORIES_NAV.map((cat, i) => (
                          <Link
                            key={cat}
                            href={`/products?category=${encodeURIComponent(cat)}`}
                            className="lux-mega-link"
                            style={{ animationDelay: `${i * 20}ms` }}
                          >
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
          <div className="lux-nav-actions">
            {/* Search */}
            <button
              className="lux-icon-btn"
              onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 80); }}
              aria-label="Search"
            >
              <IconSearch />
            </button>

            {/* Wishlist */}
            <Link href="/account/wishlist" className="lux-icon-btn" aria-label="Wishlist" style={{ position: 'relative' }}>
              <IconHeart />
              {wishlistCount > 0 && <span className="lux-badge">{wishlistCount}</span>}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="lux-icon-btn" aria-label="Cart" style={{ position: 'relative' }}>
              <IconCart />
              {cartCount > 0 && <span className="lux-badge">{cartCount}</span>}
            </Link>

            {/* User — desktop only */}
            <div ref={profileRef} className="lux-user-wrap">
              {user ? (
                <>
                  <button
                    className="lux-icon-btn lux-user-btn"
                    onClick={() => setProfileOpen(!profileOpen)}
                    aria-label="Account"
                  >
                    <span className="lux-user-initial">{user.name[0].toUpperCase()}</span>
                    <span className="lux-user-name">{user.name.split(' ')[0]}</span>
                    <span style={{ marginLeft: 4, display: 'inline-block', transition: 'transform 0.3s ease', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <IconChevronDown />
                    </span>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="lux-dropdown"
                      >
                        <div className="lux-dropdown-header">
                          <div className="lux-dropdown-name">{user.name}</div>
                          <div className="lux-dropdown-email">{user.email}</div>
                        </div>
                        {profileItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setProfileOpen(false)}
                            className="lux-dropdown-item"
                          >
                            <span className="lux-dropdown-icon">{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                        <div className="lux-dropdown-divider" />
                        <button onClick={handleLogout} className="lux-dropdown-item lux-dropdown-logout">
                          <span className="lux-dropdown-icon"><IconLogout /></span>
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link href="/account/login" className="lux-icon-btn lux-desktop-only" aria-label="Account">
                  <IconUser />
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lux-icon-btn lux-mobile-only"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <IconMenu />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Search Overlay ───────────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lux-search-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="lux-search-box"
            >
              <button className="lux-search-close" onClick={() => setSearchOpen(false)}>
                <IconClose />
              </button>
              <p className="lux-eyebrow" style={{ marginBottom: 20 }}>Search</p>
              <form onSubmit={handleSearch}>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search faucets, showers, basins…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="lux-search-input"
                  autoFocus
                />
              </form>
              <p className="lux-search-hint">Press Enter to search</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Menu ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lux-mobile-backdrop"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring' as const, stiffness: 300, damping: 35 }}
              className="lux-mobile-menu"
            >
              <div className="lux-mobile-header">
                <span className="lux-logo-text">BATH<span className="lux-gold">CREST</span></span>
                <button onClick={() => setMobileOpen(false)} className="lux-icon-btn"><IconClose /></button>
              </div>
              <div className="lux-mobile-body">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`lux-mobile-link${pathname === link.href ? ' lux-mobile-link-active' : ''}`}
                  >
                    {link.label.toUpperCase()}
                  </Link>
                ))}
                {user ? (
                  <>
                    <div className="lux-dropdown-divider" style={{ margin: '16px 0' }} />
                    {profileItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="lux-mobile-link"
                        style={{ fontSize: 12, color: 'rgba(250,248,245,0.5)' }}
                      >
                        {item.label.toUpperCase()}
                      </Link>
                    ))}
                    <button onClick={handleLogout} className="lux-mobile-link" style={{ fontSize: 12, color: '#C8A24C', textAlign: 'left', width: '100%' }}>
                      SIGN OUT
                    </button>
                  </>
                ) : (
                  <>
                    <div className="lux-dropdown-divider" style={{ margin: '16px 0' }} />
                    <Link href="/account/login" onClick={() => setMobileOpen(false)} className="lux-mobile-link">
                      LOGIN / REGISTER
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
