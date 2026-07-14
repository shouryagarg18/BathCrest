'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, Mail, Clock, Shield, User, ArrowLeft, Search } from 'lucide-react';

const API_URL = 'https://measure-worship-fiber-mean.trycloudflare.com/api';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('bathcrest_token');
    const currentUser = JSON.parse(localStorage.getItem('bathcrest_user') || '{}');
    
    if (!token || currentUser.role !== 'admin') {
      router.push('/account/login');
      return;
    }

    fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUsers(data.users);
        else throw new Error(data.message || 'Failed to fetch users');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0c0a09] py-10">
      <div className="section-container">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Users className="text-[#8b5e34]" /> User Management
            </h1>
            <p className="text-white/40 text-sm">View all registered accounts</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 flex items-center gap-3 backdrop-blur-sm">
          <Search size={18} className="text-white/40" />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-white w-full placeholder-white/30"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#8b5e34]/30 border-t-[#8b5e34] rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
            {error}
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-black/20">
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">User</th>
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Contact</th>
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Role</th>
                    <th className="p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5e34] to-[#5c3a21] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium">{user.name}</div>
                            <div className="text-white/30 text-xs">ID: {user._id.substring(user._id.length - 6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <Mail size={14} className="text-[#8b5e34]" /> {user.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-[#8b5e34]/20 text-[#8b5e34] border border-[#8b5e34]/30' 
                            : 'bg-white/5 text-white/60 border border-white/10'
                        }`}>
                          {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                          <span className="capitalize">{user.role}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-white/50 text-sm">
                          <Clock size={14} />
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-white/40">
                        No users found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
