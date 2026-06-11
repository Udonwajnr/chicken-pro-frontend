"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from '../../../../../lib/api';
import toast from "react-hot-toast";

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
  green: "#2D7A3A",
  greenLight: "#3D9E4D",
  greenGlow: "#6FCF7F",
  greenFaint: "#1A3D22",
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
  fontFamily: "Inter, sans-serif",
  outline: "none",
  transition: "all 0.15s",
  boxSizing: "border-box",
  boxShadow: focused ? "0 0 0 3px rgba(45,122,58,0.15)" : "none",
});

function Field({ label, hint, error, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
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
      {children}
      {hint && (
        <p style={{ fontSize: 11, color: C.textMuted, marginTop: 5 }}>{hint}</p>
      )}
      {error && (
        <p style={{ fontSize: 11, color: "#E88080", marginTop: 5 }}>{error}</p>
      )}
    </div>
  );
}

function Input({ label, hint, error, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <Field label={label} hint={hint} error={error}>
      <input
        {...props}
        style={inputStyle(focused, error)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </Field>
  );
}

function Textarea({ label, hint, error, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <Field label={label} hint={hint} error={error}>
      <textarea
        {...props}
        style={{
          ...inputStyle(focused, error),
          resize: "vertical",
          minHeight: 90,
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </Field>
  );
}

const BREEDS = [
  {
    key: "broiler",
    emoji: "🐔",
    label: "Broiler",
    desc: "6-week cycle. Raised for meat. High volume, fast return.",
    cycle: "6 weeks",
    tracking: "Weight",
    tips: [
      "Buy day-old chicks from registered hatcheries",
      "Sell at exactly 6 weeks for best feed conversion",
      "Volume is key — minimum 100 birds to be profitable",
    ],
  },
  {
    key: "layer",
    emoji: "🥚",
    label: "Layer",
    desc: "72-week cycle. Raised for eggs. Daily income once laying starts.",
    cycle: "72 weeks",
    tracking: "Egg production",
    tips: [
      "Buy sexed pullets only — no males",
      "Do NOT give layer mash before week 18",
      "Maintain 16 hours of light per day",
    ],
  },
  {
    key: "cockerel",
    emoji: "🐓",
    label: "Cockerel",
    desc: "12-week cycle. Local chicken. Premium prices at festive seasons.",
    cycle: "12 weeks",
    tracking: "Weight",
    tips: [
      "Time batches to reach maturity before Christmas or Eid",
      "More disease-resistant than broilers",
      "Buyers pay premium for local chicken taste",
    ],
  },
];

export default function NewBatchPage() {
  const router = useRouter();

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

  const update = (field, val) => setForm((p) => ({ ...p, [field]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Batch name is required";
    if (!form.breed) e.breed = "Please select a breed";
    if (!form.quantity) e.quantity = "Quantity is required";
    else if (parseInt(form.quantity) < 1)
      e.quantity = "Quantity must be at least 1";
    if (!form.startDate) e.startDate = "Start date is required";
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
      toast.success(
        `Batch "${form.name}" created! Vaccination schedule auto-generated.`,
      );
      router.push(`/dashboard/batches/${res.data.batch._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create batch");
    } finally {
      setLoading(false);
    }
  };

  const selectedBreed = BREEDS.find((b) => b.key === form.breed);

  // Auto-calculate target date
  const targetDate =
    form.startDate && form.breed
      ? (() => {
          const weeks =
            { broiler: 6, layer: 72, cockerel: 12 }[form.breed] || 6;
          const d = new Date(form.startDate);
          d.setDate(d.getDate() + weeks * 7);
          return d.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        })()
      : null;

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <Link
            href="/dashboard/batches"
            style={{ color: C.textMuted, textDecoration: "none", fontSize: 13 }}
          >
            ← Batches
          </Link>
          <span style={{ color: C.forestBorder }}>›</span>
          <span style={{ color: C.textPrimary, fontSize: 13 }}>New Batch</span>
        </div>
        <h1
          style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: 28,
            fontWeight: 700,
            color: C.textPrimary,
            marginBottom: 4,
          }}
        >
          Create New Batch
        </h1>
        <p style={{ fontSize: 13, color: C.textMuted }}>
          A vaccination schedule will be auto-generated when you save.
        </p>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}
      >
        {/* Left — Form */}
        <div>
          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div
              style={{
                background: C.forestSurface,
                border: `1px solid ${C.forestBorder}`,
                borderRadius: 14,
                padding: "24px",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.textPrimary,
                  marginBottom: 20,
                  paddingBottom: 12,
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
                hint="Give it a name you can easily recognise later"
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <Input
                  label="Quantity (birds) *"
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
                placeholder="Any notes about this batch — source of chicks, pen number, etc."
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
              />
            </div>

            {/* Breed Selector */}
            <div
              style={{
                background: C.forestSurface,
                border: `1px solid ${C.forestBorder}`,
                borderRadius: 14,
                padding: "24px",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.textPrimary,
                  marginBottom: 6,
                  paddingBottom: 12,
                  borderBottom: `1px solid ${C.forestBorder}`,
                }}
              >
                🐔 Select Breed *
              </div>
              {errors.breed && (
                <p style={{ fontSize: 11, color: "#E88080", marginBottom: 12 }}>
                  {errors.breed}
                </p>
              )}

              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {BREEDS.map((b) => (
                  <div
                    key={b.key}
                    onClick={() => update("breed", b.key)}
                    style={{
                      padding: "16px 18px",
                      borderRadius: 12,
                      cursor: "pointer",
                      border: `2px solid ${form.breed === b.key ? C.green : C.forestBorder}`,
                      background:
                        form.breed === b.key ? C.greenFaint : C.forestSurface2,
                      transition: "all 0.2s",
                      boxShadow:
                        form.breed === b.key
                          ? `0 0 0 1px ${C.green}, 0 4px 12px rgba(45,122,58,0.15)`
                          : "none",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 14 }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
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
                          fontSize: 24,
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
                              fontSize: 15,
                              fontWeight: 700,
                              color: C.textPrimary,
                            }}
                          >
                            {b.label}
                          </span>
                          <span style={{ fontSize: 11, color: C.textMuted }}>
                            · {b.cycle} · {b.tracking} tracking
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
                            fontSize: 13,
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
                          marginTop: 14,
                          paddingTop: 12,
                          borderTop: `1px solid ${C.forestBorder}`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#C9A84C",
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            marginBottom: 8,
                          }}
                        >
                          💡 Quick Tips
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                          }}
                        >
                          {b.tips.map((tip, i) => (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                gap: 8,
                                fontSize: 12,
                                color: C.textSecondary,
                              }}
                            >
                              <span
                                style={{ color: C.greenGlow, flexShrink: 0 }}
                              >
                                →
                              </span>
                              {tip}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: "flex", gap: 12 }}>
              <Link
                href="/dashboard/batches"
                style={{
                  flex: "0 0 auto",
                  padding: "12px 22px",
                  borderRadius: 8,
                  border: `1.5px solid ${C.forestBorder}`,
                  background: "transparent",
                  color: C.textSecondary,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "13px 0",
                  borderRadius: 8,
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  background: loading
                    ? "#5A6B5E"
                    : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "Inter, sans-serif",
                  boxShadow: loading
                    ? "none"
                    : "0 4px 14px rgba(45,122,58,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.2s",
                }}
              >
                {loading ? (
                  <>
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    Creating batch...
                  </>
                ) : (
                  "🐔 Create Batch & Generate Schedule"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right — Summary Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Batch Preview */}
          <div
            style={{
              background: C.forestSurface,
              border: `1px solid ${C.forestBorder}`,
              borderRadius: 14,
              overflow: "hidden",
              position: "sticky",
              top: 80,
            }}
          >
            <div
              style={{
                padding: "14px 18px",
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

            <div style={{ padding: "18px" }}>
              {/* Name */}
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 4,
                  }}
                >
                  Name
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: form.name ? C.textPrimary : C.forestBorder,
                  }}
                >
                  {form.name || "Enter a batch name..."}
                </div>
              </div>

              {/* Breed */}
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 4,
                  }}
                >
                  Breed
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: form.breed ? C.textPrimary : C.forestBorder,
                  }}
                >
                  {selectedBreed
                    ? `${selectedBreed.emoji} ${selectedBreed.label}`
                    : "Select a breed..."}
                </div>
              </div>

              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                {[
                  {
                    label: "Quantity",
                    value: form.quantity ? `${form.quantity} birds` : "—",
                  },
                  {
                    label: "Cycle",
                    value: selectedBreed ? selectedBreed.cycle : "—",
                  },
                  {
                    label: "Start Date",
                    value: form.startDate
                      ? new Date(form.startDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—",
                  },
                  { label: "Target Date", value: targetDate || "—" },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: C.forestSurface2,
                      borderRadius: 8,
                      padding: "10px 12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: C.textMuted,
                        marginBottom: 3,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.textPrimary,
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Auto-gen notice */}
              <div
                style={{
                  padding: "12px 14px",
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
                    marginBottom: 6,
                  }}
                >
                  ✓ Auto-generated on save:
                </div>
                {[
                  "💉 Full vaccination schedule",
                  "📅 Target sell/harvest date",
                  "🌾 Feed phase calendar",
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: 11,
                      color: C.textMuted,
                      marginBottom: 3,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Vaccination preview */}
              {form.breed && (
                <div style={{ marginTop: 14 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      marginBottom: 10,
                    }}
                  >
                    Vaccination Schedule Preview
                  </div>
                  {(
                    {
                      broiler: [
                        {
                          day: 7,
                          name: "Newcastle (Lasota)",
                          method: "Eye drop",
                        },
                        { day: 14, name: "Gumboro (IBD)", method: "Water" },
                        { day: 21, name: "Newcastle Booster", method: "Water" },
                        { day: 28, name: "Gumboro Booster", method: "Water" },
                      ],
                      layer: [
                        {
                          day: 7,
                          name: "Newcastle (Lasota)",
                          method: "Eye drop",
                        },
                        { day: 14, name: "Gumboro (IBD)", method: "Water" },
                        { day: 42, name: "Fowl Pox", method: "Wing stab" },
                        {
                          day: 56,
                          name: "Newcastle (Komarov)",
                          method: "Injection",
                        },
                      ],
                      cockerel: [
                        {
                          day: 7,
                          name: "Newcastle (Lasota)",
                          method: "Eye drop",
                        },
                        { day: 14, name: "Gumboro (IBD)", method: "Water" },
                        { day: 42, name: "Fowl Pox", method: "Wing stab" },
                      ],
                    }[form.breed] || []
                  ).map((v, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 0",
                        borderBottom: `1px solid ${C.forestBorder}`,
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 7,
                          flexShrink: 0,
                          background: C.forestSurface2,
                          border: `1px solid ${C.forestBorder}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 700,
                          color: C.textMuted,
                        }}
                      >
                        D{v.day}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: C.textPrimary,
                          }}
                        >
                          {v.name}
                        </div>
                        <div style={{ fontSize: 10, color: C.textMuted }}>
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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
