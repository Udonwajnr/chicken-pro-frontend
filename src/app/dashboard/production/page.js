'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
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
  amber:          '#D4860A',
  amberLight:     '#F0A030',
  amberFaint:     'rgba(212,134,10,0.15)',
  blue:           '#2471A3',
  blueLight:      '#5DADE2',
  textPrimary:    '#F0EBE0',
  textSecondary:  '#A89880',
  textMuted:      '#5A6B5E',
};

const fmtNum = n => n != null ? Number(n).toLocaleString() : '0';

function Skeleton({ h = 20, w = '100%', radius = 6 }) {
  return (
    <div style={{
      height: h, width: w, borderRadius: radius,
      background: `linear-gradient(90deg, ${C.forestSurface} 25%, ${C.forestSurface2} 50%, ${C.forestSurface} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  );
}

function Badge({ children, color = 'green' }) {
  const s = {
    green:  { bg: C.greenFaint,  text: C.greenGlow,  border: C.green    },
    red:    { bg: 'rgba(192,57,43,0.15)', text: '#E88080', border: '#7B1F1F' },
    amber:  { bg: C.amberFaint,  text: C.amberLight,  border: '#7A4A10'  },
    gold:   { bg: 'rgba(201,168,76,0.15)', text: C.goldLight, border: C.gold },
    blue:   { bg: 'rgba(36,113,163,0.15)', text: C.blueLight, border: '#1A4A6A' },
    muted:  { bg: C.forestSurface2, text: C.textSecondary, border: C.forestBorder },
  }[color] || { bg: C.greenFaint, text: C.greenGlow, border: C.green };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 100,
      fontSize: 11, fontWeight: 600,
      background: s.bg, color: s.text, border: `1px solid ${s.border}`,
    }}>{children}</span>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: C.textSecondary, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
}

// ── Broiler / Cockerel Card ───────────────────
function WeightCard({ batch, overview, logs }) {
  const isReady = overview?.isReadyForSlaughter;
  const latest  = overview?.latestWeightKg;
  const target  = overview?.targetWeightKg;
  const pct     = overview?.percentOfTarget;

  const chartData = (logs || []).map(l => ({
    date:   new Date(l.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    weight: l.avgWeightKg,
  }));

  return (
    <div style={{
      background: C.forestSurface,
      border: `1px solid ${isReady ? C.green : C.forestBorder}`,
      borderRadius: 14, overflow: 'hidden',
      boxShadow: isReady ? `0 0 0 1px ${C.green}, 0 4px 14px rgba(45,122,58,0.15)` : 'none',
    }}>
      {/* Header */}
      <div style={{
        padding: '13px 18px', background: C.forestSurface2,
        borderBottom: `1px solid ${C.forestBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href={`/dashboard/batches/${batch._id}`} style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{batch.name}</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>
            {batch.breed?.charAt(0).toUpperCase() + batch.breed?.slice(1)} · Week {batch.currentWeek}
          </div>
        </Link>
        {isReady
          ? <Badge color="green">✅ Ready for Slaughter</Badge>
          : <Badge color="muted">Growing</Badge>
        }
      </div>

      <div style={{ padding: '16px 18px' }}>
        {/* Weight stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
          {[
            { label: 'Current Weight', value: latest ? `${latest}kg` : '—',    color: C.greenGlow  },
            { label: 'Target Weight',  value: target ? `${target}kg` : '—',    color: C.textPrimary },
            { label: 'Progress',       value: pct    ? `${pct}%`    : '—',
              color: isReady ? C.greenGlow : C.amberLight },
          ].map((s, i) => (
            <div key={i} style={{ background: C.forestSurface2, borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {pct != null && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ height: 6, background: C.forestSurface2, borderRadius: 100, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 100,
                width: `${Math.min(pct, 100)}%`,
                background: isReady
                  ? `linear-gradient(90deg, ${C.green}, ${C.greenLight})`
                  : `linear-gradient(90deg, ${C.amber}, ${C.amberLight})`,
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        )}

        {/* Mini chart */}
        {chartData.length > 1 && (
          <div style={{ marginBottom: 10 }}>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={chartData}>
                <Line dataKey="weight" name="Weight (kg)" stroke={C.greenGlow} dot={{ r: 2, fill: C.greenGlow }} strokeWidth={2} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: C.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div style={{ fontSize: 12, color: C.textMuted, textAlign: 'center', lineHeight: 1.5 }}>
          {overview?.readinessMessage || 'No weight logs yet. Log first weight in batch detail.'}
        </div>

        <Link href={`/dashboard/batches/${batch._id}`} style={{
          display: 'block', marginTop: 12, padding: '8px 0',
          borderRadius: 7, textAlign: 'center', fontSize: 12, fontWeight: 600,
          color: C.greenGlow, textDecoration: 'none',
          border: `1px solid ${C.forestBorder}`, background: C.forestSurface2,
        }}>Log Weight →</Link>
      </div>
    </div>
  );
}

// ── Layer Card ────────────────────────────────
function EggCard({ batch, overview, logs }) {
  const status     = overview?.productionStatus;
  const statusColor = status === 'good' ? 'green' : status === 'average' ? 'amber' : status === 'poor' ? 'red' : 'muted';

  const chartData = (logs || []).slice(0, 14).reverse().map(l => ({
    date:  new Date(l.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    eggs:  l.totalEggs,
    rate:  l.productionRate,
  }));

  return (
    <div style={{
      background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
      borderRadius: 14, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '13px 18px', background: C.forestSurface2,
        borderBottom: `1px solid ${C.forestBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href={`/dashboard/batches/${batch._id}`} style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{batch.name}</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>Layer · Week {batch.currentWeek}</div>
        </Link>
        {status && (
          <Badge color={statusColor}>
            {status === 'good' ? '✓ Good' : status === 'average' ? '⚠ Average' : '↓ Poor'} Production
          </Badge>
        )}
      </div>

      <div style={{ padding: '16px 18px' }}>
        {/* Egg stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
          {[
            { label: 'Total Eggs',   value: fmtNum(overview?.totalEggs),   color: C.textPrimary },
            { label: 'Crates',       value: overview?.totalCrates || 0,     color: C.goldLight   },
            { label: 'Today Rate',   value: overview?.todayRate != null ? `${overview.todayRate}%` : '—',
              color: overview?.todayRate >= 75 ? C.greenGlow : overview?.todayRate >= 60 ? C.amberLight : '#E88080' },
            { label: 'Broken',       value: fmtNum(overview?.totalBroken),  color: '#E88080'     },
          ].map((s, i) => (
            <div key={i} style={{ background: C.forestSurface2, borderRadius: 8, padding: '10px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Mini chart */}
        {chartData.length > 1 && (
          <div style={{ marginBottom: 10 }}>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={chartData}>
                <Line dataKey="eggs" name="Eggs" stroke={C.goldLight} dot={{ r: 2, fill: C.goldLight }} strokeWidth={2} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: C.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Production rate bar */}
        {overview?.todayRate != null && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.textMuted, marginBottom: 4 }}>
              <span>Today's production rate</span>
              <span>{overview.todayRate}% (target: 75%+)</span>
            </div>
            <div style={{ height: 5, background: C.forestSurface2, borderRadius: 100, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 100,
                width: `${Math.min(overview.todayRate, 100)}%`,
                background: overview.todayRate >= 75
                  ? `linear-gradient(90deg, ${C.green}, ${C.greenLight})`
                  : overview.todayRate >= 60
                    ? `linear-gradient(90deg, ${C.amber}, ${C.amberLight})`
                    : `linear-gradient(90deg, ${C.red}, #E74C3C)`,
              }} />
            </div>
          </div>
        )}

        <Link href={`/dashboard/batches/${batch._id}`} style={{
          display: 'block', padding: '8px 0',
          borderRadius: 7, textAlign: 'center', fontSize: 12, fontWeight: 600,
          color: C.greenGlow, textDecoration: 'none',
          border: `1px solid ${C.forestBorder}`, background: C.forestSurface2,
        }}>Log Eggs →</Link>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// MAIN PRODUCTION PAGE
// ══════════════════════════════════════════════
export default function ProductionPage() {
  const [batches,   setBatches]   = useState([]);
  const [overviews, setOverviews] = useState({});
  const [logs,      setLogs]      = useState({});
  const [loading,   setLoading]   = useState(true);
  const [view,      setView]      = useState('all');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const batchRes = await api.get('/batches?status=active');
      const activeBatches = batchRes.data.batches || [];
      setBatches(activeBatches);

      const [ovResults, logResults] = await Promise.all([
        Promise.allSettled(activeBatches.map(b => api.get(`/batches/${b._id}/production`))),
        Promise.allSettled(activeBatches.map(b => {
          const isLayer = b.breed === 'layer';
          return api.get(`/batches/${b._id}/production/${isLayer ? 'eggs' : 'weights'}`);
        })),
      ]);

      const ovMap  = {};
      const logMap = {};

      ovResults.forEach((r, i) => {
        if (r.status === 'fulfilled') ovMap[activeBatches[i]._id] = r.value.data.overview;
      });
      logResults.forEach((r, i) => {
        if (r.status === 'fulfilled') {
          const batch   = activeBatches[i];
          const isLayer = batch.breed === 'layer';
          logMap[batch._id] = isLayer
            ? (r.value.data.eggLogs    || [])
            : (r.value.data.weightLogs || []);
        }
      });

      setOverviews(ovMap);
      setLogs(logMap);
    } catch { toast.error('Failed to load production data'); }
    finally { setLoading(false); }
  };

  const layerBatches  = batches.filter(b => b.breed === 'layer');
  const weightBatches = batches.filter(b => b.breed !== 'layer');
  const readyBatches  = weightBatches.filter(b => overviews[b._id]?.isReadyForSlaughter);

  // Total eggs today across all layer batches
  const totalEggsToday = layerBatches.reduce((sum, b) => {
    return sum + (overviews[b._id]?.todayEggs || 0);
  }, 0);

  const totalCratesAllTime = layerBatches.reduce((sum, b) => {
    return sum + (overviews[b._id]?.totalCrates || 0);
  }, 0);

  const displayBatches = view === 'layers'  ? layerBatches
    : view === 'weight' ? weightBatches
    : batches;

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>
            🥚 Production Tracker
          </h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>
            Egg production for layers · Weight tracking for broilers and cockerels
          </p>
        </div>
        <button onClick={fetchAll} style={{ padding: '9px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: `1px solid ${C.forestBorder}`, background: C.forestSurface2, color: C.textSecondary, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          ↻ Refresh
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {loading ? [1,2,3,4].map(i => <Skeleton key={i} h={100} radius={12} />) : [
          {
            icon: '🐔', label: 'Active Batches',
            value: batches.length,
            sub:   `${layerBatches.length} layer · ${weightBatches.length} meat`,
            accentBar: `linear-gradient(90deg, ${C.green}, ${C.greenLight})`,
            valueColor: C.greenGlow,
          },
          {
            icon: '🥚', label: 'Eggs Today',
            value: fmtNum(totalEggsToday),
            sub:   `${totalCratesAllTime} crates all time`,
            accentBar: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`,
            valueColor: C.goldLight,
          },
          {
            icon: '✅', label: 'Ready for Slaughter',
            value: readyBatches.length,
            sub:   readyBatches.length ? readyBatches.map(b => b.name).join(', ') : 'None ready yet',
            accentBar: readyBatches.length
              ? `linear-gradient(90deg, ${C.green}, ${C.greenLight})`
              : `linear-gradient(90deg, ${C.amber}, ${C.amberLight})`,
            valueColor: readyBatches.length ? C.greenGlow : C.amberLight,
          },
          {
            icon: '🐓', label: 'Broilers / Cockerels',
            value: weightBatches.length,
            sub:   'Weight-tracked batches',
            accentBar: `linear-gradient(90deg, ${C.blue}, #5DADE2)`,
            valueColor: C.blueLight,
          },
        ].map((s, i) => (
          <div key={i} style={{ background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 14, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.accentBar }} />
            <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: C.textMuted, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.valueColor, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Ready for Slaughter Alert ── */}
      {!loading && readyBatches.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {readyBatches.map(b => (
            <div key={b._id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 18px', borderRadius: 10, marginBottom: 8,
              background: C.greenFaint, border: `1px solid ${C.green}`,
              fontSize: 13, color: C.greenGlow,
            }}>
              <span style={{ fontSize: 18 }}>✅</span>
              <span style={{ flex: 1 }}>
                <strong>{b.name}</strong> has reached target slaughter weight. Birds are ready to sell.
              </span>
              <Link href={`/dashboard/batches/${b._id}`} style={{ fontSize: 12, fontWeight: 600, color: C.greenGlow, textDecoration: 'underline' }}>
                View →
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* ── View Filter ── */}
      <div style={{ display: 'flex', gap: 2, background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 9, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        {[
          { key: 'all',    label: `All (${batches.length})`               },
          { key: 'layers', label: `🥚 Layers (${layerBatches.length})`    },
          { key: 'weight', label: `⚖️ Meat Birds (${weightBatches.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setView(t.key)} style={{
            padding: '7px 16px', borderRadius: 7, fontSize: 12, fontWeight: 600,
            border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            background: view === t.key ? C.greenFaint : 'transparent',
            color:      view === t.key ? C.greenGlow  : C.textMuted,
            boxShadow:  view === t.key ? `inset 0 0 0 1px ${C.green}` : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── Batch Grid ── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[1,2,3].map(i => <Skeleton key={i} h={280} radius={14} />)}
        </div>
      ) : displayBatches.length ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {displayBatches.map(batch => (
            batch.breed === 'layer'
              ? <EggCard    key={batch._id} batch={batch} overview={overviews[batch._id]} logs={logs[batch._id]} />
              : <WeightCard key={batch._id} batch={batch} overview={overviews[batch._id]} logs={logs[batch._id]} />
          ))}
        </div>
      ) : (
        <div style={{
          padding: '56px 32px', textAlign: 'center',
          background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
          borderRadius: 16,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🥚</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>
            {view === 'layers' ? 'No layer batches active' : view === 'weight' ? 'No meat bird batches active' : 'No active batches'}
          </div>
          <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>
            Create a batch to start tracking production.
          </div>
          <Link href="/dashboard/batches/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '11px 22px', borderRadius: 8, fontSize: 13, fontWeight: 700,
            background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
            color: '#fff', textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(45,122,58,0.35)',
          }}>+ Create Batch</Link>
        </div>
      )}

      {/* ── Layer Production Tips ── */}
      {!loading && layerBatches.length > 0 && (
        <div style={{
          marginTop: 28, background: C.forestSurface,
          border: `1px solid ${C.forestBorder}`,
          borderRadius: 14, padding: '22px',
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, marginBottom: 14 }}>
            🥚 Layer Production Tips
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {[
              { icon: '💡', tip: 'Maintain 16 hours of light per day. Use a timer-controlled bulb. Darkness reduces egg production significantly.' },
              { icon: '💡', tip: 'Collect eggs 2–3 times daily. Reduces breakage and discourages egg-eating behaviour in the flock.' },
              { icon: '💡', tip: 'Production rate below 60% for 2+ weeks = investigate. Check feed calcium, lighting, disease, and stress factors.' },
              { icon: '💡', tip: 'Cull poor layers at month 6. A bird eating feed without laying is costing you money every day.' },
            ].map((t, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, padding: '12px 14px',
                background: C.forestSurface2, borderRadius: 10,
                border: `1px solid ${C.forestBorder}`,
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{t.icon}</span>
                <span style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.6 }}>{t.tip}</span>
              </div>
            ))}
          </div>
        </div>
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