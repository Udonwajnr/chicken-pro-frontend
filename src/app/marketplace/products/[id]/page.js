"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../../../lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

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
};

const fmt = (n) => (n != null ? `₦${Number(n).toLocaleString()}` : "₦0");

const CATEGORY_LABELS = {
  live_birds: "Live Birds",
  day_old_chicks: "Day-old Chicks",
  eggs: "Eggs",
  feed: "Feed",
  medication: "Medication",
  equipment: "Equipment",
  raw_materials: "Raw Materials",
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [ordering, setOrdering] = useState(false);
  const [form, setForm] = useState({
    deliveryType: "delivery",
    deliveryAddress: "",
  });
  const [showOrder, setShowOrder] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const [prodRes, reviewRes] = await Promise.all([
        api.get(`/products/${params.id}`),
        api
          .get(`/reviews/store/${null}`)
          .catch(() => ({ data: { reviews: [] } })),
      ]);
      setProduct(prodRes.data.product);

      if (prodRes.data.product?.storeId?._id) {
        const rRes = await api.get(
          `/reviews/store/${prodRes.data.product.storeId._id}`,
        );
        setReviews(rRes.data.reviews || []);
      }
    } catch {
      toast.error("Product not found");
      router.push("/marketplace");
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    if (qty < 1 || qty > product.quantity) {
      toast.error(`Please enter a quantity between 1 and ${product.quantity}`);
      return;
    }
    setOrdering(true);
    try {
      const res = await api.post("/orders", {
        productId: product._id,
        quantity: qty,
        deliveryType: form.deliveryType,
        deliveryAddress: form.deliveryAddress,
      });

      toast.success("Order placed! Redirecting to payment...");

      // Open Paystack payment link
      if (res.data.payment?.authorization_url) {
        window.open(res.data.payment.authorization_url, "_blank");
        toast.success(
          "Complete payment in the new tab, then verify your order.",
        );
        router.push(`/marketplace/orders`);
      } else {
        router.push(`/marketplace/orders`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setOrdering(false);
    }
  };

  if (loading)
    return (
      <div
        style={{ padding: "48px", textAlign: "center", color: C.creamMuted }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>🐔</div>
        Loading product...
      </div>
    );

  if (!product) return null;

  const totalPrice = product.price * qty;
  const photos = product.photos?.length ? product.photos : [];
  const categoryEmoji =
    {
      live_birds: "🐔",
      day_old_chicks: "🐣",
      eggs: "🥚",
      feed: "🌾",
      medication: "💊",
      equipment: "🏠",
      raw_materials: "🌽",
    }[product.category] || "📦";

  return (
    <div>
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 24,
          fontSize: 13,
          color: C.creamMuted,
        }}
      >
        <Link
          href="/marketplace"
          style={{ color: C.creamMuted, textDecoration: "none" }}
        >
          Marketplace
        </Link>
        <span>›</span>
        <Link
          href={`/marketplace?category=${product.category}`}
          style={{ color: C.creamMuted, textDecoration: "none" }}
        >
          {CATEGORY_LABELS[product.category]}
        </Link>
        <span>›</span>
        <span style={{ color: C.creamText }}>{product.name}</span>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32 }}
      >
        {/* ── Left — Photos + Info ── */}
        <div>
          {/* Main photo */}
          <div
            style={{
              height: 420,
              borderRadius: 16,
              background: photos[photoIdx]
                ? `url(${photos[photoIdx]}) center/cover no-repeat`
                : `linear-gradient(135deg, ${C.creamSurface}, ${C.creamBorder})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
              position: "relative",
              border: `1px solid ${C.creamBorder}`,
            }}
          >
            {!photos[photoIdx] && (
              <span style={{ fontSize: 80 }}>{categoryEmoji}</span>
            )}
            {product.isFeatured && (
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: 100,
                }}
              >
                ★ Featured Listing
              </div>
            )}
          </div>

          {/* Photo thumbnails */}
          {photos.length > 1 && (
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {photos.map((p, i) => (
                <div
                  key={i}
                  onClick={() => setPhotoIdx(i)}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 8,
                    cursor: "pointer",
                    background: `url(${p}) center/cover no-repeat`,
                    border: `2px solid ${i === photoIdx ? C.green : C.creamBorder}`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Product Info */}
          <div
            style={{
              background: "#fff",
              border: `1px solid ${C.creamBorder}`,
              borderRadius: 14,
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.green,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    marginBottom: 6,
                  }}
                >
                  {categoryEmoji} {CATEGORY_LABELS[product.category]}
                </div>
                <h1
                  style={{
                    fontFamily: "Playfair Display, Georgia, serif",
                    fontSize: 26,
                    fontWeight: 700,
                    color: C.creamText,
                    marginBottom: 4,
                  }}
                >
                  {product.name}
                </h1>
                <div style={{ fontSize: 13, color: C.creamMuted }}>
                  {product.quantity} units available · {product.deliveryOptions}{" "}
                  delivery
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: C.green }}>
                  {fmt(product.price)}
                </div>
                <div style={{ fontSize: 12, color: C.creamMuted }}>
                  {product.unit}
                </div>
              </div>
            </div>

            {product.description && (
              <div
                style={{
                  fontSize: 14,
                  color: C.creamMuted,
                  lineHeight: 1.7,
                  marginBottom: 20,
                  paddingTop: 16,
                  borderTop: `1px solid ${C.creamBorder}`,
                }}
              >
                {product.description}
              </div>
            )}

            {/* Store info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 0",
                borderTop: `1px solid ${C.creamBorder}`,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.green}, ${C.gold})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                🏪
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: C.creamText,
                    }}
                  >
                    {product.storeId?.name}
                  </span>
                  {product.storeId?.isVerified && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: C.green,
                        background: `${C.green}15`,
                        padding: "2px 8px",
                        borderRadius: 100,
                        border: `1px solid ${C.green}`,
                      }}
                    >
                      ✓ Verified
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: C.creamMuted }}>
                  📍 {product.storeId?.location || "Nigeria"}
                  {product.storeId?.rating > 0 && (
                    <span style={{ marginLeft: 10, color: C.gold }}>
                      {"★".repeat(Math.round(product.storeId.rating))}{" "}
                      {product.storeId.rating}
                    </span>
                  )}
                </div>
              </div>
              <Link
                href={`/marketplace/stores/${product.storeId?._id}`}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.green,
                  textDecoration: "none",
                  border: `1px solid ${C.green}`,
                  background: `${C.green}10`,
                }}
              >
                View Store
              </Link>
            </div>
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div
              style={{
                background: "#fff",
                border: `1px solid ${C.creamBorder}`,
                borderRadius: 14,
                padding: "24px",
                marginTop: 16,
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: C.creamText,
                  marginBottom: 16,
                }}
              >
                Customer Reviews ({reviews.length})
              </div>
              {reviews.slice(0, 5).map((r, i) => (
                <div
                  key={i}
                  style={{
                    paddingBottom: 16,
                    marginBottom: 16,
                    borderBottom:
                      i < reviews.length - 1
                        ? `1px solid ${C.creamBorder}`
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 8,
                    }}
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
                      }}
                    >
                      {r.reviewerId?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: C.creamText,
                        }}
                      >
                        {r.reviewerId?.name}
                      </div>
                      <div style={{ color: C.gold, fontSize: 12 }}>
                        {"★".repeat(r.rating)}
                        {"☆".repeat(5 - r.rating)}
                      </div>
                    </div>
                  </div>
                  {r.comment && (
                    <div
                      style={{
                        fontSize: 13,
                        color: C.creamMuted,
                        lineHeight: 1.6,
                      }}
                    >
                      {r.comment}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right — Order Card ── */}
        <div>
          <div
            style={{
              background: "#fff",
              border: `1px solid ${C.creamBorder}`,
              borderRadius: 16,
              overflow: "hidden",
              position: "sticky",
              top: 100,
            }}
          >
            {/* Price header */}
            <div
              style={{
                padding: "20px 22px",
                background: `linear-gradient(135deg, ${C.greenFaint}, #0A1409)`,
                borderBottom: `1px solid ${C.creamBorder}`,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: C.greenGlow,
                  marginBottom: 2,
                }}
              >
                {fmt(product.price)}
              </div>
              <div style={{ fontSize: 12, color: "#A89880" }}>
                {product.unit}
              </div>
            </div>

            <div style={{ padding: "20px 22px" }}>
              {product.quantity > 0 ? (
                <>
                  {/* Quantity selector */}
                  <div style={{ marginBottom: 16 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 600,
                        color: C.creamMuted,
                        marginBottom: 8,
                      }}
                    >
                      Quantity ({product.quantity} available)
                    </label>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <button
                        onClick={() => setQty((p) => Math.max(1, p - 1))}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          border: `1px solid ${C.creamBorder}`,
                          background: C.creamSurface,
                          fontSize: 18,
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={qty}
                        min={1}
                        max={product.quantity}
                        onChange={(e) =>
                          setQty(
                            Math.min(
                              product.quantity,
                              Math.max(1, parseInt(e.target.value) || 1),
                            ),
                          )
                        }
                        style={{
                          width: 60,
                          padding: "8px 0",
                          textAlign: "center",
                          border: `1px solid ${C.creamBorder}`,
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 700,
                          color: C.creamText,
                          fontFamily: "Inter, sans-serif",
                          outline: "none",
                        }}
                      />
                      <button
                        onClick={() =>
                          setQty((p) => Math.min(product.quantity, p + 1))
                        }
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          border: `1px solid ${C.creamBorder}`,
                          background: C.creamSurface,
                          fontSize: 18,
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div
                    style={{
                      padding: "12px 14px",
                      background: C.creamSurface,
                      borderRadius: 8,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 13,
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ color: C.creamMuted }}>Subtotal</span>
                      <span style={{ fontWeight: 700, color: C.creamText }}>
                        {fmt(totalPrice)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 11,
                      }}
                    >
                      <span style={{ color: C.creamMuted }}>
                        Platform fee (5%)
                      </span>
                      <span style={{ color: C.creamMuted }}>
                        {fmt(totalPrice * 0.05)}
                      </span>
                    </div>
                  </div>

                  {/* Order form toggle */}
                  {!showOrder ? (
                    <button
                      onClick={() => {
                        if (!user) {
                          router.push("/login");
                          return;
                        }
                        setShowOrder(true);
                      }}
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: 10,
                        fontSize: 15,
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                        background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                        color: "#fff",
                        boxShadow: "0 4px 14px rgba(45,122,58,0.35)",
                      }}
                    >
                      {user ? "Place Order →" : "Sign In to Order"}
                    </button>
                  ) : (
                    <form onSubmit={handleOrder}>
                      {/* Delivery type */}
                      <div style={{ marginBottom: 14 }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: 12,
                            fontWeight: 600,
                            color: C.creamMuted,
                            marginBottom: 8,
                          }}
                        >
                          Delivery Type
                        </label>
                        <div style={{ display: "flex", gap: 8 }}>
                          {["pickup", "delivery"].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() =>
                                setForm((p) => ({ ...p, deliveryType: type }))
                              }
                              style={{
                                flex: 1,
                                padding: "9px 0",
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 600,
                                border: `2px solid ${form.deliveryType === type ? C.green : C.creamBorder}`,
                                background:
                                  form.deliveryType === type
                                    ? `${C.green}10`
                                    : "#fff",
                                color:
                                  form.deliveryType === type
                                    ? C.green
                                    : C.creamMuted,
                                cursor: "pointer",
                                fontFamily: "Inter, sans-serif",
                              }}
                            >
                              {type === "pickup" ? "🚗 Pickup" : "🚚 Delivery"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Address */}
                      {form.deliveryType === "delivery" && (
                        <div style={{ marginBottom: 14 }}>
                          <label
                            style={{
                              display: "block",
                              fontSize: 12,
                              fontWeight: 600,
                              color: C.creamMuted,
                              marginBottom: 6,
                            }}
                          >
                            Delivery Address *
                          </label>
                          <textarea
                            required
                            placeholder="Enter your full delivery address..."
                            value={form.deliveryAddress}
                            onChange={(e) =>
                              setForm((p) => ({
                                ...p,
                                deliveryAddress: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              borderRadius: 8,
                              border: `1px solid ${C.creamBorder}`,
                              background: C.creamSurface,
                              fontSize: 13,
                              color: C.creamText,
                              fontFamily: "Inter, sans-serif",
                              outline: "none",
                              resize: "vertical",
                              minHeight: 80,
                              boxSizing: "border-box",
                            }}
                          />
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={ordering}
                        style={{
                          width: "100%",
                          padding: "13px",
                          borderRadius: 10,
                          fontSize: 14,
                          fontWeight: 700,
                          border: "none",
                          cursor: ordering ? "not-allowed" : "pointer",
                          fontFamily: "Inter, sans-serif",
                          background: ordering
                            ? "#5A6B5E"
                            : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                          color: "#fff",
                          boxShadow: ordering
                            ? "none"
                            : "0 4px 14px rgba(45,122,58,0.35)",
                          marginBottom: 10,
                        }}
                      >
                        {ordering
                          ? "Placing Order..."
                          : `Pay ${fmt(totalPrice)} →`}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowOrder(false)}
                        style={{
                          width: "100%",
                          padding: "10px",
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
                    </form>
                  )}

                  {/* Trust badges */}
                  <div
                    style={{
                      marginTop: 16,
                      paddingTop: 16,
                      borderTop: `1px solid ${C.creamBorder}`,
                    }}
                  >
                    {[
                      "🔒 Escrow payment protection",
                      "✅ Verified seller check",
                      "↩️ Dispute resolution available",
                    ].map((item, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: 12,
                          color: C.creamMuted,
                          marginBottom: 6,
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ padding: "20px 0", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>😔</div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: C.creamText,
                      marginBottom: 4,
                    }}
                  >
                    Sold Out
                  </div>
                  <div style={{ fontSize: 12, color: C.creamMuted }}>
                    This product is currently unavailable.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
