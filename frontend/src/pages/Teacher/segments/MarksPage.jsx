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

function formatSubmittedAt(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function MarksPage({ t }) {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [markDrafts, setMarkDrafts] = useState({});
  const [classFilter, setClassFilter] = useState("all");
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  async function refreshAll() {
    await Promise.all([loadAssignments(), loadStudents()]);
  }

  const selectedAssignment = useMemo(
    () => assignments.find((assignment) => assignment.id === selectedAssignmentId) || assignments[0] || null,
    [assignments, selectedAssignmentId],
  );

  const classOptions = useMemo(() => {
    const uniqueGrades = Array.from(new Set(students.map((student) => student.grade).filter(Boolean)));
    return uniqueGrades.sort((a, b) => a.localeCompare(b));
  }, [students]);

  const studentsById = useMemo(() => {
    const map = new Map();
    students.forEach((student) => {
      map.set(student.userId, student);
    });
    return map;
  }, [students]);

  const visibleStudents = useMemo(() => {
    return students.filter((student) => classFilter === "all" || student.grade === classFilter);
  }, [students, classFilter]);

  const rows = useMemo(() => {
    const submissionByStudentId = new Map();
    submissions.forEach((submission) => {
      if (submission.studentUserId != null) {
        submissionByStudentId.set(submission.studentUserId, submission);
      }
    });

    const studentRows = visibleStudents.map((student) => ({
      rowKey: `student-${student.userId}`,
      student,
      submission: submissionByStudentId.get(student.userId) || null,
    }));

    const unknownRows = submissions
      .filter((submission) => {
        if (submission.studentUserId == null) return true;
        return !studentsById.has(submission.studentUserId);
      })
      .map((submission) => ({
        rowKey: `submission-${submission.id}`,
        student: {
          userId: submission.studentUserId,
          fullName: submission.studentName || "Unknown student",
          grade: "N/A",
        },
        submission,
      }));

    return [...studentRows, ...unknownRows];
  }, [submissions, studentsById, visibleStudents]);

  const summary = useMemo(() => {
    const submitted = rows.filter((row) => Boolean(row.submission)).length;
    const graded = rows.filter((row) => Boolean(row.submission?.graded)).length;
    return {
      total: rows.length,
      submitted,
      graded,
    };
  }, [rows]);

  async function loadAssignments() {
    setLoadingAssignments(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/teacher/assignments`, {
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

  async function loadStudents() {
    setLoadingStudents(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/teacher/assignments/students`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      const data = await response.json().catch(() => []);
      if (!response.ok) {
        throw new Error(data?.message || "Unable to load students");
      }
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load students");
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  }

  async function loadSubmissions(assignmentId) {
    if (!assignmentId) {
      setSubmissions([]);
      return;
    }

    setLoadingSubmissions(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/teacher/assignments/${assignmentId}/submissions`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      const data = await response.json().catch(() => []);
      if (!response.ok) {
        throw new Error(data?.message || "Unable to load submissions");
      }

      const nextSubmissions = Array.isArray(data) ? data : [];
      setSubmissions(nextSubmissions);
      setMarkDrafts((prev) => {
        const next = { ...prev };
        nextSubmissions.forEach((submission) => {
          next[`submission-${submission.id}`] = submission.mark || "";
          if (submission.studentUserId != null) {
            next[`student-${submission.studentUserId}`] = submission.mark || "";
          }
        });
        return next;
      });
    } catch (err) {
      setError(err.message || "Unable to load submissions");
      setSubmissions([]);
      setMarkDrafts({});
    } finally {
      setLoadingSubmissions(false);
    }
  }

  async function saveMark(row) {
    const submission = row?.submission || null;
    const draftKey = submission?.id ? `submission-${submission.id}` : `student-${row?.student?.userId}`;
    const mark = (markDrafts[draftKey] || "").trim();

    if (!row?.student?.userId) {
      setError("Student is required");
      return;
    }

    if (!mark) {
      setError("Mark is required");
      return;
    }

    if (!selectedAssignment?.id) {
      setError("Please select an assignment");
      return;
    }

    const saveKey = submission?.id ? `submission-${submission.id}` : `student-${row.student.userId}`;

    setSavingId(saveKey);
    setError("");
    try {
      const endpoint = submission?.id
        ? `${API_BASE}/api/teacher/assignments/submissions/${submission.id}/mark`
        : `${API_BASE}/api/teacher/assignments/${selectedAssignment.id}/students/${row.student.userId}/mark`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ mark }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Unable to save mark");
      }

      setSubmissions((prev) => {
        const indexById = data?.id == null ? -1 : prev.findIndex((item) => item.id === data.id);
        if (indexById >= 0) {
          return prev.map((item) => (item.id === data.id ? data : item));
        }

        const indexByStudent = data?.studentUserId == null
          ? -1
          : prev.findIndex((item) => item.studentUserId === data.studentUserId);
        if (indexByStudent >= 0) {
          return prev.map((item, idx) => (idx === indexByStudent ? data : item));
        }

        return [data, ...prev];
      });

      setMarkDrafts((prev) => {
        const next = { ...prev };
        if (data?.id != null) {
          next[`submission-${data.id}`] = data.mark || "";
        }
        if (data?.studentUserId != null) {
          next[`student-${data.studentUserId}`] = data.mark || "";
        }
        return next;
      });

      await loadAssignments();
    } catch (err) {
      setError(err.message || "Unable to save mark");
    } finally {
      setSavingId(null);
    }
  }

  useEffect(() => {
    loadAssignments();
    loadStudents();
  }, []);

  useEffect(() => {
    if (selectedAssignment?.id) {
      loadSubmissions(selectedAssignment.id);
    }
  }, [selectedAssignment?.id]);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className={`text-sm ${t.textSub}`}>Add and update student marks</p>
          <p className={`text-lg font-bold ${t.text}`}>Marks</p>
        </div>
        <GhostBtn t={t} onClick={refreshAll}>Refresh</GhostBtn>
      </div>

      {error && <div className={`${t.card} rounded-xl px-4 py-3 text-sm text-red-500`}>{error}</div>}

      <Card title="Assignment" t={t}>
        {loadingAssignments || loadingStudents ? (
          <p className={`text-sm ${t.textSub}`}>Loading assignments and students...</p>
        ) : assignments.length === 0 ? (
          <p className={`text-sm ${t.textSub}`}>No assignments found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <label className="block md:col-span-2">
              <span className={`text-xs ${t.textSub}`}>Select assignment</span>
              <select
                className={`mt-1 w-full rounded-lg px-3 py-2 text-sm ${t.selectBg} outline-none`}
                value={selectedAssignment?.id || ""}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setSelectedAssignmentId(Number.isNaN(value) ? null : value);
                }}
              >
                {assignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title} - {assignment.subject}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={`text-xs ${t.textSub}`}>Filter class</span>
              <select
                className={`mt-1 w-full rounded-lg px-3 py-2 text-sm ${t.selectBg} outline-none`}
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
              >
                <option value="all">All classes</option>
                {classOptions.map((grade) => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </label>
            <div className={`${t.metric} rounded-lg px-3 py-2`}>
              <p className={`text-xs ${t.textSub}`}>Summary</p>
              <p className={`text-sm font-bold ${t.text}`}>{summary.graded}/{summary.submitted} graded</p>
              <p className={`text-xs ${t.textSub}`}>{summary.total} students shown</p>
            </div>
          </div>
        )}
      </Card>

      <Card
        title={selectedAssignment ? `${selectedAssignment.title} - Submissions` : "Submissions"}
        extra={selectedAssignment ? <Badge v="blue" t={t}>{selectedAssignment.subject}</Badge> : null}
        t={t}
        noPad
      >
        <table className="w-full">
          <thead>
            <tr className={t.tableHead}>
              {["Student", "Class", "Submitted At", "Current Mark", "Enter Mark", "Status", "Action"].map((h) => (
                <Th key={h} t={t}>{h}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loadingSubmissions && (
              <tr>
                <Td t={t} className={t.textSub} colSpan={7}>Loading submissions...</Td>
              </tr>
            )}

            {!loadingSubmissions && rows.length === 0 && (
              <tr>
                <Td t={t} className={t.textSub} colSpan={7}>No students available for this class filter.</Td>
              </tr>
            )}

            {!loadingSubmissions && rows.map((row) => {
              const submission = row.submission;
              return (
              <tr key={row.rowKey} className={t.tableRow}>
                <Td t={t}><span className="font-medium">{row.student.fullName || submission?.studentName || "Unknown"}</span></Td>
                <Td t={t} className={t.textSub}>{row.student.grade || "N/A"}</Td>
                <Td t={t} className={t.textSub}>{submission ? formatSubmittedAt(submission.submittedAt) : "Not submitted"}</Td>
                <Td t={t} className={t.textSub}>{submission?.mark || "-"}</Td>
                <td className="py-3 px-3">
                  {(() => {
                    const draftKey = submission?.id
                      ? `submission-${submission.id}`
                      : `student-${row.student.userId}`;
                    return (
                  <input
                    value={markDrafts[draftKey] || ""}
                    onChange={(e) => setMarkDrafts((prev) => ({ ...prev, [draftKey]: e.target.value }))}
                    className={`w-full rounded-lg px-3 py-1.5 text-sm ${t.inputBg} outline-none`}
                    placeholder="82/100"
                  />
                    );
                  })()}
                </td>
                <td className="py-3 px-3">
                  {!submission && <Badge v="red" t={t}>No Submission</Badge>}
                  {submission?.graded && <Badge v="green" t={t}>Graded</Badge>}
                  {submission && !submission.graded && <Badge v="amber" t={t}>Pending</Badge>}
                </td>
                <td className="py-3 px-3 pr-5">
                  {(() => {
                    const saveKey = submission?.id ? `submission-${submission.id}` : `student-${row.student.userId}`;
                    return (
                      <PrimaryBtn small onClick={() => saveMark(row)}>
                        {savingId === saveKey ? "Saving..." : "Save Mark"}
                      </PrimaryBtn>
                    );
                  })()}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
