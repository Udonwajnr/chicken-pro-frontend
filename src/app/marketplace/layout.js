"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "../../../lib/api";

const C = {
  creamBg: "#FAF7F2",
  creamSurface: "#F5F0E8",
  creamBorder: "#E8DFD0",
  creamText: "#2C2416",
  creamMuted: "#8A7560",
  creamHover: "#EDE5D8",
  forestBg: "#0F1F14",
  forestSurface: "#162B1C",
  forestBorder: "#234D2E",
  green: "#2D7A3A",
  greenLight: "#3D9E4D",
  greenGlow: "#6FCF7F",
  greenFaint: "#1A3D22",
  gold: "#C9A84C",
  goldLight: "#E8C76A",
  textPrimary: "#F0EBE0",
  textMuted: "#5A6B5E",
};

const CATEGORIES = [
  { key: "", label: "All Products", emoji: "🏪" },
  { key: "live_birds", label: "Live Birds", emoji: "🐔" },
  { key: "day_old_chicks", label: "Day-old Chicks", emoji: "🐣" },
  { key: "eggs", label: "Eggs", emoji: "🥚" },
  { key: "feed", label: "Feed", emoji: "🌾" },
  { key: "medication", label: "Medication", emoji: "💊" },
  { key: "equipment", label: "Equipment", emoji: "🏠" },
  { key: "raw_materials", label: "Raw Materials", emoji: "🌽" },
];

export default function MarketplaceLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (user) {
      api
        .get("/chat/unread")
        .then((res) => setUnread(res.data.count || 0))
        .catch(() => {});
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const isActive = (href) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.creamBg,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ══ TOP NAV ══ */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled ? "rgba(250,247,242,0.97)" : C.creamBg,
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: `1px solid ${C.creamBorder}`,
          transition: "all 0.3s",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* Logo */}
          <Link
            href="/marketplace"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: `linear-gradient(135deg, ${C.green}, #4CAF5C)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              🐔
            </div>
            <div>
              <div
                style={{
                  fontFamily: "Playfair Display, Georgia, serif",
                  fontSize: 17,
                  fontWeight: 700,
                  color: C.creamText,
                  lineHeight: 1,
                }}
              >
                Chicken<span style={{ color: C.green }}>Pro</span>
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: C.creamMuted,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                Marketplace
              </div>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 500 }}>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 15,
                  color: C.creamMuted,
                  pointerEvents: "none",
                }}
              >
                🔍
              </span>
              <input
                type="text"
                placeholder="Search for birds, eggs, feed, equipment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 40px",
                  background: C.creamSurface,
                  border: `1.5px solid ${C.creamBorder}`,
                  borderRadius: 10,
                  fontSize: 13,
                  color: C.creamText,
                  fontFamily: "Inter, sans-serif",
                  outline: "none",
                  transition: "all 0.15s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = C.green;
                  e.target.style.boxShadow = "0 0 0 3px rgba(45,122,58,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = C.creamBorder;
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </form>

          {/* Right actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            {user ? (
              <>
                {/* My Orders */}
                <Link
                  href="/marketplace/orders"
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    color: isActive("/marketplace/orders")
                      ? C.green
                      : C.creamMuted,
                    textDecoration: "none",
                    transition: "all 0.15s",
                    background: isActive("/marketplace/orders")
                      ? C.creamSurface
                      : "transparent",
                  }}
                >
                  📦 Orders
                </Link>

                {/* Messages */}
                <Link
                  href="/marketplace/messages"
                  style={{
                    position: "relative",
                    padding: "8px 14px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    color: isActive("/marketplace/messages")
                      ? C.green
                      : C.creamMuted,
                    textDecoration: "none",
                    background: isActive("/marketplace/messages")
                      ? C.creamSurface
                      : "transparent",
                  }}
                >
                  💬 Messages
                  {unread > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 6,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: "#C0392B",
                        color: "#fff",
                        fontSize: 9,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </Link>

                {/* My Store */}
                <Link
                  href="/marketplace/store"
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    color: isActive("/marketplace/store")
                      ? C.green
                      : C.creamMuted,
                    textDecoration: "none",
                    background: isActive("/marketplace/store")
                      ? C.creamSurface
                      : "transparent",
                  }}
                >
                  🏪 My Store
                </Link>

                {/* Switch to Farm */}
                <Link
                  href="/dashboard"
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.creamMuted,
                    textDecoration: "none",
                    border: `1px solid ${C.creamBorder}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  🌾 Farm Dashboard
                </Link>

                {/* User Avatar */}
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setMenuOpen((p) => !p)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${C.green}, ${C.gold})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
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
                          right: 0,
                          top: 44,
                          zIndex: 100,
                          background: "#fff",
                          border: `1px solid ${C.creamBorder}`,
                          borderRadius: 10,
                          overflow: "hidden",
                          minWidth: 180,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        }}
                      >
                        <div
                          style={{
                            padding: "12px 16px",
                            borderBottom: `1px solid ${C.creamBorder}`,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: C.creamText,
                            }}
                          >
                            {user?.name}
                          </div>
                          <div style={{ fontSize: 11, color: C.creamMuted }}>
                            {user?.email}
                          </div>
                        </div>
                        {[
                          { label: "👤 Profile", href: "/dashboard/settings" },
                          { label: "🏪 My Store", href: "/marketplace/store" },
                          {
                            label: "📦 My Orders",
                            href: "/marketplace/orders",
                          },
                          { label: "🌾 Farm App", href: "/dashboard" },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            style={{
                              display: "block",
                              padding: "11px 16px",
                              fontSize: 13,
                              color: C.creamText,
                              textDecoration: "none",
                              transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background =
                                C.creamSurface)
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
                            padding: "11px 16px",
                            fontSize: 13,
                            color: "#C0392B",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left",
                            fontFamily: "Inter, sans-serif",
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
                    </>
                  )}
                </div>
              </>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <Link
                  href="/login"
                  style={{
                    padding: "9px 18px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.green,
                    textDecoration: "none",
                    border: `1.5px solid ${C.green}`,
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  style={{
                    padding: "9px 18px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                    textDecoration: "none",
                    background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                    boxShadow: "0 3px 10px rgba(45,122,58,0.3)",
                  }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Category Bar */}
        <div
          style={{
            borderTop: `1px solid ${C.creamBorder}`,
            background: "#fff",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "0 24px",
              display: "flex",
              gap: 2,
            }}
          >
            {CATEGORIES.map((cat) => {
              const active = cat.key
                ? pathname === "/marketplace" &&
                  typeof window !== "undefined" &&
                  new URLSearchParams(window.location.search).get(
                    "category",
                  ) === cat.key
                : pathname === "/marketplace" &&
                  typeof window !== "undefined" &&
                  !new URLSearchParams(window.location.search).get("category");
              return (
                <Link
                  key={cat.key}
                  href={
                    cat.key
                      ? `/marketplace?category=${cat.key}`
                      : "/marketplace"
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 16px",
                    fontSize: 12,
                    fontWeight: 500,
                    color: C.creamMuted,
                    textDecoration: "none",
                    borderBottom: "2px solid transparent",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = C.green;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = C.creamMuted;
                  }}
                >
                  <span>{cat.emoji}</span> {cat.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ══ MAIN CONTENT ══ */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px" }}>
        {children}
      </main>

      {/* ══ FOOTER ══ */}
      <footer
        style={{
          borderTop: `1px solid ${C.creamBorder}`,
          background: C.creamSurface,
          padding: "24px",
          marginTop: 48,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: 16,
                fontWeight: 700,
                color: C.creamText,
              }}
            >
              Chicken<span style={{ color: C.green }}>Pro</span> Marketplace
            </span>
          </div>
          <div style={{ fontSize: 12, color: C.creamMuted }}>
            © 2025 ChickenPro. Built for Nigerian farmers.
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Terms", "Support"].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontSize: 12,
                  color: C.creamMuted,
                  textDecoration: "none",
                }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
