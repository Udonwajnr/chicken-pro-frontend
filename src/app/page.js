'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ── Design Tokens ──────────────────────────────
const C = {
  soil:       '#0A1409',   // deepest background
  bark:       '#0F1F14',   // page background
  canopy:     '#162B1C',   // surface
  canopy2:    '#1C3524',   // surface elevated
  vine:       '#234D2E',   // border
  moss:       '#3D6B4A',   // muted text on dark
  fern:       '#2D7A3A',   // primary green
  leaf:       '#3D9E4D',   // green light
  grass:      '#6FCF7F',   // glow / accent
  sprout:     '#1A3D22',   // faint green bg
  cream:      '#FAF7F2',   // light background
  parchment:  '#F5F0E8',   // surface light
  linen:      '#E8DFD0',   // border light
  ink:        '#2C2416',   // text dark
  clay:       '#8A7560',   // muted text
  gold:       '#C9A84C',   // premium gold
  sun:        '#E8C76A',   // gold light
  ember:      '#2A2010',   // gold dark bg
  dawn:       '#F0EBE0',   // text on dark
  dusk:       '#A89880',   // secondary text dark
  shadow:     '#5A6B5E',   // muted on dark
};

// ── Animated Counter ───────────────────────────
function Counter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1800;
          const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ── SVG Illustrations ─────────────────────────

// Detailed chicken SVG
const ChickenSVG = ({ size = 120, color = C.grass, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    {/* Body */}
    <ellipse cx="60" cy="72" rx="34" ry="28" fill={color} opacity="0.9"/>
    {/* Wing */}
    <ellipse cx="50" cy="70" rx="20" ry="13" fill={color} opacity="0.6" transform="rotate(-10 50 70)"/>
    <ellipse cx="70" cy="70" rx="20" ry="13" fill={color} opacity="0.6" transform="rotate(10 70 70)"/>
    {/* Neck */}
    <ellipse cx="60" cy="46" rx="12" ry="14" fill={color} opacity="0.9"/>
    {/* Head */}
    <circle cx="60" cy="32" r="16" fill={color} opacity="0.95"/>
    {/* Comb */}
    <path d="M54 18 C54 18 56 10 58 14 C58 14 60 6 62 12 C62 12 64 8 66 16" stroke="#C0392B" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* Wattle */}
    <ellipse cx="57" cy="38" rx="4" ry="6" fill="#C0392B" opacity="0.9"/>
    {/* Beak */}
    <path d="M72 30 L80 33 L72 36 Z" fill={C.gold}/>
    {/* Eye */}
    <circle cx="68" cy="28" r="4" fill={C.ink}/>
    <circle cx="69" cy="27" r="1.5" fill="#fff"/>
    {/* Tail feathers */}
    <path d="M94 60 C105 45 110 38 108 30 C106 35 98 42 90 55" fill={color} opacity="0.7"/>
    <path d="M96 68 C110 58 118 52 118 42 C114 48 104 56 94 68" fill={color} opacity="0.5"/>
    <path d="M94 76 C106 70 114 68 116 60 C111 65 102 70 92 78" fill={color} opacity="0.6"/>
    {/* Legs */}
    <rect x="50" y="98" width="5" height="18" rx="2" fill={C.gold}/>
    <rect x="65" y="98" width="5" height="18" rx="2" fill={C.gold}/>
    {/* Feet */}
    <path d="M47 116 L42 120 M50 116 L50 120 M53 116 L56 120" stroke={C.gold} strokeWidth="2" strokeLinecap="round"/>
    <path d="M62 116 L57 120 M65 116 L65 120 M68 116 L71 120" stroke={C.gold} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Egg SVG
const EggSVG = ({ size = 60, color = C.cream, style = {} }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d="M30 4C16 4 6 20 6 36C6 54 16 68 30 68C44 68 54 54 54 36C54 20 44 4 30 4Z" fill={color} opacity="0.95"/>
    <path d="M30 4C22 4 14 16 12 28C18 24 26 22 30 22C34 22 42 24 48 28C46 16 38 4 30 4Z" fill="white" opacity="0.3"/>
    {/* Shine */}
    <ellipse cx="22" cy="24" rx="5" ry="8" fill="white" opacity="0.25" transform="rotate(-20 22 24)"/>
  </svg>
);

// Feather SVG
const FeatherSVG = ({ size = 80, color = C.grass, style = {} }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d="M30 88 C30 88 28 60 10 30 C20 40 28 50 30 60 C32 50 40 40 50 30 C32 60 30 88 30 88Z" fill={color} opacity="0.8"/>
    <path d="M30 88 L30 20" stroke={color} strokeWidth="1.5" opacity="0.6"/>
    <path d="M20 45 C25 42 30 42 35 45" stroke={color} strokeWidth="1" opacity="0.4"/>
    <path d="M16 55 C22 51 30 50 38 55" stroke={color} strokeWidth="1" opacity="0.4"/>
    <path d="M13 65 C20 60 30 59 42 65" stroke={color} strokeWidth="1" opacity="0.4"/>
    <path d="M12 75 C20 69 30 68 44 75" stroke={color} strokeWidth="1" opacity="0.4"/>
  </svg>
);

// Farm illustration SVG (hero decoration)
const FarmSceneSVG = () => (
  <svg width="500" height="400" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sky gradient */}
    <defs>
      <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={C.grass} stopOpacity="0.15"/>
        <stop offset="100%" stopColor={C.grass} stopOpacity="0"/>
      </radialGradient>
      <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.fern} stopOpacity="0.3"/>
        <stop offset="100%" stopColor={C.soil} stopOpacity="0.8"/>
      </linearGradient>
    </defs>
    {/* Glow background */}
    <ellipse cx="250" cy="200" rx="250" ry="200" fill="url(#glowGrad)"/>
    {/* Ground */}
    <ellipse cx="250" cy="350" rx="240" ry="60" fill="url(#groundGrad)" opacity="0.5"/>

    {/* Barn */}
    <rect x="140" y="180" width="120" height="100" fill={C.canopy} stroke={C.vine} strokeWidth="1.5" rx="2"/>
    <path d="M130 180 L200 120 L270 180Z" fill={C.canopy2} stroke={C.vine} strokeWidth="1.5"/>
    {/* Barn door */}
    <rect x="172" y="230" width="36" height="50" fill={C.vine} rx="2"/>
    <line x1="190" y1="230" x2="190" y2="280" stroke={C.moss} strokeWidth="1"/>
    {/* Barn windows */}
    <rect x="150" y="200" width="20" height="20" fill={C.sprout} stroke={C.vine} strokeWidth="1" rx="2"/>
    <rect x="230" y="200" width="20" height="20" fill={C.sprout} stroke={C.vine} strokeWidth="1" rx="2"/>

    {/* Chicken coop */}
    <rect x="300" y="230" width="80" height="50" fill={C.canopy} stroke={C.vine} strokeWidth="1.5" rx="3"/>
    <path d="M292 230 L340 205 L388 230Z" fill={C.canopy2} stroke={C.vine} strokeWidth="1.5"/>
    <rect x="320" y="250" width="20" height="30" fill={C.vine} rx="2"/>

    {/* Trees */}
    <circle cx="90" cy="230" r="35" fill={C.fern} opacity="0.6"/>
    <circle cx="80" cy="220" r="25" fill={C.leaf} opacity="0.5"/>
    <rect x="85" y="260" width="10" height="30" fill={C.bark}/>

    <circle cx="420" cy="240" r="30" fill={C.fern} opacity="0.6"/>
    <circle cx="430" cy="228" r="22" fill={C.leaf} opacity="0.5"/>
    <rect x="415" y="265" width="10" height="25" fill={C.bark}/>

    {/* Chickens on ground — small */}
    <g transform="translate(170, 290) scale(0.35)">
      <ellipse cx="60" cy="72" rx="34" ry="28" fill={C.grass} opacity="0.9"/>
      <circle cx="60" cy="32" r="16" fill={C.grass} opacity="0.95"/>
      <path d="M54 18 C56 10 58 14 60 6 62 12 64 8 66 16" stroke="#C0392B" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M72 30 L80 33 L72 36 Z" fill={C.gold}/>
      <circle cx="68" cy="28" r="4" fill={C.ink}/>
      <rect x="50" y="98" width="5" height="15" rx="2" fill={C.gold}/>
      <rect x="65" y="98" width="5" height="15" rx="2" fill={C.gold}/>
    </g>

    <g transform="translate(220, 300) scale(0.28)">
      <ellipse cx="60" cy="72" rx="34" ry="28" fill={C.sun} opacity="0.8"/>
      <circle cx="60" cy="32" r="16" fill={C.sun} opacity="0.9"/>
      <path d="M72 30 L80 33 L72 36 Z" fill={C.gold}/>
      <circle cx="68" cy="28" r="4" fill={C.ink}/>
      <rect x="50" y="98" width="5" height="12" rx="2" fill={C.gold}/>
      <rect x="65" y="98" width="5" height="12" rx="2" fill={C.gold}/>
    </g>

    <g transform="translate(330, 290) scale(0.3)">
      <ellipse cx="60" cy="72" rx="34" ry="28" fill="#ddd" opacity="0.8"/>
      <circle cx="60" cy="32" r="16" fill="#ddd" opacity="0.9"/>
      <path d="M72 30 L80 33 L72 36 Z" fill={C.gold}/>
      <circle cx="68" cy="28" r="4" fill={C.ink}/>
      <rect x="50" y="98" width="5" height="12" rx="2" fill={C.gold}/>
      <rect x="65" y="98" width="5" height="12" rx="2" fill={C.gold}/>
    </g>

    {/* Eggs on ground */}
    <ellipse cx="260" cy="310" rx="10" ry="13" fill={C.cream} opacity="0.8"/>
    <ellipse cx="278" cy="314" rx="9" ry="12" fill={C.parchment} opacity="0.7"/>
    <ellipse cx="246" cy="316" rx="8" ry="11" fill={C.cream} opacity="0.6"/>

    {/* Stars / sparkles */}
    <circle cx="60" cy="80" r="2" fill={C.grass} opacity="0.5"/>
    <circle cx="440" cy="100" r="2.5" fill={C.grass} opacity="0.4"/>
    <circle cx="380" cy="60" r="1.5" fill={C.sun} opacity="0.5"/>
    <circle cx="100" cy="50" r="2" fill={C.sun} opacity="0.4"/>

    {/* Fence */}
    {[150,170,190,210,230,250,270,290,310,330].map((x, i) => (
      <g key={i}>
        <rect x={x} y="318" width="4" height="22" fill={C.vine} rx="1"/>
        <rect x={x-5} y="323" width="24" height="3" fill={C.moss} rx="1" opacity="0.8"/>
        <rect x={x-5} y="330" width="24" height="3" fill={C.moss} rx="1" opacity="0.8"/>
      </g>
    ))}
  </svg>
);

// Dashboard preview mockup SVG
const DashboardMockupSVG = () => (
  <svg width="560" height="380" viewBox="0 0 560 380" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#000" floodOpacity="0.5"/>
      </filter>
    </defs>

    {/* Window frame */}
    <rect x="10" y="10" width="540" height="360" rx="14" fill={C.canopy} stroke={C.vine} strokeWidth="1.5" filter="url(#shadow)"/>
    {/* Titlebar */}
    <rect x="10" y="10" width="540" height="36" rx="14" fill={C.canopy2}/>
    <rect x="10" y="32" width="540" height="14" fill={C.canopy2}/>
    {/* Traffic lights */}
    <circle cx="34" cy="28" r="5" fill="#FF5F57"/>
    <circle cx="52" cy="28" r="5" fill="#FEBC2E"/>
    <circle cx="70" cy="28" r="5" fill="#28C840"/>
    {/* URL bar */}
    <rect x="160" y="19" width="200" height="18" rx="9" fill={C.bark} opacity="0.6"/>
    <text x="260" y="31" textAnchor="middle" fill={C.shadow} fontSize="8" fontFamily="Inter, sans-serif">chickenpro.com/dashboard</text>

    {/* Sidebar */}
    <rect x="10" y="46" width="110" height="324" fill={C.cream} opacity="0.06"/>
    {/* Sidebar items */}
    {['📊','🐔','🌾','💉','🥚','💰','📈'].map((icon, i) => (
      <g key={i}>
        <rect x="18" y={58 + i*36} width="94" height="26" rx="7"
          fill={i === 0 ? C.fern : 'transparent'} opacity={i === 0 ? 0.8 : 0.3}/>
        <text x="32" y={75 + i*36} fontSize="12" fontFamily="system-ui">{icon}</text>
        <text x="50" y={75 + i*36} fill={i === 0 ? '#fff' : C.shadow} fontSize="9" fontFamily="Inter, sans-serif">
          {['Dashboard','Batches','Feed','Health','Production','Finance','Analytics'][i]}
        </text>
      </g>
    ))}

    {/* Main content area */}
    {/* Stat cards */}
    {[
      { x: 130, label: 'Active Batches', val: '3', color: C.grass },
      { x: 224, label: 'Live Birds',     val: '580', color: '#5DADE2' },
      { x: 318, label: 'This Month',     val: '₦1.2M', color: C.sun },
      { x: 412, label: 'Mortality',      val: '1.2%', color: C.grass },
    ].map((card, i) => (
      <g key={i}>
        <rect x={card.x} y="58" width="82" height="56" rx="8" fill={C.bark} stroke={C.vine} strokeWidth="1"/>
        <rect x={card.x} y="58" width="82" height="3" rx="1" fill={card.color} opacity="0.9"/>
        <text x={card.x + 8} y="80" fill={C.shadow} fontSize="7" fontFamily="Inter, sans-serif">{card.label}</text>
        <text x={card.x + 8} y="101" fill={card.color} fontSize="16" fontWeight="bold" fontFamily="Inter, sans-serif">{card.val}</text>
      </g>
    ))}

    {/* Chart area */}
    <rect x="130" y="124" width="270" height="130" rx="8" fill={C.bark} stroke={C.vine} strokeWidth="1"/>
    <text x="142" y="140" fill={C.dawn} fontSize="8" fontWeight="600" fontFamily="Inter, sans-serif">Revenue vs Expenses</text>
    {/* Bars */}
    {[
      { x: 150, rev: 70, exp: 45, proft: 25 },
      { x: 190, rev: 85, exp: 55, proft: 30 },
      { x: 230, rev: 60, exp: 40, proft: 20 },
      { x: 270, rev: 95, exp: 60, proft: 35 },
      { x: 310, rev: 75, exp: 50, proft: 25 },
      { x: 350, rev: 110, exp: 65, proft: 45 },
    ].map((b, i) => (
      <g key={i}>
        <rect x={b.x}    y={240 - b.rev}    width="9" height={b.rev}    rx="2" fill={C.grass} opacity="0.8"/>
        <rect x={b.x+10} y={240 - b.exp}    width="9" height={b.exp}    rx="2" fill="#E88080" opacity="0.8"/>
        <rect x={b.x+20} y={240 - b.proft}  width="9" height={b.proft}  rx="2" fill={C.sun}   opacity="0.8"/>
      </g>
    ))}
    <line x1="142" y1="240" x2="385" y2="240" stroke={C.vine} strokeWidth="0.5"/>

    {/* Vaccine panel */}
    <rect x="410" y="124" width="130" height="130" rx="8" fill={C.bark} stroke={C.vine} strokeWidth="1"/>
    <text x="422" y="140" fill={C.dawn} fontSize="8" fontWeight="600" fontFamily="Inter, sans-serif">💉 Vaccinations</text>
    {['Newcastle · Day 7','Gumboro · Day 14','Fowl Pox · Day 42'].map((v, i) => (
      <g key={i}>
        <rect x="418" y={148 + i*28} width="114" height="22" rx="5" fill={C.canopy} stroke={C.vine} strokeWidth="0.5"/>
        <text x="426" y={163 + i*28} fill={C.dusk} fontSize="7" fontFamily="Inter, sans-serif">{v}</text>
        <rect x="494" y={152 + i*28} width="30" height="14" rx="7"
          fill={i === 0 ? '#7B1F1F' : '#2A2010'}/>
        <text x="509" y={162 + i*28} textAnchor="middle"
          fill={i === 0 ? '#E88080' : C.sun} fontSize="6" fontFamily="Inter, sans-serif">
          {i === 0 ? 'Today' : i === 1 ? 'In 7d' : 'In 35d'}
        </text>
      </g>
    ))}

    {/* Batch table */}
    <rect x="130" y="264" width="410" height="96" rx="8" fill={C.bark} stroke={C.vine} strokeWidth="1"/>
    <rect x="130" y="264" width="410" height="20" rx="8" fill={C.canopy2}/>
    <rect x="130" y="274" width="410" height="10" fill={C.canopy2}/>
    {['Batch','Breed','Day/Wk','Mortality','Status'].map((h, i) => (
      <text key={i} x={143 + i*82} y="278" fill={C.shadow} fontSize="6" fontWeight="700" fontFamily="Inter, sans-serif" textTransform="uppercase">{h}</text>
    ))}
    {[
      { name:'Batch 1 — June', breed:'Broiler', day:'Day 14 · Wk2', mort:'1.2%', status:'Active', sc: C.grass },
      { name:'Batch 2 — May',  breed:'Layer',   day:'Day 42 · Wk6', mort:'0.8%', status:'Active', sc: '#5DADE2' },
      { name:'Batch 3 — Apr',  breed:'Cockerel',day:'Day 63 · Wk9', mort:'2.1%', status:'Active', sc: C.sun },
    ].map((row, i) => (
      <g key={i}>
        <rect x="130" y={285 + i*24} width="410" height="23" fill={i % 2 === 0 ? 'transparent' : C.canopy} opacity="0.3"/>
        <text x="143" y={300 + i*24} fill={C.dawn} fontSize="7" fontFamily="Inter, sans-serif">{row.name}</text>
        <rect x="218" y={288 + i*24} width="30" height="12" rx="6" fill={C.sprout}/>
        <text x="233" y={298 + i*24} textAnchor="middle" fill={C.grass} fontSize="6" fontFamily="Inter, sans-serif">{row.breed}</text>
        <text x="306" y={300 + i*24} fill={C.dusk} fontSize="7" fontFamily="Inter, sans-serif">{row.day}</text>
        <text x="386" y={300 + i*24} fill={row.sc} fontSize="7" fontFamily="Inter, sans-serif">{row.mort}</text>
        <rect x="462" y={289 + i*24} width="34" height="12" rx="6" fill={C.sprout}/>
        <text x="479" y={299 + i*24} textAnchor="middle" fill={row.sc} fontSize="6" fontFamily="Inter, sans-serif">{row.status}</text>
      </g>
    ))}
  </svg>
);

// ── Main Landing Page ─────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveFeature(p => (p + 1) % 6), 3500);
    return () => clearInterval(t);
  }, []);

  const FEATURES = [
    { icon: '🐔', emoji_bg: C.sprout, title: 'Smart Batch Tracking', desc: 'Every bird accounted for from day one. Mortality alerts fire when death rate crosses 3% — before it becomes a crisis.', tag: 'Core', tagColor: C.grass },
    { icon: '🌾', emoji_bg: C.ember,  title: 'Feed Calculator',      desc: 'Exact grams per bird today. Brand guide with Nigerian market prices, protein percentages, and where to buy in your city.', tag: 'Save Money', tagColor: C.sun },
    { icon: '💉', emoji_bg: C.sprout, title: 'Vaccination Scheduler', desc: 'Auto-generated the moment you create a batch. Newcastle, Gumboro, Fowl Pox — never miss a critical date again.', tag: 'Save Lives', tagColor: C.grass },
    { icon: '🥚', emoji_bg: '#2A1030', title: 'Production Tracking',  desc: 'Daily egg logs for layers. Weekly weight tracking for broilers. Slaughter readiness indicator at 1.8kg.', tag: 'Know Your Numbers', tagColor: '#C084FC' },
    { icon: '💰', emoji_bg: C.ember,  title: 'Real-time P&L',        desc: 'Log every expense and every sale. Know your exact profit per bird, ROI, and break-even price before you negotiate.', tag: 'Make More', tagColor: C.sun },
    { icon: '🏪', emoji_bg: C.sprout, title: 'Marketplace',          desc: 'List birds, eggs, and feed directly to buyers. Escrow payments protect every transaction. Verified seller badges build trust.', tag: 'New', tagColor: C.grass },
  ];

  const BREEDS = [
    { name: 'Broiler',  emoji: '🐔', cycle: '6 weeks',  profit: '₦100–₦500/bird',   desc: 'Fast cycle, high volume.',  color: C.sprout, border: C.vine,     badge: 'Most Popular', badgeColor: C.grass },
    { name: 'Layer',    emoji: '🥚', cycle: '72 weeks', profit: '₦7,600/bird/yr',    desc: 'Daily egg income.',         color: C.ember,  border: '#6A4A10',  badge: 'Best ROI',     badgeColor: C.sun   },
    { name: 'Cockerel', emoji: '🐓', cycle: '12 weeks', profit: '₦1,000–₦3,000',    desc: 'Festive season premium.',   color: '#102030', border: '#1A4A6A', badge: 'Festive Gold', badgeColor: '#5DADE2' },
  ];

  const TESTIMONIALS = [
    { name: 'Chukwuemeka Obi',   role: 'Broiler Farmer · Ogun',   avatar: 'CO', quote: 'Before ChickenPro I was guessing my profit. Last batch I made ₦180,000 on 400 birds — and I knew the exact number before I sold a single bird.', stars: 5 },
    { name: 'Fatimah Abdullahi', role: 'Layer Farmer · Kano',     avatar: 'FA', quote: 'The vaccination reminder saved my flock. I once lost 60 birds to Gumboro. This app will never let that happen again.', stars: 5 },
    { name: 'Seun Adewale',      role: 'Commercial Farmer · Lagos', avatar: 'SA', quote: 'I run 3 batches at once. ChickenPro tells me exactly which batch is profitable and which to cut. Income up 40% in 3 months.', stars: 5 },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.bark, color: C.dawn, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? `rgba(10,20,9,0.96)` : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.vine}` : '1px solid transparent',
        transition: 'all 0.3s',
        padding: '0 40px', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38,
            background: `linear-gradient(135deg, ${C.fern}, ${C.leaf})`,
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ChickenSVG size={28} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 21, fontWeight: 700, color: C.cream }}>
            Chicken<span style={{ color: C.grass }}>Pro</span>
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 2 }}>
          {['Features','How It Works','Pricing','Marketplace'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g,'-')}`} style={{
              padding: '7px 16px', borderRadius: 7, fontSize: 13, fontWeight: 500,
              color: C.shadow, textDecoration: 'none', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.target.style.color = C.cream; e.target.style.background = C.canopy; }}
            onMouseLeave={e => { e.target.style.color = C.shadow; e.target.style.background = 'transparent'; }}
            >{l}</a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/login" style={{
            padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            color: C.grass, textDecoration: 'none',
            border: `1.5px solid ${C.vine}`, background: 'transparent',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = C.sprout}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >Sign In</Link>
          <Link href="/register" style={{
            padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700,
            color: '#fff', textDecoration: 'none',
            background: `linear-gradient(135deg, ${C.fern}, ${C.leaf})`,
            boxShadow: '0 4px 14px rgba(45,122,58,0.4)',
          }}>Get Started Free</Link>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        padding: '100px 80px 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glow orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: 500, height: 500, background: `radial-gradient(circle, rgba(45,122,58,0.12) 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, background: `radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)`, pointerEvents: 'none' }} />

        {/* Floating decorations */}
        <div style={{ position: 'absolute', top: 140, right: 80, animation: 'floatA 6s ease-in-out infinite' }}>
          <ChickenSVG size={64} color={C.grass} style={{ opacity: 0.15 }} />
        </div>
        <div style={{ position: 'absolute', top: 200, right: 200, animation: 'floatB 8s ease-in-out infinite' }}>
          <EggSVG size={32} color={C.cream} style={{ opacity: 0.1 }} />
        </div>
        <div style={{ position: 'absolute', bottom: 200, left: 60, animation: 'floatC 7s ease-in-out infinite' }}>
          <FeatherSVG size={48} color={C.grass} style={{ opacity: 0.1 }} />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', width: '100%' }}>

          {/* Left text */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 14px', borderRadius: 100,
              background: C.sprout, border: `1px solid ${C.vine}`,
              fontSize: 11, fontWeight: 700, color: C.grass,
              letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 28,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.grass, animation: 'pulse 2s infinite' }} />
              Built for Nigerian Poultry Farmers
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(44px, 5vw, 72px)',
              fontWeight: 900, lineHeight: 1.08, color: C.cream,
              marginBottom: 24, letterSpacing: '-0.5px',
            }}>
              Farm smarter.<br />
              <span style={{
                background: `linear-gradient(135deg, ${C.leaf}, ${C.grass})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Earn more.</span>
            </h1>

            <p style={{
              fontSize: 18, lineHeight: 1.75, color: C.shadow,
              maxWidth: 480, marginBottom: 40,
            }}>
              Complete poultry farm management — track flocks, automate vaccination schedules, calculate real profit per bird, and sell directly to buyers. All in one app.
            </p>

            <div style={{ display: 'flex', gap: 14, marginBottom: 52, flexWrap: 'wrap' }}>
              <Link href="/register" style={{
                padding: '15px 36px', borderRadius: 10, fontSize: 15, fontWeight: 700,
                color: '#fff', textDecoration: 'none',
                background: `linear-gradient(135deg, ${C.fern}, ${C.leaf})`,
                boxShadow: '0 6px 24px rgba(45,122,58,0.45)',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                Start for Free →
              </Link>
              <a href="#how-it-works" style={{
                padding: '15px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600,
                color: C.shadow, textDecoration: 'none',
                border: `1.5px solid ${C.vine}`, background: 'transparent',
              }}>Watch how it works</a>
            </div>

            {/* Mini stats */}
            <div style={{ display: 'flex', gap: 36 }}>
              {[
                { val: 5000, suffix: '+', label: 'Farmers', prefix: '' },
                { val: 2, suffix: '.4B', label: 'Revenue tracked', prefix: '₦' },
                { val: 98, suffix: '%', label: 'Avg survival', prefix: '' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.grass, lineHeight: 1 }}>
                    <Counter target={s.val} suffix={s.suffix} prefix={s.prefix} />
                  </div>
                  <div style={{ fontSize: 11, color: C.shadow, marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Farm Scene + Dashboard mockup */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {/* Farm scene behind */}
            <div style={{ position: 'absolute', bottom: -40, left: -20, opacity: 0.6 }}>
              <FarmSceneSVG />
            </div>
            {/* Dashboard mockup on top */}
            <div style={{
              position: 'relative', zIndex: 2,
              background: C.canopy, borderRadius: 16,
              border: `1px solid ${C.vine}`,
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              transform: 'perspective(1200px) rotateY(-6deg) rotateX(3deg)',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'perspective(1200px) rotateY(-2deg) rotateX(1deg)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'perspective(1200px) rotateY(-6deg) rotateX(3deg)'}
            >
              <DashboardMockupSVG />
            </div>
          </div>
        </div>
      </section>

      {/* ══ BREEDS ══ */}
      <section style={{ padding: '80px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.gold, textTransform: 'uppercase', marginBottom: 12 }}>What are you raising?</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 38, fontWeight: 700, color: C.cream, marginBottom: 14 }}>
            Built for every breed
          </h2>
          <p style={{ fontSize: 15, color: C.shadow, maxWidth: 480, margin: '0 auto' }}>
            ChickenPro adapts to your breed — the right feed schedule, vaccination plan, and profit calculator.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {BREEDS.map((b, i) => (
            <div key={i}
              style={{
                background: `linear-gradient(160deg, ${b.color}, ${C.bark})`,
                border: `1px solid ${b.border}`,
                borderRadius: 18, padding: '32px 28px',
                transition: 'transform 0.2s',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Breed illustration */}
              <div style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.07 }}>
                {b.name === 'Broiler'  && <ChickenSVG size={140} color={C.cream} />}
                {b.name === 'Layer'    && <EggSVG    size={120} color={C.cream} />}
                {b.name === 'Cockerel' && <ChickenSVG size={140} color={C.sun} />}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div style={{ fontSize: 48 }}>{b.emoji}</div>
                <span style={{
                  padding: '4px 12px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                  background: `${b.badgeColor}20`, color: b.badgeColor,
                  border: `1px solid ${b.badgeColor}40`,
                }}>{b.badge}</span>
              </div>

              <div style={{ fontSize: 24, fontWeight: 800, color: C.cream, marginBottom: 6 }}>{b.name}</div>
              <div style={{ fontSize: 13, color: C.shadow, marginBottom: 24, lineHeight: 1.5 }}>{b.desc}</div>

              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { label: 'Cycle',   value: b.cycle  },
                  { label: 'Profit',  value: b.profit },
                ].map((s, j) => (
                  <div key={j} style={{
                    flex: 1, background: 'rgba(0,0,0,0.3)',
                    border: `1px solid ${C.vine}`,
                    borderRadius: 10, padding: '10px 14px',
                  }}>
                    <div style={{ fontSize: 9, color: C.shadow, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.cream }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" style={{ padding: '80px 80px', background: C.soil }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.gold, textTransform: 'uppercase', marginBottom: 12 }}>Features</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 38, fontWeight: 700, color: C.cream }}>
              Every tool your farm needs
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {FEATURES.map((f, i) => (
              <div key={i}
                onClick={() => setActiveFeature(i)}
                style={{
                  background: activeFeature === i ? C.canopy : C.bark,
                  border: `1px solid ${activeFeature === i ? C.fern : C.vine}`,
                  borderRadius: 14, padding: '24px',
                  cursor: 'pointer', transition: 'all 0.25s',
                  boxShadow: activeFeature === i ? `0 0 0 1px ${C.fern}, 0 8px 28px rgba(45,122,58,0.18)` : 'none',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={() => setActiveFeature(i)}
              >
                {/* Feather decoration */}
                {activeFeature === i && (
                  <div style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.06 }}>
                    <FeatherSVG size={80} color={C.grass} />
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: f.emoji_bg, border: `1px solid ${C.vine}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                  }}>{f.icon}</div>
                  <span style={{
                    padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                    background: `${f.tagColor}15`, color: f.tagColor, border: `1px solid ${f.tagColor}30`,
                  }}>{f.tag}</span>
                </div>

                <div style={{ fontSize: 16, fontWeight: 700, color: C.cream, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: C.shadow, lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="how-it-works" style={{ padding: '100px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.gold, textTransform: 'uppercase', marginBottom: 12 }}>How It Works</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 38, fontWeight: 700, color: C.cream }}>
              Up and running in 3 minutes
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative' }}>
            {/* Connecting line */}
            <div style={{
              position: 'absolute', top: 36, left: '12%', right: '12%', height: 1,
              background: `linear-gradient(90deg, transparent, ${C.fern}, ${C.fern}, transparent)`,
            }} />

            {[
              { n: '01', title: 'Set up your farm',      desc: 'Name, location, experience. The wizard takes 2 minutes.' },
              { n: '02', title: 'Create your first batch', desc: 'Pick breed, quantity, date. Vaccination schedule auto-generates.' },
              { n: '03', title: 'Track daily',            desc: 'Log updates in 30 seconds. Feed, deaths, health — all tracked.' },
              { n: '04', title: 'Sell smarter',           desc: 'Know exact cost per bird. List on marketplace or sell privately.' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
                  background: `linear-gradient(135deg, ${C.fern}, ${C.leaf})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 20px rgba(45,122,58,0.45)`,
                  border: `3px solid ${C.soil}`,
                }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: '#fff' }}>{s.n}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.cream, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: C.shadow, lineHeight: 1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section style={{ padding: '80px 80px', background: C.soil }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.gold, textTransform: 'uppercase', marginBottom: 12 }}>Testimonials</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 38, fontWeight: 700, color: C.cream }}>
              What farmers are saying
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                background: C.canopy, border: `1px solid ${C.vine}`,
                borderRadius: 16, padding: '28px',
                position: 'relative',
              }}>
                {/* Quote mark */}
                <div style={{
                  position: 'absolute', top: 16, right: 20,
                  fontFamily: 'Georgia, serif', fontSize: 72, color: C.fern,
                  opacity: 0.12, lineHeight: 1,
                }}>"</div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                  {[...Array(t.stars)].map((_, j) => (
                    <span key={j} style={{ color: C.gold, fontSize: 14 }}>★</span>
                  ))}
                </div>

                <p style={{ fontSize: 14, color: C.dusk, lineHeight: 1.75, marginBottom: 24, fontStyle: 'italic' }}>
                  "{t.quote}"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${C.fern}, ${C.gold})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: '#fff',
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.cream }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: C.shadow }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section id="pricing" style={{ padding: '100px 80px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.gold, textTransform: 'uppercase', marginBottom: 12 }}>Pricing</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 38, fontWeight: 700, color: C.cream }}>
              Simple, honest pricing
            </h2>
            <p style={{ fontSize: 15, color: C.shadow, marginTop: 10 }}>Start free. Upgrade when you're ready.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              {
                name: 'Free', price: '₦0', period: 'forever',
                desc: 'Perfect for your first batch.',
                highlight: false,
                features: ['Up to 3 active batches','Feed calculator','Vaccination scheduler','Daily update logging','Basic P&L tracking','Disease symptom checker'],
                cta: 'Start Free',
              },
              {
                name: 'Pro', price: '₦3,500', period: 'per month',
                desc: 'For farmers who want full control.',
                highlight: true,
                badge: 'Most Popular',
                features: ['Unlimited batches','Advanced analytics & charts','PDF report export','Marketplace listings (buy & sell)','Priority support','Market price alerts','Multi-farm management','Verified seller badge'],
                cta: 'Get Pro',
              },
            ].map((p, i) => (
              <div key={i} style={{
                background: p.highlight
                  ? `linear-gradient(160deg, ${C.sprout}, ${C.bark})`
                  : C.canopy,
                border: `1px solid ${p.highlight ? C.fern : C.vine}`,
                borderRadius: 18, padding: 32,
                position: 'relative', overflow: 'hidden',
                boxShadow: p.highlight ? `0 0 0 1px ${C.fern}, 0 20px 48px rgba(45,122,58,0.22)` : 'none',
              }}>
                {/* Egg decoration */}
                {p.highlight && (
                  <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.06 }}>
                    <EggSVG size={160} color={C.grass} />
                  </div>
                )}

                {p.badge && (
                  <div style={{
                    position: 'absolute', top: 18, right: 18,
                    padding: '4px 12px', borderRadius: 100,
                    background: `linear-gradient(135deg, ${C.gold}, ${C.sun})`,
                    color: C.ink, fontSize: 10, fontWeight: 800,
                  }}>{p.badge}</div>
                )}

                <div style={{ fontSize: 16, fontWeight: 700, color: C.cream, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: C.shadow, marginBottom: 20 }}>{p.desc}</div>

                <div style={{ marginBottom: 28 }}>
                  <span style={{ fontSize: 44, fontWeight: 900, color: p.highlight ? C.grass : C.cream }}>{p.price}</span>
                  <span style={{ fontSize: 13, color: C.shadow, marginLeft: 6 }}>/ {p.period}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: C.dusk }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                        background: p.highlight ? C.sprout : C.canopy2,
                        border: `1px solid ${C.vine}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, color: C.grass,
                      }}>✓</div>
                      {f}
                    </div>
                  ))}
                </div>

                <Link href="/register" style={{
                  display: 'block', textAlign: 'center',
                  padding: '13px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                  color: p.highlight ? '#fff' : C.grass, textDecoration: 'none',
                  background: p.highlight ? `linear-gradient(135deg, ${C.fern}, ${C.leaf})` : 'transparent',
                  border: p.highlight ? 'none' : `1.5px solid ${C.fern}`,
                  boxShadow: p.highlight ? '0 4px 16px rgba(45,122,58,0.4)' : 'none',
                }}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section style={{ padding: '40px 80px 80px' }}>
        <div style={{
          maxWidth: 1000, margin: '0 auto',
          background: `linear-gradient(135deg, ${C.sprout}, ${C.canopy})`,
          border: `1px solid ${C.fern}`,
          borderRadius: 22, padding: '64px 56px',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          {/* Big chicken bg */}
          <div style={{ position: 'absolute', right: -30, top: -30, opacity: 0.06 }}>
            <ChickenSVG size={260} color={C.grass} />
          </div>
          <div style={{ position: 'absolute', left: -20, bottom: -20, opacity: 0.05 }}>
            <EggSVG size={200} color={C.cream} />
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.grass, textTransform: 'uppercase', marginBottom: 18 }}>
            Join 5,000+ Nigerian Farmers
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 42, fontWeight: 900, color: C.cream,
            marginBottom: 16, lineHeight: 1.15,
          }}>
            Your flock deserves<br />
            <span style={{
              background: `linear-gradient(135deg, ${C.leaf}, ${C.grass})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>smarter management.</span>
          </h2>
          <p style={{ fontSize: 16, color: C.shadow, maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Start tracking your farm today. Free forever for up to 3 batches. No credit card required.
          </p>
          <Link href="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '16px 44px', borderRadius: 12, fontSize: 16, fontWeight: 700,
            color: '#fff', textDecoration: 'none',
            background: `linear-gradient(135deg, ${C.fern}, ${C.leaf})`,
            boxShadow: '0 8px 28px rgba(45,122,58,0.5)',
          }}>
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{
        borderTop: `1px solid ${C.vine}`,
        padding: '36px 80px',
        background: C.soil,
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, background: `linear-gradient(135deg, ${C.fern}, ${C.leaf})`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChickenSVG size={22} color="#fff" />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: C.cream }}>
              Chicken<span style={{ color: C.grass }}>Pro</span>
            </span>
          </div>
          <div style={{ fontSize: 12, color: C.moss }}>© 2025 ChickenPro. Built for Nigerian farmers.</div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy','Terms','Support'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: C.moss, textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = C.grass}
                onMouseLeave={e => e.target.style.color = C.moss}
              >{l}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes floatA {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-18px) rotate(5deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50%       { transform: translateY(-14px) rotate(0deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}