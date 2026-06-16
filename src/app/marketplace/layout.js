"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "../../../lib/api";
import { useIsMobile } from "@/hooks/useMediaQuery";

const C = {
  creamBg: "#FAF7F2",
  creamSurface: "#F5F0E8",
  creamBorder: "#E8DFD0",
  creamText: "#2C2416",
  creamMuted: "#8A7560",
  green: "#2D7A3A",
  greenLight: "#3D9E4D",
  greenGlow: "#6FCF7F",
  greenFaint: "#1A3D22",
  gold: "#C9A84C",
};

const CATEGORIES = [
  { key: "", label: "All", emoji: "🏪" },
  { key: "live_birds", label: "Live Birds", emoji: "🐔" },
  { key: "day_old_chicks", label: "Chicks", emoji: "🐣" },
  { key: "eggs", label: "Eggs", emoji: "🥚" },
  { key: "feed", label: "Feed", emoji: "🌾" },
  { key: "medication", label: "Meds", emoji: "💊" },
  { key: "equipment", label: "Equipment", emoji: "🏠" },
  { key: "raw_materials", label: "Raw Materials", emoji: "🌽" },
];

export default function MarketplaceLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileNav(false);
  }, [pathname]);

  useEffect(() => {
    if (user)
      api
        .get("/chat/unread")
        .then((res) => setUnread(res.data.count || 0))
        .catch(() => {});
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim())
      router.push(`/marketplace?search=${encodeURIComponent(search.trim())}`);
  };

  const isActive = (href) =>
    pathname === href || pathname.startsWith(href + "/");

  const navLinks = [
    { href: "/marketplace/orders", label: "📦 Orders" },
    { href: "/marketplace/messages", label: "💬 Messages", badge: unread },
    { href: "/marketplace/store", label: "🏪 My Store" },
    { href: "/dashboard", label: "🌾 Farm" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.creamBg,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ══ NAV ══ */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled ? "rgba(250,247,242,0.97)" : C.creamBg,
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: `1px solid ${C.creamBorder}`,
        }}
      >
        {/* Top row */}
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: isMobile ? "0 12px" : "0 24px",
            height: isMobile ? 54 : 64,
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 10 : 20,
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
                width: isMobile ? 30 : 34,
                height: isMobile ? 30 : 34,
                borderRadius: 8,
                background: `linear-gradient(135deg, ${C.green}, #4CAF5C)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isMobile ? 15 : 18,
              }}
            >
              🐔
            </div>
            {!isMobile && (
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
                    fontSize: 8,
                    fontWeight: 600,
                    color: C.creamMuted,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                  }}
                >
                  Marketplace
                </div>
              </div>
            )}
          </Link>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            style={{ flex: 1, maxWidth: isMobile ? "none" : 500 }}
          >
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 14,
                  color: C.creamMuted,
                  pointerEvents: "none",
                }}
              >
                🔍
              </span>
              <input
                type="text"
                placeholder={
                  isMobile ? "Search..." : "Search birds, eggs, feed..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: isMobile
                    ? "8px 10px 8px 34px"
                    : "10px 14px 10px 38px",
                  background: C.creamSurface,
                  border: `1.5px solid ${C.creamBorder}`,
                  borderRadius: 9,
                  fontSize: 13,
                  color: C.creamText,
                  fontFamily: "Inter, sans-serif",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </form>

          {/* Desktop nav links */}
          {!isMobile && user && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexShrink: 0,
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    position: "relative",
                    padding: "8px 12px",
                    borderRadius: 7,
                    fontSize: 12,
                    fontWeight: 600,
                    color: isActive(link.href) ? C.green : C.creamMuted,
                    textDecoration: "none",
                    background: isActive(link.href)
                      ? C.creamSurface
                      : "transparent",
                  }}
                >
                  {link.label}
                  {link.badge > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: "#C0392B",
                        color: "#fff",
                        fontSize: 8,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {link.badge > 9 ? "9+" : link.badge}
                    </span>
                  )}
                </Link>
              ))}

              {/* Avatar */}
              <div style={{ position: "relative" }}>
                <div
                  onClick={() => setMenuOpen((p) => !p)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${C.green}, ${C.gold})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
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
                        top: 42,
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
                          padding: "10px 14px",
                          borderBottom: `1px solid ${C.creamBorder}`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: C.creamText,
                          }}
                        >
                          {user?.name}
                        </div>
                        <div style={{ fontSize: 10, color: C.creamMuted }}>
                          {user?.email}
                        </div>
                      </div>
                      {[
                        { label: "👤 Profile", href: "/dashboard/settings" },
                        { label: "🏪 My Store", href: "/marketplace/store" },
                        { label: "🌾 Farm App", href: "/dashboard" },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          style={{
                            display: "block",
                            padding: "10px 14px",
                            fontSize: 12,
                            color: C.creamText,
                            textDecoration: "none",
                          }}
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
                          padding: "10px 14px",
                          fontSize: 12,
                          color: "#C0392B",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Mobile: hamburger + login */}
          {isMobile && (
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {user ? (
                <button
                  onClick={() => setMobileNav((p) => !p)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: C.creamSurface,
                    border: `1px solid ${C.creamBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: 16,
                    position: "relative",
                  }}
                >
                  ☰
                  {unread > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: -3,
                        right: -3,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: "#C0392B",
                        border: "2px solid #FAF7F2",
                      }}
                    />
                  )}
                </button>
              ) : (
                <Link
                  href="/login"
                  style={{
                    padding: "7px 14px",
                    borderRadius: 7,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#fff",
                    textDecoration: "none",
                    background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                  }}
                >
                  Sign In
                </Link>
              )}
            </div>
          )}

          {/* Desktop: Sign in buttons when not logged in */}
          {!isMobile && !user && (
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <Link
                href="/login"
                style={{
                  padding: "8px 16px",
                  borderRadius: 7,
                  fontSize: 12,
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
                  padding: "8px 16px",
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                  textDecoration: "none",
                  background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Category bar — horizontal scroll on mobile */}
        <div
          style={{
            borderTop: `1px solid ${C.creamBorder}`,
            background: "#fff",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: isMobile ? "0 8px" : "0 24px",
              display: "flex",
              gap: 0,
              whiteSpace: "nowrap",
            }}
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={
                  cat.key ? `/marketplace?category=${cat.key}` : "/marketplace"
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: isMobile ? "8px 10px" : "10px 14px",
                  fontSize: isMobile ? 11 : 12,
                  fontWeight: 500,
                  color: C.creamMuted,
                  textDecoration: "none",
                  borderBottom: "2px solid transparent",
                  flexShrink: 0,
                }}
              >
                <span>{cat.emoji}</span> {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {isMobile && mobileNav && user && (
          <>
            <div
              style={{ position: "fixed", inset: 0, zIndex: 98 }}
              onClick={() => setMobileNav(false)}
            />
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 99,
                background: "#fff",
                borderBottom: `1px solid ${C.creamBorder}`,
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileNav(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 20px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.creamText,
                    textDecoration: "none",
                    borderBottom: `1px solid ${C.creamBorder}`,
                  }}
                >
                  <span>{link.label}</span>
                  {link.badge > 0 && (
                    <span
                      style={{
                        background: "#C0392B",
                        color: "#fff",
                        borderRadius: 100,
                        padding: "2px 8px",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
              <div
                style={{
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderBottom: `1px solid ${C.creamBorder}`,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${C.green}, ${C.gold})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
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
              </div>
              <button
                onClick={() => {
                  setMobileNav(false);
                  logout();
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "14px 20px",
                  fontSize: 14,
                  fontWeight: 600,
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
      </nav>

      {/* ══ MAIN ══ */}
      <main
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: isMobile ? "16px 12px" : "24px",
        }}
      >
        {children}
      </main>

      {/* ══ FOOTER ══ */}
      <footer
        style={{
          borderTop: `1px solid ${C.creamBorder}`,
          background: C.creamSurface,
          padding: isMobile ? "16px 12px" : "24px",
          marginTop: 48,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: 15,
              fontWeight: 700,
              color: C.creamText,
            }}
          >
            Chicken<span style={{ color: C.green }}>Pro</span>
          </span>
          <div style={{ fontSize: 11, color: C.creamMuted }}>
            © 2025 ChickenPro
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {["Privacy", "Terms", "Support"].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontSize: 11,
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
