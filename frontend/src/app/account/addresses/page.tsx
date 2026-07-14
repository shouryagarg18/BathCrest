'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, MapPin, Shield, Plus, Edit2, Trash2, LogOut, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddressesPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Mock addresses since we don't have a backend endpoint for this yet
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      name: 'BathCrest Admin',
      street: '123 Luxury Lane, Suite 500',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India',
      isDefault: true
    },
    {
      id: 2,
      type: 'Office',
      name: 'BathCrest Headquarters',
      street: '456 Business Park, Block C',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India',
      isDefault: false
    }
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    type: 'Home', name: '', street: '', city: '', state: '', zipCode: '', country: 'India', isDefault: false
  });

  const handleOpenModal = (address?: any) => {
    if (address) {
      setEditingId(address.id);
      setFormData(address);
    } else {
      setEditingId(null);
      setFormData({ type: 'Home', name: '', street: '', city: '', state: '', zipCode: '', country: 'India', isDefault: false });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAddresses(prev => prev.map(a => a.id === editingId ? { ...formData, id: editingId } : a));
    } else {
      setAddresses(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  useEffect(() => {
    const token = localStorage.getItem('bathcrest_token');
    const userData = localStorage.getItem('bathcrest_user');
    
    if (!token || !userData) {
      router.push('/account/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (err) {
      console.error(err);
      router.push('/account/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('bathcrest_token');
    localStorage.removeItem('bathcrest_user');
    router.push('/');
    setTimeout(() => window.location.reload(), 100);
  };

  if (isLoading) {
    return (
      <div className="section-py section-container flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#8b5e34] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="section-py relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8b5e34]/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="section-container max-w-4xl">
        <div className="text-center mb-12">
          <div className="text-[#8b5e34] font-semibold text-sm uppercase tracking-widest mb-4">Account</div>
          <h1 className="section-heading text-gradient mb-4">Saved Addresses</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Sidebar - Profile Summary */}
          <div className="md:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm sticky top-24">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8b5e34] to-[#5c3a21] flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_30px_rgba(139,94,52,0.3)] mb-4">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
                <p className="text-sm text-white/50 mb-4">{user.email}</p>
                
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">
                  {user.role === 'admin' ? <Shield className="w-3 h-3 text-[#8b5e34]" /> : <User className="w-3 h-3" />}
                  <span className="capitalize">{user.role}</span>
                </div>
              </div>

              <hr className="border-white/5 my-6" />

              <nav className="flex flex-col gap-2">
                <Link href="/account/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-colors">
                  <User className="w-4 h-4" /> Personal Info
                </Link>
                <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#8b5e34]/10 text-[#8b5e34] font-medium transition-colors">
                  <MapPin className="w-4 h-4" /> Addresses
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-colors">
                    <Shield className="w-4 h-4" /> Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-white/70 hover:text-red-400 transition-colors w-full text-left mt-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Right Content - Addresses */}
          <div className="md:col-span-2 space-y-6">
            
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#8b5e34]" /> Manage Addresses
              </h3>
              <button onClick={() => handleOpenModal()} className="flex items-center gap-1.5 px-4 py-2 bg-[#8b5e34] hover:bg-[#357abd] text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_20px_rgba(139,94,52,0.2)]">
                <Plus className="w-4 h-4" /> Add New
              </button>
            </div>

            {/* Address List */}
            <div className="grid grid-cols-1 gap-4">
              {addresses.map((address) => (
                <div key={address.id} className="bg-white/5 border border-white/10 hover:border-white/20 transition-colors rounded-2xl p-6 relative group overflow-hidden">
                  {address.isDefault && (
                    <div className="absolute top-0 right-0 bg-[#8b5e34] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                      Default
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-white/10 text-white/80 text-xs px-2.5 py-1 rounded-md font-medium">
                          {address.type}
                        </span>
                        <span className="text-white font-bold">{address.name}</span>
                      </div>
                      
                      <div className="text-white/60 text-sm leading-relaxed mt-3">
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                        <p>{address.country}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(address)} className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors" title="Edit Address">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(address.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-white/50 hover:text-red-400 transition-colors" title="Delete Address">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {addresses.length === 0 && (
                <div className="text-center py-10 text-white/50">
                  <MapPin className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>You have no saved addresses.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Address Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                <h3 className="text-lg font-bold text-white">
                  {editingId ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button onClick={handleCloseModal} className="text-white/50 hover:text-white transition-colors p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Full Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-dark" required placeholder="John Doe" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Address Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="input-dark bg-[#111] cursor-pointer appearance-none">
                      <option className="bg-[#111]">Home</option>
                      <option className="bg-[#111]">Office</option>
                      <option className="bg-[#111]">Other</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Street Address</label>
                    <input type="text" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="input-dark" required placeholder="123 Main St, Apt 4B" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">City</label>
                    <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="input-dark" required />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">State</label>
                    <input type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="input-dark" required />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">ZIP Code</label>
                    <input type="text" value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} className="input-dark" required />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Country</label>
                    <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="input-dark" required />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5 mt-4">
                  <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-medium bg-[#8b5e34] text-white hover:bg-[#357abd] shadow-[0_0_15px_rgba(139,94,52,0.3)] transition-all">
                    Save Address
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
