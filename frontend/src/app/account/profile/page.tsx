'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, Key, Edit2, LogOut, MapPin, X, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const API_URL = 'https://measure-worship-fiber-mean.trycloudflare.com/api';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Modal States
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Form States
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const token = localStorage.getItem('bathcrest_token');
    const userData = localStorage.getItem('bathcrest_user');
    
    if (!token || !userData) {
      router.push('/account/login');
      return;
    }

    try {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setProfileForm({ name: parsed.name, email: parsed.email });
    } catch (err) {
      console.error(err);
      router.push('/account/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('bathcrest_token');
    localStorage.removeItem('bathcrest_user');
    router.push('/');
    setTimeout(() => window.location.reload(), 100);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('bathcrest_token')}`
        },
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();
      
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('bathcrest_user', JSON.stringify(data.user));
        showToast('Profile updated successfully!', 'success');
        setIsEditProfileOpen(false);
      } else {
        showToast(data.message || 'Update failed', 'error');
      }
    } catch (err) {
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/users/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('bathcrest_token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      const data = await res.json();
      
      if (data.success) {
        showToast('Password changed successfully!', 'success');
        setIsPasswordOpen(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(data.message || 'Password update failed', 'error');
      }
    } catch (err) {
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-24 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-md animate-fade-in ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {toast.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
          <div className="bg-[#110e0c] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="text-xl font-bold text-white">Edit Profile</h3>
              <button onClick={() => setIsEditProfileOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
              <div>
                <label className="text-white/60 text-xs font-semibold mb-2 block uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5e34] transition-colors"
                />
              </div>
              <div>
                <label className="text-white/60 text-xs font-semibold mb-2 block uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5e34] transition-colors"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditProfileOpen(false)} className="px-5 py-2.5 rounded-xl font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
          <div className="bg-[#110e0c] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="text-xl font-bold text-white">Change Password</h3>
              <button onClick={() => setIsPasswordOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handlePasswordUpdate} className="p-6 space-y-4">
              <div>
                <label className="text-white/60 text-xs font-semibold mb-2 block uppercase tracking-wider">Current Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5e34] transition-colors"
                />
              </div>
              <div>
                <label className="text-white/60 text-xs font-semibold mb-2 block uppercase tracking-wider">New Password</label>
                <input 
                  type="password" 
                  required minLength={6}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5e34] transition-colors"
                />
              </div>
              <div>
                <label className="text-white/60 text-xs font-semibold mb-2 block uppercase tracking-wider">Confirm New Password</label>
                <input 
                  type="password" 
                  required minLength={6}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5e34] transition-colors"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsPasswordOpen(false)} className="px-5 py-2.5 rounded-xl font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="section-container max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <div className="text-[#8b5e34] font-semibold text-sm uppercase tracking-widest mb-4">Account</div>
          <h1 className="section-heading text-gradient mb-4">My Profile</h1>
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
                <Link href="/account/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#8b5e34]/10 text-[#8b5e34] font-medium transition-colors">
                  <User className="w-4 h-4" /> Personal Info
                </Link>
                <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-colors">
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

          {/* Right Content - Profile Details */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Personal Information */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative group overflow-hidden">
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-[#8b5e34]" /> Personal Information
                </h3>
                <button onClick={() => setIsEditProfileOpen(true)} className="text-xs text-[#8b5e34] hover:text-white flex items-center gap-1 transition-colors">
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                <div>
                  <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Full Name</label>
                  <p className="text-white font-medium bg-white/5 px-4 py-3 rounded-lg border border-white/5">{user.name}</p>
                </div>
                <div>
                  <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Email Address</label>
                  <div className="flex items-center gap-2 text-white font-medium bg-white/5 px-4 py-3 rounded-lg border border-white/5">
                    <Mail className="w-4 h-4 text-white/50" />
                    {user.email}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Account Type</label>
                  <p className="text-white font-medium bg-white/5 px-4 py-3 rounded-lg border border-white/5 capitalize flex items-center gap-2">
                    {user.role === 'admin' ? 'Administrator' : 'Customer Account'}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                <Key className="w-5 h-5 text-[#8b5e34]" /> Security Settings
              </h3>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 mb-4">
                <div>
                  <p className="text-white font-medium mb-1">Change Password</p>
                  <p className="text-xs text-white/50">Update your password to keep your account secure.</p>
                </div>
                <button onClick={() => setIsPasswordOpen(true)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors">
                  Update
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
