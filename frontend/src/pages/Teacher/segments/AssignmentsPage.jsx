import { useEffect, useMemo, useState } from "react";
import { Badge, Card, GhostBtn, PrimaryBtn, Td, Th } from "./TeacherShared";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const ASSIGNMENT_STATUSES = ["Open", "In progress", "Graded"];

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
  const [savingAssignment, setSavingAssignment] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    title: "",
    subject: "",
    description: "",
    dueDate: "",
    totalStudents: "28",
    status: "Open",
  });
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [error, setError] = useState("");

  const selectedAssignment = useMemo(
    () => assignments.find((assignment) => assignment.id === selectedAssignmentId) || assignments[0] || null,
    [assignments, selectedAssignmentId],
  );

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

  function openCreateModal() {
    setModalMode("create");
    setForm({
      title: "",
      subject: "",
      description: "",
      dueDate: "",
      totalStudents: "28",
      status: "Open",
    });
    setAttachmentFile(null);
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal() {
    if (!activeAssignment) return;
    setModalMode("edit");
    setForm({
      title: activeAssignment.title || "",
      subject: activeAssignment.subject || "",
      description: activeAssignment.description || "",
      dueDate: activeAssignment.dueDate || "",
      totalStudents: String(activeAssignment.totalStudents ?? 0),
      status: activeAssignment.status || "Open",
    });
    setAttachmentFile(null);
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (savingAssignment) return;
    setModalOpen(false);
    setFormError("");
  }

  function updateFormField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submitAssignmentForm(e) {
    e.preventDefault();
    const totalStudents = Number(form.totalStudents);
    if (!form.title.trim()) {
      setFormError("Title is required");
      return;
    }
    if (!form.subject.trim()) {
      setFormError("Subject is required");
      return;
    }
    if (!form.dueDate) {
      setFormError("Due date is required");
      return;
    }
    if (!Number.isInteger(totalStudents) || totalStudents < 0) {
      setFormError("Total students must be 0 or greater");
      return;
    }

    const payload = {
      title: form.title.trim(),
      subject: form.subject.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate,
      totalStudents,
      status: form.status,
    };

    setSavingAssignment(true);
    setFormError("");
    try {
      const isEdit = modalMode === "edit" && activeAssignment?.id;
      const response = await fetch(
        isEdit ? `${API_BASE}/api/teacher/assignments/${activeAssignment.id}` : `${API_BASE}/api/teacher/assignments`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || (isEdit ? "Unable to update assignment" : "Unable to create assignment"));
      }

      if (attachmentFile) {
        const fileBody = new FormData();
        fileBody.append("file", attachmentFile);
        const attachmentResponse = await fetch(
          `${API_BASE}/api/teacher/assignments/${data.id}/attachment`,
          {
            method: "PUT",
            headers: {
              ...getAuthHeaders(),
            },
            body: fileBody,
          },
        );
        const attachmentData = await attachmentResponse.json().catch(() => ({}));
        if (!attachmentResponse.ok) {
          throw new Error(attachmentData?.message || "Unable to upload assignment file");
        }
      }

      setModalOpen(false);
      await loadAssignments();
      if (data?.id) {
        setSelectedAssignmentId(data.id);
      }
    } catch (err) {
      setFormError(err.message || "Unable to save assignment");
    } finally {
      setSavingAssignment(false);
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

  async function gradeSubmission(submission) {
    const nextMark = window.prompt("Enter mark (example: 82/100)", submission.mark || "");
    if (nextMark == null) return;
    if (!nextMark.trim()) {
      setError("Mark is required");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/teacher/assignments/submissions/${submission.id}/mark`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ mark: nextMark.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Unable to save mark");
      }
      await loadSubmissions(selectedAssignment?.id);
      await loadAssignments();
    } catch (err) {
      setError(err.message || "Unable to save mark");
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
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load submissions");
      setSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
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

  const activeAssignment = selectedAssignment || assignments[0] || null;
  const activeSubmittedCount = activeAssignment ? activeAssignment.submittedCount ?? submissions.length : 0;
  const activeTotalStudents = activeAssignment?.totalStudents || 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5 gap-3 flex-wrap">
        <div>
          <p className={`text-sm ${t.textSub}`}>Live data from the backend</p>
          <p className={`text-lg font-bold ${t.text}`}>Assignments</p>
        </div>
        <div className="flex gap-2">
          <GhostBtn t={t} onClick={loadAssignments}>Refresh</GhostBtn>
          <GhostBtn t={t} onClick={openEditModal}>Edit</GhostBtn>
          <PrimaryBtn onClick={openCreateModal}>+ New Assignment</PrimaryBtn>
        </div>
      </div>

      {error && <div className={`${t.card} rounded-xl mb-4 px-4 py-3 text-sm text-red-500`}>{error}</div>}

      <Card title="Active Assignments" t={t} noPad>
        <table className="w-full">
          <thead>
            <tr className={t.tableHead}>
              {["Title", "Subject", "Due Date", "Submitted", "Graded", "File", "Status"].map((h) => <Th key={h} t={t}>{h}</Th>)}
            </tr>
          </thead>
          <tbody>
            {loadingAssignments && (
              <tr>
                <Td t={t} className={t.textSub} colSpan={7}>Loading assignments from database...</Td>
              </tr>
            )}

            {!loadingAssignments && assignments.length === 0 && (
              <tr>
                <Td t={t} className={t.textSub} colSpan={7}>No assignments found.</Td>
              </tr>
            )}

            {!loadingAssignments && assignments.map((assignment) => (
              <tr
                key={assignment.id}
                className={`${t.tableRow} cursor-pointer ${assignment.id === activeAssignment?.id ? t.navActive : ""}`}
                onClick={() => setSelectedAssignmentId(assignment.id)}
              >
                <td className="py-3 pl-5 pr-3">
                  <p className={`text-sm font-bold ${t.text}`}>{assignment.title}</p>
                  <p className={`text-xs ${t.textTert}`}>{assignment.description}</p>
                </td>
                <Td t={t}>{assignment.subject}</Td>
                <Td t={t}>{formatDueDate(assignment.dueDate)}</Td>
                <Td t={t}>{assignment.submittedCount}/{assignment.totalStudents}</Td>
                <Td t={t}>{assignment.gradedCount}/{assignment.totalStudents}</Td>
                <td className="py-3 px-3 text-sm">{assignment.hasAttachment ? <button onClick={(e) => { e.stopPropagation(); downloadFile(assignment.attachmentUrl); }} className="text-blue-500 font-medium cursor-pointer">{assignment.attachmentName || "Download"}</button> : <span className={t.textTert}>No file</span>}</td>
                <td className="py-3 px-3 pr-5"><Badge v={statusVariant(assignment.status)} t={t}>{assignment.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card
        title={activeAssignment ? `${activeAssignment.title} - Submissions` : "Submissions"}
        extra={activeAssignment ? <Badge v={statusVariant(activeAssignment.status)} t={t}>{`${activeSubmittedCount} / ${activeTotalStudents} submitted`}</Badge> : null}
        t={t}
        noPad
      >
        <table className="w-full">
          <thead>
            <tr className={t.tableHead}>{["Student", "Submitted At", "File", "Mark", "Action"].map((h) => <Th key={h} t={t}>{h}</Th>)}</tr>
          </thead>
          <tbody>
            {loadingSubmissions && (
              <tr>
                <Td t={t} className={t.textSub} colSpan={5}>Loading submissions...</Td>
              </tr>
            )}

            {!loadingSubmissions && activeAssignment && submissions.length === 0 && (
              <tr>
                <Td t={t} className={t.textSub} colSpan={5}>No submissions for this assignment yet.</Td>
              </tr>
            )}

            {!loadingSubmissions && submissions.map((submission) => (
              <tr key={submission.id} className={t.tableRow}>
                <Td t={t}><span className="font-medium">{submission.studentName}</span></Td>
                <Td t={t} className={t.textSub}>{formatSubmittedAt(submission.submittedAt)}</Td>
                <td className="py-3 px-3 text-sm">{submission.fileName ? <span className="text-blue-500 font-medium">{submission.fileName}</span> : <span className={t.textTert}>Not submitted</span>}</td>
                <Td t={t} className={t.textTert}>{submission.mark || "-"}</Td>
                <td className="py-3 px-3 pr-5">
                  <div className="flex items-center gap-2">
                    <GhostBtn small t={t} onClick={() => downloadFile(submission.downloadUrl)}>Download</GhostBtn>
                    {submission.graded ? <Badge v="green" t={t}>Graded</Badge> : <GhostBtn small t={t} onClick={() => gradeSubmission(submission)}>Grade</GhostBtn>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4 bg-black/35">
          <div className={`${t.card} rounded-xl w-full max-w-xl`}> 
            <div className={`flex items-center justify-between px-5 py-3.5 border-b ${t.divider}`}>
              <p className={`text-sm font-semibold ${t.text}`}>{modalMode === "edit" ? "Edit Assignment" : "New Assignment"}</p>
              <button className={`text-sm ${t.textSub} cursor-pointer`} onClick={closeModal}>Close</button>
            </div>
            <form onSubmit={submitAssignmentForm} className="px-5 py-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="block">
                  <span className={`text-xs ${t.textSub}`}>Title</span>
                  <input
                    className={`mt-1 w-full rounded-lg px-3 py-2 text-sm ${t.inputBg} outline-none`}
                    value={form.title}
                    onChange={(e) => updateFormField("title", e.target.value)}
                    placeholder="Physics Paper 5"
                  />
                </label>
                <label className="block">
                  <span className={`text-xs ${t.textSub}`}>Subject</span>
                  <input
                    className={`mt-1 w-full rounded-lg px-3 py-2 text-sm ${t.inputBg} outline-none`}
                    value={form.subject}
                    onChange={(e) => updateFormField("subject", e.target.value)}
                    placeholder="Physics"
                  />
                </label>
              </div>

              <label className="block">
                <span className={`text-xs ${t.textSub}`}>Description</span>
                <textarea
                  className={`mt-1 w-full rounded-lg px-3 py-2 text-sm min-h-[84px] ${t.inputBg} outline-none`}
                  value={form.description}
                  onChange={(e) => updateFormField("description", e.target.value)}
                  placeholder="Short assessment note"
                />
              </label>

              <label className="block">
                <span className={`text-xs ${t.textSub}`}>Assignment PDF/File</span>
                <input
                  type="file"
                  className={`mt-1 w-full rounded-lg px-3 py-2 text-sm ${t.inputBg} outline-none`}
                  onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                />
                <p className={`text-[11px] mt-1 ${t.textTert}`}>{attachmentFile ? attachmentFile.name : "Optional. Upload or replace attachment."}</p>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="block">
                  <span className={`text-xs ${t.textSub}`}>Due Date</span>
                  <input
                    type="date"
                    className={`mt-1 w-full rounded-lg px-3 py-2 text-sm ${t.inputBg} outline-none`}
                    value={form.dueDate}
                    onChange={(e) => updateFormField("dueDate", e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className={`text-xs ${t.textSub}`}>Total Students</span>
                  <input
                    type="number"
                    min="0"
                    className={`mt-1 w-full rounded-lg px-3 py-2 text-sm ${t.inputBg} outline-none`}
                    value={form.totalStudents}
                    onChange={(e) => updateFormField("totalStudents", e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className={`text-xs ${t.textSub}`}>Status</span>
                  <select
                    className={`mt-1 w-full rounded-lg px-3 py-2 text-sm ${t.selectBg} outline-none`}
                    value={form.status}
                    onChange={(e) => updateFormField("status", e.target.value)}
                  >
                    {ASSIGNMENT_STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>
              </div>

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button type="button" onClick={closeModal} className={`inline-flex items-center gap-1.5 border ${t.divider} font-semibold rounded-lg transition-colors cursor-pointer ${t.textSub} ${t.navHover} px-4 py-2 text-sm`}>
                  Cancel
                </button>
                <PrimaryBtn>{savingAssignment ? "Saving..." : (modalMode === "edit" ? "Save Changes" : "Create Assignment")}</PrimaryBtn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
