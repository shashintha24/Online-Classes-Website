import { useEffect, useMemo, useState } from "react";
import { Badge, MetricCard, SectionCard } from "./StudentShared";

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

function formatCheckIn(value) {
  if (!value || value === "-") return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatClassDate(value) {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function formatClassTime(value) {
  if (!value) return "-";
  const date = new Date(`2000-01-01T${value}`);
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
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAttendanceData() {
    setLoading(true);
    setError("");
    try {
      const [qrRes, logRes, scheduleRes] = await Promise.all([
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
        fetch(`${API_BASE}/api/student/schedules/upcoming?limit=8`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }),
      ]);

      const qrData = await qrRes.json().catch(() => ({}));
      const logData = await logRes.json().catch(() => []);
      const scheduleData = await scheduleRes.json().catch(() => []);

      if (!qrRes.ok) throw new Error(qrData?.message || "Unable to load QR data");
      if (!logRes.ok) throw new Error(logData?.message || "Unable to load attendance log");
      if (!scheduleRes.ok) throw new Error(scheduleData?.message || "Unable to load class schedule");

      setQrInfo(qrData || null);
      setLog(Array.isArray(logData) ? logData : []);
      setUpcomingClasses(Array.isArray(scheduleData) ? scheduleData : []);
    } catch (err) {
      setError(err.message || "Unable to load attendance data");
      setQrInfo(null);
      setLog([]);
      setUpcomingClasses([]);
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

  const calendarMonthDate = useMemo(() => {
    if (upcomingClasses.length > 0 && upcomingClasses[0]?.classDate) {
      const d = new Date(`${upcomingClasses[0].classDate}T00:00:00`);
      if (!Number.isNaN(d.getTime())) return d;
    }
    return new Date();
  }, [upcomingClasses]);

  const calendarMonthLabel = useMemo(
    () => calendarMonthDate.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
    [calendarMonthDate],
  );

  const attendanceByIsoDate = useMemo(() => {
    const map = new Map();
    log.forEach((entry) => {
      if (!entry?.attendanceDate) return;
      const status = (entry.status || "").toLowerCase().includes("present") ? "p" : "a";
      map.set(entry.attendanceDate, status);
    });
    return map;
  }, [log]);

  const classCountByIsoDate = useMemo(() => {
    const map = new Map();
    upcomingClasses.forEach((item) => {
      if (!item?.classDate) return;
      map.set(item.classDate, (map.get(item.classDate) || 0) + 1);
    });
    return map;
  }, [upcomingClasses]);

  const calendarCells = useMemo(() => {
    const year = calendarMonthDate.getFullYear();
    const month = calendarMonthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leading = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const cells = [];
    for (let i = 0; i < leading; i += 1) {
      cells.push(<div key={`e${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const attendanceStatus = attendanceByIsoDate.get(iso);
      const classCount = classCountByIsoDate.get(iso) || 0;

      let cls = `${t.calNoClass}`;
      if (attendanceStatus === "p") cls = "bg-emerald-500 text-white";
      else if (attendanceStatus === "a") cls = "bg-red-500 text-white";
      else if (classCount > 0) cls = "bg-sky-500 text-white";

      cells.push(
        <div key={iso} title={classCount > 0 ? `${classCount} class${classCount > 1 ? "es" : ""}` : "No class"} className={`aspect-square rounded flex items-center justify-center text-[10px] font-semibold ${cls}`}>
          {day}
        </div>,
      );
    }

    return cells;
  }, [calendarMonthDate, attendanceByIsoDate, classCountByIsoDate, t.calNoClass]);

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

        <SectionCard title={`${calendarMonthLabel} Calendar`} t={t}>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div key={i} className={`text-center text-[10px] font-semibold ${t.textTert}`}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">{calendarCells}</div>
          <div className={`flex gap-4 mt-3 text-xs ${t.textSub}`}>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />Present</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500 inline-block" />Absent</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-sky-500 inline-block" />Upcoming class</span>
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

        <SectionCard title="My Class Schedule" extra={<Badge variant="purple" t={t}>{upcomingClasses.length} upcoming</Badge>} t={t}>
          {loading && <p className={`text-sm ${t.textSub}`}>Loading class schedule...</p>}

          {!loading && upcomingClasses.length === 0 && (
            <p className={`text-sm ${t.textSub}`}>No upcoming classes for your batch.</p>
          )}

          {!loading && upcomingClasses.length > 0 && (
            <div className="space-y-2">
              {upcomingClasses.map((item) => (
                <div key={`${item.scheduleId}-${item.classDate}-${item.startTime}`} className={`${t.barBg} rounded-lg px-3 py-2`}>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold ${t.text}`}>{item.title}</p>
                    {item.weeklyRecurring && <Badge variant="amber" t={t}>Weekly</Badge>}
                  </div>
                  <p className={`text-xs ${t.textSub} mt-0.5`}>
                    {formatClassDate(item.classDate)} - {formatClassTime(item.startTime)}{item.endTime ? ` to ${formatClassTime(item.endTime)}` : ""}
                  </p>
                  <p className={`text-xs ${t.textTert} mt-0.5`}>{item.subject || "General"}</p>
                </div>
              ))}
            </div>
          )}
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
