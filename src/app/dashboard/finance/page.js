'use client';

import { useState, useEffect } from 'react';
import api from '../../../../lib/api';

import Link from 'next/link';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const C = {
  forestBg:       '#0F1F14',
  forestSurface:  '#162B1C',
  forestSurface2: '#1C3524',
  forestBorder:   '#234D2E',
  green:          '#2D7A3A',
  greenLight:     '#3D9E4D',
  greenGlow:      '#6FCF7F',
  greenFaint:     '#1A3D22',
  gold:           '#C9A84C',
  goldLight:      '#E8C76A',
  red:            '#C0392B',
  redFaint:       'rgba(192,57,43,0.15)',
  amber:          '#D4860A',
  amberLight:     '#F0A030',
  blue:           '#2471A3',
  blueLight:      '#5DADE2',
  textPrimary:    '#F0EBE0',
  textSecondary:  '#A89880',
  textMuted:      '#5A6B5E',
};

const CATEGORY_COLORS = {
  chicks:    '#5DADE2',
  feed:      '#6FCF7F',
  medication:'#F0A030',
  labor:     '#C084FC',
  utilities: '#E8C76A',
  equipment: '#F87171',
  other:     '#94A3B8',
};

const fmt    = n => n != null ? `₦${Number(n).toLocaleString()}` : '₦0';
const fmtNum = n => n != null ? Number(n).toLocaleString() : '0';

function Badge({ children, color = 'green' }) {
  const s = {
    green: { bg: C.greenFaint, text: C.greenGlow, border: C.green },
    red:   { bg: C.redFaint,   text: '#E88080',   border: '#7B1F1F' },
    gold:  { bg: 'rgba(201,168,76,0.15)', text: C.goldLight, border: C.gold },
    muted: { bg: C.forestSurface2, text: C.textSecondary, border: C.forestBorder },
  }[color] || { bg: C.greenFaint, text: C.greenGlow, border: C.green };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
      {children}
    </span>
  );
}

function Skeleton({ h = 20, w = '100%', radius = 6 }) {
  return (
    <div style={{
      height: h, width: w, borderRadius: radius,
      background: `linear-gradient(90deg, ${C.forestSurface} 25%, ${C.forestSurface2} 50%, ${C.forestSurface} 75%)`,
      backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite',
    }} />
  );
}

export default function FinancePage() {
  const [overview, setOverview] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState('overview');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/finance/overview');
      setOverview(res.data.overview);
    } catch { toast.error('Failed to load finance data'); }
    finally { setLoading(false); }
  };

  const o = overview;

  // Pie chart data from best batch breakdown — placeholder structure
  const pieData = o ? [
    { name: 'Revenue',  value: o.allTime.totalRevenue  },
    { name: 'Expenses', value: o.allTime.totalExpenses },
  ].filter(d => d.value > 0) : [];

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>
            Finance Overview
          </h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>All-time and monthly financial summary across all batches</p>
        </div>
      </div>

      {/* All-Time Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {loading ? [1,2,3].map(i => <Skeleton key={i} h={120} radius={12} />) : [
          {
            label: 'All-Time Revenue', value: fmt(o?.allTime?.totalRevenue),
            sub: 'Total gross revenue', color: C.greenGlow, accent: 'green',
            accent_bar: `linear-gradient(90deg, ${C.green}, ${C.greenLight})`,
          },
          {
            label: 'All-Time Expenses', value: fmt(o?.allTime?.totalExpenses),
            sub: 'Total costs incurred', color: '#E88080', accent: 'red',
            accent_bar: `linear-gradient(90deg, ${C.red}, #E74C3C)`,
          },
          {
            label: 'All-Time Profit', value: fmt(o?.allTime?.profit),
            sub: `${o?.allTime?.isProfit ? 'In profit ✓' : 'At a loss ✗'}`,
            color: o?.allTime?.isProfit ? C.greenGlow : '#E88080',
            accent_bar: o?.allTime?.isProfit
              ? `linear-gradient(90deg, ${C.green}, ${C.greenLight})`
              : `linear-gradient(90deg, ${C.red}, #E74C3C)`,
          },
        ].map((s, i) => (
          <div key={i} style={{ background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 14, padding: '22px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.accent_bar }} />
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: C.textMuted, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: s.color === C.greenGlow ? C.greenGlow : s.color }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* This Month */}
      <div style={{
        background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
        borderRadius: 14, padding: '22px', marginBottom: 24,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginBottom: 16 }}>
          📅 This Month
        </div>
        {loading ? <Skeleton h={80} radius={8} /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { label: 'Revenue',  value: fmt(o?.thisMonth?.revenue),  color: C.greenGlow },
              { label: 'Expenses', value: fmt(o?.thisMonth?.expenses),  color: '#E88080'   },
              { label: 'Profit',   value: fmt(o?.thisMonth?.profit),
                color: o?.thisMonth?.isProfit ? C.greenGlow : '#E88080' },
              { label: 'Status',   value: o?.thisMonth?.isProfit ? '✓ Profitable' : '✗ Loss',
                color: o?.thisMonth?.isProfit ? C.greenGlow : '#E88080' },
            ].map((s, i) => (
              <div key={i} style={{ background: C.forestSurface2, borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>{s.label}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Best Batch + Pie */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* Best Batch */}
        <div style={{ background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 14, padding: '22px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginBottom: 16 }}>🏆 Best Performing Batch</div>
          {loading ? <Skeleton h={100} radius={8} /> : o?.bestBatch ? (
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, marginBottom: 12 }}>{o.bestBatch.batchName}</div>
              <div style={{ display: 'flex', gap: 20 }}>
                <div>
                  <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>PROFIT</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.greenGlow }}>{fmt(o.bestBatch.profit)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>ROI</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.goldLight }}>{o.bestBatch.roi}%</div>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <Link href={`/dashboard/batches/${o.bestBatch.batchId}`} style={{ fontSize: 12, fontWeight: 600, color: C.greenGlow, textDecoration: 'none' }}>
                  View this batch →
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 13, color: C.textMuted }}>No completed batches yet. Complete a batch to see your best performer.</div>
          )}
        </div>

        {/* Revenue vs Expenses Pie */}
        <div style={{ background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 14, padding: '22px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>Revenue vs Expenses Split</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 12 }}>All-time breakdown</div>
          {loading ? <Skeleton h={160} radius={8} /> : pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? C.greenGlow : '#E88080'} />
                  ))}
                </Pie>
                <Tooltip formatter={v => fmt(v)} contentStyle={{ background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12, color: C.textSecondary }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: C.textMuted }}>
              Log expenses and sales to see your breakdown.
            </div>
          )}
        </div>
      </div>

      {/* Batch Summary Table */}
      <div style={{ background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.forestBorder}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>Finance by Batch</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>P&L summary for each batch</div>
        </div>
        {loading ? (
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[1,2,3].map(i => <Skeleton key={i} h={48} radius={8} />)}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.forestSurface2 }}>
                {['Batch', 'Revenue', 'Expenses', 'Profit', 'ROI', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '11px 18px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: C.textMuted, borderBottom: `1px solid ${C.forestBorder}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* We pull batch data from analytics endpoint — show a note to go to analytics for full data */}
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', fontSize: 13, color: C.textMuted }}>
                  <div style={{ marginBottom: 8 }}>View per-batch P&L from each batch's Finance tab.</div>
                  <Link href="/dashboard/batches" style={{ color: C.greenGlow, textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>
                    Go to Batches →
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Quick Links */}
      <div style={{ background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 14, padding: '20px 22px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, marginBottom: 14 }}>Quick Actions</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'Log Expense',   href: '/dashboard/batches', desc: 'Add to a batch'    },
            { label: 'Log Sale',      href: '/dashboard/batches', desc: 'Record revenue'     },
            { label: 'View P&L',      href: '/dashboard/batches', desc: 'Per batch detail'   },
            { label: 'Analytics',     href: '/dashboard/analytics', desc: 'Charts & trends'  },
          ].map((a, i) => (
            <Link key={i} href={a.href} style={{
              padding: '12px 18px', borderRadius: 10,
              background: C.forestSurface2, border: `1px solid ${C.forestBorder}`,
              textDecoration: 'none', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.background = C.greenFaint; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.forestBorder; e.currentTarget.style.background = C.forestSurface2; }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 2 }}>{a.label}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{a.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}