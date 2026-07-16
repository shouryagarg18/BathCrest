'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  TrendingUp, ArrowLeft, Download, DollarSign, ShoppingBag,
  Users, ArrowUpRight, ArrowDownRight, Calendar
} from 'lucide-react';

const API_URL = 'https://bathcrest.onrender.com/api';

// ── Full-year 2026 demo data ────────────────────────────────────────────────
const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 284500, orders: 38, avgOrder: 7487 },
  { month: 'Feb', revenue: 312800, orders: 42, avgOrder: 7448 },
  { month: 'Mar', revenue: 478200, orders: 61, avgOrder: 7839 },
  { month: 'Apr', revenue: 391600, orders: 52, avgOrder: 7531 },
  { month: 'May', revenue: 524300, orders: 68, avgOrder: 7710 },
  { month: 'Jun', revenue: 612800, orders: 79, avgOrder: 7757 },
  { month: 'Jul', revenue: 738400, orders: 94, avgOrder: 7855 },
  { month: 'Aug', revenue: 0,      orders: 0,  avgOrder: 0 },
  { month: 'Sep', revenue: 0,      orders: 0,  avgOrder: 0 },
  { month: 'Oct', revenue: 0,      orders: 0,  avgOrder: 0 },
  { month: 'Nov', revenue: 0,      orders: 0,  avgOrder: 0 },
  { month: 'Dec', revenue: 0,      orders: 0,  avgOrder: 0 },
];

const CATEGORY_REVENUE = [
  { name: 'Rain Showers',      revenue: 742600, pct: 22, color: '#8b5e34' },
  { name: 'Bathroom Faucets',  revenue: 618900, pct: 18, color: '#b8865a' },
  { name: 'Vanity Units',      revenue: 551200, pct: 16, color: '#d4b895' },
  { name: 'Wash Basins',       revenue: 482500, pct: 14, color: '#a06832' },
  { name: 'Shower Panels',     revenue: 413800, pct: 12, color: '#7a4f28' },
  { name: 'Mirror Cabinets',   revenue: 275300, pct: 8,  color: '#c49a60' },
  { name: 'Others',            revenue: 257300, pct: 10, color: '#4a3520' },
];

const PAYMENT_METHODS = [
  { method: 'UPI',         pct: 42, amount: 1437240, color: '#8b5e34' },
  { method: 'Credit Card', pct: 31, amount: 1060830, color: '#b8865a' },
  { method: 'Debit Card',  pct: 15, amount: 513450,  color: '#d4b895' },
  { method: 'Net Banking', pct: 12, amount: 410760,  color: '#a06832' },
];

const TOP_CUSTOMERS = [
  { name: 'Sneha Gupta',    orders: 8, revenue: 184200, city: 'Mumbai' },
  { name: 'Dev Saxena',     orders: 6, revenue: 162400, city: 'Delhi' },
  { name: 'Ravi Teja',      orders: 7, revenue: 148900, city: 'Hyderabad' },
  { name: 'Yash Thakur',    orders: 5, revenue: 134500, city: 'Pune' },
  { name: 'Rohan Joshi',    orders: 6, revenue: 126800, city: 'Bangalore' },
];

const RECENT_TRANSACTIONS = [
  { id: 'ORD7890123', date: '2026-07-13', customer: 'Rahul Sharma',   total: 14999,  method: 'UPI',         status: 'paid' },
  { id: 'ORD4567890', date: '2026-07-12', customer: 'Priya Patel',    total: 8500,   method: 'Credit Card', status: 'paid' },
  { id: 'ORD1234567', date: '2026-07-11', customer: 'Amit Kumar',     total: 24500,  method: 'Net Banking', status: 'pending' },
  { id: 'ORD8901234', date: '2026-07-10', customer: 'Neha Singh',     total: 3200,   method: 'UPI',         status: 'paid' },
  { id: 'ORD5678901', date: '2026-07-09', customer: 'Vikram Reddy',   total: 11999,  method: 'Debit Card',  status: 'paid' },
  { id: 'ORD9876543', date: '2026-07-08', customer: 'Sneha Gupta',    total: 48000,  method: 'Credit Card', status: 'paid' },
  { id: 'ORD1122334', date: '2026-07-07', customer: 'Karan Malhotra', total: 17700,  method: 'UPI',         status: 'paid' },
  { id: 'ORD2233445', date: '2026-07-06', customer: 'Anjali Desai',   total: 10252,  method: 'Credit Card', status: 'pending' },
  { id: 'ORD3344556', date: '2026-07-06', customer: 'Rohan Joshi',    total: 38620,  method: 'Net Banking', status: 'paid' },
  { id: 'ORD4455667', date: '2026-07-05', customer: 'Meera Iyer',     total: 6858,   method: 'UPI',         status: 'paid' },
];

const TOTAL_REVENUE   = MONTHLY_REVENUE.reduce((s, m) => s + m.revenue, 0);
const TOTAL_ORDERS    = MONTHLY_REVENUE.reduce((s, m) => s + m.orders, 0);
const AVG_ORDER_VALUE = Math.round(TOTAL_REVENUE / TOTAL_ORDERS);
const MAX_REVENUE     = Math.max(...MONTHLY_REVENUE.map(m => m.revenue));

// ── Bar Chart (pure SVG, no lib) ────────────────────────────────────────────
function BarChart({ data }: { data: typeof MONTHLY_REVENUE }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const W = 900, H = 260, PAD = { t: 20, r: 20, b: 40, l: 60 };
  const chartW = W - PAD.l - PAD.r;
  const chartH = H - PAD.t - PAD.b;
  const barW = chartW / data.length * 0.55;
  const gap  = chartW / data.length;

  const yTicks = [0, 200000, 400000, 600000, 800000];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: 'visible' }}>
      {/* Grid lines */}
      {yTicks.map(v => {
        const y = PAD.t + chartH - (v / MAX_REVENUE) * chartH;
        return (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={PAD.l - 8} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="10">
              {v === 0 ? '₹0' : `₹${(v / 1000).toFixed(0)}K`}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const x = PAD.l + i * gap + (gap - barW) / 2;
        const barH = d.revenue > 0 ? (d.revenue / MAX_REVENUE) * chartH : 0;
        const y = PAD.t + chartH - barH;
        const isCurrent = i === 6; // July
        const isFuture  = d.revenue === 0;
        const isHov     = hovered === i;

        return (
          <g key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: isFuture ? 'default' : 'pointer' }}
          >
            {/* Bar background (future months) */}
            {isFuture && (
              <rect x={x} y={PAD.t} width={barW} height={chartH}
                fill="rgba(255,255,255,0.03)" rx="4" />
            )}

            {/* Actual bar */}
            {!isFuture && (
              <rect x={x} y={y} width={barW} height={barH}
                rx="4"
                fill={isCurrent
                  ? 'url(#goldGrad)'
                  : isHov ? 'rgba(139,94,52,0.7)' : 'rgba(139,94,52,0.45)'}
                style={{ transition: 'fill 0.2s ease' }}
              />
            )}

            {/* Hover tooltip */}
            {isHov && !isFuture && (
              <g>
                <rect x={x - 20} y={y - 52} width={barW + 40} height={44}
                  rx="6" fill="rgba(13,11,10,0.95)" stroke="rgba(139,94,52,0.4)" strokeWidth="1" />
                <text x={x + barW / 2} y={y - 33} textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
                  ₹{(d.revenue / 1000).toFixed(1)}K
                </text>
                <text x={x + barW / 2} y={y - 17} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9">
                  {d.orders} orders · avg ₹{d.avgOrder.toLocaleString('en-IN')}
                </text>
              </g>
            )}

            {/* Month label */}
            <text x={x + barW / 2} y={H - 8} textAnchor="middle"
              fill={isCurrent ? '#d4b895' : isFuture ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.45)'}
              fontSize="11" fontWeight={isCurrent ? '600' : '400'}>
              {d.month}
            </text>

            {/* "Current" tag */}
            {isCurrent && (
              <text x={x + barW / 2} y={y - 8} textAnchor="middle" fill="#d4b895" fontSize="8" fontWeight="600">
                ▲ NOW
              </text>
            )}
          </g>
        );
      })}

      {/* Gold gradient def */}
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4b895" />
          <stop offset="100%" stopColor="#8b5e34" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Donut (category) ────────────────────────────────────────────────────────
function DonutChart({ data }: { data: typeof CATEGORY_REVENUE }) {
  const [hov, setHov] = useState<number | null>(null);
  const R = 70, CX = 90, CY = 90, STROKE = 22;
  let cumPct = 0;

  const slices = data.map((d, i) => {
    const start = cumPct;
    cumPct += d.pct;
    const startDeg = (start / 100) * 360 - 90;
    const endDeg   = (cumPct / 100) * 360 - 90;
    const large    = d.pct > 50 ? 1 : 0;
    const toRad    = (deg: number) => deg * Math.PI / 180;
    const x1 = CX + R * Math.cos(toRad(startDeg));
    const y1 = CY + R * Math.sin(toRad(startDeg));
    const x2 = CX + R * Math.cos(toRad(endDeg));
    const y2 = CY + R * Math.sin(toRad(endDeg));
    return { ...d, i, path: `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`, startDeg, endDeg };
  });

  const hovD = hov !== null ? data[hov] : null;

  return (
    <svg viewBox="0 0 180 180" className="w-44 h-44">
      {slices.map((s) => (
        <path key={s.i}
          d={s.path}
          fill="none"
          stroke={s.color}
          strokeWidth={hov === s.i ? STROKE + 4 : STROKE}
          strokeLinecap="butt"
          style={{ transition: 'stroke-width 0.2s ease', cursor: 'pointer' }}
          onMouseEnter={() => setHov(s.i)}
          onMouseLeave={() => setHov(null)}
        />
      ))}
      {/* Center text */}
      <text x={CX} y={CY - 6} textAnchor="middle" fill="white" fontSize="13" fontWeight="700">
        {hovD ? `${hovD.pct}%` : '100%'}
      </text>
      <text x={CX} y={CY + 10} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7.5">
        {hovD ? hovD.name.split(' ')[0] : 'All Categories'}
      </text>
    </svg>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function AdminRevenuePage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');

  useEffect(() => {
    try {
      const token = localStorage.getItem('bathcrest_token');
      const user  = JSON.parse(localStorage.getItem('bathcrest_user') || '{}');
      if (!token || user.role !== 'admin') { router.push('/account/login'); return; }
      setAuthed(true);
    } catch { router.push('/account/login'); }
  }, [router]);

  const handleExportCSV = () => {
    const rows = RECENT_TRANSACTIONS.map(t =>
      `"${t.id}","${t.date}","${t.customer}","${t.total}","${t.method}","${t.status}"`
    );
    const csv  = ['Order ID,Date,Customer,Total,Method,Status', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `BathCrest_Revenue_2026.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  if (!authed) return (
    <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#8b5e34]/30 border-t-[#8b5e34] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0c0a09] pb-16">

      {/* ── Sticky Sub-header ──────────────────────────────────── */}
      <div className="border-b border-white/6 sticky z-30 glass-dark" style={{ top: '80px' }}>
        <div className="section-container py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin"
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-white font-bold text-lg flex items-center gap-2">
                <TrendingUp size={18} className="text-[#8b5e34]" /> Revenue Analytics
              </h1>
              <p className="text-white/35 text-xs mt-0.5">Financial year 2026 · Demo Data</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Tabs */}
            <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/8">
              {(['overview', 'transactions'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide transition-all ${
                    activeTab === tab
                      ? 'bg-[#8b5e34] text-white shadow'
                      : 'text-white/40 hover:text-white/70'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>
            <button onClick={handleExportCSV}
              className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5">
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="section-container py-8 space-y-8">

        {/* ── KPI Cards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Revenue (YTD)',
              value: `₹${(TOTAL_REVENUE / 100000).toFixed(2)}L`,
              sub: '+28.4% vs last year',
              up: true,
              icon: <DollarSign size={20} />,
              color: 'text-green-400',
              bg: 'bg-green-400/10',
            },
            {
              label: 'Total Orders (YTD)',
              value: TOTAL_ORDERS.toString(),
              sub: '+34.1% vs last year',
              up: true,
              icon: <ShoppingBag size={20} />,
              color: 'text-blue-400',
              bg: 'bg-blue-400/10',
            },
            {
              label: 'Avg Order Value',
              value: `₹${AVG_ORDER_VALUE.toLocaleString('en-IN')}`,
              sub: '+6.8% vs last year',
              up: true,
              icon: <TrendingUp size={20} />,
              color: 'text-amber-400',
              bg: 'bg-amber-400/10',
            },
            {
              label: 'Best Month',
              value: 'July 2026',
              sub: `₹7.38L · 94 orders`,
              up: true,
              icon: <Calendar size={20} />,
              color: 'text-purple-400',
              bg: 'bg-purple-400/10',
            },
          ].map((k) => (
            <div key={k.label} className="glass rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl ${k.bg} ${k.color} flex items-center justify-center mb-4`}>
                {k.icon}
              </div>
              <div className="text-2xl font-black text-white mb-1">{k.value}</div>
              <div className="text-white/40 text-xs mb-2">{k.label}</div>
              <div className={`flex items-center gap-1 text-xs font-medium ${k.up ? 'text-green-400' : 'text-red-400'}`}>
                {k.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {k.sub}
              </div>
            </div>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* ── Monthly Revenue Chart ───────────────────────────── */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/35 text-xs uppercase tracking-widest font-semibold mb-0.5">Monthly Breakdown</p>
                  <h2 className="text-white font-bold text-lg">Revenue — Jan to Dec 2026</h2>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm inline-block" style={{ background: 'linear-gradient(#d4b895,#8b5e34)' }} />
                    Current month
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-[#8b5e34]/45 inline-block" />
                    Past months
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-white/5 inline-block" />
                    Upcoming
                  </span>
                </div>
              </div>
              <BarChart data={MONTHLY_REVENUE} />
            </div>

            {/* ── Category + Payment ──────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Category Revenue */}
              <div className="glass rounded-2xl p-6">
                <p className="text-white/35 text-xs uppercase tracking-widest font-semibold mb-1">Revenue by Category</p>
                <h2 className="text-white font-bold text-base mb-6">Top Performing Categories</h2>
                <div className="flex items-start gap-6">
                  <DonutChart data={CATEGORY_REVENUE} />
                  <div className="flex-1 space-y-2.5">
                    {CATEGORY_REVENUE.map((c) => (
                      <div key={c.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/60 text-xs">{c.name}</span>
                          <span className="text-white/40 text-xs">{c.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${c.pct}%`, background: c.color, transition: 'width 1s ease' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="glass rounded-2xl p-6">
                <p className="text-white/35 text-xs uppercase tracking-widest font-semibold mb-1">Payment Methods</p>
                <h2 className="text-white font-bold text-base mb-6">Transaction Breakdown</h2>
                <div className="space-y-4">
                  {PAYMENT_METHODS.map((p) => (
                    <div key={p.method} className="flex items-center gap-4">
                      <div className="w-28 text-white/60 text-sm font-medium shrink-0">{p.method}</div>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${p.pct}%`, background: p.color }}
                        />
                      </div>
                      <div className="text-right w-28 shrink-0">
                        <div className="text-white text-sm font-bold">{p.pct}%</div>
                        <div className="text-white/30 text-xs">₹{(p.amount / 1000).toFixed(0)}K</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Monthly trend numbers */}
                <div className="mt-6 pt-5 border-t border-white/6">
                  <p className="text-white/35 text-xs uppercase tracking-widest font-semibold mb-3">Month-over-Month Growth</p>
                  <div className="grid grid-cols-4 gap-2">
                    {MONTHLY_REVENUE.filter(m => m.revenue > 0).map((m, i, arr) => {
                      const prev = arr[i - 1];
                      const growth = prev ? ((m.revenue - prev.revenue) / prev.revenue * 100) : null;
                      return (
                        <div key={m.month} className="text-center">
                          <div className="text-white/40 text-[10px] mb-0.5">{m.month}</div>
                          <div className="text-white text-xs font-bold">₹{(m.revenue / 1000).toFixed(0)}K</div>
                          {growth !== null && (
                            <div className={`text-[9px] font-semibold mt-0.5 ${growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Top Customers ───────────────────────────────────── */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/6 flex items-center justify-between">
                <div>
                  <p className="text-white/35 text-xs uppercase tracking-widest font-semibold">Top Customers</p>
                  <h2 className="text-white font-bold text-base mt-0.5">Highest Revenue Contributors — 2026</h2>
                </div>
                <Users size={18} className="text-white/20" />
              </div>
              <div className="divide-y divide-white/5">
                {TOP_CUSTOMERS.map((c, i) => (
                  <div key={c.name} className="px-6 py-4 flex items-center gap-4 hover:bg-white/2 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#8b5e34]/20 border border-[#8b5e34]/30 flex items-center justify-center text-[#8b5e34] text-xs font-bold shrink-0">
                      #{i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-semibold">{c.name}</div>
                      <div className="text-white/35 text-xs">{c.city} · {c.orders} orders</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-sm">₹{c.revenue.toLocaleString('en-IN')}</div>
                      <div className="text-white/30 text-xs">lifetime value</div>
                    </div>
                    <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden ml-4">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#8b5e34] to-[#d4b895]"
                        style={{ width: `${(c.revenue / TOP_CUSTOMERS[0].revenue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'transactions' && (
          /* ── Transaction Ledger ──────────────────────────────── */
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/6 bg-black/20">
              <p className="text-white/35 text-xs uppercase tracking-widest font-semibold">Recent Transactions</p>
              <h2 className="text-white font-bold text-base mt-0.5">July 2026 · Latest 10 Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-black/10">
                    {['Date & ID', 'Customer', 'Method', 'Total', 'Status'].map(h => (
                      <th key={h} className="p-4 text-xs font-semibold text-white/30 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {RECENT_TRANSACTIONS.map(t => (
                    <tr key={t.id} className="hover:bg-white/3 transition-colors">
                      <td className="p-4">
                        <div className="text-white text-sm font-medium">
                          {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-white/25 text-xs mt-0.5 font-mono">#{t.id}</div>
                      </td>
                      <td className="p-4 text-white/70 text-sm">{t.customer}</td>
                      <td className="p-4">
                        <span className="text-xs px-2 py-1 rounded bg-white/5 text-white/50 border border-white/8">{t.method}</span>
                      </td>
                      <td className="p-4 text-white font-bold text-sm">₹{t.total.toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold ${
                          t.status === 'paid'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'paid' ? 'bg-green-400' : 'bg-amber-400'}`} />
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
