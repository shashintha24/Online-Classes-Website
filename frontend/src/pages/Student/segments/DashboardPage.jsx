import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  MetricCard,
  ProgressBar,
  SectionCard,
  Icons,
} from "./StudentShared";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

function getAuth() {
  try {
    const raw = sessionStorage.getItem("ep_auth");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getAuthHeaders() {
  const auth = getAuth();
  if (!auth?.basicToken) return {};
  return { Authorization: `Basic ${auth.basicToken}` };
}

function toPercent(mark) {
  if (!mark) return null;
  const value = String(mark).trim();
  const ratio = value.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (ratio) {
    const top = Number(ratio[1]);
    const bottom = Number(ratio[2]);
    if (bottom > 0) return Math.round((top / bottom) * 100);
  }

  const percent = value.match(/^(\d+(?:\.\d+)?)\s*%?$/);
  if (percent) {
    const parsed = Number(percent[1]);
    if (parsed >= 0 && parsed <= 100) return Math.round(parsed);
  }
  return null;
}

function badgeForStatus(status) {
  const value = (status || "").toLowerCase();
  if (value.includes("submitted")) return "green";
  if (value.includes("pending")) return "amber";
  if (value.includes("today")) return "blue";
  return "gray";
}

function formatDate(value) {
  if (!value) return "-";
  const date = value.includes("T") ? new Date(value) : new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function DashboardPage({ t }) {
  const [assignments, setAssignments] = useState([]);
  const [attendanceLog, setAttendanceLog] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboardData() {
    setLoading(true);
    setError("");

    const auth = getAuth();
    const currentUserId = auth?.userId;

    try {
      const [assignmentsRes, attendanceRes, materialsRes] = await Promise.all([
        fetch(`${API_BASE}/api/student/assignments`, {
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        }),
        fetch(`${API_BASE}/api/student/attendance/log`, {
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        }),
        fetch(`${API_BASE}/api/materials`, {
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        }),
      ]);

      const assignmentsData = await assignmentsRes.json().catch(() => []);
      const attendanceData = await attendanceRes.json().catch(() => []);
      const materialsData = await materialsRes.json().catch(() => []);

      if (!assignmentsRes.ok) throw new Error(assignmentsData?.message || "Unable to load assignments");
      if (!attendanceRes.ok) throw new Error(attendanceData?.message || "Unable to load attendance");
      if (!materialsRes.ok) throw new Error(materialsData?.message || "Unable to load materials");

      const nextAssignments = Array.isArray(assignmentsData) ? assignmentsData : [];
      setAssignments(nextAssignments);
      setAttendanceLog(Array.isArray(attendanceData) ? attendanceData : []);
      setMaterials(Array.isArray(materialsData) ? materialsData : []);

      const marksPerAssignment = await Promise.all(
        nextAssignments.map(async (assignment) => {
          const res = await fetch(`${API_BASE}/api/student/assignments/${assignment.id}/submissions`, {
            headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          });
          const data = await res.json().catch(() => []);
          if (!res.ok) throw new Error(data?.message || "Unable to load marks");

          const myGraded = (Array.isArray(data) ? data : []).filter(
            (submission) => submission.studentUserId === currentUserId && submission.graded && submission.mark,
          );

          return myGraded.map((submission) => ({
            id: submission.id,
            assignmentTitle: assignment.title,
            subject: assignment.subject,
            submittedAt: submission.submittedAt,
            mark: submission.mark,
            percent: toPercent(submission.mark),
          }));
        }),
      );

      const flattened = marksPerAssignment.flat().sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
      setMarks(flattened);
    } catch (err) {
      setError(err.message || "Unable to load dashboard");
      setAssignments([]);
      setAttendanceLog([]);
      setMaterials([]);
      setMarks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const stats = useMemo(() => {
    const percents = marks.map((item) => item.percent).filter((value) => value != null);
    const avg = percents.length ? Math.round(percents.reduce((sum, value) => sum + value, 0) / percents.length) : 0;
    const aPercent = percents.length ? Math.round((percents.filter((value) => value >= 75).length / percents.length) * 100) : 0;
    const bPercent = percents.length ? Math.round((percents.filter((value) => value >= 65 && value < 75).length / percents.length) * 100) : 0;

    const present = attendanceLog.filter((row) => (row.status || "").toLowerCase().includes("present")).length;
    const absent = attendanceLog.filter((row) => (row.status || "").toLowerCase().includes("absent")).length;
    const attendance = present + absent > 0 ? Math.round((present / (present + absent)) * 100) : 0;

    return {
      avg,
      aPercent,
      bPercent,
      attendance,
      latestMark: percents.length ? percents[0] : 0,
    };
  }, [marks, attendanceLog]);

  const subjectBreakdown = useMemo(() => {
    const bucket = {};
    marks.forEach((item) => {
      if (item.percent == null) return;
      if (!bucket[item.subject]) bucket[item.subject] = [];
      bucket[item.subject].push(item.percent);
    });
    return Object.entries(bucket).map(([subject, values]) => ({
      subject,
      value: Math.round(values.reduce((sum, value) => sum + value, 0) / values.length),
    }));
  }, [marks]);

  const upcomingItems = useMemo(() => {
    const assignmentRows = assignments.slice(0, 4).map((assignment) => ({
      date: formatDate(assignment.dueDate),
      subject: assignment.subject,
      type: "Assignment due",
      status: assignment.status || "Pending",
    }));

    const materialRows = materials.slice(0, 2).map((material) => ({
      date: formatDate(material.createdAt),
      subject: material.batchName || "General",
      type: "New material",
      status: "Available",
    }));

    return [...assignmentRows, ...materialRows].slice(0, 6);
  }, [assignments, materials]);

  return (
    <div className="p-6 space-y-5">
      {error && <div className={`${t.card} rounded-xl px-4 py-3 text-sm text-red-500`}>{error}</div>}

      <div className="flex justify-end">
        <button onClick={loadDashboardData} className={`px-4 py-2 rounded-lg text-sm font-semibold ${t.toggleBtn} cursor-pointer`}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Average Mark" value={`${stats.avg}%`} color="text-[#a435f0]" t={t} />
        <MetricCard label="Attendance" value={`${stats.attendance}%`} color="text-emerald-500" t={t} />
        <MetricCard label="A Grade %" value={`${stats.aPercent}%`} color="text-blue-500" t={t} />
        <MetricCard label="B Grade %" value={`${stats.bPercent}%`} color="text-amber-500" t={t} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Assignments" value={String(assignments.length)} color="text-[#3c3489]" t={t} />
        <MetricCard label="Materials" value={String(materials.length)} color="text-amber-500" t={t} />
        <MetricCard label="Papers Done" value={String(marks.length)} color="text-[#a435f0]" t={t} />
        <MetricCard label="Latest Mark" value={`${stats.latestMark}%`} color="text-emerald-500" t={t} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Marks Overview" t={t}>
          {subjectBreakdown.length === 0 ? (
            <p className={`text-sm ${t.textSub}`}>No graded marks yet.</p>
          ) : (
            <div className="space-y-3">
              {subjectBreakdown.map((item) => (
                <div key={item.subject}>
                  <div className={`flex justify-between text-sm mb-1 ${t.text}`}>
                    <span>{item.subject}</span><span className="font-semibold">{item.value}%</span>
                  </div>
                  <ProgressBar value={item.value} color="bg-[#a435f0]" t={t} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Class Standing" t={t}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-[#a435f0] flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-[#a435f0]">{marks.length}</span>
                <span className={`text-[10px] ${t.textTert}`}>graded</span>
              </div>
              <div className="flex-1">
                <p className={`text-sm ${t.textSub} mb-1`}>Attendance consistency</p>
                <ProgressBar value={stats.attendance} color="bg-[#a435f0]" t={t} />
              </div>
            </div>
          </SectionCard>

          <div className={`${t.feeGreen} rounded-xl p-4`}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">Latest Score</p>
            <p className="text-2xl font-bold">{stats.latestMark}%</p>
            <p className="text-sm mt-0.5 opacity-80">Updated from latest graded submission</p>
          </div>
        </div>
      </div>

      <SectionCard title="Upcoming & Recent" t={t}>
        <table className="w-full text-sm">
          <thead>
            <tr className={t.tableHead}>
              {["Date", "Subject", "Type", "Status"].map((h) => (
                <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider py-2 px-3 first:pl-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {upcomingItems.map((item) => (
              <tr key={`${item.date}-${item.subject}-${item.type}`} className={t.tableRow}>
                <td className={`py-3 px-3 pl-0 ${t.text}`}>{item.date}</td>
                <td className={`py-3 px-3 ${t.text}`}>{item.subject}</td>
                <td className={`py-3 px-3 ${t.textSub}`}>{item.type}</td>
                <td className="py-3 px-3"><Badge variant={badgeForStatus(item.status)} t={t}>{item.status}</Badge></td>
              </tr>
            ))}
            {!upcomingItems.length && (
              <tr className={t.tableRow}>
                <td className={`py-3 px-3 pl-0 ${t.textSub}`} colSpan={4}>No upcoming items.</td>
              </tr>
            )}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}
