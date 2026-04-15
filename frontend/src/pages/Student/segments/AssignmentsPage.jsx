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

function formatDueDate(value) {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatSubmittedAt(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function statusVariant(status) {
  const value = (status || "").toLowerCase();
  if (value.includes("grad")) return "green";
  if (value.includes("open")) return "blue";
  if (value.includes("progress")) return "amber";
  return "gray";
}

export default function AssignmentsPage({ t }) {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submittingId, setSubmittingId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [error, setError] = useState("");

  const selectedAssignment = useMemo(
    () => assignments.find((assignment) => assignment.id === selectedAssignmentId) || assignments[0] || null,
    [assignments, selectedAssignmentId],
  );

  async function loadAssignments() {
    setLoadingAssignments(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/student/assignments`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      const data = await response.json().catch(() => []);
      if (!response.ok) {
        throw new Error(data?.message || "Unable to load assignments");
      }
      const nextAssignments = Array.isArray(data) ? data : [];
      setAssignments(nextAssignments);
      setSelectedAssignmentId((current) => {
        if (current && nextAssignments.some((assignment) => assignment.id === current)) {
          return current;
        }
        return nextAssignments[0]?.id || null;
      });
    } catch (err) {
      setError(err.message || "Unable to load assignments");
      setAssignments([]);
      setSelectedAssignmentId(null);
      setSubmissions([]);
    } finally {
      setLoadingAssignments(false);
    }
  }

  async function loadSubmissions(assignmentId) {
    if (!assignmentId) {
      setSubmissions([]);
      return;
    }

    setLoadingSubmissions(true);
    try {
      const response = await fetch(`${API_BASE}/api/student/assignments/${assignmentId}/submissions`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      const data = await response.json().catch(() => []);
      if (!response.ok) {
        throw new Error(data?.message || "Unable to load submissions");
      }
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load submissions");
      setSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
    }
  }

  async function handleSubmit(assignmentId) {
    const file = selectedFiles[assignmentId];
    if (!file) {
      setError("Please choose a file before submitting");
      return;
    }

    setSubmittingId(assignmentId);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/student/assignments/${assignmentId}/submit`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
        },
        body: (() => {
          const formData = new FormData();
          formData.append("file", file);
          return formData;
        })(),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Submission failed");
      }
      setSelectedFiles((prev) => ({ ...prev, [assignmentId]: null }));
      await loadSubmissions(assignmentId);
    } catch (err) {
      setError(err.message || "Submission failed");
    } finally {
      setSubmittingId(null);
    }
  }

  async function downloadFile(downloadUrl) {
    try {
      const response = await fetch(`${API_BASE}${downloadUrl}`, {
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Unable to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "download";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Unable to download file");
    }
  }

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    if (selectedAssignment?.id) {
      loadSubmissions(selectedAssignment.id);
    }
  }, [selectedAssignment?.id]);

  const stats = useMemo(() => {
    const submitted = submissions.some((s) => s.fileName);
    const graded = submissions.filter((s) => s.graded).length;
    return { submitted: submitted ? "Yes" : "No", graded, pending: submitted ? 0 : 1 };
  }, [submissions, selectedAssignment]);

  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="My Submission" value={stats.submitted} color="text-emerald-500" t={t} />
        <MetricCard label="My Assessments" value={String(stats.graded)} color="text-[#a435f0]" t={t} />
        <MetricCard label="Pending" value={String(stats.pending)} color="text-red-500" t={t} />
      </div>

      {error && <div className={`${t.card} rounded-xl mb-4 px-4 py-3 text-sm text-red-500`}>{error}</div>}

      <SectionCard title="Active Assignments" t={t}>
        <table className="w-full text-sm">
          <thead>
            <tr className={t.tableHead}>
              {["Assignment", "Subject", "Due", "Status", "Download", "Submit"].map((h) => (
                <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider py-2 px-3 first:pl-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loadingAssignments && (
              <tr>
                <td colSpan={6} className={`py-4 px-3 text-sm ${t.textSub}`}>
                  Loading assignments...
                </td>
              </tr>
            )}
            {!loadingAssignments && assignments.length === 0 && (
              <tr>
                <td colSpan={6} className={`py-4 px-3 text-sm ${t.textSub}`}>
                  No assignments found.
                </td>
              </tr>
            )}
            {!loadingAssignments &&
              assignments.map((assignment) => (
                <tr
                  key={assignment.id}
                  className={`${t.tableRow} cursor-pointer ${assignment.id === selectedAssignment?.id ? t.navActive : ""}`}
                  onClick={() => setSelectedAssignmentId(assignment.id)}
                >
                  <td className="py-3 px-3 pl-0">
                    <p className={`font-semibold ${t.text}`}>{assignment.title}</p>
                    <p className={`text-xs ${t.textTert}`}>{assignment.description}</p>
                  </td>
                  <td className={`py-3 px-3 ${t.textSub}`}>{assignment.subject}</td>
                  <td className={`py-3 px-3 ${t.textSub}`}>{formatDueDate(assignment.dueDate)}</td>
                  <td className="py-3 px-3">
                    <Badge variant={statusVariant(assignment.status)} t={t}>
                      {assignment.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    {assignment.hasAttachment ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadFile(assignment.attachmentUrl);
                        }}
                        className="text-blue-500 font-medium cursor-pointer"
                      >
                        {assignment.attachmentName || "Download"}
                      </button>
                    ) : (
                      <span className={t.textTert}>No file</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <label className={`text-xs ${t.textSub} cursor-pointer`}>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            setSelectedFiles((prev) => ({ ...prev, [assignment.id]: file || null }));
                          }}
                        />
                        {selectedFiles[assignment.id] ? "Change file" : "Choose file"}
                      </label>
                      <button
                        onClick={() => handleSubmit(assignment.id)}
                        disabled={submittingId === assignment.id}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
                          submittingId === assignment.id
                            ? `${t.textTert} cursor-not-allowed`
                            : "bg-[#a435f0] text-white hover:bg-[#8710d8] cursor-pointer"
                        }`}
                      >
                        {submittingId === assignment.id ? "..." : "Submit"}
                      </button>
                    </div>
                    {selectedFiles[assignment.id] && <p className={`text-[10px] mt-1 ${t.textTert}`}>{selectedFiles[assignment.id].name}</p>}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title={selectedAssignment ? `${selectedAssignment.title} - My Submission` : "My Submission"} t={t}>
        <div className="space-y-3">
          {loadingSubmissions && <div className={`text-sm ${t.textSub}`}>Loading submissions...</div>}
          {!loadingSubmissions && submissions.length === 0 && (
            <div className={`text-sm ${t.textSub}`}>You have not submitted this assignment yet.</div>
          )}
          {!loadingSubmissions &&
            submissions.map((submission) => (
              <div key={submission.id} className={`${t.card} rounded-lg p-3 flex items-start justify-between`}>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${t.text}`}>My Submission</p>
                  <p className={`text-xs ${t.textTert}`}>{submission.fileName || "No file"}</p>
                  <p className={`text-xs ${t.textSub} mt-1`}>{formatSubmittedAt(submission.submittedAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {submission.graded && (
                    <Badge variant="green" t={t}>
                      {submission.mark}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
        </div>
      </SectionCard>
    </div>
  );
}
