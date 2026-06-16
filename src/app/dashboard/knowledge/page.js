"use client";

import { useState, useEffect } from "react";
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
  green: "#2D7A3A",
  greenLight: "#3D9E4D",
  greenGlow: "#6FCF7F",
  greenFaint: "#1A3D22",
  gold: "#C9A84C",
  goldLight: "#E8C76A",
  goldFaint: "#2A2010",
  red: "#C0392B",
  redFaint: "rgba(192,57,43,0.15)",
  amber: "#D4860A",
  amberLight: "#F0A030",
  amberFaint: "rgba(212,134,10,0.15)",
  textPrimary: "#F0EBE0",
  textSecondary: "#A89880",
  textMuted: "#5A6B5E",
};

function Badge({ children, color = "green" }) {
  const s = {
    green: { bg: C.greenFaint, text: C.greenGlow, border: C.green },
    red: { bg: C.redFaint, text: "#E88080", border: "#7B1F1F" },
    amber: { bg: C.amberFaint, text: C.amberLight, border: "#7A4A10" },
    gold: { bg: C.goldFaint, text: C.goldLight, border: C.gold },
    muted: {
      bg: C.forestSurface2,
      text: C.textSecondary,
      border: C.forestBorder,
    },
  }[color] || { bg: C.greenFaint, text: C.greenGlow, border: C.green };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
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

// ── Market Prices ─────────────────────────
function MarketPrices({ prices, loading, isMobile }) {
  const [region, setRegion] = useState("");
  const regions = prices.map((p) => p.region);
  const filtered = region ? prices.filter((p) => p.region === region) : prices;
  return (
    <div>
      <div
        style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}
      >
        <button
          onClick={() => setRegion("")}
          style={{
            padding: "7px 14px",
            borderRadius: 7,
            fontSize: 11,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter,sans-serif",
            background: !region ? C.greenFaint : C.forestSurface2,
            color: !region ? C.greenGlow : C.textMuted,
            boxShadow: !region ? `inset 0 0 0 1px ${C.green}` : "none",
          }}
        >
          All
        </button>
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            style={{
              padding: "7px 14px",
              borderRadius: 7,
              fontSize: 11,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontFamily: "Inter,sans-serif",
              background: region === r ? C.greenFaint : C.forestSurface2,
              color: region === r ? C.greenGlow : C.textMuted,
              boxShadow: region === r ? `inset 0 0 0 1px ${C.green}` : "none",
            }}
          >
            {r}
          </button>
        ))}
      </div>
      {loading
        ? [1, 2].map((i) => <Skeleton key={i} h={200} />)
        : filtered.map((rd, ri) => (
            <div
              key={ri}
              style={{
                background: C.forestSurface,
                border: `1px solid ${C.forestBorder}`,
                borderRadius: 14,
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  padding: isMobile ? "12px 14px" : "14px 20px",
                  borderBottom: `1px solid ${C.forestBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? 13 : 15,
                    fontWeight: 700,
                    color: C.textPrimary,
                  }}
                >
                  📍 {rd.region}
                </div>
                <div style={{ fontSize: 10, color: C.textMuted }}>
                  Updated: {rd.updatedAt}
                </div>
              </div>
              <div
                style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: 400,
                  }}
                >
                  <thead>
                    <tr style={{ background: C.forestSurface2 }}>
                      {["Product", "Min", "Max", "Unit"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: isMobile ? "8px 12px" : "10px 18px",
                            textAlign: "left",
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 1.2,
                            color: C.textMuted,
                            borderBottom: `1px solid ${C.forestBorder}`,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rd.prices.map((p, pi) => (
                      <tr
                        key={pi}
                        style={{ borderBottom: `1px solid ${C.forestBorder}` }}
                      >
                        <td
                          style={{
                            padding: isMobile ? "10px 12px" : "12px 18px",
                            fontSize: 12,
                            fontWeight: 600,
                            color: C.textPrimary,
                          }}
                        >
                          {p.product}
                        </td>
                        <td
                          style={{
                            padding: isMobile ? "10px 12px" : "12px 18px",
                            fontSize: 12,
                            color: C.greenGlow,
                          }}
                        >
                          ₦{p.min.toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: isMobile ? "10px 12px" : "12px 18px",
                            fontSize: 12,
                            color: C.goldLight,
                          }}
                        >
                          ₦{p.max.toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: isMobile ? "10px 12px" : "12px 18px",
                            fontSize: 11,
                            color: C.textMuted,
                          }}
                        >
                          {p.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
    </div>
  );
}

// ── Guides ────────────────────────────
function Guides({ guides, loading, isMobile }) {
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState("");
  const categories = [...new Set(guides.map((g) => g.category))];
  const filtered = category
    ? guides.filter((g) => g.category === category)
    : guides;

  if (selected) {
    return (
      <div>
        <button
          onClick={() => setSelected(null)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            border: `1px solid ${C.forestBorder}`,
            background: C.forestSurface2,
            color: C.textSecondary,
            cursor: "pointer",
            fontFamily: "Inter,sans-serif",
            marginBottom: 16,
          }}
        >
          ← Back
        </button>
        <div
          style={{
            background: C.forestSurface,
            border: `1px solid ${C.forestBorder}`,
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: isMobile ? "18px" : "24px 28px",
              borderBottom: `1px solid ${C.forestBorder}`,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 10,
                flexWrap: "wrap",
              }}
            >
              <Badge color="green">{selected.category}</Badge>
              <Badge color="muted">⏱ {selected.readTime}</Badge>
            </div>
            <h2
              style={{
                fontFamily: "Playfair Display,Georgia,serif",
                fontSize: isMobile ? 20 : 24,
                fontWeight: 700,
                color: C.textPrimary,
                marginBottom: 8,
              }}
            >
              {selected.title}
            </h2>
            <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>
              {selected.summary}
            </p>
          </div>
          <div style={{ padding: isMobile ? "18px" : "28px" }}>
            {selected.content?.map((section, i) => (
              <div key={i} style={{ marginBottom: 24 }}>
                <h3
                  style={{
                    fontSize: isMobile ? 14 : 17,
                    fontWeight: 700,
                    color: C.textPrimary,
                    marginBottom: 8,
                  }}
                >
                  {section.heading}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: C.textSecondary,
                    lineHeight: 1.8,
                  }}
                >
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}
      >
        <button
          onClick={() => setCategory("")}
          style={{
            padding: "7px 14px",
            borderRadius: 7,
            fontSize: 11,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter,sans-serif",
            background: !category ? C.greenFaint : C.forestSurface2,
            color: !category ? C.greenGlow : C.textMuted,
            boxShadow: !category ? `inset 0 0 0 1px ${C.green}` : "none",
          }}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            style={{
              padding: "7px 14px",
              borderRadius: 7,
              fontSize: 11,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontFamily: "Inter,sans-serif",
              background: category === c ? C.greenFaint : C.forestSurface2,
              color: category === c ? C.greenGlow : C.textMuted,
              boxShadow: category === c ? `inset 0 0 0 1px ${C.green}` : "none",
            }}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)",
            gap: 14,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} h={140} />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)",
            gap: isMobile ? 12 : 16,
          }}
        >
          {filtered.map((guide, i) => (
            <div
              key={i}
              onClick={async () => {
                try {
                  const res = await api.get(`/knowledge/guides/${guide.id}`);
                  setSelected(res.data.guide);
                } catch {
                  toast.error("Failed");
                }
              }}
              style={{
                background: C.forestSurface,
                border: `1px solid ${C.forestBorder}`,
                borderRadius: 12,
                padding: isMobile ? "16px" : "20px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.green;
                e.currentTarget.style.background = C.greenFaint;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.forestBorder;
                e.currentTarget.style.background = C.forestSurface;
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginBottom: 8,
                  flexWrap: "wrap",
                }}
              >
                <Badge color="green">{guide.category}</Badge>
                <Badge color="muted">⏱ {guide.readTime}</Badge>
              </div>
              <div
                style={{
                  fontSize: isMobile ? 13 : 15,
                  fontWeight: 700,
                  color: C.textPrimary,
                  marginBottom: 4,
                }}
              >
                {guide.title}
              </div>
              <div
                style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}
              >
                {guide.summary}
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.greenGlow,
                }}
              >
                Read guide →
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Diseases ──────────────────────────
function Diseases({ diseases, loading, isMobile }) {
  const [search, setSearch] = useState("");
  const [urgency, setUrgency] = useState("");
  const [selected, setSelected] = useState(null);
  const filtered = diseases.filter((d) => {
    const ms =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.symptoms?.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const mu = !urgency || d.urgency === urgency;
    return ms && mu;
  });
  const uc = { CRITICAL: "red", HIGH: "amber", MEDIUM: "gold" };

  if (selected) {
    return (
      <div>
        <button
          onClick={() => setSelected(null)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            border: `1px solid ${C.forestBorder}`,
            background: C.forestSurface2,
            color: C.textSecondary,
            cursor: "pointer",
            fontFamily: "Inter,sans-serif",
            marginBottom: 16,
          }}
        >
          ← Back
        </button>
        <div
          style={{
            background: C.forestSurface,
            border: `1px solid ${C.forestBorder}`,
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: isMobile ? "18px" : "24px 28px",
              borderBottom: `1px solid ${C.forestBorder}`,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 10,
                flexWrap: "wrap",
              }}
            >
              <Badge color={uc[selected.urgency] || "muted"}>
                {selected.urgency}
              </Badge>
              <Badge color="muted">{selected.affectedAge}</Badge>
              {selected.callVet && <Badge color="red">⚕ Call Vet</Badge>}
            </div>
            <h2
              style={{
                fontFamily: "Playfair Display,Georgia,serif",
                fontSize: isMobile ? 20 : 24,
                fontWeight: 700,
                color: C.textPrimary,
              }}
            >
              {selected.name}
            </h2>
          </div>
          <div
            style={{
              padding: isMobile ? "18px" : "28px",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? 20 : 24,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                Symptoms
              </div>
              {selected.symptoms?.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 8,
                    fontSize: 12,
                    color: C.textSecondary,
                    marginBottom: 5,
                  }}
                >
                  <span style={{ color: "#E88080", flexShrink: 0 }}>●</span>
                  {s}
                </div>
              ))}
            </div>
            <div>
              {[
                { l: "Cause", v: selected.cause, c: C.textMuted },
                { l: "Treatment", v: selected.treatment, c: C.amberLight },
                { l: "Prevention", v: selected.prevention, c: C.greenGlow },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: item.c,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      marginBottom: 5,
                    }}
                  >
                    {item.l}
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: C.textSecondary,
                      lineHeight: 1.6,
                    }}
                  >
                    {item.v}
                  </p>
                </div>
              ))}
              {selected.tip && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: C.goldFaint,
                    border: `1px solid ${C.gold}`,
                    borderRadius: 8,
                    fontSize: 12,
                    color: C.goldLight,
                    lineHeight: 1.6,
                  }}
                >
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
      <div
        style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}
      >
        <input
          placeholder="Search diseases or symptoms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: isMobile ? "100%" : 200,
            background: C.forestSurface,
            border: `1px solid ${C.forestBorder}`,
            borderRadius: 8,
            padding: "9px 14px",
            fontSize: 12,
            color: C.textPrimary,
            fontFamily: "Inter,sans-serif",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = C.green)}
          onBlur={(e) => (e.target.style.borderColor = C.forestBorder)}
        />
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {["", "CRITICAL", "HIGH", "MEDIUM"].map((u) => (
            <button
              key={u}
              onClick={() => setUrgency(u)}
              style={{
                padding: "7px 12px",
                borderRadius: 7,
                fontSize: 11,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                fontFamily: "Inter,sans-serif",
                background: urgency === u ? C.greenFaint : C.forestSurface2,
                color: urgency === u ? C.greenGlow : C.textMuted,
                boxShadow:
                  urgency === u ? `inset 0 0 0 1px ${C.green}` : "none",
              }}
            >
              {u || "All"}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        [1, 2, 3].map((i) => <Skeleton key={i} h={90} />)
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((d, i) => (
            <div
              key={i}
              onClick={async () => {
                try {
                  const name = d.name
                    .toLowerCase()
                    .replace(/['']/g, "")
                    .replace(/\s+/g, "-");
                  const res = await api.get(`/knowledge/diseases/${name}`);
                  setSelected(res.data.disease);
                } catch {
                  toast.error("Failed");
                }
              }}
              style={{
                background: C.forestSurface,
                border: `1px solid ${C.forestBorder}`,
                borderRadius: 12,
                padding: isMobile ? "14px" : "16px 20px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = C.green)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = C.forestBorder)
              }
            >
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginBottom: 6,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: C.textPrimary,
                  }}
                >
                  {d.name}
                </span>
                <Badge color={uc[d.urgency] || "muted"}>{d.urgency}</Badge>
                {d.callVet && <Badge color="red">⚕ Vet</Badge>}
              </div>
              <div
                style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}
              >
                Age: {d.affectedAge}
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {d.symptoms?.slice(0, isMobile ? 2 : 3).map((s, si) => (
                  <span
                    key={si}
                    style={{
                      fontSize: 10,
                      padding: "2px 8px",
                      borderRadius: 100,
                      background: C.forestSurface2,
                      color: C.textSecondary,
                      border: `1px solid ${C.forestBorder}`,
                    }}
                  >
                    {s}
                  </span>
                ))}
                {d.symptoms?.length > (isMobile ? 2 : 3) && (
                  <span style={{ fontSize: 10, color: C.textMuted }}>
                    +{d.symptoms.length - (isMobile ? 2 : 3)}
                  </span>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div
              style={{
                padding: 32,
                textAlign: "center",
                fontSize: 12,
                color: C.textMuted,
              }}
            >
              No matches.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Videos ────────────────────────────
function Videos({ videos, loading, isMobile }) {
  const [tag, setTag] = useState("");
  const allTags = [...new Set(videos.flatMap((v) => v.tags || []))];
  const filtered = tag ? videos.filter((v) => v.tags?.includes(tag)) : videos;
  return (
    <div>
      <div
        style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}
      >
        <button
          onClick={() => setTag("")}
          style={{
            padding: "7px 12px",
            borderRadius: 7,
            fontSize: 11,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter,sans-serif",
            background: !tag ? C.greenFaint : C.forestSurface2,
            color: !tag ? C.greenGlow : C.textMuted,
            boxShadow: !tag ? `inset 0 0 0 1px ${C.green}` : "none",
          }}
        >
          All
        </button>
        {allTags.map((t) => (
          <button
            key={t}
            onClick={() => setTag(t)}
            style={{
              padding: "7px 12px",
              borderRadius: 7,
              fontSize: 11,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontFamily: "Inter,sans-serif",
              background: tag === t ? C.greenFaint : C.forestSurface2,
              color: tag === t ? C.greenGlow : C.textMuted,
              boxShadow: tag === t ? `inset 0 0 0 1px ${C.green}` : "none",
            }}
          >
            {t}
          </button>
        ))}
      </div>
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)",
            gap: 14,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} h={120} />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)",
            gap: isMobile ? 10 : 14,
          }}
        >
          {filtered.map((v, i) => (
            <a
              key={i}
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: C.forestSurface,
                border: `1px solid ${C.forestBorder}`,
                borderRadius: 12,
                padding: isMobile ? "14px" : "18px 20px",
                textDecoration: "none",
                transition: "all 0.2s",
                display: "block",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = C.green)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = C.forestBorder)
              }
            >
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "#7F1D1D",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  ▶
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.textPrimary,
                      marginBottom: 3,
                    }}
                  >
                    {v.title}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.textMuted,
                      marginBottom: 4,
                    }}
                  >
                    {v.channel} · {v.duration}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.textSecondary,
                      lineHeight: 1.5,
                    }}
                  >
                    {v.description}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      marginTop: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    {v.tags?.map((t, ti) => (
                      <span
                        key={ti}
                        style={{
                          fontSize: 9,
                          padding: "2px 7px",
                          borderRadius: 100,
                          background: C.forestSurface2,
                          color: C.textMuted,
                          border: `1px solid ${C.forestBorder}`,
                        }}
                      >
                        {t}
                      </span>
                    ))}
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

// ── Symptom Checker ───────────────────
function SymptomChecker({ isMobile }) {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const SYMPTOMS = [
    "sudden deaths",
    "twisted neck",
    "paralysis of legs",
    "greenish watery diarrhoea",
    "swollen head",
    "gasping and coughing",
    "loss of appetite",
    "watery diarrhoea",
    "ruffled feathers",
    "lethargy",
    "bloody diarrhoea",
    "pale comb",
    "weight loss",
    "sneezing and coughing",
    "nasal discharge",
    "watery eyes",
    "drop in egg production",
    "wart-like scabs",
    "difficulty eating",
    "swollen abdomen",
    "reduced growth",
  ];
  const toggle = (s) =>
    setSelected((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  const check = async () => {
    if (!selected.length) {
      toast.error("Select symptoms");
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(
        `/batches/placeholder/health/symptoms?symptoms=${selected.join(",")}&livestockType=chicken`,
      );
      setResult(res.data);
    } catch {
      try {
        const res = await api.get(`/knowledge/diseases?search=${selected[0]}`);
        setResult({
          results: res.data.diseases?.slice(0, 3) || [],
          advice: "Based on symptoms, these diseases may match. Consult a vet.",
        });
      } catch {
        toast.error("Failed");
      }
    } finally {
      setLoading(false);
    }
  };
  const uc = { CRITICAL: "red", HIGH: "amber", MEDIUM: "gold" };

  return (
    <div>
      <div
        style={{
          background: C.forestSurface,
          border: `1px solid ${C.forestBorder}`,
          borderRadius: 14,
          padding: isMobile ? "18px" : "24px",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: C.textPrimary,
            marginBottom: 4,
          }}
        >
          🔍 Symptom Checker
        </div>
        <div
          style={{
            fontSize: 12,
            color: C.textMuted,
            marginBottom: 16,
            lineHeight: 1.6,
          }}
        >
          Select symptoms to get likely disease matches.
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 16,
          }}
        >
          {SYMPTOMS.map((s) => (
            <button
              key={s}
              onClick={() => toggle(s)}
              style={{
                padding: "6px 12px",
                borderRadius: 100,
                fontSize: 11,
                fontWeight: 500,
                border: `1px solid ${selected.includes(s) ? C.green : C.forestBorder}`,
                background: selected.includes(s)
                  ? C.greenFaint
                  : C.forestSurface2,
                color: selected.includes(s) ? C.greenGlow : C.textMuted,
                cursor: "pointer",
                fontFamily: "Inter,sans-serif",
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={check}
            disabled={loading}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              background: loading
                ? "#5A6B5E"
                : `linear-gradient(135deg,${C.green},${C.greenLight})`,
              color: "#fff",
              fontFamily: "Inter,sans-serif",
            }}
          >
            {loading ? "Checking..." : "Check Symptoms"}
          </button>
          {selected.length > 0 && (
            <button
              onClick={() => {
                setSelected([]);
                setResult(null);
              }}
              style={{
                padding: "10px 14px",
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
              Clear ({selected.length})
            </button>
          )}
        </div>
      </div>
      {result && (
        <div>
          {result.topMatch && (
            <div
              style={{
                background: C.redFaint,
                border: "1px solid #7B1F1F",
                borderRadius: 12,
                padding: isMobile ? "14px" : "18px 20px",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#E88080",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 6,
                }}
              >
                🚨 Most Likely
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: C.textPrimary,
                  marginBottom: 4,
                }}
              >
                {result.topMatch.name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: C.textSecondary,
                  marginBottom: 10,
                }}
              >
                Matched {result.topMatch.matchCount} of {selected.length}{" "}
                symptoms
              </div>
              <div style={{ fontSize: 12, color: "#F0A0A0", lineHeight: 1.6 }}>
                {result.advice}
              </div>
            </div>
          )}
          {result.results?.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {result.results.map((d, i) => (
                <div
                  key={i}
                  style={{
                    background: C.forestSurface,
                    border: `1px solid ${C.forestBorder}`,
                    borderRadius: 10,
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  <div
                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.textPrimary,
                      }}
                    >
                      {d.name}
                    </span>
                    <Badge color={uc[d.urgency] || "muted"}>{d.urgency}</Badge>
                  </div>
                  {d.matchCount && (
                    <span style={{ fontSize: 10, color: C.textMuted }}>
                      {d.matchCount} matches
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════
// MAIN
// ══════════════════════════════════════
export default function KnowledgePage() {
  const isMobile = useIsMobile();
  const [hub, setHub] = useState(null);
  const [guides, setGuides] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [prices, setPrices] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("guides");

  useEffect(() => {
    fetchAll();
  }, []);
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [a, b, c, d, e] = await Promise.all([
        api.get("/knowledge"),
        api.get("/knowledge/guides"),
        api.get("/knowledge/diseases"),
        api.get("/knowledge/market-prices"),
        api.get("/knowledge/videos"),
      ]);
      setHub(a.data.hub);
      setGuides(b.data.guides || []);
      setDiseases(c.data.diseases || []);
      setPrices(d.data.prices || []);
      setVideos(e.data.videos || []);
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    { key: "guides", label: "📚 Guides", count: hub?.guides?.total },
    { key: "diseases", label: "🦠 Diseases", count: hub?.diseases?.total },
    { key: "prices", label: "💰 Prices", count: null },
    { key: "videos", label: "▶ Videos", count: hub?.videos?.total },
    { key: "symptoms", label: "🔍 Checker", count: null },
  ];
  const pad = isMobile ? "16px 14px" : "28px 32px";

  return (
    <div style={{ padding: pad, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: isMobile ? 16 : 28 }}>
        <h1
          style={{
            fontFamily: "Playfair Display,Georgia,serif",
            fontSize: isMobile ? 22 : 28,
            fontWeight: 700,
            color: C.textPrimary,
            marginBottom: 4,
          }}
        >
          Knowledge Hub
        </h1>
        <p style={{ fontSize: 12, color: C.textMuted }}>
          Guides, diseases, prices & tutorials
        </p>
      </div>

      {hub && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(1,1fr)" : "repeat(4,1fr)",
            gap: isMobile ? 10 : 14,
            marginBottom: isMobile ? 14 : 24,
          }}
        >
          {[
            {
              icon: "📚",
              label: "Guides",
              value: hub.guides?.total,
              sub: `${hub.guides?.categories?.length} categories`,
            },
            {
              icon: "🦠",
              label: "Diseases",
              value: hub.diseases?.total,
              sub: `${hub.diseases?.critical} critical`,
            },
            {
              icon: "💰",
              label: "Regions",
              value: hub.marketPrices?.availableRegions?.length,
              sub: "Nigerian cities",
            },
            {
              icon: "▶",
              label: "Videos",
              value: hub.videos?.total,
              sub: `${hub.videos?.allTags?.length} topics`,
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: C.forestSurface,
                border: `1px solid ${C.forestBorder}`,
                borderRadius: 12,
                padding: isMobile ? "14px" : "16px 18px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: isMobile ? 20 : 24, marginBottom: 6 }}>
                {s.icon}
              </div>
              <div
                style={{
                  fontSize: isMobile ? 20 : 24,
                  fontWeight: 800,
                  color: C.greenGlow,
                  marginBottom: 2,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.textPrimary,
                  marginBottom: 1,
                }}
              >
                {s.label}
              </div>
              <div style={{ fontSize: 10, color: C.textMuted }}>{s.sub}</div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 2,
          background: C.forestSurface,
          border: `1px solid ${C.forestBorder}`,
          borderRadius: 10,
          padding: 3,
          marginBottom: isMobile ? 14 : 24,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: isMobile ? "8px 12px" : "9px 16px",
              borderRadius: 8,
              fontSize: isMobile ? 11 : 12,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontFamily: "Inter,sans-serif",
              background: tab === t.key ? C.greenFaint : "transparent",
              color: tab === t.key ? C.greenGlow : C.textMuted,
              boxShadow: tab === t.key ? `inset 0 0 0 1px ${C.green}` : "none",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {t.label}
            {t.count != null && (
              <span
                style={{
                  background: tab === t.key ? C.green : C.forestSurface2,
                  color: tab === t.key ? "#fff" : C.textMuted,
                  borderRadius: 100,
                  padding: "1px 6px",
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "guides" && (
        <Guides guides={guides} loading={loading} isMobile={isMobile} />
      )}
      {tab === "diseases" && (
        <Diseases diseases={diseases} loading={loading} isMobile={isMobile} />
      )}
      {tab === "prices" && (
        <MarketPrices prices={prices} loading={loading} isMobile={isMobile} />
      )}
      {tab === "videos" && (
        <Videos videos={videos} loading={loading} isMobile={isMobile} />
      )}
      {tab === "symptoms" && <SymptomChecker isMobile={isMobile} />}

      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}
