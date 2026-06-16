"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../../../../lib/api";
import { useAuth } from "@/context/AuthContext";
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
  goldLight: "#E8C76A",
  red: "#C0392B",
  amber: "#D4860A",
  blue: "#2471A3",
};

const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;

const STATUS_CONFIG = {
  pending: {
    label: "Pending Payment",
    color: "#8A7560",
    bg: "#F5F0E8",
    icon: "⏳",
  },
  paid: {
    label: "Paid — In Escrow",
    color: "#2471A3",
    bg: "#EBF5FB",
    icon: "🔒",
  },
  confirmed: {
    label: "Confirmed",
    color: "#D4860A",
    bg: "#FDF3E3",
    icon: "✅",
  },
  dispatched: {
    label: "Dispatched",
    color: "#C9A84C",
    bg: "#FEF9E7",
    icon: "🚚",
  },
  delivered: {
    label: "Delivered",
    color: "#2D7A3A",
    bg: "#EAFAF1",
    icon: "📦",
  },
  cancelled: { label: "Cancelled", color: "#C0392B", bg: "#FDEDEC", icon: "✕" },
  refunded: { label: "Refunded", color: "#8A7560", bg: "#F5F0E8", icon: "↩" },
  disputed: { label: "Disputed", color: "#C0392B", bg: "#FDEDEC", icon: "⚠️" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 12px",
        borderRadius: 100,
        fontSize: 11,
        fontWeight: 700,
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.color}30`,
      }}
    >
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ── Status Timeline ───────────────────────────
function StatusTimeline({ history }) {
  if (!history?.length) return null;
  return (
    <div
      style={{
        marginTop: 16,
        paddingTop: 16,
        borderTop: `1px solid ${C.creamBorder}`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: C.creamMuted,
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 12,
        }}
      >
        Order Timeline
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[...history].reverse().map((h, i) => {
          const cfg = STATUS_CONFIG[h.status] || STATUS_CONFIG.pending;
          return (
            <div
              key={i}
              style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: cfg.bg,
                  border: `1px solid ${cfg.color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}
              >
                {cfg.icon}
              </div>
              <div>
                <div
                  style={{ fontSize: 12, fontWeight: 600, color: C.creamText }}
                >
                  {cfg.label}
                </div>
                {h.note && (
                  <div style={{ fontSize: 11, color: C.creamMuted }}>
                    {h.note}
                  </div>
                )}
                <div style={{ fontSize: 10, color: C.creamMuted }}>
                  {new Date(h.timestamp).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Order Card ────────────────────────────────
function OrderCard({ order, role, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [acting, setActing] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [refInput, setRefInput] = useState("");

  const isBuyer = role === "buyer";
  const isSeller = role === "seller";

  const categoryEmoji =
    {
      live_birds: "🐔",
      day_old_chicks: "🐣",
      eggs: "🥚",
      feed: "🌾",
      medication: "💊",
      equipment: "🏠",
      raw_materials: "🌽",
    }[order.productId?.category] || "📦";

  const handleVerify = async () => {
    const ref = order.paymentRef || refInput;
    if (!ref) {
      toast.error("Enter your payment reference");
      return;
    }
    setVerifying(true);
    try {
      await api.post("/orders/verify", { reference: ref });
      toast.success("Payment verified! Order is now in escrow.");
      onRefresh();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Verification failed. Check your reference.",
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleAction = async (status, note = "") => {
    setActing(true);
    try {
      await api.put(`/orders/${order._id}/status`, { status, note });
      toast.success(`Order ${STATUS_CONFIG[status]?.label || status}`);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActing(false);
    }
  };

  const handleDispute = async () => {
    if (!disputeReason.trim()) {
      toast.error("Please describe the issue");
      return;
    }
    setActing(true);
    try {
      await api.put(`/orders/${order._id}/dispute`, { reason: disputeReason });
      toast.success("Dispute raised. Team will review within 48 hours.");
      setShowDispute(false);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to raise dispute");
    } finally {
      setActing(false);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${C.creamBorder}`,
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      {/* Card header */}
      <div
        onClick={() => setExpanded((p) => !p)}
        style={{
          padding: "18px 22px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          background: expanded ? C.creamSurface : "#fff",
          transition: "background 0.15s",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              flexShrink: 0,
              background: C.creamSurface,
              border: `1px solid ${C.creamBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            {categoryEmoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: C.creamText,
                marginBottom: 3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {order.productName}
            </div>
            <div style={{ fontSize: 11, color: C.creamMuted }}>
              {isBuyer
                ? `Store: ${order.storeId?.name}`
                : `Buyer: ${order.buyerId?.name}`}
              {" · "} Qty: {order.quantity}
              {" · "}{" "}
              {new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexShrink: 0,
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.green }}>
              {fmt(order.totalAmount)}
            </div>
            <div style={{ fontSize: 10, color: C.creamMuted }}>
              {isSeller
                ? `Payout: ${fmt(order.sellerPayout)}`
                : `Ref: ${order.paymentRef?.slice(0, 16)}...`}
            </div>
          </div>
          <StatusBadge status={order.status} />
          <span
            style={{
              fontSize: 18,
              color: C.creamMuted,
              transition: "transform 0.2s",
              transform: expanded ? "rotate(180deg)" : "rotate(0)",
            }}
          >
            ⌄
          </span>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div
          style={{
            padding: "20px 22px",
            borderTop: `1px solid ${C.creamBorder}`,
          }}
        >
          {/* Order info grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, 1fr)"
                : "repeat(4, 1fr)",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {[
              { label: "Unit Price", value: fmt(order.unitPrice) },
              { label: "Quantity", value: order.quantity },
              { label: "Total", value: fmt(order.totalAmount) },
              { label: "Platform Fee", value: fmt(order.platformFee) },
              { label: "Seller Payout", value: fmt(order.sellerPayout) },
              { label: "Delivery", value: order.deliveryType },
              {
                label: "Escrow",
                value: order.escrowReleased ? "✓ Released" : "🔒 Held",
              },
              { label: "Payment Ref", value: order.paymentRef?.slice(-12) },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: C.creamSurface,
                  borderRadius: 8,
                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: C.creamMuted,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 3,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: C.creamText }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Delivery address */}
          {order.deliveryAddress && (
            <div
              style={{
                padding: "10px 14px",
                background: C.creamSurface,
                borderRadius: 8,
                fontSize: 12,
                color: C.creamMuted,
                marginBottom: 16,
              }}
            >
              📍 Delivery address: {order.deliveryAddress}
            </div>
          )}

          {/* ── BUYER ACTIONS ── */}
          {isBuyer && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Verify payment if pending */}
              {order.status === "pending" && (
                <div
                  style={{
                    padding: "14px 16px",
                    background: "#EBF5FB",
                    border: "1px solid #2471A3",
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: C.blue,
                      marginBottom: 8,
                    }}
                  >
                    🔒 Complete Payment
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#2471A3",
                      marginBottom: 12,
                      lineHeight: 1.5,
                    }}
                  >
                    If you already paid via Paystack, enter your reference to
                    verify. Or click the payment link again.
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      placeholder="CPO-XXXXX reference"
                      value={refInput}
                      onChange={(e) => setRefInput(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "9px 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        border: "1px solid #AED6F1",
                        background: "#fff",
                        color: C.creamText,
                        fontFamily: "Inter, sans-serif",
                        outline: "none",
                      }}
                    />
                    <button
                      onClick={handleVerify}
                      disabled={verifying}
                      style={{
                        padding: "9px 18px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        border: "none",
                        cursor: verifying ? "not-allowed" : "pointer",
                        background: verifying ? "#5A6B5E" : C.blue,
                        color: "#fff",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {verifying ? "Verifying..." : "Verify Payment"}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm delivery */}
              {order.status === "dispatched" && (
                <div
                  style={{
                    padding: "14px 16px",
                    background: "#EAFAF1",
                    border: `1px solid ${C.green}`,
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: C.green,
                      marginBottom: 6,
                    }}
                  >
                    📦 Have you received your order?
                  </div>
                  <div
                    style={{ fontSize: 12, color: "#27AE60", marginBottom: 12 }}
                  >
                    Confirming delivery releases payment to the seller from
                    escrow.
                  </div>
                  <button
                    onClick={() =>
                      handleAction("delivered", "Buyer confirmed delivery")
                    }
                    disabled={acting}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      border: "none",
                      cursor: acting ? "not-allowed" : "pointer",
                      background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                      color: "#fff",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    ✓ Confirm Delivery & Release Payment
                  </button>
                </div>
              )}

              {/* Raise dispute */}
              {order.status === "delivered" && !order.escrowReleased && (
                <div>
                  <button
                    onClick={() => setShowDispute((p) => !p)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      border: "1px solid #E8B4B4",
                      background: "#FFF0F0",
                      color: C.red,
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    ⚠️ Raise Dispute
                  </button>
                  {showDispute && (
                    <div
                      style={{
                        marginTop: 12,
                        padding: "14px",
                        background: "#FFF0F0",
                        border: "1px solid #E8B4B4",
                        borderRadius: 10,
                      }}
                    >
                      <textarea
                        placeholder="Describe the issue (e.g. birds were unhealthy, wrong quantity received...)"
                        value={disputeReason}
                        onChange={(e) => setDisputeReason(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: 8,
                          fontSize: 12,
                          border: "1px solid #E8B4B4",
                          background: "#fff",
                          color: C.creamText,
                          fontFamily: "Inter, sans-serif",
                          outline: "none",
                          resize: "vertical",
                          minHeight: 80,
                          boxSizing: "border-box",
                          marginBottom: 10,
                        }}
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={handleDispute}
                          disabled={acting}
                          style={{
                            padding: "9px 18px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            border: "none",
                            cursor: acting ? "not-allowed" : "pointer",
                            background: C.red,
                            color: "#fff",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {acting ? "Submitting..." : "Submit Dispute"}
                        </button>
                        <button
                          onClick={() => setShowDispute(false)}
                          style={{
                            padding: "9px 14px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            border: `1px solid ${C.creamBorder}`,
                            background: "transparent",
                            color: C.creamMuted,
                            cursor: "pointer",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Chat link */}
              <Link
                href={`/marketplace/messages?order=${order._id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 16px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  border: `1px solid ${C.creamBorder}`,
                  color: C.creamText,
                  textDecoration: "none",
                  background: C.creamSurface,
                  width: "fit-content",
                }}
              >
                💬 Message Seller
              </Link>
            </div>
          )}

          {/* ── SELLER ACTIONS ── */}
          {isSeller && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {order.status === "paid" && (
                <button
                  onClick={() =>
                    handleAction("confirmed", "Order accepted by seller")
                  }
                  disabled={acting}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    border: "none",
                    cursor: acting ? "not-allowed" : "pointer",
                    background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                    color: "#fff",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  ✓ Accept Order
                </button>
              )}
              {order.status === "confirmed" && (
                <button
                  onClick={() =>
                    handleAction("dispatched", "Order dispatched by seller")
                  }
                  disabled={acting}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    border: "none",
                    cursor: acting ? "not-allowed" : "pointer",
                    background: C.amber,
                    color: "#fff",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  🚚 Mark as Dispatched
                </button>
              )}
              {["paid", "confirmed"].includes(order.status) && (
                <button
                  onClick={() =>
                    handleAction("cancelled", "Cancelled by seller")
                  }
                  disabled={acting}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    border: "1px solid #E8B4B4",
                    background: "#FFF0F0",
                    color: C.red,
                    cursor: acting ? "not-allowed" : "pointer",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Cancel Order
                </button>
              )}
              <Link
                href={`/marketplace/messages?order=${order._id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 16px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  border: `1px solid ${C.creamBorder}`,
                  color: C.creamText,
                  textDecoration: "none",
                  background: C.creamSurface,
                }}
              >
                💬 Message Buyer
              </Link>
            </div>
          )}

          {/* Status timeline */}
          <StatusTimeline history={order.statusHistory} />
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// MAIN ORDERS PAGE
// ══════════════════════════════════════════════
export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("buyer");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchOrders();
  }, [user, role]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders?role=${role}`);
      setOrders(res.data.orders || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    paid: orders.filter((o) => o.status === "paid").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    dispatched: orders.filter((o) => o.status === "dispatched").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: 28,
            fontWeight: 700,
            color: C.creamText,
            marginBottom: 4,
          }}
        >
          My Orders
        </h1>
        <p style={{ fontSize: 13, color: C.creamMuted }}>
          Track and manage all your marketplace orders
        </p>
      </div>

      {/* Role switcher */}
      <div
        style={{
          display: "flex",
          gap: 2,
          background: C.creamSurface,
          border: `1px solid ${C.creamBorder}`,
          borderRadius: 10,
          padding: 4,
          marginBottom: 20,
          width: "fit-content",
          overflowX: 'auto', WebkitOverflowScrolling: 'touch'
        }}
      >
        {[
          { key: "buyer", label: "🛒 My Purchases" },
          { key: "seller", label: "🏪 My Sales" },
        ].map((r) => (
          <button
            key={r.key}
            onClick={() => setRole(r.key)}
            style={{
              padding: "9px 20px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              background: role === r.key ? C.green : "transparent",
              color: role === r.key ? "#fff" : C.creamMuted,
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Status filter pills */}
      <div
        style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}
      >
        {[
          { key: "all", label: `All (${counts.all})` },
          { key: "pending", label: `⏳ Pending (${counts.pending})` },
          { key: "paid", label: `🔒 In Escrow (${counts.paid})` },
          { key: "confirmed", label: `✅ Confirmed (${counts.confirmed})` },
          { key: "dispatched", label: `🚚 Dispatched (${counts.dispatched})` },
          { key: "delivered", label: `📦 Delivered (${counts.delivered})` },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: "7px 14px",
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 600,
              border: `1px solid ${filter === f.key ? C.green : C.creamBorder}`,
              background: filter === f.key ? C.greenFaint : "#fff",
              color: filter === f.key ? C.greenGlow : C.creamMuted,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.15s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 80,
                borderRadius: 14,
                background: C.creamSurface,
                animation: "shimmer 1.4s infinite",
                backgroundSize: "200% 100%",
                backgroundImage: `linear-gradient(90deg, ${C.creamSurface} 25%, ${C.creamBorder} 50%, ${C.creamSurface} 75%)`,
              }}
            />
          ))}
        </div>
      ) : filtered.length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              role={role}
              onRefresh={fetchOrders}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: "64px 32px",
            textAlign: "center",
            background: "#fff",
            border: `1px solid ${C.creamBorder}`,
            borderRadius: 16,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: C.creamText,
              marginBottom: 6,
            }}
          >
            {filter === "all"
              ? `No ${role === "buyer" ? "purchases" : "sales"} yet`
              : `No ${filter} orders`}
          </div>
          <div style={{ fontSize: 13, color: C.creamMuted, marginBottom: 20 }}>
            {role === "buyer"
              ? "Browse the marketplace to find products."
              : "List products to start receiving orders."}
          </div>
          <Link
            href={role === "buyer" ? "/marketplace" : "/marketplace/store"}
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
            }}
          >
            {role === "buyer" ? "🛍 Browse Marketplace" : "🏪 Go to My Store"}
          </Link>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
