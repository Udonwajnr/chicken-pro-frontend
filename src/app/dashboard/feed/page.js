"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "../../../../lib/api";
import toast from "react-hot-toast";

function useIsMobile() {
  const [m, s] = useState(false);
  useEffect(() => {
    const c = () => s(window.innerWidth < 768);
    c();
    window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, []);
  return m;
}

const C = {
  forestSurface: "#162B1C",
  forestSurface2: "#1C3524",
  forestBorder: "#234D2E",
  forestMuted: "#3D6B4A",
  green: "#2D7A3A",
  greenLight: "#3D9E4D",
  greenGlow: "#6FCF7F",
  greenFaint: "#1A3D22",
  gold: "#C9A84C",
  goldLight: "#E8C76A",
  goldFaint: "#2A2010",
  red: "#C0392B",
  amberFaint: "rgba(212,134,10,0.15)",
  amberLight: "#F0A030",
  textPrimary: "#F0EBE0",
  textSecondary: "#A89880",
  textMuted: "#5A6B5E",
};
const fmt = (n) => (n != null ? `₦${Number(n).toLocaleString()}` : "₦0");

function Badge({ children, color = "green" }) {
  const s = {
    green: { bg: C.greenFaint, text: C.greenGlow, border: C.green },
    amber: { bg: C.amberFaint, text: C.amberLight, border: "#7A4A10" },
    gold: { bg: C.goldFaint, text: C.goldLight, border: C.gold },
    muted: {
      bg: C.forestSurface2,
      text: C.textSecondary,
      border: C.forestBorder,
    },
    blue: { bg: "rgba(36,113,163,0.15)", text: "#5DADE2", border: "#1A4A6A" },
  }[color] || { bg: C.greenFaint, text: C.greenGlow, border: C.green };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 100,
        fontSize: 11,
        fontWeight: 600,
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
      }}
    >
      {children}
    </span>
  );
}

function Skeleton({ h = 20, w = "100%" }) {
  return (
    <div
      style={{
        height: h,
        width: w,
        borderRadius: 6,
        background: `linear-gradient(90deg,${C.forestSurface} 25%,${C.forestSurface2} 50%,${C.forestSurface} 75%)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
  );
}

function FeedCard({ batch, rec, isMobile }) {
  if (!rec || rec.complete)
    return (
      <div
        style={{
          background: C.forestSurface,
          border: `1px solid ${C.forestBorder}`,
          borderRadius: 12,
          padding: "16px 18px",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: C.textPrimary,
            marginBottom: 4,
          }}
        >
          {batch.name}
        </div>
        <div style={{ fontSize: 12, color: C.textMuted }}>Cycle complete.</div>
      </div>
    );
  const phaseColor =
    {
      Starter: "green",
      Grower: "amber",
      Finisher: "gold",
      Chick: "green",
      Layer: "blue",
    }[rec.phase] || "muted";
  return (
    <div
      style={{
        background: `linear-gradient(135deg,${C.greenFaint},${C.forestSurface})`,
        border: `1px solid ${C.green}`,
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "10px 16px",
          background: "rgba(0,0,0,0.2)",
          borderBottom: `1px solid ${C.forestBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href={`/dashboard/batches/${batch._id}`}
          style={{ textDecoration: "none" }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>
            {batch.name}
          </div>
          <div style={{ fontSize: 10, color: C.textMuted }}>
            {batch.breed?.charAt(0).toUpperCase() + batch.breed?.slice(1)} · Day{" "}
            {batch.daysAlive}
          </div>
        </Link>
        <Badge color={phaseColor}>{rec.phase}</Badge>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: isMobile ? 32 : 40,
              fontWeight: 900,
              color: C.greenGlow,
              lineHeight: 1,
            }}
          >
            {rec.totalKgPerDay}
          </span>
          <span style={{ fontSize: 13, color: C.textMuted }}>kg today</span>
        </div>
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 12 }}>
          {rec.feedType} · {rec.gPerBirdPerDay}g/bird · {rec.birdsAlive} birds
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          {[
            { l: "Bags/week", v: `${rec.bagsPerWeek} bags` },
            { l: "Est. cost/wk", v: rec.estimatedWeeklyCost || "—" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "rgba(0,0,0,0.2)",
                borderRadius: 8,
                padding: "8px 10px",
              }}
            >
              <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 2 }}>
                {item.l}
              </div>
              <div
                style={{ fontSize: 12, fontWeight: 700, color: C.textPrimary }}
              >
                {item.v}
              </div>
            </div>
          ))}
        </div>
        <Link
          href={`/dashboard/batches/${batch._id}`}
          style={{
            display: "block",
            marginTop: 10,
            padding: "7px 12px",
            borderRadius: 7,
            textAlign: "center",
            fontSize: 11,
            fontWeight: 600,
            color: C.greenGlow,
            textDecoration: "none",
            border: `1px solid ${C.forestBorder}`,
            background: "rgba(0,0,0,0.2)",
          }}
        >
          Log Feed →
        </Link>
      </div>
    </div>
  );
}

export default function FeedPage() {
  const isMobile = useIsMobile();
  const [batches, setBatches] = useState([]);
  const [recs, setRecs] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalFeedCost, setTotalFeedCost] = useState(0);

  useEffect(() => {
    fetchAll();
  }, []);
  const fetchAll = async () => {
    setLoading(true);
    try {
      const bRes = await api.get("/batches?status=active");
      const active = bRes.data.batches || [];
      setBatches(active);
      const [recR, costR] = await Promise.all([
        Promise.allSettled(
          active.map((b) => api.get(`/batches/${b._id}/feed/recommendation`)),
        ),
        Promise.allSettled(
          active.map((b) => api.get(`/batches/${b._id}/feed/cost`)),
        ),
      ]);
      const rm = {};
      recR.forEach((r, i) => {
        if (r.status === "fulfilled")
          rm[active[i]._id] = r.value.data.recommendation;
      });
      setRecs(rm);
      let tc = 0;
      costR.forEach((r) => {
        if (r.status === "fulfilled")
          tc += r.value.data.summary?.totalCost || 0;
      });
      setTotalFeedCost(tc);
    } catch {
      toast.error("Failed to load feed data");
    } finally {
      setLoading(false);
    }
  };

  const totalKg = Object.values(recs)
    .filter((r) => r && !r.complete)
    .reduce((s, r) => s + (r.totalKgPerDay || 0), 0);
  const pad = isMobile ? "16px 14px" : "28px 32px";

  return (
    <div style={{ padding: pad, maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: isMobile ? 16 : 28,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "Playfair Display,Georgia,serif",
              fontSize: isMobile ? 22 : 28,
              fontWeight: 700,
              color: C.textPrimary,
              marginBottom: 4,
            }}
          >
            🌾 Feed Manager
          </h1>
          <p style={{ fontSize: 12, color: C.textMuted }}>
            Today's recommendations for all active batches
          </p>
        </div>
        <button
          onClick={fetchAll}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 600,
            border: `1px solid ${C.forestBorder}`,
            background: C.forestSurface2,
            color: C.textSecondary,
            cursor: "pointer",
            fontFamily: "Inter,sans-serif",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
          gap: isMobile ? 10 : 16,
          marginBottom: isMobile ? 16 : 28,
        }}
      >
        {loading
          ? [1, 2, 3].map((i) => <Skeleton key={i} h={100} />)
          : [
              {
                icon: "🐔",
                label: "Active Batches",
                value: batches.length,
                sub: "Need feed today",
                bar: `linear-gradient(90deg,${C.green},${C.greenLight})`,
                vc: C.greenGlow,
              },
              {
                icon: "🌾",
                label: "Total Feed Today",
                value: `${parseFloat(totalKg.toFixed(1))} kg`,
                sub: "All batches combined",
                bar: `linear-gradient(90deg,${C.gold},${C.goldLight})`,
                vc: C.goldLight,
              },
              {
                icon: "💰",
                label: "All-Time Feed Cost",
                value: fmt(totalFeedCost),
                sub: "Total logged spend",
                bar: "linear-gradient(90deg,#C0392B,#E74C3C)",
                vc: "#E88080",
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: C.forestSurface,
                  border: `1px solid ${C.forestBorder}`,
                  borderRadius: 14,
                  padding: "18px 18px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: s.bar,
                  }}
                />
                <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    color: C.textMuted,
                    marginBottom: 6,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 24 : 28,
                    fontWeight: 800,
                    color: s.vc,
                    marginBottom: 4,
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{s.sub}</div>
              </div>
            ))}
      </div>

      {/* Feed Cards */}
      <div style={{ marginBottom: isMobile ? 16 : 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>
            Today's Feed Recommendations
          </div>
          <div style={{ fontSize: 12, color: C.textMuted }}>
            {batches.length} batch{batches.length !== 1 ? "es" : ""}
          </div>
        </div>
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
              gap: 14,
            }}
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} h={200} />
            ))}
          </div>
        ) : batches.length ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
              gap: isMobile ? 12 : 16,
            }}
          >
            {batches.map((b) => (
              <FeedCard
                key={b._id}
                batch={b}
                rec={recs[b._id]}
                isMobile={isMobile}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "48px 20px",
              textAlign: "center",
              background: C.forestSurface,
              border: `1px solid ${C.forestBorder}`,
              borderRadius: 16,
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 10 }}>🌾</div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: C.textPrimary,
                marginBottom: 6,
              }}
            >
              No active batches
            </div>
            <Link
              href="/dashboard/batches/new"
              style={{
                display: "inline-flex",
                padding: "10px 20px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                background: `linear-gradient(135deg,${C.green},${C.greenLight})`,
                color: "#fff",
                textDecoration: "none",
              }}
            >
              + Create Batch
            </Link>
          </div>
        )}
      </div>

      {/* Phase Reference */}
      <div
        style={{
          background: C.forestSurface,
          border: `1px solid ${C.forestBorder}`,
          borderRadius: 14,
          overflow: "hidden",
          marginBottom: isMobile ? 14 : 24,
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: `1px solid ${C.forestBorder}`,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>
            Feed Phase Reference
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
            Broiler feeding guide
          </div>
        </div>
        <div style={{ padding: "14px 18px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
              gap: 12,
            }}
          >
            {[
              {
                phase: "Starter",
                weeks: "Wk 1–2",
                g: "45g",
                protein: "22–24%",
                feed: "Chick Mash",
                color: C.greenFaint,
                border: C.green,
                badge: "green",
                tip: "Never restrict feed. Chicks eat freely.",
              },
              {
                phase: "Grower",
                weeks: "Wk 3–4",
                g: "85g",
                protein: "20–22%",
                feed: "Growers Mash",
                color: C.amberFaint,
                border: "#7A4A10",
                badge: "amber",
                tip: "Check DCP for bone development.",
              },
              {
                phase: "Finisher",
                weeks: "Wk 5–6",
                g: "125g",
                protein: "18–20%",
                feed: "Finisher Mash",
                color: C.goldFaint,
                border: C.gold,
                badge: "gold",
                tip: "Coccidiostat-free before slaughter.",
              },
            ].map((p, i) => (
              <div
                key={i}
                style={{
                  background: p.color,
                  border: `1px solid ${p.border}`,
                  borderRadius: 12,
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Badge color={p.badge}>{p.phase}</Badge>
                  <span style={{ fontSize: 11, color: C.textMuted }}>
                    {p.weeks}
                  </span>
                </div>
                {[
                  { l: "Feed type", v: p.feed },
                  { l: "Per bird/day", v: p.g },
                  { l: "Protein", v: p.protein },
                ].map((row, j) => (
                  <div
                    key={j}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 5,
                    }}
                  >
                    <span style={{ fontSize: 11, color: C.textMuted }}>
                      {row.l}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: C.textPrimary,
                      }}
                    >
                      {row.v}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    fontSize: 10,
                    color: C.textMuted,
                    lineHeight: 1.5,
                    paddingTop: 8,
                    borderTop: `1px solid ${C.forestBorder}`,
                  }}
                >
                  💡 {p.tip}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buying Tips */}
      <div
        style={{
          background: C.forestSurface,
          border: `1px solid ${C.forestBorder}`,
          borderRadius: 14,
          padding: isMobile ? "16px" : "22px",
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: C.textPrimary,
            marginBottom: 14,
          }}
        >
          🛒 Buying Checklist
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)",
            gap: 10,
          }}
        >
          {[
            {
              icon: "🏷️",
              title: "Check protein %",
              desc: "Starter ≥22%, Grower ≥20%, Finisher ≥18%.",
            },
            {
              icon: "📅",
              title: "Manufacture date",
              desc: "Never buy feed older than 3 months.",
            },
            {
              icon: "🌡️",
              title: "Storage conditions",
              desc: "Heat/humidity grows mould. Reject if musty.",
            },
            {
              icon: "📋",
              title: "Ingredient list",
              desc: "No list = untrustworthy. Reputable brands list ingredients.",
            },
            {
              icon: "🏛️",
              title: "NAFDAC number",
              desc: "Registered feeds meet minimum quality standards.",
            },
            {
              icon: "👃",
              title: "Smell test",
              desc: "Good feed smells like grain. Sour = reject immediately.",
            },
          ].map((tip, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                padding: "10px 12px",
                background: C.forestSurface2,
                borderRadius: 10,
                border: `1px solid ${C.forestBorder}`,
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{tip.icon}</span>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.textPrimary,
                    marginBottom: 2,
                  }}
                >
                  {tip.title}
                </div>
                <div
                  style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.5 }}
                >
                  {tip.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}
