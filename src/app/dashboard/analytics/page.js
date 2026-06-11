'use client';

import { useState, useEffect } from 'react';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
  Cell
} from 'recharts';

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
  redLight:       '#E74C3C',
  amber:          '#D4860A',
  amberLight:     '#F0A030',
  blue:           '#2471A3',
  blueLight:      '#5DADE2',
  textPrimary:    '#F0EBE0',
  textSecondary:  '#A89880',
  textMuted:      '#5A6B5E',
};

const CHART_COLORS = [C.greenGlow, C.goldLight, C.blueLight, C.amberLight, '#E88080', '#C084FC'];

const fmt    = n => n != null ? `₦${Number(n).toLocaleString()}` : '₦0';
const fmtNum = n => n != null ? Number(n).toLocaleString() : '0';

function Skeleton({ h = 20, w = '100%', radius = 6 }) {
  return (
    <div style={{
      height: h,
      width: w,
      borderRadius: radius,
      background: `linear-gradient(90deg, ${C.forestSurface} 25%, ${C.forestSurface2} 50%, ${C.forestSurface} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  );
}

function Card({ title, sub, children, style }) {
  return (
    <div style={{
      background: C.forestSurface,
      border: `1px solid ${C.forestBorder}`,
      borderRadius: 14,
      overflow: 'hidden',
      ...style,
    }}>
      {(title || sub) && (
        <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.forestBorder}` }}>
          {title && <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>{title}</div>}
          {sub   && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{sub}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

function StatBox({ label, value, sub, color, accent }) {
  const accents = {
    green: `linear-gradient(90deg, ${C.green}, ${C.greenLight})`,
    gold:  `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`,
    red:   `linear-gradient(90deg, ${C.red}, ${C.redLight})`,
    blue:  `linear-gradient(90deg, ${C.blue}, ${C.blueLight})`,
  };
  return (
    <div style={{
      background: C.forestSurface,
      border: `1px solid ${C.forestBorder}`,
      borderRadius: 12,
      padding: '18px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: accents[accent] || accents.green,
      }} />
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: C.textMuted, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: color || C.greenGlow, lineHeight: 1, marginBottom: 4 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: C.textMuted }}>{sub}</div>}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: C.forestSurface,
      border: `1px solid ${C.forestBorder}`,
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 12,
    }}>
      <div style={{ color: C.textSecondary, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: {typeof p.value === 'number' && p.value > 1000 ? fmt(p.value) : p.value}
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [revenue,   setRevenue]   = useState([]);
  const [batches,   setBatches]   = useState([]);
  const [mortality, setMortality] = useState([]);
  const [eggs,      setEggs]      = useState([]);
  const [weights,   setWeights]   = useState([]);
  const [report,    setReport]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [months,    setMonths]    = useState(6);

  useEffect(() => {
    fetchAll();
  }, [months]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [revRes, batRes, morRes, eggRes, wtRes, repRes] = await Promise.all([
        api.get(`/dashboard/charts/revenue?months=${months}`),
        api.get('/dashboard/charts/batches'),
        api.get('/dashboard/charts/mortality'),
        api.get('/dashboard/charts/eggs'),
        api.get('/dashboard/charts/weights'),
        api.get('/dashboard/report'),
      ]);
      setRevenue(revRes.data.chart?.data || []);
      setBatches(batRes.data.chart?.batches || []);
      setMortality(morRes.data.chart?.batches || []);
      setEggs(eggRes.data.chart?.batches || []);
      setWeights(wtRes.data.chart?.batches || []);
      setReport(repRes.data.report);
    } catch (err) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const categoryData = batches.map(b => ({
    name:     b.batchName ? b.batchName.substring(0, 12) + (b.batchName.length > 12 ? '...' : '') : '',
    profit:   b.profit,
    expenses: b.expenses,
    revenue:  b.revenue,
  }));

  const r = report;

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: 28, fontWeight: 700,
            color: C.textPrimary, marginBottom: 4,
          }}>
            Analytics
          </h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>Farm performance across all batches</p>
        </div>

        {/* Period selector */}
        <div style={{
          display: 'flex', gap: 2,
          background: C.forestSurface,
          border: `1px solid ${C.forestBorder}`,
          borderRadius: 9, padding: 4,
        }}>
          {[3, 6, 12].map(m => (
            <button
              key={m}
              onClick={() => setMonths(m)}
              style={{
                padding: '7px 16px', borderRadius: 7,
                fontSize: 12, fontWeight: 600,
                border: 'none', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                background: months === m ? C.greenFaint : 'transparent',
                color:      months === m ? C.greenGlow  : C.textMuted,
                boxShadow:  months === m ? `inset 0 0 0 1px ${C.green}` : 'none',
              }}
            >
              {m}M
            </button>
          ))}
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {loading
          ? [1,2,3,4].map(i => <Skeleton key={i} h={100} radius={12} />)
          : [
              {
                label:  'Total Batches',
                value:  fmtNum(r?.totalBatches),
                sub:    `${r?.activeBatches} active`,
                accent: 'green',
                color:  C.greenGlow,
              },
              {
                label:  'All-Time Revenue',
                value:  fmt(r?.totalRevenue),
                sub:    'Gross revenue',
                accent: 'gold',
                color:  C.goldLight,
              },
              {
                label:  'All-Time Profit',
                value:  fmt(r?.netProfit),
                sub:    `ROI: ${r?.roi || 0}%`,
                accent: r?.netProfit >= 0 ? 'green' : 'red',
                color:  r?.netProfit >= 0 ? C.greenGlow : '#E88080',
              },
              {
                label:  'Avg Profit / Batch',
                value:  fmt(r?.avgProfitPerBatch),
                sub:    'Per completed batch',
                accent: 'blue',
                color:  C.blueLight,
              },
            ].map((s, i) => <StatBox key={i} {...s} />)
        }
      </div>

      {/* ── Best & Worst Batch ── */}
      {!loading && r?.bestBatch && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {[
            {
              label:  '🏆 Best Batch',
              data:   r.bestBatch,
              color:  C.greenGlow,
              bg:     C.greenFaint,
              border: C.green,
            },
            {
              label:  '📉 Worst Batch',
              data:   r.worstBatch,
              color:  '#E88080',
              bg:     'rgba(192,57,43,0.1)',
              border: '#7B1F1F',
            },
          ].map((item, i) => {
            if (!item.data) return null;
            return (
              <div key={i} style={{
                background: item.bg,
                border: `1px solid ${item.border}`,
                borderRadius: 12,
                padding: '16px 20px',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>
                  {item.data.batchName}
                </div>
                <div style={{ display: 'flex', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>Profit</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: item.color }}>{fmt(item.data.profit)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>ROI</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: item.color }}>{item.data.roi}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>Breed</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{item.data.breed}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Revenue vs Expenses Chart ── */}
      <Card title="Revenue vs Expenses vs Profit" sub={`Last ${months} months`} style={{ marginBottom: 24 }}>
        <div style={{ padding: '20px 16px 12px' }}>
          {loading ? (
            <Skeleton h={240} radius={8} />
          ) : revenue.length ? (
            <>
              <div style={{ display: 'flex', gap: 20, marginBottom: 16, paddingLeft: 8 }}>
                {[
                  { label: 'Revenue',  color: C.greenGlow },
                  { label: 'Expenses', color: '#E88080'   },
                  { label: 'Profit',   color: C.goldLight },
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.textMuted }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                    {l.label}
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={revenue} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.forestSurface2} vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.textMuted }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: C.textMuted }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue"  name="Revenue"  fill={C.greenGlow} radius={[4,4,0,0]} maxBarSize={28} />
                  <Bar dataKey="expenses" name="Expenses" fill="#E88080"     radius={[4,4,0,0]} maxBarSize={28} />
                  <Bar dataKey="profit"   name="Profit"   fill={C.goldLight} radius={[4,4,0,0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div style={{ height: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <div style={{ fontSize: 36 }}>📊</div>
              <p style={{ fontSize: 13, color: C.textMuted }}>No financial data yet. Log expenses and sales to see charts.</p>
            </div>
          )}
        </div>
      </Card>

      {/* ── Batch Profit Comparison ── */}
      {!loading && batches.length > 0 && (
        <Card title="Batch Profit Comparison" sub="All batches ranked by profit" style={{ marginBottom: 24 }}>
          <div style={{ padding: '20px 16px 12px' }}>
            <ResponsiveContainer width="100%" height={Math.max(batches.length * 44, 120)}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={C.forestSurface2} horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: C.textMuted }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: C.textMuted }}
                  axisLine={false}
                  tickLine={false}
                  width={110}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="profit" name="Profit" radius={[0,4,4,0]} maxBarSize={22}>
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.profit >= 0 ? C.greenGlow : '#E88080'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* ── Mortality + Egg Charts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* Mortality */}
        <Card title="Mortality Rate Over Time" sub="Active batches">
          <div style={{ padding: '16px 12px 8px' }}>
            {loading ? (
              <Skeleton h={180} radius={8} />
            ) : mortality.length && mortality.some(b => b.data && b.data.length > 0) ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.forestSurface2} />
                  <XAxis dataKey="date" type="category" tick={{ fontSize: 9, fill: C.textMuted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: C.textMuted }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  {mortality.map((b, i) => (
                    <Line
                      key={b.batchId}
                      data={b.data}
                      dataKey="mortalityRate"
                      name={b.batchName}
                      stroke={CHART_COLORS[i % CHART_COLORS.length]}
                      dot={false}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ fontSize: 28 }}>✅</span>
                <p style={{ fontSize: 12, color: C.textMuted }}>No active batches or no mortality data yet.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Egg Production */}
        <Card title="Egg Production" sub="Layer batches — last 30 days">
          <div style={{ padding: '16px 12px 8px' }}>
            {loading ? (
              <Skeleton h={180} radius={8} />
            ) : eggs.length && eggs.some(b => b.data && b.data.length > 0) ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.forestSurface2} />
                  <XAxis dataKey="date" type="category" tick={{ fontSize: 9, fill: C.textMuted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: C.textMuted }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  {eggs.map((b, i) => (
                    <Line
                      key={b.batchId}
                      data={b.data}
                      dataKey="totalEggs"
                      name={b.batchName}
                      stroke={CHART_COLORS[i % CHART_COLORS.length]}
                      dot={false}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ fontSize: 28 }}>🥚</span>
                <p style={{ fontSize: 12, color: C.textMuted }}>No layer batches active.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ── Weight Growth ── */}
      {!loading && weights.length > 0 && weights.some(b => b.data && b.data.length > 0) && (
        <Card title="Weight Growth Chart" sub="Broiler & Cockerel batches" style={{ marginBottom: 24 }}>
          <div style={{ padding: '16px 12px 8px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" stroke={C.forestSurface2} />
                <XAxis dataKey="date" type="category" tick={{ fontSize: 10, fill: C.textMuted }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: C.textMuted }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `${v}kg`}
                />
                <Tooltip content={<CustomTooltip />} />
                {weights.map((b, i) => (
                  <Line
                    key={b.batchId}
                    data={b.data}
                    dataKey="avgWeightKg"
                    name={b.batchName}
                    stroke={CHART_COLORS[i % CHART_COLORS.length]}
                    dot={{ r: 3 }}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}