import { useEffect, useMemo, useState } from "react";
import { Card, GhostBtn, I } from "./TeacherShared";

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

function iconForType(type) {
  const value = (type || "").toUpperCase();
  if (value.includes("FEE")) return { icon: <I.Fees />, bg: "bg-red-100 text-red-600" };
  if (value.includes("CONTENT")) return { icon: <I.File />, bg: "bg-purple-100 text-purple-600" };
  return { icon: <I.Alert />, bg: "bg-amber-100 text-amber-600" };
}

function dayGroup(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Earlier";
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startYesterday = new Date(startToday);
  startYesterday.setDate(startYesterday.getDate() - 1);
  if (date >= startToday) return "Today";
  if (date >= startYesterday && date < startToday) return "Yesterday";
  return "Earlier";
}

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function NotificationsPage({ t }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotifications() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/notifications`, {
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      });
      const data = await response.json().catch(() => []);
      if (!response.ok) throw new Error(data?.message || "Unable to load notifications");
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load notifications");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id) {
    try {
      const response = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      });
      if (!response.ok) return;
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, unread: false } : item)));
    } catch {
      // no-op
    }
  }

  async function markAllRead() {
    try {
      const response = await fetch(`${API_BASE}/api/notifications/read-all`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      });
      const data = await response.json().catch(() => []);
      if (!response.ok) return;
      setItems(Array.isArray(data) ? data : []);
    } catch {
      // no-op
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  const groups = useMemo(() => {
    const bucket = { Today: [], Yesterday: [], Earlier: [] };
    items.forEach((item) => {
      const label = dayGroup(item.createdAt);
      const iconMeta = iconForType(item.type);
      bucket[label].push({
        id: item.id,
        icon: iconMeta.icon,
        bg: iconMeta.bg,
        title: item.title,
        body: item.body,
        time: formatTime(item.createdAt),
        unread: item.unread,
      });
    });
    return ["Today", "Yesterday", "Earlier"].map((label) => ({ label, items: bucket[label] })).filter((group) => group.items.length > 0);
  }, [items]);

  const unreadCount = items.filter((item) => item.unread).length;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <span className={`text-sm ${t.textSub}`}>{unreadCount} unread notifications</span>
        <GhostBtn small t={t} onClick={markAllRead}>Mark all as read</GhostBtn>
      </div>

      {error && <div className={`${t.card} rounded-xl px-4 py-3 text-sm text-red-500`}>{error}</div>}

      {loading && <div className={`${t.card} rounded-xl px-4 py-3 text-sm ${t.textSub}`}>Loading notifications...</div>}

      {!loading && groups.length === 0 && <div className={`${t.card} rounded-xl px-4 py-3 text-sm ${t.textSub}`}>No notifications yet.</div>}

      {groups.map((group) => (
        <div key={group.label}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${t.sectionLabel}`}>{group.label}</p>
          <div className={`${t.card} rounded-xl overflow-hidden`}>
            {group.items.map((item) => (
              <button key={item.id} onClick={() => markRead(item.id)} className={`w-full text-left flex gap-3 px-5 py-4 border-b last:border-0 ${t.divider}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${item.bg}`}>{item.icon}</div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${t.text}`}>{item.title}</p>
                  <p className={`text-xs ${t.textSub} mt-0.5`}>{item.body}</p>
                  <p className={`text-xs ${t.textTert} mt-1`}>{item.time}</p>
                </div>
                {item.unread && <div className="w-2 h-2 rounded-full bg-[#a435f0] flex-shrink-0 mt-2" />}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
