'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../../../lib/api';

import toast from 'react-hot-toast';

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
  forestMuted:    '#3D6B4A',
  green:          '#2D7A3A',
  greenLight:     '#3D9E4D',
  greenGlow:      '#6FCF7F',
  greenFaint:     '#1A3D22',
  gold:           '#C9A84C',
  goldLight:      '#E8C76A',
  red:            '#C0392B',
  redFaint:       'rgba(192,57,43,0.15)',
  amber:          '#D4860A',
  amberFaint:     'rgba(212,134,10,0.15)',
  blue:           '#2471A3',
  blueFaint:      'rgba(36,113,163,0.15)',
  textPrimary:    '#F0EBE0',
  textSecondary:  '#A89880',
  textMuted:      '#5A6B5E',
};

const fmt    = n => n != null ? `₦${Number(n).toLocaleString()}` : '₦0';
const fmtNum = n => n != null ? Number(n).toLocaleString() : '0';

function Badge({ children, color = 'green' }) {
  const s = {
    green: { bg: C.greenFaint,  text: C.greenGlow,  border: C.green    },
    red:   { bg: C.redFaint,    text: '#E88080',     border: '#7B1F1F'  },
    amber: { bg: C.amberFaint,  text: '#F0A030',     border: '#7A4A10'  },
    gold:  { bg: 'rgba(201,168,76,0.15)', text: C.goldLight, border: C.gold },
    muted: { bg: C.forestSurface2, text: C.textSecondary, border: C.forestBorder },
    blue:  { bg: C.blueFaint,   text: '#5DADE2',     border: '#1A4A6A'  },
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

function BatchCard({ batch, onDelete }) {
  const mortality = parseFloat(batch.mortalityRate || 0);
  const isCritical = mortality > 3;
  const breedColor = { broiler: 'green', layer: 'blue', cockerel: 'amber' };
  const statusColor = batch.status === 'active'
    ? (isCritical ? 'red' : 'green')
    : batch.status === 'completed' ? 'muted' : 'blue';

  const progress = batch.cycleWeeks
    ? Math.min((batch.currentWeek / batch.cycleWeeks) * 100, 100)
    : 0;

  return (
    <div style={{
      background: C.forestSurface,
      border: `1px solid ${isCritical ? '#7B1F1F' : C.forestBorder}`,
      borderRadius: 14, overflow: 'hidden',
      transition: 'all 0.2s',
      boxShadow: isCritical ? '0 0 0 1px rgba(192,57,43,0.3)' : 'none',
    }}>
      {/* Top accent */}
      <div style={{
        height: 3,
        background: isCritical
          ? `linear-gradient(90deg, ${C.red}, #E74C3C)`
          : batch.status === 'active'
            ? `linear-gradient(90deg, ${C.green}, ${C.greenLight})`
            : `linear-gradient(90deg, ${C.forestBorder}, ${C.forestMuted})`,
      }} />

      <div style={{ padding: '18px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <Link href={`/dashboard/batches/${batch._id}`} style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>{batch.name}</div>
            </Link>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Badge color={breedColor[batch.breed] || 'green'}>{batch.breed?.charAt(0).toUpperCase() + batch.breed?.slice(1)}</Badge>
              <Badge color={statusColor}>
                {batch.status === 'active' && isCritical ? '● Critical' : batch.status?.charAt(0).toUpperCase() + batch.status?.slice(1)}
              </Badge>
            </div>
          </div>
          <div style={{ fontSize: 28 }}>
            {batch.breed === 'layer' ? '🥚' : batch.breed === 'cockerel' ? '🐓' : '🐔'}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
          {[
            { label: 'Day',        value: `Day ${batch.daysAlive}` },
            { label: 'Alive',      value: fmtNum(batch.currentAlive), color: C.greenGlow },
            { label: 'Mortality',  value: `${mortality}%`, color: isCritical ? '#E88080' : C.greenGlow },
          ].map((s, i) => (
            <div key={i} style={{
              background: C.forestSurface2, borderRadius: 8,
              padding: '10px 12px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: s.color || C.textPrimary }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Cycle progress */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.textMuted, marginBottom: 5 }}>
            <span>Week {batch.currentWeek} of {batch.cycleWeeks || '?'}</span>
            <span>{progress.toFixed(0)}% complete</span>
          </div>
          <div style={{ height: 5, background: C.forestSurface2, borderRadius: 100, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 100,
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${C.green}, ${C.greenLight})`,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {/* Dates */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.textMuted, marginBottom: 16 }}>
          <span>Started {new Date(batch.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          {batch.targetDate && (
            <span>Target {new Date(batch.targetDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`/dashboard/batches/${batch._id}`} style={{
            flex: 1, padding: '9px 0', borderRadius: 8,
            background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
            color: '#fff', fontSize: 13, fontWeight: 600,
            textDecoration: 'none', textAlign: 'center',
            boxShadow: '0 3px 10px rgba(45,122,58,0.3)',
          }}>View Details</Link>
          <button
            onClick={() => onDelete(batch._id, batch.name)}
            style={{
              padding: '9px 14px', borderRadius: 8,
              background: C.forestSurface2, border: `1px solid ${C.forestBorder}`,
              color: '#E88080', fontSize: 13, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >🗑</button>
        </div>
      </div>
    </div>
  );
}

export default function BatchListPage() {
  const [batches,    setBatches]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState('all');
  const [search,     setSearch]     = useState('');
  const [deleting,   setDeleting]   = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
const isMobile = useIsMobile();
  useEffect(() => { fetchBatches(); }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await api.get('/batches');
      setBatches(res.data.batches || []);
    } catch { toast.error('Failed to load batches'); }
    finally { setLoading(false); }
  };

  const handleDelete = (id, name) => setConfirmDel({ id, name });

  const confirmDelete = async () => {
    if (!confirmDel) return;
    setDeleting(confirmDel.id);
    try {
      await api.delete(`/batches/${confirmDel.id}`);
      setBatches(p => p.filter(b => b._id !== confirmDel.id));
      toast.success('Batch deleted');
      setConfirmDel(null);
    } catch { toast.error('Failed to delete batch'); }
    finally { setDeleting(null); }
  };

  const filtered = batches.filter(b => {
    const matchStatus = filter === 'all' || b.status === filter;
    const matchSearch = b.name?.toLowerCase().includes(search.toLowerCase()) ||
                        b.breed?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all:       batches.length,
    active:    batches.filter(b => b.status === 'active').length,
    completed: batches.filter(b => b.status === 'completed').length,
    sold:      batches.filter(b => b.status === 'sold').length,
  };

  return (
    <div style={{ padding: isMobile ? '16px 14px' : '28px 32px', maxWidth: 1200, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>
            My Batches
          </h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>
            {counts.active} active · {counts.completed} completed · {counts.sold} sold
          </p>
        </div>
        <Link href="/dashboard/batches/new" style={{
          padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700,
          background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
          color: '#fff', textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(45,122,58,0.35)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>+ Create Batch</Link>
      </div>

      {/* Filters + Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {/* Status tabs */}
        <div style={{
          display: 'flex', gap: 2,
          background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
          borderRadius: 9, padding: 4,
        }}>
          {[
            { key: 'all',       label: `All (${counts.all})`             },
            { key: 'active',    label: `Active (${counts.active})`       },
            { key: 'completed', label: `Completed (${counts.completed})` },
            { key: 'sold',      label: `Sold (${counts.sold})`           },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '7px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: 'Inter, sans-serif',
                background: filter === tab.key ? C.greenFaint : 'transparent',
                color: filter === tab.key ? C.greenGlow : C.textMuted,
                boxShadow: filter === tab.key ? `inset 0 0 0 1px ${C.green}` : 'none',
              }}
            >{tab.label}</button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search batches..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, maxWidth: 280,
            background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
            borderRadius: 8, padding: '9px 14px',
            fontSize: 13, color: C.textPrimary,
            fontFamily: 'Inter, sans-serif', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = C.green}
          onBlur={e => e.target.style.borderColor = C.forestBorder}
        />
      </div>

      {/* Batch Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ background: C.forestSurface, borderRadius: 14, padding: 20, border: `1px solid ${C.forestBorder}` }}>
              <Skeleton h={20} w="70%" radius={6} />
              <div style={{ height: 12 }} />
              <Skeleton h={14} w="40%" radius={6} />
              <div style={{ height: 20 }} />
              <Skeleton h={60} radius={8} />
              <div style={{ height: 12 }} />
              <Skeleton h={36} radius={8} />
            </div>
          ))}
        </div>
      ) : filtered.length ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {filtered.map(batch => (
            <BatchCard key={batch._id} batch={batch} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div style={{
          padding: '72px 32px', textAlign: 'center',
          background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
          borderRadius: 16,
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🐔</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>
            {search ? 'No batches match your search' : 'No batches yet'}
          </h3>
          <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>
            {search ? 'Try a different search term' : 'Create your first batch to start tracking your flock.'}
          </p>
          {!search && (
            <Link href="/dashboard/batches/new" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '11px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700,
              background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
              color: '#fff', textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(45,122,58,0.35)',
            }}>+ Create First Batch</Link>
          )}
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDel && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
            borderRadius: 16, padding: '32px', maxWidth: 400, width: '90%',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>Delete Batch?</h3>
            <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 24, lineHeight: 1.6 }}>
              Are you sure you want to delete <strong style={{ color: C.textPrimary }}>{confirmDel.name}</strong>?
              This will also delete all daily updates, feed logs, medications, and vaccinations for this batch.
              <strong style={{ color: '#E88080' }}> This cannot be undone.</strong>
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setConfirmDel(null)}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 8,
                  background: C.forestSurface2, border: `1px solid ${C.forestBorder}`,
                  color: C.textSecondary, fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}
              >Cancel</button>
              <button
                onClick={confirmDelete}
                disabled={!!deleting}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 8,
                  background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
                  border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  opacity: deleting ? 0.7 : 1,
                }}
              >{deleting ? 'Deleting...' : 'Yes, Delete'}</button>
            </div>
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