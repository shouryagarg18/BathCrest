'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Settings, ArrowLeft, Save, Store, CreditCard, Bell, Shield, Mail } from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Mock settings state
  const [settings, setSettings] = useState({
    storeName: 'BathCrest',
    storeEmail: 'admin@bathcrest.com',
    storePhone: '+91 98765 43210',
    address: '123 Luxury Lane, Mumbai, MH 400001',
    currency: 'INR',
    taxRate: '18',
    enableStripe: true,
    enableRazorpay: true,
    enableCOD: true,
    orderEmails: true,
    marketingEmails: false,
    maintenanceMode: false
  });

  useEffect(() => {
    // Auth check
    const token = localStorage.getItem('bathcrest_token');
    const currentUser = JSON.parse(localStorage.getItem('bathcrest_user') || '{}');
    
    if (!token || currentUser.role !== 'admin') {
      router.push('/account/login');
      return;
    }

    // Simulate loading settings from DB
    setTimeout(() => {
      setIsLoaded(true);
    }, 600);
  }, [router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      setIsSaving(false);
      // In a real app, we would show a toast notification here
      alert('Settings saved successfully!');
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings({ ...settings, [name]: checked });
    } else {
      setSettings({ ...settings, [name]: value });
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#8b5e34]/30 border-t-[#8b5e34] rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: <Store size={18} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'advanced', label: 'Advanced', icon: <Shield size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-[#0c0a09] py-10">
      <div className="section-container max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Settings className="text-[#8b5e34]" /> Store Settings
              </h1>
              <p className="text-white/40 text-sm">Configure your platform preferences</p>
            </div>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary flex items-center gap-2"
          >
            {isSaving ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
            ) : (
              <><Save size={18} /> Save Changes</>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="md:col-span-1 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all font-medium ${
                  activeTab === tab.id 
                    ? 'bg-[#8b5e34]/10 text-[#8b5e34] border border-[#8b5e34]/20' 
                    : 'text-white/50 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="md:col-span-3">
            <form onSubmit={handleSave} className="glass rounded-2xl p-6 md:p-8">
              
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-white/10 pb-4 mb-6">
                    <h2 className="text-lg font-bold text-white">General Store Details</h2>
                    <p className="text-white/40 text-sm mt-1">These details are displayed on your contact page and order receipts.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1.5">Store Name</label>
                      <input type="text" name="storeName" value={settings.storeName} onChange={handleInputChange} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1.5">Currency</label>
                      <select name="currency" value={settings.currency} onChange={handleInputChange} className="input-field">
                        <option value="INR" className="bg-[#0c0a09] text-white">INR (₹)</option>
                        <option value="USD" className="bg-[#0c0a09] text-white">USD ($)</option>
                        <option value="EUR" className="bg-[#0c0a09] text-white">EUR (€)</option>
                        <option value="GBP" className="bg-[#0c0a09] text-white">GBP (£)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1.5">Support Email</label>
                      <input type="email" name="storeEmail" value={settings.storeEmail} onChange={handleInputChange} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1.5">Support Phone</label>
                      <input type="text" name="storePhone" value={settings.storePhone} onChange={handleInputChange} className="input-field" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-white/70 mb-1.5">Store Address</label>
                      <textarea name="address" value={settings.address} onChange={handleInputChange} className="input-field h-24 resize-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Payments Settings */}
              {activeTab === 'payments' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-white/10 pb-4 mb-6">
                    <h2 className="text-lg font-bold text-white">Payment Gateways</h2>
                    <p className="text-white/40 text-sm mt-1">Configure how you accept payments from customers.</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'enableRazorpay', title: 'Razorpay', desc: 'Accept credit cards, UPI, and netbanking in India.' },
                      { id: 'enableStripe', title: 'Stripe', desc: 'Accept international credit cards and Apple Pay.' },
                      { id: 'enableCOD', title: 'Cash on Delivery', desc: 'Allow customers to pay when the product arrives.' }
                    ].map((gateway) => (
                      <div key={gateway.id} className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                        <div>
                          <div className="font-medium text-white">{gateway.title}</div>
                          <div className="text-sm text-white/40 mt-1">{gateway.desc}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            name={gateway.id} 
                            checked={settings[gateway.id as keyof typeof settings] as boolean} 
                            onChange={handleInputChange}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8b5e34]"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Global Tax Rate (%)</label>
                    <input type="number" name="taxRate" value={settings.taxRate} onChange={handleInputChange} className="input-field max-w-xs" />
                    <p className="text-white/30 text-xs mt-2">This tax rate is applied to all orders at checkout.</p>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-white/10 pb-4 mb-6">
                    <h2 className="text-lg font-bold text-white">Email Notifications</h2>
                    <p className="text-white/40 text-sm mt-1">Manage automated emails sent to you and your customers.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-[#8b5e34]/20 bg-[#8b5e34]/5">
                      <Mail className="text-[#8b5e34] shrink-0 mt-1" />
                      <div>
                        <div className="font-medium text-white">Order Confirmation Emails</div>
                        <div className="text-sm text-white/40 mt-1">Automatically send a receipt to customers when they place an order.</div>
                        <label className="flex items-center gap-2 mt-3 cursor-pointer">
                          <input type="checkbox" name="orderEmails" checked={settings.orderEmails} onChange={handleInputChange} className="rounded border-white/20 bg-white/5 text-[#8b5e34] focus:ring-[#8b5e34]" />
                          <span className="text-sm text-white/70">Enable order confirmation emails</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
                      <Bell className="text-white/60 shrink-0 mt-1" />
                      <div>
                        <div className="font-medium text-white">Marketing Emails</div>
                        <div className="text-sm text-white/40 mt-1">Send promotional emails and newsletters to subscribed users.</div>
                        <label className="flex items-center gap-2 mt-3 cursor-pointer">
                          <input type="checkbox" name="marketingEmails" checked={settings.marketingEmails} onChange={handleInputChange} className="rounded border-white/20 bg-white/5 text-[#8b5e34] focus:ring-[#8b5e34]" />
                          <span className="text-sm text-white/70">Enable marketing campaigns</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Settings */}
              {activeTab === 'advanced' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-white/10 pb-4 mb-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Shield className="text-red-400" /> Danger Zone
                    </h2>
                    <p className="text-white/40 text-sm mt-1">Critical system settings that affect store visibility.</p>
                  </div>

                  <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-white">Maintenance Mode</div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="maintenanceMode" 
                          checked={settings.maintenanceMode} 
                          onChange={handleInputChange}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                      </label>
                    </div>
                    <div className="text-sm text-white/60 mb-4">
                      When enabled, your storefront will be hidden from the public and display a "Coming Soon" page. Only administrators will be able to access the site.
                    </div>
                  </div>
                </div>
              )}

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
