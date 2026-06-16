'use client';

import { useState, useEffect } from 'react';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
  Cell
} from 'recharts';

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const c = () => setM(window.innerWidth < 768);
    c();
    window.addEventListener('resize', c);
    return () => window.removeEventListener('resize', c);
  }, []);
  return m;
}

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

function Skeleton({ h = 20, w = '100%' }) {
  return (
    <div style={{
      height: h, width: w, borderRadius: 6,
      background: `linear-gradient(90deg,${C.forestSurface} 25%,${C.forestSurface2} 50%,${C.forestSurface} 75%)`,
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
        <div style={{
          padding: '12px 18px',
          background: C.forestSurface2,
          borderBottom: `1px solid ${C.forestBorder}`,
        }}>
          {title && <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{title}</div>}
          {sub   && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{sub}</div>}
        </div>
      )}
      {children}
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
  const isMobile = useIsMobile();

  const [revenue,   setRevenue]   = useState([]);
  const [batches,   setBatches]   = useState([]);
  const [mortality, setMortality] = useState([]);
  const [eggs,      setEggs]      = useState([]);
  const [weights,   setWeights]   = useState([]);
  const [report,    setReport]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [months,    setMonths]    = useState(6);

  useEffect(() => { fetchAll(); }, [months]);

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
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const categoryData = batches.map(b => ({
    name:     b.batchName ? b.batchName.substring(0, 12) + (b.batchName.length > 12 ? '…' : '') : '',
    profit:   b.profit,
    expenses: b.expenses,
    revenue:  b.revenue,
  }));

  const r = report;
  const pad = isMobile ? '16px 14px' : '28px 32px';

  return (
    <div style={{ padding: pad, maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: isMobile ? 16 : 28,
        flexWrap: 'wrap',
        gap: 10,
      }}>
        <div>
          <h1 style={{
            fontFamily: 'Playfair Display,Georgia,serif',
            fontSize: isMobile ? 22 : 28,
            fontWeight: 700,
            color: C.textPrimary,
            marginBottom: 4,
          }}>
            📊 Analytics
          </h1>
          <p style={{ fontSize: 12, color: C.textMuted }}>
            Farm performance across all batches
          </p>
        </div>

        {/* Period selector */}
        <div style={{
          display: 'flex', gap: 2,
          background: C.forestSurface,
          border: `1px solid ${C.forestBorder}`,
          borderRadius: 9, padding: 3,
          alignSelf: 'flex-start',
        }}>
          {[3, 6, 12].map(m => (
            <button
              key={m}
              onClick={() => setMonths(m)}
              style={{
                padding: isMobile ? '6px 12px' : '7px 16px',
                borderRadius: 7,
                fontSize: 12, fontWeight: 600,
                border: 'none', cursor: 'pointer',
                fontFamily: 'Inter,sans-serif',
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
        gap: isMobile ? 10 : 14,
        marginBottom: isMobile ? 14 : 24,
      }}>
        {loading
          ? [1,2,3,4].map(i => <Skeleton key={i} h={90} />)
          : [
              {
                icon: '🐔', label: 'Total Batches',
                value: fmtNum(r?.totalBatches),
                sub: `${r?.activeBatches} active`,
                bar: `linear-gradient(90deg,${C.green},${C.greenLight})`,
                vc: C.greenGlow,
              },
              {
                icon: '📈', label: 'All-Time Revenue',
                value: fmt(r?.totalRevenue),
                sub: 'Gross revenue',
                bar: `linear-gradient(90deg,${C.gold},${C.goldLight})`,
                vc: C.goldLight,
              },
              {
                icon: '💹', label: 'All-Time Profit',
                value: fmt(r?.netProfit),
                sub: `ROI: ${r?.roi || 0}%`,
                bar: r?.netProfit >= 0
                  ? `linear-gradient(90deg,${C.green},${C.greenLight})`
                  : `linear-gradient(90deg,${C.red},${C.redLight})`,
                vc: r?.netProfit >= 0 ? C.greenGlow : '#E88080',
              },
              {
                icon: '💰', label: 'Avg Profit / Batch',
                value: fmt(r?.avgProfitPerBatch),
                sub: 'Per completed batch',
                bar: `linear-gradient(90deg,${C.blue},${C.blueLight})`,
                vc: C.blueLight,
              },
            ].map((s, i) => (
              <div key={i} style={{
                background: C.forestSurface,
                border: `1px solid ${C.forestBorder}`,
                borderRadius: 14,
                padding: '16px 18px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: s.bar,
                }} />
                <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
                <div style={{
                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: 1.5, color: C.textMuted, marginBottom: 4,
                }}>
                  {s.label}
                </div>
                <div style={{
                  fontSize: isMobile ? 16 : 22,
                  fontWeight: 800,
                  color: s.vc,
                  marginBottom: 3,
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{s.sub}</div>
              </div>
            ))
        }
      </div>

      {/* ── Best & Worst Batch ── */}
      {!loading && r?.bestBatch && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 10 : 16,
          marginBottom: isMobile ? 14 : 24,
        }}>
          {[
            {
              label: '🏆 Best Batch', data: r.bestBatch,
              color: C.greenGlow, bg: C.greenFaint, border: C.green,
            },
            {
              label: '📉 Worst Batch', data: r.worstBatch,
              color: '#E88080', bg: 'rgba(192,57,43,0.1)', border: '#7B1F1F',
            },
          ].map((item, i) => {
            if (!item.data) return null;
            return (
              <div key={i} style={{
                background: item.bg,
                border: `1px solid ${item.border}`,
                borderRadius: 12,
                padding: '14px 18px',
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: C.textMuted,
                  textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
                }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 10 }}>
                  {item.data.batchName}
                </div>
                <div style={{ display: 'flex', gap: isMobile ? 14 : 20, flexWrap: 'wrap' }}>
                  {[
                    { l: 'Profit', v: fmt(item.data.profit) },
                    { l: 'ROI',    v: `${item.data.roi}%`  },
                    { l: 'Breed',  v: item.data.breed, small: true },
                  ].map((s, j) => (
                    <div key={j}>
                      <div style={{ fontSize: 10, color: C.textMuted }}>{s.l}</div>
                      <div style={{
                        fontSize: s.small ? 13 : 18,
                        fontWeight: s.small ? 600 : 800,
                        color: s.small ? C.textPrimary : item.color,
                      }}>
                        {s.v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Revenue vs Expenses Chart ── */}
      <Card
        title="Revenue vs Expenses vs Profit"
        sub={`Last ${months} months`}
        style={{ marginBottom: isMobile ? 14 : 24 }}
      >
        <div style={{ padding: isMobile ? '14px 8px 8px' : '20px 16px 12px' }}>
          {loading ? (
            <Skeleton h={isMobile ? 180 : 240} />
          ) : revenue.length ? (
            <>
              <div style={{ display: 'flex', gap: 14, marginBottom: 12, paddingLeft: 4, flexWrap: 'wrap' }}>
                {[
                  { label: 'Revenue',  color: C.greenGlow },
                  { label: 'Expenses', color: '#E88080'   },
                  { label: 'Profit',   color: C.goldLight },
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.textMuted }}>
                    <div style={{ width: 9, height: 9, borderRadius: 2, background: l.color }} />
                    {l.label}
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={isMobile ? 180 : 240}>
                <BarChart data={revenue} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.forestSurface2} vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: isMobile ? 9 : 11, fill: C.textMuted }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: isMobile ? 9 : 11, fill: C.textMuted }}
                    axisLine={false} tickLine={false}
                    tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`}
                    width={isMobile ? 36 : 48}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue"  name="Revenue"  fill={C.greenGlow} radius={[3,3,0,0]} maxBarSize={isMobile ? 16 : 28} />
                  <Bar dataKey="expenses" name="Expenses" fill="#E88080"     radius={[3,3,0,0]} maxBarSize={isMobile ? 16 : 28} />
                  <Bar dataKey="profit"   name="Profit"   fill={C.goldLight} radius={[3,3,0,0]} maxBarSize={isMobile ? 16 : 28} />
                </BarChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div style={{ height: isMobile ? 180 : 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <div style={{ fontSize: 32 }}>📊</div>
              <p style={{ fontSize: 13, color: C.textMuted, textAlign: 'center' }}>
                No financial data yet. Log expenses and sales to see charts.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* ── Batch Profit Comparison ── */}
      {!loading && batches.length > 0 && (
        <Card
          title="Batch Profit Comparison"
          sub="All batches ranked by profit"
          style={{ marginBottom: isMobile ? 14 : 24 }}
        >
          <div style={{ padding: isMobile ? '12px 8px 8px' : '20px 16px 12px' }}>
            <ResponsiveContainer width="100%" height={Math.max(batches.length * 44, 120)}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={C.forestSurface2} horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: isMobile ? 9 : 10, fill: C.textMuted }}
                  axisLine={false} tickLine={false}
                  tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category" dataKey="name"
                  tick={{ fontSize: isMobile ? 10 : 11, fill: C.textMuted }}
                  axisLine={false} tickLine={false}
                  width={isMobile ? 80 : 110}
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 12 : 20,
        marginBottom: isMobile ? 14 : 24,
      }}>
        {/* Mortality */}
        <Card title="Mortality Rate Over Time" sub="Active batches">
          <div style={{ padding: isMobile ? '12px 8px 8px' : '16px 12px 8px' }}>
            {loading ? (
              <Skeleton h={isMobile ? 160 : 180} />
            ) : mortality.length && mortality.some(b => b.data?.length > 0) ? (
              <ResponsiveContainer width="100%" height={isMobile ? 160 : 180}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.forestSurface2} />
                  <XAxis dataKey="date" type="category" tick={{ fontSize: 9, fill: C.textMuted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: C.textMuted }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} width={28} />
                  <Tooltip content={<CustomTooltip />} />
                  {mortality.map((b, i) => (
                    <Line
                      key={b.batchId} data={b.data}
                      dataKey="mortalityRate" name={b.batchName}
                      stroke={CHART_COLORS[i % CHART_COLORS.length]}
                      dot={false} strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: isMobile ? 160 : 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span style={{ fontSize: 28 }}>✅</span>
                <p style={{ fontSize: 12, color: C.textMuted, textAlign: 'center' }}>No mortality data yet.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Egg Production */}
        <Card title="Egg Production" sub="Layer batches — last 30 days">
          <div style={{ padding: isMobile ? '12px 8px 8px' : '16px 12px 8px' }}>
            {loading ? (
              <Skeleton h={isMobile ? 160 : 180} />
            ) : eggs.length && eggs.some(b => b.data?.length > 0) ? (
              <ResponsiveContainer width="100%" height={isMobile ? 160 : 180}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.forestSurface2} />
                  <XAxis dataKey="date" type="category" tick={{ fontSize: 9, fill: C.textMuted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: C.textMuted }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip content={<CustomTooltip />} />
                  {eggs.map((b, i) => (
                    <Line
                      key={b.batchId} data={b.data}
                      dataKey="totalEggs" name={b.batchName}
                      stroke={CHART_COLORS[i % CHART_COLORS.length]}
                      dot={false} strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: isMobile ? 160 : 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span style={{ fontSize: 28 }}>🥚</span>
                <p style={{ fontSize: 12, color: C.textMuted, textAlign: 'center' }}>No layer batches active.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ── Weight Growth ── */}
      {!loading && weights.length > 0 && weights.some(b => b.data?.length > 0) && (
        <Card title="Weight Growth Chart" sub="Broiler & Cockerel batches" style={{ marginBottom: isMobile ? 14 : 24 }}>
          <div style={{ padding: isMobile ? '12px 8px 8px' : '16px 12px 8px' }}>
            <ResponsiveContainer width="100%" height={isMobile ? 160 : 200}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" stroke={C.forestSurface2} />
                <XAxis dataKey="date" type="category" tick={{ fontSize: isMobile ? 9 : 10, fill: C.textMuted }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: isMobile ? 9 : 10, fill: C.textMuted }}
                  axisLine={false} tickLine={false}
                  tickFormatter={v => `${v}kg`}
                  width={isMobile ? 32 : 40}
                />
                <Tooltip content={<CustomTooltip />} />
                {weights.map((b, i) => (
                  <Line
                    key={b.batchId} data={b.data}
                    dataKey="avgWeightKg" name={b.batchName}
                    stroke={CHART_COLORS[i % CHART_COLORS.length]}
                    dot={{ r: isMobile ? 2 : 3 }} strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}