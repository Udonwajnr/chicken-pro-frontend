'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import AuthGuard from '@/components/AuthGuard';

// ── Shared Styles ──────────────────────────────


// Wrap your existing OnboardingPage like this at the bottom:

const cream = {
  bg:      '#FAF7F2',
  surface: '#F5F0E8',
  border:  '#E8DFD0',
  text:    '#2C2416',
  muted:   '#8A7560',
};
const forest = {
  bg:       '#0F1F14',
  surface:  '#162B1C',
  surface2: '#1C3524',
  border:   '#234D2E',
};
const green = {
  primary: '#2D7A3A',
  light:   '#3D9E4D',
  bright:  '#4CAF5C',
  glow:    '#6FCF7F',
  faint:   '#1A3D22',
};

const inputStyle = (focused, error) => ({
  width: '100%',
  background: error ? '#FFF5F5' : '#fff',
  border: `1.5px solid ${error ? '#C0392B' : focused ? green.primary : cream.border}`,
  borderRadius: 8,
  padding: '11px 14px',
  fontSize: 14,
  color: cream.text,
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all 0.15s',
  boxShadow: focused ? '0 0 0 3px rgba(45,122,58,0.12)' : 'none',
});

function CreamInput({ label, hint, error, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      {label && <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: cream.text, marginBottom: 6 }}>{label}</label>}
      <input
        {...props}
        style={inputStyle(focused, error)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {hint  && <p style={{ fontSize: 11, color: cream.muted,   marginTop: 5 }}>{hint}</p>}
      {error && <p style={{ fontSize: 11, color: '#C0392B',     marginTop: 5 }}>{error}</p>}
    </div>
  );
}

function CreamSelect({ label, hint, error, children, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      {label && <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: cream.text, marginBottom: 6 }}>{label}</label>}
      <select
        {...props}
        style={{ ...inputStyle(focused, error), cursor: 'pointer' }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {children}
      </select>
      {hint  && <p style={{ fontSize: 11, color: cream.muted, marginTop: 5 }}>{hint}</p>}
      {error && <p style={{ fontSize: 11, color: '#C0392B',   marginTop: 5 }}>{error}</p>}
    </div>
  );
}

// ── Step Progress Bar ──────────────────────────
function ProgressBar({ step, total }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: green.glow }}>Step {step} of {total}</span>
        <span style={{ fontSize: 12, color: cream.muted }}>{Math.round((step / total) * 100)}% complete</span>
      </div>
      <div style={{ height: 4, background: '#E8DFD0', borderRadius: 100, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 100,
          width: `${(step / total) * 100}%`,
          background: `linear-gradient(90deg, ${green.primary}, ${green.bright})`,
          transition: 'width 0.4s ease',
        }} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {['Farm Details', 'Experience', 'Goals & Preview'].map((label, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center',
            fontSize: 11, fontWeight: i + 1 <= step ? 600 : 400,
            color: i + 1 <= step ? green.primary : cream.muted,
            paddingBottom: 6,
            borderBottom: `2px solid ${i + 1 <= step ? green.primary : cream.border}`,
            transition: 'all 0.3s',
          }}>{label}</div>
        ))}
      </div>
    </div>
  );
}

// ── STEP 1 — Farm Details ──────────────────────
function Step1({ data, onChange, errors }) {
  return (
    <div>
      <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 26, fontWeight: 700, color: cream.text, marginBottom: 6 }}>
        Tell us about your farm
      </h2>
      <p style={{ fontSize: 14, color: cream.muted, marginBottom: 28, lineHeight: 1.6 }}>
        This helps us personalise your feed schedules, vaccination plans, and profit calculations.
      </p>

      <CreamInput
        label="Farm Name *"
        placeholder="e.g. Umoh's Poultry Farm"
        value={data.name}
        onChange={e => onChange('name', e.target.value)}
        error={errors.name}
      />

      <CreamInput
        label="Location"
        placeholder="e.g. Lagos, Ogun State"
        value={data.location}
        onChange={e => onChange('location', e.target.value)}
        hint="Your city or state helps us show relevant market prices"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <CreamInput
          label="Number of Pens"
          type="number"
          min="1"
          placeholder="e.g. 3"
          value={data.penCount}
          onChange={e => onChange('penCount', e.target.value)}
          hint="How many separate enclosures do you have?"
        />
        <CreamInput
          label="Total Farm Size (sqm)"
          type="number"
          min="1"
          placeholder="e.g. 500"
          value={data.sizeInSqM}
          onChange={e => onChange('sizeInSqM', e.target.value)}
          hint="Approximate total area in square metres"
        />
      </div>

      {/* Info card */}
      <div style={{
        background: '#F0F7F0', border: '1px solid #C8E6C9',
        borderRadius: 10, padding: '14px 16px',
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: green.primary, marginBottom: 3 }}>Pen size tip</div>
          <div style={{ fontSize: 12, color: '#4A7A50', lineHeight: 1.6 }}>
            Allow at least <strong>0.1 sqm per broiler</strong> and <strong>0.15 sqm per layer</strong>. Overcrowding spreads disease fast.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── STEP 2 — Experience Level ──────────────────
function Step2({ data, onChange }) {
  const LEVELS = [
    {
      key:   'beginner',
      emoji: '🌱',
      title: 'Beginner',
      desc:  'This is my first or second flock. I am still learning the basics.',
      tip:   'ChickenPro will guide you with extra tips and explanations throughout.',
    },
    {
      key:   'intermediate',
      emoji: '🐔',
      title: 'Intermediate',
      desc:  'I have raised a few batches and understand the basic cycle.',
      tip:   'You will get full features with fewer beginner prompts.',
    },
    {
      key:   'commercial',
      emoji: '🏭',
      title: 'Commercial',
      desc:  'I run multiple large batches and manage a serious poultry business.',
      tip:   'Advanced analytics, multi-batch management, and marketplace features unlocked.',
    },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 26, fontWeight: 700, color: cream.text, marginBottom: 6 }}>
        What is your experience level?
      </h2>
      <p style={{ fontSize: 14, color: cream.muted, marginBottom: 28, lineHeight: 1.6 }}>
        We use this to personalise your experience. You can change this anytime in settings.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {LEVELS.map(l => (
          <div
            key={l.key}
            onClick={() => onChange('experienceLevel', l.key)}
            style={{
              padding: '18px 20px',
              borderRadius: 12,
              border: `2px solid ${data.experienceLevel === l.key ? green.primary : cream.border}`,
              background: data.experienceLevel === l.key ? '#F0F7F0' : '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'flex-start', gap: 16,
              boxShadow: data.experienceLevel === l.key ? '0 0 0 1px #2D7A3A, 0 4px 12px rgba(45,122,58,0.12)' : 'none',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: data.experienceLevel === l.key ? green.faint : cream.surface,
              border: `1px solid ${data.experienceLevel === l.key ? green.primary : cream.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0,
            }}>{l.emoji}</div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: cream.text }}>{l.title}</span>
                {data.experienceLevel === l.key && (
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: green.primary,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, color: '#fff', fontWeight: 700,
                  }}>✓</span>
                )}
              </div>
              <p style={{ fontSize: 13, color: cream.muted, margin: 0, lineHeight: 1.5 }}>{l.desc}</p>
              {data.experienceLevel === l.key && (
                <p style={{
                  fontSize: 12, color: green.primary, marginTop: 8,
                  padding: '6px 10px', background: '#E8F5E9',
                  borderRadius: 6, display: 'inline-block',
                }}>💡 {l.tip}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── STEP 3 — Goals & Profit Preview ───────────
function Step3({ data, onChange }) {
  const [preview,        setPreview]        = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [customPrices,   setCustomPrices]   = useState({});
  const [showCustom,     setShowCustom]     = useState(false);

  const GOALS = [
    { key: 'sell_birds', emoji: '🐔', label: 'Sell Live Birds',  desc: 'Raise broilers or cockerels to sell at market' },
    { key: 'sell_eggs',  emoji: '🥚', label: 'Sell Eggs',        desc: 'Raise layers for daily egg income' },
    { key: 'both',       emoji: '🏆', label: 'Both',             desc: 'Run both meat and egg production' },
  ];

  const BREEDS = [
    { key: 'broiler',  emoji: '🐔', label: 'Broiler',  sub: '6-week cycle · Sell live birds' },
    { key: 'layer',    emoji: '🥚', label: 'Layer',    sub: '72-week cycle · Daily eggs' },
    { key: 'cockerel', emoji: '🐓', label: 'Cockerel', sub: '12-week cycle · Festive premium' },
  ];

  const fetchPreview = async (breed, qty, custom = {}) => {
    if (!breed || !qty || qty < 1) return;
    setLoadingPreview(true);
    try {
      const params = new URLSearchParams({ breed, quantity: qty, ...custom });
      const res = await api.get(`/farms/profit-preview?${params}`);
      setPreview(res.data.preview);
    } catch {
      toast.error('Could not load profit preview');
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleBreedChange = (breed) => {
    onChange('breed', breed);
    setCustomPrices({});
    setShowCustom(false);
    setPreview(null);
    if (data.quantity) fetchPreview(breed, data.quantity);
  };

  const handleQtyChange = (qty) => {
    onChange('quantity', qty);
    if (data.breed && qty > 0) fetchPreview(data.breed, qty, customPrices);
  };

  const handleCustomPrice = (key, val) => {
    const updated = { ...customPrices, [key]: val };
    setCustomPrices(updated);
    if (data.breed && data.quantity) fetchPreview(data.breed, data.quantity, updated);
  };

  const fmt = (n) => n ? `₦${Number(n).toLocaleString()}` : '—';

  return (
    <div>
      <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 26, fontWeight: 700, color: cream.text, marginBottom: 6 }}>
        What is your farming goal?
      </h2>
      <p style={{ fontSize: 14, color: cream.muted, marginBottom: 24, lineHeight: 1.6 }}>
        Choose your goal and breed, enter your flock size, and we will calculate your estimated profit — using our default Nigerian market prices or your own local prices.
      </p>

      {/* Goal Selector */}
      <div style={{ marginBottom: 22 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: cream.text, marginBottom: 10 }}>Your Goal</label>
        <div style={{ display: 'flex', gap: 10 }}>
          {GOALS.map(g => (
            <button
              key={g.key}
              type="button"
              onClick={() => onChange('goal', g.key)}
              style={{
                flex: 1, padding: '12px 10px', borderRadius: 10, cursor: 'pointer',
                border: `2px solid ${data.goal === g.key ? green.primary : cream.border}`,
                background: data.goal === g.key ? '#F0F7F0' : '#fff',
                textAlign: 'center', transition: 'all 0.2s',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 5 }}>{g.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: cream.text, marginBottom: 2 }}>{g.label}</div>
              <div style={{ fontSize: 10, color: cream.muted, lineHeight: 1.4 }}>{g.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Breed Selector */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: cream.text, marginBottom: 10 }}>Primary Breed</label>
        <div style={{ display: 'flex', gap: 10 }}>
          {BREEDS.map(b => (
            <button
              key={b.key}
              type="button"
              onClick={() => handleBreedChange(b.key)}
              style={{
                flex: 1, padding: '12px 10px', borderRadius: 10, cursor: 'pointer',
                border: `2px solid ${data.breed === b.key ? green.primary : cream.border}`,
                background: data.breed === b.key ? '#F0F7F0' : '#fff',
                textAlign: 'center', transition: 'all 0.2s',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 5 }}>{b.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: cream.text, marginBottom: 2 }}>{b.label}</div>
              <div style={{ fontSize: 10, color: cream.muted }}>{b.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Flock Size */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        <CreamInput
          label="Planned Flock Size *"
          type="number"
          min="1"
          placeholder="e.g. 200"
          value={data.quantity}
          onChange={e => handleQtyChange(e.target.value)}
          hint="How many birds are you planning to raise?"
        />
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: cream.text, marginBottom: 6 }}>Livestock Type</label>
          <select
            value={data.livestockType || 'chicken'}
            onChange={e => onChange('livestockType', e.target.value)}
            style={{ ...inputStyle(false, false), cursor: 'pointer' }}
          >
            <option value="chicken">🐔 Chicken</option>
            <option value="pig" disabled>🐷 Pig (Coming Soon)</option>
            <option value="fish" disabled>🐟 Fish (Coming Soon)</option>
          </select>
        </div>
      </div>

      {/* Custom Price Toggle */}
      {data.breed && (
        <div style={{ marginBottom: 20 }}>
          <button
            type="button"
            onClick={() => setShowCustom(p => !p)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 16px', borderRadius: 8, cursor: 'pointer',
              border: `1.5px solid ${showCustom ? green.primary : cream.border}`,
              background: showCustom ? '#F0F7F0' : '#fff',
              fontSize: 13, fontWeight: 600, color: showCustom ? green.primary : cream.muted,
              fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
            }}
          >
            <span>{showCustom ? '✓' : '✏️'}</span>
            {showCustom ? 'Using your custom prices' : 'Use my own local market prices'}
          </button>

          {showCustom && (
            <div style={{
              marginTop: 14, padding: '18px 20px',
              background: '#F5F0E8', border: '1px solid #E8DFD0', borderRadius: 12,
            }}>
              <p style={{ fontSize: 12, color: cream.muted, marginBottom: 14, lineHeight: 1.6 }}>
                Enter your actual local prices below. Leave blank to use our default Nigerian market estimates.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { key: 'customChickPrice',  label: 'Cost per chick (₦)',           placeholder: 'e.g. 1000' },
                  { key: 'customFeedCost',    label: 'Feed cost per bird (₦)',        placeholder: 'e.g. 2500' },
                  { key: 'customDrugCost',    label: 'Drugs & vaccines per bird (₦)', placeholder: 'e.g. 400' },
                  { key: 'customLaborCost',   label: 'Labor per bird (₦)',            placeholder: 'e.g. 600' },
                  { key: 'customSellPrice',   label: data.breed === 'layer' ? 'Sell price per crate (₦)' : 'Sell price per bird (₦)', placeholder: 'e.g. 4500' },
                  { key: 'customMiscCost',    label: 'Misc cost per bird (₦)',        placeholder: 'e.g. 150' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: cream.text, marginBottom: 5 }}>{f.label}</label>
                    <input
                      type="number"
                      placeholder={f.placeholder}
                      value={customPrices[f.key] || ''}
                      onChange={e => handleCustomPrice(f.key, e.target.value)}
                      style={{
                        ...inputStyle(false, false),
                        fontSize: 13, padding: '9px 12px',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Profit Preview */}
      {loadingPreview && (
        <div style={{
          padding: '24px', textAlign: 'center',
          background: forest.surface, border: `1px solid ${forest.border}`,
          borderRadius: 14,
        }}>
          <div style={{
            width: 28, height: 28, margin: '0 auto 10px',
            border: `2px solid ${forest.border}`,
            borderTopColor: green.glow, borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontSize: 13, color: '#5A6B5E' }}>Calculating your profit estimate...</p>
        </div>
      )}

      {preview && !loadingPreview && (
        <div style={{
          background: forest.surface,
          border: `1px solid ${forest.border}`,
          borderRadius: 14, overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 22px',
            background: forest.surface2,
            borderBottom: `1px solid ${forest.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#FAF7F2' }}>
                Profit Estimate — {data.quantity} {preview.breed}s
              </div>
              <div style={{ fontSize: 11, color: '#5A6B5E', marginTop: 2 }}>
                {showCustom ? 'Using your custom prices' : 'Using our Nigerian market estimates'}
              </div>
            </div>
            <span style={{
              padding: '3px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700,
              background: preview.isProfit ? green.faint : 'rgba(192,57,43,0.15)',
              color: preview.isProfit ? green.glow : '#E88080',
              border: `1px solid ${preview.isProfit ? green.primary : '#7B1F1F'}`,
            }}>
              {preview.isProfit ? '✓ Profitable' : '⚠ Loss at these prices'}
            </span>
          </div>

          {/* Key Numbers */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            borderBottom: `1px solid ${forest.border}`,
          }}>
            {[
              { label: 'Total Cost',    value: fmt(preview.totalCost),    color: '#E88080' },
              { label: 'Total Revenue', value: fmt(preview.totalRevenue),  color: green.glow },
              { label: 'Net Profit',    value: fmt(preview.totalProfit),   color: preview.isProfit ? green.glow : '#E88080' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '18px 22px', textAlign: 'center',
                borderRight: i < 2 ? `1px solid ${forest.border}` : 'none',
              }}>
                <div style={{ fontSize: 10, color: '#5A6B5E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Cost Breakdown */}
          <div style={{ padding: '18px 22px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#5A6B5E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
              Cost per bird breakdown
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {preview.costBreakdown?.map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: '#A89880' }}>{item.item}</span>
                      {item.isCustom && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: '1px 6px',
                          borderRadius: 100, background: '#2A2010',
                          color: '#C9A84C', border: '1px solid #9A7A2E',
                        }}>YOUR PRICE</span>
                      )}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#FAF7F2' }}>{fmt(item.priceUsed)}</span>
                  </div>
                  {/* Progress bar relative to total cost per bird */}
                  <div style={{ height: 3, background: forest.surface2, borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 100,
                      width: `${Math.min((item.priceUsed / preview.totalCostPerBird) * 100, 100)}%`,
                      background: `linear-gradient(90deg, ${green.primary}, ${green.bright})`,
                    }} />
                  </div>
                  <p style={{ fontSize: 11, color: '#3D6B4A', marginTop: 4, lineHeight: 1.5 }}>{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Per bird summary */}
          <div style={{
            padding: '14px 22px',
            background: forest.surface2,
            borderTop: `1px solid ${forest.border}`,
            display: 'flex', gap: 24, flexWrap: 'wrap',
          }}>
            {[
              { label: 'Profit per bird',    value: fmt(preview.profitPerBird) },
              { label: 'ROI',                value: `${preview.roi}%` },
              { label: 'Cycle',              value: `${preview.cycleWeeks} weeks` },
              ...(preview.breakEvenBirds ? [{ label: 'Break-even', value: `${preview.breakEvenBirds} birds` }] : []),
              ...(preview.breakEvenCrates ? [{ label: 'Break-even', value: `${preview.breakEvenCrates} crates` }] : []),
            ].map((item, i) => (
              <div key={i}>
                <div style={{ fontSize: 10, color: '#5A6B5E', marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: green.glow }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Tips */}
          {preview.tips?.length > 0 && (
            <div style={{ padding: '16px 22px', borderTop: `1px solid ${forest.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                💡 Pro Tips for {preview.breed}s
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {preview.tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: '#A89880', lineHeight: 1.5 }}>
                    <span style={{ color: green.glow, flexShrink: 0, fontWeight: 700 }}>→</span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!preview && !loadingPreview && data.breed && !data.quantity && (
        <div style={{
          padding: '24px', textAlign: 'center',
          background: forest.surface, border: `1px dashed ${forest.border}`,
          borderRadius: 14,
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
          <p style={{ fontSize: 13, color: '#5A6B5E' }}>Enter your flock size above to see your profit estimate.</p>
        </div>
      )}

      {!data.breed && (
        <div style={{
          padding: '24px', textAlign: 'center',
          background: forest.surface, border: `1px dashed ${forest.border}`,
          borderRadius: 14,
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🐔</div>
          <p style={{ fontSize: 13, color: '#5A6B5E' }}>Select a breed above to see the profit calculator.</p>
        </div>
      )}
    </div>
  );
}

export default function OnboardingPageWrapper() {
  return (
    <AuthGuard requireOnboarding={true}>
      <OnboardingPage />
    </AuthGuard>
  );
}
// ── MAIN ONBOARDING PAGE ───────────────────────
 function OnboardingPage() {
  const router     = useRouter();
  const { updateUser } = useAuth();

  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const [farmData, setFarmData] = useState({
    name:            '',
    location:        '',
    penCount:        '',
    sizeInSqM:       '',
    experienceLevel: 'beginner',
    goal:            'sell_birds',
    breed:           '',
    quantity:        '',
    livestockType:   'chicken',
  });

  const update = (field, value) =>
    setFarmData(p => ({ ...p, [field]: value }));

  const validateStep1 = () => {
    const e = {};
    if (!farmData.name.trim()) e.name = 'Farm name is required';
    return e;
  };

  const next = () => {
    if (step === 1) {
      const e = validateStep1();
      if (Object.keys(e).length) { setErrors(e); return; }
      setErrors({});
    }
    setStep(p => p + 1);
  };

  const back = () => setStep(p => p - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/farms', {
        name:            farmData.name,
        location:        farmData.location,
        penCount:        farmData.penCount   ? parseInt(farmData.penCount)   : undefined,
        sizeInSqM:       farmData.sizeInSqM  ? parseInt(farmData.sizeInSqM)  : undefined,
        experienceLevel: farmData.experienceLevel,
        goal:            farmData.goal,
        livestockTypes:  [farmData.livestockType || 'chicken'],
      });

      updateUser({ onboardingComplete: true });
      toast.success('Farm created! Welcome to ChickenPro 🐔');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1.4fr',
      fontFamily: 'Inter, sans-serif',
    }}>

      {/* ── LEFT — Dark Forest Side ── */}
      <div style={{
        background: 'linear-gradient(160deg, #1A3D22 0%, #0F1F14 60%, #0A1409 100%)',
        padding: '48px 40px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', bottom: '-60px', right: '-60px',
          fontSize: 220, opacity: 0.04, pointerEvents: 'none',
        }}>🐔</div>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #2D7A3A, #4CAF5C)',
            borderRadius: 9, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 18,
          }}>🐔</div>
          <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 20, fontWeight: 700, color: '#FAF7F2' }}>
            Chicken<span style={{ color: '#6FCF7F' }}>Pro</span>
          </span>
        </div>

        {/* Center content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block', padding: '5px 14px',
            borderRadius: 100, background: '#1A3D22',
            border: '1px solid #2D7A3A',
            fontSize: 11, fontWeight: 700, color: '#6FCF7F',
            letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20,
          }}>One-time setup · 3 minutes</div>

          <h1 style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: 32, fontWeight: 800,
            color: '#FAF7F2', lineHeight: 1.2, marginBottom: 16,
          }}>
            Let's set up<br />
            <span style={{
              background: 'linear-gradient(135deg, #4CAF5C, #6FCF7F)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>your farm.</span>
          </h1>

          <p style={{ fontSize: 14, color: '#5A6B5E', lineHeight: 1.7, marginBottom: 36, maxWidth: 320 }}>
            Answer 3 quick questions and ChickenPro will personalise your feed schedules, vaccination plans, and profit calculator.
          </p>

          {/* Step indicators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { num: '01', title: 'Farm Details',      desc: 'Name, location, and pen setup' },
              { num: '02', title: 'Experience Level',  desc: 'So we know how much guidance to give' },
              { num: '03', title: 'Goals & Preview',   desc: 'Your breed and profit calculator' },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                opacity: i + 1 <= step ? 1 : 0.4,
                transition: 'opacity 0.3s',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: i + 1 < step
                    ? green.primary
                    : i + 1 === step
                      ? 'linear-gradient(135deg, #2D7A3A, #4CAF5C)'
                      : forest.surface2,
                  border: `1px solid ${i + 1 <= step ? green.primary : forest.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: i + 1 < step ? 14 : 12,
                  fontWeight: 700, color: '#fff',
                  boxShadow: i + 1 === step ? '0 4px 12px rgba(45,122,58,0.4)' : 'none',
                }}>
                  {i + 1 < step ? '✓' : s.num}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#FAF7F2', marginBottom: 2 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: '#3D6B4A' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div style={{ fontSize: 12, color: '#3D6B4A', lineHeight: 1.6 }}>
          You can update all of this later in your farm settings.
        </div>
      </div>

      {/* ── RIGHT — Cream Side ── */}
      <div style={{
        background: cream.bg,
        padding: '48px 56px',
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ maxWidth: 520, width: '100%', margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column' }}>

          {/* Progress */}
          <ProgressBar step={step} total={3} />

          {/* Step Content */}
          <div style={{ flex: 1 }}>
            {step === 1 && <Step1 data={farmData} onChange={update} errors={errors} />}
            {step === 2 && <Step2 data={farmData} onChange={update} />}
            {step === 3 && <Step3 data={farmData} onChange={update} />}
          </div>

          {/* Navigation */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginTop: 32,
            paddingTop: 24, borderTop: `1px solid ${cream.border}`,
          }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={back}
                style={{
                  padding: '11px 22px', borderRadius: 8,
                  border: `1.5px solid ${cream.border}`,
                  background: 'transparent', color: cream.muted,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.target.style.borderColor = cream.text; e.target.style.color = cream.text; }}
                onMouseLeave={e => { e.target.style.borderColor = cream.border; e.target.style.color = cream.muted; }}
              >← Back</button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={next}
                style={{
                  padding: '12px 28px', borderRadius: 8,
                  border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #2D7A3A, #3D9E4D)',
                  color: '#fff', fontSize: 14, fontWeight: 700,
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 4px 14px rgba(45,122,58,0.35)',
                  transition: 'all 0.2s',
                }}
              >Continue →</button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding: '12px 28px', borderRadius: 8,
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  background: loading ? '#5A6B5E' : 'linear-gradient(135deg, #2D7A3A, #3D9E4D)',
                  color: '#fff', fontSize: 14, fontWeight: 700,
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(45,122,58,0.35)',
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'all 0.2s',
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 14, height: 14,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff', borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    Setting up farm...
                  </>
                ) : 'Complete Setup 🐔'}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        select option:disabled { color: #9CA3AF; }
      `}</style>
    </div>
  );
}