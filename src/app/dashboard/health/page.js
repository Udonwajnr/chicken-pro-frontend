'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../../../lib/api';

import toast from 'react-hot-toast';

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
  amberFaint:     'rgba(212,134,10,0.15)',
  blue:           '#2471A3',
  blueLight:      '#5DADE2',
  textPrimary:    '#F0EBE0',
  textSecondary:  '#A89880',
  textMuted:      '#5A6B5E',
};

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
    red:    { bg: C.redFaint,    text: '#E88080',     border: '#7B1F1F'  },
    amber:  { bg: C.amberFaint,  text: C.amberLight,  border: '#7A4A10'  },
    muted:  { bg: C.forestSurface2, text: C.textSecondary, border: C.forestBorder },
    blue:   { bg: 'rgba(36,113,163,0.15)', text: C.blueLight, border: '#1A4A6A' },
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

// ── Symptom Checker ───────────────────────────
function SymptomChecker() {
  const [selected, setSelected] = useState([]);
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [batches,  setBatches]  = useState([]);
  const [batchId,  setBatchId]  = useState('');

  useEffect(() => {
    api.get('/batches?status=active')
      .then(res => setBatches(res.data.batches || []))
      .catch(() => {});
  }, []);

  const SYMPTOMS = [
    'sudden deaths',         'twisted neck',
    'paralysis of legs',     'greenish watery diarrhoea',
    'swollen head',          'gasping and coughing',
    'loss of appetite',      'watery diarrhoea',
    'ruffled feathers',      'lethargy',
    'bloody diarrhoea',      'pale comb',
    'weight loss',           'sneezing and coughing',
    'nasal discharge',       'watery eyes',
    'drop in egg production','wart-like scabs',
    'difficulty eating',     'swollen abdomen',
    'reduced growth',        'huddling near heat',
  ];

  const toggle = s => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const check = async () => {
    if (!selected.length) { toast.error('Select at least one symptom'); return; }
    if (!batchId)         { toast.error('Select a batch first');        return; }
    setLoading(true);
    try {
      const res = await api.get(
        `/batches/${batchId}/health/symptoms?symptoms=${selected.join(',')}&livestockType=chicken`
      );
      setResult(res.data);
    } catch { toast.error('Failed to check symptoms'); }
    finally { setLoading(false); }
  };

  const urgencyColor = { CRITICAL: 'red', HIGH: 'amber', MEDIUM: 'blue' };

  return (
    <div style={{
      background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
      borderRadius: 14, overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.forestBorder}` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>🔍 Symptom Checker</div>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
          Select symptoms you are observing to get a disease diagnosis
        </div>
      </div>
      <div style={{ padding: '20px 22px' }}>

        {/* Batch selector */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.textSecondary, marginBottom: 6 }}>
            Which batch are you observing?
          </label>
          <select
            value={batchId}
            onChange={e => setBatchId(e.target.value)}
            style={{
              width: '100%', background: C.forestSurface2,
              border: `1px solid ${C.forestBorder}`, borderRadius: 8,
              padding: '10px 14px', fontSize: 13, color: C.textPrimary,
              fontFamily: 'Inter, sans-serif', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="">Select a batch...</option>
            {batches.map(b => (
              <option key={b._id} value={b._id}>{b.name} ({b.breed})</option>
            ))}
          </select>
        </div>

        {/* Symptom pills */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.textSecondary, marginBottom: 10 }}>
            Select all symptoms you see ({selected.length} selected)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SYMPTOMS.map(s => (
              <button
                key={s}
                onClick={() => toggle(s)}
                style={{
                  padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                  border: `1px solid ${selected.includes(s) ? C.green : C.forestBorder}`,
                  background: selected.includes(s) ? C.greenFaint : C.forestSurface2,
                  color: selected.includes(s) ? C.greenGlow : C.textMuted,
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                }}
              >{s}</button>
            ))}
          </div>
        </div>

        {/* Check Button */}
        <div style={{ display: 'flex', gap: 10, marginBottom: result ? 20 : 0 }}>
          <button
            onClick={check}
            disabled={loading}
            style={{
              padding: '11px 22px', borderRadius: 8, fontSize: 13, fontWeight: 700,
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? '#5A6B5E' : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
              color: '#fff', fontFamily: 'Inter, sans-serif',
              boxShadow: loading ? 'none' : '0 3px 10px rgba(45,122,58,0.3)',
            }}
          >{loading ? 'Checking...' : 'Check Symptoms'}</button>
          {selected.length > 0 && (
            <button
              onClick={() => { setSelected([]); setResult(null); }}
              style={{
                padding: '11px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                border: `1px solid ${C.forestBorder}`, background: C.forestSurface2,
                color: C.textSecondary, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >Clear ({selected.length})</button>
          )}
        </div>

        {/* Results */}
        {result && (
          <div>
            {result.topMatch && (
              <div style={{
                padding: '16px 18px', borderRadius: 10, marginBottom: 12,
                background: C.redFaint, border: '1px solid #7B1F1F',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#E88080', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  🚨 Most Likely Match
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary }}>{result.topMatch.name}</span>
                  <Badge color="red">{result.topMatch.urgency}</Badge>
                  {result.topMatch.callVet && <Badge color="red">⚕ Call Vet</Badge>}
                </div>
                <div style={{ fontSize: 13, color: '#F0A0A0', lineHeight: 1.6 }}>{result.advice}</div>
              </div>
            )}

            {result.results?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                  Other Possible Matches
                </div>
                {result.results.slice(1).map((d, i) => (
                  <div key={i} style={{
                    padding: '12px 16px', borderRadius: 9,
                    background: C.forestSurface2, border: `1px solid ${C.forestBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{d.name}</span>
                      <Badge color={urgencyColor[d.urgency] || 'muted'}>{d.urgency}</Badge>
                    </div>
                    <span style={{ fontSize: 11, color: C.textMuted }}>{d.matchCount} matches</span>
                  </div>
                ))}
              </div>
            )}

            {result.message && !result.topMatch && (
              <div style={{ padding: '14px 16px', borderRadius: 9, background: C.greenFaint, border: `1px solid ${C.green}`, fontSize: 13, color: C.greenGlow }}>
                {result.message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// MAIN HEALTH PAGE
// ══════════════════════════════════════════════
export default function HealthPage() {
  const [batches,   setBatches]   = useState([]);
  const [overviews, setOverviews] = useState({});
  const [vaccines,  setVaccines]  = useState({});
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState('overview');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const batchRes = await api.get('/batches?status=active');
      const activeBatches = batchRes.data.batches || [];
      setBatches(activeBatches);

      const [ovResults, vacResults] = await Promise.all([
        Promise.allSettled(activeBatches.map(b => api.get(`/batches/${b._id}/health/overview`))),
        Promise.allSettled(activeBatches.map(b => api.get(`/batches/${b._id}/health/vaccinations`))),
      ]);

      const ovMap  = {};
      const vacMap = {};

      ovResults.forEach((r, i) => {
        if (r.status === 'fulfilled') ovMap[activeBatches[i]._id] = r.value.data.overview;
      });
      vacResults.forEach((r, i) => {
        if (r.status === 'fulfilled') vacMap[activeBatches[i]._id] = r.value.data.vaccinations || [];
      });

      setOverviews(ovMap);
      setVaccines(vacMap);
    } catch { toast.error('Failed to load health data'); }
    finally { setLoading(false); }
  };

  const markVaccineDone = async (batchId, vid) => {
    try {
      await api.put(`/batches/${batchId}/health/vaccinations/${vid}/done`);
      toast.success('Vaccine marked as done ✓');
      fetchAll();
    } catch { toast.error('Failed to update vaccine'); }
  };

  // Aggregate alerts across all batches
  const allAlerts = batches.flatMap(b => {
    const ov = overviews[b._id];
    return (ov?.alerts || []).map(a => ({ ...a, batchName: b.name, batchId: b._id }));
  });

  // All upcoming vaccines across all batches
  const allUpcomingVaccines = batches.flatMap(b => {
    const vacs = vaccines[b._id] || [];
    return vacs
      .filter(v => !v.isDone)
      .map(v => ({ ...v, batchName: b.name, batchId: b._id }));
  }).sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  const overdueCount  = allUpcomingVaccines.filter(v => new Date(v.scheduledDate) < new Date()).length;
  const dueSoonCount  = allUpcomingVaccines.filter(v => {
    const days = Math.ceil((new Date(v.scheduledDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days >= 0 && days <= 3;
  }).length;

  const criticalBatches = batches.filter(b => overviews[b._id]?.overallStatus === 'critical').length;

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>
            💉 Health Manager
          </h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>Vaccination schedules, health alerts, and symptom checker</p>
        </div>
        <button onClick={fetchAll} style={{ padding: '9px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: `1px solid ${C.forestBorder}`, background: C.forestSurface2, color: C.textSecondary, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          ↻ Refresh
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {loading ? [1,2,3,4].map(i => <Skeleton key={i} h={100} radius={12} />) : [
          {
            icon: '⚠️', label: 'Critical Batches',
            value: criticalBatches,
            accentBar: criticalBatches > 0 ? `linear-gradient(90deg, ${C.red}, #E74C3C)` : `linear-gradient(90deg, ${C.green}, ${C.greenLight})`,
            valueColor: criticalBatches > 0 ? '#E88080' : C.greenGlow,
          },
          {
            icon: '💉', label: 'Overdue Vaccines',
            value: overdueCount,
            accentBar: overdueCount > 0 ? `linear-gradient(90deg, ${C.red}, #E74C3C)` : `linear-gradient(90deg, ${C.green}, ${C.greenLight})`,
            valueColor: overdueCount > 0 ? '#E88080' : C.greenGlow,
          },
          {
            icon: '⏰', label: 'Due This Week',
            value: dueSoonCount,
            accentBar: dueSoonCount > 0 ? `linear-gradient(90deg, ${C.amber}, ${C.amberLight})` : `linear-gradient(90deg, ${C.green}, ${C.greenLight})`,
            valueColor: dueSoonCount > 0 ? C.amberLight : C.greenGlow,
          },
          {
            icon: '🐔', label: 'Active Batches',
            value: batches.length,
            accentBar: `linear-gradient(90deg, ${C.blue}, #5DADE2)`,
            valueColor: C.blueLight,
          },
        ].map((s, i) => (
          <div key={i} style={{ background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 14, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.accentBar }} />
            <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: C.textMuted, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: s.valueColor }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Alerts ── */}
      {allAlerts.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, marginBottom: 12 }}>Active Alerts</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {allAlerts.map((a, i) => {
              const isRed = a.type === 'HIGH_MORTALITY';
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 10,
                  background: isRed ? C.redFaint : C.amberFaint,
                  border: `1px solid ${isRed ? '#7B1F1F' : '#7A4A10'}`,
                  fontSize: 13, color: isRed ? '#F0A0A0' : C.amberLight,
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{isRed ? '🚨' : '💉'}</span>
                  <span style={{ flex: 1 }}><strong>{a.batchName}:</strong> {a.message}</span>
                  <Link href={`/dashboard/batches/${a.batchId}`} style={{ fontSize: 11, fontWeight: 600, color: 'inherit', textDecoration: 'underline' }}>
                    View →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 2, background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 10, padding: 4, marginBottom: 24, width: 'fit-content' }}>
        {[
          { key: 'overview',  label: 'Batch Overview'       },
          { key: 'vaccines',  label: 'All Vaccinations'     },
          { key: 'symptoms',  label: '🔍 Symptom Checker'   },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '9px 18px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            background: tab === t.key ? C.greenFaint : 'transparent',
            color:      tab === t.key ? C.greenGlow  : C.textMuted,
            boxShadow:  tab === t.key ? `inset 0 0 0 1px ${C.green}` : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── Batch Overview Tab ── */}
      {tab === 'overview' && (
        <div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {[1,2,3,4].map(i => <Skeleton key={i} h={160} radius={12} />)}
            </div>
          ) : batches.length ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {batches.map(batch => {
                const ov = overviews[batch._id];
                const statusColor = ov?.overallStatus === 'critical' ? 'red' : ov?.overallStatus === 'warning' ? 'amber' : 'green';
                const vacs = vaccines[batch._id] || [];
                const doneCount = vacs.filter(v => v.isDone).length;
                return (
                  <div key={batch._id} style={{
                    background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
                    borderRadius: 12, overflow: 'hidden',
                  }}>
                    <div style={{
                      padding: '14px 18px', background: C.forestSurface2,
                      borderBottom: `1px solid ${C.forestBorder}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <Link href={`/dashboard/batches/${batch._id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>{batch.name}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>
                          {batch.breed?.charAt(0).toUpperCase() + batch.breed?.slice(1)} · Day {batch.daysAlive}
                        </div>
                      </Link>
                      <Badge color={statusColor}>
                        {ov?.overallStatus?.charAt(0).toUpperCase() + ov?.overallStatus?.slice(1) || 'Loading'}
                      </Badge>
                    </div>
                    <div style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
                        {[
                          { label: 'Mortality',    value: `${ov?.mortalityRate || 0}%`, color: (ov?.mortalityRate || 0) > 3 ? '#E88080' : C.greenGlow },
                          { label: 'Vaccines',     value: `${doneCount}/${vacs.length}`, color: C.textPrimary },
                          { label: 'Medications',  value: ov?.totalMedications || 0,    color: C.textPrimary },
                        ].map((s, i) => (
                          <div key={i} style={{ background: C.forestSurface2, borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                            <div style={{ fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>{s.label}</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
                          </div>
                        ))}
                      </div>
                      <Link href={`/dashboard/batches/${batch._id}`} style={{
                        display: 'block', textAlign: 'center',
                        padding: '8px 0', borderRadius: 7,
                        fontSize: 12, fontWeight: 600, color: C.greenGlow,
                        textDecoration: 'none', border: `1px solid ${C.forestBorder}`,
                        background: C.forestSurface2,
                      }}>
                        View Health Tab →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '56px', textAlign: 'center', background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 16 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>💉</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>No active batches</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>Create a batch to start tracking health and vaccinations.</div>
            </div>
          )}
        </div>
      )}

      {/* ── All Vaccinations Tab ── */}
      {tab === 'vaccines' && (
        <div style={{ background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 22px', borderBottom: `1px solid ${C.forestBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>
              All Vaccinations ({allUpcomingVaccines.length} pending)
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {overdueCount > 0 && <Badge color="red">{overdueCount} overdue</Badge>}
              {dueSoonCount > 0 && <Badge color="amber">{dueSoonCount} due soon</Badge>}
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3,4].map(i => <Skeleton key={i} h={64} radius={8} />)}
            </div>
          ) : allUpcomingVaccines.length ? (
            <div style={{ padding: '8px 22px' }}>
              {allUpcomingVaccines.map((v, i) => {
                const isOverdue = new Date(v.scheduledDate) < new Date();
                const daysUntil = Math.ceil((new Date(v.scheduledDate) - new Date()) / (1000 * 60 * 60 * 24));
                const badgeColor = isOverdue ? 'red' : daysUntil <= 1 ? 'amber' : 'muted';
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 0',
                    borderBottom: i < allUpcomingVaccines.length - 1 ? `1px solid ${C.forestBorder}` : 'none',
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                      background: isOverdue ? C.redFaint : C.amberFaint,
                      border: `1px solid ${isOverdue ? '#7B1F1F' : '#7A4A10'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                    }}>💉</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 2 }}>{v.vaccineName}</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>{v.batchName} · {v.method}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ textAlign: 'right' }}>
                        <Badge color={badgeColor}>
                          {isOverdue ? 'Overdue' : daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil}d`}
                        </Badge>
                        <div style={{ fontSize: 10, color: C.textMuted, marginTop: 3 }}>
                          {new Date(v.scheduledDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <button
                        onClick={() => markVaccineDone(v.batchId, v._id)}
                        style={{
                          padding: '6px 12px', borderRadius: 7, fontSize: 11, fontWeight: 600,
                          border: `1px solid ${C.green}`, background: C.greenFaint,
                          color: C.greenGlow, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                        }}
                      >✓ Done</button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: C.textMuted, fontSize: 13 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
              No pending vaccinations.
            </div>
          )}
        </div>
      )}

      {/* ── Symptom Checker Tab ── */}
      {tab === 'symptoms' && <SymptomChecker />}

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}