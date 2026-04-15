import { useEffect, useMemo, useState } from "react";
import { Badge, Icons, OutlineBtn, SectionCard } from "./StudentShared";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

function getAuthHeaders() {
  try {
    const raw = localStorage.getItem("ep_auth");
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

function badgeVariant(status) {
  const value = (status || "").toLowerCase();
  if (value.includes("paid")) return "green";
  if (value.includes("over")) return "red";
  return "amber";
}

export default function FeesPage({ t }) {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFees() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/student/fees`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      const data = await response.json().catch(() => []);
      if (!response.ok) {
        throw new Error(data?.message || "Unable to load fees");
      }
      setFees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load fees");
      setFees([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFees();
  }, []);

  const currentFee = useMemo(() => {
    const currentMonth = monthNow();
    return fees.find((item) => item.feeMonth === currentMonth) || fees[0] || null;
  }, [fees]);

  const summary = useMemo(() => {
    const totalPaid = fees
      .filter((item) => (item.status || "").toLowerCase().includes("paid"))
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const outstanding = fees
      .filter((item) => !(item.status || "").toLowerCase().includes("paid"))
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    return { totalPaid, outstanding };
  }, [fees]);

  return (
    <div className="p-6 space-y-5">
      {error && <div className={`${t.card} rounded-xl px-4 py-3 text-sm text-red-500`}>{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={`${t.feeGreen} rounded-xl p-5`}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">{formatMonth(currentFee?.feeMonth)} - Current Month</p>
          <p className="text-4xl font-bold">LKR {Number(currentFee?.amount || 0).toLocaleString()}</p>
          <p className="text-sm mt-1 opacity-80">{currentFee?.paidOn ? `Paid on ${formatDate(currentFee.paidOn)}` : `Due on ${formatDate(currentFee?.dueDate)}`}</p>
          <button className="mt-4 w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold py-2.5 rounded-md transition-colors cursor-pointer">
            <Icons.Download /> Download Receipt
          </button>
        </div>

        <SectionCard title="Payment Summary" t={t}>
          {[
            ["Monthly fee", `LKR ${Number(currentFee?.amount || 0).toLocaleString()}`, ""],
            ["Batch", currentFee?.grade || "-", ""],
            ["Total paid", `LKR ${summary.totalPaid.toLocaleString()}`, "text-emerald-500"],
            ["Outstanding", `LKR ${summary.outstanding.toLocaleString()}`, summary.outstanding > 0 ? "text-red-500" : "text-emerald-500"],
          ].map(([k, v, vc]) => (
            <div key={k} className="flex justify-between py-2.5 border-b last:border-0 border-inherit text-sm">
              <span className={t.textSub}>{k}</span>
              <span className={`font-semibold ${vc || t.text}`}>{v}</span>
            </div>
          ))}
        </SectionCard>
      </div>

      <SectionCard title="Payment History" t={t}>
        <table className="w-full text-sm">
          <thead>
            <tr className={t.tableHead}>
              {["Month", "Amount", "Paid On", "Status", "Receipt"].map((h) => (
                <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider py-2 px-3 first:pl-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr className={t.tableRow}><td className={`py-3 px-3 pl-0 ${t.textSub}`} colSpan={5}>Loading fee history...</td></tr>
            )}

            {!loading && fees.length === 0 && (
              <tr className={t.tableRow}><td className={`py-3 px-3 pl-0 ${t.textSub}`} colSpan={5}>No fee records available yet.</td></tr>
            )}

            {!loading && fees.map((item) => (
              <tr key={item.id} className={t.tableRow}>
                <td className={`py-3 px-3 pl-0 ${t.text}`}>{formatMonth(item.feeMonth)}</td>
                <td className={`py-3 px-3 font-semibold ${t.text}`}>{`LKR ${Number(item.amount || 0).toLocaleString()}`}</td>
                <td className={`py-3 px-3 ${t.textSub}`}>{formatDate(item.paidOn || item.dueDate)}</td>
                <td className="py-3 px-3"><Badge variant={badgeVariant(item.status)} t={t}>{item.status}</Badge></td>
                <td className="py-3 px-3"><OutlineBtn small t={t}><Icons.Download />Download</OutlineBtn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}
