"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../lib/api";
import toast from "react-hot-toast";

const C = {
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
  goldLight: "#E8C76A",
  textMuted: "#5A6B5E",
};

const CATEGORIES = [
  {
    key: "live_birds",
    label: "Live Birds",
    emoji: "🐔",
    desc: "Broilers, layers, cockerels",
  },
  {
    key: "day_old_chicks",
    label: "Day-old Chicks",
    emoji: "🐣",
    desc: "From registered hatcheries",
  },
  { key: "eggs", label: "Eggs", emoji: "🥚", desc: "Crates and bulk orders" },
  {
    key: "feed",
    label: "Feed & Nutrition",
    emoji: "🌾",
    desc: "Starter, grower, finisher",
  },
  {
    key: "medication",
    label: "Medication",
    emoji: "💊",
    desc: "Vaccines and treatments",
  },
  {
    key: "equipment",
    label: "Equipment",
    emoji: "🏠",
    desc: "Feeders, drinkers, cages",
  },
  {
    key: "raw_materials",
    label: "Raw Materials",
    emoji: "🌽",
    desc: "Maize, soya, ingredients",
  },
];

const fmt = (n) => (n != null ? `₦${Number(n).toLocaleString()}` : "₦0");

function Skeleton({ h = 20, w = "100%", radius = 6 }) {
  return (
    <div
      style={{
        height: h,
        width: w,
        borderRadius: radius,
        background: `linear-gradient(90deg, ${C.creamSurface} 25%, ${C.creamBorder} 50%, ${C.creamSurface} 75%)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
  );
}

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);

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
    <Link
      href={`/marketplace/products/${product._id}`}
      style={{ textDecoration: "none" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#fff",
          border: `1px solid ${hovered ? C.green : C.creamBorder}`,
          borderRadius: 14,
          overflow: "hidden",
          transition: "all 0.2s",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          boxShadow: hovered
            ? "0 8px 24px rgba(45,122,58,0.12)"
            : "0 1px 4px rgba(0,0,0,0.06)",
          cursor: "pointer",
        }}
      >
        {/* Product image / placeholder */}
        <div
          style={{
            height: 180,
            background: product.photos?.[0]
              ? `url(${product.photos[0]}) center/cover no-repeat`
              : `linear-gradient(135deg, ${C.creamSurface}, ${C.creamBorder})`,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!product.photos?.[0] && (
            <span style={{ fontSize: 52 }}>{categoryEmoji}</span>
          )}
          {product.isFeatured && (
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 100,
              }}
            >
              ★ Featured
            </div>
          )}
          {product.quantity < 10 && product.quantity > 0 && (
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "rgba(192,57,43,0.9)",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 100,
              }}
            >
              Only {product.quantity} left
            </div>
          )}
          {product.quantity === 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  background: "rgba(0,0,0,0.5)",
                  padding: "6px 14px",
                  borderRadius: 8,
                }}
              >
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding: "14px 16px" }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: C.creamText,
              marginBottom: 4,
              lineHeight: 1.3,
            }}
          >
            {product.name}
          </div>
          <div style={{ fontSize: 11, color: C.creamMuted, marginBottom: 10 }}>
            {product.storeId?.name} · 📍{" "}
            {product.storeId?.location || "Nigeria"}
          </div>

          {/* Rating */}
          {product.storeId?.rating > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginBottom: 8,
              }}
            >
              <span style={{ color: C.gold, fontSize: 11 }}>
                {"★".repeat(Math.round(product.storeId.rating))}
              </span>
              <span style={{ fontSize: 11, color: C.creamMuted }}>
                {product.storeId.rating}
              </span>
              {product.storeId.isVerified && (
                <span
                  style={{
                    marginLeft: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.green,
                    background: `${C.green}15`,
                    padding: "1px 7px",
                    borderRadius: 100,
                    border: `1px solid ${C.green}`,
                  }}
                >
                  ✓ Verified
                </span>
              )}
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.green }}>
                {fmt(product.price)}
              </div>
              <div style={{ fontSize: 10, color: C.creamMuted }}>
                {product.unit}
              </div>
            </div>
            <div
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                background:
                  product.quantity === 0
                    ? C.creamSurface
                    : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                color: product.quantity === 0 ? C.creamMuted : "#fff",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {product.quantity === 0 ? "Sold Out" : "View →"}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  useEffect(() => {
    fetchProducts();
  }, [category, search, page, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (search) params.set("search", search);
      if (priceRange.min) params.set("minPrice", priceRange.min);
      if (priceRange.max) params.set("maxPrice", priceRange.max);
      params.set("page", page);
      params.set("limit", 20);

      const res = await api.get(`/products?${params}`);
      setProducts(res.data.products || []);
      setTotalPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const currentCat = CATEGORIES.find((c) => c.key === category);

  return (
    <div>
      {/* ── Hero Banner (only on home) ── */}
      {!category && !search && (
        <div
          style={{
            background: `linear-gradient(135deg, #1A3D22, #0F1F14)`,
            borderRadius: 16,
            padding: "40px 48px",
            marginBottom: 28,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -20,
              top: -20,
              fontSize: 160,
              opacity: 0.06,
            }}
          >
            🐔
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "inline-block",
                padding: "4px 14px",
                borderRadius: 100,
                background: "rgba(45,122,58,0.3)",
                border: "1px solid #2D7A3A",
                fontSize: 11,
                fontWeight: 700,
                color: C.greenGlow,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Nigeria's Poultry Marketplace
            </div>
            <div
              style={{
                fontFamily: "Playfair Display, Georgia, serif",
                fontSize: 32,
                fontWeight: 800,
                color: "#FAF7F2",
                marginBottom: 10,
              }}
            >
              Buy & Sell Poultry Products
            </div>
            <div
              style={{
                fontSize: 15,
                color: "rgba(240,235,224,0.7)",
                maxWidth: 480,
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              Connect directly with verified poultry farmers across Nigeria.
              Escrow payments protect every transaction.
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Link
                href="/marketplace/store"
                style={{
                  padding: "12px 24px",
                  borderRadius: 9,
                  fontSize: 14,
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                  color: "#fff",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(45,122,58,0.4)",
                }}
              >
                🏪 Open Your Store
              </Link>
              <a
                href="#products"
                style={{
                  padding: "12px 24px",
                  borderRadius: 9,
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.greenGlow,
                  textDecoration: "none",
                  border: "1.5px solid rgba(111,207,127,0.4)",
                }}
              >
                Browse Products ↓
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Category Cards (home only) ── */}
      {!category && !search && (
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: C.creamText,
              marginBottom: 14,
            }}
          >
            Browse by Category
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 10,
            }}
          >
            {CATEGORIES.filter((c) => c.key).map((cat) => (
              <Link
                key={cat.key}
                href={`/marketplace?category=${cat.key}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "#fff",
                    border: `1px solid ${C.creamBorder}`,
                    borderRadius: 12,
                    padding: "14px 10px",
                    textAlign: "center",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = C.green;
                    e.currentTarget.style.background = "#F0F7F0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.creamBorder;
                    e.currentTarget.style.background = "#fff";
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 6 }}>
                    {cat.emoji}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.creamText,
                      marginBottom: 2,
                    }}
                  >
                    {cat.label}
                  </div>
                  <div style={{ fontSize: 10, color: C.creamMuted }}>
                    {cat.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Products Section ── */}
      <div id="products">
        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.creamText }}>
              {search
                ? `Results for "${search}"`
                : currentCat
                  ? `${currentCat.emoji} ${currentCat.label}`
                  : "All Products"}
            </div>
            <div style={{ fontSize: 12, color: C.creamMuted, marginTop: 2 }}>
              {loading ? "Loading..." : `${total} products found`}
            </div>
          </div>

          {/* Sort + Filter */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                fontSize: 12,
                background: "#fff",
                border: `1px solid ${C.creamBorder}`,
                color: C.creamText,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                outline: "none",
              }}
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="featured">Featured First</option>
            </select>

            {/* Price filter */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                type="number"
                placeholder="Min ₦"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange((p) => ({ ...p, min: e.target.value }))
                }
                style={{
                  width: 80,
                  padding: "8px 10px",
                  borderRadius: 8,
                  fontSize: 12,
                  background: "#fff",
                  border: `1px solid ${C.creamBorder}`,
                  color: C.creamText,
                  fontFamily: "Inter, sans-serif",
                  outline: "none",
                }}
              />
              <span style={{ fontSize: 12, color: C.creamMuted }}>–</span>
              <input
                type="number"
                placeholder="Max ₦"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange((p) => ({ ...p, max: e.target.value }))
                }
                style={{
                  width: 80,
                  padding: "8px 10px",
                  borderRadius: 8,
                  fontSize: 12,
                  background: "#fff",
                  border: `1px solid ${C.creamBorder}`,
                  color: C.creamText,
                  fontFamily: "Inter, sans-serif",
                  outline: "none",
                }}
              />
              <button
                onClick={fetchProducts}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  background: C.green,
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  overflow: "hidden",
                  border: `1px solid ${C.creamBorder}`,
                }}
              >
                <Skeleton h={180} radius={0} />
                <div style={{ padding: 14 }}>
                  <Skeleton h={16} w="80%" radius={4} />
                  <div style={{ height: 8 }} />
                  <Skeleton h={12} w="50%" radius={4} />
                  <div style={{ height: 12 }} />
                  <Skeleton h={28} radius={6} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
                marginBottom: 24,
              }}
            >
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{ display: "flex", justifyContent: "center", gap: 8 }}
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        border: `1px solid ${p === page ? C.green : C.creamBorder}`,
                        background: p === page ? C.green : "#fff",
                        color: p === page ? "#fff" : C.creamText,
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              padding: "72px 32px",
              textAlign: "center",
              background: "#fff",
              border: `1px solid ${C.creamBorder}`,
              borderRadius: 16,
            }}
          >
            <div style={{ fontSize: 56, marginBottom: 16 }}>
              {currentCat ? currentCat.emoji : "🏪"}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: C.creamText,
                marginBottom: 8,
              }}
            >
              {search ? `No results for "${search}"` : "No products yet"}
            </div>
            <div
              style={{ fontSize: 14, color: C.creamMuted, marginBottom: 20 }}
            >
              {search
                ? "Try different keywords"
                : "Be the first to list a product in this category."}
            </div>
            <Link
              href="/marketplace/store"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "11px 22px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                color: "#fff",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(45,122,58,0.3)",
              }}
            >
              + List Your Products
            </Link>
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

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 40, textAlign: "center", color: "#8A7560" }}>
          Loading marketplace...
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}
