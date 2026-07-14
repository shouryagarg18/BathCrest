'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

const API_URL = 'https://bathcrest.onrender.com/api';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      localStorage.setItem('bathcrest_token', data.token);
      localStorage.setItem('bathcrest_user', JSON.stringify(data.user));
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5e34] to-[#5c3a21] flex items-center justify-center text-white font-black text-sm">BC</div>
            <span className="text-white font-bold text-2xl">Bath<span className="text-gradient-blue">Crest</span></span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-white/40">Join thousands of BathCrest customers</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Full Name</label>
              <input type="text" placeholder="Shourya Garg" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-dark" required />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-dark" required />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Phone (Optional)</label>
              <input type="tel" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input-dark" />
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input-dark pr-11"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-white/40 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/account/login" className="text-[#8b5e34] hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
