"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from '../../../../../lib/api';

import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const C = {
  forestBg: "#0F1F14",
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
  red: "#C0392B",
  redFaint: "rgba(192,57,43,0.15)",
  amber: "#D4860A",
  amberFaint: "rgba(212,134,10,0.15)",
  amberLight: "#F0A030",
  blue: "#2471A3",
  blueLight: "#5DADE2",
  blueFaint: "rgba(36,113,163,0.15)",
  textPrimary: "#F0EBE0",
  textSecondary: "#A89880",
  textMuted: "#5A6B5E",
};

const fmt = (n) => (n != null ? `₦${Number(n).toLocaleString()}` : "₦0");
const fmtNum = (n) => (n != null ? Number(n).toLocaleString() : "0");

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
    blue: { bg: C.blueFaint, text: C.blueLight, border: "#1A4A6A" },
    gold: { bg: "rgba(201,168,76,0.15)", text: C.goldLight, border: C.gold },
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

const TABS = ["Overview", "Feed", "Health", "Production", "Finance"];

// ── Overview Tab ──────────────────────────────
function OverviewTab({ batch, updates, onLogUpdate }) {
  const [form, setForm] = useState({
    aliveCount: "",
    deaths: "",
    feedConsumedKg: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.aliveCount) {
      toast.error("Alive count is required");
      return;
    }
    setSaving(true);
    try {
      await api.post(`/batches/${batch._id}/updates`, {
        aliveCount: parseInt(form.aliveCount),
        deaths: parseInt(form.deaths || 0),
        feedConsumedKg: parseFloat(form.feedConsumedKg || 0),
        notes: form.notes,
      });
      toast.success("Daily update logged");
      setForm({ aliveCount: "", deaths: "", feedConsumedKg: "", notes: "" });
      setShowForm(false);
      onLogUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to log update");
    } finally {
      setSaving(false);
    }
  };

  const inputS = {
    width: "100%",
    background: C.forestSurface2,
    border: `1px solid ${C.forestBorder}`,
    borderRadius: 7,
    padding: "9px 12px",
    fontSize: 13,
    color: C.textPrimary,
    fontFamily: "Inter, sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  const mortality = parseFloat(batch.mortalityRate || 0);
  const progress = batch.cycleWeeks
    ? Math.min((batch.currentWeek / batch.cycleWeeks) * 100, 100)
    : 0;

  return (
    <div>
      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          {
            label: "Days Alive",
            value: `Day ${batch.daysAlive}`,
            color: C.textPrimary,
          },
          {
            label: "Current Week",
            value: `Week ${batch.currentWeek}`,
            color: C.textPrimary,
          },
          {
            label: "Birds Alive",
            value: fmtNum(batch.currentAlive),
            color: C.greenGlow,
          },
          {
            label: "Mortality",
            value: `${mortality}%`,
            color: mortality > 3 ? "#E88080" : C.greenGlow,
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: C.forestSurface,
              border: `1px solid ${C.forestBorder}`,
              borderRadius: 12,
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: 1.2,
                marginBottom: 6,
              }}
            >
              {s.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Cycle Progress */}
      <div
        style={{
          background: C.forestSurface,
          border: `1px solid ${C.forestBorder}`,
          borderRadius: 12,
          padding: "18px 20px",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
            fontSize: 13,
          }}
        >
          <span style={{ color: C.textSecondary, fontWeight: 600 }}>
            Cycle Progress
          </span>
          <span style={{ color: C.textMuted }}>
            Week {batch.currentWeek} of {batch.cycleWeeks || "?"} ·{" "}
            {progress.toFixed(0)}%
          </span>
        </div>
        <div
          style={{
            height: 8,
            background: C.forestSurface2,
            borderRadius: 100,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 100,
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${C.green}, ${C.greenLight})`,
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
            fontSize: 11,
            color: C.textMuted,
          }}
        >
          <span>
            Started{" "}
            {new Date(batch.startDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          {batch.targetDate && (
            <span>
              Target{" "}
              {new Date(batch.targetDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </div>

      {/* Log Update Button + Form */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setShowForm((p) => !p)}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            background: showForm
              ? C.forestSurface2
              : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
            color: showForm ? C.textSecondary : "#fff",
            boxShadow: showForm ? "none" : "0 3px 10px rgba(45,122,58,0.3)",
            marginBottom: showForm ? 12 : 0,
          }}
        >
          {showForm ? "✕ Cancel" : "+ Log Daily Update"}
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              background: C.forestSurface,
              border: `1px solid ${C.forestBorder}`,
              borderRadius: 12,
              padding: "20px",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.textPrimary,
                marginBottom: 16,
              }}
            >
              Log Today's Update
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                marginBottom: 12,
              }}
            >
              {[
                {
                  label: "Birds Alive *",
                  key: "aliveCount",
                  placeholder: "e.g. 195",
                  type: "number",
                },
                {
                  label: "Deaths Today",
                  key: "deaths",
                  placeholder: "e.g. 2",
                  type: "number",
                },
                {
                  label: "Feed Used (kg)",
                  key: "feedConsumedKg",
                  placeholder: "e.g. 12.5",
                  type: "number",
                },
              ].map((f) => (
                <div key={f.key}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.textMuted,
                      marginBottom: 5,
                    }}
                  >
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    style={inputS}
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                  />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.textMuted,
                  marginBottom: 5,
                }}
              >
                Notes
              </label>
              <input
                placeholder="Any observations today..."
                style={inputS}
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "10px 20px",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                cursor: saving ? "not-allowed" : "pointer",
                background: saving
                  ? "#5A6B5E"
                  : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                color: "#fff",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {saving ? "Saving..." : "Save Update"}
            </button>
          </form>
        )}
      </div>

      {/* Update History */}
      <div
        style={{
          background: C.forestSurface,
          border: `1px solid ${C.forestBorder}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderBottom: `1px solid ${C.forestBorder}`,
            fontSize: 13,
            fontWeight: 700,
            color: C.textPrimary,
          }}
        >
          Daily Updates ({updates.length})
        </div>
        {updates.length ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.forestSurface2 }}>
                {["Date", "Alive", "Deaths", "Feed (kg)", "Notes"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 16px",
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
              {updates.map((u, i) => (
                <tr
                  key={u._id || i}
                  style={{ borderBottom: `1px solid ${C.forestBorder}` }}
                >
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: 13,
                      color: C.textSecondary,
                    }}
                  >
                    {new Date(u.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.greenGlow,
                    }}
                  >
                    {fmtNum(u.aliveCount)}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: 13,
                      color: u.deaths > 0 ? "#E88080" : C.textMuted,
                    }}
                  >
                    {u.deaths || 0}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: 13,
                      color: C.textSecondary,
                    }}
                  >
                    {u.feedConsumedKg || 0}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: 12,
                      color: C.textMuted,
                    }}
                  >
                    {u.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div
            style={{
              padding: "32px",
              textAlign: "center",
              color: C.textMuted,
              fontSize: 13,
            }}
          >
            No daily updates yet. Log your first update above.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Feed Tab ──────────────────────────────────
function FeedTab({ batch }) {
  const [rec, setRec] = useState(null);
  const [history, setHistory] = useState([]);
  const [cost, setCost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    quantityKg: "",
    costPerKg: "",
    brandUsed: "",
    stockRemainingKg: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const [recRes, histRes, costRes] = await Promise.all([
        api.get(`/batches/${batch._id}/feed/recommendation`),
        api.get(`/batches/${batch._id}/feed`),
        api.get(`/batches/${batch._id}/feed/cost`),
      ]);
      setRec(recRes.data.recommendation);
      setHistory(histRes.data.feedLogs || []);
      setCost(costRes.data.summary);
    } catch {
      toast.error("Failed to load feed data");
    } finally {
      setLoading(false);
    }
  };

  const handleLog = async (e) => {
    e.preventDefault();
    if (!form.quantityKg) {
      toast.error("Quantity is required");
      return;
    }
    setSaving(true);
    try {
      await api.post(`/batches/${batch._id}/feed`, {
        quantityKg: parseFloat(form.quantityKg),
        costPerKg: parseFloat(form.costPerKg || 0),
        brandUsed: form.brandUsed,
        stockRemainingKg: parseFloat(form.stockRemainingKg || 0),
        notes: form.notes,
      });
      toast.success("Feed logged");
      setForm({
        quantityKg: "",
        costPerKg: "",
        brandUsed: "",
        stockRemainingKg: "",
        notes: "",
      });
      setShowForm(false);
      fetchFeed();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to log feed");
    } finally {
      setSaving(false);
    }
  };

  const inputS = {
    width: "100%",
    background: C.forestSurface2,
    border: `1px solid ${C.forestBorder}`,
    borderRadius: 7,
    padding: "9px 12px",
    fontSize: 13,
    color: C.textPrimary,
    fontFamily: "Inter, sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  if (loading)
    return (
      <div style={{ padding: "40px", textAlign: "center", color: C.textMuted }}>
        Loading feed data...
      </div>
    );

  return (
    <div>
      {/* Recommendation Card */}
      {rec && !rec.complete && (
        <div
          style={{
            background: `linear-gradient(135deg, ${C.greenFaint}, ${C.forestSurface})`,
            border: `1px solid ${C.green}`,
            borderRadius: 14,
            padding: "22px",
            marginBottom: 20,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -10,
              top: -10,
              fontSize: 80,
              opacity: 0.06,
            }}
          >
            🌾
          </div>
          <div
            style={{
              display: "inline-block",
              padding: "3px 12px",
              borderRadius: 100,
              background: C.greenFaint,
              border: `1px solid ${C.green}`,
              fontSize: 11,
              fontWeight: 700,
              color: C.greenGlow,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 12,
            }}
          >
            Week {rec.ageWeek} · {rec.phase} Phase
          </div>
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
                fontSize: 44,
                fontWeight: 900,
                color: C.greenGlow,
                lineHeight: 1,
              }}
            >
              {rec.totalKgPerDay}
            </span>
            <span style={{ fontSize: 16, color: C.textMuted }}>kg today</span>
          </div>
          <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>
            {rec.feedType} · {rec.gPerBirdPerDay}g per bird · {rec.birdsAlive}{" "}
            birds alive
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {[
              {
                label: "Bags this week",
                value: `${rec.bagsPerWeek} bags (25kg)`,
              },
              {
                label: "Est. weekly cost",
                value: rec.estimatedWeeklyCost || "—",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: 12,
                  color: C.textSecondary,
                }}
              >
                <div
                  style={{ color: C.textMuted, marginBottom: 3, fontSize: 10 }}
                >
                  {item.label}
                </div>
                <div style={{ fontWeight: 700, color: C.textPrimary }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {rec?.complete && (
        <div
          style={{
            padding: "20px",
            background: C.forestSurface,
            border: `1px solid ${C.forestBorder}`,
            borderRadius: 12,
            marginBottom: 20,
            textAlign: "center",
            color: C.textMuted,
          }}
        >
          Batch cycle is complete. Birds should be sold or culled.
        </div>
      )}

      {/* Brand Guide */}
      {rec?.brandGuide && (
        <div
          style={{
            background: C.forestSurface,
            border: `1px solid ${C.forestBorder}`,
            borderRadius: 14,
            marginBottom: 20,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 20px",
              borderBottom: `1px solid ${C.forestBorder}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}
            >
              Recommended Brands
            </div>
            <div style={{ fontSize: 12, color: C.textMuted }}>
              Protein: {rec.brandGuide.proteinPercent}
            </div>
          </div>
          <div style={{ padding: "16px 20px" }}>
            {rec.brandGuide.warning && (
              <div
                style={{
                  padding: "10px 14px",
                  background: C.amberFaint,
                  border: "1px solid #7A4A10",
                  borderRadius: 8,
                  fontSize: 12,
                  color: C.amberLight,
                  marginBottom: 14,
                }}
              >
                ⚠️ {rec.brandGuide.warning}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {rec.brandGuide.brands?.slice(0, 3).map((brand, i) => (
                <div
                  key={i}
                  style={{
                    background: C.forestSurface2,
                    borderRadius: 10,
                    padding: "12px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: C.textPrimary,
                        marginBottom: 2,
                      }}
                    >
                      {brand.name} — {brand.product}
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>
                      {brand.ingredients?.join(", ")}
                    </div>
                    <div
                      style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}
                    >
                      📍 {brand.whereToBuy}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: C.greenGlow,
                      }}
                    >
                      {brand.priceRange}
                    </div>
                    <div style={{ display: "flex", gap: 2, marginTop: 3 }}>
                      {[...Array(brand.rating || 0)].map((_, j) => (
                        <span key={j} style={{ color: C.gold, fontSize: 10 }}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cost Summary */}
      {cost && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
            marginBottom: 20,
          }}
        >
          {[
            {
              label: "Total Feed Cost",
              value: fmt(cost.totalCost),
              color: "#E88080",
            },
            {
              label: "Total Consumed",
              value: `${cost.totalKgConsumed}kg`,
              color: C.textPrimary,
            },
            {
              label: "Cost Per Bird",
              value: fmt(cost.costPerBird),
              color: C.greenGlow,
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: C.forestSurface,
                border: `1px solid ${C.forestBorder}`,
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 5,
                }}
              >
                {s.label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Feed */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setShowForm((p) => !p)}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            background: showForm
              ? C.forestSurface2
              : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
            color: showForm ? C.textSecondary : "#fff",
            marginBottom: showForm ? 12 : 0,
          }}
        >
          {showForm ? "✕ Cancel" : "+ Log Feed"}
        </button>

        {showForm && (
          <form
            onSubmit={handleLog}
            style={{
              background: C.forestSurface,
              border: `1px solid ${C.forestBorder}`,
              borderRadius: 12,
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 12,
                marginBottom: 12,
              }}
            >
              {[
                {
                  label: "Quantity (kg) *",
                  key: "quantityKg",
                  placeholder: "e.g. 10.5",
                  type: "number",
                },
                {
                  label: "Cost per kg (₦)",
                  key: "costPerKg",
                  placeholder: "e.g. 320",
                  type: "number",
                },
                {
                  label: "Brand Used",
                  key: "brandUsed",
                  placeholder: "e.g. Vital Feed",
                },
                {
                  label: "Stock Remaining (kg)",
                  key: "stockRemainingKg",
                  placeholder: "e.g. 5",
                  type: "number",
                },
              ].map((f) => (
                <div key={f.key}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.textMuted,
                      marginBottom: 5,
                    }}
                  >
                    {f.label}
                  </label>
                  <input
                    type={f.type || "text"}
                    placeholder={f.placeholder}
                    style={inputS}
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "10px 20px",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                cursor: saving ? "not-allowed" : "pointer",
                background: saving
                  ? "#5A6B5E"
                  : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                color: "#fff",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {saving ? "Saving..." : "Log Feed"}
            </button>
          </form>
        )}
      </div>

      {/* Feed History */}
      {history.length > 0 && (
        <div
          style={{
            background: C.forestSurface,
            border: `1px solid ${C.forestBorder}`,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 20px",
              borderBottom: `1px solid ${C.forestBorder}`,
              fontSize: 13,
              fontWeight: 700,
              color: C.textPrimary,
            }}
          >
            Feed History
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.forestSurface2 }}>
                {["Date", "Phase", "Quantity", "Brand", "Cost"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 16px",
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
              {history.slice(0, 10).map((log, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: `1px solid ${C.forestBorder}` }}
                >
                  <td
                    style={{
                      padding: "11px 16px",
                      fontSize: 13,
                      color: C.textSecondary,
                    }}
                  >
                    {new Date(log.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <Badge color="green">{log.phase || "—"}</Badge>
                  </td>
                  <td
                    style={{
                      padding: "11px 16px",
                      fontSize: 13,
                      color: C.textPrimary,
                      fontWeight: 600,
                    }}
                  >
                    {log.quantityKg}kg
                  </td>
                  <td
                    style={{
                      padding: "11px 16px",
                      fontSize: 12,
                      color: C.textMuted,
                    }}
                  >
                    {log.brandUsed || "—"}
                  </td>
                  <td
                    style={{
                      padding: "11px 16px",
                      fontSize: 13,
                      color: log.totalCost > 0 ? "#E88080" : C.textMuted,
                    }}
                  >
                    {fmt(log.totalCost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Health Tab ────────────────────────────────
function HealthTab({ batch }) {
  const [overview, setOverview] = useState(null);
  const [vaccines, setVaccines] = useState([]);
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMedForm, setShowMedForm] = useState(false);
  const [medForm, setMedForm] = useState({
    drugName: "",
    dosage: "",
    reason: "",
    durationDays: "",
    cost: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const [ovRes, vacRes, medRes] = await Promise.all([
        api.get(`/batches/${batch._id}/health/overview`),
        api.get(`/batches/${batch._id}/health/vaccinations`),
        api.get(`/batches/${batch._id}/health/medications`),
      ]);
      setOverview(ovRes.data.overview);
      setVaccines(vacRes.data.vaccinations || []);
      setMeds(medRes.data.medications || []);
    } catch {
      toast.error("Failed to load health data");
    } finally {
      setLoading(false);
    }
  };

  const markDone = async (vid) => {
    try {
      await api.put(`/batches/${batch._id}/health/vaccinations/${vid}/done`);
      toast.success("Vaccine marked as done");
      fetchHealth();
    } catch {
      toast.error("Failed to update vaccine");
    }
  };

  const handleMed = async (e) => {
    e.preventDefault();
    if (!medForm.drugName) {
      toast.error("Drug name is required");
      return;
    }
    setSaving(true);
    try {
      await api.post(`/batches/${batch._id}/health/medications`, {
        drugName: medForm.drugName,
        dosage: medForm.dosage,
        reason: medForm.reason,
        durationDays: parseInt(medForm.durationDays || 1),
        cost: parseFloat(medForm.cost || 0),
      });
      toast.success("Medication logged");
      setMedForm({
        drugName: "",
        dosage: "",
        reason: "",
        durationDays: "",
        cost: "",
      });
      setShowMedForm(false);
      fetchHealth();
    } catch {
      toast.error("Failed to log medication");
    } finally {
      setSaving(false);
    }
  };

  const inputS = {
    width: "100%",
    background: C.forestSurface2,
    border: `1px solid ${C.forestBorder}`,
    borderRadius: 7,
    padding: "9px 12px",
    fontSize: 13,
    color: C.textPrimary,
    fontFamily: "Inter, sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  if (loading)
    return (
      <div style={{ padding: "40px", textAlign: "center", color: C.textMuted }}>
        Loading health data...
      </div>
    );

  const statusColor =
    overview?.overallStatus === "critical"
      ? "red"
      : overview?.overallStatus === "warning"
        ? "amber"
        : "green";

  return (
    <div>
      {/* Health Status */}
      <div
        style={{
          background: C.forestSurface,
          border: `1px solid ${C.forestBorder}`,
          borderRadius: 12,
          padding: "18px 20px",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>
            Health Overview
          </div>
          <Badge color={statusColor}>
            {overview?.overallStatus?.charAt(0).toUpperCase() +
              overview?.overallStatus?.slice(1)}
          </Badge>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
          }}
        >
          {[
            {
              label: "Mortality",
              value: `${overview?.mortalityRate || 0}%`,
              color:
                (overview?.mortalityRate || 0) > 3 ? "#E88080" : C.greenGlow,
            },
            {
              label: "Total Deaths",
              value: overview?.totalDeaths || 0,
              color: C.textPrimary,
            },
            {
              label: "Vaccines Done",
              value: `${overview?.doneVaccinations || 0}/${overview?.totalVaccinations || 0}`,
              color: C.greenGlow,
            },
            {
              label: "Medications",
              value: overview?.totalMedications || 0,
              color: C.textPrimary,
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: C.forestSurface2,
                borderRadius: 9,
                padding: "12px 14px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                {s.label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
        {/* Alerts */}
        {overview?.alerts?.length > 0 && (
          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {overview.alerts.map((a, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontSize: 12,
                  background:
                    a.type === "HIGH_MORTALITY" ? C.redFaint : C.amberFaint,
                  border: `1px solid ${a.type === "HIGH_MORTALITY" ? "#7B1F1F" : "#7A4A10"}`,
                  color: a.type === "HIGH_MORTALITY" ? "#F0A0A0" : C.amberLight,
                }}
              >
                {a.type === "HIGH_MORTALITY" ? "🚨" : "💉"} {a.message}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vaccination Timeline */}
      <div
        style={{
          background: C.forestSurface,
          border: `1px solid ${C.forestBorder}`,
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderBottom: `1px solid ${C.forestBorder}`,
            fontSize: 13,
            fontWeight: 700,
            color: C.textPrimary,
          }}
        >
          Vaccination Schedule ({vaccines.length})
        </div>
        <div style={{ padding: "8px 20px" }}>
          {vaccines.map((v, i) => {
            const isOverdue =
              !v.isDone && new Date(v.scheduledDate) < new Date();
            const color = v.isDone ? "green" : isOverdue ? "red" : "amber";
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 0",
                  borderBottom:
                    i < vaccines.length - 1
                      ? `1px solid ${C.forestBorder}`
                      : "none",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: v.isDone
                      ? C.greenFaint
                      : isOverdue
                        ? C.redFaint
                        : C.amberFaint,
                    border: `2px solid ${v.isDone ? C.green : isOverdue ? "#7B1F1F" : "#7A4A10"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: v.isDone ? 14 : 13,
                    color: v.isDone
                      ? C.greenGlow
                      : isOverdue
                        ? "#E88080"
                        : C.amberLight,
                    fontWeight: 700,
                  }}
                >
                  {v.isDone ? "✓" : "💉"}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.textPrimary,
                      marginBottom: 2,
                    }}
                  >
                    {v.vaccineName}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>
                    {v.method} ·{" "}
                    {new Date(v.scheduledDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  {v.isDone && v.doneDate && (
                    <div
                      style={{ fontSize: 10, color: C.greenGlow, marginTop: 2 }}
                    >
                      Done{" "}
                      {new Date(v.doneDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Badge color={color}>
                    {v.isDone
                      ? "✓ Done"
                      : isOverdue
                        ? "Overdue"
                        : v.status === "due_soon"
                          ? "Due Soon"
                          : "Upcoming"}
                  </Badge>
                  {!v.isDone && (
                    <button
                      onClick={() => markDone(v._id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 7,
                        fontSize: 12,
                        fontWeight: 600,
                        border: `1px solid ${C.green}`,
                        background: C.greenFaint,
                        color: C.greenGlow,
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Mark Done
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Medications */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>
            Medication Log ({meds.length})
          </div>
          <button
            onClick={() => setShowMedForm((p) => !p)}
            style={{
              padding: "8px 14px",
              borderRadius: 7,
              fontSize: 12,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              background: showMedForm
                ? C.forestSurface2
                : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
              color: showMedForm ? C.textSecondary : "#fff",
            }}
          >
            {showMedForm ? "✕ Cancel" : "+ Add Medication"}
          </button>
        </div>
        {showMedForm && (
          <form
            onSubmit={handleMed}
            style={{
              background: C.forestSurface,
              border: `1px solid ${C.forestBorder}`,
              borderRadius: 12,
              padding: "20px",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 12,
                marginBottom: 12,
              }}
            >
              {[
                {
                  label: "Drug Name *",
                  key: "drugName",
                  placeholder: "e.g. Amprolite",
                },
                {
                  label: "Dosage",
                  key: "dosage",
                  placeholder: "e.g. 1ml per litre water",
                },
                {
                  label: "Reason",
                  key: "reason",
                  placeholder: "e.g. Coccidiosis treatment",
                },
                {
                  label: "Duration (days)",
                  key: "durationDays",
                  placeholder: "e.g. 5",
                  type: "number",
                },
                {
                  label: "Cost (₦)",
                  key: "cost",
                  placeholder: "e.g. 2500",
                  type: "number",
                },
              ].map((f) => (
                <div key={f.key}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.textMuted,
                      marginBottom: 5,
                    }}
                  >
                    {f.label}
                  </label>
                  <input
                    type={f.type || "text"}
                    placeholder={f.placeholder}
                    style={inputS}
                    value={medForm[f.key]}
                    onChange={(e) =>
                      setMedForm((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "10px 18px",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                cursor: saving ? "not-allowed" : "pointer",
                background: saving
                  ? "#5A6B5E"
                  : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                color: "#fff",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {saving ? "Saving..." : "Log Medication"}
            </button>
          </form>
        )}
        {meds.length > 0 && (
          <div
            style={{
              background: C.forestSurface,
              border: `1px solid ${C.forestBorder}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: C.forestSurface2 }}>
                  {["Drug", "Dosage", "Reason", "Duration", "Cost", "Date"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 16px",
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
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {meds.map((m, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: `1px solid ${C.forestBorder}` }}
                  >
                    <td
                      style={{
                        padding: "11px 16px",
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.textPrimary,
                      }}
                    >
                      {m.drugName}
                    </td>
                    <td
                      style={{
                        padding: "11px 16px",
                        fontSize: 12,
                        color: C.textMuted,
                      }}
                    >
                      {m.dosage || "—"}
                    </td>
                    <td
                      style={{
                        padding: "11px 16px",
                        fontSize: 12,
                        color: C.textMuted,
                      }}
                    >
                      {m.reason || "—"}
                    </td>
                    <td
                      style={{
                        padding: "11px 16px",
                        fontSize: 12,
                        color: C.textSecondary,
                      }}
                    >
                      {m.durationDays || 1}d
                    </td>
                    <td
                      style={{
                        padding: "11px 16px",
                        fontSize: 12,
                        color: m.cost > 0 ? "#E88080" : C.textMuted,
                      }}
                    >
                      {fmt(m.cost)}
                    </td>
                    <td
                      style={{
                        padding: "11px 16px",
                        fontSize: 12,
                        color: C.textMuted,
                      }}
                    >
                      {new Date(m.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Production Tab ────────────────────────────
function ProductionTab({ batch }) {
  const [overview, setOverview] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ value1: "", value2: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const isLayer = batch.breed === "layer";

  useEffect(() => {
    fetchProduction();
  }, []);

  const fetchProduction = async () => {
    setLoading(true);
    try {
      const [ovRes, logRes] = await Promise.all([
        api.get(`/batches/${batch._id}/production`),
        api.get(
          `/batches/${batch._id}/production/${isLayer ? "eggs" : "weights"}`,
        ),
      ]);
      setOverview(ovRes.data.overview);
      setLogs(
        isLayer ? logRes.data.eggLogs || [] : logRes.data.weightLogs || [],
      );
    } catch {
      toast.error("Failed to load production data");
    } finally {
      setLoading(false);
    }
  };

  const handleLog = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isLayer) {
        await api.post(`/batches/${batch._id}/production/eggs`, {
          totalEggs: parseInt(form.value1),
          brokenEggs: parseInt(form.value2 || 0),
          notes: form.notes,
        });
        toast.success("Egg production logged");
      } else {
        await api.post(`/batches/${batch._id}/production/weights`, {
          avgWeightKg: parseFloat(form.value1),
          sampleSize: parseInt(form.value2 || 10),
          notes: form.notes,
        });
        toast.success("Weight logged");
      }
      setForm({ value1: "", value2: "", notes: "" });
      setShowForm(false);
      fetchProduction();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to log");
    } finally {
      setSaving(false);
    }
  };

  const inputS = {
    width: "100%",
    background: C.forestSurface2,
    border: `1px solid ${C.forestBorder}`,
    borderRadius: 7,
    padding: "9px 12px",
    fontSize: 13,
    color: C.textPrimary,
    fontFamily: "Inter, sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  const chartData = isLayer
    ? logs
        .slice(0, 14)
        .reverse()
        .map((l) => ({
          date: new Date(l.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          }),
          eggs: l.totalEggs,
          rate: l.productionRate,
        }))
    : logs.map((l) => ({
        date: new Date(l.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        }),
        weight: l.avgWeightKg,
      }));

  if (loading)
    return (
      <div style={{ padding: "40px", textAlign: "center", color: C.textMuted }}>
        Loading production data...
      </div>
    );

  return (
    <div>
      {/* Overview Card */}
      {overview && (
        <div
          style={{
            background: C.forestSurface,
            border: `1px solid ${C.forestBorder}`,
            borderRadius: 12,
            padding: "20px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div
              style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}
            >
              {isLayer ? "🥚 Egg Production" : "⚖️ Weight Tracker"}
            </div>
            {!isLayer && overview.isReadyForSlaughter && (
              <Badge color="green">✅ Ready for Slaughter</Badge>
            )}
            {isLayer && overview.productionStatus && (
              <Badge
                color={
                  overview.productionStatus === "good"
                    ? "green"
                    : overview.productionStatus === "average"
                      ? "amber"
                      : "red"
                }
              >
                {overview.productionStatus?.charAt(0).toUpperCase() +
                  overview.productionStatus?.slice(1)}{" "}
                Production
              </Badge>
            )}
          </div>

          {isLayer ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
              }}
            >
              {[
                {
                  label: "Total Eggs",
                  value: fmtNum(overview.totalEggs),
                  color: C.textPrimary,
                },
                {
                  label: "Total Crates",
                  value: `${overview.totalCrates || 0}`,
                  color: C.goldLight,
                },
                {
                  label: "Today Rate",
                  value:
                    overview.todayRate != null ? `${overview.todayRate}%` : "—",
                  color: C.greenGlow,
                },
                {
                  label: "Broken",
                  value: fmtNum(overview.totalBroken),
                  color: "#E88080",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: C.forestSurface2,
                    borderRadius: 9,
                    padding: "12px 14px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: C.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      marginBottom: 4,
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{ fontSize: 20, fontWeight: 800, color: s.color }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
              }}
            >
              {[
                {
                  label: "Latest Weight",
                  value: overview.latestWeightKg
                    ? `${overview.latestWeightKg}kg`
                    : "—",
                  color: C.greenGlow,
                },
                {
                  label: "Target Weight",
                  value: `${overview.targetWeightKg}kg`,
                  color: C.textPrimary,
                },
                {
                  label: "Progress",
                  value:
                    overview.percentOfTarget != null
                      ? `${overview.percentOfTarget}%`
                      : "—",
                  color: overview.isReadyForSlaughter
                    ? C.greenGlow
                    : C.amberLight,
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: C.forestSurface2,
                    borderRadius: 9,
                    padding: "12px 14px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: C.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      marginBottom: 4,
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{ fontSize: 20, fontWeight: 800, color: s.color }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chart */}
      {chartData.length > 1 && (
        <div
          style={{
            background: C.forestSurface,
            border: `1px solid ${C.forestBorder}`,
            borderRadius: 12,
            padding: "18px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.textPrimary,
              marginBottom: 14,
            }}
          >
            {isLayer ? "Egg Production Trend" : "Weight Growth Chart"}
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.forestSurface2} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: C.textMuted }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: C.textMuted }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: C.forestSurface,
                  border: `1px solid ${C.forestBorder}`,
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              {isLayer ? (
                <Line
                  dataKey="eggs"
                  name="Eggs"
                  stroke={C.goldLight}
                  dot={false}
                  strokeWidth={2}
                />
              ) : (
                <Line
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke={C.greenGlow}
                  dot={{ fill: C.greenGlow, r: 4 }}
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Log Form */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setShowForm((p) => !p)}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            background: showForm
              ? C.forestSurface2
              : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
            color: showForm ? C.textSecondary : "#fff",
            marginBottom: showForm ? 12 : 0,
          }}
        >
          {showForm
            ? "✕ Cancel"
            : isLayer
              ? "+ Log Today's Eggs"
              : "+ Log Weight"}
        </button>
        {showForm && (
          <form
            onSubmit={handleLog}
            style={{
              background: C.forestSurface,
              border: `1px solid ${C.forestBorder}`,
              borderRadius: 12,
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                marginBottom: 12,
              }}
            >
              {(isLayer
                ? [
                    {
                      label: "Total Eggs *",
                      key: "value1",
                      placeholder: "e.g. 120",
                      type: "number",
                    },
                    {
                      label: "Broken Eggs",
                      key: "value2",
                      placeholder: "e.g. 3",
                      type: "number",
                    },
                  ]
                : [
                    {
                      label: "Avg Weight (kg) *",
                      key: "value1",
                      placeholder: "e.g. 1.5",
                      type: "number",
                    },
                    {
                      label: "Sample Size",
                      key: "value2",
                      placeholder: "e.g. 10",
                      type: "number",
                    },
                  ]
              ).map((f) => (
                <div key={f.key}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.textMuted,
                      marginBottom: 5,
                    }}
                  >
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    style={inputS}
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                  />
                </div>
              ))}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.textMuted,
                    marginBottom: 5,
                  }}
                >
                  Notes
                </label>
                <input
                  placeholder="Any notes..."
                  style={inputS}
                  value={form.notes}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, notes: e.target.value }))
                  }
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "10px 18px",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                cursor: saving ? "not-allowed" : "pointer",
                background: saving
                  ? "#5A6B5E"
                  : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                color: "#fff",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Finance Tab ───────────────────────────────
function FinanceTab({ batch }) {
  const [pnl, setPnl] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("pnl");
  const [showExpForm, setShowExpForm] = useState(false);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [expForm, setExpForm] = useState({
    category: "feed",
    amount: "",
    description: "",
  });
  const [saleForm, setSaleForm] = useState({
    buyerName: "",
    quantity: "",
    pricePerUnit: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    setLoading(true);
    try {
      const [pnlRes, expRes, saleRes] = await Promise.all([
        api.get(`/batches/${batch._id}/finance/pnl`),
        api.get(`/batches/${batch._id}/finance/expenses`),
        api.get(`/batches/${batch._id}/finance/sales`),
      ]);
      setPnl(pnlRes.data.pnl);
      setExpenses(expRes.data.expenses || []);
      setSales(saleRes.data.sales || []);
    } catch {
      toast.error("Failed to load finance data");
    } finally {
      setLoading(false);
    }
  };

  const handleExpense = async (e) => {
    e.preventDefault();
    if (!expForm.amount) {
      toast.error("Amount is required");
      return;
    }
    setSaving(true);
    try {
      await api.post(`/batches/${batch._id}/finance/expenses`, {
        ...expForm,
        amount: parseFloat(expForm.amount),
      });
      toast.success("Expense logged");
      setExpForm({ category: "feed", amount: "", description: "" });
      setShowExpForm(false);
      fetchFinance();
    } catch {
      toast.error("Failed to log expense");
    } finally {
      setSaving(false);
    }
  };

  const handleSale = async (e) => {
    e.preventDefault();
    if (!saleForm.quantity || !saleForm.pricePerUnit) {
      toast.error("Quantity and price required");
      return;
    }
    setSaving(true);
    try {
      await api.post(`/batches/${batch._id}/finance/sales`, {
        ...saleForm,
        quantity: parseInt(saleForm.quantity),
        pricePerUnit: parseFloat(saleForm.pricePerUnit),
      });
      toast.success("Sale logged");
      setSaleForm({ buyerName: "", quantity: "", pricePerUnit: "", notes: "" });
      setShowSaleForm(false);
      fetchFinance();
    } catch {
      toast.error("Failed to log sale");
    } finally {
      setSaving(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/batches/${batch._id}/finance/expenses/${id}`);
      toast.success("Expense deleted");
      fetchFinance();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const inputS = {
    width: "100%",
    background: C.forestSurface2,
    border: `1px solid ${C.forestBorder}`,
    borderRadius: 7,
    padding: "9px 12px",
    fontSize: 13,
    color: C.textPrimary,
    fontFamily: "Inter, sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  if (loading)
    return (
      <div style={{ padding: "40px", textAlign: "center", color: C.textMuted }}>
        Loading finance data...
      </div>
    );

  return (
    <div>
      {/* P&L Summary */}
      {pnl && (
        <div
          style={{
            background: C.forestSurface,
            border: `1px solid ${pnl.isProfit ? C.forestBorder : "#7B1F1F"}`,
            borderRadius: 14,
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              borderBottom: `1px solid ${C.forestBorder}`,
            }}
          >
            {[
              {
                label: "Total Expenses",
                value: fmt(pnl.totalExpenses),
                color: "#E88080",
              },
              {
                label: "Total Revenue",
                value: fmt(pnl.totalRevenue),
                color: C.greenGlow,
              },
              {
                label: "Net Profit",
                value: fmt(pnl.netProfit),
                color: pnl.isProfit ? C.greenGlow : "#E88080",
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "20px 22px",
                  textAlign: "center",
                  borderRight: i < 2 ? `1px solid ${C.forestBorder}` : "none",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 6,
                  }}
                >
                  {s.label}
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              gap: 24,
              padding: "14px 22px",
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Cost per bird", value: fmt(pnl.costPerBird) },
              { label: "Profit per bird", value: fmt(pnl.profitPerBird) },
              { label: "ROI", value: `${pnl.roi}%` },
              {
                label: "Break-even price",
                value: fmt(pnl.breakEvenPricePerBird),
              },
            ].map((s, i) => (
              <div key={i}>
                <div
                  style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}
                >
                  {s.label}
                </div>
                <div
                  style={{ fontSize: 14, fontWeight: 700, color: C.greenGlow }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: "12px 22px",
              background: pnl.isProfit ? C.greenFaint : C.redFaint,
              borderTop: `1px solid ${C.forestBorder}`,
              fontSize: 13,
              color: pnl.isProfit ? C.greenGlow : "#E88080",
            }}
          >
            {pnl.statusMessage}
          </div>
        </div>
      )}

      {/* Tab: Expenses / Sales */}
      <div
        style={{
          display: "flex",
          gap: 2,
          background: C.forestSurface,
          border: `1px solid ${C.forestBorder}`,
          borderRadius: 9,
          padding: 4,
          marginBottom: 16,
          width: "fit-content",
        }}
      >
        {["expenses", "sales"].map((t) => (
          <button
            key={t}
            onClick={() => setView(t)}
            style={{
              padding: "7px 16px",
              borderRadius: 7,
              fontSize: 12,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              background: view === t ? C.greenFaint : "transparent",
              color: view === t ? C.greenGlow : C.textMuted,
              boxShadow: view === t ? `inset 0 0 0 1px ${C.green}` : "none",
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Expense View */}
      {view === "expenses" && (
        <div>
          <button
            onClick={() => setShowExpForm((p) => !p)}
            style={{
              padding: "9px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              background: showExpForm
                ? C.forestSurface2
                : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
              color: showExpForm ? C.textSecondary : "#fff",
              marginBottom: 14,
            }}
          >
            {showExpForm ? "✕ Cancel" : "+ Log Expense"}
          </button>
          {showExpForm && (
            <form
              onSubmit={handleExpense}
              style={{
                background: C.forestSurface,
                border: `1px solid ${C.forestBorder}`,
                borderRadius: 12,
                padding: "20px",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.textMuted,
                      marginBottom: 5,
                    }}
                  >
                    Category *
                  </label>
                  <select
                    style={{ ...inputS, cursor: "pointer" }}
                    value={expForm.category}
                    onChange={(e) =>
                      setExpForm((p) => ({ ...p, category: e.target.value }))
                    }
                  >
                    {[
                      "chicks",
                      "feed",
                      "medication",
                      "labor",
                      "utilities",
                      "equipment",
                      "other",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.textMuted,
                      marginBottom: 5,
                    }}
                  >
                    Amount (₦) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    style={inputS}
                    value={expForm.amount}
                    onChange={(e) =>
                      setExpForm((p) => ({ ...p, amount: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.textMuted,
                      marginBottom: 5,
                    }}
                  >
                    Description
                  </label>
                  <input
                    placeholder="e.g. 10 bags starter feed"
                    style={inputS}
                    value={expForm.description}
                    onChange={(e) =>
                      setExpForm((p) => ({ ...p, description: e.target.value }))
                    }
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: "10px 18px",
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 700,
                  border: "none",
                  cursor: saving ? "not-allowed" : "pointer",
                  background: saving
                    ? "#5A6B5E"
                    : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                  color: "#fff",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {saving ? "Saving..." : "Log Expense"}
              </button>
            </form>
          )}
          <div
            style={{
              background: C.forestSurface,
              border: `1px solid ${C.forestBorder}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {expenses.length ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.forestSurface2 }}>
                    {["Category", "Amount", "Description", "Date", ""].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 16px",
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
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp, i) => (
                    <tr
                      key={i}
                      style={{ borderBottom: `1px solid ${C.forestBorder}` }}
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <Badge
                          color={
                            exp.category === "medication"
                              ? "amber"
                              : exp.category === "chicks"
                                ? "blue"
                                : "muted"
                          }
                        >
                          {exp.category}
                        </Badge>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#E88080",
                        }}
                      >
                        {fmt(exp.amount)}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 12,
                          color: C.textMuted,
                        }}
                      >
                        {exp.description || "—"}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 12,
                          color: C.textMuted,
                        }}
                      >
                        {new Date(exp.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          onClick={() => deleteExpense(exp._id)}
                          style={{
                            padding: "4px 10px",
                            borderRadius: 6,
                            fontSize: 11,
                            border: `1px solid ${C.forestBorder}`,
                            background: C.forestSurface2,
                            color: "#E88080",
                            cursor: "pointer",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div
                style={{
                  padding: "32px",
                  textAlign: "center",
                  color: C.textMuted,
                  fontSize: 13,
                }}
              >
                No expenses logged yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sales View */}
      {view === "sales" && (
        <div>
          <button
            onClick={() => setShowSaleForm((p) => !p)}
            style={{
              padding: "9px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              background: showSaleForm
                ? C.forestSurface2
                : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
              color: showSaleForm ? C.textSecondary : "#fff",
              marginBottom: 14,
            }}
          >
            {showSaleForm ? "✕ Cancel" : "+ Log Sale"}
          </button>
          {showSaleForm && (
            <form
              onSubmit={handleSale}
              style={{
                background: C.forestSurface,
                border: `1px solid ${C.forestBorder}`,
                borderRadius: 12,
                padding: "20px",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                {[
                  {
                    label: "Buyer Name",
                    key: "buyerName",
                    placeholder: "e.g. Alhaji Musa",
                  },
                  {
                    label: "Quantity *",
                    key: "quantity",
                    placeholder: "e.g. 180",
                    type: "number",
                  },
                  {
                    label: "Price per unit (₦) *",
                    key: "pricePerUnit",
                    placeholder: "e.g. 4500",
                    type: "number",
                  },
                  {
                    label: "Notes",
                    key: "notes",
                    placeholder: "e.g. Live birds",
                  },
                ].map((f) => (
                  <div key={f.key}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 600,
                        color: C.textMuted,
                        marginBottom: 5,
                      }}
                    >
                      {f.label}
                    </label>
                    <input
                      type={f.type || "text"}
                      placeholder={f.placeholder}
                      style={inputS}
                      value={saleForm[f.key]}
                      onChange={(e) =>
                        setSaleForm((p) => ({ ...p, [f.key]: e.target.value }))
                      }
                    />
                  </div>
                ))}
              </div>
              {saleForm.quantity && saleForm.pricePerUnit && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: C.greenFaint,
                    border: `1px solid ${C.green}`,
                    borderRadius: 8,
                    fontSize: 13,
                    color: C.greenGlow,
                    marginBottom: 12,
                  }}
                >
                  Total:{" "}
                  <strong>
                    {fmt(
                      parseInt(saleForm.quantity || 0) *
                        parseFloat(saleForm.pricePerUnit || 0),
                    )}
                  </strong>
                </div>
              )}
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: "10px 18px",
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 700,
                  border: "none",
                  cursor: saving ? "not-allowed" : "pointer",
                  background: saving
                    ? "#5A6B5E"
                    : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                  color: "#fff",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {saving ? "Saving..." : "Log Sale"}
              </button>
            </form>
          )}
          <div
            style={{
              background: C.forestSurface,
              border: `1px solid ${C.forestBorder}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {sales.length ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.forestSurface2 }}>
                    {["Buyer", "Qty", "Price/unit", "Total", "Date"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 16px",
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
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s, i) => (
                    <tr
                      key={i}
                      style={{ borderBottom: `1px solid ${C.forestBorder}` }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          color: C.textPrimary,
                        }}
                      >
                        {s.buyerName || "—"}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          color: C.textSecondary,
                        }}
                      >
                        {fmtNum(s.quantity)}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          color: C.textSecondary,
                        }}
                      >
                        {fmt(s.pricePerUnit)}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          fontWeight: 700,
                          color: C.greenGlow,
                        }}
                      >
                        {fmt(s.totalAmount)}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 12,
                          color: C.textMuted,
                        }}
                      >
                        {new Date(s.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div
                style={{
                  padding: "32px",
                  textAlign: "center",
                  color: C.textMuted,
                  fontSize: 13,
                }}
              >
                No sales logged yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// BATCH DETAIL PAGE
// ══════════════════════════════════════════════
export default function BatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [batch, setBatch] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Overview");

  useEffect(() => {
    fetchBatch();
  }, [params.id]);

  const fetchBatch = async () => {
    setLoading(true);
    try {
      const [bRes, uRes] = await Promise.all([
        api.get(`/batches/${params.id}`),
        api.get(`/batches/${params.id}/updates`),
      ]);
      setBatch(bRes.data.batch);
      setUpdates(uRes.data.updates || []);
    } catch {
      toast.error("Batch not found");
      router.push("/dashboard/batches");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          padding: "28px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              margin: "0 auto 12px",
              border: `3px solid ${C.forestBorder}`,
              borderTopColor: C.greenGlow,
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ color: C.textMuted, fontSize: 13 }}>Loading batch...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );

  if (!batch) return null;

  const mortality = parseFloat(batch.mortalityRate || 0);
  const isCritical = mortality > 3;
  const breedColor = { broiler: "green", layer: "blue", cockerel: "amber" };
  const statusColor =
    batch.status === "active"
      ? isCritical
        ? "red"
        : "green"
      : batch.status === "completed"
        ? "muted"
        : "blue";

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
          fontSize: 13,
          color: C.textMuted,
        }}
      >
        <Link
          href="/dashboard/batches"
          style={{ color: C.textMuted, textDecoration: "none" }}
        >
          Batches
        </Link>
        <span>›</span>
        <span style={{ color: C.textPrimary }}>{batch.name}</span>
      </div>

      {/* Batch Header */}
      <div
        style={{
          background: C.forestSurface,
          border: `1px solid ${C.forestBorder}`,
          borderRadius: 14,
          padding: "22px 24px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: C.forestSurface2,
              border: `1px solid ${C.forestBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
            }}
          >
            {batch.breed === "layer"
              ? "🥚"
              : batch.breed === "cockerel"
                ? "🐓"
                : "🐔"}
          </div>
          <div>
            <h1
              style={{
                fontFamily: "Playfair Display, Georgia, serif",
                fontSize: 22,
                fontWeight: 700,
                color: C.textPrimary,
                marginBottom: 6,
              }}
            >
              {batch.name}
            </h1>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Badge color={breedColor[batch.breed] || "green"}>
                {batch.breed?.charAt(0).toUpperCase() + batch.breed?.slice(1)}
              </Badge>
              <Badge color={statusColor}>
                {batch.status === "active" && isCritical
                  ? "● Critical"
                  : batch.status?.charAt(0).toUpperCase() +
                    batch.status?.slice(1)}
              </Badge>
              <span style={{ fontSize: 12, color: C.textMuted }}>
                {fmtNum(batch.quantity)} birds · Started{" "}
                {new Date(batch.startDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Status Changer */}
        <div style={{ display: "flex", gap: 8 }}>
          {batch.status === "active" && (
            <>
              <button
                onClick={async () => {
                  try {
                    await api.put(`/batches/${params.id}`, {
                      status: "completed",
                    });
                    toast.success("Batch marked as completed");
                    fetchBatch();
                  } catch {
                    toast.error("Failed to update status");
                  }
                }}
                style={{
                  padding: "9px 16px",
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: 600,
                  border: `1px solid ${C.forestBorder}`,
                  background: C.forestSurface2,
                  color: C.textSecondary,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Mark Completed
              </button>
              <button
                onClick={async () => {
                  try {
                    await api.put(`/batches/${params.id}`, { status: "sold" });
                    toast.success("Batch marked as sold");
                    fetchBatch();
                  } catch {
                    toast.error("Failed to update status");
                  }
                }}
                style={{
                  padding: "9px 16px",
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: 700,
                  border: "none",
                  background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                  color: "#fff",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  boxShadow: "0 3px 10px rgba(45,122,58,0.3)",
                }}
              >
                Mark Sold 🐔
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 2,
          background: C.forestSurface,
          border: `1px solid ${C.forestBorder}`,
          borderRadius: 10,
          padding: 4,
          marginBottom: 24,
          width: "fit-content",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "Inter, sans-serif",
              background: tab === t ? C.greenFaint : "transparent",
              color: tab === t ? C.greenGlow : C.textMuted,
              boxShadow: tab === t ? `inset 0 0 0 1px ${C.green}` : "none",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "Overview" && (
        <OverviewTab batch={batch} updates={updates} onLogUpdate={fetchBatch} />
      )}
      {tab === "Feed" && <FeedTab batch={batch} />}
      {tab === "Health" && <HealthTab batch={batch} />}
      {tab === "Production" && <ProductionTab batch={batch} />}
      {tab === "Finance" && <FinanceTab batch={batch} />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
