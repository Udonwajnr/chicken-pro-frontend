"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../../../lib/api";
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

const CATEGORY_EMOJI = {
  live_birds: "🐔",
  day_old_chicks: "🐣",
  eggs: "🥚",
  feed: "🌾",
  medication: "💊",
  equipment: "🏠",
  raw_materials: "🌽",
};

export default function PublicStorePage() {
  const params = useParams();
  const router = useRouter();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("products");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchStore();
  }, [params.id]);

  const fetchStore = async () => {
    setLoading(true);
    try {
      const [storeRes, reviewRes] = await Promise.all([
        api.get(`/stores/${params.id}`),
        api.get(`/reviews/store/${params.id}`),
      ]);
      setStore(storeRes.data.store);
      setProducts(storeRes.data.products || []);
      setReviews(reviewRes.data.reviews || []);
    } catch {
      toast.error("Store not found");
      router.push("/marketplace");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div
        style={{ padding: "64px", textAlign: "center", color: C.creamMuted }}
      >
        <div style={{ fontSize: 36, marginBottom: 12 }}>🏪</div>
        Loading store...
      </div>
    );

  if (!store) return null;

  const categories = [...new Set(products.map((p) => p.category))];
  const filtered = filter
    ? products.filter((p) => p.category === filter)
    : products;
  const avgRating = reviews.length
    ? parseFloat(
        (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1),
      )
    : 0;

  return (
    <div>
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
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
        <span style={{ color: C.creamText }}>{store.name}</span>
      </div>

      {/* ── Store Hero Banner ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1A3D22, #0F1F14)",
          borderRadius: 16,
          padding: "36px 40px",
          marginBottom: 28,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -20,
            bottom: -20,
            fontSize: 180,
            opacity: 0.05,
          }}
        >
          🏪
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 22,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Store avatar */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              flexShrink: 0,
              background: `linear-gradient(135deg, ${C.green}, ${C.gold})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
            }}
          >
            🏪
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 6,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "Playfair Display, Georgia, serif",
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#FAF7F2",
                }}
              >
                {store.name}
              </span>
              {store.isVerified && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.greenGlow,
                    background: "rgba(45,122,58,0.3)",
                    padding: "3px 12px",
                    borderRadius: 100,
                    border: `1px solid ${C.green}`,
                  }}
                >
                  ✓ Verified Seller
                </span>
              )}
            </div>

            {store.description && (
              <div
                style={{
                  fontSize: 14,
                  color: "#A89880",
                  marginBottom: 12,
                  lineHeight: 1.6,
                  maxWidth: 500,
                }}
              >
                {store.description}
              </div>
            )}

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {[
                { icon: "📍", value: store.location || "Nigeria" },
                {
                  icon: "⭐",
                  value: `${avgRating} (${reviews.length} reviews)`,
                },
                { icon: "📦", value: `${products.length} products` },
                {
                  icon: "✅",
                  value: `${store.totalSales || 0} completed sales`,
                },
                store.phone && { icon: "📞", value: store.phone },
              ]
                .filter(Boolean)
                .map((item, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: 13,
                      color: "#A89880",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <span>{item.icon}</span> {item.value}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div
        style={{
          display: "flex",
          gap: 2,
          background: C.creamSurface,
          border: `1px solid ${C.creamBorder}`,
          borderRadius: 10,
          padding: 4,
          marginBottom: 24,
          width: "fit-content",
        }}
      >
        {[
          { key: "products", label: `🐔 Products (${products.length})` },
          { key: "reviews", label: `⭐ Reviews (${reviews.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "9px 20px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              background: tab === t.key ? C.green : "transparent",
              color: tab === t.key ? "#fff" : C.creamMuted,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Products Tab ── */}
      {tab === "products" && (
        <div>
          {/* Category filter */}
          {categories.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setFilter("")}
                style={{
                  padding: "6px 14px",
                  borderRadius: 100,
                  fontSize: 12,
                  fontWeight: 600,
                  border: `1px solid ${!filter ? C.green : C.creamBorder}`,
                  background: !filter ? C.greenFaint : "#fff",
                  color: !filter ? C.greenGlow : C.creamMuted,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 600,
                    border: `1px solid ${filter === cat ? C.green : C.creamBorder}`,
                    background: filter === cat ? C.greenFaint : "#fff",
                    color: filter === cat ? C.greenGlow : C.creamMuted,
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {CATEGORY_EMOJI[cat]} {cat.replace("_", " ")}
                </button>
              ))}
            </div>
          )}

          {filtered.length ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
              }}
            >
              {filtered.map((product) => (
                <Link
                  key={product._id}
                  href={`/marketplace/products/${product._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: "#fff",
                      border: `1px solid ${C.creamBorder}`,
                      borderRadius: 14,
                      overflow: "hidden",
                      transition: "all 0.2s",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = C.green;
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(45,122,58,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = C.creamBorder;
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 1px 4px rgba(0,0,0,0.06)";
                    }}
                  >
                    <div
                      style={{
                        height: 160,
                        background: product.photos?.[0]
                          ? `url(${product.photos[0]}) center/cover no-repeat`
                          : `linear-gradient(135deg, ${C.creamSurface}, ${C.creamBorder})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {!product.photos?.[0] && (
                        <span style={{ fontSize: 44 }}>
                          {CATEGORY_EMOJI[product.category] || "📦"}
                        </span>
                      )}
                    </div>
                    <div style={{ padding: "14px 16px" }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: C.creamText,
                          marginBottom: 4,
                          lineHeight: 1.3,
                        }}
                      >
                        {product.name}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 16,
                              fontWeight: 800,
                              color: C.green,
                            }}
                          >
                            {fmt(product.price)}
                          </div>
                          <div style={{ fontSize: 10, color: C.creamMuted }}>
                            {product.unit}
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: C.creamMuted }}>
                          {product.quantity} left
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: "48px",
                textAlign: "center",
                background: "#fff",
                border: `1px solid ${C.creamBorder}`,
                borderRadius: 14,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 10 }}>📦</div>
              <div style={{ fontSize: 14, color: C.creamMuted }}>
                No products in this category.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Reviews Tab ── */}
      {tab === "reviews" && (
        <div>
          {/* Rating summary */}
          <div
            style={{
              background: "#fff",
              border: `1px solid ${C.creamBorder}`,
              borderRadius: 14,
              padding: "24px",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 52, fontWeight: 900, color: C.green }}>
                  {avgRating}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "center",
                    marginBottom: 4,
                  }}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      style={{
                        fontSize: 18,
                        color:
                          n <= Math.round(avgRating) ? C.gold : C.creamBorder,
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: C.creamMuted }}>
                  {reviews.length} reviews
                </div>
              </div>
              {/* Rating breakdown */}
              <div style={{ flex: 1 }}>
                {[5, 4, 3, 2, 1].map((n) => {
                  const count = reviews.filter((r) => r.rating === n).length;
                  const pct = reviews.length
                    ? (count / reviews.length) * 100
                    : 0;
                  return (
                    <div
                      key={n}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: C.creamMuted,
                          width: 20,
                          textAlign: "right",
                        }}
                      >
                        {n}★
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 8,
                          background: C.creamSurface,
                          borderRadius: 100,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`,
                            borderRadius: 100,
                          }}
                        />
                      </div>
                      <span
                        style={{ fontSize: 11, color: C.creamMuted, width: 20 }}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Individual reviews */}
          {reviews.length ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {reviews.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    border: `1px solid ${C.creamBorder}`,
                    borderRadius: 12,
                    padding: "18px 20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: `linear-gradient(135deg, ${C.green}, ${C.gold})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {r.reviewerId?.name?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: C.creamText,
                          }}
                        >
                          {r.reviewerId?.name}
                        </span>
                        <span style={{ fontSize: 11, color: C.creamMuted }}>
                          {new Date(r.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span
                            key={n}
                            style={{
                              fontSize: 14,
                              color: n <= r.rating ? C.gold : C.creamBorder,
                            }}
                          >
                            ★
                          </span>
                        ))}
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: "48px",
                textAlign: "center",
                background: "#fff",
                border: `1px solid ${C.creamBorder}`,
                borderRadius: 14,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 10 }}>⭐</div>
              <div style={{ fontSize: 14, color: C.creamMuted }}>
                No reviews yet. Be the first to buy and review.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
