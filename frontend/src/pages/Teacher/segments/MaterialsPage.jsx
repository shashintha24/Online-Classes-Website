import { useEffect, useMemo, useState } from "react";
import { Card, GhostBtn, I, PrimaryBtn } from "./TeacherShared";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const MATERIAL_TYPES = ["PDF", "VIDEO", "PAST_PAPER", "DOC", "LINK", "OTHER"];

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

function labelType(type) {
  if (!type) return "Other";
  return type.replace(/_/g, " ");
}

function materialVisual(materialType) {
  const t = (materialType || "").toUpperCase();
  if (t === "VIDEO") return { bg: "bg-purple-100 text-purple-600", icon: <I.Video /> };
  if (t === "DOC") return { bg: "bg-blue-100 text-blue-600", icon: <I.Doc /> };
  if (t === "LINK") return { bg: "bg-emerald-100 text-emerald-600", icon: <I.Materials /> };
  return { bg: "bg-red-100 text-red-600", icon: <I.File /> };
}

export default function MaterialsPage({ t }) {
  const [materials, setMaterials] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState("file");
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    title: "",
    batchName: "",
    materialType: "PDF",
    description: "",
    externalUrl: "",
    file: null,
  });

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

  useEffect(() => {
    async function loadBatchOptions() {
      try {
        const response = await fetch(`${API_BASE}/api/batches/active`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        });
        const data = await response.json().catch(() => []);
        if (!response.ok || !Array.isArray(data)) {
          return;
        }
        const options = Array.from(new Set(
          data
            .map((item) => item?.name)
            .filter((name) => typeof name === "string" && name.trim().length > 0)
            .map((name) => name.trim()),
        ));
        setBatchOptions(options);
      } catch {
        // Keep UI functional if batch API fails.
      }
    }

    loadBatchOptions();
  }, []);

  const batches = useMemo(() => {
    return Array.from(new Set([...batchOptions, ...materials.map((m) => m.batchName).filter(Boolean)]));
  }, [batchOptions, materials]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return materials.filter((m) => {
      const hitQuery = !q
        || m.title?.toLowerCase().includes(q)
        || m.description?.toLowerCase().includes(q)
        || m.originalFileName?.toLowerCase().includes(q);
      const hitBatch = batchFilter === "all" || m.batchName === batchFilter;
      const hitType = typeFilter === "all" || m.materialType === typeFilter;
      return hitQuery && hitBatch && hitType;
    });
  }, [materials, query, batchFilter, typeFilter]);

  const groupedByBatch = useMemo(() => {
    return filtered.reduce((acc, material) => {
      const key = material.batchName || "General";
      if (!acc[key]) acc[key] = [];
      acc[key].push(material);
      return acc;
    }, {});
  }, [filtered]);

  const stats = useMemo(() => {
    const pdfCount = materials.filter((m) => m.materialType === "PDF" || m.materialType === "DOC" || m.materialType === "PAST_PAPER").length;
    const videoCount = materials.filter((m) => m.materialType === "VIDEO").length;
    const linkCount = materials.filter((m) => m.external).length;
    return [
      [String(pdfCount), "Documents", "text-[#a435f0]"],
      [String(videoCount), "Video Lessons", "text-emerald-500"],
      [String(linkCount), "External Links", "text-amber-500"],
    ];
  }, [materials]);

  function openModal() {
    const defaultBatch = batchOptions[0] || "";
    setForm({
      title: "",
      batchName: defaultBatch,
      materialType: "PDF",
      description: "",
      externalUrl: "",
      file: null,
    });
    setUploadMode("file");
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (uploading) return;
    setModalOpen(false);
    setFormError("");
  }

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleUploadSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      setFormError("Title is required");
      return;
    }
    if (uploadMode === "file" && !form.file) {
      setFormError("Select a file to upload");
      return;
    }
    if (uploadMode === "link" && !form.externalUrl.trim()) {
      setFormError("Paste the Google Drive or video link");
      return;
    }

    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("batchName", form.batchName.trim() || "General");
    payload.append("materialType", form.materialType);
    payload.append("description", form.description.trim());

    if (uploadMode === "file" && form.file) {
      payload.append("file", form.file);
    }
    if (uploadMode === "link") {
      payload.append("externalUrl", form.externalUrl.trim());
    }

    setUploading(true);
    setFormError("");
    try {
      const response = await fetch(`${API_BASE}/api/materials/upload`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
        },
        body: payload,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Upload failed");
      }
      setModalOpen(false);
      await loadMaterials();
    } catch (err) {
      setFormError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

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

  async function deleteMaterial(materialId) {
    const ok = window.confirm("Delete this material? This cannot be undone.");
    if (!ok) return;

    try {
      const response = await fetch(`${API_BASE}/api/materials/${materialId}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Unable to delete material");
      }
      await loadMaterials();
    } catch (err) {
      setError(err.message || "Unable to delete material");
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div className="flex gap-3 flex-wrap">
          <div className={`flex items-center gap-2 min-w-[220px] ${t.inputBg} rounded-lg px-3 py-2`}>
            <I.Search />
            <input
              className="bg-transparent outline-none text-sm w-full"
              placeholder="Search materials..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

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
            {MATERIAL_TYPES.map((type) => (
              <option key={type} value={type}>{labelType(type)}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <GhostBtn t={t} onClick={loadMaterials}>Refresh</GhostBtn>
          <PrimaryBtn onClick={openModal}>+ Upload Material</PrimaryBtn>
        </div>
      </div>

      {error && <div className={`${t.card} rounded-xl mb-4 px-4 py-3 text-sm text-red-500`}>{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {stats.map(([n, l, c]) => (
          <div key={l} className={`${t.statCard} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${c}`}>{n}</p>
            <p className={`text-xs mt-1 ${t.textSub}`}>{l}</p>
          </div>
        ))}
      </div>

      {loading && <div className={`${t.card} rounded-xl px-4 py-4 text-sm ${t.textSub}`}>Loading materials...</div>}

      {!loading && filtered.length === 0 && (
        <div className={`${t.card} rounded-xl px-4 py-6 text-sm ${t.textSub}`}>
          No materials found. Upload your first file or paste a Google Drive link.
        </div>
      )}

      {!loading && Object.entries(groupedByBatch).map(([batchName, items]) => (
        <Card key={batchName} title={batchName} t={t}>
          <div className="space-y-1">
            {items.map((item) => {
              const visual = materialVisual(item.materialType);
              const meta = [
                labelType(item.materialType),
                item.externalUrl ? "External link" : formatBytes(item.sizeBytes),
                `Uploaded ${formatDate(item.createdAt)}`,
              ].filter(Boolean).join(" - ");
              return (
                <div key={item.id} className={`flex items-center gap-3 py-3 border-b last:border-0 ${t.divider}`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${visual.bg}`}>
                    {visual.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${t.text} truncate`}>{item.title}</p>
                    <p className={`text-xs ${t.textTert} mt-0.5`}>{meta}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PrimaryBtn small onClick={() => openMaterial(item)}>{item.externalUrl ? "Open" : "Download"}</PrimaryBtn>
                    <GhostBtn small t={t} onClick={() => deleteMaterial(item.id)}>Delete</GhostBtn>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={closeModal} aria-hidden="true" />
          <div className={`${t.card} relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden`}>
            <div className="px-6 py-4 border-b bg-gradient-to-r from-[#a435f0]/15 to-emerald-400/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`text-lg font-bold ${t.text}`}>Upload Study Material</p>
                  <p className={`text-xs ${t.textSub} mt-1`}>Add files or paste external links just like a shared drive.</p>
                </div>
                <button type="button" onClick={closeModal} className={`p-2 rounded-lg ${t.navHover} ${t.textSub}`}>
                  <I.Close />
                </button>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="px-6 py-5 space-y-4">
              <div className={`inline-flex rounded-xl p-1 ${t.inputBg}`}>
                <button
                  type="button"
                  onClick={() => setUploadMode("file")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${uploadMode === "file" ? "bg-[#a435f0] text-white" : `${t.textSub} ${t.navHover}`}`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("link")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${uploadMode === "link" ? "bg-[#a435f0] text-white" : `${t.textSub} ${t.navHover}`}`}
                >
                  Add Link
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="space-y-1.5">
                  <span className={`text-xs uppercase font-semibold tracking-wide ${t.textTert}`}>Title</span>
                  <input
                    className={`w-full rounded-lg px-3 py-2.5 text-sm outline-none ${t.inputBg}`}
                    placeholder="Electromagnetic Induction Notes"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    required
                  />
                </label>

                <label className="space-y-1.5">
                  <span className={`text-xs uppercase font-semibold tracking-wide ${t.textTert}`}>Batch</span>
                  <select
                    className={`${t.selectBg} w-full rounded-lg px-3 py-2.5 text-sm cursor-pointer focus:outline-none`}
                    value={form.batchName}
                    onChange={(e) => updateField("batchName", e.target.value)}
                  >
                    <option value="">General</option>
                    {batches.map((batch) => (
                      <option key={batch} value={batch}>{batch}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5 sm:col-span-2">
                  <span className={`text-xs uppercase font-semibold tracking-wide ${t.textTert}`}>Material Type</span>
                  <select
                    className={`${t.selectBg} w-full rounded-lg px-3 py-2.5 text-sm cursor-pointer focus:outline-none`}
                    value={form.materialType}
                    onChange={(e) => updateField("materialType", e.target.value)}
                  >
                    {MATERIAL_TYPES.map((type) => (
                      <option key={type} value={type}>{labelType(type)}</option>
                    ))}
                  </select>
                </label>
              </div>

              {uploadMode === "file" ? (
                <label className={`block rounded-xl border-2 border-dashed ${t.divider} p-5 ${t.navHover} cursor-pointer`}>
                  <span className={`text-sm font-semibold ${t.text}`}>{form.file ? form.file.name : "Choose file to upload"}</span>
                  <p className={`text-xs mt-1 ${t.textSub}`}>PDF, DOC, video files or any study material up to your server limit.</p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => updateField("file", e.target.files?.[0] || null)}
                    required={uploadMode === "file"}
                  />
                </label>
              ) : (
                <label className="space-y-1.5 block">
                  <span className={`text-xs uppercase font-semibold tracking-wide ${t.textTert}`}>External Link</span>
                  <input
                    type="url"
                    className={`w-full rounded-lg px-3 py-2.5 text-sm outline-none ${t.inputBg}`}
                    placeholder="https://drive.google.com/..."
                    value={form.externalUrl}
                    onChange={(e) => updateField("externalUrl", e.target.value)}
                    required={uploadMode === "link"}
                  />
                </label>
              )}

              <label className="space-y-1.5 block">
                <span className={`text-xs uppercase font-semibold tracking-wide ${t.textTert}`}>Description</span>
                <textarea
                  rows={3}
                  className={`w-full rounded-lg px-3 py-2.5 text-sm outline-none ${t.inputBg}`}
                  placeholder="Optional short description about this material"
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                />
              </label>

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={closeModal} className={`px-4 py-2 rounded-lg text-sm font-semibold ${t.navHover} ${t.textSub}`}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#a435f0] hover:bg-[#8710d8] text-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Save Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
