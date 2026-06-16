"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const c = () => setM(window.innerWidth < 768);
    c();
    window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, []);
  return m;
}

const C = {
  soil: "#0A1409",
  bark: "#0F1F14",
  canopy: "#162B1C",
  canopy2: "#1C3524",
  vine: "#234D2E",
  moss: "#3D6B4A",
  fern: "#2D7A3A",
  leaf: "#3D9E4D",
  grass: "#6FCF7F",
  sprout: "#1A3D22",
  cream: "#FAF7F2",
  parchment: "#F5F0E8",
  linen: "#E8DFD0",
  ink: "#2C2416",
  clay: "#8A7560",
  gold: "#C9A84C",
  sun: "#E8C76A",
  ember: "#2A2010",
  dawn: "#F0EBE0",
  dusk: "#A89880",
  shadow: "#5A6B5E",
};

function Counter({ target, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          let s = 0;
          const step = (t) => {
            if (!s) s = t;
            const p = Math.min((t - s) / 1800, 1);
            setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
            if (p < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const ChickenSVG = ({ size = 120, color = "#6FCF7F", style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <ellipse cx="60" cy="72" rx="34" ry="28" fill={color} opacity="0.9" />
    <ellipse
      cx="50"
      cy="70"
      rx="20"
      ry="13"
      fill={color}
      opacity="0.6"
      transform="rotate(-10 50 70)"
    />
    <ellipse
      cx="70"
      cy="70"
      rx="20"
      ry="13"
      fill={color}
      opacity="0.6"
      transform="rotate(10 70 70)"
    />
    <ellipse cx="60" cy="46" rx="12" ry="14" fill={color} opacity="0.9" />
    <circle cx="60" cy="32" r="16" fill={color} opacity="0.95" />
    <path
      d="M54 18 C54 18 56 10 58 14 C58 14 60 6 62 12 C62 12 64 8 66 16"
      stroke="#C0392B"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    <ellipse cx="57" cy="38" rx="4" ry="6" fill="#C0392B" opacity="0.9" />
    <path d="M72 30 L80 33 L72 36 Z" fill={C.gold} />
    <circle cx="68" cy="28" r="4" fill={C.ink} />
    <circle cx="69" cy="27" r="1.5" fill="#fff" />
    <path
      d="M94 60 C105 45 110 38 108 30 C106 35 98 42 90 55"
      fill={color}
      opacity="0.7"
    />
    <path
      d="M96 68 C110 58 118 52 118 42 C114 48 104 56 94 68"
      fill={color}
      opacity="0.5"
    />
    <rect x="50" y="98" width="5" height="18" rx="2" fill={C.gold} />
    <rect x="65" y="98" width="5" height="18" rx="2" fill={C.gold} />
    <path
      d="M47 116 L42 120 M50 116 L50 120 M53 116 L56 120"
      stroke={C.gold}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M62 116 L57 120 M65 116 L65 120 M68 116 L71 120"
      stroke={C.gold}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const EggSVG = ({ size = 60, color = "#FAF7F2", style = {} }) => (
  <svg
    width={size}
    height={size * 1.2}
    viewBox="0 0 60 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <path
      d="M30 4C16 4 6 20 6 36C6 54 16 68 30 68C44 68 54 54 54 36C54 20 44 4 30 4Z"
      fill={color}
      opacity="0.95"
    />
    <path
      d="M30 4C22 4 14 16 12 28C18 24 26 22 30 22C34 22 42 24 48 28C46 16 38 4 30 4Z"
      fill="white"
      opacity="0.3"
    />
    <ellipse
      cx="22"
      cy="24"
      rx="5"
      ry="8"
      fill="white"
      opacity="0.25"
      transform="rotate(-20 22 24)"
    />
  </svg>
);

const FeatherSVG = ({ size = 80, color = "#6FCF7F", style = {} }) => (
  <svg
    width={size}
    height={size * 1.5}
    viewBox="0 0 60 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <path
      d="M30 88 C30 88 28 60 10 30 C20 40 28 50 30 60 C32 50 40 40 50 30 C32 60 30 88 30 88Z"
      fill={color}
      opacity="0.8"
    />
    <path d="M30 88 L30 20" stroke={color} strokeWidth="1.5" opacity="0.6" />
  </svg>
);

const DashboardMockupSVG = ({ width = 560 }) => {
  const h = width * 0.68;
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 560 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="sh" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="16"
            floodColor="#000"
            floodOpacity="0.5"
          />
        </filter>
      </defs>
      <rect
        x="10"
        y="10"
        width="540"
        height="360"
        rx="14"
        fill={C.canopy}
        stroke={C.vine}
        strokeWidth="1.5"
        filter="url(#sh)"
      />
      <rect x="10" y="10" width="540" height="36" rx="14" fill={C.canopy2} />
      <rect x="10" y="32" width="540" height="14" fill={C.canopy2} />
      <circle cx="34" cy="28" r="5" fill="#FF5F57" />
      <circle cx="52" cy="28" r="5" fill="#FEBC2E" />
      <circle cx="70" cy="28" r="5" fill="#28C840" />
      <rect
        x="160"
        y="19"
        width="200"
        height="18"
        rx="9"
        fill={C.bark}
        opacity="0.6"
      />
      <text
        x="260"
        y="31"
        textAnchor="middle"
        fill={C.shadow}
        fontSize="8"
        fontFamily="Inter, sans-serif"
      >
        chickenpro.com/dashboard
      </text>
      <rect
        x="10"
        y="46"
        width="110"
        height="324"
        fill={C.cream}
        opacity="0.06"
      />
      {["📊", "🐔", "🌾", "💉", "🥚", "💰", "📈"].map((icon, i) => (
        <g key={i}>
          <rect
            x="18"
            y={58 + i * 36}
            width="94"
            height="26"
            rx="7"
            fill={i === 0 ? C.fern : "transparent"}
            opacity={i === 0 ? 0.8 : 0.3}
          />
          <text x="32" y={75 + i * 36} fontSize="12" fontFamily="system-ui">
            {icon}
          </text>
          <text
            x="50"
            y={75 + i * 36}
            fill={i === 0 ? "#fff" : C.shadow}
            fontSize="9"
            fontFamily="Inter,sans-serif"
          >
            {
              [
                "Dashboard",
                "Batches",
                "Feed",
                "Health",
                "Production",
                "Finance",
                "Analytics",
              ][i]
            }
          </text>
        </g>
      ))}
      {[
        { x: 130, l: "Batches", v: "3", c: C.grass },
        { x: 224, l: "Birds", v: "580", c: "#5DADE2" },
        { x: 318, l: "Revenue", v: "₦1.2M", c: C.sun },
        { x: 412, l: "Mortality", v: "1.2%", c: C.grass },
      ].map((d, i) => (
        <g key={i}>
          <rect
            x={d.x}
            y="58"
            width="82"
            height="56"
            rx="8"
            fill={C.bark}
            stroke={C.vine}
            strokeWidth="1"
          />
          <rect
            x={d.x}
            y="58"
            width="82"
            height="3"
            rx="1"
            fill={d.c}
            opacity="0.9"
          />
          <text
            x={d.x + 8}
            y="80"
            fill={C.shadow}
            fontSize="7"
            fontFamily="Inter,sans-serif"
          >
            {d.l}
          </text>
          <text
            x={d.x + 8}
            y="101"
            fill={d.c}
            fontSize="16"
            fontWeight="bold"
            fontFamily="Inter,sans-serif"
          >
            {d.v}
          </text>
        </g>
      ))}
      <rect
        x="130"
        y="124"
        width="270"
        height="130"
        rx="8"
        fill={C.bark}
        stroke={C.vine}
        strokeWidth="1"
      />
      {[
        { x: 150, r: 70, e: 45 },
        { x: 190, r: 85, e: 55 },
        { x: 230, r: 60, e: 40 },
        { x: 270, r: 95, e: 60 },
        { x: 310, r: 75, e: 50 },
        { x: 350, r: 110, e: 65 },
      ].map((b, i) => (
        <g key={i}>
          <rect
            x={b.x}
            y={240 - b.r}
            width="9"
            height={b.r}
            rx="2"
            fill={C.grass}
            opacity="0.8"
          />
          <rect
            x={b.x + 10}
            y={240 - b.e}
            width="9"
            height={b.e}
            rx="2"
            fill="#E88080"
            opacity="0.8"
          />
        </g>
      ))}
      <rect
        x="410"
        y="124"
        width="130"
        height="130"
        rx="8"
        fill={C.bark}
        stroke={C.vine}
        strokeWidth="1"
      />
      <text
        x="422"
        y="140"
        fill={C.dawn}
        fontSize="8"
        fontWeight="600"
        fontFamily="Inter,sans-serif"
      >
        💉 Vaccinations
      </text>
      {["Newcastle·D7", "Gumboro·D14", "FowlPox·D42"].map((v, i) => (
        <g key={i}>
          <rect
            x="418"
            y={148 + i * 28}
            width="114"
            height="22"
            rx="5"
            fill={C.canopy}
            stroke={C.vine}
            strokeWidth="0.5"
          />
          <text
            x="426"
            y={163 + i * 28}
            fill={C.dusk}
            fontSize="7"
            fontFamily="Inter,sans-serif"
          >
            {v}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", s);
    return () => window.removeEventListener("scroll", s);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setActiveFeature((p) => (p + 1) % 6), 3500);
    return () => clearInterval(t);
  }, []);

  const FEATURES = [
    {
      icon: "🐔",
      title: "Smart Batch Tracking",
      desc: "Every bird accounted for from day one. Mortality alerts fire when death rate crosses 3%.",
      tag: "Core",
      tagColor: C.grass,
    },
    {
      icon: "🌾",
      title: "Feed Calculator",
      desc: "Exact grams per bird today. Brand guide with Nigerian market prices and where to buy.",
      tag: "Save Money",
      tagColor: C.sun,
    },
    {
      icon: "💉",
      title: "Vaccination Scheduler",
      desc: "Auto-generated the moment you create a batch. Never miss Newcastle or Gumboro again.",
      tag: "Save Lives",
      tagColor: C.grass,
    },
    {
      icon: "🥚",
      title: "Production Tracking",
      desc: "Daily egg logs for layers. Weekly weight tracking for broilers. Slaughter readiness at 1.8kg.",
      tag: "Numbers",
      tagColor: "#C084FC",
    },
    {
      icon: "💰",
      title: "Real-time P&L",
      desc: "Know your exact profit per bird, ROI, and break-even price before you negotiate.",
      tag: "Profit",
      tagColor: C.sun,
    },
    {
      icon: "🏪",
      title: "Marketplace",
      desc: "List birds and eggs directly to buyers. Escrow payments protect every transaction.",
      tag: "New",
      tagColor: C.grass,
    },
  ];

  const BREEDS = [
    {
      name: "Broiler",
      emoji: "🐔",
      cycle: "6 weeks",
      profit: "₦100–₦500/bird",
      desc: "Fast cycle, high volume.",
      badge: "Most Popular",
      badgeColor: C.grass,
    },
    {
      name: "Layer",
      emoji: "🥚",
      cycle: "72 weeks",
      profit: "₦7,600/bird/yr",
      desc: "Daily egg income.",
      badge: "Best ROI",
      badgeColor: C.sun,
    },
    {
      name: "Cockerel",
      emoji: "🐓",
      cycle: "12 weeks",
      profit: "₦1k–₦3k",
      desc: "Festive season premium.",
      badge: "Festive Gold",
      badgeColor: "#5DADE2",
    },
  ];

  const TESTIMONIALS = [
    {
      name: "Chukwuemeka Obi",
      role: "Broiler · Ogun",
      avatar: "CO",
      quote:
        "Before ChickenPro I was guessing my profit. Last batch I made ₦180,000 on 400 birds.",
      stars: 5,
    },
    {
      name: "Fatimah Abdullahi",
      role: "Layer · Kano",
      avatar: "FA",
      quote:
        "The vaccination reminder saved my flock. I once lost 60 birds to Gumboro. Never again.",
      stars: 5,
    },
    {
      name: "Seun Adewale",
      role: "Commercial · Lagos",
      avatar: "SA",
      quote:
        "I run 3 batches at once. Income up 40% in 3 months with ChickenPro.",
      stars: 5,
    },
  ];

  const pad = isMobile ? "40px 20px" : "80px 80px";
  const maxW = { maxWidth: 1280, margin: "0 auto" };

  return (
    <div
      style={{
        fontFamily: "'Inter',system-ui,sans-serif",
        background: C.bark,
        color: C.dawn,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* ══ NAVBAR ══ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(10,20,9,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled
            ? `1px solid ${C.vine}`
            : "1px solid transparent",
          transition: "all 0.3s",
          padding: isMobile ? "0 16px" : "0 40px",
          height: isMobile ? 56 : 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: isMobile ? 32 : 38,
              height: isMobile ? 32 : 38,
              background: `linear-gradient(135deg,${C.fern},${C.leaf})`,
              borderRadius: isMobile ? 8 : 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChickenSVG size={isMobile ? 22 : 28} color="#fff" />
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: isMobile ? 18 : 21,
              fontWeight: 700,
              color: C.cream,
            }}
          >
            Chicken<span style={{ color: C.grass }}>Pro</span>
          </span>
        </div>

        {/* Desktop nav */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 2 }}>
            {["Features", "How It Works", "Pricing"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                style={{
                  padding: "7px 16px",
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 500,
                  color: C.shadow,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = C.cream;
                  e.target.style.background = C.canopy;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = C.shadow;
                  e.target.style.background = "transparent";
                }}
              >
                {l}
              </a>
            ))}
          </div>
        )}

        {/* CTA / Hamburger */}
        <div style={{ display: "flex", gap: 8 }}>
          {isMobile ? (
            <>
              <Link
                href="/login"
                style={{
                  padding: "7px 14px",
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.grass,
                  textDecoration: "none",
                  border: `1.5px solid ${C.vine}`,
                }}
              >
                Sign In
              </Link>
              <button
                onClick={() => setMenuOpen((p) => !p)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: C.canopy,
                  border: `1px solid ${C.vine}`,
                  color: C.cream,
                  fontSize: 18,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ☰
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  padding: "8px 18px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.grass,
                  textDecoration: "none",
                  border: `1.5px solid ${C.vine}`,
                }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                style={{
                  padding: "8px 20px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  textDecoration: "none",
                  background: `linear-gradient(135deg,${C.fern},${C.leaf})`,
                  boxShadow: "0 4px 14px rgba(45,122,58,0.4)",
                }}
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99,
              background: "rgba(0,0,0,0.5)",
            }}
            onClick={() => setMenuOpen(false)}
          />
          <div
            style={{
              position: "fixed",
              top: 56,
              left: 0,
              right: 0,
              zIndex: 100,
              background: C.canopy,
              borderBottom: `1px solid ${C.vine}`,
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
          >
            {["Features", "How It Works", "Pricing", "Marketplace"].map((l) => (
              <a
                key={l}
                href={
                  l === "Marketplace"
                    ? "/marketplace"
                    : `#${l.toLowerCase().replace(/\s+/g, "-")}`
                }
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "14px 20px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.dawn,
                  textDecoration: "none",
                  borderBottom: `1px solid ${C.vine}`,
                }}
              >
                {l}
              </a>
            ))}
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                margin: 16,
                padding: "12px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                textDecoration: "none",
                background: `linear-gradient(135deg,${C.fern},${C.leaf})`,
                textAlign: "center",
              }}
            >
              Get Started Free →
            </Link>
          </div>
        </>
      )}

      {/* ══ HERO ══ */}
      <section
        style={{
          minHeight: isMobile ? "auto" : "100vh",
          display: "flex",
          alignItems: "center",
          padding: isMobile ? "80px 20px 40px" : "100px 80px 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "20%",
            width: 400,
            height: 400,
            background: `radial-gradient(circle,rgba(45,122,58,0.12) 0%,transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {!isMobile && (
          <>
            <div
              style={{
                position: "absolute",
                top: 140,
                right: 80,
                animation: "floatA 6s ease-in-out infinite",
              }}
            >
              <ChickenSVG size={64} color={C.grass} style={{ opacity: 0.15 }} />
            </div>
            <div
              style={{
                position: "absolute",
                top: 200,
                right: 200,
                animation: "floatB 8s ease-in-out infinite",
              }}
            >
              <EggSVG size={32} color={C.cream} style={{ opacity: 0.1 }} />
            </div>
          </>
        )}

        <div
          style={{
            ...maxW,
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 0 : 60,
            alignItems: "center",
            width: "100%",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 14px",
                borderRadius: 100,
                background: C.sprout,
                border: `1px solid ${C.vine}`,
                fontSize: 10,
                fontWeight: 700,
                color: C.grass,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: isMobile ? 20 : 28,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: C.grass,
                  animation: "pulse 2s infinite",
                }}
              />
              Built for Nigerian Farmers
            </div>

            <h1
              style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: isMobile ? 36 : "clamp(44px,5vw,72px)",
                fontWeight: 900,
                lineHeight: 1.08,
                color: C.cream,
                marginBottom: isMobile ? 16 : 24,
              }}
            >
              Farm smarter.
              <br />
              <span
                style={{
                  background: `linear-gradient(135deg,${C.leaf},${C.grass})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Earn more.
              </span>
            </h1>

            <p
              style={{
                fontSize: isMobile ? 15 : 18,
                lineHeight: 1.75,
                color: C.shadow,
                maxWidth: 480,
                marginBottom: isMobile ? 28 : 40,
              }}
            >
              Complete poultry farm management — track flocks, automate
              vaccinations, calculate real profit, and sell to buyers.
            </p>

            <div
              style={{
                display: "flex",
                gap: isMobile ? 10 : 14,
                marginBottom: isMobile ? 32 : 52,
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/register"
                style={{
                  padding: isMobile ? "13px 28px" : "15px 36px",
                  borderRadius: 10,
                  fontSize: isMobile ? 14 : 15,
                  fontWeight: 700,
                  color: "#fff",
                  textDecoration: "none",
                  background: `linear-gradient(135deg,${C.fern},${C.leaf})`,
                  boxShadow: "0 6px 24px rgba(45,122,58,0.45)",
                }}
              >
                Start for Free →
              </Link>
              {!isMobile && (
                <a
                  href="#how-it-works"
                  style={{
                    padding: "15px 28px",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    color: C.shadow,
                    textDecoration: "none",
                    border: `1.5px solid ${C.vine}`,
                  }}
                >
                  Watch how it works
                </a>
              )}
            </div>

            <div style={{ display: "flex", gap: isMobile ? 24 : 36 }}>
              {[
                { val: 5000, suffix: "+", label: "Farmers", prefix: "" },
                {
                  val: 2,
                  suffix: ".4B",
                  label: "Revenue tracked",
                  prefix: "₦",
                },
                { val: 98, suffix: "%", label: "Avg survival", prefix: "" },
              ].map((s, i) => (
                <div key={i}>
                  <div
                    style={{
                      fontSize: isMobile ? 20 : 24,
                      fontWeight: 800,
                      color: C.grass,
                      lineHeight: 1,
                    }}
                  >
                    <Counter
                      target={s.val}
                      suffix={s.suffix}
                      prefix={s.prefix}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? 10 : 11,
                      color: C.shadow,
                      marginTop: 3,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Dashboard mockup (desktop only) */}
          {!isMobile && (
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  background: C.canopy,
                  borderRadius: 16,
                  border: `1px solid ${C.vine}`,
                  boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
                  overflow: "hidden",
                  transform: "perspective(1200px) rotateY(-6deg) rotateX(3deg)",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform =
                    "perspective(1200px) rotateY(-2deg) rotateX(1deg)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform =
                    "perspective(1200px) rotateY(-6deg) rotateX(3deg)")
                }
              >
                <DashboardMockupSVG />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══ BREEDS ══ */}
      <section style={{ padding: pad, ...maxW }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 32 : 52 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 3,
              color: C.gold,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            What are you raising?
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: isMobile ? 26 : 38,
              fontWeight: 700,
              color: C.cream,
              marginBottom: 14,
            }}
          >
            Built for every breed
          </h2>
          <p
            style={{
              fontSize: isMobile ? 13 : 15,
              color: C.shadow,
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            ChickenPro adapts — the right feed schedule, vaccination plan, and
            profit calculator.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
            gap: isMobile ? 14 : 20,
          }}
        >
          {BREEDS.map((b, i) => (
            <div
              key={i}
              style={{
                background: `linear-gradient(160deg,${C.sprout},${C.bark})`,
                border: `1px solid ${C.vine}`,
                borderRadius: 18,
                padding: isMobile ? "24px 22px" : "32px 28px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: -10,
                  bottom: -10,
                  opacity: 0.07,
                }}
              >
                <ChickenSVG size={isMobile ? 100 : 140} color={C.cream} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: isMobile ? 16 : 24,
                }}
              >
                <div style={{ fontSize: isMobile ? 36 : 48 }}>{b.emoji}</div>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: 100,
                    fontSize: 10,
                    fontWeight: 700,
                    background: `${b.badgeColor}20`,
                    color: b.badgeColor,
                    border: `1px solid ${b.badgeColor}40`,
                  }}
                >
                  {b.badge}
                </span>
              </div>
              <div
                style={{
                  fontSize: isMobile ? 20 : 24,
                  fontWeight: 800,
                  color: C.cream,
                  marginBottom: 6,
                }}
              >
                {b.name}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: C.shadow,
                  marginBottom: isMobile ? 16 : 24,
                  lineHeight: 1.5,
                }}
              >
                {b.desc}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { l: "Cycle", v: b.cycle },
                  { l: "Profit", v: b.profit },
                ].map((s, j) => (
                  <div
                    key={j}
                    style={{
                      flex: 1,
                      background: "rgba(0,0,0,0.3)",
                      border: `1px solid ${C.vine}`,
                      borderRadius: 10,
                      padding: "10px 12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        color: C.shadow,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        marginBottom: 3,
                      }}
                    >
                      {s.l}
                    </div>
                    <div
                      style={{
                        fontSize: isMobile ? 12 : 13,
                        fontWeight: 700,
                        color: C.cream,
                      }}
                    >
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" style={{ padding: pad, background: C.soil }}>
        <div style={maxW}>
          <div
            style={{ textAlign: "center", marginBottom: isMobile ? 32 : 56 }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 3,
                color: C.gold,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Features
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: isMobile ? 26 : 38,
                fontWeight: 700,
                color: C.cream,
              }}
            >
              Every tool your farm needs
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
              gap: isMobile ? 12 : 18,
            }}
          >
            {FEATURES.map((f, i) => (
              <div
                key={i}
                onClick={() => setActiveFeature(i)}
                style={{
                  background: activeFeature === i ? C.canopy : C.bark,
                  border: `1px solid ${activeFeature === i ? C.fern : C.vine}`,
                  borderRadius: 14,
                  padding: isMobile ? "18px" : "24px",
                  cursor: "pointer",
                  transition: "all 0.25s",
                  boxShadow:
                    activeFeature === i
                      ? `0 0 0 1px ${C.fern},0 8px 28px rgba(45,122,58,0.18)`
                      : "none",
                }}
                onMouseEnter={() => setActiveFeature(i)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: isMobile ? 12 : 16,
                  }}
                >
                  <div
                    style={{
                      width: isMobile ? 40 : 48,
                      height: isMobile ? 40 : 48,
                      borderRadius: 12,
                      background: C.sprout,
                      border: `1px solid ${C.vine}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isMobile ? 20 : 24,
                    }}
                  >
                    {f.icon}
                  </div>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: 100,
                      fontSize: 10,
                      fontWeight: 700,
                      background: `${f.tagColor}15`,
                      color: f.tagColor,
                      border: `1px solid ${f.tagColor}30`,
                    }}
                  >
                    {f.tag}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 14 : 16,
                    fontWeight: 700,
                    color: C.cream,
                    marginBottom: 8,
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 12 : 13,
                    color: C.shadow,
                    lineHeight: 1.65,
                  }}
                >
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section
        id="how-it-works"
        style={{ padding: isMobile ? "48px 20px" : pad }}
      >
        <div style={{ ...maxW, maxWidth: 1100 }}>
          <div
            style={{ textAlign: "center", marginBottom: isMobile ? 32 : 64 }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 3,
                color: C.gold,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              How It Works
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: isMobile ? 26 : 38,
                fontWeight: 700,
                color: C.cream,
              }}
            >
              Up and running in 3 minutes
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)",
              gap: isMobile ? 20 : 24,
            }}
          >
            {[
              {
                n: "01",
                title: "Set up your farm",
                desc: "Name, location, experience. 2 minutes.",
              },
              {
                n: "02",
                title: "Create a batch",
                desc: "Pick breed, quantity. Vaccines auto-generate.",
              },
              {
                n: "03",
                title: "Track daily",
                desc: "Log updates in 30 seconds. All tracked.",
              },
              {
                n: "04",
                title: "Sell smarter",
                desc: "Know exact cost. List on marketplace.",
              },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: isMobile ? 56 : 72,
                    height: isMobile ? 56 : 72,
                    borderRadius: "50%",
                    margin: "0 auto 16px",
                    background: `linear-gradient(135deg,${C.fern},${C.leaf})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 20px rgba(45,122,58,0.45)",
                    border: `3px solid ${C.soil}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: isMobile ? 16 : 20,
                      fontWeight: 800,
                      color: "#fff",
                    }}
                  >
                    {s.n}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 13 : 15,
                    fontWeight: 700,
                    color: C.cream,
                    marginBottom: 6,
                  }}
                >
                  {s.title}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 11 : 13,
                    color: C.shadow,
                    lineHeight: 1.6,
                  }}
                >
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section style={{ padding: pad, background: C.soil }}>
        <div style={{ ...maxW, maxWidth: 1100 }}>
          <div
            style={{ textAlign: "center", marginBottom: isMobile ? 28 : 52 }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 3,
                color: C.gold,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Testimonials
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: isMobile ? 26 : 38,
                fontWeight: 700,
                color: C.cream,
              }}
            >
              What farmers are saying
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
              gap: isMobile ? 14 : 20,
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                style={{
                  background: C.canopy,
                  border: `1px solid ${C.vine}`,
                  borderRadius: 16,
                  padding: isMobile ? "22px" : "28px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 16,
                    fontFamily: "Georgia,serif",
                    fontSize: isMobile ? 48 : 72,
                    color: C.fern,
                    opacity: 0.12,
                    lineHeight: 1,
                  }}
                >
                  "
                </div>
                <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                  {[...Array(t.stars)].map((_, j) => (
                    <span key={j} style={{ color: C.gold, fontSize: 13 }}>
                      ★
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: isMobile ? 13 : 14,
                    color: C.dusk,
                    lineHeight: 1.75,
                    marginBottom: isMobile ? 16 : 24,
                    fontStyle: "italic",
                  }}
                >
                  "{t.quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: isMobile ? 36 : 44,
                      height: isMobile ? 36 : 44,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg,${C.fern},${C.gold})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isMobile ? 12 : 14,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: isMobile ? 12 : 14,
                        fontWeight: 600,
                        color: C.cream,
                      }}
                    >
                      {t.name}
                    </div>
                    <div style={{ fontSize: 11, color: C.shadow }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section id="pricing" style={{ padding: isMobile ? "48px 20px" : pad }}>
        <div style={{ ...maxW, maxWidth: 820 }}>
          <div
            style={{ textAlign: "center", marginBottom: isMobile ? 28 : 52 }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 3,
                color: C.gold,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Pricing
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: isMobile ? 26 : 38,
                fontWeight: 700,
                color: C.cream,
              }}
            >
              Simple, honest pricing
            </h2>
            <p style={{ fontSize: 14, color: C.shadow, marginTop: 10 }}>
              Start free. Upgrade when you're ready.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? 14 : 20,
            }}
          >
            {[
              {
                name: "Free",
                price: "₦0",
                period: "forever",
                desc: "Perfect for your first batch.",
                hl: false,
                features: [
                  "Up to 3 batches",
                  "Feed calculator",
                  "Vaccination scheduler",
                  "Daily update logging",
                  "Basic P&L tracking",
                  "Symptom checker",
                ],
                cta: "Start Free",
              },
              {
                name: "Pro",
                price: "₦3,500",
                period: "per month",
                desc: "Full control for serious farmers.",
                hl: true,
                badge: "Most Popular",
                features: [
                  "Unlimited batches",
                  "Advanced analytics",
                  "PDF report export",
                  "Marketplace listings",
                  "Priority support",
                  "Market price alerts",
                  "Multi-farm management",
                  "Verified seller badge",
                ],
                cta: "Get Pro",
              },
            ].map((p, i) => (
              <div
                key={i}
                style={{
                  background: p.hl
                    ? `linear-gradient(160deg,${C.sprout},${C.bark})`
                    : C.canopy,
                  border: `1px solid ${p.hl ? C.fern : C.vine}`,
                  borderRadius: 18,
                  padding: isMobile ? "24px" : "32px",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: p.hl
                    ? `0 0 0 1px ${C.fern},0 20px 48px rgba(45,122,58,0.22)`
                    : "none",
                }}
              >
                {p.hl && (
                  <div
                    style={{
                      position: "absolute",
                      right: -20,
                      bottom: -20,
                      opacity: 0.06,
                    }}
                  >
                    <EggSVG size={isMobile ? 120 : 160} color={C.grass} />
                  </div>
                )}
                {p.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      padding: "4px 12px",
                      borderRadius: 100,
                      background: `linear-gradient(135deg,${C.gold},${C.sun})`,
                      color: C.ink,
                      fontSize: 10,
                      fontWeight: 800,
                    }}
                  >
                    {p.badge}
                  </div>
                )}
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: C.cream,
                    marginBottom: 4,
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.shadow,
                    marginBottom: isMobile ? 16 : 20,
                  }}
                >
                  {p.desc}
                </div>
                <div style={{ marginBottom: isMobile ? 20 : 28 }}>
                  <span
                    style={{
                      fontSize: isMobile ? 36 : 44,
                      fontWeight: 900,
                      color: p.hl ? C.grass : C.cream,
                    }}
                  >
                    {p.price}
                  </span>
                  <span
                    style={{ fontSize: 13, color: C.shadow, marginLeft: 6 }}
                  >
                    / {p.period}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    marginBottom: isMobile ? 20 : 28,
                  }}
                >
                  {p.features.map((f, j) => (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 13,
                        color: C.dusk,
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: p.hl ? C.sprout : C.canopy2,
                          border: `1px solid ${C.vine}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          color: C.grass,
                        }}
                      >
                        ✓
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
                <Link
                  href="/register"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "13px 24px",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: "none",
                    color: p.hl ? "#fff" : C.grass,
                    background: p.hl
                      ? `linear-gradient(135deg,${C.fern},${C.leaf})`
                      : "transparent",
                    border: p.hl ? "none" : `1.5px solid ${C.fern}`,
                    boxShadow: p.hl ? "0 4px 16px rgba(45,122,58,0.4)" : "none",
                  }}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section
        style={{ padding: isMobile ? "20px 16px 40px" : "40px 80px 80px" }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            background: `linear-gradient(135deg,${C.sprout},${C.canopy})`,
            border: `1px solid ${C.fern}`,
            borderRadius: isMobile ? 16 : 22,
            padding: isMobile ? "36px 24px" : "64px 56px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {!isMobile && (
            <div
              style={{
                position: "absolute",
                right: -30,
                top: -30,
                opacity: 0.06,
              }}
            >
              <ChickenSVG size={260} color={C.grass} />
            </div>
          )}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 3,
              color: C.grass,
              textTransform: "uppercase",
              marginBottom: isMobile ? 12 : 18,
            }}
          >
            Join 5,000+ Nigerian Farmers
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: isMobile ? 28 : 42,
              fontWeight: 900,
              color: C.cream,
              marginBottom: isMobile ? 12 : 16,
              lineHeight: 1.15,
            }}
          >
            Your flock deserves
            <br />
            <span
              style={{
                background: `linear-gradient(135deg,${C.leaf},${C.grass})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              smarter management.
            </span>
          </h2>
          <p
            style={{
              fontSize: isMobile ? 14 : 16,
              color: C.shadow,
              maxWidth: 480,
              margin: `0 auto ${isMobile ? 24 : 36}px`,
              lineHeight: 1.7,
            }}
          >
            Start tracking today. Free forever for up to 3 batches. No credit
            card.
          </p>
          <Link
            href="/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: isMobile ? "14px 32px" : "16px 44px",
              borderRadius: 12,
              fontSize: isMobile ? 14 : 16,
              fontWeight: 700,
              color: "#fff",
              textDecoration: "none",
              background: `linear-gradient(135deg,${C.fern},${C.leaf})`,
              boxShadow: "0 8px 28px rgba(45,122,58,0.5)",
            }}
          >
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer
        style={{
          borderTop: `1px solid ${C.vine}`,
          padding: isMobile ? "24px 16px" : "36px 80px",
          background: C.soil,
        }}
      >
        <div
          style={{
            ...maxW,
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 12 : 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                background: `linear-gradient(135deg,${C.fern},${C.leaf})`,
                borderRadius: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChickenSVG size={20} color="#fff" />
            </div>
            <span
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 16,
                fontWeight: 700,
                color: C.cream,
              }}
            >
              Chicken<span style={{ color: C.grass }}>Pro</span>
            </span>
          </div>
          <div style={{ fontSize: 12, color: C.moss }}>© 2025 ChickenPro</div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Terms", "Support"].map((l) => (
              <a
                key={l}
                href="#"
                style={{ fontSize: 12, color: C.moss, textDecoration: "none" }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes floatA { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-18px) rotate(5deg); } }
        @keyframes floatB { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.8); } }
      `}</style>
    </div>
  );
}
