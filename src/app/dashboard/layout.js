"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import api from "../../../lib/api";
import { useIsMobile } from "@/hooks/useMediaQuery";

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

function SidebarItem({ item, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={item.href}
      onClick={onClick}
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
function NotificationBell({ isMobile }) {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [dismissed, setDismissed] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchNotifications = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.get("/dashboard/overview");
      const d = res.data.dashboard;
      setAlerts(d?.alerts || []);
      setVaccines(d?.upcomingVaccines || []);
      setDismissed(new Set());
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next) fetchNotifications();
  };

  const allItems = [
    ...alerts.map((a, i) => ({ ...a, _type: "alert", _key: `a${i}` })),
    ...vaccines.map((v, i) => ({ ...v, _type: "vaccine", _key: `v${i}` })),
  ].filter((x) => !dismissed.has(x._key));

  const total = allItems.length;

  return (
    <div ref={ref} style={{ position: "relative" }}>
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
        }}
      >
        🔔
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

      {open && (
        <div
          style={{
            position: "fixed",
            top: isMobile ? 56 : 54,
            right: isMobile ? 8 : 16,
            left: isMobile ? 8 : "auto",
            width: isMobile ? "auto" : 360,
            maxHeight: "80vh",
            zIndex: 300,
            background: C.forestSurface,
            border: `1px solid ${C.forestBorder}`,
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
          }}
        >
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
                    : `${total} item${total > 1 ? "s" : ""}`}
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
              ↻
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              maxHeight: isMobile ? "60vh" : 420,
            }}
          >
            {loading ? (
              <div
                style={{
                  padding: 32,
                  textAlign: "center",
                  color: C.textMuted,
                  fontSize: 13,
                }}
              >
                Loading...
              </div>
            ) : allItems.length > 0 ? (
              allItems.map((item) => {
                const isAlert = item._type === "alert";
                const isRed = isAlert && item.type === "HIGH_MORTALITY";
                const isOverdue =
                  !isAlert &&
                  !item.isDone &&
                  new Date(item.scheduledDate) < new Date();
                const days = item.daysUntil;
                return (
                  <div
                    key={item._key}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "12px 18px",
                      borderBottom: `1px solid ${C.forestBorder}`,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        flexShrink: 0,
                        background: isAlert
                          ? isRed
                            ? C.redFaint
                            : C.amberFaint
                          : isOverdue
                            ? C.redFaint
                            : C.amberFaint,
                        border: `1px solid ${isRed || isOverdue ? "#7B1F1F" : "#7A4A10"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                      }}
                    >
                      {isAlert ? (isRed ? "🚨" : "⚠️") : "💉"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: C.textPrimary,
                          lineHeight: 1.4,
                          marginBottom: 2,
                        }}
                      >
                        {isAlert ? item.message : item.vaccineName}
                      </div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>
                        {isAlert
                          ? "Health alert"
                          : `${item.batchName} · ${new Date(item.scheduledDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setDismissed((p) => new Set([...p, item._key]))
                      }
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: "rgba(255,255,255,0.06)",
                        border: "none",
                        color: C.textMuted,
                        cursor: "pointer",
                        fontSize: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.textPrimary,
                  }}
                >
                  All clear!
                </div>
                <div style={{ fontSize: 12, color: C.textMuted }}>
                  No alerts or upcoming vaccines.
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              padding: "10px 18px",
              borderTop: `1px solid ${C.forestBorder}`,
              background: C.forestSurface2,
              textAlign: "center",
            }}
          >
            <Link
              href="/dashboard/health"
              onClick={() => setOpen(false)}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: C.greenGlow,
                textDecoration: "none",
              }}
            >
              View Health Page →
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
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  const currentPage =
    [...NAV, ...NAV_BOTTOM].find((n) => isActive(n.href))?.label || "Dashboard";

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const sidebarWidth = isMobile ? 260 : 240;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ══ MOBILE OVERLAY ══ */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* ══ SIDEBAR ══ */}
      <aside
        style={{
          width: sidebarWidth,
          flexShrink: 0,
          background: C.creamBg,
          borderRight: `1px solid ${C.creamBorder}`,
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 70,
          overflowY: "auto",
          transform: isMobile
            ? sidebarOpen
              ? "translateX(0)"
              : `translateX(-${sidebarWidth}px)`
            : "translateX(0)",
          transition: "transform 0.3s ease",
        }}
      >
        {/* Logo row */}
        <div
          style={{
            padding: "16px 16px 12px",
            borderBottom: `1px solid ${C.creamBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
                width: 32,
                height: 32,
                background: `linear-gradient(135deg, ${C.green}, #4CAF5C)`,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              🐔
            </div>
            <span
              style={{
                fontFamily: "Playfair Display, Georgia, serif",
                fontSize: 18,
                fontWeight: 700,
                color: C.creamText,
              }}
            >
              Chicken<span style={{ color: C.green }}>Pro</span>
            </span>
          </Link>
          {/* Close button on mobile */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                width: 30,
                height: 30,
                borderRadius: 7,
                background: C.creamSurface,
                border: `1px solid ${C.creamBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 16,
                color: C.creamMuted,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Farm info */}
        <div style={{ padding: "12px 12px 8px" }}>
          <div
            style={{
              padding: "8px 10px",
              background: C.creamSurface,
              border: `1px solid ${C.creamBorder}`,
              borderRadius: 8,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: C.creamText }}>
              {user?.name || "Your Farm"}
            </div>
            <div style={{ fontSize: 10, color: C.creamMuted }}>
              📍 {user?.location || "Nigeria"}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "6px 10px", flex: 1 }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 2,
              color: C.creamMuted,
              textTransform: "uppercase",
              padding: "0 4px 6px",
            }}
          >
            Farm Tools
          </div>
          {NAV.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              active={isActive(item.href)}
              onClick={() => isMobile && setSidebarOpen(false)}
            />
          ))}
          <div
            style={{ height: 1, background: C.creamBorder, margin: "12px 4px" }}
          />
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 2,
              color: C.creamMuted,
              textTransform: "uppercase",
              padding: "0 4px 6px",
            }}
          >
            More
          </div>
          {NAV_BOTTOM.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              active={isActive(item.href)}
              onClick={() => isMobile && setSidebarOpen(false)}
            />
          ))}
        </nav>

        {/* User */}
        <div
          style={{
            padding: "10px 12px",
            borderTop: `1px solid ${C.creamBorder}`,
            position: "relative",
          }}
        >
          <div
            onClick={() => setMenuOpen((p) => !p)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              borderRadius: 8,
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = C.creamHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.green}, ${C.gold})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
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
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.creamText,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: C.creamMuted,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.email}
              </div>
            </div>
            <span style={{ fontSize: 11, color: C.creamMuted }}>⌄</span>
          </div>

          {menuOpen && (
            <>
              <div
                style={{ position: "fixed", inset: 0, zIndex: 99 }}
                onClick={() => setMenuOpen(false)}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 60,
                  left: 8,
                  right: 8,
                  zIndex: 100,
                  background: "#fff",
                  border: `1px solid ${C.creamBorder}`,
                  borderRadius: 10,
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                }}
              >
                {[
                  { label: "⚙️ Settings", href: "/dashboard/settings" },
                  { label: "🏪 Marketplace", href: "/marketplace" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      setMenuOpen(false);
                      isMobile && setSidebarOpen(false);
                    }}
                    style={{
                      display: "block",
                      padding: "11px 14px",
                      fontSize: 13,
                      color: C.creamText,
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = C.creamSurface)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
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
                    display: "block",
                    width: "100%",
                    padding: "11px 14px",
                    fontSize: 13,
                    color: "#C0392B",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    textAlign: "left",
                  }}
                >
                  🚪 Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* ══ TOPBAR ══ */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: isMobile ? 0 : sidebarWidth,
          right: 0,
          height: isMobile ? 54 : 60,
          zIndex: 40,
          background: "rgba(15,31,20,0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.forestBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "0 12px" : "0 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Hamburger (mobile only) */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: C.forestSurface2,
                border: `1px solid ${C.forestBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 18,
                color: C.textPrimary,
              }}
            >
              ☰
            </button>
          )}
          <div style={{ fontSize: 13, color: C.textMuted }}>
            {isMobile ? (
              <span style={{ color: C.textPrimary, fontWeight: 600 }}>
                {currentPage}
              </span>
            ) : (
              <>
                <span>ChickenPro</span>
                <span style={{ margin: "0 6px", color: C.forestBorder }}>
                  ›
                </span>
                <span style={{ color: C.textPrimary, fontWeight: 500 }}>
                  {currentPage}
                </span>
              </>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <NotificationBell isMobile={isMobile} />
          {!isMobile && (
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
          )}
        </div>
      </div>

      {/* ══ MAIN ══ */}
      <main
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
          marginTop: isMobile ? 54 : 60,
          flex: 1,
          background: C.forestBg,
          minHeight: isMobile ? "calc(100vh - 54px)" : "calc(100vh - 60px)",
          padding: isMobile ? "0" : undefined,
        }}
      >
        <div style={{ padding: isMobile ? "16px 14px" : undefined }}>
          {children}
        </div>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
