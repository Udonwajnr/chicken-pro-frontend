'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../../lib/api';

import toast from 'react-hot-toast';

const C = {
  forestBg:       '#0F1F14',
  forestSurface:  '#162B1C',
  forestSurface2: '#1C3524',
  forestBorder:   '#234D2E',
  forestMuted:    '#3D6B4A',
  green:          '#2D7A3A',
  greenLight:     '#3D9E4D',
  greenGlow:      '#6FCF7F',
  greenFaint:     '#1A3D22',
  gold:           '#C9A84C',
  goldLight:      '#E8C76A',
  goldFaint:      '#2A2010',
  red:            '#C0392B',
  redFaint:       'rgba(192,57,43,0.15)',
  amber:          '#D4860A',
  amberLight:     '#F0A030',
  amberFaint:     'rgba(212,134,10,0.15)',
  textPrimary:    '#F0EBE0',
  textSecondary:  '#A89880',
  textMuted:      '#5A6B5E',
};

const fmt = n => n != null ? `₦${Number(n).toLocaleString()}` : '₦0';

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
    green: { bg: C.greenFaint,  text: C.greenGlow,  border: C.green    },
    amber: { bg: C.amberFaint,  text: C.amberLight,  border: '#7A4A10'  },
    gold:  { bg: C.goldFaint,   text: C.goldLight,   border: C.gold     },
    muted: { bg: C.forestSurface2, text: C.textSecondary, border: C.forestBorder },
    blue:  { bg: 'rgba(36,113,163,0.15)', text: '#5DADE2', border: '#1A4A6A' },
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

// ── Feed Recommendation Card ──────────────────
function FeedCard({ batch, rec, loading }) {
  if (loading) return <Skeleton h={180} radius={12} />;
  if (!rec || rec.complete) return (
    <div style={{
      background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
      borderRadius: 12, padding: '18px 20px',
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>{batch.name}</div>
      <div style={{ fontSize: 12, color: C.textMuted }}>Cycle complete — birds ready for sale or culling.</div>
    </div>
  );

  const phaseColor = {
    Starter:  'green',
    Grower:   'amber',
    Finisher: 'gold',
    Chick:    'green',
    Layer:    'blue',
  }[rec.phase] || 'muted';

  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.greenFaint}, ${C.forestSurface})`,
      border: `1px solid ${C.green}`,
      borderRadius: 14, overflow: 'hidden',
      transition: 'transform 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Batch header */}
      <div style={{
        padding: '12px 18px',
        background: 'rgba(0,0,0,0.2)',
        borderBottom: `1px solid ${C.forestBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href={`/dashboard/batches/${batch._id}`} style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{batch.name}</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>
            {batch.breed?.charAt(0).toUpperCase() + batch.breed?.slice(1)} · Day {batch.daysAlive}
          </div>
        </Link>
        <Badge color={phaseColor}>{rec.phase} Phase</Badge>
      </div>

      {/* Feed amount */}
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 40, fontWeight: 900, color: C.greenGlow, lineHeight: 1 }}>
            {rec.totalKgPerDay}
          </span>
          <span style={{ fontSize: 14, color: C.textMuted }}>kg today</span>
        </div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 14 }}>
          {rec.feedType} · {rec.gPerBirdPerDay}g per bird · {rec.birdsAlive} birds alive
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Bags this week',     value: `${rec.bagsPerWeek} bags` },
            { label: 'Estimated cost/wk',  value: rec.estimatedWeeklyCost || '—' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 8, padding: '8px 12px',
            }}>
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{item.value}</div>
            </div>
          ))}
        </div>

        <Link href={`/dashboard/batches/${batch._id}`} style={{
          display: 'block', marginTop: 12,
          padding: '8px 14px', borderRadius: 7, textAlign: 'center',
          fontSize: 12, fontWeight: 600, color: C.greenGlow,
          textDecoration: 'none',
          border: `1px solid ${C.forestBorder}`,
          background: 'rgba(0,0,0,0.2)',
        }}>
          Log Feed for this Batch →
        </Link>
      </div>
    </div>
  );
}

// ── Brand Guide Modal ─────────────────────────
function BrandGuideModal({ guide, phase, onClose }) {
  if (!guide) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}
    onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
          borderRadius: 16, maxWidth: 640, width: '100%',
          maxHeight: '85vh', overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 22px', borderBottom: `1px solid ${C.forestBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, background: C.forestSurface, zIndex: 1,
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>{phase} Phase — Brand Guide</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Protein: {guide.proteinPercent}</div>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: '50%',
            background: C.forestSurface2, border: `1px solid ${C.forestBorder}`,
            color: C.textSecondary, cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Inter, sans-serif',
          }}>✕</button>
        </div>

        <div style={{ padding: '20px 22px' }}>
          {/* Warning */}
          {guide.warning && (
            <div style={{
              padding: '12px 14px', borderRadius: 8, marginBottom: 18,
              background: C.amberFaint, border: '1px solid #7A4A10',
              fontSize: 12, color: C.amberLight, lineHeight: 1.6,
            }}>
              ⚠️ {guide.warning}
            </div>
          )}

          {/* Buying Tips */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              What to Check Before Buying
            </div>
            {guide.buyingTips?.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: C.textSecondary, marginBottom: 8, lineHeight: 1.5 }}>
                <span style={{ color: C.greenGlow, flexShrink: 0 }}>✓</span>
                {tip}
              </div>
            ))}
          </div>

          {/* Brands */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              Recommended Brands
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {guide.brands?.map((brand, i) => (
                <div key={i} style={{
                  background: C.forestSurface2,
                  border: `1px solid ${C.forestBorder}`,
                  borderRadius: 10, padding: '14px 16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>{brand.name}</div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>{brand.product}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.greenGlow }}>{brand.priceRange}</div>
                      <div style={{ display: 'flex', gap: 2, marginTop: 2, justifyContent: 'flex-end' }}>
                        {[...Array(brand.rating || 0)].map((_, j) => (
                          <span key={j} style={{ color: C.gold, fontSize: 11 }}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>
                    Ingredients: {brand.ingredients?.join(', ')}
                  </div>
                  <div style={{ fontSize: 11, color: C.forestMuted }}>
                    📍 {brand.whereToBuy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// MAIN FEED PAGE
// ══════════════════════════════════════════════
export default function FeedPage() {
  const [batches,       setBatches]       = useState([]);
  const [recs,          setRecs]          = useState({});
  const [loading,       setLoading]       = useState(true);
  const [brandModal,    setBrandModal]    = useState(null); // { guide, phase }
  const [totalFeedCost, setTotalFeedCost] = useState(0);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const batchRes = await api.get('/batches?status=active');
      const activeBatches = batchRes.data.batches || [];
      setBatches(activeBatches);

      // Fetch feed recommendation for every active batch in parallel
      const recResults = await Promise.allSettled(
        activeBatches.map(b => api.get(`/batches/${b._id}/feed/recommendation`))
      );

      const costResults = await Promise.allSettled(
        activeBatches.map(b => api.get(`/batches/${b._id}/feed/cost`))
      );

      const recsMap = {};
      recResults.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          recsMap[activeBatches[i]._id] = result.value.data.recommendation;
        }
      });
      setRecs(recsMap);

      // Sum total feed cost across all batches
      let total = 0;
      costResults.forEach(result => {
        if (result.status === 'fulfilled') {
          total += result.value.data.summary?.totalCost || 0;
        }
      });
      setTotalFeedCost(total);

    } catch (err) {
      toast.error('Failed to load feed data');
    } finally {
      setLoading(false);
    }
  };

  // Total kg needed across all batches today
  const totalKgToday = Object.values(recs)
    .filter(r => r && !r.complete)
    .reduce((sum, r) => sum + (r.totalKgPerDay || 0), 0);

  // Get a sample brand guide for the info section
  const sampleRec = Object.values(recs).find(r => r && r.brandGuide);

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
            🌾 Feed Manager
          </h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>
            Today's feed recommendations across all active batches
          </p>
        </div>
        <button
          onClick={fetchAll}
          style={{
            padding: '9px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            border: `1px solid ${C.forestBorder}`, background: C.forestSurface2,
            color: C.textSecondary, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}
        >↻ Refresh</button>
      </div>

      {/* ── Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {loading ? [1,2,3].map(i => <Skeleton key={i} h={100} radius={12} />) : [
          {
            icon: '🐔', label: 'Active Batches',
            value: batches.length,
            sub: 'Batches needing feed today',
            accentBar: `linear-gradient(90deg, ${C.green}, ${C.greenLight})`,
            valueColor: C.greenGlow,
          },
          {
            icon: '🌾', label: 'Total Feed Today',
            value: `${parseFloat(totalKgToday.toFixed(1))} kg`,
            sub: 'Combined across all batches',
            accentBar: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`,
            valueColor: C.goldLight,
          },
          {
            icon: '💰', label: 'All-Time Feed Cost',
            value: fmt(totalFeedCost),
            sub: 'Total logged feed spend',
            accentBar: `linear-gradient(90deg, ${C.red}, #E74C3C)`,
            valueColor: '#E88080',
          },
        ].map((s, i) => (
          <div key={i} style={{
            background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
            borderRadius: 14, padding: '20px 22px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.accentBar }} />
            <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: C.textMuted, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.valueColor, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Feed Recommendations Grid ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>Today's Feed Recommendations</div>
          <div style={{ fontSize: 12, color: C.textMuted }}>
            {loading ? '...' : `${batches.length} active batch${batches.length !== 1 ? 'es' : ''}`}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[1,2,3].map(i => <Skeleton key={i} h={220} radius={14} />)}
          </div>
        ) : batches.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {batches.map(batch => (
              <FeedCard
                key={batch._id}
                batch={batch}
                rec={recs[batch._id]}
                loading={false}
              />
            ))}
          </div>
        ) : (
          <div style={{
            padding: '56px 32px', textAlign: 'center',
            background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
            borderRadius: 16,
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌾</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>No active batches</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>
              Create a batch to see feed recommendations.
            </div>
            <Link href="/dashboard/batches/new" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '11px 22px', borderRadius: 8, fontSize: 13, fontWeight: 700,
              background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
              color: '#fff', textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(45,122,58,0.35)',
            }}>+ Create First Batch</Link>
          </div>
        )}
      </div>

      {/* ── Feed Phase Guide ── */}
      <div style={{
        background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
        borderRadius: 14, overflow: 'hidden', marginBottom: 24,
      }}>
        <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.forestBorder}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>Feed Phase Reference</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Broiler feeding guide — tap to see brand recommendations</div>
        </div>
        <div style={{ padding: '16px 22px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[
              {
                phase:    'Starter',
                weeks:    'Week 1–2',
                gPerBird: '45g',
                protein:  '22–24%',
                feedType: 'Chick Mash',
                color:    C.greenFaint,
                border:   C.green,
                badge:    'green',
                tip:      'Never restrict feed. Chicks must eat freely at all times.',
              },
              {
                phase:    'Grower',
                weeks:    'Week 3–4',
                gPerBird: '85g',
                protein:  '20–22%',
                feedType: 'Growers Mash',
                color:    C.amberFaint,
                border:   '#7A4A10',
                badge:    'amber',
                tip:      'Check feed has DCP (Dicalcium Phosphate) for bone development.',
              },
              {
                phase:    'Finisher',
                weeks:    'Week 5–6',
                gPerBird: '125g',
                protein:  '18–20%',
                feedType: 'Finisher Mash',
                color:    C.goldFaint,
                border:   C.gold,
                badge:    'gold',
                tip:      'Must be coccidiostat-free before slaughter. Check withdrawal period.',
              },
            ].map((p, i) => (
              <div key={i} style={{
                background: p.color, border: `1px solid ${p.border}`,
                borderRadius: 12, padding: '16px 18px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Badge color={p.badge}>{p.phase}</Badge>
                  <span style={{ fontSize: 11, color: C.textMuted }}>{p.weeks}</span>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: C.textMuted }}>Feed type</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.textPrimary }}>{p.feedType}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: C.textMuted }}>Per bird/day</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.textPrimary }}>{p.gPerBird}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: C.textMuted }}>Protein</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.textPrimary }}>{p.protein}</span>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.5, paddingTop: 10, borderTop: `1px solid ${C.forestBorder}` }}>
                  💡 {p.tip}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── General Buying Tips ── */}
      <div style={{
        background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
        borderRadius: 14, padding: '22px',
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginBottom: 16 }}>
          🛒 What to Check Before Buying Feed
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {[
            { icon: '🏷️', title: 'Check protein %',        desc: 'Starter ≥22%, Grower ≥20%, Finisher ≥18%. Lower protein = slower growth.'                },
            { icon: '📅', title: 'Check manufacture date',  desc: 'Never buy feed older than 3 months. Fresh feed = better nutrients.'                       },
            { icon: '🌡️', title: 'Check storage conditions',desc: 'Feed stored in heat or humidity grows mould. Mouldy feed causes aflatoxin poisoning.'     },
            { icon: '📋', title: 'Check ingredient list',   desc: 'No ingredient list = untrustworthy product. Reputable brands always list ingredients.'     },
            { icon: '🏛️', title: 'Check NAFDAC number',    desc: 'Registered feeds meet minimum quality standards. Look for the registration number on bag.' },
            { icon: '👃', title: 'Smell and texture test',  desc: 'Good feed smells like grain. Sour or musty smell = reject immediately.'                   },
          ].map((tip, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: '12px 14px',
              background: C.forestSurface2, borderRadius: 10,
              border: `1px solid ${C.forestBorder}`,
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{tip.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 3 }}>{tip.title}</div>
                <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{tip.desc}</div>
              </div>
            </div>
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