import { useEffect, useMemo, useState } from "react";
import { Badge, Bar, Card, GhostBtn, I, Metric, Td, Th } from "./TeacherShared";

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

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function relativeTime(value) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Less than 1 hour ago";
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

export default function DashboardPage({ t }) {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [submissionsByAssignment, setSubmissionsByAssignment] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboardData() {
    setLoading(true);
    setError("");
    try {
      const [studentsRes, assignmentsRes, attendanceRes, materialsRes] = await Promise.all([
        fetch(`${API_BASE}/api/teacher/assignments/students`, {
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        }),
        fetch(`${API_BASE}/api/teacher/assignments`, {
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        }),
        fetch(`${API_BASE}/api/teacher/attendance/today`, {
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        }),
        fetch(`${API_BASE}/api/materials`, {
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        }),
      ]);

      const studentsData = await studentsRes.json().catch(() => []);
      const assignmentsData = await assignmentsRes.json().catch(() => []);
      const attendanceData = await attendanceRes.json().catch(() => []);
      const materialsData = await materialsRes.json().catch(() => []);

      if (!studentsRes.ok) throw new Error(studentsData?.message || "Unable to load students");
      if (!assignmentsRes.ok) throw new Error(assignmentsData?.message || "Unable to load assignments");
      if (!attendanceRes.ok) throw new Error(attendanceData?.message || "Unable to load attendance");
      if (!materialsRes.ok) throw new Error(materialsData?.message || "Unable to load materials");

      const nextStudents = Array.isArray(studentsData) ? studentsData : [];
      const nextAssignments = Array.isArray(assignmentsData) ? assignmentsData : [];

      setStudents(nextStudents);
      setAssignments(nextAssignments);
      setAttendanceToday(Array.isArray(attendanceData) ? attendanceData : []);
      setMaterials(Array.isArray(materialsData) ? materialsData : []);

      const submissionsEntries = await Promise.all(
        nextAssignments.map(async (assignment) => {
          const response = await fetch(`${API_BASE}/api/teacher/assignments/${assignment.id}/submissions`, {
            headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          });
          const data = await response.json().catch(() => []);
          if (!response.ok) {
            throw new Error(data?.message || "Unable to load assignment submissions");
          }
          return [assignment.id, Array.isArray(data) ? data : []];
        }),
      );

      setSubmissionsByAssignment(Object.fromEntries(submissionsEntries));
    } catch (err) {
      setError(err.message || "Unable to load dashboard data");
      setStudents([]);
      setAssignments([]);
      setAttendanceToday([]);
      setMaterials([]);
      setSubmissionsByAssignment({});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const metrics = useMemo(() => {
    const todayPresent = attendanceToday.length;
    const totalStudents = students.length;

    const pendingGrades = assignments.reduce((count, assignment) => {
      const totalSubmitted = Number(assignment.submittedCount || 0);
      const graded = Number(assignment.gradedCount || 0);
      return count + Math.max(0, totalSubmitted - graded);
    }, 0);

    const upcomingDue = assignments.filter((assignment) => {
      if (!assignment.dueDate) return false;
      const due = new Date(`${assignment.dueDate}T00:00:00`);
      if (Number.isNaN(due.getTime())) return false;
      const now = new Date();
      const weekLater = new Date();
      weekLater.setDate(now.getDate() + 7);
      return due >= new Date(now.toDateString()) && due <= weekLater;
    }).length;

    return { totalStudents, todayPresent, pendingGrades, upcomingDue };
  }, [attendanceToday, students, assignments]);

  const recentActivity = useMemo(() => {
    const items = [];

    attendanceToday.slice(-2).reverse().forEach((record) => {
      items.push({
        icon: <I.Check />,
        bg: "bg-emerald-100 text-emerald-600",
        title: "Attendance marked",
        body: `${record.studentName} checked in (${record.grade || "N/A"})`,
        time: relativeTime(record.checkInTime),
      });
    });

    assignments.slice(0, 2).forEach((assignment) => {
      items.push({
        icon: <I.Assignments />,
        bg: "bg-purple-100 text-purple-600",
        title: "Assignment updated",
        body: `${assignment.title} · ${assignment.subject}`,
        time: assignment.createdAt ? relativeTime(assignment.createdAt) : "Recently",
      });
    });

    materials.slice(0, 1).forEach((material) => {
      items.push({
        icon: <I.Materials />,
        bg: "bg-blue-100 text-blue-600",
        title: "Material uploaded",
        body: `${material.title} · ${material.batchName || "General"}`,
        time: material.createdAt ? relativeTime(material.createdAt) : "Recently",
      });
    });

    return items.slice(0, 4);
  }, [attendanceToday, assignments, materials]);

  const batchOverview = useMemo(() => {
    const grouped = students.reduce((acc, student) => {
      const grade = student.grade || "N/A";
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [students]);

  const subjectAverages = useMemo(() => {
    const bySubject = {};
    assignments.forEach((assignment) => {
      const submissions = submissionsByAssignment[assignment.id] || [];
      const percents = submissions
        .filter((item) => item.graded && item.mark)
        .map((item) => toPercent(item.mark))
        .filter((value) => value != null);

      if (!percents.length) return;

      const subject = assignment.subject || "General";
      if (!bySubject[subject]) bySubject[subject] = [];
      bySubject[subject].push(...percents);
    });

    return Object.entries(bySubject).map(([subject, values]) => ({
      subject,
      value: Math.round(values.reduce((sum, item) => sum + item, 0) / values.length),
    }));
  }, [assignments, submissionsByAssignment]);

  const upcomingSchedule = useMemo(() => {
    return assignments
      .slice()
      .sort((a, b) => new Date(`${a.dueDate}T00:00:00`) - new Date(`${b.dueDate}T00:00:00`))
      .slice(0, 6)
      .map((assignment) => ({
        date: formatDate(assignment.dueDate),
        batch: assignment.subject || "General",
        title: assignment.title,
        submitted: `${assignment.submittedCount || 0}/${assignment.totalStudents || students.length || 0}`,
        status: assignment.status || "Open",
      }));
  }, [assignments, students.length]);

  return (
    <div className="p-6 space-y-4">
      {error && <div className={`${t.card} rounded-xl px-4 py-3 text-sm text-red-500`}>{error}</div>}

      <div className="flex justify-end">
        <GhostBtn t={t} onClick={loadDashboardData}>{loading ? "Loading..." : "Refresh"}</GhostBtn>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Metric label="Total Students" value={String(metrics.totalStudents)} color="text-[#a435f0]" t={t} />
        <Metric label="Today's Attendance" value={String(metrics.todayPresent)} sub={`/${metrics.totalStudents}`} color="text-emerald-500" t={t} />
        <Metric label="Pending Grading" value={String(metrics.pendingGrades)} color="text-red-500" t={t} />
        <Metric label="Assignments Due (7d)" value={String(metrics.upcomingDue)} color="text-amber-500" t={t} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Recent Activity" t={t}>
          <div className="space-y-1">
            {recentActivity.map((item, i) => (
              <div key={i} className={`flex gap-3 py-3 border-b last:border-0 ${t.divider}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.bg}`}>{item.icon}</div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${t.text}`}>{item.title}</p>
                  <p className={`text-xs ${t.textSub} mt-0.5`}>{item.body}</p>
                  <p className={`text-xs ${t.textTert} mt-1`}>{item.time}</p>
                </div>
              </div>
            ))}
            {!recentActivity.length && <p className={`text-sm ${t.textSub}`}>No recent activity yet.</p>}
          </div>
        </Card>

        <Card title="Batch Overview" t={t}>
          <div className="space-y-0">
            {batchOverview.map((item, index) => (
              <div key={item.name} className={`flex justify-between items-center py-3 border-b last:border-0 ${t.divider}`}>
                <span className={`text-sm font-semibold ${t.text}`}>{item.name}</span>
                <Badge v={index % 2 === 0 ? "purple" : "blue"} t={t}>{item.count} students</Badge>
              </div>
            ))}
            {!batchOverview.length && <p className={`text-sm ${t.textSub} py-3`}>No batches available yet.</p>}
          </div>
          <div className="mt-4 space-y-3">
            <p className={`text-xs font-semibold uppercase tracking-wider ${t.textTert}`}>Class Avg Marks - April</p>
            {subjectAverages.map((item) => (
              <div key={item.subject}>
                <div className={`flex justify-between text-sm mb-1 ${t.text}`}><span>{item.subject}</span><span className="font-bold">{item.value}%</span></div>
                <Bar value={item.value} color="bg-[#a435f0]" t={t} />
              </div>
            ))}
            {!subjectAverages.length && <p className={`text-sm ${t.textSub}`}>No graded marks yet.</p>}
          </div>
        </Card>
      </div>

      <Card title="Upcoming Schedule" extra={<GhostBtn small t={t}>View all</GhostBtn>} t={t} noPad>
        <table className="w-full">
          <thead><tr className={t.tableHead}>{["Date", "Batch", "Assignment", "Submissions", "Status"].map((h) => <Th key={h} t={t}>{h}</Th>)}</tr></thead>
          <tbody>
            {upcomingSchedule.map((item, i) => (
              <tr key={i} className={t.tableRow}>
                <Td t={t}>{item.date}</Td>
                <Td t={t}>{item.batch}</Td>
                <Td t={t}>{item.title}</Td>
                <Td t={t}>{item.submitted}</Td>
                <td className="py-3 px-3 last:pr-5"><Badge v={item.status.toLowerCase().includes("open") ? "blue" : item.status.toLowerCase().includes("grad") ? "green" : "amber"} t={t}>{item.status}</Badge></td>
              </tr>
            ))}
            {!upcomingSchedule.length && (
              <tr className={t.tableRow}>
                <Td t={t} colSpan={5} className={t.textSub}>No assignments scheduled yet.</Td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
