import { useEffect, useMemo, useState } from "react";
import { AVATAR_COLORS, Badge, Card, GhostBtn, I, PrimaryBtn, Td, Th } from "./TeacherShared";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const EMPTY_STUDENT_FORM = {
  fullName: "",
  username: "",
  email: "",
  grade: "",
  password: "",
};

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

export default function StudentsPage({ t }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [form, setForm] = useState(EMPTY_STUDENT_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadStudents() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/admin/students`, {
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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function resetModalState() {
    setForm(EMPTY_STUDENT_FORM);
    setSelectedStudentId(null);
    setFormError("");
    setSaving(false);
  }

  function openAddModal() {
    setModalMode("add");
    setForm({ ...EMPTY_STUDENT_FORM, grade: "2026 Revision", password: "student123" });
    setSelectedStudentId(null);
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(student) {
    setModalMode("edit");
    setForm({
      fullName: student.fullName || "",
      username: student.username || "",
      email: student.email || "",
      grade: student.grade || "",
      password: "",
    });
    setSelectedStudentId(student.userId);
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    resetModalState();
  }

  function updateFormField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateForm() {
    if (!form.fullName.trim()) return "Full name is required";
    if (!form.username.trim()) return "Username is required";
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) return "Enter a valid email address";
    if (modalMode === "add" && form.password.trim().length < 6) return "Password must be at least 6 characters";
    if (modalMode === "edit" && form.password.trim() && form.password.trim().length < 6) return "New password must be at least 6 characters";
    return "";
  }

  async function handleModalSubmit(e) {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      grade: form.grade.trim() || "N/A",
      password: form.password,
    };

    setSaving(true);
    setFormError("");
    setError("");

    try {
      const isEdit = modalMode === "edit";
      const response = await fetch(
        isEdit ? `${API_BASE}/api/admin/students/${selectedStudentId}` : `${API_BASE}/api/admin/students`,
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
        throw new Error(data?.message || (isEdit ? "Unable to update student" : "Unable to add student"));
      }
      await loadStudents();
      closeModal();
    } catch (err) {
      setFormError(err.message || "Unable to save student");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveStudent(student) {
    const ok = window.confirm(`Remove ${student.fullName}? This cannot be undone.`);
    if (!ok) return;

    try {
      const response = await fetch(`${API_BASE}/api/admin/students/${student.userId}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Unable to remove student");
      }
      await loadStudents();
    } catch (err) {
      setError(err.message || "Unable to remove student");
    }
  }

  const gradeOptions = useMemo(() => {
    const unique = Array.from(new Set(students.map((s) => s.grade).filter(Boolean)));
    return unique;
  }, [students]);

  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((student) => {
      const hitQuery = !q
        || student.fullName?.toLowerCase().includes(q)
        || student.username?.toLowerCase().includes(q)
        || student.email?.toLowerCase().includes(q)
        || String(student.userId).includes(q);
      const hitGrade = gradeFilter === "all" || student.grade === gradeFilter;
      return hitQuery && hitGrade;
    });
  }, [students, query, gradeFilter]);

  function initialsFromName(name) {
    if (!name) return "NA";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  }

  return (
    <div className="p-6">
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className={`flex items-center gap-2 flex-1 min-w-[160px] ${t.inputBg} rounded-lg px-3 py-2`}>
          <I.Search />
          <input
            className="bg-transparent outline-none text-sm w-full"
            placeholder="Search students..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className={`${t.selectBg} rounded-lg px-3 py-2 text-sm cursor-pointer focus:outline-none`}
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
        >
          <option value="all">All grades</option>
          {gradeOptions.map((grade) => (
            <option key={grade} value={grade}>{grade}</option>
          ))}
        </select>
        <PrimaryBtn onClick={loadStudents}>Refresh</PrimaryBtn>
        <PrimaryBtn onClick={openAddModal}>+ Add Student</PrimaryBtn>
      </div>

      {error && (
        <div className={`${t.card} rounded-xl mb-4 px-4 py-3 text-sm text-red-500`}>
          {error}
        </div>
      )}

      <Card t={t} noPad>
        <table className="w-full">
          <thead><tr className={t.tableHead}>{["Student", "Grade", "Username", "Email", "Status", "Actions"].map((h) => <Th key={h} t={t}>{h}</Th>)}</tr></thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className={`py-6 px-5 text-sm ${t.textSub}`}>Loading students from database...</td>
              </tr>
            )}

            {!loading && filteredStudents.length === 0 && (
              <tr>
                <td colSpan={6} className={`py-6 px-5 text-sm ${t.textSub}`}>No students found.</td>
              </tr>
            )}

            {!loading && filteredStudents.map((s, i) => (
              <tr key={i} className={t.tableRow}>
                <td className="py-3 pl-5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>{initialsFromName(s.fullName)}</div>
                    <div>
                      <p className={`text-sm font-semibold ${t.text}`}>{s.fullName}</p>
                      <p className={`text-xs ${t.textTert}`}>ID #{s.userId}</p>
                    </div>
                  </div>
                </td>
                <Td t={t}><Badge v="gray" t={t}>{s.grade || "N/A"}</Badge></Td>
                <td className={`py-3 px-3 text-sm font-bold ${t.text}`}>{s.username}</td>
                <Td t={t}>{s.email || "-"}</Td>
                <td className="py-3 px-3"><Badge v="green" t={t}>Active</Badge></td>
                <td className="py-3 px-3 pr-5 flex gap-2">
                  <GhostBtn small t={t} onClick={() => openEditModal(s)}>Edit</GhostBtn>
                  <GhostBtn small t={t} onClick={() => handleRemoveStudent(s)}>Delete</GhostBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={closeModal}
            aria-hidden="true"
          />
          <div className={`${t.card} relative w-full max-w-xl rounded-2xl border shadow-2xl`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${t.divider}`}>
              <div>
                <p className={`text-lg font-bold ${t.text}`}>
                  {modalMode === "add" ? "Add New Student" : "Update Student"}
                </p>
                <p className={`text-xs ${t.textSub}`}>
                  {modalMode === "add"
                    ? "Create a student account with profile details"
                    : "Edit profile details and optionally reset password"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className={`p-2 rounded-lg ${t.navHover} ${t.textSub} transition-colors cursor-pointer`}
                aria-label="Close"
              >
                <I.Close />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="px-5 py-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="space-y-1.5">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${t.textTert}`}>Full Name</span>
                  <input
                    className={`w-full rounded-lg px-3 py-2.5 text-sm outline-none ${t.inputBg}`}
                    placeholder="Kasun Madushan"
                    value={form.fullName}
                    onChange={(e) => updateFormField("fullName", e.target.value)}
                    required
                  />
                </label>

                <label className="space-y-1.5">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${t.textTert}`}>Username</span>
                  <input
                    className={`w-full rounded-lg px-3 py-2.5 text-sm outline-none ${t.inputBg}`}
                    placeholder="kasun2026"
                    value={form.username}
                    onChange={(e) => updateFormField("username", e.target.value)}
                    required
                  />
                </label>

                <label className="space-y-1.5">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${t.textTert}`}>Email</span>
                  <input
                    type="email"
                    className={`w-full rounded-lg px-3 py-2.5 text-sm outline-none ${t.inputBg}`}
                    placeholder="student@example.com"
                    value={form.email}
                    onChange={(e) => updateFormField("email", e.target.value)}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${t.textTert}`}>Grade / Batch</span>
                  <input
                    className={`w-full rounded-lg px-3 py-2.5 text-sm outline-none ${t.inputBg}`}
                    placeholder="2026 Revision"
                    value={form.grade}
                    onChange={(e) => updateFormField("grade", e.target.value)}
                  />
                </label>
              </div>

              <label className="space-y-1.5 block">
                <span className={`text-xs font-semibold uppercase tracking-wide ${t.textTert}`}>
                  {modalMode === "add" ? "Password" : "New Password (Optional)"}
                </span>
                <input
                  type="password"
                  className={`w-full rounded-lg px-3 py-2.5 text-sm outline-none ${t.inputBg}`}
                  placeholder={modalMode === "add" ? "Minimum 6 characters" : "Leave empty to keep current password"}
                  value={form.password}
                  onChange={(e) => updateFormField("password", e.target.value)}
                  required={modalMode === "add"}
                />
              </label>

              {formError && (
                <div className="rounded-lg bg-red-500/10 border border-red-400/30 px-3 py-2 text-sm text-red-500">
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`inline-flex items-center gap-1.5 border ${t.divider} font-semibold rounded-lg transition-colors cursor-pointer ${t.textSub} ${t.navHover} px-4 py-2 text-sm`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center min-w-[132px] gap-1.5 bg-[#a435f0] hover:bg-[#8710d8] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors cursor-pointer px-4 py-2 text-sm"
                >
                  {saving ? "Saving..." : modalMode === "add" ? "Create Student" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
