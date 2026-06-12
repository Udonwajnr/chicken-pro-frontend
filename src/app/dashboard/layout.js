"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import api from "../../../lib/api";

const C = {
  forestBg: "#0F1F14",
  forestSurface: "#162B1C",
  forestSurface2: "#1C3524",
  forestBorder: "#234D2E",
  creamBg: "#FAF7F2",
  creamSurface: "#F5F0E8",
  creamBorder: "#E8DFD0",
  creamText: "#2C2416",
  creamMuted: "#8A7560",
  creamHover: "#EDE5D8",
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
  textPrimary: "#F0EBE0",
  textSecondary: "#A89880",
  textMuted: "#5A6B5E",
};

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "My Batches", href: "/dashboard/batches", icon: "🐔" },
  { label: "Feed", href: "/dashboard/feed", icon: "🌾" },
  { label: "Health", href: "/dashboard/health", icon: "💉" },
  { label: "Production", href: "/dashboard/production", icon: "🥚" },
  { label: "Finance", href: "/dashboard/finance", icon: "💰" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "📈" },
];

const NAV_BOTTOM = [
  { label: "Knowledge Hub", href: "/dashboard/knowledge", icon: "📚" },
  { label: "Marketplace", href: "/marketplace", icon: "🏪" },
  { label: "Settings", href: "/dashboard/settings", icon: "⚙️" },
];

function SidebarItem({ item, active }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={item.href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        color: active ? "#fff" : hovered ? C.creamText : C.creamMuted,
        textDecoration: "none",
        marginBottom: 2,
        transition: "all 0.15s",
        background: active
          ? `linear-gradient(135deg, ${C.green}, ${C.greenLight})`
          : hovered
            ? C.creamHover
            : "transparent",
        boxShadow: active ? "0 4px 12px rgba(45,122,58,0.3)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        style={{ fontSize: 16, width: 20, textAlign: "center", flexShrink: 0 }}
      >
        {item.icon}
      </span>
      <span>{item.label}</span>
    </Link>
  );
}

// ── Notification Bell ─────────────────────────
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch notifications when bell is clicked
  const fetchNotifications = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.get("/dashboard/overview");
      const d = res.data.dashboard;
      setAlerts(d?.alerts || []);
      setVaccines(d?.upcomingVaccines || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next) fetchNotifications();
  };

  const total = alerts.length + vaccines.length;

  const getVaccineTiming = (v) => {
    const isOverdue = !v.isDone && new Date(v.scheduledDate) < new Date();
    if (isOverdue)
      return {
        label: "Overdue",
        color: "#E88080",
        bg: C.redFaint,
        border: "#7B1F1F",
      };
    const days = v.daysUntil;
    if (days === 0)
      return {
        label: "Today",
        color: C.amberLight,
        bg: C.amberFaint,
        border: "#7A4A10",
      };
    if (days === 1)
      return {
        label: "Tomorrow",
        color: C.amberLight,
        bg: C.amberFaint,
        border: "#7A4A10",
      };
    return {
      label: `In ${days}d`,
      color: C.textMuted,
      bg: C.forestSurface2,
      border: C.forestBorder,
    };
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        style={{
          width: 38,
          height: 38,
          borderRadius: 9,
          background: open ? C.forestSurface : C.forestSurface2,
          border: `1px solid ${open ? C.green : C.forestBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: 17,
          position: "relative",
          transition: "all 0.15s",
        }}
      >
        🔔
        {/* Badge */}
        {total > 0 && (
          <div
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              minWidth: 18,
              height: 18,
              borderRadius: 100,
              background: C.red,
              border: `2px solid ${C.forestBg}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 700,
              color: "#fff",
              padding: "0 4px",
            }}
          >
            {total > 9 ? "9+" : total}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: 46,
            right: 0,
            zIndex: 200,
            width: 360,
            background: C.forestSurface,
            border: `1px solid ${C.forestBorder}`,
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 12px 36px rgba(0,0,0,0.4)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 18px",
              background: C.forestSurface2,
              borderBottom: `1px solid ${C.forestBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}
              >
                Notifications
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>
                {loading
                  ? "Refreshing..."
                  : total === 0
                    ? "All clear"
                    : `${total} item${total > 1 ? "s" : ""} need attention`}
              </div>
            </div>
            <button
              onClick={fetchNotifications}
              style={{
                padding: "5px 10px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                border: `1px solid ${C.forestBorder}`,
                background: "transparent",
                color: C.textMuted,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >
              ↻ Refresh
            </button>
          </div>

          {/* Content */}
          <div style={{ maxHeight: 420, overflowY: "auto" }}>
            {loading ? (
              <div
                style={{
                  padding: "32px",
                  textAlign: "center",
                  color: C.textMuted,
                  fontSize: 13,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    margin: "0 auto 10px",
                    border: `2px solid ${C.forestBorder}`,
                    borderTopColor: C.greenGlow,
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Loading notifications...
              </div>
            ) : (
              <>
                {/* ── Health Alerts ── */}
                {alerts.length > 0 && (
                  <div>
                    <div
                      style={{
                        padding: "10px 18px 6px",
                        fontSize: 10,
                        fontWeight: 700,
                        color: C.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                      }}
                    >
                      🚨 Health Alerts
                    </div>
                    {alerts.map((a, i) => {
                      const isRed = a.type === "HIGH_MORTALITY";
                      return (
                        <Link
                          key={i}
                          href={
                            a.batchId
                              ? `/dashboard/batches/${a.batchId}`
                              : "/dashboard/health"
                          }
                          onClick={() => setOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 12,
                            padding: "12px 18px",
                            borderBottom: `1px solid ${C.forestBorder}`,
                            textDecoration: "none",
                            background: "transparent",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              C.forestSurface2)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 8,
                              flexShrink: 0,
                              background: isRed ? C.redFaint : C.amberFaint,
                              border: `1px solid ${isRed ? "#7B1F1F" : "#7A4A10"}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 16,
                            }}
                          >
                            {isRed ? "🚨" : "⚠️"}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: isRed ? "#F0A0A0" : C.amberLight,
                                marginBottom: 2,
                                lineHeight: 1.4,
                              }}
                            >
                              {a.message}
                            </div>
                            <div style={{ fontSize: 11, color: C.textMuted }}>
                              {isRed
                                ? "High mortality — act now"
                                : "Check your health schedule"}
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: 11,
                              color: C.textMuted,
                              flexShrink: 0,
                            }}
                          >
                            →
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* ── Upcoming Vaccines ── */}
                {vaccines.length > 0 && (
                  <div>
                    <div
                      style={{
                        padding: "10px 18px 6px",
                        fontSize: 10,
                        fontWeight: 700,
                        color: C.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                      }}
                    >
                      💉 Upcoming Vaccinations
                    </div>
                    {vaccines.map((v, i) => {
                      const timing = getVaccineTiming(v);
                      return (
                        <Link
                          key={i}
                          href={
                            v.batchId
                              ? `/dashboard/batches/${v.batchId}`
                              : "/dashboard/health"
                          }
                          onClick={() => setOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "12px 18px",
                            borderBottom:
                              i < vaccines.length - 1
                                ? `1px solid ${C.forestBorder}`
                                : "none",
                            textDecoration: "none",
                            background: "transparent",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              C.forestSurface2)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 8,
                              flexShrink: 0,
                              background: timing.bg,
                              border: `1px solid ${timing.border}`,
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
                              {" · "}
                              {new Date(v.scheduledDate).toLocaleDateString(
                                "en-GB",
                                { day: "numeric", month: "short" },
                              )}
                            </div>
                          </div>
                          <span
                            style={{
                              padding: "3px 9px",
                              borderRadius: 100,
                              fontSize: 10,
                              fontWeight: 700,
                              background: timing.bg,
                              color: timing.color,
                              border: `1px solid ${timing.border}`,
                              flexShrink: 0,
                            }}
                          >
                            {timing.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* All clear */}
                {!loading && alerts.length === 0 && vaccines.length === 0 && (
                  <div style={{ padding: "40px 20px", textAlign: "center" }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: C.textPrimary,
                        marginBottom: 4,
                      }}
                    >
                      All clear!
                    </div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>
                      No health alerts or upcoming vaccines right now.
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "12px 18px",
              borderTop: `1px solid ${C.forestBorder}`,
              background: C.forestSurface2,
              display: "flex",
              gap: 10,
            }}
          >
            <Link
              href="/dashboard/health"
              onClick={() => setOpen(false)}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 0",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                color: C.greenGlow,
                textDecoration: "none",
                border: `1px solid ${C.forestBorder}`,
                background: "transparent",
              }}
            >
              View Health Page
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 0",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                color: "#fff",
                textDecoration: "none",
                background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
              }}
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// LAYOUT INNER
// ══════════════════════════════════════════════
function DashboardLayoutInner({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  const currentPage =
    [...NAV, ...NAV_BOTTOM].find((n) => isActive(n.href))?.label || "Dashboard";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ══ SIDEBAR ══ */}
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          background: C.creamBg,
          borderRight: `1px solid ${C.creamBorder}`,
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          overflowY: "auto",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: `1px solid ${C.creamBorder}`,
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                background: `linear-gradient(135deg, ${C.green}, #4CAF5C)`,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              🐔
            </div>
            <span
              style={{
                fontFamily: "Playfair Display, Georgia, serif",
                fontSize: 19,
                fontWeight: 700,
                color: C.creamText,
              }}
            >
              Chicken<span style={{ color: C.green }}>Pro</span>
            </span>
          </Link>
        </div>

        {/* Farm info */}
        <div style={{ padding: "14px 16px 10px" }}>
          <div
            style={{
              padding: "10px 12px",
              background: C.creamSurface,
              border: `1px solid ${C.creamBorder}`,
              borderRadius: 9,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: C.creamText,
                marginBottom: 1,
              }}
            >
              {user?.name || "Your Farm"}
            </div>
            <div style={{ fontSize: 11, color: C.creamMuted }}>
              📍 {user?.location || "Nigeria"}
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <nav style={{ padding: "8px 12px", flex: 1 }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 2,
              color: C.creamMuted,
              textTransform: "uppercase",
              padding: "0 4px 8px",
            }}
          >
            Farm Tools
          </div>
          {NAV.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              active={isActive(item.href)}
            />
          ))}

          <div
            style={{ height: 1, background: C.creamBorder, margin: "14px 4px" }}
          />

          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 2,
              color: C.creamMuted,
              textTransform: "uppercase",
              padding: "0 4px 8px",
            }}
          >
            More
          </div>
          {NAV_BOTTOM.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              active={isActive(item.href)}
            />
          ))}
        </nav>

        {/* User section */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: `1px solid ${C.creamBorder}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 9,
              cursor: "pointer",
              transition: "all 0.15s",
              position: "relative",
            }}
            onClick={() => setMenuOpen((p) => !p)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = C.creamHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.green}, ${C.gold})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.creamText,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: C.creamMuted,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.email}
              </div>
            </div>
            <span style={{ fontSize: 12, color: C.creamMuted }}>⌄</span>
          </div>

          {/* Dropdown */}
          {menuOpen && (
            <div
              style={{
                position: "absolute",
                bottom: 80,
                left: 16,
                right: 16,
                background: "#fff",
                border: `1px solid ${C.creamBorder}`,
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                zIndex: 100,
              }}
            >
              {[
                { label: "⚙️ Settings", href: "/dashboard/settings" },
                { label: "👤 Profile", href: "/dashboard/settings" },
                { label: "🏪 Marketplace", href: "/marketplace" },
              ].map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 16px",
                    fontSize: 13,
                    color: C.creamText,
                    textDecoration: "none",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = C.creamSurface)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div style={{ height: 1, background: C.creamBorder }} />
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: 13,
                  color: "#C0392B",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "all 0.15s",
                  textAlign: "left",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#FFF0F0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ══ TOPBAR ══ */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 240,
          right: 0,
          height: 60,
          zIndex: 40,
          background: "rgba(15,31,20,0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.forestBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: C.textMuted,
          }}
        >
          <span style={{ color: C.textMuted }}>ChickenPro</span>
          <span style={{ color: C.forestBorder }}>›</span>
          <span style={{ color: C.textPrimary, fontWeight: 500 }}>
            {currentPage}
          </span>
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Notification Bell */}
          <NotificationBell />

          {/* New Batch CTA */}
          <Link
            href="/dashboard/batches/new"
            style={{
              padding: "8px 16px",
              borderRadius: 7,
              fontSize: 12,
              fontWeight: 700,
              background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
              color: "#fff",
              textDecoration: "none",
              boxShadow: "0 3px 10px rgba(45,122,58,0.3)",
            }}
          >
            + New Batch
          </Link>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <main
        style={{
          marginLeft: 240,
          marginTop: 60,
          flex: 1,
          background: C.forestBg,
          minHeight: "calc(100vh - 60px)",
        }}
      >
        {children}
      </main>

      {/* Close sidebar menu on outside click */}
      {menuOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 30 }}
          onClick={() => setMenuOpen(false)}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </AuthGuard>
  );
}
