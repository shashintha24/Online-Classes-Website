import { useEffect, useMemo, useState } from "react";
import { Badge, PrimaryBtn, SectionCard } from "./StudentShared";

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

function formatDate(isoDate) {
  if (!isoDate) return "-";
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function formatTime(value) {
  if (!value) return "-";
  const date = new Date(`2000-01-01T${value}`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function SchedulePage({ t }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSchedules() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/student/schedules/upcoming?limit=25`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });

      const data = await response.json().catch(() => []);
      if (!response.ok) {
        throw new Error(data?.message || "Unable to load schedules");
      }

      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load schedules");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSchedules();
  }, []);

  const grouped = useMemo(() => {
    return items.reduce((acc, item) => {
      const key = item.classDate || "Unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [items]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className={`text-sm ${t.textSub}`}>Upcoming classes and repeating weekly schedule</p>
        <PrimaryBtn onClick={loadSchedules}>Refresh</PrimaryBtn>
      </div>

      {error && <div className={`${t.card} rounded-xl px-4 py-3 text-sm text-red-500`}>{error}</div>}
      {loading && <div className={`${t.card} rounded-xl px-4 py-3 text-sm ${t.textSub}`}>Loading schedule...</div>}
      {!loading && items.length === 0 && <div className={`${t.card} rounded-xl px-4 py-3 text-sm ${t.textSub}`}>No upcoming classes scheduled yet.</div>}

      {!loading && Object.entries(grouped).map(([dateKey, dayItems]) => (
        <SectionCard
          key={dateKey}
          title={formatDate(dateKey)}
          extra={<Badge variant="purple" t={t}>{dayItems.length} classes</Badge>}
          t={t}
        >
          <div className="space-y-2">
            {dayItems.map((item) => (
              <div key={`${item.scheduleId}-${item.classDate}-${item.startTime}`} className={`rounded-xl p-3 ${t.metric}`}>
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold ${t.text}`}>{item.title}</p>
                  {item.weeklyRecurring && <Badge variant="amber" t={t}>Weekly</Badge>}
                </div>
                <p className={`text-xs ${t.textSub} mt-1`}>
                  {formatTime(item.startTime)}{item.endTime ? ` - ${formatTime(item.endTime)}` : ""}
                </p>
                <p className={`text-xs ${t.textTert} mt-0.5`}>
                  {(item.subject || "General")}{item.batchName ? ` - ${item.batchName}` : ""}
                </p>
                {item.description && <p className={`text-xs ${t.textSub} mt-1`}>{item.description}</p>}
              </div>
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
