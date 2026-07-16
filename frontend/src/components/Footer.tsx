'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, ChevronRight } from 'lucide-react';

// Inline SVG social icons (avoids lucide-react version compatibility issues)
const IconInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const IconFacebook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const IconLinkedin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#0a0807] border-t border-white/6">
      {/* Main Footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5e34] to-[#5c3a21] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/30">
                BC
              </div>
              <span className="text-white font-bold text-2xl tracking-tight">
                Bath<span className="text-gradient-blue">Crest</span>
              </span>
            </div>
            <p className="text-white/50 leading-relaxed mb-6 max-w-sm">
              Premium bathroom hardware and sanitaryware for the modern home. Crafted with precision, designed with passion.
            </p>
            <div className="space-y-3">
              <a href="tel:7838382868" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-[#8b5e34]/10 flex items-center justify-center text-[#8b5e34] group-hover:bg-[#8b5e34]/20 transition-colors">
                  <Phone size={15} />
                </div>
                +91 7838382868
              </a>
              <a href="mailto:shouryagarg1808@gmail.com" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-[#8b5e34]/10 flex items-center justify-center text-[#8b5e34] group-hover:bg-[#8b5e34]/20 transition-colors">
                  <Mail size={15} />
                </div>
                shouryagarg1808@gmail.com
              </a>
              <div className="flex items-start gap-3 text-white/60">
                <div className="w-8 h-8 rounded-lg bg-[#8b5e34]/10 flex items-center justify-center text-[#8b5e34] flex-shrink-0 mt-0.5">
                  <MapPin size={15} />
                </div>
                <span>New Delhi, India — 110001</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold mb-5">Products</h4>
            <ul className="space-y-3">
              {['Bathroom Faucets', 'Rain Showers', 'Wash Basins', 'Mirror Cabinets', 'Vanity Units', 'Shower Panels'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/products?category=${encodeURIComponent(item)}`}
                    className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'FAQ', href: '/contact#faq' },
                { label: 'Careers', href: '/about#careers' },
                { label: 'Blog', href: '/blog' },
                { label: 'Press', href: '/press' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-5">Account</h4>
            <ul className="space-y-3">
              {[
                { label: 'Sign In', href: '/account/login' },
                { label: 'Create Account', href: '/account/signup' },
                { label: 'My Orders', href: '/account/orders' },
                { label: 'My Wishlist', href: '/account/wishlist' },
                { label: 'Return Policy', href: '/returns' },
                { label: 'Help & Support', href: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="section-container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © 2024 BathCrest. All rights reserved. Made with ❤️ in India.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {[
              { icon: <IconInstagram />, href: 'https://www.instagram.com/ishouryagarg/', label: 'Instagram' },
              { icon: <IconFacebook />, href: 'https://www.facebook.com/ishouryagarg', label: 'Facebook' },
              { icon: <IconLinkedin />, href: 'https://www.linkedin.com/in/shourya-garg-18b57a420/', label: 'LinkedIn' },
              { icon: <IconX />, href: 'https://x.com/ShouryaGarg39', label: 'X (Twitter)' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Legal */}
          <div className="flex items-center gap-4 text-xs text-white/30">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
            <Link href="/sitemap.xml" className="hover:text-white/60 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
