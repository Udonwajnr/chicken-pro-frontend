'use client';

import { useState, useEffect } from 'react';
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

function Badge({ children, color = 'green' }) {
  const s = {
    green:  { bg: C.greenFaint,  text: C.greenGlow,  border: C.green    },
    red:    { bg: C.redFaint,    text: '#E88080',     border: '#7B1F1F'  },
    amber:  { bg: C.amberFaint,  text: C.amberLight,  border: '#7A4A10'  },
    gold:   { bg: C.goldFaint,   text: C.goldLight,   border: C.gold     },
    muted:  { bg: C.forestSurface2, text: C.textSecondary, border: C.forestBorder },
  }[color] || { bg: C.greenFaint, text: C.greenGlow, border: C.green };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
      {children}
    </span>
  );
}

function Skeleton({ h = 20, w = '100%', radius = 6 }) {
  return (
    <div style={{ height: h, width: w, borderRadius: radius, background: `linear-gradient(90deg, ${C.forestSurface} 25%, ${C.forestSurface2} 50%, ${C.forestSurface} 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
  );
}

// ── Market Prices Section ─────────────────────
function MarketPrices({ prices, loading }) {
  const [region, setRegion] = useState('');
  const regions = prices.map(p => p.region);
  const filtered = region ? prices.filter(p => p.region === region) : prices;

  return (
    <div>
      {/* Region filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setRegion('')} style={{ padding: '7px 16px', borderRadius: 7, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', background: !region ? C.greenFaint : C.forestSurface2, color: !region ? C.greenGlow : C.textMuted, boxShadow: !region ? `inset 0 0 0 1px ${C.green}` : 'none' }}>All Regions</button>
        {regions.map(r => (
          <button key={r} onClick={() => setRegion(r)} style={{ padding: '7px 16px', borderRadius: 7, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', background: region === r ? C.greenFaint : C.forestSurface2, color: region === r ? C.greenGlow : C.textMuted, boxShadow: region === r ? `inset 0 0 0 1px ${C.green}` : 'none' }}>{r}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[1,2].map(i => <Skeleton key={i} h={200} radius={12} />)}
        </div>
      ) : filtered.map((regionData, ri) => (
        <div key={ri} style={{ background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.forestBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>📍 {regionData.region}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>Updated: {regionData.updatedAt}</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.forestSurface2 }}>
                {['Product', 'Min Price', 'Max Price', 'Unit'].map(h => (
                  <th key={h} style={{ padding: '10px 18px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: C.textMuted, borderBottom: `1px solid ${C.forestBorder}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {regionData.prices.map((p, pi) => (
                <tr key={pi} style={{ borderBottom: `1px solid ${C.forestBorder}` }}>
                  <td style={{ padding: '12px 18px', fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{p.product}</td>
                  <td style={{ padding: '12px 18px', fontSize: 13, color: C.greenGlow }}>₦{p.min.toLocaleString()}</td>
                  <td style={{ padding: '12px 18px', fontSize: 13, color: C.goldLight }}>₦{p.max.toLocaleString()}</td>
                  <td style={{ padding: '12px 18px', fontSize: 12, color: C.textMuted }}>{p.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

// ── Guides Section ────────────────────────────
function Guides({ guides, loading }) {
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState('');
  const categories = [...new Set(guides.map(g => g.category))];
  const filtered = category ? guides.filter(g => g.category === category) : guides;

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: `1px solid ${C.forestBorder}`, background: C.forestSurface2, color: C.textSecondary, cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginBottom: 20 }}>
          ← Back to Guides
        </button>
        <div style={{ background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '24px 28px', borderBottom: `1px solid ${C.forestBorder}` }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <Badge color="green">{selected.category}</Badge>
              <Badge color="muted">⏱ {selected.readTime}</Badge>
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 24, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>{selected.title}</h2>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>{selected.summary}</p>
          </div>
          <div style={{ padding: '28px' }}>
            {selected.content?.map((section, i) => (
              <div key={i} style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.textPrimary, marginBottom: 10 }}>{section.heading}</h3>
                <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.8 }}>{section.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setCategory('')} style={{ padding: '7px 16px', borderRadius: 7, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', background: !category ? C.greenFaint : C.forestSurface2, color: !category ? C.greenGlow : C.textMuted, boxShadow: !category ? `inset 0 0 0 1px ${C.green}` : 'none' }}>All</button>
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{ padding: '7px 16px', borderRadius: 7, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', background: category === c ? C.greenFaint : C.forestSurface2, color: category === c ? C.greenGlow : C.textMuted, boxShadow: category === c ? `inset 0 0 0 1px ${C.green}` : 'none' }}>{c.charAt(0).toUpperCase() + c.slice(1)}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[1,2,3,4].map(i => <Skeleton key={i} h={140} radius={12} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {filtered.map((guide, i) => (
            <div key={i}
              onClick={async () => {
                try {
                  const res = await api.get(`/knowledge/guides/${guide.id}`);
                  setSelected(res.data.guide);
                } catch { toast.error('Failed to load guide'); }
              }}
              style={{
                background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
                borderRadius: 12, padding: '20px', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.background = C.greenFaint; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.forestBorder; e.currentTarget.style.background = C.forestSurface; }}
            >
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <Badge color="green">{guide.category}</Badge>
                <Badge color="muted">⏱ {guide.readTime}</Badge>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>{guide.title}</div>
              <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>{guide.summary}</div>
              <div style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: C.greenGlow }}>Read guide →</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Diseases Section ──────────────────────────
function Diseases({ diseases, loading }) {
  const [search,   setSearch]   = useState('');
  const [urgency,  setUrgency]  = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = diseases.filter(d => {
    const matchSearch = !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.symptoms?.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchUrgency = !urgency || d.urgency === urgency;
    return matchSearch && matchUrgency;
  });

  const urgencyColor = { CRITICAL: 'red', HIGH: 'amber', MEDIUM: 'gold' };

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: `1px solid ${C.forestBorder}`, background: C.forestSurface2, color: C.textSecondary, cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginBottom: 20 }}>
          ← Back to Diseases
        </button>
        <div style={{ background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '24px 28px', borderBottom: `1px solid ${C.forestBorder}` }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <Badge color={urgencyColor[selected.urgency] || 'muted'}>{selected.urgency}</Badge>
              <Badge color="muted">{selected.affectedAge}</Badge>
              {selected.callVet && <Badge color="red">⚕ Call Vet Immediately</Badge>}
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 24, fontWeight: 700, color: C.textPrimary }}>{selected.name}</h2>
          </div>
          <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Symptoms</div>
              {selected.symptoms?.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: C.textSecondary, marginBottom: 6 }}>
                  <span style={{ color: '#E88080', flexShrink: 0 }}>●</span> {s}
                </div>
              ))}
            </div>
            <div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Cause</div>
                <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6 }}>{selected.cause}</p>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.amberLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Treatment</div>
                <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6 }}>{selected.treatment}</p>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.greenGlow, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Prevention</div>
                <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6 }}>{selected.prevention}</p>
              </div>
              {selected.tip && (
                <div style={{ padding: '12px 16px', background: C.goldFaint, border: `1px solid ${C.gold}`, borderRadius: 8, fontSize: 13, color: C.goldLight, lineHeight: 1.6 }}>
                  💡 {selected.tip}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search + Urgency filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          placeholder="Search by disease name or symptom..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 8, padding: '9px 14px', fontSize: 13, color: C.textPrimary, fontFamily: 'Inter, sans-serif', outline: 'none' }}
          onFocus={e => e.target.style.borderColor = C.green}
          onBlur={e => e.target.style.borderColor = C.forestBorder}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          {['', 'CRITICAL', 'HIGH', 'MEDIUM'].map(u => (
            <button key={u} onClick={() => setUrgency(u)} style={{ padding: '7px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', background: urgency === u ? C.greenFaint : C.forestSurface2, color: urgency === u ? C.greenGlow : C.textMuted, boxShadow: urgency === u ? `inset 0 0 0 1px ${C.green}` : 'none' }}>
              {u || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3].map(i => <Skeleton key={i} h={90} radius={12} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((d, i) => (
            <div key={i}
              onClick={async () => {
                try {
                  const name = d.name.toLowerCase().replace(/['']/g, '').replace(/\s+/g, '-');
                  const res = await api.get(`/knowledge/diseases/${name}`);
                  setSelected(res.data.disease);
                } catch { toast.error('Failed to load disease details'); }
              }}
              style={{
                background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
                borderRadius: 12, padding: '16px 20px', cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'flex-start', gap: 16,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.forestBorder; }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>{d.name}</span>
                  <Badge color={urgencyColor[d.urgency] || 'muted'}>{d.urgency}</Badge>
                  {d.callVet && <Badge color="red">⚕ Vet Required</Badge>}
                </div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Age: {d.affectedAge}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {d.symptoms?.slice(0, 3).map((s, si) => (
                    <span key={si} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: C.forestSurface2, color: C.textSecondary, border: `1px solid ${C.forestBorder}` }}>{s}</span>
                  ))}
                  {d.symptoms?.length > 3 && <span style={{ fontSize: 11, color: C.textMuted }}>+{d.symptoms.length - 3} more</span>}
                </div>
              </div>
              <span style={{ fontSize: 12, color: C.greenGlow, fontWeight: 600, flexShrink: 0 }}>View →</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', fontSize: 13, color: C.textMuted }}>
              No diseases match your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Videos Section ────────────────────────────
function Videos({ videos, loading }) {
  const [tag, setTag] = useState('');
  const allTags = [...new Set(videos.flatMap(v => v.tags || []))];
  const filtered = tag ? videos.filter(v => v.tags?.includes(tag)) : videos;

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setTag('')} style={{ padding: '7px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', background: !tag ? C.greenFaint : C.forestSurface2, color: !tag ? C.greenGlow : C.textMuted, boxShadow: !tag ? `inset 0 0 0 1px ${C.green}` : 'none' }}>All</button>
        {allTags.map(t => (
          <button key={t} onClick={() => setTag(t)} style={{ padding: '7px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', background: tag === t ? C.greenFaint : C.forestSurface2, color: tag === t ? C.greenGlow : C.textMuted, boxShadow: tag === t ? `inset 0 0 0 1px ${C.green}` : 'none' }}>{t}</button>
        ))}
      </div>
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[1,2,3,4].map(i => <Skeleton key={i} h={120} radius={12} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {filtered.map((v, i) => (
            <a key={i} href={v.url} target="_blank" rel="noopener noreferrer" style={{
              background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
              borderRadius: 12, padding: '18px 20px', textDecoration: 'none', transition: 'all 0.2s', display: 'block',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.forestBorder; }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#7F1D1D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>▶</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 4 }}>{v.title}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>{v.channel} · {v.duration}</div>
                  <div style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.5 }}>{v.description}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    {v.tags?.map((t, ti) => <span key={ti} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: C.forestSurface2, color: C.textMuted, border: `1px solid ${C.forestBorder}` }}>{t}</span>)}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Symptom Checker ───────────────────────────
function SymptomChecker() {
  const [selected, setSelected] = useState([]);
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);

  const SYMPTOM_OPTIONS = [
    'sudden deaths', 'twisted neck', 'paralysis of legs',
    'greenish watery diarrhoea', 'swollen head', 'gasping and coughing',
    'loss of appetite', 'watery diarrhoea', 'ruffled feathers',
    'lethargy', 'bloody diarrhoea', 'pale comb',
    'weight loss', 'sneezing and coughing', 'nasal discharge',
    'watery eyes', 'drop in egg production', 'wart-like scabs',
    'difficulty eating', 'swollen abdomen', 'reduced growth',
  ];

  const toggle = (s) => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const check = async () => {
    if (!selected.length) { toast.error('Select at least one symptom'); return; }
    setLoading(true);
    try {
      const res = await api.get(`/batches/placeholder/health/symptoms?symptoms=${selected.join(',')}&livestockType=chicken`);
      setResult(res.data);
    } catch {
      // Fallback — call without batch ID by using a direct endpoint
      try {
        const res = await api.get(`/knowledge/diseases?search=${selected[0]}`);
        setResult({ results: res.data.diseases?.slice(0, 3) || [], advice: 'Based on your symptoms, these diseases may match. Consult a vet for accurate diagnosis.' });
      } catch { toast.error('Failed to check symptoms'); }
    } finally { setLoading(false); }
  };

  const urgencyColor = { CRITICAL: 'red', HIGH: 'amber', MEDIUM: 'gold' };

  return (
    <div>
      <div style={{ background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 14, padding: '24px', marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>🔍 Symptom Checker</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 20, lineHeight: 1.6 }}>
          Select all symptoms you are observing in your flock. We will suggest likely diseases and recommended actions.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {SYMPTOM_OPTIONS.map(s => (
            <button key={s} onClick={() => toggle(s)} style={{
              padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: 500,
              border: `1px solid ${selected.includes(s) ? C.green : C.forestBorder}`,
              background: selected.includes(s) ? C.greenFaint : C.forestSurface2,
              color: selected.includes(s) ? C.greenGlow : C.textMuted,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
            }}>{s}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={check} disabled={loading} style={{
            padding: '11px 22px', borderRadius: 8, fontSize: 13, fontWeight: 700,
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            background: loading ? '#5A6B5E' : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
            color: '#fff', fontFamily: 'Inter, sans-serif',
            boxShadow: loading ? 'none' : '0 3px 10px rgba(45,122,58,0.3)',
          }}>{loading ? 'Checking...' : 'Check Symptoms'}</button>
          {selected.length > 0 && (
            <button onClick={() => { setSelected([]); setResult(null); }} style={{ padding: '11px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: `1px solid ${C.forestBorder}`, background: C.forestSurface2, color: C.textSecondary, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              Clear ({selected.length})
            </button>
          )}
        </div>
      </div>

      {result && (
        <div>
          {result.topMatch && (
            <div style={{ background: C.redFaint, border: '1px solid #7B1F1F', borderRadius: 12, padding: '18px 20px', marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#E88080', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>🚨 Most Likely Match</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>{result.topMatch.name}</div>
              <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 12 }}>Matched {result.topMatch.matchCount} of {selected.length} symptoms</div>
              <div style={{ fontSize: 13, color: '#F0A0A0', lineHeight: 1.6 }}>{result.advice}</div>
            </div>
          )}
          {result.results?.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {result.results.map((d, i) => (
                <div key={i} style={{ background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 10, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{d.name}</span>
                      <Badge color={urgencyColor[d.urgency] || 'muted'}>{d.urgency}</Badge>
                    </div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{d.cause || d.symptoms?.slice(0, 2).join(', ')}</div>
                  </div>
                  {d.matchCount && <span style={{ fontSize: 11, color: C.textMuted, flexShrink: 0 }}>{d.matchCount} matches</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// MAIN KNOWLEDGE HUB PAGE
// ══════════════════════════════════════════════
export default function KnowledgePage() {
  const [hub,      setHub]      = useState(null);
  const [guides,   setGuides]   = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [prices,   setPrices]   = useState([]);
  const [videos,   setVideos]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState('guides');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [hubRes, guidesRes, diseaseRes, priceRes, videoRes] = await Promise.all([
        api.get('/knowledge'),
        api.get('/knowledge/guides'),
        api.get('/knowledge/diseases'),
        api.get('/knowledge/market-prices'),
        api.get('/knowledge/videos'),
      ]);
      setHub(hubRes.data.hub);
      setGuides(guidesRes.data.guides || []);
      setDiseases(diseaseRes.data.diseases || []);
      setPrices(priceRes.data.prices || []);
      setVideos(videoRes.data.videos || []);
    } catch { toast.error('Failed to load knowledge hub'); }
    finally { setLoading(false); }
  };

  const TABS = [
    { key: 'guides',   label: '📚 Guides',          count: hub?.guides?.total         },
    { key: 'diseases', label: '🦠 Disease Library',  count: hub?.diseases?.total       },
    { key: 'prices',   label: '💰 Market Prices',    count: null                       },
    { key: 'videos',   label: '▶ Videos',            count: hub?.videos?.total         },
    { key: 'symptoms', label: '🔍 Symptom Checker',  count: null                       },
  ];

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>
          Knowledge Hub
        </h1>
        <p style={{ fontSize: 13, color: C.textMuted }}>Guides, disease library, market prices, and video tutorials</p>
      </div>

      {/* Hub Overview Cards */}
      {hub && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { icon: '📚', label: 'Guides',         value: hub.guides?.total,    sub: `${hub.guides?.categories?.length} categories` },
            { icon: '🦠', label: 'Diseases',       value: hub.diseases?.total,  sub: `${hub.diseases?.critical} critical` },
            { icon: '💰', label: 'Price Regions',  value: hub.marketPrices?.availableRegions?.length, sub: 'Nigerian cities' },
            { icon: '▶',  label: 'Video Tutorials', value: hub.videos?.total,   sub: `${hub.videos?.allTags?.length} topics` },
          ].map((s, i) => (
            <div key={i} style={{ background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.greenGlow, marginBottom: 3 }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textPrimary, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>{s.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: 2, background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 10, padding: 4, marginBottom: 24, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '9px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            background: tab === t.key ? C.greenFaint : 'transparent',
            color: tab === t.key ? C.greenGlow : C.textMuted,
            boxShadow: tab === t.key ? `inset 0 0 0 1px ${C.green}` : 'none',
            whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {t.label}
            {t.count != null && <span style={{ background: tab === t.key ? C.green : C.forestSurface2, color: tab === t.key ? '#fff' : C.textMuted, borderRadius: 100, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'guides'   && <Guides   guides={guides}   loading={loading} />}
      {tab === 'diseases' && <Diseases diseases={diseases} loading={loading} />}
      {tab === 'prices'   && <MarketPrices prices={prices} loading={loading} />}
      {tab === 'videos'   && <Videos   videos={videos}   loading={loading} />}
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