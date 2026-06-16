'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/useMediaQuery';
import toast from 'react-hot-toast';

const inputStyle = {
  width: '100%', background: '#fff',
  border: '1.5px solid #E8DFD0', borderRadius: 8,
  padding: '12px 16px', fontSize: 14, color: '#2C2416',
  fontFamily: 'Inter, sans-serif', outline: 'none',
  transition: 'all 0.15s', boxSizing: 'border-box',
};
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#2C2416', marginBottom: 6, letterSpacing: '0.3px' };

function InputField({ label, error, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={labelStyle}>{label}</label>
      <input {...props}
        style={{ ...inputStyle, ...(focused ? { borderColor: '#2D7A3A', boxShadow: '0 0 0 3px rgba(45,122,58,0.12)' } : {}), ...(error ? { borderColor: '#C0392B', background: '#FFF5F5' } : {}) }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      />
      {error && <p style={{ fontSize: 11, color: '#C0392B', marginTop: 5 }}>{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const isMobile = useIsMobile();

  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', password: '', confirm: '', goal: 'farm' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const update = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const user = await register({ name: form.name, email: form.email, phone: form.phone, location: form.location, password: form.password });
      toast.success(`Welcome to ChickenPro, ${user.name.split(' ')[0]}!`);
      if (form.goal === 'marketplace') {
        router.push('/marketplace');
      } else {
        router.push(user.onboardingComplete ? '/dashboard' : '/onboarding');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      if (msg.toLowerCase().includes('email')) setErrors({ email: 'This email is already registered' });
    } finally { setLoading(false); }
  };

  const BENEFITS = [
    { icon: '💉', text: 'Auto-generated vaccination schedules' },
    { icon: '🌾', text: 'Smart feed calculator with brand guide' },
    { icon: '💰', text: 'Real-time profit & loss tracking' },
    { icon: '🐔', text: 'Multi-batch flock management' },
    { icon: '🏪', text: 'Marketplace to buy & sell directly' },
    { icon: '📊', text: 'Farm analytics & performance reports' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: isMobile ? 'flex' : 'grid',
      gridTemplateColumns: isMobile ? undefined : '1fr 1fr',
      flexDirection: isMobile ? 'column' : undefined,
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* ── Left — Only show on desktop ── */}
      {!isMobile && (
        <div style={{
          background: 'linear-gradient(160deg, #1A3D22 0%, #0F1F14 60%, #0A1409 100%)',
          padding: '48px', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', bottom: -60, right: -60, fontSize: 240, opacity: 0.04, pointerEvents: 'none', lineHeight: 1 }}>🐔</div>

          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #2D7A3A, #4CAF5C)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🐔</div>
            <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 22, fontWeight: 700, color: '#FAF7F2' }}>Chicken<span style={{ color: '#6FCF7F' }}>Pro</span></span>
          </a>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 100, background: '#1A3D22', border: '1px solid #2D7A3A', fontSize: 11, fontWeight: 700, color: '#6FCF7F', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Free Forever — No Credit Card</div>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 38, fontWeight: 800, color: '#FAF7F2', lineHeight: 1.2, marginBottom: 16 }}>
              Join 5,000+ Nigerian<br /><span style={{ background: 'linear-gradient(135deg, #4CAF5C, #6FCF7F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>poultry farmers.</span>
            </h1>
            <p style={{ fontSize: 15, color: '#5A6B5E', lineHeight: 1.7, marginBottom: 36, maxWidth: 380 }}>
              ChickenPro gives you every tool to plan, manage, and profit from your farm — starting today.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {BENEFITS.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: '#162B1C', border: '1px solid #234D2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{b.icon}</div>
                  <span style={{ fontSize: 14, color: '#A89880' }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 32, padding: '20px 24px', background: 'rgba(22,43,28,0.6)', border: '1px solid #1C3524', borderRadius: 12 }}>
            {[{ value: '5,000+', label: 'Active Farmers' }, { value: '98%', label: 'Flock Survival' }, { value: '₦2.4B', label: 'Revenue Tracked' }].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#6FCF7F' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#3D6B4A', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Right — Form ── */}
      <div style={{
        background: '#FAF7F2',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: isMobile ? '24px 20px' : '48px 56px',
        overflowY: 'auto', flex: isMobile ? 1 : undefined,
      }}>
        <div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}>

          {/* Mobile logo */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #2D7A3A, #4CAF5C)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🐔</div>
              <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 18, fontWeight: 700, color: '#2C2416' }}>Chicken<span style={{ color: '#2D7A3A' }}>Pro</span></span>
            </div>
          )}

          <div style={{ marginBottom: isMobile ? 20 : 32 }}>
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: isMobile ? 24 : 28, fontWeight: 700, color: '#2C2416', marginBottom: 6 }}>Create your account</h2>
            <p style={{ fontSize: 14, color: '#8A7560' }}>Set up your farm in under 3 minutes.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <InputField label="Full Name *" type="text" placeholder="e.g. Umoh Udonwa" value={form.name} onChange={update('name')} error={errors.name} />
            <InputField label="Email Address *" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} error={errors.email} />

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
              <InputField label="Phone Number" type="tel" placeholder="08012345678" value={form.phone} onChange={update('phone')} />
              <InputField label="Location" type="text" placeholder="Lagos, Ogun..." value={form.location} onChange={update('location')} />
            </div>

            {/* Goal selector */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ ...labelStyle, marginBottom: 8 }}>I want to...</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { key: 'farm', emoji: '🌾', label: 'Manage my farm' },
                  { key: 'marketplace', emoji: '🛒', label: 'Buy & sell products' },
                ].map(g => (
                  <button key={g.key} type="button" onClick={() => setForm(p => ({ ...p, goal: g.key }))} style={{
                    flex: 1, padding: '12px 10px', borderRadius: 10, cursor: 'pointer',
                    border: `2px solid ${form.goal === g.key ? '#2D7A3A' : '#E8DFD0'}`,
                    background: form.goal === g.key ? '#F0F7F0' : '#fff',
                    fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                  }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{g.emoji}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#2C2416' }}>{g.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 18, position: 'relative' }}>
              <label style={labelStyle}>Password *</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} placeholder="Minimum 6 characters"
                  value={form.password} onChange={update('password')}
                  style={{ ...inputStyle, paddingRight: 44, ...(errors.password ? { borderColor: '#C0392B', background: '#FFF5F5' } : {}) }}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#8A7560',
                }}>{showPass ? '🙈' : '👁️'}</button>
              </div>
              {errors.password && <p style={{ fontSize: 11, color: '#C0392B', marginTop: 5 }}>{errors.password}</p>}
            </div>

            <InputField label="Confirm Password *" type="password" placeholder="Repeat your password" value={form.confirm} onChange={update('confirm')} error={errors.confirm} />

            <p style={{ fontSize: 12, color: '#8A7560', marginBottom: 20, lineHeight: 1.6 }}>
              By creating an account you agree to our <a href="/terms" style={{ color: '#2D7A3A', fontWeight: 600, textDecoration: 'none' }}>Terms</a> and <a href="/privacy" style={{ color: '#2D7A3A', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</a>.
            </p>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px 24px', borderRadius: 9, fontSize: 15, fontWeight: 700,
              color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? '#5A6B5E' : 'linear-gradient(135deg, #2D7A3A, #3D9E4D)',
              boxShadow: loading ? 'none' : '0 6px 20px rgba(45,122,58,0.4)',
              fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {loading ? 'Creating account...' : 'Create Free Account →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#E8DFD0' }} />
            <span style={{ fontSize: 12, color: '#8A7560' }}>Already have an account?</span>
            <div style={{ flex: 1, height: 1, background: '#E8DFD0' }} />
          </div>

          <a href="/login" style={{
            display: 'block', textAlign: 'center', padding: '12px 24px', borderRadius: 9,
            fontSize: 14, fontWeight: 600, color: '#2D7A3A', textDecoration: 'none',
            border: '1.5px solid #2D7A3A', background: 'transparent',
          }}>Sign in instead</a>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { border-color: #2D7A3A !important; box-shadow: 0 0 0 3px rgba(45,122,58,0.12) !important; }
      `}</style>
    </div>
  );
}