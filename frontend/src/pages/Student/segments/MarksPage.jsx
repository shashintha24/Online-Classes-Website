import { useEffect, useMemo, useState } from "react";
import { Badge, MetricCard, ProgressBar, SectionCard } from "./StudentShared";

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

function formatDate(value) {
  if (!value) return "-";
  const date = value.includes("T") ? new Date(value) : new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function extractPercent(mark) {
  if (!mark) return null;
  const text = String(mark).trim();
  if (!text) return null;

  const ratio = text.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (ratio) {
    const top = Number(ratio[1]);
    const bottom = Number(ratio[2]);
    if (bottom > 0) {
      return Math.round((top / bottom) * 100);
    }
  }

  const asPercent = text.match(/^(\d+(?:\.\d+)?)\s*%?$/);
  if (asPercent) {
    const value = Number(asPercent[1]);
    if (value >= 0 && value <= 100) {
      return Math.round(value);
    }
  }

  return null;
}

function standingVariant(percent) {
  if (percent == null) return ["gray", "N/A"];
  if (percent >= 75) return ["green", "Excellent"];
  if (percent >= 60) return ["blue", "Good"];
  if (percent >= 45) return ["amber", "Average"];
  return ["red", "Needs Work"];
}

export default function MarksPage({ t }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMarks() {
    setLoading(true);
    setError("");

    const auth = getAuth();
    const currentUserId = auth?.userId;

    try {
      const assignmentsResponse = await fetch(`${API_BASE}/api/student/assignments`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      const assignmentData = await assignmentsResponse.json().catch(() => []);
      if (!assignmentsResponse.ok) {
        throw new Error(assignmentData?.message || "Unable to load assignments");
      }

      const assignments = Array.isArray(assignmentData) ? assignmentData : [];
      const submissionsPerAssignment = await Promise.all(
        assignments.map(async (assignment) => {
          const response = await fetch(`${API_BASE}/api/student/assignments/${assignment.id}/submissions`, {
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeaders(),
            },
          });
          const data = await response.json().catch(() => []);
          if (!response.ok) {
            throw new Error(data?.message || "Unable to load submissions");
          }

          const submissions = Array.isArray(data) ? data : [];
          const myGraded = submissions.filter(
            (submission) => submission.studentUserId === currentUserId && submission.graded && submission.mark,
          );

          const latest = myGraded[0];
          if (!latest) return null;

          return {
            id: `${assignment.id}-${latest.id}`,
            assignmentTitle: assignment.title,
            subject: assignment.subject,
            dueDate: assignment.dueDate,
            submittedAt: latest.submittedAt,
            mark: latest.mark,
            percent: extractPercent(latest.mark),
          };
        }),
      );

      const preparedRows = submissionsPerAssignment
        .filter(Boolean)
        .sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));

      setRows(preparedRows);
    } catch (err) {
      setError(err.message || "Unable to load marks");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMarks();
  }, []);

  const stats = useMemo(() => {
    const percents = rows.map((row) => row.percent).filter((value) => value != null);
    if (percents.length === 0) {
      return {
        avg: 0,
        top: 0,
        graded: rows.length,
      };
    }

    const avg = Math.round(percents.reduce((sum, value) => sum + value, 0) / percents.length);
    const top = Math.max(...percents);

    return {
      avg,
      top,
      graded: rows.length,
    };
  }, [rows]);

  const subjectStats = useMemo(() => {
    const map = new Map();
    rows.forEach((row) => {
      if (row.percent == null) return;
      if (!map.has(row.subject)) {
        map.set(row.subject, []);
      }
      map.get(row.subject).push(row.percent);
    });

    return Array.from(map.entries()).map(([subject, values]) => ({
      subject,
      avg: Math.round(values.reduce((sum, value) => sum + value, 0) / values.length),
    }));
  }, [rows]);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className={`text-sm ${t.textSub}`}>Your graded marks from teacher submissions</p>
          <p className={`text-lg font-bold ${t.text}`}>My Marks</p>
        </div>
        <button onClick={loadMarks} className={`px-4 py-2 rounded-lg text-sm font-semibold ${t.toggleBtn} cursor-pointer`}>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Average %" value={`${stats.avg}%`} color="text-[#a435f0]" t={t} />
        <MetricCard label="Top Score %" value={`${stats.top}%`} color="text-emerald-500" t={t} />
        <MetricCard label="Graded Papers" value={String(stats.graded)} color="text-blue-500" t={t} />
      </div>

      {error && <div className={`${t.card} rounded-xl px-4 py-3 text-sm text-red-500`}>{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Subject Breakdown" t={t}>
          {subjectStats.length === 0 ? (
            <p className={`text-sm ${t.textSub}`}>No graded marks yet.</p>
          ) : (
            <div className="space-y-4">
              {subjectStats.map((item) => (
                <div key={item.subject}>
                  <div className={`flex justify-between text-sm mb-1.5 ${t.text}`}>
                    <span>{item.subject}</span>
                    <span className="font-bold text-[#a435f0]">{item.avg}%</span>
                  </div>
                  <ProgressBar value={item.avg} color="bg-[#a435f0]" t={t} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Performance Status" t={t}>
          {rows.length === 0 ? (
            <p className={`text-sm ${t.textSub}`}>Teacher has not added marks yet.</p>
          ) : (
            <div className="space-y-2">
              {rows.slice(0, 5).map((row) => {
                const [variant, text] = standingVariant(row.percent);
                return (
                  <div key={row.id} className="flex items-center justify-between">
                    <span className={`text-sm ${t.text}`}>{row.assignmentTitle}</span>
                    <Badge variant={variant} t={t}>{text}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Paper-wise Marks List" t={t}>
        <table className="w-full text-sm">
          <thead>
            <tr className={t.tableHead}>
              {["Assignment", "Subject", "Due Date", "Submitted", "Mark", "Percent", "Standing"].map((h) => (
                <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider py-2 px-3 first:pl-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className={`py-4 px-3 ${t.textSub}`}>Loading marks...</td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={7} className={`py-4 px-3 ${t.textSub}`}>No graded marks available yet.</td>
              </tr>
            )}

            {!loading && rows.map((row) => {
              const [variant, text] = standingVariant(row.percent);
              return (
                <tr key={row.id} className={t.tableRow}>
                  <td className={`py-3 px-3 pl-0 font-medium ${t.text}`}>{row.assignmentTitle}</td>
                  <td className={`py-3 px-3 ${t.textSub}`}>{row.subject}</td>
                  <td className={`py-3 px-3 ${t.textSub}`}>{formatDate(row.dueDate)}</td>
                  <td className={`py-3 px-3 ${t.textSub}`}>{formatDate(row.submittedAt)}</td>
                  <td className={`py-3 px-3 font-bold ${t.text}`}>{row.mark}</td>
                  <td className={`py-3 px-3 ${t.textSub}`}>{row.percent == null ? "-" : `${row.percent}%`}</td>
                  <td className="py-3 px-3"><Badge variant={variant} t={t}>{text}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}
