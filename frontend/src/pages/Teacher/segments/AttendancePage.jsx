import { useEffect, useMemo, useState } from "react";
import { Badge, Card, GhostBtn, I, Metric, PrimaryBtn, Td, Th } from "./TeacherShared";

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
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function statusBadge(status) {
  const normalized = (status || "").toLowerCase();
  if (normalized.includes("late")) return { variant: "amber", label: "Late" };
  if (normalized.includes("present")) return { variant: "green", label: "Present" };
  return { variant: "red", label: "Absent" };
}

export default function AttendancePage({ t }) {
  const [scannerCode, setScannerCode] = useState("");
  const [scannerMessage, setScannerMessage] = useState("Scan QR code to mark attendance");
  const [students, setStudents] = useState([]);
  const [todayRecords, setTodayRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const calData = { 1: "p", 2: "p", 3: "p", 4: "a", 5: "p", 6: "p", 7: "p", 8: "p", 9: "a", 10: "p", 11: "p" };

  const register = useMemo(() => {
    const recordByStudent = new Map(todayRecords.map((record) => [record.studentUserId, record]));
    return students.map((student) => {
      const record = recordByStudent.get(student.userId);
      const badge = statusBadge(record?.status);
      return {
        key: student.userId,
        name: student.fullName,
        batch: student.grade || "N/A",
        code: `EPATT-${student.userId}`,
        checkIn: formatCheckIn(record?.checkInTime),
        method: record?.method || "-",
        status: record ? badge.variant : "red",
        label: record ? badge.label : "Absent",
      };
    });
  }, [students, todayRecords]);

  const presentCount = register.filter((row) => row.label === "Present" || row.label === "Late").length;
  const absentCount = register.length - presentCount;
  const monthlyAvg = register.length ? Math.round((presentCount / register.length) * 100) : 0;

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [studentsRes, attendanceRes] = await Promise.all([
        fetch(`${API_BASE}/api/teacher/assignments/students`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }),
        fetch(`${API_BASE}/api/teacher/attendance/today`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }),
      ]);

      const studentsData = await studentsRes.json().catch(() => []);
      const attendanceData = await attendanceRes.json().catch(() => []);

      if (!studentsRes.ok) throw new Error(studentsData?.message || "Unable to load students");
      if (!attendanceRes.ok) throw new Error(attendanceData?.message || "Unable to load attendance");

      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setTodayRecords(Array.isArray(attendanceData) ? attendanceData : []);
    } catch (err) {
      setError(err.message || "Unable to load attendance data");
      setStudents([]);
      setTodayRecords([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function markByQr() {
    const code = scannerCode.trim().toUpperCase();
    if (!code) {
      setScannerMessage("Please enter a QR student code");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/teacher/attendance/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ qrCode: code }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || `No student found for ${code}`);
      }

      setTodayRecords((prev) => {
        const found = prev.some((item) => item.studentUserId === data.studentUserId);
        if (found) {
          return prev.map((item) => (item.studentUserId === data.studentUserId ? data : item));
        }
        return [...prev, data];
      });
      setScannerMessage(`${data.studentName} marked present`);
      setScannerCode("");
    } catch (err) {
      setScannerMessage(err.message || "Unable to mark attendance");
    } finally {
      setSaving(false);
    }
  }

  const cells = [<div key="e0" />, ...Array.from({ length: 30 }, (_, i) => {
    const d = i + 1;
    const s = calData[d];
    const cls = s === "p" ? "bg-emerald-500 text-white" : s === "a" ? "bg-red-500 text-white" : d > 11 ? `${t.barBg} ${t.textTert} opacity-40` : `${t.barBg} ${t.textTert}`;
    return <div key={d} className={`aspect-square rounded flex items-center justify-center text-[10px] font-semibold ${cls}`}>{d}</div>;
  })];

  return (
    <div className="p-6 space-y-4">
      {error && <div className={`${t.card} rounded-xl px-4 py-3 text-sm text-red-500`}>{error}</div>}

      <div className="grid grid-cols-3 gap-3">
        <Metric label="Present Today" value={`${presentCount}`} sub={`/${register.length}`} color="text-emerald-500" t={t} />
        <Metric label="Monthly Avg" value={`${monthlyAvg}%`} color="text-blue-500" t={t} />
        <Metric label="Absent Today" value={`${absentCount}`} color="text-red-500" t={t} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="QR Attendance - Today" extra={<Badge v="green" t={t}>Active</Badge>} t={t}>
          <div className={`w-32 h-32 ${t.qrBorder} rounded-xl flex items-center justify-center mx-auto mb-4`}>
            <svg width="88" height="88" viewBox="0 0 80 80">
              <rect x="5" y="5" width="28" height="28" rx="2" fill="none" stroke="#a435f0" strokeWidth="3"/>
              <rect x="12" y="12" width="14" height="14" rx="1" fill="#a435f0"/>
              <rect x="47" y="5" width="28" height="28" rx="2" fill="none" stroke="#a435f0" strokeWidth="3"/>
              <rect x="54" y="12" width="14" height="14" rx="1" fill="#a435f0"/>
              <rect x="5" y="47" width="28" height="28" rx="2" fill="none" stroke="#a435f0" strokeWidth="3"/>
              <rect x="12" y="54" width="14" height="14" rx="1" fill="#a435f0"/>
              <rect x="47" y="47" width="6" height="6" fill="#a435f0"/>
              <rect x="56" y="47" width="6" height="6" fill="#a435f0"/>
              <rect x="65" y="47" width="6" height="6" fill="#a435f0"/>
              <rect x="47" y="56" width="6" height="6" fill="#a435f0"/>
              <rect x="65" y="56" width="6" height="6" fill="#a435f0"/>
              <rect x="47" y="65" width="6" height="6" fill="#a435f0"/>
              <rect x="56" y="65" width="6" height="6" fill="#a435f0"/>
              <rect x="65" y="65" width="6" height="6" fill="#a435f0"/>
            </svg>
          </div>
          <p className={`text-center text-xs ${t.textSub} mb-2`}>ElectroPhysics · 2026 Revision · Apr 14, 4:00 PM</p>
          <p className="text-center text-xs font-semibold text-[#a435f0] tracking-widest mb-4">GPS VALIDATION: ON</p>
          <div className="space-y-2">
            <input
              value={scannerCode}
              onChange={(e) => setScannerCode(e.target.value)}
              placeholder="Enter scanned code e.g. EP-1042"
              className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none ${t.inputBg}`}
            />
            <p className={`text-xs ${t.textSub}`}>{scannerMessage}</p>
          </div>
          <div className="flex gap-2 mt-3">
            <GhostBtn t={t} small onClick={loadData}>Refresh Register</GhostBtn>
            <PrimaryBtn small onClick={markByQr}>{saving ? "Marking..." : "Scan & Mark"}</PrimaryBtn>
          </div>
        </Card>

        <Card title="April 2026 Calendar" t={t}>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i} className={`text-center text-[10px] font-semibold ${t.textTert}`}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">{cells}</div>
          <div className={`flex gap-4 mt-3 text-xs ${t.textSub}`}>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"/>Present</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500 inline-block"/>Absent</span>
            <span className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded inline-block ${t.barBg}`}/>Holiday/Future</span>
          </div>
        </Card>
      </div>

      <Card title="Today's Register" extra={<GhostBtn small t={t}><I.Download />Export CSV</GhostBtn>} t={t} noPad>
        <table className="w-full">
          <thead><tr className={t.tableHead}>{["Student", "Batch", "Check-in Time", "Method", "Status"].map((h) => <Th key={h} t={t}>{h}</Th>)}</tr></thead>
          <tbody>
            {loading && (
              <tr>
                <Td t={t} className={t.textSub} colSpan={5}>Loading register...</Td>
              </tr>
            )}

            {!loading && register.length === 0 && (
              <tr>
                <Td t={t} className={t.textSub} colSpan={5}>No students found.</Td>
              </tr>
            )}

            {!loading && register.map((row) => (
              <tr key={row.key} className={t.tableRow}>
                <Td t={t}><span className="font-medium">{row.name}</span></Td>
                <Td t={t}>{row.batch}</Td><Td t={t}>{row.checkIn}</Td><Td t={t}>{row.method}</Td>
                <td className="py-3 px-3 pr-5"><Badge v={row.status} t={t}>{row.label}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
