'use client';

import { useState, useEffect } from 'react';

const NAV_LINKS = ['Features', 'How It Works', 'Pricing', 'Knowledge'];

const STATS = [
  { value: '5,000+', label: 'Farmers using ChickenPro' },
  { value: '₦2.4B',  label: 'Farm revenue tracked' },
  { value: '98%',    label: 'Average flock survival' },
  { value: '6 wks',  label: 'Fastest broiler cycle' },
];

const FEATURES = [
  {
    icon: '🐔',
    title: 'Batch Management',
    desc: 'Create and track multiple flocks at once. Every bird accounted for from day one to sale day. Mortality alerts fire automatically when death rate crosses 3%.',
    tag: 'Core Feature',
  },
  {
    icon: '🌾',
    title: 'Smart Feed Calculator',
    desc: 'Know exactly how much to feed today based on bird age and breed. Full brand guide with Nigerian market prices, ingredients to look for, and where to buy.',
    tag: 'Save Money',
  },
  {
    icon: '💉',
    title: 'Vaccination Scheduler',
    desc: 'Auto-generated vaccination schedule the moment you create a batch. Never miss Newcastle, Gumboro, or Fowl Pox again. Reminders before every due date.',
    tag: 'Save Lives',
  },
  {
    icon: '🥚',
    title: 'Production Tracking',
    desc: 'Daily egg logs for layers with production rate alerts. Weekly weight tracking for broilers with slaughter readiness indicator when birds hit 1.8kg.',
    tag: 'Know Your Numbers',
  },
  {
    icon: '💰',
    title: 'Finance & P&L',
    desc: 'Log every expense and every sale. See your real profit per bird, ROI, and break-even price. Know exactly when you are making or losing money.',
    tag: 'Make More Profit',
  },
  {
    icon: '🏪',
    title: 'Marketplace',
    desc: 'Buy and sell birds, eggs, feed, and equipment directly in the app. Escrow payments protect both buyers and sellers. Verified seller badges build trust.',
    tag: 'Coming Soon',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Set up your farm',
    desc: 'Tell us about your farm — size, experience level, and goals. Our onboarding wizard takes less than 3 minutes.',
  },
  {
    num: '02',
    title: 'Create your first batch',
    desc: 'Enter your breed, quantity, and start date. Vaccination schedule is auto-generated instantly. No manual work.',
  },
  {
    num: '03',
    title: 'Track daily',
    desc: 'Log your daily update in under 30 seconds. Feed recommendation, health alerts, and profit tracking update automatically.',
  },
  {
    num: '04',
    title: 'Sell smarter',
    desc: 'Know your exact cost per bird and break-even price before you negotiate. List birds on the marketplace when ready.',
  },
];

const BREEDS = [
  {
    name: 'Broiler',
    emoji: '🐔',
    cycle: '6 weeks',
    profit: '₦100–₦500',
    unit: 'per bird',
    desc: 'Fast cycle, high volume. Best for consistent monthly income.',
    color: 'from-green-900/40 to-green-950/40',
    border: 'border-green-800/40',
    badge: 'Most Popular',
    badgeColor: 'bg-green-900/60 text-green-300 border-green-700',
  },
  {
    name: 'Layer',
    emoji: '🥚',
    cycle: '72 weeks',
    profit: '₦7,600',
    unit: 'per bird/year',
    desc: 'Daily egg income for 18 months. Patient farmers win big.',
    color: 'from-amber-900/30 to-amber-950/40',
    border: 'border-amber-800/40',
    badge: 'Best ROI',
    badgeColor: 'bg-amber-900/60 text-amber-300 border-amber-700',
  },
  {
    name: 'Cockerel',
    emoji: '🐓',
    cycle: '12 weeks',
    profit: '₦1,000–₦3,000',
    unit: 'festive season',
    desc: 'Time to Christmas or Eid for maximum profit.',
    color: 'from-blue-900/30 to-blue-950/40',
    border: 'border-blue-800/40',
    badge: 'Festive Gold',
    badgeColor: 'bg-blue-900/60 text-blue-300 border-blue-700',
  },
];

const TESTIMONIALS = [
  {
    name: 'Chukwuemeka Obi',
    role: 'Broiler Farmer · Ogun State',
    avatar: 'CO',
    text: 'Before ChickenPro I was guessing my profit. Now I know my exact cost per bird before I sell. Last batch I made ₦180,000 profit on 400 birds.',
    rating: 5,
  },
  {
    name: 'Fatimah Abdullahi',
    role: 'Layer Farmer · Kano',
    avatar: 'FA',
    text: 'The vaccination reminder saved my flock. I missed Gumboro on my last farm and lost 60 birds. This app will never let that happen again.',
    rating: 5,
  },
  {
    name: 'Seun Adewale',
    role: 'Commercial Farmer · Lagos',
    avatar: 'SA',
    text: 'I run 3 batches at once. ChickenPro shows me exactly which batch is profitable and which one to cut. My income went up 40% in 3 months.',
    rating: 5,
  },
];

const PRICING = [
  {
    name: 'Free',
    price: '₦0',
    period: 'forever',
    desc: 'Perfect for beginners starting their first batch.',
    features: [
      'Up to 3 active batches',
      'Feed calculator',
      'Vaccination scheduler',
      'Daily update logging',
      'Basic P&L tracking',
      'Disease symptom checker',
    ],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₦3,500',
    period: 'per month',
    desc: 'For serious farmers who want full control.',
    features: [
      'Unlimited batches',
      'Advanced analytics & charts',
      'PDF report export',
      'Marketplace listings',
      'Priority support',
      'Market price alerts',
      'Multi-farm management',
      'Verified seller badge',
    ],
    cta: 'Get Pro',
    highlight: true,
  },
];

export default function LandingPage() {
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [activeFeature,setActiveFeature]= useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveFeature(p => (p + 1) % FEATURES.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#0A1409', color: '#F0EBE0', minHeight: '100vh' }}>

      {/* ══════════ NAVBAR ══════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(10,20,9,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #1C3524' : '1px solid transparent',
        transition: 'all 0.3s',
        padding: '0 32px',
        height: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #2D7A3A, #4CAF5C)',
            borderRadius: 9, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 18,
          }}>🐔</div>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: '#FAF7F2' }}>
            Chicken<span style={{ color: '#6FCF7F' }}>Pro</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} style={{
              padding: '7px 16px', borderRadius: 7, fontSize: 13, fontWeight: 500,
              color: '#A89880', textDecoration: 'none', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.target.style.color = '#FAF7F2'; e.target.style.background = '#162B1C'; }}
            onMouseLeave={e => { e.target.style.color = '#A89880'; e.target.style.background = 'transparent'; }}
            >{l}</a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="/login" style={{
            padding: '8px 18px', borderRadius: 7, fontSize: 13, fontWeight: 600,
            color: '#6FCF7F', textDecoration: 'none', border: '1.5px solid #2D7A3A',
            background: 'transparent', transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.target.style.background = '#1A3D22'}
          onMouseLeave={e => e.target.style.background = 'transparent'}
          >Sign In</a>
          <a href="/register" style={{
            padding: '8px 20px', borderRadius: 7, fontSize: 13, fontWeight: 700,
            color: '#fff', textDecoration: 'none',
            background: 'linear-gradient(135deg, #2D7A3A, #3D9E4D)',
            boxShadow: '0 4px 14px rgba(45,122,58,0.4)',
          }}>Get Started Free</a>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '100px 32px 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(45,122,58,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '10%', right: '5%',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 900, textAlign: 'center', position: 'relative' }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 100,
            background: '#1A3D22', border: '1px solid #2D7A3A',
            fontSize: 12, fontWeight: 600, color: '#6FCF7F',
            marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6FCF7F', display: 'inline-block' }} />
            Built for Nigerian Poultry Farmers
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(40px, 7vw, 76px)',
            fontWeight: 800, lineHeight: 1.1,
            color: '#FAF7F2',
            marginBottom: 24,
          }}>
            Farm Smarter.<br />
            <span style={{
              background: 'linear-gradient(135deg, #4CAF5C, #6FCF7F)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Earn More.</span>
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize: 18, lineHeight: 1.7, color: '#A89880',
            maxWidth: 620, margin: '0 auto 40px',
          }}>
            ChickenPro is the complete poultry farm management platform for Nigerian farmers.
            Track flocks, manage health, calculate profit — and sell directly to buyers.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
            <a href="/register" style={{
              padding: '15px 36px', borderRadius: 9, fontSize: 15, fontWeight: 700,
              color: '#fff', textDecoration: 'none',
              background: 'linear-gradient(135deg, #2D7A3A, #3D9E4D)',
              boxShadow: '0 6px 24px rgba(45,122,58,0.45)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Start for Free →
            </a>
            <a href="#how-it-works" style={{
              padding: '15px 32px', borderRadius: 9, fontSize: 15, fontWeight: 600,
              color: '#A89880', textDecoration: 'none',
              border: '1.5px solid #234D2E', background: 'transparent',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              See How It Works
            </a>
          </div>

          {/* Stats Row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1, background: '#1C3524',
            border: '1px solid #234D2E', borderRadius: 14, overflow: 'hidden',
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: '24px 20px', textAlign: 'center',
                background: '#0F1F14',
                borderRight: i < 3 ? '1px solid #1C3524' : 'none',
              }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#6FCF7F', marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#5A6B5E' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ BREEDS ══════════ */}
      <section style={{ padding: '80px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#C9A84C', textTransform: 'uppercase', marginBottom: 12 }}>What are you raising?</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 700, color: '#FAF7F2', marginBottom: 12 }}>
            Built for every breed
          </h2>
          <p style={{ fontSize: 15, color: '#A89880', maxWidth: 500, margin: '0 auto' }}>
            ChickenPro adapts to your breed with the right feed schedule, vaccination plan, and profit calculator.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {BREEDS.map((b, i) => (
            <div key={i} style={{
              background: `linear-gradient(160deg, #162B1C, #0F1F14)`,
              border: `1px solid #234D2E`,
              borderRadius: 16, padding: 28,
              transition: 'transform 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ fontSize: 40 }}>{b.emoji}</div>
                <span style={{
                  padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                  background: '#1A3D22', color: '#6FCF7F', border: '1px solid #2D7A3A',
                }}>{b.badge}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#FAF7F2', marginBottom: 6 }}>{b.name}</div>
              <div style={{ fontSize: 13, color: '#5A6B5E', marginBottom: 20, lineHeight: 1.5 }}>{b.desc}</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1, background: '#0A1409', border: '1px solid #1C3524', borderRadius: 9, padding: '10px 14px' }}>
                  <div style={{ fontSize: 10, color: '#5A6B5E', marginBottom: 3 }}>CYCLE</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#FAF7F2' }}>{b.cycle}</div>
                </div>
                <div style={{ flex: 1, background: '#0A1409', border: '1px solid #1C3524', borderRadius: 9, padding: '10px 14px' }}>
                  <div style={{ fontSize: 10, color: '#5A6B5E', marginBottom: 3 }}>PROFIT</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#6FCF7F' }}>{b.profit}</div>
                  <div style={{ fontSize: 10, color: '#5A6B5E' }}>{b.unit}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" style={{ padding: '80px 32px', background: '#0D1A0D' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#C9A84C', textTransform: 'uppercase', marginBottom: 12 }}>Features</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 700, color: '#FAF7F2', marginBottom: 12 }}>
              Everything your farm needs
            </h2>
            <p style={{ fontSize: 15, color: '#A89880', maxWidth: 500, margin: '0 auto' }}>
              From day-old chick to sale day — every tool a Nigerian poultry farmer needs in one app.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: activeFeature === i ? '#162B1C' : '#0F1F14',
                border: `1px solid ${activeFeature === i ? '#2D7A3A' : '#1C3524'}`,
                borderRadius: 14, padding: 24,
                transition: 'all 0.3s', cursor: 'default',
                boxShadow: activeFeature === i ? '0 0 0 1px #2D7A3A, 0 8px 24px rgba(45,122,58,0.15)' : 'none',
              }}
              onMouseEnter={() => setActiveFeature(i)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontSize: 32 }}>{f.icon}</div>
                  <span style={{
                    padding: '2px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                    background: f.tag === 'Coming Soon' ? '#2A2010' : '#1A3D22',
                    color: f.tag === 'Coming Soon' ? '#C9A84C' : '#6FCF7F',
                    border: `1px solid ${f.tag === 'Coming Soon' ? '#9A7A2E' : '#2D7A3A'}`,
                  }}>{f.tag}</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#FAF7F2', marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: '#5A6B5E', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how-it-works" style={{ padding: '80px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#C9A84C', textTransform: 'uppercase', marginBottom: 12 }}>How It Works</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 700, color: '#FAF7F2', marginBottom: 12 }}>
            Up and running in minutes
          </h2>
          <p style={{ fontSize: 15, color: '#A89880' }}>No technical knowledge required.</p>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Connecting line */}
          <div style={{
            position: 'absolute', top: 32, left: '12.5%', right: '12.5%', height: 1,
            background: 'linear-gradient(90deg, transparent, #2D7A3A, #2D7A3A, transparent)',
          }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative' }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
                  background: 'linear-gradient(135deg, #2D7A3A, #4CAF5C)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(45,122,58,0.4)',
                  position: 'relative', zIndex: 1,
                }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 800, color: '#fff' }}>{s.num}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#FAF7F2', marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#5A6B5E', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section style={{ padding: '80px 32px', background: '#0D1A0D' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#C9A84C', textTransform: 'uppercase', marginBottom: 12 }}>Testimonials</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 700, color: '#FAF7F2' }}>
              What farmers are saying
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                background: '#0F1F14', border: '1px solid #1C3524',
                borderRadius: 14, padding: 24,
              }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {[...Array(t.rating)].map((_, j) => (
                    <span key={j} style={{ color: '#C9A84C', fontSize: 14 }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: '#A89880', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2D7A3A, #C9A84C)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: '#fff',
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#FAF7F2' }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: '#5A6B5E' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ PRICING ══════════ */}
      <section id="pricing" style={{ padding: '80px 32px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#C9A84C', textTransform: 'uppercase', marginBottom: 12 }}>Pricing</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 700, color: '#FAF7F2', marginBottom: 12 }}>
            Simple, honest pricing
          </h2>
          <p style={{ fontSize: 15, color: '#A89880' }}>Start free. Upgrade when you are ready.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {PRICING.map((p, i) => (
            <div key={i} style={{
              background: p.highlight ? 'linear-gradient(160deg, #1A3D22, #0F1F14)' : '#0F1F14',
              border: `1px solid ${p.highlight ? '#2D7A3A' : '#1C3524'}`,
              borderRadius: 16, padding: 32,
              position: 'relative', overflow: 'hidden',
              boxShadow: p.highlight ? '0 0 0 1px #2D7A3A, 0 20px 40px rgba(45,122,58,0.2)' : 'none',
            }}>
              {p.highlight && (
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  padding: '3px 12px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                  background: 'linear-gradient(135deg, #C9A84C, #E8C76A)',
                  color: '#0A1409',
                }}>MOST POPULAR</div>
              )}
              <div style={{ fontSize: 16, fontWeight: 700, color: '#FAF7F2', marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: '#5A6B5E', marginBottom: 20 }}>{p.desc}</div>
              <div style={{ marginBottom: 28 }}>
                <span style={{ fontSize: 40, fontWeight: 800, color: p.highlight ? '#6FCF7F' : '#FAF7F2' }}>{p.price}</span>
                <span style={{ fontSize: 13, color: '#5A6B5E', marginLeft: 6 }}>/ {p.period}</span>
              </div>
              <div style={{ marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#A89880' }}>
                    <span style={{ color: '#6FCF7F', fontSize: 14, fontWeight: 700 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
              <a href="/register" style={{
                display: 'block', textAlign: 'center',
                padding: '13px 24px', borderRadius: 9, fontSize: 14, fontWeight: 700,
                color: p.highlight ? '#fff' : '#6FCF7F', textDecoration: 'none',
                background: p.highlight ? 'linear-gradient(135deg, #2D7A3A, #3D9E4D)' : 'transparent',
                border: p.highlight ? 'none' : '1.5px solid #2D7A3A',
                boxShadow: p.highlight ? '0 4px 16px rgba(45,122,58,0.4)' : 'none',
              }}>{p.cta}</a>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ CTA BANNER ══════════ */}
      <section style={{ padding: '60px 32px' }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          background: 'linear-gradient(135deg, #1A3D22, #162B1C)',
          border: '1px solid #2D7A3A',
          borderRadius: 20, padding: '56px 48px',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-30%', right: '-5%',
            fontSize: 200, opacity: 0.04, pointerEvents: 'none',
          }}>🐔</div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#C9A84C', textTransform: 'uppercase', marginBottom: 16 }}>
            Join 5,000+ Nigerian Farmers
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 40, fontWeight: 800, color: '#FAF7F2', marginBottom: 16,
          }}>
            Your flock deserves better<br />
            <span style={{ color: '#6FCF7F' }}>management.</span>
          </h2>
          <p style={{ fontSize: 16, color: '#A89880', maxWidth: 480, margin: '0 auto 36px' }}>
            Start tracking your farm today. Free forever for up to 3 batches.
            No credit card required.
          </p>
          <a href="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '16px 40px', borderRadius: 10, fontSize: 16, fontWeight: 700,
            color: '#fff', textDecoration: 'none',
            background: 'linear-gradient(135deg, #2D7A3A, #4CAF5C)',
            boxShadow: '0 8px 28px rgba(45,122,58,0.5)',
          }}>
            Create Free Account →
          </a>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{
        borderTop: '1px solid #1C3524',
        padding: '40px 32px',
        background: '#0A1409',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30,
              background: 'linear-gradient(135deg, #2D7A3A, #4CAF5C)',
              borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
            }}>🐔</div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: '#FAF7F2' }}>
              Chicken<span style={{ color: '#6FCF7F' }}>Pro</span>
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#3D6B4A' }}>
            © 2025 ChickenPro. Built for Nigerian farmers.
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Support'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: '#3D6B4A', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = '#6FCF7F'}
              onMouseLeave={e => e.target.style.color = '#3D6B4A'}
              >{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}