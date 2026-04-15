import { useEffect, useMemo, useState } from "react";
import { Badge, MetricCard, SectionCard } from "./StudentShared";

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

function formatCheckIn(value) {
  if (!value || value === "-") return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function statusVariant(status) {
  const normalized = (status || "").toLowerCase();
  if (normalized.includes("present")) return "green";
  if (normalized.includes("late")) return "amber";
  if (normalized.includes("not")) return "red";
  return "gray";
}

export default function AttendancePage({ t }) {
  const [qrInfo, setQrInfo] = useState(null);
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAttendanceData() {
    setLoading(true);
    setError("");
    try {
      const [qrRes, logRes] = await Promise.all([
        fetch(`${API_BASE}/api/student/attendance/qr`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }),
        fetch(`${API_BASE}/api/student/attendance/log`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }),
      ]);

      const qrData = await qrRes.json().catch(() => ({}));
      const logData = await logRes.json().catch(() => []);

      if (!qrRes.ok) throw new Error(qrData?.message || "Unable to load QR data");
      if (!logRes.ok) throw new Error(logData?.message || "Unable to load attendance log");

      setQrInfo(qrData || null);
      setLog(Array.isArray(logData) ? logData : []);
    } catch (err) {
      setError(err.message || "Unable to load attendance data");
      setQrInfo(null);
      setLog([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const attendance = useMemo(() => {
    const map = {};
    log.forEach((entry) => {
      const date = new Date(entry.attendanceDate);
      if (Number.isNaN(date.getTime())) return;
      const day = date.getDate();
      map[day] = (entry.status || "").toLowerCase().includes("present") ? "p" : "a";
    });
    return map;
  }, [log]);

  const metrics = useMemo(() => {
    const presentDays = log.filter((entry) => (entry.status || "").toLowerCase().includes("present")).length;
    const absentDays = log.filter((entry) => (entry.status || "").toLowerCase().includes("absent")).length;
    const totalTracked = presentDays + absentDays;
    const percentage = totalTracked ? Math.round((presentDays / totalTracked) * 100) : 0;
    return { presentDays, absentDays, percentage };
  }, [log]);

  const days = [];
  for (let i = 0; i < 2; i++) days.push(<div key={`e${i}`} />);
  for (let d = 1; d <= 30; d++) {
    const s = attendance[d];
    const cls = s === "p" ? "bg-emerald-500 text-white" : s === "a" ? "bg-red-500 text-white" : `${t.calNoClass}`;
    days.push(
      <div key={d} className={`aspect-square rounded flex items-center justify-center text-[10px] font-semibold ${cls}`}>{d}</div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      {error && <div className={`${t.card} rounded-xl px-4 py-3 text-sm text-red-500`}>{error}</div>}

      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Overall Attendance" value={`${metrics.percentage}%`} color="text-emerald-500" t={t} />
        <MetricCard label="Present Days" value={String(metrics.presentDays)} color="text-blue-500" t={t} />
        <MetricCard label="Absent Days" value={String(metrics.absentDays)} color="text-red-500" t={t} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard
          title="My Unique Attendance QR"
          extra={<Badge variant={statusVariant(qrInfo?.todayStatus)} t={t}>{qrInfo?.todayStatus || "Not Marked"}</Badge>}
          t={t}
        >
          {loading && <p className={`text-sm ${t.textSub}`}>Loading QR...</p>}

          {!loading && qrInfo && (
            <div className="space-y-3">
              <div className="w-44 h-44 rounded-xl border border-[#a435f0]/40 mx-auto bg-white p-2 flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrInfo.qrCode)}`}
                  alt="Student attendance QR"
                  className="w-40 h-40"
                />
              </div>
              <p className={`text-center text-xs font-semibold tracking-widest ${t.text}`}>{qrInfo.qrCode}</p>
              <p className={`text-center text-xs ${t.textSub}`}>
                {qrInfo.studentName} · {qrInfo.grade}
              </p>
              <p className={`text-center text-xs ${t.textSub}`}>
                Today check-in: {qrInfo.todayCheckInTime || "-"}
              </p>
            </div>
          )}
        </SectionCard>

        <SectionCard title="April 2026 Calendar" t={t}>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div key={i} className={`text-center text-[10px] font-semibold ${t.textTert}`}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">{days}</div>
          <div className={`flex gap-4 mt-3 text-xs ${t.textSub}`}>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />Present</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500 inline-block" />Absent</span>
            <span className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded inline-block ${t.barBg}`} />No class</span>
          </div>
        </SectionCard>

        <SectionCard title="QR Attendance Info" t={t}>
          <div className="space-y-3">
            <div className={`${t.barBg} rounded-lg p-3`}>
              <p className={`text-xs ${t.textSub}`}>How to mark attendance</p>
              <p className={`text-sm ${t.text} mt-1`}>Open this QR in class and show it to the teacher scanner.</p>
            </div>
            <div className={`${t.barBg} rounded-lg p-3`}>
              <p className={`text-xs ${t.textSub}`}>Unique student ID</p>
              <p className={`text-sm font-semibold ${t.text} mt-1`}>{qrInfo?.studentUserId || "-"}</p>
            </div>
          </div>
          <div className={`mt-4 p-3 ${t.barBg} rounded-lg`}>
            <p className={`text-xs ${t.textSub}`}>Today's status</p>
            <p className="text-sm font-semibold text-emerald-500 mt-0.5">{qrInfo?.todayStatus || "Not Marked"}</p>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Attendance Log" t={t}>
        <table className="w-full text-sm">
          <thead>
            <tr className={t.tableHead}>
              {["Date", "Subject", "Check-in", "Method", "Status"].map((h) => (
                <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider py-2 px-3 first:pl-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className={`py-3 px-3 pl-0 ${t.textSub}`} colSpan={5}>Loading attendance log...</td>
              </tr>
            )}

            {!loading && log.length === 0 && (
              <tr>
                <td className={`py-3 px-3 pl-0 ${t.textSub}`} colSpan={5}>No attendance records yet.</td>
              </tr>
            )}

            {!loading && log.map((entry) => {
              const date = new Date(entry.attendanceDate);
              const dateLabel = Number.isNaN(date.getTime())
                ? entry.attendanceDate
                : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
              return (
                <tr key={entry.id} className={t.tableRow}>
                  <td className={`py-3 px-3 pl-0 ${t.textSub}`}>{dateLabel}</td>
                  <td className={`py-3 px-3 ${t.text}`}>Physics</td>
                  <td className={`py-3 px-3 ${t.textSub}`}>{formatCheckIn(entry.checkInTime)}</td>
                  <td className={`py-3 px-3 ${t.textSub}`}>{entry.method || "-"}</td>
                  <td className="py-3 px-3"><Badge variant={statusVariant(entry.status)} t={t}>{entry.status}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}
