"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import toast from "react-hot-toast";

const inputStyle = {
  width: "100%",
  background: "#fff",
  border: "1.5px solid #E8DFD0",
  borderRadius: 8,
  padding: "13px 16px",
  fontSize: 14,
  color: "#2C2416",
  fontFamily: "Inter, sans-serif",
  outline: "none",
  transition: "all 0.15s",
  boxSizing: "border-box",
};
const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#2C2416",
  marginBottom: 6,
  letterSpacing: "0.3px",
};

const QUOTES = [
  {
    text: "Last batch I made ₦180,000 profit on 400 birds. ChickenPro showed me exactly where my money was going.",
    author: "Chukwuemeka Obi",
    role: "Broiler Farmer · Ogun State",
  },
  {
    text: "The vaccination reminder saved my flock. I once lost 60 birds to Gumboro. Never again with this app.",
    author: "Fatimah Abdullahi",
    role: "Layer Farmer · Kano",
  },
  {
    text: "I run 3 batches at once. ChickenPro tells me which batch is profitable and which to cut. Income up 40%.",
    author: "Seun Adewale",
    role: "Commercial Farmer · Lagos",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const isMobile = useIsMobile();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  const update = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.password.trim()) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      router.push(user.onboardingComplete ? "/dashboard" : "/onboarding");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
      setErrors({ general: "Invalid email or password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: isMobile ? "flex" : "grid",
        gridTemplateColumns: isMobile ? undefined : "1fr 1fr",
        flexDirection: isMobile ? "column" : undefined,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ── Left — Desktop only ── */}
      {!isMobile && (
        <div
          style={{
            background:
              "linear-gradient(160deg, #1A3D22 0%, #0F1F14 60%, #0A1409 100%)",
            padding: "48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: -60,
              right: -60,
              fontSize: 240,
              opacity: 0.04,
              pointerEvents: "none",
              lineHeight: 1,
            }}
          >
            🐔
          </div>

          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                background: "linear-gradient(135deg, #2D7A3A, #4CAF5C)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              🐔
            </div>
            <span
              style={{
                fontFamily: "Playfair Display, Georgia, serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#FAF7F2",
              }}
            >
              Chicken<span style={{ color: "#6FCF7F" }}>Pro</span>
            </span>
          </a>

          <div style={{ position: "relative", zIndex: 1 }}>
            <h1
              style={{
                fontFamily: "Playfair Display, Georgia, serif",
                fontSize: 40,
                fontWeight: 800,
                color: "#FAF7F2",
                lineHeight: 1.2,
                marginBottom: 16,
              }}
            >
              Welcome back.
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #4CAF5C, #6FCF7F)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Your farm awaits.
              </span>
            </h1>
            <p
              style={{
                fontSize: 15,
                color: "#5A6B5E",
                lineHeight: 1.7,
                marginBottom: 40,
                maxWidth: 380,
              }}
            >
              Log in to track your flocks, check vaccination schedules, and see
              today's profit.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {[
                {
                  icon: "🐔",
                  label: "Active batches",
                  value: "Track unlimited",
                },
                { icon: "💉", label: "Vaccinations", value: "Auto-scheduled" },
                {
                  icon: "💰",
                  label: "P&L tracking",
                  value: "Real-time profit",
                },
                {
                  icon: "🌾",
                  label: "Feed guide",
                  value: "Daily recommendations",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(22,43,28,0.5)",
                    border: "1px solid #1C3524",
                    borderRadius: 10,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#3D6B4A",
                        marginBottom: 2,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#A89880",
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "rgba(22,43,28,0.6)",
              border: "1px solid #1C3524",
              borderRadius: 14,
              padding: "22px 24px",
            }}
          >
            <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: "#C9A84C", fontSize: 13 }}>
                  ★
                </span>
              ))}
            </div>
            <p
              style={{
                fontSize: 14,
                color: "#A89880",
                lineHeight: 1.7,
                fontStyle: "italic",
                marginBottom: 16,
              }}
            >
              "{quote.text}"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #2D7A3A, #C9A84C)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {quote.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "#FAF7F2" }}
                >
                  {quote.author}
                </div>
                <div style={{ fontSize: 11, color: "#3D6B4A" }}>
                  {quote.role}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Right — Form ── */}
      <div
        style={{
          background: "#FAF7F2",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isMobile ? "32px 20px" : "48px 56px",
          flex: isMobile ? 1 : undefined,
        }}
      >
        <div style={{ maxWidth: 400, width: "100%", margin: "0 auto" }}>
          {/* Mobile logo */}
          {isMobile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: "linear-gradient(135deg, #2D7A3A, #4CAF5C)",
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
                  color: "#2C2416",
                }}
              >
                Chicken<span style={{ color: "#2D7A3A" }}>Pro</span>
              </span>
            </div>
          )}

          <div style={{ marginBottom: isMobile ? 24 : 36 }}>
            <h2
              style={{
                fontFamily: "Playfair Display, Georgia, serif",
                fontSize: isMobile ? 26 : 30,
                fontWeight: 700,
                color: "#2C2416",
                marginBottom: 6,
              }}
            >
              Sign in
            </h2>
            <p style={{ fontSize: 14, color: "#8A7560" }}>
              Enter your email and password to continue.
            </p>
          </div>

          {errors.general && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 8,
                marginBottom: 20,
                background: "#FFF0F0",
                border: "1px solid #E8B4B4",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13,
                color: "#C0392B",
              }}
            >
              <span>⚠️</span> {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={update("email")}
                style={{
                  ...inputStyle,
                  ...(errors.email
                    ? { borderColor: "#C0392B", background: "#FFF5F5" }
                    : {}),
                }}
              />
              {errors.email && (
                <p style={{ fontSize: 11, color: "#C0392B", marginTop: 5 }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <label style={labelStyle}>Password</label>
                <a
                  href="/forgot-password"
                  style={{
                    fontSize: 12,
                    color: "#2D7A3A",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Forgot?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={update("password")}
                  style={{
                    ...inputStyle,
                    paddingRight: 44,
                    ...(errors.password ? { borderColor: "#C0392B" } : {}),
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 16,
                    color: "#8A7560",
                  }}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <p style={{ fontSize: 11, color: "#C0392B", marginTop: 5 }}>
                  {errors.password}
                </p>
              )}
            </div>

            <div style={{ marginBottom: 28 }} />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 24px",
                borderRadius: 9,
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                background: loading
                  ? "#5A6B5E"
                  : "linear-gradient(135deg, #2D7A3A, #3D9E4D)",
                boxShadow: loading ? "none" : "0 6px 20px rgba(45,122,58,0.4)",
                fontFamily: "Inter, sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "28px 0",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#E8DFD0" }} />
            <span style={{ fontSize: 12, color: "#8A7560" }}>
              New to ChickenPro?
            </span>
            <div style={{ flex: 1, height: 1, background: "#E8DFD0" }} />
          </div>

          <a
            href="/register"
            style={{
              display: "block",
              textAlign: "center",
              padding: "13px 24px",
              borderRadius: 9,
              fontSize: 14,
              fontWeight: 600,
              color: "#2D7A3A",
              textDecoration: "none",
              border: "1.5px solid #2D7A3A",
              background: "transparent",
            }}
          >
            Create a free account
          </a>

          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#8A7560",
              marginTop: isMobile ? 20 : 32,
              lineHeight: 1.6,
            }}
          >
            Protected by industry-standard encryption.
          </p>
        </div>
      </div>
    </div>
  );
}
