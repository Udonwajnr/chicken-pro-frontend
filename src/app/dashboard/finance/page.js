"use client";

import { useState, useEffect } from "react";
import api from "../../../../lib/api";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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
  forestBg: "#0F1F14",
  forestSurface: "#162B1C",
  forestSurface2: "#1C3524",
  forestBorder: "#234D2E",
  green: "#2D7A3A",
  greenLight: "#3D9E4D",
  greenGlow: "#6FCF7F",
  greenFaint: "#1A3D22",
  gold: "#C9A84C",
  goldLight: "#E8C76A",
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

const fmt = (n) => (n != null ? `₦${Number(n).toLocaleString()}` : "₦0");

function Badge({ children, color = "green" }) {
  const s = {
    green: { bg: C.greenFaint, text: C.greenGlow, border: C.green },
    red: { bg: C.redFaint, text: "#E88080", border: "#7B1F1F" },
    gold: { bg: "rgba(201,168,76,0.15)", text: C.goldLight, border: C.gold },
    amber: { bg: C.amberFaint, text: C.amberLight, border: "#7A4A10" },
    muted: { bg: C.forestSurface2, text: C.textSecondary, border: C.forestBorder },
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

export default function FinancePage() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/finance/overview");
      setOverview(res.data.overview);
    } catch {
      toast.error("Failed to load finance data");
    } finally {
      setLoading(false);
    }
  };

  const o = overview;

  const pieData = o
    ? [
        { name: "Revenue", value: o.allTime.totalRevenue },
        { name: "Expenses", value: o.allTime.totalExpenses },
      ].filter((d) => d.value > 0)
    : [];

  const pad = isMobile ? "16px 14px" : "28px 32px";

  return (
    <div style={{ padding: pad, maxWidth: 1200, margin: "0 auto" }}>

      {/* Header */}
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
            💰 Finance Overview
          </h1>
          <p style={{ fontSize: 12, color: C.textMuted }}>
            All-time and monthly financial summary across all batches
          </p>
        </div>
        <button
          onClick={fetchData}
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

      {/* All-Time Stat Cards */}
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
                icon: "📈",
                label: "All-Time Revenue",
                value: fmt(o?.allTime?.totalRevenue),
                bar: `linear-gradient(90deg,${C.green},${C.greenLight})`,
                vc: C.greenGlow,
              },
              {
                icon: "📉",
                label: "All-Time Expenses",
                value: fmt(o?.allTime?.totalExpenses),
                bar: `linear-gradient(90deg,${C.red},#E74C3C)`,
                vc: "#E88080",
              },
              {
                icon: "💹",
                label: "All-Time Profit",
                value: fmt(o?.allTime?.profit),
                bar: o?.allTime?.isProfit
                  ? `linear-gradient(90deg,${C.green},${C.greenLight})`
                  : `linear-gradient(90deg,${C.red},#E74C3C)`,
                vc: o?.allTime?.isProfit ? C.greenGlow : "#E88080",
              },
              {
                icon: "🏆",
                label: "Best ROI",
                value: o?.bestBatch ? `${o.bestBatch.roi}%` : "—",
                bar: `linear-gradient(90deg,${C.gold},${C.goldLight})`,
                vc: C.goldLight,
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
                    fontSize: isMobile ? 18 : 22,
                    fontWeight: 800,
                    color: s.vc,
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
      </div>

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
          { k: "overview", l: "📊 Overview" },
          { k: "thisMonth", l: "📅 This Month" },
          { k: "batches", l: "🐔 By Batch" },
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

      {/* ── Overview Tab ── */}
      {tab === "overview" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 12 : 20,
          }}
        >
          {/* Best Batch */}
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
                background: C.forestSurface2,
                borderBottom: `1px solid ${C.forestBorder}`,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>
                🏆 Best Performing Batch
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                Highest profit across all completed batches
              </div>
            </div>
            <div style={{ padding: "16px 18px" }}>
              {loading ? (
                <Skeleton h={100} />
              ) : o?.bestBatch ? (
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: C.textPrimary,
                      marginBottom: 14,
                    }}
                  >
                    {o.bestBatch.batchName}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3,1fr)",
                      gap: 8,
                      marginBottom: 14,
                    }}
                  >
                    {[
                      { l: "Profit", v: fmt(o.bestBatch.profit), c: C.greenGlow },
                      { l: "ROI", v: `${o.bestBatch.roi}%`, c: C.goldLight },
                      {
                        l: "Revenue",
                        v: fmt(o.bestBatch.revenue),
                        c: C.textPrimary,
                      },
                    ].map((s, i) => (
                      <div
                        key={i}
                        style={{
                          background: C.forestSurface2,
                          borderRadius: 8,
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 9,
                            color: C.textMuted,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            marginBottom: 3,
                          }}
                        >
                          {s.l}
                        </div>
                        <div
                          style={{ fontSize: 15, fontWeight: 700, color: s.c }}
                        >
                          {s.v}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/dashboard/batches/${o.bestBatch.batchId}`}
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
                    View this batch →
                  </Link>
                </div>
              ) : (
                <div
                  style={{
                    padding: "24px 0",
                    textAlign: "center",
                    fontSize: 13,
                    color: C.textMuted,
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 6 }}>📊</div>
                  Complete a batch to see your best performer.
                </div>
              )}
            </div>
          </div>

          {/* Revenue vs Expenses Pie */}
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
                background: C.forestSurface2,
                borderBottom: `1px solid ${C.forestBorder}`,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>
                Revenue vs Expenses Split
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                All-time breakdown
              </div>
            </div>
            <div style={{ padding: "16px 18px" }}>
              {loading ? (
                <Skeleton h={160} />
              ) : pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={i === 0 ? C.greenGlow : "#E88080"}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => fmt(v)}
                      contentStyle={{
                        background: C.forestSurface,
                        border: `1px solid ${C.forestBorder}`,
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 12, color: C.textSecondary }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    height: 180,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <div style={{ fontSize: 32 }}>📊</div>
                  <div style={{ fontSize: 13, color: C.textMuted }}>
                    Log expenses and sales to see your breakdown.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div
            style={{
              background: C.forestSurface,
              border: `1px solid ${C.forestBorder}`,
              borderRadius: 14,
              overflow: "hidden",
              gridColumn: isMobile ? "auto" : "1 / -1",
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                background: C.forestSurface2,
                borderBottom: `1px solid ${C.forestBorder}`,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>
                Quick Actions
              </div>
            </div>
            <div
              style={{
                padding: "14px 18px",
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Log Expense", href: "/dashboard/batches", desc: "Add to a batch" },
                { label: "Log Sale", href: "/dashboard/batches", desc: "Record revenue" },
                { label: "View P&L", href: "/dashboard/batches", desc: "Per batch detail" },
                { label: "Analytics", href: "/dashboard/analytics", desc: "Charts & trends" },
              ].map((a, i) => (
                <Link
                  key={i}
                  href={a.href}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 10,
                    background: C.forestSurface2,
                    border: `1px solid ${C.forestBorder}`,
                    textDecoration: "none",
                    transition: "all 0.15s",
                    minWidth: isMobile ? "calc(50% - 5px)" : "auto",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = C.green;
                    e.currentTarget.style.background = C.greenFaint;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.forestBorder;
                    e.currentTarget.style.background = C.forestSurface2;
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.textPrimary,
                      marginBottom: 2,
                    }}
                  >
                    {a.label}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{a.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── This Month Tab ── */}
      {tab === "thisMonth" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)",
            gap: isMobile ? 12 : 16,
          }}
        >
          {loading
            ? [1, 2, 3, 4].map((i) => <Skeleton key={i} h={110} />)
            : [
                {
                  icon: "📈",
                  label: "Revenue",
                  value: fmt(o?.thisMonth?.revenue),
                  bar: `linear-gradient(90deg,${C.green},${C.greenLight})`,
                  vc: C.greenGlow,
                  sub: "Total income this month",
                },
                {
                  icon: "📉",
                  label: "Expenses",
                  value: fmt(o?.thisMonth?.expenses),
                  bar: `linear-gradient(90deg,${C.red},#E74C3C)`,
                  vc: "#E88080",
                  sub: "Total costs this month",
                },
                {
                  icon: "💹",
                  label: "Profit",
                  value: fmt(o?.thisMonth?.profit),
                  bar: o?.thisMonth?.isProfit
                    ? `linear-gradient(90deg,${C.green},${C.greenLight})`
                    : `linear-gradient(90deg,${C.red},#E74C3C)`,
                  vc: o?.thisMonth?.isProfit ? C.greenGlow : "#E88080",
                  sub: o?.thisMonth?.isProfit ? "In profit this month" : "Running at a loss",
                },
                {
                  icon: o?.thisMonth?.isProfit ? "✅" : "⚠️",
                  label: "Status",
                  value: o?.thisMonth?.isProfit ? "Profitable" : "Loss",
                  bar: o?.thisMonth?.isProfit
                    ? `linear-gradient(90deg,${C.green},${C.greenLight})`
                    : `linear-gradient(90deg,${C.amber},${C.amberLight})`,
                  vc: o?.thisMonth?.isProfit ? C.greenGlow : C.amberLight,
                  sub: "Current month standing",
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
                      fontSize: isMobile ? 22 : 28,
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
      )}

      {/* ── By Batch Tab ── */}
      {tab === "batches" && (
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
              background: C.forestSurface2,
              borderBottom: `1px solid ${C.forestBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>
                Finance by Batch
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                P&L summary for each batch
              </div>
            </div>
          </div>
          {loading ? (
            <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2, 3].map((i) => <Skeleton key={i} h={56} />)}
            </div>
          ) : (
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                <thead>
                  <tr style={{ background: C.forestSurface2 }}>
                    {["Batch", "Revenue", "Expenses", "Profit", "ROI", "Status", ""].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "11px 18px",
                          textAlign: "left",
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 1.5,
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
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: "40px 32px",
                        textAlign: "center",
                        fontSize: 13,
                        color: C.textMuted,
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🐔</div>
                      <div style={{ marginBottom: 8 }}>
                        View per-batch P&L from each batch's Finance tab.
                      </div>
                      <Link
                        href="/dashboard/batches"
                        style={{
                          color: C.greenGlow,
                          textDecoration: "none",
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        Go to Batches →
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}