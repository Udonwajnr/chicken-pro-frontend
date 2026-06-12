"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../../lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

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
};

function MessagesContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("order");

  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const bottomRef = useRef(null);
  const socketRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchOrders();
    // Setup socket
    socketRef.current = io(
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
        "http://localhost:5000",
    );
    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (orders.length && preselected) {
      const found = orders.find((o) => o._id === preselected);
      if (found) selectOrder(found);
    }
  }, [orders, preselected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const [buyerRes, sellerRes] = await Promise.all([
        api.get("/orders?role=buyer"),
        api.get("/orders?role=seller"),
      ]);
      const all = [
        ...(buyerRes.data.orders || []).map((o) => ({ ...o, myRole: "buyer" })),
        ...(sellerRes.data.orders || []).map((o) => ({
          ...o,
          myRole: "seller",
        })),
      ];
      // Deduplicate
      const seen = new Set();
      const unique = all.filter((o) => {
        if (seen.has(o._id)) return false;
        seen.add(o._id);
        return true;
      });
      setOrders(unique);
    } catch {
      toast.error("Failed to load conversations");
    } finally {
      setLoadingOrders(false);
    }
  };

  const selectOrder = async (order) => {
    setActiveOrder(order);
    setLoadingMsgs(true);
    setMessages([]);

    // Leave previous room, join new one
    socketRef.current?.emit("join_room", order._id);

    // Listen for incoming messages
    socketRef.current?.off("receive_message");
    socketRef.current?.on("receive_message", (msg) => {
      setMessages((p) => {
        const exists = p.find(
          (m) => m._id === msg._id || (m._tempId && m.content === msg.content),
        );
        if (exists)
          return p.map((m) =>
            m._tempId && m.content === msg.content ? msg : m,
          );
        return [...p, msg];
      });
    });

    try {
      const res = await api.get(`/chat/${order._id}`);
      setMessages(res.data.messages || []);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoadingMsgs(false);
      inputRef.current?.focus();
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeOrder) return;
    setSending(true);

    const tempMsg = {
      _tempId: Date.now(),
      content: newMsg,
      senderId: { _id: user._id, name: user.name },
      createdAt: new Date().toISOString(),
      pending: true,
    };
    setMessages((p) => [...p, tempMsg]);
    const text = newMsg;
    setNewMsg("");

    try {
      // Emit via socket (server saves + broadcasts)
      socketRef.current?.emit("send_message", {
        orderId: activeOrder._id,
        content: text,
        senderId: user._id,
        senderName: user.name,
      });
      // Also save via REST as fallback
      await api.post("/chat", { orderId: activeOrder._id, content: text });
    } catch {
      setMessages((p) => p.filter((m) => !m.pending));
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const getOtherParty = (order) => {
    if (!order) return "";
    return order.myRole === "buyer"
      ? order.sellerId?.name || "Seller"
      : order.buyerId?.name || "Buyer";
  };

  const isOwn = (msg) => {
    const sid = msg.senderId?._id || msg.senderId;
    return sid?.toString() === user?._id?.toString();
  };

  const statusColor = {
    pending: "#8A7560",
    paid: "#2471A3",
    confirmed: "#D4860A",
    dispatched: "#C9A84C",
    delivered: "#2D7A3A",
    cancelled: "#C0392B",
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <h1
          style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: 26,
            fontWeight: 700,
            color: C.creamText,
            marginBottom: 4,
          }}
        >
          Messages
        </h1>
        <p style={{ fontSize: 13, color: C.creamMuted }}>
          Chat with buyers and sellers about your orders
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          height: 620,
          background: "#fff",
          border: `1px solid ${C.creamBorder}`,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        {/* ── Sidebar — Order List ── */}
        <div
          style={{
            borderRight: `1px solid ${C.creamBorder}`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "16px 18px",
              borderBottom: `1px solid ${C.creamBorder}`,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: C.creamText }}>
              Conversations
            </div>
            <div style={{ fontSize: 11, color: C.creamMuted, marginTop: 2 }}>
              {orders.length} orders
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {loadingOrders ? (
              <div
                style={{
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: 64,
                      borderRadius: 10,
                      background: C.creamSurface,
                      animation: "shimmer 1.4s infinite",
                      backgroundSize: "200% 100%",
                      backgroundImage: `linear-gradient(90deg, ${C.creamSurface} 25%, ${C.creamBorder} 50%, ${C.creamSurface} 75%)`,
                    }}
                  />
                ))}
              </div>
            ) : orders.length ? (
              orders.map((order) => {
                const isActive = activeOrder?._id === order._id;
                const other = getOtherParty(order);
                const sc = statusColor[order.status] || "#8A7560";
                return (
                  <div
                    key={order._id}
                    onClick={() => selectOrder(order)}
                    style={{
                      padding: "14px 18px",
                      cursor: "pointer",
                      borderBottom: `1px solid ${C.creamBorder}`,
                      background: isActive ? C.greenFaint : "transparent",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.background = C.creamSurface;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div
                      style={{ display: "flex", gap: 10, alignItems: "center" }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: isActive
                            ? `linear-gradient(135deg, ${C.green}, #4CAF5C)`
                            : `linear-gradient(135deg, #BDC3C7, #95A5A6)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#fff",
                        }}
                      >
                        {other?.[0]?.toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: isActive ? "#6FCF7F" : C.creamText,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {other}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: isActive ? "#5A6B5E" : C.creamMuted,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {order.productName}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: sc,
                            textAlign: "right",
                            marginBottom: 2,
                          }}
                        >
                          {order.status?.toUpperCase()}
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            color: C.creamMuted,
                            textAlign: "right",
                          }}
                        >
                          {order.myRole}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: "32px 18px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>💬</div>
                <div
                  style={{ fontSize: 13, color: C.creamMuted, lineHeight: 1.5 }}
                >
                  No conversations yet. Messages appear here after you place or
                  receive an order.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Main Chat Panel ── */}
        {activeOrder ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Chat header */}
            <div
              style={{
                padding: "14px 20px",
                borderBottom: `1px solid ${C.creamBorder}`,
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: C.creamSurface,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.green}, #4CAF5C)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {getOtherParty(activeOrder)?.[0]?.toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 14, fontWeight: 700, color: C.creamText }}
                >
                  {getOtherParty(activeOrder)}
                </div>
                <div style={{ fontSize: 11, color: C.creamMuted }}>
                  {activeOrder.productName} · {activeOrder.quantity} units
                </div>
              </div>
              <Link
                href={`/marketplace/orders`}
                style={{
                  padding: "7px 14px",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.green,
                  textDecoration: "none",
                  border: `1px solid ${C.green}`,
                  background: `${C.green}10`,
                }}
              >
                📦 View Order
              </Link>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {loadingMsgs ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: C.creamMuted,
                    fontSize: 13,
                  }}
                >
                  Loading messages...
                </div>
              ) : messages.length ? (
                <>
                  {messages.map((msg, i) => {
                    const own = isOwn(msg);
                    return (
                      <div
                        key={msg._id || msg._tempId || i}
                        style={{
                          display: "flex",
                          justifyContent: own ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "72%",
                            padding: "10px 14px",
                            borderRadius: own
                              ? "14px 14px 4px 14px"
                              : "14px 14px 14px 4px",
                            background: own
                              ? `linear-gradient(135deg, ${C.green}, ${C.greenLight})`
                              : C.creamSurface,
                            border: own ? "none" : `1px solid ${C.creamBorder}`,
                            opacity: msg.pending ? 0.7 : 1,
                          }}
                        >
                          {!own && (
                            <div
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: C.green,
                                marginBottom: 3,
                              }}
                            >
                              {msg.senderId?.name || "Unknown"}
                            </div>
                          )}
                          <div
                            style={{
                              fontSize: 13,
                              color: own ? "#fff" : C.creamText,
                              lineHeight: 1.5,
                            }}
                          >
                            {msg.content}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: own
                                ? "rgba(255,255,255,0.6)"
                                : C.creamMuted,
                              marginTop: 4,
                              textAlign: "right",
                            }}
                          >
                            {msg.pending
                              ? "Sending..."
                              : new Date(msg.createdAt).toLocaleTimeString(
                                  "en-GB",
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: C.creamMuted,
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
                  <div style={{ fontSize: 13 }}>
                    No messages yet. Start the conversation below.
                  </div>
                </div>
              )}
            </div>

            {/* Message input */}
            <form
              onSubmit={sendMessage}
              style={{
                padding: "14px 20px",
                borderTop: `1px solid ${C.creamBorder}`,
                display: "flex",
                gap: 10,
                background: "#fff",
              }}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                style={{
                  flex: 1,
                  padding: "11px 16px",
                  borderRadius: 10,
                  border: `1.5px solid ${C.creamBorder}`,
                  background: C.creamSurface,
                  fontSize: 13,
                  color: C.creamText,
                  fontFamily: "Inter, sans-serif",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = C.green)}
                onBlur={(e) => (e.target.style.borderColor = C.creamBorder)}
              />
              <button
                type="submit"
                disabled={sending || !newMsg.trim()}
                style={{
                  padding: "11px 20px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  border: "none",
                  cursor: sending || !newMsg.trim() ? "not-allowed" : "pointer",
                  background:
                    sending || !newMsg.trim()
                      ? "#BDC3C7"
                      : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                  color: "#fff",
                  fontFamily: "Inter, sans-serif",
                  boxShadow:
                    sending || !newMsg.trim()
                      ? "none"
                      : "0 3px 10px rgba(45,122,58,0.3)",
                }}
              >
                {sending ? "..." : "Send →"}
              </button>
            </form>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              color: C.creamMuted,
            }}
          >
            <div style={{ fontSize: 52 }}>💬</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.creamText }}>
              Your Messages
            </div>
            <div
              style={{
                fontSize: 13,
                textAlign: "center",
                maxWidth: 280,
                lineHeight: 1.6,
              }}
            >
              Select an order from the left to start chatting with the buyer or
              seller.
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 40, textAlign: "center", color: "#8A7560" }}>
          Loading messages...
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
