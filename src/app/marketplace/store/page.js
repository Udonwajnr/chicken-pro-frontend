"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../../lib/api";
import { useAuth } from "@/context/AuthContext";
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
  forestSurface: "#162B1C",
  forestBorder: "#234D2E",
  textPrimary: "#F0EBE0",
  textMuted: "#5A6B5E",
};

const fmt = (n) => (n != null ? `₦${Number(n).toLocaleString()}` : "₦0");
const fmtNum = (n) => (n != null ? Number(n).toLocaleString() : "0");

const inputStyle = (focused) => ({
  width: "100%",
  padding: "11px 14px",
  background: "#fff",
  border: `1.5px solid ${focused ? C.green : C.creamBorder}`,
  borderRadius: 8,
  fontSize: 14,
  color: C.creamText,
  fontFamily: "Inter, sans-serif",
  outline: "none",
  transition: "all 0.15s",
  boxSizing: "border-box",
  boxShadow: focused ? "0 0 0 3px rgba(45,122,58,0.12)" : "none",
});

function CreamInput({ label, hint, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: C.creamText,
            marginBottom: 6,
          }}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        style={inputStyle(focused)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {hint && (
        <p style={{ fontSize: 11, color: C.creamMuted, marginTop: 5 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

// ── Store Setup Form ──────────────────────────
function StoreSetup({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Store name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await api.post("/stores", form);
      toast.success("Store created! 🏪");
      onCreated(res.data.store);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create store");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🏪</div>
        <h2
          style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: 28,
            fontWeight: 700,
            color: C.creamText,
            marginBottom: 8,
          }}
        >
          Open Your Store
        </h2>
        <p style={{ fontSize: 14, color: C.creamMuted, lineHeight: 1.6 }}>
          Create your store to start listing products and selling directly to
          buyers across Nigeria.
        </p>
      </div>
      <div
        style={{
          background: "#fff",
          border: `1px solid ${C.creamBorder}`,
          borderRadius: 16,
          padding: "32px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <CreamInput
            label="Store Name *"
            placeholder="e.g. Umoh's Poultry Farm Store"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: C.creamText,
                marginBottom: 6,
              }}
            >
              Description
            </label>
            <textarea
              placeholder="Describe what you sell — breeds, quality, experience..."
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              style={{
                ...inputStyle(false),
                resize: "vertical",
                minHeight: 90,
              }}
            />
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <CreamInput
              label="Location"
              placeholder="Lagos, Ogun..."
              value={form.location}
              onChange={(e) =>
                setForm((p) => ({ ...p, location: e.target.value }))
              }
            />
            <CreamInput
              label="Phone"
              placeholder="08012345678"
              type="tel"
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              background: saving
                ? "#5A6B5E"
                : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              boxShadow: saving ? "none" : "0 4px 14px rgba(45,122,58,0.35)",
              marginTop: 8,
            }}
          >
            {saving ? "Creating Store..." : "Create My Store →"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Product Form ──────────────────────────────
function ProductForm({ onSaved, editProduct, onCancel }) {
  const [form, setForm] = useState(
    editProduct || {
      name: "",
      category: "live_birds",
      description: "",
      price: "",
      quantity: "",
      unit: "per bird",
      deliveryOptions: "local",
    },
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || form.quantity === "") {
      toast.error("Name, price and quantity required");
      return;
    }
    setSaving(true);
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, form);
        toast.success("Product updated");
      } else {
        await api.post("/products", {
          ...form,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
        });
        toast.success("Product listed! 🐔");
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const selectStyle = {
    width: "100%",
    padding: "11px 14px",
    background: "#fff",
    border: `1.5px solid ${C.creamBorder}`,
    borderRadius: 8,
    fontSize: 14,
    color: C.creamText,
    fontFamily: "Inter, sans-serif",
    outline: "none",
    cursor: "pointer",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${C.creamBorder}`,
        borderRadius: 14,
        padding: "24px",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: C.creamText,
          marginBottom: 20,
        }}
      >
        {editProduct ? "Edit Product" : "+ Add New Product"}
      </div>
      <form onSubmit={handleSubmit}>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          <CreamInput
            label="Product Name *"
            placeholder="e.g. Fresh Broilers — 6 weeks"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: C.creamText,
                marginBottom: 6,
              }}
            >
              Category *
            </label>
            <select
              style={selectStyle}
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
            >
              {[
                ["live_birds", "🐔 Live Birds"],
                ["day_old_chicks", "🐣 Day-old Chicks"],
                ["eggs", "🥚 Eggs"],
                ["feed", "🌾 Feed"],
                ["medication", "💊 Medication"],
                ["equipment", "🏠 Equipment"],
                ["raw_materials", "🌽 Raw Materials"],
              ].map(([k, l]) => (
                <option key={k} value={k}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <CreamInput
            label="Price (₦) *"
            type="number"
            placeholder="e.g. 4500"
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
          />
          <CreamInput
            label="Quantity *"
            type="number"
            placeholder="e.g. 150"
            value={form.quantity}
            onChange={(e) =>
              setForm((p) => ({ ...p, quantity: e.target.value }))
            }
          />
          <CreamInput
            label="Unit"
            placeholder="per bird, per crate, per bag"
            value={form.unit}
            onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
          />
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: C.creamText,
                marginBottom: 6,
              }}
            >
              Delivery Option
            </label>
            <select
              style={selectStyle}
              value={form.deliveryOptions}
              onChange={(e) =>
                setForm((p) => ({ ...p, deliveryOptions: e.target.value }))
              }
            >
              <option value="pickup">Pickup only</option>
              <option value="local">Local delivery</option>
              <option value="nationwide">Nationwide</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: C.creamText,
              marginBottom: 6,
            }}
          >
            Description
          </label>
          <textarea
            placeholder="Describe your product — breed, age, weight, health status..."
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            style={{
              width: "100%",
              padding: "10px 14px",
              background: "#fff",
              border: `1.5px solid ${C.creamBorder}`,
              borderRadius: 8,
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
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "11px 24px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              background: saving
                ? "#5A6B5E"
                : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              boxShadow: saving ? "none" : "0 3px 10px rgba(45,122,58,0.3)",
            }}
          >
            {saving
              ? "Saving..."
              : editProduct
                ? "Update Product"
                : "List Product"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "11px 18px",
                borderRadius: 8,
                fontSize: 13,
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
          )}
        </div>
      </form>
    </div>
  );
}

// ══════════════════════════════════════════════
// MAIN MY STORE PAGE
// ══════════════════════════════════════════════
export default function MyStorePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [store, setStore] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("products");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchStore();
  }, [user]);

  const fetchStore = async () => {
    setLoading(true);
    try {
      const [storeRes, dashRes, prodRes] = await Promise.all([
        api.get("/stores/me").catch(() => ({ data: { store: null } })),
        api
          .get("/stores/me/dashboard")
          .catch(() => ({ data: { dashboard: null } })),
        api.get("/products/mine").catch(() => ({ data: { products: [] } })),
      ]);
      setStore(storeRes.data.store);
      setDashboard(dashRes.data.dashboard);
      setProducts(prodRes.data.products || []);
    } catch {
      toast.error("Failed to load store");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts((p) => p.filter((prod) => prod._id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatus = async (product) => {
    const newStatus = product.status === "active" ? "inactive" : "active";
    try {
      await api.put(`/products/${product._id}`, { status: newStatus });
      setProducts((p) =>
        p.map((prod) =>
          prod._id === product._id ? { ...prod, status: newStatus } : prod,
        ),
      );
      toast.success(
        `Product ${newStatus === "active" ? "activated" : "deactivated"}`,
      );
    } catch {
      toast.error("Failed to update product");
    }
  };

  if (loading)
    return (
      <div style={{ padding: 48, textAlign: "center", color: C.creamMuted }}>
        Loading store...
      </div>
    );
  if (!store)
    return (
      <StoreSetup
        onCreated={(s) => {
          setStore(s);
          fetchStore();
        }}
      />
    );

  const d = dashboard?.stats;

  return (
    <div>
      {/* ── Store Header ── */}
      <div
        style={{
          background: `linear-gradient(135deg, #1A3D22, #0F1F14)`,
          borderRadius: 16,
          padding: "28px 32px",
          marginBottom: 24,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${C.green}, ${C.gold})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
            }}
          >
            🏪
          </div>
          <div>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontFamily: "Playfair Display, Georgia, serif",
                  fontSize: 22,
                  fontWeight: 700,
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
                    padding: "2px 10px",
                    borderRadius: 100,
                    border: `1px solid ${C.green}`,
                  }}
                >
                  ✓ Verified
                </span>
              )}
            </div>
            <div style={{ fontSize: 13, color: "#A89880" }}>
              📍 {store.location || "Nigeria"} · ⭐ {store.rating || 0} (
              {store.totalRatings || 0} reviews)
            </div>
            {store.description && (
              <div
                style={{
                  fontSize: 12,
                  color: "#5A6B5E",
                  marginTop: 4,
                  maxWidth: 400,
                }}
              >
                {store.description}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link
            href={`/marketplace/stores/${store._id}`}
            style={{
              padding: "9px 16px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              color: C.greenGlow,
              textDecoration: "none",
              border: "1px solid rgba(111,207,127,0.3)",
              background: "rgba(45,122,58,0.2)",
            }}
          >
            View Public Store →
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          {
            label: "Total Revenue",
            value: fmt(d?.totalRevenue),
            color: C.greenGlow,
          },
          {
            label: "This Month",
            value: fmt(d?.monthRevenue),
            color: C.goldLight,
          },
          {
            label: "Total Orders",
            value: fmtNum(d?.totalOrders),
            color: "#F0EBE0",
          },
          {
            label: "Pending Orders",
            value: fmtNum(d?.pendingOrders),
            color: d?.pendingOrders > 0 ? "#F0A030" : C.greenGlow,
          },
          {
            label: "Active Products",
            value: fmtNum(d?.activeProducts),
            color: "#F0EBE0",
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: C.forestSurface,
              border: `1px solid ${C.forestBorder}`,
              borderRadius: 12,
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1.2,
                color: C.textMuted,
                marginBottom: 6,
              }}
            >
              {s.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
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
          marginBottom: 20,
          width: "fit-content",
        }}
      >
        {[
          { key: "products", label: `🐔 Products (${products.length})` },
          { key: "orders", label: "📦 Orders" },
          { key: "settings", label: "⚙️ Store Settings" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "9px 18px",
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
          {/* Add Product button */}
          {!showAddForm && !editProduct && (
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                color: "#fff",
                boxShadow: "0 3px 10px rgba(45,122,58,0.3)",
                marginBottom: 16,
              }}
            >
              + Add New Product
            </button>
          )}

          {/* Add/Edit Form */}
          {(showAddForm || editProduct) && (
            <ProductForm
              editProduct={editProduct}
              onSaved={() => {
                setShowAddForm(false);
                setEditProduct(null);
                fetchStore();
              }}
              onCancel={() => {
                setShowAddForm(false);
                setEditProduct(null);
              }}
            />
          )}

          {/* Product list */}
          {products.length ? (
            <div
              style={{
                background: "#fff",
                border: `1px solid ${C.creamBorder}`,
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.creamSurface }}>
                    {[
                      "Product",
                      "Category",
                      "Price",
                      "Qty",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 18px",
                          textAlign: "left",
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 1.2,
                          color: C.creamMuted,
                          borderBottom: `1px solid ${C.creamBorder}`,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr
                      key={p._id}
                      style={{ borderBottom: `1px solid ${C.creamBorder}` }}
                    >
                      <td style={{ padding: "14px 18px" }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: C.creamText,
                          }}
                        >
                          {p.name}
                        </div>
                        <div style={{ fontSize: 11, color: C.creamMuted }}>
                          {p.unit}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "14px 18px",
                          fontSize: 12,
                          color: C.creamMuted,
                        }}
                      >
                        {p.category?.replace("_", " ")}
                      </td>
                      <td
                        style={{
                          padding: "14px 18px",
                          fontSize: 13,
                          fontWeight: 700,
                          color: C.green,
                        }}
                      >
                        {fmt(p.price)}
                      </td>
                      <td
                        style={{
                          padding: "14px 18px",
                          fontSize: 13,
                          color: p.quantity < 10 ? "#C0392B" : C.creamText,
                          fontWeight: p.quantity < 10 ? 700 : 400,
                        }}
                      >
                        {p.quantity}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <button
                          onClick={() => toggleStatus(p)}
                          style={{
                            padding: "4px 12px",
                            borderRadius: 100,
                            fontSize: 11,
                            fontWeight: 600,
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "Inter, sans-serif",
                            background:
                              p.status === "active"
                                ? `${C.green}15`
                                : "rgba(192,57,43,0.1)",
                            color: p.status === "active" ? C.green : "#C0392B",
                          }}
                        >
                          {p.status === "active" ? "● Active" : "○ Inactive"}
                        </button>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => {
                              setEditProduct(p);
                              setShowAddForm(false);
                            }}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 7,
                              fontSize: 11,
                              fontWeight: 600,
                              border: `1px solid ${C.creamBorder}`,
                              background: "#fff",
                              color: C.creamText,
                              cursor: "pointer",
                              fontFamily: "Inter, sans-serif",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(p._id)}
                            disabled={deletingId === p._id}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 7,
                              fontSize: 11,
                              fontWeight: 600,
                              border: "1px solid #E8B4B4",
                              background: "#FFF0F0",
                              color: "#C0392B",
                              cursor: "pointer",
                              fontFamily: "Inter, sans-serif",
                            }}
                          >
                            {deletingId === p._id ? "..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: C.creamText,
                  marginBottom: 6,
                }}
              >
                No products yet
              </div>
              <div style={{ fontSize: 13, color: C.creamMuted }}>
                Add your first product to start selling.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Orders Tab ── */}
      {tab === "orders" && <SellerOrders />}

      {/* ── Settings Tab ── */}
      {tab === "settings" && (
        <StoreSettings store={store} onUpdated={fetchStore} />
      )}
    </div>
  );
}

// ── Seller Orders ─────────────────────────────
function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders?role=seller")
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders((p) =>
        p.map((o) => (o._id === orderId ? { ...o, status } : o)),
      );
      toast.success(`Order ${status}`);
    } catch {
      toast.error("Failed to update order");
    }
  };

  const statusColor = {
    pending: "#8A7560",
    paid: "#2471A3",
    confirmed: "#D4860A",
    dispatched: "#C9A84C",
    delivered: "#2D7A3A",
    cancelled: "#C0392B",
    disputed: "#7B1D1D",
  };
  const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;

  if (loading)
    return (
      <div style={{ padding: 32, textAlign: "center", color: C.creamMuted }}>
        Loading orders...
      </div>
    );

  return (
    <div>
      {orders.length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                background: "#fff",
                border: `1px solid ${C.creamBorder}`,
                borderRadius: 14,
                padding: "18px 22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: C.creamText,
                      marginBottom: 4,
                    }}
                  >
                    {order.productName} × {order.quantity}
                  </div>
                  <div style={{ fontSize: 12, color: C.creamMuted }}>
                    Buyer: {order.buyerId?.name} · {order.deliveryType}
                    {order.deliveryAddress && ` · ${order.deliveryAddress}`}
                  </div>
                  <div
                    style={{ fontSize: 11, color: C.creamMuted, marginTop: 2 }}
                  >
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: C.green,
                      marginBottom: 4,
                    }}
                  >
                    {fmt(order.sellerPayout)}
                  </div>
                  <span
                    style={{
                      padding: "3px 12px",
                      borderRadius: 100,
                      fontSize: 11,
                      fontWeight: 700,
                      background: `${statusColor[order.status]}20`,
                      color: statusColor[order.status],
                      border: `1px solid ${statusColor[order.status]}`,
                    }}
                  >
                    {order.status?.charAt(0).toUpperCase() +
                      order.status?.slice(1)}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {order.status === "paid" && (
                  <button
                    onClick={() => updateStatus(order._id, "confirmed")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 7,
                      fontSize: 12,
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
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
                    onClick={() => updateStatus(order._id, "dispatched")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 7,
                      fontSize: 12,
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      background: "#D4860A",
                      color: "#fff",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    🚚 Mark Dispatched
                  </button>
                )}
                {["paid", "confirmed"].includes(order.status) && (
                  <button
                    onClick={() => updateStatus(order._id, "cancelled")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 7,
                      fontSize: 12,
                      fontWeight: 600,
                      border: `1px solid #E8B4B4`,
                      background: "#FFF0F0",
                      color: "#C0392B",
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Cancel
                  </button>
                )}
                <Link
                  href={`/marketplace/messages?order=${order._id}`}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 7,
                    fontSize: 12,
                    fontWeight: 600,
                    border: `1px solid ${C.creamBorder}`,
                    color: C.creamText,
                    textDecoration: "none",
                  }}
                >
                  💬 Chat with Buyer
                </Link>
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
          <div style={{ fontSize: 36, marginBottom: 12 }}>📦</div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: C.creamText,
              marginBottom: 6,
            }}
          >
            No orders yet
          </div>
          <div style={{ fontSize: 13, color: C.creamMuted }}>
            Orders will appear here when buyers purchase from your store.
          </div>
        </div>
      )}
    </div>
  );
}

// ── Store Settings ────────────────────────────
function StoreSettings({ store, onUpdated }) {
  const [form, setForm] = useState({
    name: store.name,
    description: store.description || "",
    location: store.location || "",
    phone: store.phone || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/stores/me", form);
      toast.success("Store updated");
      onUpdated();
    } catch {
      toast.error("Failed to update store");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 560 }}>
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
            fontSize: 14,
            fontWeight: 700,
            color: C.creamText,
            marginBottom: 20,
          }}
        >
          Store Details
        </div>
        <form onSubmit={handleSave}>
          <CreamInput
            label="Store Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: C.creamText,
                marginBottom: 6,
              }}
            >
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "#fff",
                border: `1.5px solid ${C.creamBorder}`,
                borderRadius: 8,
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
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <CreamInput
              label="Location"
              value={form.location}
              onChange={(e) =>
                setForm((p) => ({ ...p, location: e.target.value }))
              }
            />
            <CreamInput
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "11px 24px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              background: saving
                ? "#5A6B5E"
                : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
              color: "#fff",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
