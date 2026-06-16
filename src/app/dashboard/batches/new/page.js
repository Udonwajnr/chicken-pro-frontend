"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../../../lib/api";
import toast from "react-hot-toast";

function useIsMobile() {
  const [m, s] = useState(false);
  useEffect(() => {
    const c = () => s(window.innerWidth < 768);
    c();
    window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, []);
  return m;
}

const C = {
  forestSurface: "#162B1C",
  forestSurface2: "#1C3524",
  forestBorder: "#234D2E",
  green: "#2D7A3A",
  greenLight: "#3D9E4D",
  greenGlow: "#6FCF7F",
  greenFaint: "#1A3D22",
  gold: "#C9A84C",
  textPrimary: "#F0EBE0",
  textSecondary: "#A89880",
  textMuted: "#5A6B5E",
};

const inputStyle = (focused, error) => ({
  width: "100%",
  background: C.forestSurface,
  border: `1.5px solid ${error ? "#C0392B" : focused ? C.green : C.forestBorder}`,
  borderRadius: 8,
  padding: "11px 14px",
  fontSize: 14,
  color: C.textPrimary,
  fontFamily: "Inter,sans-serif",
  outline: "none",
  transition: "all 0.15s",
  boxSizing: "border-box",
  boxShadow: focused ? "0 0 0 3px rgba(45,122,58,0.15)" : "none",
});

function Input({ label, hint, error, ...props }) {
  const [f, sF] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: C.textSecondary,
            marginBottom: 6,
          }}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        style={inputStyle(f, error)}
        onFocus={() => sF(true)}
        onBlur={() => sF(false)}
      />
      {hint && (
        <p style={{ fontSize: 11, color: C.textMuted, marginTop: 5 }}>{hint}</p>
      )}
      {error && (
        <p style={{ fontSize: 11, color: "#E88080", marginTop: 5 }}>{error}</p>
      )}
    </div>
  );
}

function Textarea({ label, hint, error, ...props }) {
  const [f, sF] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: C.textSecondary,
            marginBottom: 6,
          }}
        >
          {label}
        </label>
      )}
      <textarea
        {...props}
        style={{ ...inputStyle(f, error), resize: "vertical", minHeight: 80 }}
        onFocus={() => sF(true)}
        onBlur={() => sF(false)}
      />
      {hint && (
        <p style={{ fontSize: 11, color: C.textMuted, marginTop: 5 }}>{hint}</p>
      )}
    </div>
  );
}

const BREEDS = [
  {
    key: "broiler",
    emoji: "🐔",
    label: "Broiler",
    desc: "6-week cycle. Raised for meat.",
    cycle: "6 weeks",
    tracking: "Weight",
    tips: [
      "Buy day-old chicks from registered hatcheries",
      "Sell at exactly 6 weeks for best feed conversion",
      "Minimum 100 birds to be profitable",
    ],
  },
  {
    key: "layer",
    emoji: "🥚",
    label: "Layer",
    desc: "72-week cycle. Raised for eggs.",
    cycle: "72 weeks",
    tracking: "Egg production",
    tips: [
      "Buy sexed pullets only",
      "Do NOT give layer mash before week 18",
      "Maintain 16 hours of light per day",
    ],
  },
  {
    key: "cockerel",
    emoji: "🐓",
    label: "Cockerel",
    desc: "12-week cycle. Local chicken.",
    cycle: "12 weeks",
    tracking: "Weight",
    tips: [
      "Time batches to Christmas or Eid",
      "More disease-resistant than broilers",
      "Buyers pay premium for local taste",
    ],
  },
];

export default function NewBatchPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [form, setForm] = useState({
    name: "",
    breed: "",
    quantity: "",
    startDate: new Date().toISOString().split("T")[0],
    notes: "",
    livestockType: "chicken",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (f, v) => setForm((p) => ({ ...p, [f]: v }));
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.breed) e.breed = "Select a breed";
    if (!form.quantity) e.quantity = "Required";
    else if (parseInt(form.quantity) < 1) e.quantity = "Min 1";
    if (!form.startDate) e.startDate = "Required";
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
      const res = await api.post("/batches", {
        name: form.name,
        breed: form.breed,
        quantity: parseInt(form.quantity),
        startDate: form.startDate,
        notes: form.notes,
        livestockType: form.livestockType,
      });
      toast.success(`Batch "${form.name}" created!`);
      router.push(`/dashboard/batches/${res.data.batch._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const selectedBreed = BREEDS.find((b) => b.key === form.breed);
  const targetDate =
    form.startDate && form.breed
      ? (() => {
          const w = { broiler: 6, layer: 72, cockerel: 12 }[form.breed] || 6;
          const d = new Date(form.startDate);
          d.setDate(d.getDate() + w * 7);
          return d.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        })()
      : null;

  const vaccinePreview =
    {
      broiler: [
        { day: 7, name: "Newcastle (Lasota)", method: "Eye drop" },
        { day: 14, name: "Gumboro (IBD)", method: "Water" },
        { day: 21, name: "Newcastle Booster", method: "Water" },
        { day: 28, name: "Gumboro Booster", method: "Water" },
      ],
      layer: [
        { day: 7, name: "Newcastle (Lasota)", method: "Eye drop" },
        { day: 14, name: "Gumboro (IBD)", method: "Water" },
        { day: 42, name: "Fowl Pox", method: "Wing stab" },
        { day: 56, name: "Newcastle (Komarov)", method: "Injection" },
      ],
      cockerel: [
        { day: 7, name: "Newcastle (Lasota)", method: "Eye drop" },
        { day: 14, name: "Gumboro (IBD)", method: "Water" },
        { day: 42, name: "Fowl Pox", method: "Wing stab" },
      ],
    }[form.breed] || [];

  const pad = isMobile ? "16px 14px" : "28px 32px";

  return (
    <div style={{ padding: pad, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: isMobile ? 16 : 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <Link
            href="/dashboard/batches"
            style={{ color: C.textMuted, textDecoration: "none", fontSize: 13 }}
          >
            ← Batches
          </Link>
        </div>
        <h1
          style={{
            fontFamily: "Playfair Display,Georgia,serif",
            fontSize: isMobile ? 22 : 28,
            fontWeight: 700,
            color: C.textPrimary,
            marginBottom: 4,
          }}
        >
          Create New Batch
        </h1>
        <p style={{ fontSize: 12, color: C.textMuted }}>
          Vaccination schedule auto-generates on save.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 320px",
          gap: isMobile ? 16 : 24,
        }}
      >
        {/* Form */}
        <div>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                background: C.forestSurface,
                border: `1px solid ${C.forestBorder}`,
                borderRadius: 14,
                padding: isMobile ? "18px" : "24px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.textPrimary,
                  marginBottom: 18,
                  paddingBottom: 10,
                  borderBottom: `1px solid ${C.forestBorder}`,
                }}
              >
                📋 Basic Information
              </div>
              <Input
                label="Batch Name *"
                placeholder="e.g. Batch 1 — June 2025"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                error={errors.name}
                hint="Easy to recognise later"
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 14,
                }}
              >
                <Input
                  label="Quantity *"
                  type="number"
                  min="1"
                  placeholder="e.g. 200"
                  value={form.quantity}
                  onChange={(e) => update("quantity", e.target.value)}
                  error={errors.quantity}
                />
                <Input
                  label="Start Date *"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                  error={errors.startDate}
                />
              </div>
              <Textarea
                label="Notes (optional)"
                placeholder="Source of chicks, pen number, etc."
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
              />
            </div>

            <div
              style={{
                background: C.forestSurface,
                border: `1px solid ${C.forestBorder}`,
                borderRadius: 14,
                padding: isMobile ? "18px" : "24px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.textPrimary,
                  marginBottom: 6,
                  paddingBottom: 10,
                  borderBottom: `1px solid ${C.forestBorder}`,
                }}
              >
                🐔 Select Breed *
              </div>
              {errors.breed && (
                <p style={{ fontSize: 11, color: "#E88080", marginBottom: 10 }}>
                  {errors.breed}
                </p>
              )}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {BREEDS.map((b) => (
                  <div
                    key={b.key}
                    onClick={() => update("breed", b.key)}
                    style={{
                      padding: isMobile ? "14px" : "16px 18px",
                      borderRadius: 12,
                      cursor: "pointer",
                      border: `2px solid ${form.breed === b.key ? C.green : C.forestBorder}`,
                      background:
                        form.breed === b.key ? C.greenFaint : C.forestSurface2,
                      transition: "all 0.2s",
                      boxShadow:
                        form.breed === b.key
                          ? `0 0 0 1px ${C.green},0 4px 12px rgba(45,122,58,0.15)`
                          : "none",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: isMobile ? 40 : 48,
                          height: isMobile ? 40 : 48,
                          borderRadius: 10,
                          flexShrink: 0,
                          background:
                            form.breed === b.key
                              ? "rgba(45,122,58,0.3)"
                              : C.forestSurface,
                          border: `1px solid ${form.breed === b.key ? C.green : C.forestBorder}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: isMobile ? 20 : 24,
                        }}
                      >
                        {b.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 3,
                          }}
                        >
                          <span
                            style={{
                              fontSize: isMobile ? 14 : 15,
                              fontWeight: 700,
                              color: C.textPrimary,
                            }}
                          >
                            {b.label}
                          </span>
                          <span style={{ fontSize: 11, color: C.textMuted }}>
                            · {b.cycle}
                          </span>
                          {form.breed === b.key && (
                            <span
                              style={{
                                marginLeft: "auto",
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                background: C.green,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                color: "#fff",
                                fontWeight: 700,
                              }}
                            >
                              ✓
                            </span>
                          )}
                        </div>
                        <p
                          style={{
                            fontSize: 12,
                            color: C.textMuted,
                            margin: 0,
                          }}
                        >
                          {b.desc}
                        </p>
                      </div>
                    </div>
                    {form.breed === b.key && (
                      <div
                        style={{
                          marginTop: 12,
                          paddingTop: 10,
                          borderTop: `1px solid ${C.forestBorder}`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#C9A84C",
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            marginBottom: 6,
                          }}
                        >
                          💡 Tips
                        </div>
                        {b.tips.map((tip, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              gap: 6,
                              fontSize: 11,
                              color: C.textSecondary,
                              marginBottom: 4,
                            }}
                          >
                            <span style={{ color: C.greenGlow, flexShrink: 0 }}>
                              →
                            </span>
                            {tip}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Link
                href="/dashboard/batches"
                style={{
                  padding: "12px 20px",
                  borderRadius: 8,
                  border: `1.5px solid ${C.forestBorder}`,
                  background: "transparent",
                  color: C.textSecondary,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 8,
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  background: loading
                    ? "#5A6B5E"
                    : `linear-gradient(135deg,${C.green},${C.greenLight})`,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "Inter,sans-serif",
                  boxShadow: loading
                    ? "none"
                    : "0 4px 14px rgba(45,122,58,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {loading ? "Creating..." : "🐔 Create Batch"}
              </button>
            </div>
          </form>
        </div>

        {/* Preview card */}
        <div>
          <div
            style={{
              background: C.forestSurface,
              border: `1px solid ${C.forestBorder}`,
              borderRadius: 14,
              overflow: "hidden",
              position: isMobile ? "relative" : "sticky",
              top: isMobile ? "auto" : 80,
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                background: C.forestSurface2,
                borderBottom: `1px solid ${C.forestBorder}`,
                fontSize: 12,
                fontWeight: 700,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Batch Preview
            </div>
            <div style={{ padding: "16px" }}>
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 3,
                  }}
                >
                  Name
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: form.name ? C.textPrimary : C.forestBorder,
                  }}
                >
                  {form.name || "Enter a name..."}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 3,
                  }}
                >
                  Breed
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: form.breed ? C.textPrimary : C.forestBorder,
                  }}
                >
                  {selectedBreed
                    ? `${selectedBreed.emoji} ${selectedBreed.label}`
                    : "Select breed..."}
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                {[
                  {
                    l: "Quantity",
                    v: form.quantity ? `${form.quantity} birds` : "—",
                  },
                  { l: "Cycle", v: selectedBreed?.cycle || "—" },
                  {
                    l: "Start",
                    v: form.startDate
                      ? new Date(form.startDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—",
                  },
                  { l: "Target", v: targetDate || "—" },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: C.forestSurface2,
                      borderRadius: 8,
                      padding: "8px 10px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        color: C.textMuted,
                        marginBottom: 2,
                      }}
                    >
                      {item.l}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: C.textPrimary,
                      }}
                    >
                      {item.v}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: C.greenFaint,
                  border: `1px solid ${C.green}`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.greenGlow,
                    marginBottom: 4,
                  }}
                >
                  ✓ Auto-generated on save:
                </div>
                {[
                  "💉 Vaccination schedule",
                  "📅 Target sell date",
                  "🌾 Feed phase calendar",
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: 10,
                      color: C.textMuted,
                      marginBottom: 2,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              {form.breed && (
                <div style={{ marginTop: 14 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: C.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      marginBottom: 8,
                    }}
                  >
                    Vaccination Preview
                  </div>
                  {vaccinePreview.map((v, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 0",
                        borderBottom: `1px solid ${C.forestBorder}`,
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          flexShrink: 0,
                          background: C.forestSurface2,
                          border: `1px solid ${C.forestBorder}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          color: C.textMuted,
                        }}
                      >
                        D{v.day}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: C.textPrimary,
                          }}
                        >
                          {v.name}
                        </div>
                        <div style={{ fontSize: 9, color: C.textMuted }}>
                          {v.method}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
