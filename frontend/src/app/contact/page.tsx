'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, ChevronDown } from 'lucide-react';

const FAQS = [
  { q: 'What is BathCrest\'s return policy?', a: 'We offer a 7-day hassle-free return policy for all products in their original condition and packaging. Damaged or defective products can be returned within 30 days.' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 5-7 business days. Express delivery (3-4 days) is available for most cities. You will receive tracking details via SMS and email.' },
  { q: 'Do your products come with a warranty?', a: 'Yes! All BathCrest products come with a minimum 1-year manufacturer warranty. Premium collections carry 3-5 year warranties. Warranty is against manufacturing defects only.' },
  { q: 'Are your products ISI certified?', a: 'Yes, all our faucets and sanitaryware meet IS standards. We use lead-free brass, ceramic disc cartridges, and Grade 304 stainless steel. Certificates are available on request.' },
  { q: 'Do you offer installation services?', a: 'We partner with certified plumbers and installation specialists across 50+ cities. Contact us after placing your order to schedule an installation appointment.' },
  { q: 'Can I track my order?', a: 'Yes, once your order ships, you will receive a tracking link via SMS and email. You can also track your order from the My Orders section in your account.' },
  { q: 'Do you offer bulk / contractor pricing?', a: 'Absolutely! For bulk orders (10+ pieces), contractors, architects, and builders get special pricing. Contact us at shouryagarg1808@gmail.com or call 7838382868.' },
  { q: 'What payment methods do you accept?', a: 'We accept Credit/Debit Cards, UPI, Net Banking via Razorpay, and Cash on Delivery. All online transactions are 256-bit SSL encrypted.' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0c0a09]">
      {/* Hero */}
      <section className="section-py relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,94,52,0.12) 0%, #0c0a09 60%)' }}>
        <div className="section-container text-center">
          <div className="text-[#8b5e34] font-semibold text-sm uppercase tracking-widest mb-4">Get in Touch</div>
          <h1 className="section-heading text-gradient mb-4">We&apos;re Here to Help</h1>
          <p className="section-subheading max-w-2xl mx-auto">
            Have a question about our products, an order, or need design advice? Our team is ready to assist you.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="section-py pt-0">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-[#8b5e34]/10 flex items-center justify-center text-[#8b5e34] mb-4">
                  <Phone size={22} />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Call Us</h3>
                <a href="tel:7838382868" className="text-[#8b5e34] hover:underline text-lg font-semibold block">
                  +91 7838382868
                </a>
                <p className="text-white/40 text-sm mt-1">Mon–Sat: 9 AM – 7 PM IST</p>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-[#8b5e34]/10 flex items-center justify-center text-[#8b5e34] mb-4">
                  <Mail size={22} />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Email Us</h3>
                <a href="mailto:shouryagarg1808@gmail.com" className="text-[#8b5e34] hover:underline break-all block">
                  shouryagarg1808@gmail.com
                </a>
                <p className="text-white/40 text-sm mt-1">Response within 24 hours</p>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-[#8b5e34]/10 flex items-center justify-center text-[#8b5e34] mb-4">
                  <MapPin size={22} />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Our Office</h3>
                <p className="text-white/60">New Delhi, India</p>
                <p className="text-white/40 text-sm mt-1">By appointment only</p>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-[#8b5e34]/10 flex items-center justify-center text-[#8b5e34] mb-4">
                  <Clock size={22} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Business Hours</h3>
                <div className="space-y-1 text-sm text-white/60">
                  <div className="flex justify-between"><span>Monday – Friday</span><span>9 AM – 7 PM</span></div>
                  <div className="flex justify-between"><span>Saturday</span><span>10 AM – 5 PM</span></div>
                  <div className="flex justify-between text-white/30"><span>Sunday</span><span>Closed</span></div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="glass rounded-2xl p-8">
                <h2 className="text-white font-bold text-2xl mb-6">Send Us a Message</h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <Send size={36} className="text-green-400" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">Message Sent! 🎉</h3>
                    <p className="text-white/50">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Full Name *</label>
                        <input type="text" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-dark" required />
                      </div>
                      <div>
                        <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Email Address *</label>
                        <input type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-dark" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Phone Number</label>
                        <input type="tel" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input-dark" />
                      </div>
                      <div>
                        <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Subject *</label>
                        <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="input-dark cursor-pointer appearance-none" style={{ backgroundColor: '#111' }} required>
                          <option value="" className="bg-[#111]">Select subject</option>
                          <option className="bg-[#111]">Product Enquiry</option>
                          <option className="bg-[#111]">Order Support</option>
                          <option className="bg-[#111]">Return / Refund</option>
                          <option className="bg-[#111]">Bulk Order</option>
                          <option className="bg-[#111]">Installation Help</option>
                          <option className="bg-[#111]">Warranty Claim</option>
                          <option className="bg-[#111]">General Query</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Message *</label>
                      <textarea
                        placeholder="Tell us how we can help you..."
                        value={form.message}
                        onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                        className="input-dark min-h-32 resize-y"
                        required
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full py-4 text-base">
                      <Send size={18} /> Send Message
                    </button>
                  </form>
                )}
              </div>

              {/* Map Placeholder */}
              <div className="mt-6 glass rounded-2xl overflow-hidden h-56 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2d1b11] to-[#0c0a09] opacity-80" />
                <div className="relative text-center">
                  <MapPin size={40} className="text-[#8b5e34] mx-auto mb-2" />
                  <p className="text-white font-semibold">BathCrest — New Delhi, India</p>
                  <p className="text-white/40 text-sm">110001</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section-py" style={{ background: 'linear-gradient(180deg, #110e0c, #0c0a09)' }}>
        <div className="section-container max-w-3xl">
          <div className="text-center mb-12">
            <div className="text-[#8b5e34] font-semibold text-sm uppercase tracking-widest mb-4">FAQ</div>
            <h2 className="section-heading text-gradient mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-white font-medium pr-4">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[#8b5e34] flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
