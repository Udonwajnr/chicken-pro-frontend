'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '../../../../lib/api';

import toast from 'react-hot-toast';

const C = {
  forestSurface:  '#162B1C',
  forestSurface2: '#1C3524',
  forestBorder:   '#234D2E',
  green:          '#2D7A3A',
  greenLight:     '#3D9E4D',
  greenGlow:      '#6FCF7F',
  greenFaint:     '#1A3D22',
  red:            '#C0392B',
  textPrimary:    '#F0EBE0',
  textSecondary:  '#A89880',
  textMuted:      '#5A6B5E',
};

const inputStyle = (focused) => ({
  width: '100%',
  background: C.forestSurface2,
  border: `1.5px solid ${focused ? C.green : C.forestBorder}`,
  borderRadius: 8, padding: '11px 14px',
  fontSize: 14, color: C.textPrimary,
  fontFamily: 'Inter, sans-serif', outline: 'none',
  transition: 'all 0.15s', boxSizing: 'border-box',
  boxShadow: focused ? '0 0 0 3px rgba(45,122,58,0.15)' : 'none',
});

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {label && <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.textSecondary, marginBottom: 6 }}>{label}</label>}
      {children}
      {hint && <p style={{ fontSize: 11, color: C.textMuted, marginTop: 5 }}>{hint}</p>}
    </div>
  );
}

function Input({ label, hint, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <Field label={label} hint={hint}>
      <input {...props} style={inputStyle(focused)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
    </Field>
  );
}

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();

  const [profile, setProfile] = useState({
    name:     user?.name     || '',
    phone:    user?.phone    || '',
    location: user?.location || '',
  });
  const [saving, setSaving] = useState(false);

  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [savingPw,  setSavingPw]  = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', profile);
      updateUser(res.data.user);
      toast.success('Profile updated');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const Section = ({ title, desc, children }) => (
    <div style={{ background: C.forestSurface, border: `1px solid ${C.forestBorder}`, borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${C.forestBorder}` }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>{title}</div>
        {desc && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>{desc}</div>}
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );

  return (
    <div style={{ padding: '28px 32px', maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 13, color: C.textMuted }}>Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Section title="Profile Information" desc="Update your name, phone and location">
        <form onSubmit={saveProfile}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: `linear-gradient(135deg, ${C.green}, #C9A84C)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary }}>{user?.name}</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>{user?.email}</div>
            </div>
          </div>
          <Input label="Full Name *" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Input label="Phone Number" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="08012345678" />
            <Input label="Location" value={profile.location} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} placeholder="Lagos, Nigeria" />
          </div>
          <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
            <button type="submit" disabled={saving} style={{ padding: '11px 22px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', background: saving ? '#5A6B5E' : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`, color: '#fff', fontFamily: 'Inter, sans-serif', boxShadow: saving ? 'none' : '0 3px 10px rgba(45,122,58,0.3)' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Section>

      {/* Account Info */}
      <Section title="Account Information" desc="Your account details">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Email Address', value: user?.email       },
            { label: 'Account Role',  value: user?.role        },
            { label: 'Member Since',  value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
            { label: 'Farm Setup',    value: user?.onboardingComplete ? '✓ Complete' : '✗ Incomplete' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.forestBorder}` }}>
              <span style={{ fontSize: 13, color: C.textMuted }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{item.value}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Danger Zone */}
      <Section title="Session" desc="Manage your current session">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 3 }}>Sign out of ChickenPro</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>You will need to log in again to access your farm.</div>
          </div>
          <button onClick={logout} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: `1px solid ${C.red}`, background: 'rgba(192,57,43,0.1)', color: '#E88080', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Sign Out
          </button>
        </div>
      </Section>
    </div>
  );
}