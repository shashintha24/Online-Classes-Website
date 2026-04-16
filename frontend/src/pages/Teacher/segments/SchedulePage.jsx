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

function toIsoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatMonthYear(date) {
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function classSlotClass(count) {
  if (count >= 3) return "bg-rose-500 text-white";
  if (count === 2) return "bg-amber-500 text-white";
  return "bg-[#a435f0] text-white";
}

const EMPTY_FORM = {
  title: "",
  subject: "Physics",
  batchName: "",
  description: "",
  startDate: "",
  startTime: "",
  endTime: "",
  weeklyRecurring: false,
  recurrenceEndDate: "",
};

export default function SchedulePage({ t }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [batchOptions, setBatchOptions] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [listRes, upcomingRes] = await Promise.all([
        fetch(`${API_BASE}/api/teacher/schedules`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }),
        fetch(`${API_BASE}/api/student/schedules/upcoming?limit=15`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }),
      ]);

      const listData = await listRes.json().catch(() => []);
      const upcomingData = await upcomingRes.json().catch(() => []);

      if (!listRes.ok) throw new Error(listData?.message || "Unable to load schedules");
      if (!upcomingRes.ok) throw new Error(upcomingData?.message || "Unable to load upcoming classes");

      setSchedules(Array.isArray(listData) ? listData : []);
      setUpcoming(Array.isArray(upcomingData) ? upcomingData : []);
    } catch (err) {
      setError(err.message || "Unable to load scheduling data");
      setSchedules([]);
      setUpcoming([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
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
            .filter((grade) => typeof grade === "string" && grade.trim().length > 0)
            .map((grade) => grade.trim()),
        ));

        if (options.length > 0) {
          setBatchOptions(options);
          setForm((prev) => ({ ...prev, batchName: prev.batchName || options[0] }));
        }
      } catch {
        // Keep defaults if API fails.
      }
    }

    loadBatchOptions();
  }, []);

  const weeklyCount = useMemo(() => schedules.filter((item) => item.weeklyRecurring).length, [schedules]);
  const selectableBatches = useMemo(
    () => Array.from(new Set([...batchOptions, form.batchName].filter((item) => item && item.trim()))),
    [batchOptions, form.batchName],
  );

  const previewMonthDate = useMemo(() => {
    if (upcoming.length > 0 && upcoming[0]?.classDate) {
      const d = new Date(`${upcoming[0].classDate}T00:00:00`);
      if (!Number.isNaN(d.getTime())) {
        return d;
      }
    }
    return new Date();
  }, [upcoming]);

  const classCountByDate = useMemo(() => {
    const map = new Map();
    for (const item of upcoming) {
      if (!item?.classDate) continue;
      map.set(item.classDate, (map.get(item.classDate) || 0) + 1);
    }
    return map;
  }, [upcoming]);

  const previewCalendarCells = useMemo(() => {
    const year = previewMonthDate.getFullYear();
    const month = previewMonthDate.getMonth();
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    const leading = monthStart.getDay();
    const daysInMonth = monthEnd.getDate();
    const todayIso = toIsoDate(new Date());

    const cells = [];
    for (let i = 0; i < leading; i += 1) {
      cells.push({ key: `empty-${i}`, empty: true });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const iso = toIsoDate(date);
      const count = classCountByDate.get(iso) || 0;
      cells.push({
        key: iso,
        day,
        iso,
        count,
        marked: count > 0,
        isToday: iso === todayIso,
      });
    }

    return cells;
  }, [previewMonthDate, classCountByDate]);

  async function saveSchedule() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        ...form,
        recurrenceEndDate: form.weeklyRecurring && form.recurrenceEndDate ? form.recurrenceEndDate : null,
      };

      const response = await fetch(`${API_BASE}/api/teacher/schedules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Unable to save schedule");
      }

      setMessage("Class scheduling saved successfully.");
      setForm(EMPTY_FORM);
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to save schedule");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSchedule(id) {
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${API_BASE}/api/teacher/schedules/${id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Unable to delete schedule");
      }

      setMessage("Schedule removed.");
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to delete schedule");
    }
  }

  return (
    <div className="p-6 space-y-4">
      {error && <div className={`${t.card} rounded-xl px-4 py-3 text-sm text-red-500`}>{error}</div>}
      {message && <div className={`${t.card} rounded-xl px-4 py-3 text-sm text-emerald-500`}>{message}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card title="Add Class Schedule" extra={<Badge v="purple" t={t}>Teacher</Badge>} t={t}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className={`rounded-lg px-3 py-2 text-sm focus:outline-none ${t.inputBg}`}
              placeholder="Class title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            />
            <input
              className={`rounded-lg px-3 py-2 text-sm focus:outline-none ${t.inputBg}`}
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
            />
            <select
              className={`rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer ${t.inputBg} sm:col-span-2`}
              value={form.batchName}
              onChange={(e) => setForm((prev) => ({ ...prev, batchName: e.target.value }))}
            >
              <option value="">All batches</option>
              {selectableBatches.map((batch) => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
            <input
              type="date"
              className={`rounded-lg px-3 py-2 text-sm focus:outline-none ${t.inputBg}`}
              value={form.startDate}
              onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="time"
                className={`rounded-lg px-3 py-2 text-sm focus:outline-none ${t.inputBg}`}
                value={form.startTime}
                onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
              />
              <input
                type="time"
                className={`rounded-lg px-3 py-2 text-sm focus:outline-none ${t.inputBg}`}
                value={form.endTime}
                onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
            <textarea
              className={`rounded-lg px-3 py-2 text-sm focus:outline-none ${t.inputBg} sm:col-span-2`}
              rows={3}
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
            <label className={`sm:col-span-2 flex items-center gap-2 text-sm ${t.textSub}`}>
              <input
                type="checkbox"
                checked={form.weeklyRecurring}
                onChange={(e) => setForm((prev) => ({ ...prev, weeklyRecurring: e.target.checked }))}
              />
              Repeat weekly
            </label>

            {form.weeklyRecurring && (
              <input
                type="date"
                className={`rounded-lg px-3 py-2 text-sm focus:outline-none ${t.inputBg} sm:col-span-2`}
                value={form.recurrenceEndDate}
                onChange={(e) => setForm((prev) => ({ ...prev, recurrenceEndDate: e.target.value }))}
                placeholder="Repeat until (optional)"
              />
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <GhostBtn t={t} onClick={loadData}>Refresh</GhostBtn>
            <PrimaryBtn onClick={saveSchedule}>{saving ? "Saving..." : "Save Schedule"}</PrimaryBtn>
          </div>
        </Card>

        <Card title="Upcoming Classes (Preview)" extra={<Badge v="blue" t={t}>{upcoming.length} items</Badge>} t={t}>
          <div className={`rounded-lg p-3 mb-3 ${t.metric}`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-sm font-semibold ${t.text}`}>{formatMonthYear(previewMonthDate)}</p>
              <p className={`text-xs ${t.textSub}`}>Marked days = upcoming classes</p>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                <div key={d} className={`text-center text-[10px] font-semibold ${t.textTert}`}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {previewCalendarCells.map((cell) => {
                if (cell.empty) {
                  return <div key={cell.key} className="aspect-square" />;
                }

                const baseClass = `${t.barBg} ${t.textSub}`;
                const markedClass = classSlotClass(cell.count);
                const todayRingClass = cell.isToday ? " ring-1 ring-emerald-400" : "";

                return (
                  <div
                    key={cell.key}
                    title={cell.marked ? `${cell.count} class${cell.count > 1 ? "es" : ""} on ${formatDate(cell.iso)}` : formatDate(cell.iso)}
                    className={`aspect-square rounded flex items-center justify-center text-[10px] font-semibold ${cell.marked ? markedClass : baseClass}${todayRingClass}`}
                  >
                    {cell.day}
                  </div>
                );
              })}
            </div>
            <div className={`flex items-center gap-4 mt-2 text-xs ${t.textSub}`}>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#a435f0] inline-block" />Class day</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" />2 classes</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" />3+ classes</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-400 inline-block" />Today</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {loading && <div className={`text-sm ${t.textSub}`}>Loading upcoming classes...</div>}
            {!loading && upcoming.length === 0 && <div className={`text-sm ${t.textSub}`}>No upcoming classes yet.</div>}
            {!loading && upcoming.map((item) => (
              <div key={`${item.scheduleId}-${item.classDate}-${item.startTime}`} className={`rounded-lg px-3 py-2 ${t.metric}`}>
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold ${t.text}`}>{item.title}</p>
                  {item.weeklyRecurring && <Badge v="amber" t={t}>Weekly</Badge>}
                </div>
                <p className={`text-xs ${t.textSub} mt-0.5`}>
                  {formatDate(item.classDate)} - {formatTime(item.startTime)}{item.endTime ? ` to ${formatTime(item.endTime)}` : ""}
                </p>
                <p className={`text-xs ${t.textTert} mt-0.5`}>
                  {(item.subject || "General")}{item.batchName ? ` - ${item.batchName}` : ""}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card
        title="Saved Scheduling Plans"
        extra={<Badge v="purple" t={t}>{schedules.length} total · {weeklyCount} weekly</Badge>}
        t={t}
        noPad
      >
        <table className="w-full">
          <thead>
            <tr className={t.tableHead}>
              <Th t={t}>Class</Th>
              <Th t={t}>Date</Th>
              <Th t={t}>Time</Th>
              <Th t={t}>Repeat</Th>
              <Th t={t}>Batch</Th>
              <Th t={t}>Action</Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <Td t={t} className={t.textSub} colSpan={6}>Loading schedules...</Td>
              </tr>
            )}
            {!loading && schedules.length === 0 && (
              <tr>
                <Td t={t} className={t.textSub} colSpan={6}>No scheduling entries yet.</Td>
              </tr>
            )}
            {!loading && schedules.map((row) => (
              <tr key={row.id} className={t.tableRow}>
                <Td t={t}>
                  <div>
                    <p className="font-medium">{row.title}</p>
                    <p className={`text-xs ${t.textTert}`}>{row.subject || "General"}</p>
                  </div>
                </Td>
                <Td t={t}>{formatDate(row.startDate)}</Td>
                <Td t={t}>{formatTime(row.startTime)}{row.endTime ? ` - ${formatTime(row.endTime)}` : ""}</Td>
                <Td t={t}>{row.weeklyRecurring ? `Weekly${row.recurrenceEndDate ? ` until ${formatDate(row.recurrenceEndDate)}` : ""}` : "One time"}</Td>
                <Td t={t}>{row.batchName || "All"}</Td>
                <Td t={t}>
                  <button className="text-xs text-red-500 hover:text-red-600 cursor-pointer" onClick={() => deleteSchedule(row.id)}>Delete</button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
