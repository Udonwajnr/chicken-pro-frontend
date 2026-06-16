"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "../../../lib/api";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
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
  forestMuted: "#3D6B4A",
  green: "#2D7A3A",
  greenLight: "#3D9E4D",
  greenGlow: "#6FCF7F",
  greenFaint: "#1A3D22",
  gold: "#C9A84C",
  goldLight: "#E8C76A",
  goldFaint: "#2A2010",
  red: "#C0392B",
  redLight: "#E74C3C",
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
const fmtNum = (n) => (n != null ? Number(n).toLocaleString() : "0");

function timeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function Skeleton({ w = "100%", h = 20 }) {
  return (
    <div
      style={{
        width: w, height: h, borderRadius: 6,
        background: `linear-gradient(90deg,${C.forestSurface} 25%,${C.forestSurface2} 50%,${C.forestSurface} 75%)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
  );
}

function Badge({ children, color = "green" }) {
  const styles = {
    green: { bg: C.greenFaint, text: C.greenGlow, border: C.green },
    red: { bg: C.redFaint, text: "#E88080", border: "#7B1F1F" },
    amber: { bg: C.amberFaint, text: C.amberLight, border: "#7A4A10" },
    gold: { bg: C.goldFaint, text: C.goldLight, border: C.gold },
    muted: { bg: C.forestSurface2, text: C.textSecondary, border: C.forestBorder },
    blue: { bg: "rgba(36,113,163,0.15)", text: C.blueLight, border: "#1A4A6A" },
  };
  const s = styles[color] || styles.green;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 100,
      fontSize: 11, fontWeight: 600,
      background: s.bg, color: s.text, border: `1px solid ${s.border}`,
    }}>
      {children}
    </span>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
      borderRadius: 8, padding: "10px 14px", fontSize: 12,
    }}>
      <div style={{ color: C.textSecondary, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: {["Revenue", "Expenses", "Profit"].includes(p.name) ? fmt(p.value) : p.value}
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [batchChart, setBatchChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [overviewRes, revenueRes, batchRes] = await Promise.all([
        api.get("/dashboard/overview"),
        api.get("/dashboard/charts/revenue?months=6"),
        api.get("/dashboard/charts/batches"),
      ]);
      setData(overviewRes.data.dashboard);
      setChartData(revenueRes.data.chart?.data || []);
      setBatchChart(batchRes.data.chart?.batches || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const d = data;
  const firstName = user?.name?.split(" ")[0] || "Farmer";
  const pad = isMobile ? "16px 14px" : "28px 32px";

  const mortality =
    d?.summary?.totalBirds > 0
      ? (((d?.summary?.totalDeaths || 0) / d?.summary?.totalBirds) * 100).toFixed(1)
      : "0";

  return (
    <div style={{ padding: pad, maxWidth: 1200, margin: "0 auto" }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: isMobile ? 16 : 28,
        flexWrap: "wrap",
        gap: 10,
      }}>
        <div>
          <h1 style={{
            fontFamily: "Playfair Display,Georgia,serif",
            fontSize: isMobile ? 20 : 28,
            fontWeight: 700,
            color: C.textPrimary,
            marginBottom: 4,
          }}>
            {timeOfDay()}, {firstName} 👋
          </h1>
          <p style={{ fontSize: 12, color: C.textMuted }}>
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })}
            {d?.summary?.activeBatches > 0 &&
              ` · ${d.summary.activeBatches} active batch${d.summary.activeBatches > 1 ? "es" : ""}`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button
            onClick={fetchAll}
            style={{
              padding: "8px 12px", borderRadius: 8,
              fontSize: 11, fontWeight: 600,
              border: `1px solid ${C.forestBorder}`,
              background: C.forestSurface2, color: C.textSecondary,
              cursor: "pointer", fontFamily: "Inter,sans-serif",
            }}
          >
            ↻ Refresh
          </button>
          <Link
            href="/dashboard/batches/new"
            style={{
              padding: isMobile ? "8px 14px" : "9px 18px",
              borderRadius: 8, fontSize: isMobile ? 12 : 13, fontWeight: 700,
              background: `linear-gradient(135deg,${C.green},${C.greenLight})`,
              color: "#fff", textDecoration: "none",
              boxShadow: "0 4px 14px rgba(45,122,58,0.35)",
              display: "inline-flex", alignItems: "center", gap: 5,
            }}
          >
            + New Batch
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)",
        gap: isMobile ? 10 : 14,
        marginBottom: isMobile ? 14 : 24,
      }}>
        {loading
          ? [1, 2, 3, 4].map((i) => <Skeleton key={i} h={90} />)
          : [
              {
                icon: "🐔", label: "Active Batches",
                value: fmtNum(d?.summary?.activeBatches),
                sub: `${fmtNum(d?.summary?.totalBatches)} total`,
                bar: `linear-gradient(90deg,${C.green},${C.greenLight})`, vc: C.greenGlow,
              },
              {
                icon: "🐣", label: "Live Birds",
                value: fmtNum(d?.summary?.totalLiveBirds),
                sub: `of ${fmtNum(d?.summary?.totalBirds)} started`,
                bar: `linear-gradient(90deg,${C.blue},${C.blueLight})`, vc: C.blueLight,
              },
              {
                icon: "💰", label: "This Month",
                value: fmt(d?.finance?.thisMonth?.revenue),
                sub: `${d?.finance?.thisMonth?.isProfit ? "↑" : "↓"} ${fmt(Math.abs(d?.finance?.thisMonth?.profit || 0))} ${d?.finance?.thisMonth?.isProfit ? "profit" : "loss"}`,
                subColor: d?.finance?.thisMonth?.isProfit ? C.greenGlow : "#E88080",
                bar: `linear-gradient(90deg,${C.gold},${C.goldLight})`, vc: C.goldLight,
              },
              {
                icon: "⚠️", label: "Mortality Rate",
                value: `${mortality}%`,
                sub: `${fmtNum(d?.summary?.totalDeaths)} deaths`,
                subColor: parseFloat(mortality) > 3 ? "#E88080" : C.greenGlow,
                bar: parseFloat(mortality) > 3
                  ? `linear-gradient(90deg,${C.red},${C.redLight})`
                  : `linear-gradient(90deg,${C.green},${C.greenLight})`,
                vc: parseFloat(mortality) > 3 ? "#E88080" : C.greenGlow,
              },
            ].map((s, i) => (
              <div key={i} style={{
                background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
                borderRadius: 14, padding: "16px 18px",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: s.bar,
                }} />
                <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
                <div style={{
                  fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: 1.5, color: C.textMuted, marginBottom: 4,
                }}>
                  {s.label}
                </div>
                <div style={{
                  fontSize: isMobile ? 18 : 26, fontWeight: 800,
                  color: s.vc, lineHeight: 1, marginBottom: 3,
                }}>
                  {s.value}
                </div>
                {s.sub && (
                  <div style={{ fontSize: 11, color: s.subColor || C.textMuted }}>
                    {s.sub}
                  </div>
                )}
              </div>
            ))}
      </div>

      {/* ── Charts + Vaccine Panel ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 300px",
        gap: isMobile ? 12 : 20,
        marginBottom: isMobile ? 14 : 24,
      }}>

        {/* Revenue Chart */}
        <div style={{
          background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
          borderRadius: 14, overflow: "hidden",
        }}>
          <div style={{
            padding: "12px 18px",
            background: C.forestSurface2,
            borderBottom: `1px solid ${C.forestBorder}`,
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 8 : 0,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>
                Revenue vs Expenses
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                Last 6 months
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "Revenue", color: C.greenGlow },
                { label: "Expenses", color: "#E88080" },
                { label: "Profit", color: C.goldLight },
              ].map((l) => (
                <div key={l.label} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  fontSize: 11, color: C.textMuted,
                }}>
                  <div style={{ width: 9, height: 9, borderRadius: 2, background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: isMobile ? "12px 4px 8px" : "16px 8px 8px" }}>
            {loading ? (
              <div style={{ padding: "0 14px" }}>
                <Skeleton h={isMobile ? 160 : 220} />
              </div>
            ) : chartData.length ? (
              <ResponsiveContainer width="100%" height={isMobile ? 160 : 220}>
                <BarChart data={chartData} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.forestSurface2} vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: isMobile ? 9 : 11, fill: C.textMuted }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: isMobile ? 9 : 11, fill: C.textMuted }}
                    axisLine={false} tickLine={false}
                    tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
                    width={isMobile ? 34 : 48}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="revenue" name="Revenue" fill={C.greenGlow} radius={[3,3,0,0]} maxBarSize={isMobile ? 14 : 28} />
                  <Bar dataKey="expenses" name="Expenses" fill="#E88080" radius={[3,3,0,0]} maxBarSize={isMobile ? 14 : 28} />
                  <Bar dataKey="profit" name="Profit" fill={C.goldLight} radius={[3,3,0,0]} maxBarSize={isMobile ? 14 : 28} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{
                height: isMobile ? 160 : 220,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                <div style={{ fontSize: 32 }}>📊</div>
                <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center" }}>
                  No financial data yet. Log expenses and sales to see your chart.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Vaccines */}
        <div style={{
          background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
          borderRadius: 14, overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{
            padding: "12px 18px",
            background: C.forestSurface2,
            borderBottom: `1px solid ${C.forestBorder}`,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>
              💉 Vaccinations
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
              Next 7 days
            </div>
          </div>
          <div style={{ padding: "4px 18px", flex: 1, overflowY: "auto" }}>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 14 }}>
                {[1, 2, 3].map((i) => <Skeleton key={i} h={48} />)}
              </div>
            ) : d?.upcomingVaccines?.length ? (
              d.upcomingVaccines.map((v, i) => {
                const isOverdue = !v.isDone && new Date(v.scheduledDate) < new Date();
                const days = v.daysUntil;
                const badgeColor = isOverdue ? "red" : days <= 1 ? "amber" : "green";
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "12px 0",
                    borderBottom: `1px solid ${C.forestBorder}`,
                  }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                      background: isOverdue ? C.redFaint : C.amberFaint,
                      border: `1px solid ${isOverdue ? "#7B1F1F" : "#7A4A10"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 15,
                    }}>
                      💉
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 12, fontWeight: 600, color: C.textPrimary,
                        marginBottom: 2, whiteSpace: "nowrap",
                        overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {v.vaccineName}
                      </div>
                      <div style={{ fontSize: 10, color: C.textMuted }}>{v.batchName}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <Badge color={badgeColor}>
                        {isOverdue ? "Overdue" : days === 0 ? "Today" : days === 1 ? "Tmrw" : `${days}d`}
                      </Badge>
                      <div style={{ fontSize: 10, color: C.textMuted, marginTop: 3 }}>
                        {new Date(v.scheduledDate).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: "28px 0", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
                <p style={{ fontSize: 13, color: C.textMuted }}>No vaccines due this week.</p>
              </div>
            )}
          </div>
          <div style={{ padding: "12px 18px", borderTop: `1px solid ${C.forestBorder}` }}>
            <Link href="/dashboard/health" style={{
              fontSize: 12, fontWeight: 600, color: C.greenGlow, textDecoration: "none",
            }}>
              View all vaccinations →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Batch Profit Chart ── */}
      {batchChart.length > 0 && (
        <div style={{
          background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
          borderRadius: 14, overflow: "hidden",
          marginBottom: isMobile ? 14 : 24,
        }}>
          <div style={{
            padding: "12px 18px",
            background: C.forestSurface2,
            borderBottom: `1px solid ${C.forestBorder}`,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>
              Batch Profit Comparison
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
              All time — ranked by profit
            </div>
          </div>
          <div style={{ padding: isMobile ? "12px 4px 8px" : "16px 8px 8px" }}>
            <ResponsiveContainer width="100%" height={Math.max(batchChart.length * 44, 120)}>
              <BarChart data={batchChart} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={C.forestSurface2} horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: isMobile ? 9 : 10, fill: C.textMuted }}
                  axisLine={false} tickLine={false}
                  tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category" dataKey="batchName"
                  tick={{ fontSize: isMobile ? 10 : 11, fill: C.textMuted }}
                  axisLine={false} tickLine={false}
                  width={isMobile ? 80 : 120}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="profit" name="Profit"
                  radius={[0, 4, 4, 0]} maxBarSize={20}
                  fill={C.greenGlow}
                  label={!isMobile ? {
                    position: "right", fontSize: 10,
                    fill: C.textMuted, formatter: (v) => fmt(v),
                  } : false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Active Batches Table (desktop) / Cards (mobile) ── */}
      <div style={{
        background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
        borderRadius: 14, overflow: "hidden",
        marginBottom: isMobile ? 14 : 24,
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 18px",
          background: C.forestSurface2,
          borderBottom: `1px solid ${C.forestBorder}`,
          flexWrap: "wrap", gap: 8,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>
              Active Batches
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
              {loading ? "..." : `${d?.summary?.activeBatches || 0} currently running`}
            </div>
          </div>
          <Link href="/dashboard/batches" style={{
            fontSize: 12, fontWeight: 600, color: C.greenGlow,
            textDecoration: "none", padding: "6px 12px",
            border: `1px solid ${C.forestBorder}`, borderRadius: 7,
            background: C.forestSurface,
          }}>
            View All
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => <Skeleton key={i} h={52} />)}
          </div>
        ) : d?.activeBatches?.length ? (
          isMobile ? (
            /* Mobile: card list */
            <div style={{ padding: "6px 14px" }}>
              {d.activeBatches.map((batch, i) => {
                const mort = parseFloat(batch.mortalityRate || 0);
                const breedColor = { broiler: "green", layer: "blue", cockerel: "amber" };
                const statusColor = mort > 3 ? "red" : "green";
                return (
                  <Link
                    key={batch._id || i}
                    href={`/dashboard/batches/${batch._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div style={{
                      padding: "12px 0",
                      borderBottom: i < d.activeBatches.length - 1
                        ? `1px solid ${C.forestBorder}` : "none",
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between", gap: 10,
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 13, fontWeight: 600, color: C.textPrimary,
                          marginBottom: 4,
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                          {batch.name}
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                          <Badge color={breedColor[batch.breed] || "green"}>
                            {batch.breed?.charAt(0).toUpperCase() + batch.breed?.slice(1)}
                          </Badge>
                          <span style={{ fontSize: 11, color: C.textMuted }}>
                            Day {batch.daysAlive}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{
                          fontSize: 13, fontWeight: 700,
                          color: mort > 3 ? "#E88080" : C.greenGlow,
                          marginBottom: 3,
                        }}>
                          {mort}% mort.
                        </div>
                        <Badge color={statusColor}>
                          {mort > 3 ? "● Critical" : "● Active"}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Desktop: full table */
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                <thead>
                  <tr style={{ background: C.forestSurface2 }}>
                    {["Batch", "Breed", "Day / Week", "Mortality", "Status", ""].map((h, i) => (
                      <th key={i} style={{
                        padding: "11px 20px", textAlign: "left",
                        fontSize: 10, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: 1.5,
                        color: C.textMuted, borderBottom: `1px solid ${C.forestBorder}`,
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.activeBatches.map((batch, i) => {
                    const mort = parseFloat(batch.mortalityRate || 0);
                    const breedColor = { broiler: "green", layer: "blue", cockerel: "amber" };
                    const statusColor = batch.status === "active"
                      ? mort > 3 ? "red" : "green"
                      : batch.status === "completed" ? "muted" : "blue";
                    return (
                      <tr key={batch._id || i}>
                        <td style={{ padding: "14px 20px" }}>
                          <Link href={`/dashboard/batches/${batch._id}`} style={{ textDecoration: "none" }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 2 }}>
                              {batch.name}
                            </div>
                            <div style={{ fontSize: 11, color: C.textMuted }}>
                              Started {new Date(batch.startDate).toLocaleDateString("en-GB", {
                                day: "numeric", month: "short", year: "numeric",
                              })}
                            </div>
                          </Link>
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <Badge color={breedColor[batch.breed] || "green"}>
                            {batch.breed?.charAt(0).toUpperCase() + batch.breed?.slice(1)}
                          </Badge>
                        </td>
                        <td style={{ padding: "14px 20px", color: C.textSecondary, fontSize: 13 }}>
                          Day {batch.daysAlive} · Wk {batch.currentWeek}
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: mort > 3 ? "#E88080" : C.greenGlow }}>
                              {mort}%
                            </span>
                            <div style={{ width: 60, height: 4, background: C.forestSurface2, borderRadius: 100, overflow: "hidden" }}>
                              <div style={{
                                height: "100%", borderRadius: 100,
                                width: `${Math.min(mort * 10, 100)}%`,
                                background: mort > 3 ? C.redLight : C.green,
                              }} />
                            </div>
                          </div>
                          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                            {fmtNum(batch.currentAlive)} alive
                          </div>
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <Badge color={statusColor}>
                            {batch.status === "active" && mort > 3
                              ? "● Critical"
                              : "● " + (batch.status?.charAt(0).toUpperCase() + batch.status?.slice(1))}
                          </Badge>
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <Link href={`/dashboard/batches/${batch._id}`} style={{
                            fontSize: 12, fontWeight: 600, color: C.greenGlow,
                            textDecoration: "none", padding: "6px 12px",
                            border: `1px solid ${C.forestBorder}`, borderRadius: 6,
                            background: C.forestSurface2,
                          }}>
                            View →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🐔</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>
              No active batches yet
            </p>
            <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>
              Create your first batch to start tracking your flock.
            </p>
            <Link href="/dashboard/batches/new" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "11px 22px", borderRadius: 8,
              fontSize: 13, fontWeight: 700,
              background: `linear-gradient(135deg,${C.green},${C.greenLight})`,
              color: "#fff", textDecoration: "none",
              boxShadow: "0 4px 14px rgba(45,122,58,0.35)",
            }}>
              + Create First Batch
            </Link>
          </div>
        )}
      </div>

      {/* ── Quick Actions ── */}
      <div style={{
        background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
        borderRadius: 14, overflow: "hidden",
        marginBottom: isMobile ? 14 : 20,
      }}>
        <div style={{
          padding: "12px 18px",
          background: C.forestSurface2,
          borderBottom: `1px solid ${C.forestBorder}`,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>
            Quick Actions
          </div>
        </div>
        <div style={{
          padding: "14px",
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(3,1fr)" : "repeat(5,1fr)",
          gap: 8,
        }}>
          {[
            { icon: "🐔", label: "New Batch", href: "/dashboard/batches/new" },
            { icon: "🌾", label: "Log Feed", href: "/dashboard/feed" },
            { icon: "💉", label: "Health", href: "/dashboard/health" },
            { icon: "💰", label: "Expense", href: "/dashboard/finance" },
            { icon: "📊", label: "Analytics", href: "/dashboard/analytics" },
          ].map((action, i) => (
            <Link
              key={i}
              href={action.href}
              style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 6,
                padding: isMobile ? "12px 8px" : "16px 12px",
                borderRadius: 10, textDecoration: "none",
                background: C.forestSurface2, border: `1px solid ${C.forestBorder}`,
                transition: "all 0.15s",
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
              <span style={{ fontSize: isMobile ? 20 : 24 }}>{action.icon}</span>
              <span style={{ fontSize: isMobile ? 11 : 12, fontWeight: 600, color: C.textSecondary, textAlign: "center" }}>
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── All Time Finance Summary ── */}
      {d?.finance?.allTime && (
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
          gap: isMobile ? 10 : 14,
        }}>
          {[
            { label: "All Time Revenue", value: fmt(d.finance.allTime.revenue), color: C.greenGlow, bar: `linear-gradient(90deg,${C.green},${C.greenLight})` },
            { label: "All Time Expenses", value: fmt(d.finance.allTime.expenses), color: "#E88080", bar: `linear-gradient(90deg,${C.red},${C.redLight})` },
            {
              label: "All Time Profit",
              value: fmt(d.finance.allTime.profit),
              color: d.finance.allTime.isProfit ? C.greenGlow : "#E88080",
              bar: d.finance.allTime.isProfit
                ? `linear-gradient(90deg,${C.green},${C.greenLight})`
                : `linear-gradient(90deg,${C.red},${C.redLight})`,
            },
          ].map((item, i) => (
            <div key={i} style={{
              background: C.forestSurface, border: `1px solid ${C.forestBorder}`,
              borderRadius: 12, padding: "16px 18px",
              position: "relative", overflow: "hidden",
              textAlign: "center",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: item.bar,
              }} />
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
                textTransform: "uppercase", color: C.textMuted, marginBottom: 8,
              }}>
                {item.label}
              </div>
              <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: item.color }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        table tbody tr:hover { background: ${C.forestSurface2} !important; }
      `}</style>
    </div>
  );
}