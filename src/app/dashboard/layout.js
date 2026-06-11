"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";

const C = {
  forestBg: "#0F1F14",
  forestSurface: "#162B1C",
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
  textPrimary: "#F0EBE0",
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
  { label: "Marketplace", href: "/dashboard/marketplace", icon: "🏪" },
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

function DashboardLayoutInner({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ══ SIDEBAR — Cream ══ */}
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
            {/* Avatar */}
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
              <Link
                href="/dashboard/settings"
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
                <span>⚙️</span> Settings
              </Link>
              <Link
                href="/dashboard/settings"
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
                <span>👤</span> Profile
              </Link>
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
                <span>🚪</span> Sign Out
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
          background: "rgba(15,31,20,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.forestBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
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
          <span>ChickenPro</span>
          <span>›</span>
          <span style={{ color: C.textPrimary, fontWeight: 500 }}>
            {NAV.concat(NAV_BOTTOM).find((n) => isActive(n.href))?.label ||
              "Dashboard"}
          </span>
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Notification bell */}
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: C.forestSurface,
              border: `1px solid ${C.forestBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 16,
              position: "relative",
            }}
          >
            🔔
            {/* Red dot if alerts */}
            <div
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#E74C3C",
                border: `1.5px solid ${C.forestBg}`,
              }}
            />
          </button>

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

      {/* Close menu on outside click */}
      {menuOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 30 }}
          onClick={() => setMenuOpen(false)}
        />
      )}
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
