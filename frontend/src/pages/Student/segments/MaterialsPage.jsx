import { useEffect, useMemo, useState } from "react";
import { Badge, Icons, PrimaryBtn, SectionCard } from "./StudentShared";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

function getAuthHeaders() {
  try {
    const raw = sessionStorage.getItem("ep_auth");
    if (!raw) return {};
    const auth = JSON.parse(raw);
    if (!auth?.basicToken) return {};
    return { Authorization: `Basic ${auth.basicToken}` };
  } catch {
    return {};
  }
}

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso) {
  if (!iso) return "Unknown date";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown date";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function prettyType(type) {
  if (!type) return "Other";
  return type.replace(/_/g, " ");
}

function iconForType(type) {
  const upper = (type || "").toUpperCase();
  if (upper === "VIDEO") {
    return { icon: <Icons.Video />, iconBg: "bg-purple-100 text-purple-600" };
  }
  if (upper === "DOC") {
    return { icon: <Icons.File />, iconBg: "bg-blue-100 text-blue-600" };
  }
  if (upper === "LINK") {
    return { icon: <Icons.Book />, iconBg: "bg-emerald-100 text-emerald-600" };
  }
  return { icon: <Icons.File />, iconBg: "bg-red-100 text-red-600" };
}

export default function MaterialsPage({ t }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  async function loadMaterials() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/materials`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      const data = await response.json().catch(() => []);
      if (!response.ok) {
        throw new Error(data?.message || "Unable to load materials");
      }
      setMaterials(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load materials");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMaterials();
  }, []);

  const batches = useMemo(() => Array.from(new Set(materials.map((m) => m.batchName).filter(Boolean))), [materials]);
  const types = useMemo(() => Array.from(new Set(materials.map((m) => m.materialType).filter(Boolean))), [materials]);

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      const hitBatch = batchFilter === "all" || m.batchName === batchFilter;
      const hitType = typeFilter === "all" || m.materialType === typeFilter;
      return hitBatch && hitType;
    });
  }, [materials, batchFilter, typeFilter]);

  const grouped = useMemo(() => {
    return filtered.reduce((acc, material) => {
      const key = material.batchName || "General";
      if (!acc[key]) acc[key] = [];
      acc[key].push(material);
      return acc;
    }, {});
  }, [filtered]);

  async function openMaterial(material) {
    if (material.externalUrl) {
      window.open(material.externalUrl, "_blank", "noopener,noreferrer");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}${material.actionUrl}`, {
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Unable to download material");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = material.originalFileName || material.title || "material";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Unable to download material");
    }
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex gap-3 flex-wrap">
        <select
          className={`${t.selectBg} rounded-lg px-3 py-2 text-sm cursor-pointer focus:outline-none`}
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
        >
          <option value="all">All batches</option>
          {batches.map((batch) => (
            <option key={batch} value={batch}>{batch}</option>
          ))}
        </select>

        <select
          className={`${t.selectBg} rounded-lg px-3 py-2 text-sm cursor-pointer focus:outline-none`}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All types</option>
          {types.map((type) => (
            <option key={type} value={type}>{prettyType(type)}</option>
          ))}
        </select>

        <PrimaryBtn onClick={loadMaterials}>Refresh</PrimaryBtn>
      </div>

      {error && (
        <div className={`${t.card} rounded-xl px-4 py-3 text-sm text-red-500`}>
          {error}
        </div>
      )}

      {loading && (
        <div className={`${t.card} rounded-xl px-4 py-4 text-sm ${t.textSub}`}>
          Loading materials...
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className={`${t.card} rounded-xl px-4 py-4 text-sm ${t.textSub}`}>
          No materials available yet.
        </div>
      )}

      {!loading && Object.entries(grouped).map(([batchName, items]) => (
        <SectionCard key={batchName} title={batchName} extra={<Badge variant="purple" t={t}>{items.length} items</Badge>} t={t}>
          <div className="space-y-1">
            {items.map((item) => {
              const icon = iconForType(item.materialType);
              const meta = [
                prettyType(item.materialType),
                item.externalUrl ? "External link" : formatBytes(item.sizeBytes),
                `Added ${formatDate(item.createdAt)}`,
              ].filter(Boolean).join(" - ");
              return (
                <div key={item.id} className="flex items-center gap-3 py-3 border-b last:border-0 border-inherit">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${icon.iconBg}`}>{icon.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${t.text} truncate`}>{item.title}</p>
                    <p className={`text-xs ${t.textTert} mt-0.5`}>{meta}</p>
                  </div>
                  <PrimaryBtn small onClick={() => openMaterial(item)}>{item.externalUrl ? "Open" : "Download"}</PrimaryBtn>
                </div>
              );
            })}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
