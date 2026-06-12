"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "../../../lib/api";
import Link from "next/link";
import {
  BarChart,
  Bar,
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
  creamBg: "#FAF7F2",
  creamBorder: "#E8DFD0",
  creamText: "#2C2416",
  creamMuted: "#8A7560",
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

function Skeleton({ w = "100%", h = 20, radius = 6 }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        background: `linear-gradient(90deg, ${C.forestSurface} 25%, ${C.forestSurface2} 50%, ${C.forestSurface} 75%)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  subColor,
  accent = "green",
  loading,
}) {
  const accents = {
    green: {
      bar: `linear-gradient(90deg, ${C.green}, ${C.greenLight})`,
      val: C.greenGlow,
    },
    gold: {
      bar: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`,
      val: C.goldLight,
    },
    red: {
      bar: `linear-gradient(90deg, ${C.red}, ${C.redLight})`,
      val: "#E88080",
    },
    blue: {
      bar: `linear-gradient(90deg, ${C.blue}, ${C.blueLight})`,
      val: C.blueLight,
    },
  };
  const a = accents[accent] || accents.green;
  return (
    <div
      style={{
        background: C.forestSurface,
        border: `1px solid ${C.forestBorder}`,
        borderRadius: 14,
        padding: "20px 22px",
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
          background: a.bar,
        }}
      />
      <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: C.textMuted,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      {loading ? (
        <Skeleton h={32} w="60%" radius={6} />
      ) : (
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: a.val,
            lineHeight: 1,
            marginBottom: 4,
          }}
        >
          {value}
        </div>
      )}
      {sub && !loading && (
        <div
          style={{ fontSize: 12, color: subColor || C.textMuted, marginTop: 4 }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function Badge({ children, color = "green" }) {
  const styles = {
    green: { bg: C.greenFaint, text: C.greenGlow, border: C.green },
    red: { bg: C.redFaint, text: "#E88080", border: "#7B1F1F" },
    amber: { bg: C.amberFaint, text: C.amberLight, border: "#7A4A10" },
    gold: { bg: C.goldFaint, text: C.goldLight, border: C.gold },
    muted: {
      bg: C.forestSurface2,
      text: C.textSecondary,
      border: C.forestBorder,
    },
    blue: { bg: "rgba(36,113,163,0.15)", text: C.blueLight, border: "#1A4A6A" },
  };
  const s = styles[color] || styles.green;
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

function BatchRow({ batch }) {
  const mortality = parseFloat(batch.mortalityRate || 0);
  const statusColor =
    batch.status === "active"
      ? mortality > 3
        ? "red"
        : "green"
      : batch.status === "completed"
        ? "muted"
        : "blue";
  const breedColor = { broiler: "green", layer: "blue", cockerel: "amber" };

  return (
    <tr>
      <td style={{ padding: "14px 20px" }}>
        <Link
          href={`/dashboard/batches/${batch._id}`}
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: C.textPrimary,
              marginBottom: 2,
            }}
          >
            {batch.name}
          </div>
          <div style={{ fontSize: 11, color: C.textMuted }}>
            Started{" "}
            {new Date(batch.startDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </Link>
      </td>
      <td style={{ padding: "14px 20px" }}>
        <Badge color={breedColor[batch.breed] || "green"}>
          {batch.breed?.charAt(0).toUpperCase() + batch.breed?.slice(1)}
        </Badge>
      </td>
      <td
        style={{ padding: "14px 20px", color: C.textSecondary, fontSize: 13 }}
      >
        Day {batch.daysAlive} · Wk {batch.currentWeek}
      </td>
      <td style={{ padding: "14px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: mortality > 3 ? "#E88080" : C.greenGlow,
            }}
          >
            {mortality}%
          </span>
          <div
            style={{
              width: 60,
              height: 4,
              background: C.forestSurface2,
              borderRadius: 100,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 100,
                width: `${Math.min(mortality * 10, 100)}%`,
                background: mortality > 3 ? C.redLight : C.green,
              }}
            />
          </div>
        </div>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
          {fmtNum(batch.currentAlive)} alive
        </div>
      </td>
      <td style={{ padding: "14px 20px" }}>
        <Badge color={statusColor}>
          {batch.status === "active" && mortality > 3
            ? "● Critical"
            : "● " +
              (batch.status?.charAt(0).toUpperCase() + batch.status?.slice(1))}
        </Badge>
      </td>
      <td style={{ padding: "14px 20px" }}>
        <Link
          href={`/dashboard/batches/${batch._id}`}
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: C.greenGlow,
            textDecoration: "none",
            padding: "6px 12px",
            border: `1px solid ${C.forestBorder}`,
            borderRadius: 6,
            background: C.forestSurface2,
          }}
        >
          View →
        </Link>
      </td>
    </tr>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: C.forestSurface,
        border: `1px solid ${C.forestBorder}`,
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 12,
      }}
    >
      <div style={{ color: C.textSecondary, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}:{" "}
          {["Revenue", "Expenses", "Profit"].includes(p.name)
            ? fmt(p.value)
            : p.value}
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [batchChart, setBatchChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

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

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "Playfair Display, Georgia, serif",
              fontSize: 28,
              fontWeight: 700,
              color: C.textPrimary,
              marginBottom: 4,
            }}
          >
            {timeOfDay()}, {firstName} 👋
          </h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {d?.summary?.activeBatches > 0 &&
              ` · ${d.summary.activeBatches} active batch${d.summary.activeBatches > 1 ? "es" : ""}`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={fetchAll}
            style={{
              padding: "9px 16px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              border: `1px solid ${C.forestBorder}`,
              background: C.forestSurface2,
              color: C.textSecondary,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            ↻ Refresh
          </button>
          <Link
            href="/dashboard/batches/new"
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
              color: "#fff",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(45,122,58,0.35)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            + New Batch
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <StatCard
          icon="🐔"
          label="Active Batches"
          value={loading ? "" : fmtNum(d?.summary?.activeBatches)}
          sub={
            loading ? "" : `${fmtNum(d?.summary?.totalBatches)} total batches`
          }
          accent="green"
          loading={loading}
        />
        <StatCard
          icon="🐣"
          label="Live Birds"
          value={loading ? "" : fmtNum(d?.summary?.totalLiveBirds)}
          sub={loading ? "" : `of ${fmtNum(d?.summary?.totalBirds)} started`}
          accent="blue"
          loading={loading}
        />
        <StatCard
          icon="💰"
          label="This Month Revenue"
          value={loading ? "" : fmt(d?.finance?.thisMonth?.revenue)}
          sub={
            loading
              ? ""
              : `${d?.finance?.thisMonth?.isProfit ? "↑" : "↓"} ${fmt(Math.abs(d?.finance?.thisMonth?.profit || 0))} ${d?.finance?.thisMonth?.isProfit ? "profit" : "loss"}`
          }
          subColor={d?.finance?.thisMonth?.isProfit ? C.greenGlow : "#E88080"}
          accent="gold"
          loading={loading}
        />
        <StatCard
          icon="⚠️"
          label="Mortality Rate"
          value={
            loading
              ? ""
              : d?.summary?.totalBirds > 0
                ? `${(((d?.summary?.totalDeaths || 0) / d?.summary?.totalBirds) * 100).toFixed(1)}%`
                : "0%"
          }
          sub={loading ? "" : `${fmtNum(d?.summary?.totalDeaths)} total deaths`}
          subColor={
            d?.summary?.totalBirds > 0 &&
            (d?.summary?.totalDeaths / d?.summary?.totalBirds) * 100 > 3
              ? "#E88080"
              : C.greenGlow
          }
          accent={
            d?.summary?.totalBirds > 0 &&
            (d?.summary?.totalDeaths / d?.summary?.totalBirds) * 100 > 3
              ? "red"
              : "green"
          }
          loading={loading}
        />
      </div>

      {/* ── Charts + Vaccine Panel ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {/* Revenue Chart */}
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
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 22px",
              borderBottom: `1px solid ${C.forestBorder}`,
            }}
          >
            <div>
              <div
                style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}
              >
                Revenue vs Expenses
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                Last 6 months
              </div>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { label: "Revenue", color: C.greenGlow },
                { label: "Expenses", color: "#E88080" },
                { label: "Profit", color: C.goldLight },
              ].map((l) => (
                <div
                  key={l.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11,
                    color: C.textMuted,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      background: l.color,
                    }}
                  />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: "16px 8px 8px" }}>
            {loading ? (
              <div
                style={{
                  height: 220,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Skeleton w="80%" h={180} radius={8} />
              </div>
            ) : chartData.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barGap={4}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={C.forestSurface2}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: C.textMuted }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: C.textMuted }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      v >= 1000 ? `₦${(v / 1000).toFixed(0)}k` : `₦${v}`
                    }
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill={C.greenGlow}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="expenses"
                    name="Expenses"
                    fill="#E88080"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="profit"
                    name="Profit"
                    fill={C.goldLight}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: 220,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <div style={{ fontSize: 36 }}>📊</div>
                <p style={{ fontSize: 13, color: C.textMuted }}>
                  No financial data yet.
                </p>
                <p style={{ fontSize: 12, color: C.forestMuted }}>
                  Log expenses and sales to see your chart.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Vaccines — read-only panel, bell handles dismiss */}
        <div
          style={{
            background: C.forestSurface,
            border: `1px solid ${C.forestBorder}`,
            borderRadius: 14,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${C.forestBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}
              >
                💉 Vaccinations
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                Next 7 days
              </div>
            </div>
          </div>
          <div style={{ padding: "4px 20px", flex: 1, overflowY: "auto" }}>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  paddingTop: 16,
                }}
              >
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} h={48} radius={8} />
                ))}
              </div>
            ) : d?.upcomingVaccines?.length ? (
              d.upcomingVaccines.map((v, i) => {
                const isOverdue =
                  !v.isDone && new Date(v.scheduledDate) < new Date();
                const days = v.daysUntil;
                const badgeColor = isOverdue
                  ? "red"
                  : days <= 1
                    ? "amber"
                    : "green";
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 0",
                      borderBottom: `1px solid ${C.forestBorder}`,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        flexShrink: 0,
                        background: isOverdue ? C.redFaint : C.amberFaint,
                        border: `1px solid ${isOverdue ? "#7B1F1F" : "#7A4A10"}`,
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
                          fontSize: 13,
                          fontWeight: 600,
                          color: C.textPrimary,
                          marginBottom: 2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {v.vaccineName}
                      </div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>
                        {v.batchName}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <Badge color={badgeColor}>
                        {isOverdue
                          ? "Overdue"
                          : days === 0
                            ? "Today"
                            : days === 1
                              ? "Tomorrow"
                              : `In ${days}d`}
                      </Badge>
                      <div
                        style={{
                          fontSize: 10,
                          color: C.textMuted,
                          marginTop: 3,
                        }}
                      >
                        {new Date(v.scheduledDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: "32px 0", textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                <p style={{ fontSize: 13, color: C.textMuted }}>
                  No vaccines due this week.
                </p>
              </div>
            )}
          </div>
          <div
            style={{
              padding: "12px 20px",
              borderTop: `1px solid ${C.forestBorder}`,
            }}
          >
            <Link
              href="/dashboard/health"
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: C.greenGlow,
                textDecoration: "none",
              }}
            >
              View all vaccinations →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Batch Profit Chart ── */}
      {batchChart.length > 0 && (
        <div
          style={{
            background: C.forestSurface,
            border: `1px solid ${C.forestBorder}`,
            borderRadius: 14,
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              padding: "16px 22px",
              borderBottom: `1px solid ${C.forestBorder}`,
            }}
          >
            <div
              style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}
            >
              Batch Profit Comparison
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
              All time — ranked by profit
            </div>
          </div>
          <div style={{ padding: "16px 8px 8px" }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={batchChart} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={C.forestSurface2}
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: C.textMuted }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="batchName"
                  tick={{ fontSize: 11, fill: C.textMuted }}
                  axisLine={false}
                  tickLine={false}
                  width={120}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="profit"
                  name="Profit"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={20}
                  fill={C.greenGlow}
                  label={{
                    position: "right",
                    fontSize: 10,
                    fill: C.textMuted,
                    formatter: (v) => fmt(v),
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Active Batches Table ── */}
      <div
        style={{
          background: C.forestSurface,
          border: `1px solid ${C.forestBorder}`,
          borderRadius: 14,
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 22px",
            borderBottom: `1px solid ${C.forestBorder}`,
          }}
        >
          <div>
            <div
              style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}
            >
              Active Batches
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
              {loading
                ? "..."
                : `${d?.summary?.activeBatches || 0} currently running`}
            </div>
          </div>
          <Link
            href="/dashboard/batches"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: C.greenGlow,
              textDecoration: "none",
              padding: "7px 14px",
              border: `1px solid ${C.forestBorder}`,
              borderRadius: 7,
              background: C.forestSurface2,
            }}
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div
            style={{
              padding: "20px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} h={52} radius={8} />
            ))}
          </div>
        ) : d?.activeBatches?.length ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.forestSurface2 }}>
                {[
                  "Batch",
                  "Breed",
                  "Day / Week",
                  "Mortality",
                  "Status",
                  "",
                ].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "11px 20px",
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
              {d.activeBatches.map((batch, i) => (
                <BatchRow key={batch._id || i} batch={batch} />
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🐔</div>
            <p
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: C.textPrimary,
                marginBottom: 6,
              }}
            >
              No active batches yet
            </p>
            <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>
              Create your first batch to start tracking your flock.
            </p>
            <Link
              href="/dashboard/batches/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "11px 22px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                color: "#fff",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(45,122,58,0.35)",
              }}
            >
              + Create First Batch
            </Link>
          </div>
        )}
      </div>

      {/* ── Quick Actions ── */}
      <div
        style={{
          background: C.forestSurface,
          border: `1px solid ${C.forestBorder}`,
          borderRadius: 14,
          padding: "20px 22px",
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
          Quick Actions
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 10,
          }}
        >
          {[
            { icon: "🐔", label: "New Batch", href: "/dashboard/batches/new" },
            { icon: "🌾", label: "Log Feed", href: "/dashboard/feed" },
            { icon: "💉", label: "Health Check", href: "/dashboard/health" },
            { icon: "💰", label: "Log Expense", href: "/dashboard/finance" },
            {
              icon: "📊",
              label: "View Analytics",
              href: "/dashboard/analytics",
            },
          ].map((action, i) => (
            <Link
              key={i}
              href={action.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: "16px 12px",
                borderRadius: 10,
                textDecoration: "none",
                background: C.forestSurface2,
                border: `1px solid ${C.forestBorder}`,
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
              <span style={{ fontSize: 24 }}>{action.icon}</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.textSecondary,
                  textAlign: "center",
                }}
              >
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── All Time Finance Summary ── */}
      {d?.finance?.allTime && (
        <div
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {[
            {
              label: "All Time Revenue",
              value: fmt(d.finance.allTime.revenue),
              color: C.greenGlow,
            },
            {
              label: "All Time Expenses",
              value: fmt(d.finance.allTime.expenses),
              color: "#E88080",
            },
            {
              label: "All Time Profit",
              value: fmt(d.finance.allTime.profit),
              color: d.finance.allTime.isProfit ? C.greenGlow : "#E88080",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: C.forestSurface,
                border: `1px solid ${C.forestBorder}`,
                borderRadius: 12,
                padding: "18px 22px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: C.textMuted,
                  marginBottom: 8,
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: item.color }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        table tbody tr:hover { background: ${C.forestSurface2} !important; }
      `}</style>
    </div>
  );
}
