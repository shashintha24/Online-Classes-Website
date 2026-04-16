import { useEffect, useMemo, useState } from "react";
import { Badge, Card, GhostBtn, I, Metric, PrimaryBtn, Td, Th } from "./TeacherShared";

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

function monthNow() {
  return new Date().toISOString().slice(0, 7);
}

function formatMonth(value) {
  if (!value) return "-";
  const date = new Date(`${value}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function statusMeta(status) {
  const value = (status || "").toLowerCase();
  if (value.includes("paid")) return { v: "green", label: "Paid" };
  if (value.includes("over")) return { v: "red", label: "Overdue" };
  return { v: "amber", label: "Pending" };
}

function batchBadgeClass(batchName) {
  const palette = [
    "bg-violet-100 text-violet-700",
    "bg-sky-100 text-sky-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-indigo-100 text-indigo-700",
  ];

  const key = (batchName || "General").toLowerCase();
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % palette.length;
  return palette[idx];
}

export default function FeesPage({ t }) {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [month, setMonth] = useState(monthNow());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    studentUserId: "",
    amount: "",
    dueDate: "",
    paidOn: "",
  });

  async function loadFeesData(targetMonth = month) {
    setLoading(true);
    setError("");
    try {
      const [studentsRes, feesRes] = await Promise.all([
        fetch(`${API_BASE}/api/teacher/assignments/students`, {
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        }),
        fetch(`${API_BASE}/api/teacher/fees?month=${encodeURIComponent(targetMonth)}`, {
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        }),
      ]);

      const studentsData = await studentsRes.json().catch(() => []);
      const feesData = await feesRes.json().catch(() => []);

      if (!studentsRes.ok) throw new Error(studentsData?.message || "Unable to load students");
      if (!feesRes.ok) throw new Error(feesData?.message || "Unable to load fees");

      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setPayments(Array.isArray(feesData) ? feesData : []);
    } catch (err) {
      setError(err.message || "Unable to load fees data");
      setStudents([]);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeesData(month);
  }, [month]);

  const feeData = useMemo(() => {
    const base = [];
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthKey = d.toISOString().slice(0, 7);
      const total = payments
        .filter((item) => item.feeMonth === monthKey && (item.status || "").toLowerCase().includes("paid"))
        .reduce((sum, item) => sum + Number(item.amount || 0), 0);
      base.push({
        month: d.toLocaleDateString(undefined, { month: "short" }),
        value: total,
      });
    }
    return base;
  }, [payments]);

  const maxVal = Math.max(...feeData.map((item) => item.value), 1);
  const paidRows = payments.filter((row) => (row.status || "").toLowerCase().includes("paid"));
  const unpaidRows = payments.filter((row) => !(row.status || "").toLowerCase().includes("paid"));
  const collected = paidRows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const pending = unpaidRows.reduce((sum, row) => sum + Number(row.amount || 0), 0);

  async function addFee() {
    if (!form.studentUserId || !form.amount || !form.dueDate) {
      setError("Student, amount, and due date are required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/teacher/fees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          studentUserId: Number(form.studentUserId),
          feeMonth: month,
          amount: Number(form.amount),
          dueDate: form.dueDate,
          paidOn: form.paidOn || null,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Unable to save fee");
      }

      setForm({ studentUserId: "", amount: "", dueDate: "", paidOn: "" });
      await loadFeesData(month);
    } catch (err) {
      setError(err.message || "Unable to save fee");
    } finally {
      setSaving(false);
    }
  }

  async function markAsPaid(id) {
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/teacher/fees/${id}/mark-paid`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Unable to mark paid");
      }
      await loadFeesData(month);
    } catch (err) {
      setError(err.message || "Unable to mark paid");
    }
  }

  return (
    <div className="p-6 space-y-4">
      <Card title="Add Class Fee (Manual)" t={t}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <label className="block">
            <span className={`text-xs ${t.textSub}`}>Month</span>
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className={`mt-1 w-full rounded-lg px-3 py-2 text-sm ${t.inputBg} outline-none`} />
          </label>
          <label className="block md:col-span-2">
            <span className={`text-xs ${t.textSub}`}>Student</span>
            <select value={form.studentUserId} onChange={(e) => setForm((prev) => ({ ...prev, studentUserId: e.target.value }))} className={`mt-1 w-full rounded-lg px-3 py-2 text-sm ${t.selectBg} outline-none`}>
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student.userId} value={student.userId}>{student.fullName} - {student.grade}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={`text-xs ${t.textSub}`}>Amount (LKR)</span>
            <input type="number" value={form.amount} onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))} className={`mt-1 w-full rounded-lg px-3 py-2 text-sm ${t.inputBg} outline-none`} placeholder="4500" />
          </label>
          <label className="block">
            <span className={`text-xs ${t.textSub}`}>Due Date</span>
            <input type="date" value={form.dueDate} onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))} className={`mt-1 w-full rounded-lg px-3 py-2 text-sm ${t.inputBg} outline-none`} />
          </label>
          <label className="block">
            <span className={`text-xs ${t.textSub}`}>Paid On (Optional)</span>
            <input type="date" value={form.paidOn} onChange={(e) => setForm((prev) => ({ ...prev, paidOn: e.target.value }))} className={`mt-1 w-full rounded-lg px-3 py-2 text-sm ${t.inputBg} outline-none`} />
          </label>
          <div className="md:col-span-4" />
          <PrimaryBtn onClick={addFee}>{saving ? "Saving..." : "Add / Update Fee"}</PrimaryBtn>
        </div>
      </Card>

      {error && <div className={`${t.card} rounded-xl px-4 py-3 text-sm text-red-500`}>{error}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Metric label={`Collected - ${formatMonth(month)}`} value={`LKR ${(collected / 1000).toFixed(1)}k`} color="text-emerald-500" t={t} />
        <Metric label="Pending Amount" value={`LKR ${(pending / 1000).toFixed(1)}k`} color="text-red-500" t={t} />
        <Metric label="Paid Students" value={`${paidRows.length}/${payments.length}`} color="text-blue-500" t={t} />
        <Metric label="Pending" value={`${payments.filter((row) => !(row.status || "").toLowerCase().includes("paid")).length}`} color="text-red-500" t={t} />
      </div>

      <Card title={`${formatMonth(month)} Fee Status`} extra={<GhostBtn small t={t} onClick={() => loadFeesData(month)}>{loading ? "Loading..." : "Refresh"}</GhostBtn>} t={t} noPad>
        <table className="w-full">
          <thead><tr className={t.tableHead}>{["Student", "Batch", "Amount", "Due Date", "Paid On", "Status", "Action"].map((h) => <Th key={h} t={t}>{h}</Th>)}</tr></thead>
          <tbody>
            {loading && (
              <tr className={t.tableRow}><Td t={t} colSpan={7} className={t.textSub}>Loading fees...</Td></tr>
            )}

            {!loading && payments.length === 0 && (
              <tr className={t.tableRow}><Td t={t} colSpan={7} className={t.textSub}>No fee records for this month.</Td></tr>
            )}

            {!loading && payments.map((row) => {
              const status = statusMeta(row.status);
              return (
              <tr key={row.id} className={t.tableRow}>
                <Td t={t}><span className="font-medium">{row.studentName}</span></Td>
                <Td t={t}>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${batchBadgeClass(row.grade)}`}>
                    {row.grade || "General"}
                  </span>
                </Td><Td t={t}>{`LKR ${Number(row.amount || 0).toLocaleString()}`}</Td>
                <Td t={t}>{formatDate(row.dueDate)}</Td><Td t={t}>{formatDate(row.paidOn)}</Td>
                <td className="py-3 px-3"><Badge v={status.v} t={t}>{status.label}</Badge></td>
                <td className="py-3 px-3 pr-5">
                  {status.label === "Paid" ? <GhostBtn small t={t}><I.Download />Receipt</GhostBtn> : <PrimaryBtn small onClick={() => markAsPaid(row.id)}>Mark Paid</PrimaryBtn>}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Card title="Fee Collection - Last 6 Months" t={t}>
        <div className="flex items-end gap-3 h-44 px-2">
          {feeData.map((item, i) => {
            const pct = (item.value / maxVal) * 100;
            const isLast = i === feeData.length - 1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <span className={`text-[10px] font-semibold ${isLast ? "text-[#a435f0]" : t.textTert}`}>{Math.round(item.value / 1000)}k</span>
                <div className="w-full flex items-end" style={{ height: "120px" }}>
                  <div className={`w-full rounded-t-md transition-all ${isLast ? "bg-[#a435f0]" : t.barBg} hover:opacity-80`} style={{ height: `${pct}%` }} />
                </div>
                <span className={`text-[10px] ${t.textTert}`}>{item.month}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
