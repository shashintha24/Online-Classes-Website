import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardPage from "./segments/DashboardPage";
import MarksPage from "./segments/MarksPage";
import AttendancePage from "./segments/AttendancePage";
import FeesPage from "./segments/FeesPage";
import MaterialsPage from "./segments/MaterialsPage";
import AssignmentsPage from "./segments/AssignmentsPage";
import NotificationsPage from "./segments/NotificationsPage";
import { Badge, Icons, NAV_ITEMS, PAGE_TITLES, THEMES } from "./segments/StudentShared";

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

export default function StudentPortal() {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [studentProfile, setStudentProfile] = useState(null);
  const navigate = useNavigate();
  const t = darkMode ? THEMES.dark : THEMES.light;

  async function loadUnreadCount() {
    try {
      const response = await fetch(`${API_BASE}/api/notifications`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      const data = await response.json().catch(() => []);
      if (!response.ok || !Array.isArray(data)) {
        setUnreadCount(0);
        return;
      }
      setUnreadCount(data.filter((item) => item?.unread).length);
    } catch {
      setUnreadCount(0);
    }
  }

  useEffect(() => {
    loadUnreadCount();
  }, []);

  useEffect(() => {
    loadUnreadCount();
  }, [activePage]);

  useEffect(() => {
    async function loadStudentProfile() {
      try {
        const response = await fetch(`${API_BASE}/api/students/me`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          return;
        }
        setStudentProfile(data);
      } catch {
        // Keep portal usable even if profile API fails.
      }
    }

    loadStudentProfile();
  }, []);

  let user = { username: "", email: "", role: "" };
  try {
    user = JSON.parse(sessionStorage.getItem("ep_auth")) || user;
  } catch {}

  const initials = user.username
    ? user.username.split(" ").filter(Boolean).map((name) => name[0]).join("").toUpperCase().slice(0, 2)
    : "S";
  const displayName = user.username || "Student";
  const firstName = displayName.split(" ").filter(Boolean)[0] || displayName;
  const enrolledCourse = studentProfile?.grade || user.courseName || user.course || user.enrollmentName || "2026 A/L Revision";
  const badgeLabel = user.badgeLabel || enrolledCourse || "2026 Revision";
  const studentId = user.userId || "1042";

  const handleLogout = () => {
    sessionStorage.removeItem("ep_auth");
    navigate("/login");
  };

  const pageComponents = {
    home: <DashboardPage t={t} />,
    marks: <MarksPage t={t} />,
    attendance: <AttendancePage t={t} />,
    fees: <FeesPage t={t} />,
    materials: <MaterialsPage t={t} />,
    assignments: <AssignmentsPage t={t} />,
    notifications: <NotificationsPage t={t} />,
  };

  return (
    <div className={`min-h-screen flex font-sans ${t.bg} ${t.text} transition-colors duration-200`} style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-56 flex flex-col ${t.sidebar} transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="px-5 py-4 border-b border-inherit">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-bold text-[#a435f0]">ElectroPhysics</p>
              <p className={`text-[11px] ${t.textTert} mt-0.5`}>Student Portal</p>
            </div>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><Icons.Close /></button>
          </div>
        </div>

        <div className="px-4 py-3.5 border-b border-inherit flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#ede9fe] text-[#3c3489] flex items-center justify-center text-xs font-bold flex-shrink-0">KP</div>
          <div className="min-w-0">
            <p className={`text-sm font-semibold ${t.text} truncate`}>{displayName}</p>
            <p className={`text-[11px] ${t.textTert} truncate`}>{enrolledCourse}</p>
          </div>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          <p className={`text-[10px] font-semibold uppercase tracking-widest px-3 pb-1.5 ${t.textTert}`}>Menu</p>
          {NAV_ITEMS.map(({ id, label, Icon, badge }) => (
            (() => {
              const activeBadge = id === "notifications" ? unreadCount : badge;
              return (
            <button
              key={id}
              onClick={() => { setActivePage(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${activePage === id ? t.navActive : `${t.textSub} ${t.navHover}`}`}
            >
              <span className={activePage === id ? "" : t.navIcon}><Icon /></span>
              <span className="flex-1 text-left">{label}</span>
              {activeBadge > 0 && <span className="bg-[#a435f0] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeBadge}</span>}
            </button>
              );
            })()
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-inherit">
          <p className={`text-xs ${t.textTert}`}>Logged in as</p>
          <p className={`text-sm font-semibold ${t.text}`}>{user.username || "Student"}</p>
          <button className="text-xs text-red-500 hover:text-red-600 mt-2 cursor-pointer font-medium" onClick={handleLogout}>Sign out</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <header className={`sticky top-0 z-10 ${t.topbar} px-5 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Icons.Menu /></button>
            <div>
              <p className={`text-base font-bold ${t.text}`}>{PAGE_TITLES[activePage]}</p>
              <p className={`text-xs ${t.textTert} hidden sm:block`}>Good evening, {firstName} · Saturday, April 11, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3 relative">
            <Badge variant="purple" t={t}>{badgeLabel} · #{studentId}</Badge>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${t.toggleBtn} transition-colors cursor-pointer`}
            >
              {darkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            <div className="relative">
              <button
                className="w-8 h-8 rounded-full bg-[#ede9fe] text-[#3c3489] flex items-center justify-center text-xs font-bold border border-[#d1d5db]"
                onClick={() => setDropdownOpen((value) => !value)}
                aria-label="Profile menu"
              >
                {initials}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => { setProfileOpen(true); setDropdownOpen(false); }}
                  >
                    <Icons.Person /> View Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500 flex items-center gap-2 border-t border-gray-100"
                    onClick={handleLogout}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"/></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {profileOpen && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl p-6 w-80 relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setProfileOpen(false)}>
                <Icons.Close />
              </button>
              <div className="flex flex-col items-center gap-2 mb-4">
                <div className="w-14 h-14 rounded-full bg-[#ede9fe] text-[#3c3489] flex items-center justify-center text-xl font-bold border border-[#d1d5db]">
                  {initials}
                </div>
                <div className="text-lg font-semibold">{user.username || "Student"}</div>
                <div className="text-xs text-gray-500">{user.email || "No email available"}</div>
                <div className="text-xs text-gray-400">Role: {user.role || "STUDENT"}</div>
                <div className="text-xs text-gray-400">Enrolled course: {enrolledCourse}</div>
              </div>
              <button className="mt-2 w-full py-2 rounded-lg bg-[#a435f0] text-white font-semibold hover:bg-[#8710d8]" onClick={() => setProfileOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          {pageComponents[activePage]}
        </main>
      </div>
    </div>
  );
}
