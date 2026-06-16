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
  green: "#2D7A3A",
  greenLight: "#3D9E4D",
  greenGlow: "#6FCF7F",
  greenFaint: "#1A3D22",
  red: "#C0392B",
  redFaint: "rgba(192,57,43,0.15)",
  amber: "#D4860A",
  amberLight: "#F0A030",
  amberFaint: "rgba(212,134,10,0.15)",
  blue: "#2471A3",
  blueLight: "#5DADE2",
  textPrimary: "#F0EBE0",
  textSecondary: "#A89880",
  textMuted: "#5A6B5E",
};

function Badge({ children, color = "green" }) {
  const s = {
    green: { bg: C.greenFaint, text: C.greenGlow, border: C.green },
    red: { bg: C.redFaint, text: "#E88080", border: "#7B1F1F" },
    amber: { bg: C.amberFaint, text: C.amberLight, border: "#7A4A10" },
    muted: {
      bg: C.forestSurface2,
      text: C.textSecondary,
      border: C.forestBorder,
    },
    blue: { bg: "rgba(36,113,163,0.15)", text: C.blueLight, border: "#1A4A6A" },
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

function SymptomChecker({ isMobile }) {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState("");
  useEffect(() => {
    api
      .get("/batches?status=active")
      .then((r) => setBatches(r.data.batches || []))
      .catch(() => {});
  }, []);
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
    if (!batchId) {
      toast.error("Select batch");
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(
        `/batches/${batchId}/health/symptoms?symptoms=${selected.join(",")}&livestockType=chicken`,
      );
      setResult(res.data);
    } catch {
      toast.error("Check failed");
    } finally {
      setLoading(false);
    }
  };
  const uc = { CRITICAL: "red", HIGH: "amber", MEDIUM: "blue" };

  return (
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
          padding: "14px 18px",
          borderBottom: `1px solid ${C.forestBorder}`,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>
          🔍 Symptom Checker
        </div>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
          Select symptoms for diagnosis
        </div>
      </div>
      <div style={{ padding: isMobile ? "16px" : "20px 22px" }}>
        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: C.textSecondary,
              marginBottom: 6,
            }}
          >
            Which batch?
          </label>
          <select
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            style={{
              width: "100%",
              background: C.forestSurface2,
              border: `1px solid ${C.forestBorder}`,
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: 13,
              color: C.textPrimary,
              fontFamily: "Inter,sans-serif",
              outline: "none",
              cursor: "pointer",
              boxSizing: "border-box",
            }}
          >
            <option value="">Select a batch...</option>
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name} ({b.breed})
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: C.textSecondary,
              marginBottom: 8,
            }}
          >
            Symptoms ({selected.length} selected)
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
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
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: result ? 16 : 0 }}>
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
                fontSize: 12,
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
        {result && (
          <div>
            {result.topMatch && (
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: 10,
                  marginBottom: 10,
                  background: C.redFaint,
                  border: "1px solid #7B1F1F",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
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
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginBottom: 4,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: C.textPrimary,
                    }}
                  >
                    {result.topMatch.name}
                  </span>
                  <Badge color="red">{result.topMatch.urgency}</Badge>
                  {result.topMatch.callVet && (
                    <Badge color="red">⚕ Call Vet</Badge>
                  )}
                </div>
                <div
                  style={{ fontSize: 12, color: "#F0A0A0", lineHeight: 1.6 }}
                >
                  {result.advice}
                </div>
              </div>
            )}
            {result.results?.slice(1).map((d, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 14px",
                  borderRadius: 9,
                  background: C.forestSurface2,
                  border: `1px solid ${C.forestBorder}`,
                  marginBottom: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
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
                <span style={{ fontSize: 11, color: C.textMuted }}>
                  {d.matchCount} matches
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HealthPage() {
  const isMobile = useIsMobile();
  const [batches, setBatches] = useState([]);
  const [overviews, setOverviews] = useState({});
  const [vaccines, setVaccines] = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    fetchAll();
  }, []);
  const fetchAll = async () => {
    setLoading(true);
    try {
      const bRes = await api.get("/batches?status=active");
      const active = bRes.data.batches || [];
      setBatches(active);
      const [ovR, vacR] = await Promise.all([
        Promise.allSettled(
          active.map((b) => api.get(`/batches/${b._id}/health/overview`)),
        ),
        Promise.allSettled(
          active.map((b) => api.get(`/batches/${b._id}/health/vaccinations`)),
        ),
      ]);
      const om = {},
        vm = {};
      ovR.forEach((r, i) => {
        if (r.status === "fulfilled") om[active[i]._id] = r.value.data.overview;
      });
      vacR.forEach((r, i) => {
        if (r.status === "fulfilled")
          vm[active[i]._id] = r.value.data.vaccinations || [];
      });
      setOverviews(om);
      setVaccines(vm);
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const markDone = async (bid, vid) => {
    try {
      await api.put(`/batches/${bid}/health/vaccinations/${vid}/done`);
      toast.success("Done ✓");
      fetchAll();
    } catch {
      toast.error("Failed");
    }
  };

  const allAlerts = batches.flatMap((b) =>
    (overviews[b._id]?.alerts || []).map((a) => ({
      ...a,
      batchName: b.name,
      batchId: b._id,
    })),
  );
  const allVaccines = batches
    .flatMap((b) =>
      (vaccines[b._id] || [])
        .filter((v) => !v.isDone)
        .map((v) => ({ ...v, batchName: b.name, batchId: b._id })),
    )
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  const overdueCount = allVaccines.filter(
    (v) => new Date(v.scheduledDate) < new Date(),
  ).length;
  const dueSoonCount = allVaccines.filter((v) => {
    const d = Math.ceil((new Date(v.scheduledDate) - new Date()) / 86400000);
    return d >= 0 && d <= 3;
  }).length;
  const criticalBatches = batches.filter(
    (b) => overviews[b._id]?.overallStatus === "critical",
  ).length;

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
            💉 Health Manager
          </h1>
          <p style={{ fontSize: 12, color: C.textMuted }}>
            Vaccinations, alerts & symptom checker
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

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)",
          gap: isMobile ? 10 : 14,
          marginBottom: isMobile ? 14 : 24,
        }}
      >
        {loading
          ? [1, 2, 3, 4].map((i) => <Skeleton key={i} h={90} />)
          : [
              {
                icon: "⚠️",
                label: "Critical",
                value: criticalBatches,
                bar:
                  criticalBatches > 0
                    ? `linear-gradient(90deg,${C.red},#E74C3C)`
                    : `linear-gradient(90deg,${C.green},${C.greenLight})`,
                vc: criticalBatches > 0 ? "#E88080" : C.greenGlow,
              },
              {
                icon: "💉",
                label: "Overdue",
                value: overdueCount,
                bar:
                  overdueCount > 0
                    ? `linear-gradient(90deg,${C.red},#E74C3C)`
                    : `linear-gradient(90deg,${C.green},${C.greenLight})`,
                vc: overdueCount > 0 ? "#E88080" : C.greenGlow,
              },
              {
                icon: "⏰",
                label: "Due This Week",
                value: dueSoonCount,
                bar:
                  dueSoonCount > 0
                    ? `linear-gradient(90deg,${C.amber},${C.amberLight})`
                    : `linear-gradient(90deg,${C.green},${C.greenLight})`,
                vc: dueSoonCount > 0 ? C.amberLight : C.greenGlow,
              },
              {
                icon: "🐔",
                label: "Active Batches",
                value: batches.length,
                bar: `linear-gradient(90deg,${C.blue},#5DADE2)`,
                vc: C.blueLight,
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: C.forestSurface,
                  border: `1px solid ${C.forestBorder}`,
                  borderRadius: 14,
                  padding: "16px 18px",
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
                    marginBottom: 4,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 24 : 30,
                    fontWeight: 800,
                    color: s.vc,
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
      </div>

      {/* Alerts */}
      {allAlerts.length > 0 && (
        <div style={{ marginBottom: isMobile ? 14 : 24 }}>
          {allAlerts.map((a, i) => {
            const isRed = a.type === "HIGH_MORTALITY";
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 10,
                  marginBottom: 6,
                  background: isRed ? C.redFaint : C.amberFaint,
                  border: `1px solid ${isRed ? "#7B1F1F" : "#7A4A10"}`,
                  fontSize: 12,
                  color: isRed ? "#F0A0A0" : C.amberLight,
                }}
              >
                <span style={{ fontSize: 14, flexShrink: 0 }}>
                  {isRed ? "🚨" : "💉"}
                </span>
                <span style={{ flex: 1 }}>
                  <strong>{a.batchName}:</strong> {a.message}
                </span>
                <Link
                  href={`/dashboard/batches/${a.batchId}`}
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "inherit",
                    textDecoration: "underline",
                    flexShrink: 0,
                  }}
                >
                  View
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabs */}
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
        {[
          { k: "overview", l: "Overview" },
          { k: "vaccines", l: "Vaccinations" },
          { k: "symptoms", l: "🔍 Symptoms" },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            style={{
              padding: isMobile ? "8px 14px" : "9px 18px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontFamily: "Inter,sans-serif",
              background: tab === t.k ? C.greenFaint : "transparent",
              color: tab === t.k ? C.greenGlow : C.textMuted,
              boxShadow: tab === t.k ? `inset 0 0 0 1px ${C.green}` : "none",
              whiteSpace: "nowrap",
            }}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" &&
        (loading ? (
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
        ) : batches.length ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)",
              gap: isMobile ? 12 : 16,
            }}
          >
            {batches.map((batch) => {
              const ov = overviews[batch._id];
              const sc =
                ov?.overallStatus === "critical"
                  ? "red"
                  : ov?.overallStatus === "warning"
                    ? "amber"
                    : "green";
              const vacs = vaccines[batch._id] || [];
              const done = vacs.filter((v) => v.isDone).length;
              return (
                <div
                  key={batch._id}
                  style={{
                    background: C.forestSurface,
                    border: `1px solid ${C.forestBorder}`,
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 16px",
                      background: C.forestSurface2,
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
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: C.textPrimary,
                        }}
                      >
                        {batch.name}
                      </div>
                      <div style={{ fontSize: 10, color: C.textMuted }}>
                        {batch.breed?.charAt(0).toUpperCase() +
                          batch.breed?.slice(1)}{" "}
                        · Day {batch.daysAlive}
                      </div>
                    </Link>
                    <Badge color={sc}>
                      {ov?.overallStatus?.charAt(0).toUpperCase() +
                        (ov?.overallStatus?.slice(1) || "")}
                    </Badge>
                  </div>
                  <div style={{ padding: "12px 16px" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3,1fr)",
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      {[
                        {
                          l: "Mortality",
                          v: `${ov?.mortalityRate || 0}%`,
                          c:
                            (ov?.mortalityRate || 0) > 3
                              ? "#E88080"
                              : C.greenGlow,
                        },
                        {
                          l: "Vaccines",
                          v: `${done}/${vacs.length}`,
                          c: C.textPrimary,
                        },
                        {
                          l: "Meds",
                          v: ov?.totalMedications || 0,
                          c: C.textPrimary,
                        },
                      ].map((s, i) => (
                        <div
                          key={i}
                          style={{
                            background: C.forestSurface2,
                            borderRadius: 8,
                            padding: "7px 8px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 9,
                              color: C.textMuted,
                              textTransform: "uppercase",
                              letterSpacing: 1,
                              marginBottom: 2,
                            }}
                          >
                            {s.l}
                          </div>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: s.c,
                            }}
                          >
                            {s.v}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={`/dashboard/batches/${batch._id}`}
                      style={{
                        display: "block",
                        textAlign: "center",
                        padding: "7px 0",
                        borderRadius: 7,
                        fontSize: 11,
                        fontWeight: 600,
                        color: C.greenGlow,
                        textDecoration: "none",
                        border: `1px solid ${C.forestBorder}`,
                        background: C.forestSurface2,
                      }}
                    >
                      View Health →
                    </Link>
                  </div>
                </div>
              );
            })}
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
            <div style={{ fontSize: 44, marginBottom: 10 }}>💉</div>
            <div
              style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}
            >
              No active batches
            </div>
          </div>
        ))}

      {/* Vaccines Tab */}
      {tab === "vaccines" && (
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
              padding: "12px 18px",
              borderBottom: `1px solid ${C.forestBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div
              style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}
            >
              {allVaccines.length} pending
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {overdueCount > 0 && (
                <Badge color="red">{overdueCount} overdue</Badge>
              )}
              {dueSoonCount > 0 && (
                <Badge color="amber">{dueSoonCount} due soon</Badge>
              )}
            </div>
          </div>
          {loading ? (
            <div style={{ padding: "16px 18px" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <Skeleton h={56} />
                </div>
              ))}
            </div>
          ) : allVaccines.length ? (
            <div style={{ padding: "6px 18px" }}>
              {allVaccines.map((v, i) => {
                const isOD = new Date(v.scheduledDate) < new Date();
                const days = Math.ceil(
                  (new Date(v.scheduledDate) - new Date()) / 86400000,
                );
                const bc = isOD ? "red" : days <= 1 ? "amber" : "muted";
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: isMobile ? 8 : 14,
                      padding: "10px 0",
                      borderBottom:
                        i < allVaccines.length - 1
                          ? `1px solid ${C.forestBorder}`
                          : "none",
                      flexWrap: isMobile ? "wrap" : "nowrap",
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        flexShrink: 0,
                        background: isOD ? C.redFaint : C.amberFaint,
                        border: `1px solid ${isOD ? "#7B1F1F" : "#7A4A10"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                      }}
                    >
                      💉
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: C.textPrimary,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {v.vaccineName}
                      </div>
                      <div style={{ fontSize: 10, color: C.textMuted }}>
                        {v.batchName} ·{" "}
                        {new Date(v.scheduledDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Badge color={bc}>
                        {isOD
                          ? "Overdue"
                          : days === 0
                            ? "Today"
                            : days === 1
                              ? "Tmrw"
                              : `${days}d`}
                      </Badge>
                      <button
                        onClick={() => markDone(v.batchId, v._id)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 7,
                          fontSize: 10,
                          fontWeight: 600,
                          border: `1px solid ${C.green}`,
                          background: C.greenFaint,
                          color: C.greenGlow,
                          cursor: "pointer",
                          fontFamily: "Inter,sans-serif",
                        }}
                      >
                        ✓ Done
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                padding: "36px 20px",
                textAlign: "center",
                color: C.textMuted,
                fontSize: 13,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 6 }}>✅</div>No pending
              vaccinations.
            </div>
          )}
        </div>
      )}

      {/* Symptoms Tab */}
      {tab === "symptoms" && <SymptomChecker isMobile={isMobile} />}

      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}
