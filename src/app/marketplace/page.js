"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../lib/api";
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
};
const fmt = (n) => (n != null ? `₦${Number(n).toLocaleString()}` : "₦0");
const CATS = [
  {
    key: "live_birds",
    label: "Live Birds",
    emoji: "🐔",
    desc: "Broilers, layers",
  },
  { key: "day_old_chicks", label: "Chicks", emoji: "🐣", desc: "Hatcheries" },
  { key: "eggs", label: "Eggs", emoji: "🥚", desc: "Crates & bulk" },
  { key: "feed", label: "Feed", emoji: "🌾", desc: "All phases" },
  { key: "medication", label: "Meds", emoji: "💊", desc: "Vaccines" },
  { key: "equipment", label: "Equipment", emoji: "🏠", desc: "Feeders" },
  {
    key: "raw_materials",
    label: "Raw Materials",
    emoji: "🌽",
    desc: "Maize, soya",
  },
];
const EMOJI = {
  live_birds: "🐔",
  day_old_chicks: "🐣",
  eggs: "🥚",
  feed: "🌾",
  medication: "💊",
  equipment: "🏠",
  raw_materials: "🌽",
};

function Skeleton({ h = 20, w = "100%" }) {
  return (
    <div
      style={{
        height: h,
        width: w,
        borderRadius: 6,
        background: `linear-gradient(90deg,${C.creamSurface} 25%,${C.creamBorder} 50%,${C.creamSurface} 75%)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
  );
}

function ProductCard({ product, isMobile }) {
  const [h, sH] = useState(false);
  const ce = EMOJI[product.category] || "📦";
  return (
    <Link
      href={`/marketplace/products/${product._id}`}
      style={{ textDecoration: "none" }}
    >
      <div
        onMouseEnter={() => sH(true)}
        onMouseLeave={() => sH(false)}
        style={{
          background: "#fff",
          border: `1px solid ${h ? C.green : C.creamBorder}`,
          borderRadius: 14,
          overflow: "hidden",
          transition: "all 0.2s",
          transform: h ? "translateY(-3px)" : "none",
          boxShadow: h
            ? "0 8px 24px rgba(45,122,58,0.12)"
            : "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            height: isMobile ? 130 : 180,
            background: `linear-gradient(135deg,${C.creamSurface},${C.creamBorder})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <span style={{ fontSize: isMobile ? 36 : 52 }}>{ce}</span>
          {product.isFeatured && (
            <div
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                background: `linear-gradient(135deg,${C.gold},${C.goldLight})`,
                color: "#fff",
                fontSize: 9,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 100,
              }}
            >
              ★ Featured
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
                  fontSize: 11,
                  fontWeight: 700,
                  background: "rgba(0,0,0,0.5)",
                  padding: "4px 10px",
                  borderRadius: 8,
                }}
              >
                Sold Out
              </span>
            </div>
          )}
          {product.quantity > 0 && product.quantity < 10 && (
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "rgba(192,57,43,0.9)",
                color: "#fff",
                fontSize: 9,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 100,
              }}
            >
              Only {product.quantity}
            </div>
          )}
        </div>
        <div style={{ padding: isMobile ? "10px 12px" : "14px 16px" }}>
          <div
            style={{
              fontSize: isMobile ? 12 : 14,
              fontWeight: 700,
              color: C.creamText,
              marginBottom: 3,
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.name}
          </div>
          <div
            style={{
              fontSize: 10,
              color: C.creamMuted,
              marginBottom: 6,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {product.storeId?.name} · 📍{" "}
            {product.storeId?.location || "Nigeria"}
          </div>
          {product.storeId?.rating > 0 && (
            <div style={{ marginBottom: 6 }}>
              <span style={{ color: C.gold, fontSize: 10 }}>
                {"★".repeat(Math.round(product.storeId.rating))}
              </span>
              <span
                style={{ fontSize: 10, color: C.creamMuted, marginLeft: 4 }}
              >
                {product.storeId.rating}
              </span>
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
              <div
                style={{
                  fontSize: isMobile ? 14 : 18,
                  fontWeight: 800,
                  color: C.green,
                }}
              >
                {fmt(product.price)}
              </div>
              <div style={{ fontSize: 9, color: C.creamMuted }}>
                {product.unit}
              </div>
            </div>
            <div
              style={{
                padding: isMobile ? "4px 8px" : "5px 10px",
                borderRadius: 7,
                background: `linear-gradient(135deg,${C.green},${C.greenLight})`,
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              View
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function MarketplaceContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const category = sp.get("category") || "";
  const search = sp.get("search") || "";

  useEffect(() => {
    fetchProducts();
  }, [category, search, page, sortBy]);
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (category) p.set("category", category);
      if (search) p.set("search", search);
      if (priceRange.min) p.set("minPrice", priceRange.min);
      if (priceRange.max) p.set("maxPrice", priceRange.max);
      p.set("page", page);
      p.set("limit", 20);
      const res = await api.get(`/products?${p}`);
      setProducts(res.data.products || []);
      setTotalPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const curCat = CATS.find((c) => c.key === category);

  return (
    <div>
      {/* Hero */}
      {!category && !search && (
        <div
          style={{
            background: "linear-gradient(135deg,#1A3D22,#0F1F14)",
            borderRadius: isMobile ? 12 : 16,
            padding: isMobile ? "24px 18px" : "40px 48px",
            marginBottom: isMobile ? 16 : 28,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -20,
              top: -20,
              fontSize: isMobile ? 100 : 160,
              opacity: 0.06,
            }}
          >
            🐔
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: 100,
                background: "rgba(45,122,58,0.3)",
                border: "1px solid #2D7A3A",
                fontSize: 10,
                fontWeight: 700,
                color: "#6FCF7F",
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Nigeria's Poultry Marketplace
            </div>
            <div
              style={{
                fontFamily: "Playfair Display,Georgia,serif",
                fontSize: isMobile ? 22 : 32,
                fontWeight: 800,
                color: "#FAF7F2",
                marginBottom: 8,
              }}
            >
              Buy & Sell Poultry Products
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 15,
                color: "rgba(240,235,224,0.7)",
                maxWidth: 480,
                lineHeight: 1.7,
                marginBottom: isMobile ? 16 : 24,
              }}
            >
              Connect with verified farmers. Escrow payments protect every
              transaction.
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link
                href="/marketplace/store"
                style={{
                  padding: isMobile ? "10px 18px" : "12px 24px",
                  borderRadius: 9,
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: 700,
                  background: `linear-gradient(135deg,${C.green},${C.greenLight})`,
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                🏪 Open Store
              </Link>
              <a
                href="#products"
                style={{
                  padding: isMobile ? "10px 18px" : "12px 24px",
                  borderRadius: 9,
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: 600,
                  color: "#6FCF7F",
                  textDecoration: "none",
                  border: "1.5px solid rgba(111,207,127,0.4)",
                }}
              >
                Browse ↓
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      {!category && !search && (
        <div style={{ marginBottom: isMobile ? 16 : 32 }}>
          <div
            style={{
              fontSize: isMobile ? 14 : 16,
              fontWeight: 700,
              color: C.creamText,
              marginBottom: 12,
            }}
          >
            Browse by Category
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(3,1fr)" : "repeat(7,1fr)",
              gap: isMobile ? 8 : 10,
            }}
          >
            {CATS.map((cat) => (
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
                    padding: isMobile ? "10px 6px" : "14px 10px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{ fontSize: isMobile ? 22 : 28, marginBottom: 4 }}
                  >
                    {cat.emoji}
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? 10 : 11,
                      fontWeight: 600,
                      color: C.creamText,
                    }}
                  >
                    {cat.label}
                  </div>
                  {!isMobile && (
                    <div style={{ fontSize: 9, color: C.creamMuted }}>
                      {cat.desc}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div id="products">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div>
            <div
              style={{
                fontSize: isMobile ? 14 : 16,
                fontWeight: 700,
                color: C.creamText,
              }}
            >
              {search
                ? `"${search}"`
                : curCat
                  ? `${curCat.emoji} ${curCat.label}`
                  : "All Products"}
            </div>
            <div style={{ fontSize: 11, color: C.creamMuted }}>
              {loading ? "Loading..." : total + " products"}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {!isMobile && (
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "7px 10px",
                  borderRadius: 8,
                  fontSize: 11,
                  background: "#fff",
                  border: `1px solid ${C.creamBorder}`,
                  color: C.creamText,
                  cursor: "pointer",
                  fontFamily: "Inter,sans-serif",
                  outline: "none",
                }}
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price ↑</option>
                <option value="price_high">Price ↓</option>
                <option value="featured">Featured</option>
              </select>
            )}
            <input
              type="number"
              placeholder="Min ₦"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange((p) => ({ ...p, min: e.target.value }))
              }
              style={{
                width: isMobile ? 55 : 80,
                padding: "7px 8px",
                borderRadius: 8,
                fontSize: 11,
                background: "#fff",
                border: `1px solid ${C.creamBorder}`,
                color: C.creamText,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <span style={{ fontSize: 11, color: C.creamMuted }}>–</span>
            <input
              type="number"
              placeholder="Max ₦"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange((p) => ({ ...p, max: e.target.value }))
              }
              style={{
                width: isMobile ? 55 : 80,
                padding: "7px 8px",
                borderRadius: 8,
                fontSize: 11,
                background: "#fff",
                border: `1px solid ${C.creamBorder}`,
                color: C.creamText,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={fetchProducts}
              style={{
                padding: "7px 12px",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 600,
                background: C.green,
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontFamily: "Inter,sans-serif",
              }}
            >
              Filter
            </button>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)",
              gap: isMobile ? 10 : 16,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  overflow: "hidden",
                  border: `1px solid ${C.creamBorder}`,
                }}
              >
                <Skeleton h={isMobile ? 130 : 180} />
                <div style={{ padding: 12 }}>
                  <Skeleton h={14} w="80%" />
                  <div style={{ height: 8 }} />
                  <Skeleton h={24} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2,1fr)"
                  : "repeat(4,1fr)",
                gap: isMobile ? 10 : 16,
                marginBottom: 20,
              }}
            >
              {products.map((p) => (
                <ProductCard key={p._id} product={p} isMobile={isMobile} />
              ))}
            </div>
            {totalPages > 1 && (
              <div
                style={{ display: "flex", justifyContent: "center", gap: 6 }}
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        border: `1px solid ${p === page ? C.green : C.creamBorder}`,
                        background: p === page ? C.green : "#fff",
                        color: p === page ? "#fff" : C.creamText,
                        cursor: "pointer",
                        fontFamily: "Inter,sans-serif",
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
              padding: isMobile ? "40px 16px" : "72px 32px",
              textAlign: "center",
              background: "#fff",
              border: `1px solid ${C.creamBorder}`,
              borderRadius: 16,
            }}
          >
            <div style={{ fontSize: isMobile ? 40 : 56, marginBottom: 12 }}>
              {curCat ? curCat.emoji : "🏪"}
            </div>
            <div
              style={{
                fontSize: isMobile ? 15 : 18,
                fontWeight: 700,
                color: C.creamText,
                marginBottom: 8,
              }}
            >
              {search ? `No results for "${search}"` : "No products yet"}
            </div>
            <Link
              href="/marketplace/store"
              style={{
                display: "inline-flex",
                padding: "10px 20px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                background: `linear-gradient(135deg,${C.green},${C.greenLight})`,
                color: "#fff",
                textDecoration: "none",
                marginTop: 10,
              }}
            >
              + List Products
            </Link>
          </div>
        )}
      </div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 40, textAlign: "center", color: "#8A7560" }}>
          Loading...
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}
