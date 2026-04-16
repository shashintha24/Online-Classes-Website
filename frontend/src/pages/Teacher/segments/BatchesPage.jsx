import { useEffect, useMemo, useState } from "react";
import { Badge, Card, GhostBtn, PrimaryBtn, Td, Th } from "./TeacherShared";

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

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function BatchesPage({ t }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newBatchName, setNewBatchName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadBatches() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/batches`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });

      const data = await response.json().catch(() => []);
      if (!response.ok) {
        throw new Error(data?.message || "Unable to load batches");
      }
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load batches");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBatches();
  }, []);

  async function addBatch() {
    const name = newBatchName.trim();
    if (!name) {
      setError("Batch name is required");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${API_BASE}/api/batches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ name, active: true }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Unable to add batch");
      }

      setNewBatchName("");
      setMessage("Batch added successfully.");
      await loadBatches();
    } catch (err) {
      setError(err.message || "Unable to add batch");
    } finally {
      setSaving(false);
    }
  }

  async function toggleBatch(row) {
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${API_BASE}/api/batches/${row.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ name: row.name, active: !row.active }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Unable to update batch");
      }

      setMessage(`Batch ${row.active ? "deactivated" : "activated"}.`);
      await loadBatches();
    } catch (err) {
      setError(err.message || "Unable to update batch");
    }
  }

  async function removeBatch(id) {
    const yes = window.confirm("Delete this batch? Students cannot select it for signup.");
    if (!yes) return;

    setError("");
    setMessage("");
    try {
      const response = await fetch(`${API_BASE}/api/batches/${id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Unable to delete batch");
      }

      setMessage("Batch removed.");
      await loadBatches();
    } catch (err) {
      setError(err.message || "Unable to delete batch");
    }
  }

  const activeCount = useMemo(() => items.filter((item) => item.active).length, [items]);

  return (
    <div className="p-6 space-y-4">
      {error && <div className={`${t.card} rounded-xl px-4 py-3 text-sm text-red-500`}>{error}</div>}
      {message && <div className={`${t.card} rounded-xl px-4 py-3 text-sm text-emerald-500`}>{message}</div>}

      <Card title="Add New Batch" extra={<Badge v="purple" t={t}>Admin / Teacher</Badge>} t={t}>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={newBatchName}
            onChange={(e) => setNewBatchName(e.target.value)}
            placeholder="e.g. 2028 A/L Revision"
            className={`flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none ${t.inputBg}`}
          />
          <PrimaryBtn onClick={addBatch}>{saving ? "Adding..." : "Add Batch"}</PrimaryBtn>
          <GhostBtn t={t} onClick={loadBatches}>Refresh</GhostBtn>
        </div>
      </Card>

      <Card title="Existing Batches" extra={<Badge v="blue" t={t}>{activeCount} active / {items.length} total</Badge>} t={t} noPad>
        <table className="w-full">
          <thead>
            <tr className={t.tableHead}>
              <Th t={t}>Batch Name</Th>
              <Th t={t}>Status</Th>
              <Th t={t}>Created</Th>
              <Th t={t}>Action</Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <Td t={t} className={t.textSub} colSpan={4}>Loading batches...</Td>
              </tr>
            )}

            {!loading && items.length === 0 && (
              <tr>
                <Td t={t} className={t.textSub} colSpan={4}>No batches found.</Td>
              </tr>
            )}

            {!loading && items.map((row) => (
              <tr key={row.id} className={t.tableRow}>
                <Td t={t}><span className="font-medium">{row.name}</span></Td>
                <Td t={t}><Badge v={row.active ? "green" : "red"} t={t}>{row.active ? "Active" : "Inactive"}</Badge></Td>
                <Td t={t}>{formatDate(row.createdAt)}</Td>
                <Td t={t}>
                  <div className="flex gap-2">
                    <GhostBtn small t={t} onClick={() => toggleBatch(row)}>{row.active ? "Deactivate" : "Activate"}</GhostBtn>
                    <button className="text-xs text-red-500 hover:text-red-600 cursor-pointer" onClick={() => removeBatch(row.id)}>Delete</button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
