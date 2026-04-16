import { useState } from "react";
import { Link } from "react-router-dom";

// ─── THEME TOKENS (mirrored from StudentPortal) ───────────────────────────────
const THEMES = {
  light: {
    bg: "bg-[#f7f9fa]",
    surface: "bg-white",
    card: "bg-white border border-[#e0e0e0]",
    topbar: "bg-white border-b border-[#e0e0e0]",
    text: "text-gray-900",
    textSub: "text-gray-500",
    textTert: "text-gray-400",
    input: "bg-[#f7f9fa] border border-[#e0e0e0] text-gray-800",
    navHover: "hover:bg-[#f0f0f0]",
    toggleBtn: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    divider: "border-[#e0e0e0]",
    pillBg: "bg-[#f3e8ff] text-[#3c3489] border border-[#d8b4fe]",
    statBorder: "border-r border-[#e0e0e0]",
    stepLine: "bg-[#e0e0e0]",
    mockupBar: "bg-[#f7f9fa] border-b border-[#e0e0e0]",
    mockupUrl: "bg-white border border-[#e0e0e0] text-gray-400",
    mockupSidebar: "bg-white border-r border-[#e0e0e0]",
    mockupMetric: "bg-[#f7f9fa]",
    mockupCard: "bg-white border border-[#e0e0e0]",
    mockupBarBg: "bg-gray-100",
    pagePill: "bg-[#f7f9fa] border border-[#e0e0e0] hover:border-[#d8b4fe]",
    footerBg: "bg-white border-t border-[#e0e0e0]",
  },
  dark: {
    bg: "bg-[#1c1d1f]",
    surface: "bg-[#2d2f31]",
    card: "bg-[#2d2f31] border border-[#3e4143]",
    topbar: "bg-[#2d2f31] border-b border-[#3e4143]",
    text: "text-gray-100",
    textSub: "text-gray-400",
    textTert: "text-gray-500",
    input: "bg-[#3e4143] border border-[#555] text-gray-200",
    navHover: "hover:bg-[#3e4143]",
    toggleBtn: "bg-[#3e4143] text-gray-300 hover:bg-[#4a4d50]",
    divider: "border-[#3e4143]",
    pillBg: "bg-[#3c3489]/30 text-[#a5b4fc] border border-[#4f46e5]/40",
    statBorder: "border-r border-[#3e4143]",
    stepLine: "bg-[#3e4143]",
    mockupBar: "bg-[#1c1d1f] border-b border-[#3e4143]",
    mockupUrl: "bg-[#3e4143] border border-[#555] text-gray-500",
    mockupSidebar: "bg-[#2d2f31] border-r border-[#3e4143]",
    mockupMetric: "bg-[#1c1d1f]",
    mockupCard: "bg-[#2d2f31] border border-[#3e4143]",
    mockupBarBg: "bg-[#3e4143]",
    pagePill: "bg-[#2d2f31] border border-[#3e4143] hover:border-[#7c3aed]",
    footerBg: "bg-[#2d2f31] border-t border-[#3e4143]",
  },
};

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Icons = {
  Sun: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Moon: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Close: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Dashboard: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Marks: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  CreditCard: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  Book: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  File: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

// ─── NAV PAGES ────────────────────────────────────────────────────────────────
const NAV_PAGES = [
  { label: "Dashboard", Icon: Icons.Dashboard },
  { label: "My Marks", Icon: Icons.Marks },
  { label: "Attendance", Icon: Icons.Calendar },
  { label: "My Fees", Icon: Icons.CreditCard },
  { label: "Materials", Icon: Icons.Book },
  { label: "Assignments", Icon: Icons.File },
  { label: "Notifications", Icon: Icons.Bell },
];

// ─── FEATURES DATA ────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <Icons.Dashboard />,
    iconBg: "bg-[#f3e8ff] text-[#a435f0]",
    title: "Smart dashboard",
    desc: "See your average mark, class rank, attendance rate, and upcoming deadlines at a glance.",
  },
  {
    icon: <Icons.Marks />,
    iconBg: "bg-[#ede9fe] text-[#3c3489]",
    title: "Marks & progress",
    desc: "Test-by-test results with class averages. Know where you stand and what needs work.",
  },
  {
    icon: <Icons.Calendar />,
    iconBg: "bg-[#d1fae5] text-emerald-700",
    title: "Attendance tracking",
    desc: "Monthly and weekly attendance views. Never lose track of your present / absent record.",
  },
  {
    icon: <Icons.CreditCard />,
    iconBg: "bg-[#fef3c7] text-amber-700",
    title: "Fee management",
    desc: "View payment history, download receipts, and check outstanding balances instantly.",
  },
  {
    icon: <Icons.Book />,
    iconBg: "bg-[#dbeafe] text-blue-700",
    title: "Study materials",
    desc: "Week-by-week notes, lesson recordings, and past papers organised by subject.",
  },
  {
    icon: <Icons.File />,
    iconBg: "bg-[#fee2e2] text-red-700",
    title: "Assignments",
    desc: "Track submissions, deadlines, and graded results across all your subjects in one view.",
  },
];

const STEPS = [
  { num: "1", title: "Get your login", desc: "Your teacher creates your account and sends a secure login link directly to you." },
  { num: "2", title: "Access your portal", desc: "Log in from any device — phone, tablet, or laptop — in light or dark mode." },
  { num: "3", title: "Track everything", desc: "Marks, attendance, and fees update in real time as your teacher adds data." },
];

const STATS = [
  { value: "2,400+", label: "Students enrolled" },
  { value: "98%", label: "Fee tracking accuracy" },
  { value: "7", label: "Modules in one portal" },
  { value: "Light & dark", label: "Theme support" },
];

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "StudentPortal", to: "/student" },
  { label: "TuitionPlatform", to: "/tuition" },
];

// ─── MINI DASHBOARD MOCKUP ────────────────────────────────────────────────────
function DashboardMockup({ t }) {
  const bars = [
    { label: "Physics", val: 74, color: "bg-[#a435f0]" },
    { label: "Maths", val: 81, color: "bg-emerald-500" },
    { label: "Chemistry", val: 67, color: "bg-orange-500" },
  ];

  return (
    <div className={`${t.card} rounded-2xl overflow-hidden max-w-2xl mx-auto`} style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      {/* Browser chrome */}
      <div className={`${t.mockupBar} px-4 py-2.5 flex items-center gap-3`}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className={`${t.mockupUrl} flex-1 max-w-xs mx-auto text-center text-xs py-1 px-4 rounded`}>
          ElectroPhysics.lk/portal/dashboard
        </div>
      </div>

      {/* App shell */}
      <div className="flex" style={{ height: 260 }}>
        {/* Mini sidebar */}
        <div className={`${t.mockupSidebar} w-36 flex-shrink-0 px-2 py-3`}>
          <p className="text-xs font-bold text-[#a435f0] px-2 mb-3">ElectroPhysics</p>
          {["Dashboard", "My Marks", "Attendance", "Fees", "Materials"].map((item, i) => (
            <div
              key={item}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs mb-0.5 ${
                i === 0 ? "bg-[#ede9fe] text-[#3c3489] font-semibold" : t.textSub
              }`}
            >
              <div className="w-2 h-2 rounded-sm border border-current opacity-60 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>

        {/* Mini main */}
        <div className="flex-1 p-3 overflow-hidden">
          {/* Metric row */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { val: "74%", label: "Avg Mark", color: "text-[#a435f0]" },
              { val: "88%", label: "Attendance", color: "text-emerald-500" },
              { val: "#3", label: "Rank", color: "text-[#3c3489]" },
              { val: "89th", label: "Percentile", color: "text-amber-500" },
            ].map(({ val, label, color }) => (
              <div key={label} className={`${t.mockupMetric} rounded-lg p-2 text-center`}>
                <p className={`text-sm font-bold ${color}`}>{val}</p>
                <p className={`text-[9px] ${t.textTert} mt-0.5`}>{label}</p>
              </div>
            ))}
          </div>

          {/* Marks card */}
          <div className={`${t.mockupCard} rounded-lg p-2.5`}>
            <p className={`text-[9px] font-semibold uppercase tracking-wider ${t.textTert} mb-2`}>Marks Overview</p>
            {bars.map(({ label, val, color }) => (
              <div key={label} className="flex items-center gap-2 mb-1.5">
                <span className={`text-[10px] w-14 flex-shrink-0 ${t.textSub}`}>{label}</span>
                <div className={`flex-1 h-1.5 ${t.mockupBarBg} rounded-full overflow-hidden`}>
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${val}%` }} />
                </div>
                <span className={`text-[10px] w-7 text-right font-semibold ${t.text}`}>{val}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN LANDING PAGE ────────────────────────────────────────────────────────
export default function ElectroPhysicsLanding({ onEnterPortal }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = darkMode ? THEMES.dark : THEMES.light;

  return (
    <div
      className={`min-h-screen ${t.bg} ${t.text} transition-colors duration-200 relative overflow-hidden`}
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#a435f0]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-72 -right-20 w-72 h-72 rounded-full bg-[#3c3489]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className={`sticky top-0 z-20 ${t.topbar} transition-colors duration-200 backdrop-blur-xl bg-opacity-90`}>
        <div className="max-w-[1400px] mx-auto px-5 py-3.5 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden p-1.5 rounded-lg mr-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <Icons.Close /> : <Icons.Menu />}
            </button>
            <div>
              <span className="text-lg font-bold text-[#a435f0]">Electro</span>
              <span className={`text-lg font-bold text-[#3c3489]`}>Physics</span>
            </div>
            <span className={`hidden sm:inline text-xs ${t.textTert} ml-1`}>Student Portal</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((item) => (
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`text-sm px-4 py-2 rounded-lg ${t.textSub} ${t.navHover} transition-colors cursor-pointer`}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className={`text-sm px-4 py-2 rounded-lg ${t.textSub} ${t.navHover} transition-colors cursor-pointer`}
                >
                  {item.label}
                </a>
              )
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">
            <Link
              to="/login"
              className="hidden xl:inline-flex items-center border border-[#a78bfa] text-[#6d28d9] font-semibold px-4 py-2 rounded-xl text-sm hover:bg-[#ede9fe] transition-colors cursor-pointer"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="hidden xl:inline-flex items-center bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors cursor-pointer"
            >
              Sign up
            </Link>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${t.toggleBtn} transition-colors cursor-pointer`}
            >
              {darkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            {onEnterPortal && (
              <button
                onClick={onEnterPortal}
                className="hidden xl:inline-flex text-sm font-semibold bg-[#a435f0] hover:bg-[#8710d8] text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Log in →
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden ${t.surface} border-t ${t.divider} px-5 py-3 space-y-1`}>
            {NAV_LINKS.map((item) => (
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`block w-full text-left text-sm px-3 py-2.5 rounded-lg ${t.textSub} ${t.navHover} transition-colors cursor-pointer`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className={`block w-full text-left text-sm px-3 py-2.5 rounded-lg ${t.textSub} ${t.navHover} transition-colors cursor-pointer`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              )
            ))}

            <div className={`pt-2 mt-2 border-t ${t.divider} space-y-1`}>
              <Link
                to="/login"
                className={`block w-full text-left text-sm px-3 py-2.5 rounded-lg ${t.textSub} ${t.navHover} transition-colors cursor-pointer`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="block w-full text-left text-sm px-3 py-2.5 rounded-lg bg-[#7c3aed] text-white font-semibold hover:bg-[#6d28d9] transition-colors cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className={`${t.surface} border-b ${t.divider} transition-colors duration-200 relative`}>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#a435f0]/10 via-transparent to-[#3c3489]/10" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-5 pt-12 sm:pt-16 pb-12 sm:pb-14 grid lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-8 items-start lg:items-center">
          <div>
            <span className={`inline-flex items-center gap-2 text-xs font-medium px-3.5 py-1.5 rounded-full ${t.pillBg} mb-6`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#a435f0]" />
              Built for A/L students in Sri Lanka
            </span>

            <h1 className={`text-3xl sm:text-5xl font-bold leading-tight tracking-tight ${t.text} max-w-2xl mb-5 break-words`}>
              Your academic life, <span className="bg-gradient-to-r from-[#a435f0] to-[#3c3489] bg-clip-text text-transparent">organized</span> in one place
            </h1>

            <p className={`text-lg ${t.textSub} max-w-lg mb-9 leading-relaxed`}>
              Track marks, attendance, fees, and study materials with a clean portal designed for
              student focus and parent visibility.
            </p>

            <div className="flex flex-wrap items-center gap-3 w-full">
              {onEnterPortal && (
                <button
                  onClick={onEnterPortal}
                  className="inline-flex items-center gap-2 bg-[#a435f0] hover:bg-[#8710d8] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors cursor-pointer shadow-lg shadow-[#a435f0]/25"
                >
                  Open my portal <Icons.ArrowRight />
                </button>
              )}
              <button
                className="inline-flex items-center gap-2 border border-[#a78bfa] bg-[#ede9fe]/70 text-[#3c3489] font-semibold px-6 py-3 rounded-xl text-sm hover:bg-[#ddd6fe] transition-colors cursor-pointer"
              >
                See features
              </button>
            </div>
          </div>

          <div className={`${t.card} rounded-2xl p-4 sm:p-6 backdrop-blur-sm border-2 border-[#d8b4fe] bg-gradient-to-br from-[#f8f5ff] to-[#efe9ff] max-w-full ${darkMode ? "!bg-gradient-to-br !from-[#2d2148] !to-[#201733]" : ""}`}>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-4">Live student snapshot</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {[
                { label: "Average Mark", value: "74%", color: "text-[#8b5cf6]" },
                { label: "Attendance", value: "88%", color: "text-[#a435f0]" },
                { label: "Class Rank", value: "#3", color: "text-[#3c3489]" },
                { label: "Pending Fees", value: "0", color: "text-[#6d28d9]" },
              ].map(({ label, value, color }) => (
                <div key={label} className={`${darkMode ? "bg-[#1e1a2c] border border-[#4b3e67]" : "bg-white/80 border border-[#e9d5ff]"} rounded-xl p-3`}>
                  <p className={`text-xs ${t.textTert} mb-1`}>{label}</p>
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
            <p className={`text-xs ${t.textSub}`}>
              Updated in real time from your teacher dashboard.
            </p>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-5 pb-12">
          <div className={`grid grid-cols-2 sm:grid-cols-4 border-2 border-[#ddd6fe] rounded-2xl overflow-hidden bg-gradient-to-r from-[#faf5ff] to-[#eef2ff] ${darkMode ? "!from-[#251d38] !to-[#1f2338] !border-[#4b3e67]" : ""}`}>
            {STATS.map(({ value, label }) => (
              <div key={label} className={`text-center px-3 sm:px-4 py-4 sm:py-5 bg-transparent border-r last:border-r-0 even:border-r-0 sm:even:border-r ${darkMode ? "border-[#4b3e67]" : "border-[#ddd6fe]"}`}>
                <p className="text-2xl font-bold text-[#7c3aed] tracking-tight">{value}</p>
                <p className={`text-xs ${t.textSub} mt-0.5`}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD MOCKUP ───────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-5 py-14">
        <DashboardMockup t={t} />
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features" className={`${t.surface} border-y ${t.divider} transition-colors duration-200`}>
        <div className="max-w-[1400px] mx-auto px-5 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#a435f0] text-center mb-3">
            Everything you need
          </p>
          <h2 className={`text-3xl font-bold text-center tracking-tight ${t.text} mb-2`}>
            One portal, seven powerful modules
          </h2>
          <p className={`text-center ${t.textSub} mb-10`}>
            From exam results to fee receipts — it's all here.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon, iconBg, title, desc }) => (
              <div key={title} className={`${t.card} rounded-xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
                  {icon}
                </div>
                <p className={`font-semibold text-sm ${t.text} mb-1.5`}>{title}</p>
                <p className={`text-sm ${t.textSub} leading-relaxed`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAGE NAVIGATION STRIP ──────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-5 py-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#a435f0] text-center mb-3">
          Navigation
        </p>
        <h2 className={`text-3xl font-bold text-center tracking-tight ${t.text} mb-10`}>
          Everything accessible in one sidebar
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {NAV_PAGES.map(({ label, Icon }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-2.5 px-3 py-4 rounded-xl border transition-all duration-200 cursor-pointer ${t.pagePill} hover:-translate-y-0.5`}
            >
              <div className="w-9 h-9 rounded-lg bg-[#ede9fe] text-[#3c3489] flex items-center justify-center">
                <Icon />
              </div>
              <span className={`text-xs font-medium ${t.textSub} text-center leading-snug`}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section id="how-it-works" className={`${t.surface} border-y ${t.divider} transition-colors duration-200`}>
        <div className="max-w-[1400px] mx-auto px-5 py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#a435f0] mb-3">
            How it works
          </p>
          <h2 className={`text-3xl font-bold tracking-tight ${t.text} mb-12`}>
            Up and running in minutes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop only) */}
            <div
              className={`hidden sm:block absolute top-6 left-1/3 right-1/3 h-px ${t.stepLine}`}
              style={{ zIndex: 0 }}
            />

            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#a435f0] text-white text-lg font-bold flex items-center justify-center mx-auto mb-4">
                  {num}
                </div>
                <h3 className={`font-semibold text-sm ${t.text} mb-2`}>{title}</h3>
                <p className={`text-sm ${t.textSub} leading-relaxed max-w-xs mx-auto`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-5 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#a435f0] mb-3">
              Included for free
            </p>
            <h2 className={`text-3xl font-bold tracking-tight ${t.text} mb-5`}>
              Everything a student needs, nothing they don't
            </h2>
            <p className={`${t.textSub} leading-relaxed mb-6`}>
              ElectroPhysics is designed to be fast, distraction-free, and easy to use on any device.
              Your teacher manages the data — you just focus on studying.
            </p>
            {[
              "Real-time marks and class rankings",
              "Monthly attendance calendar",
              "Fee receipts and payment history",
              "Week-by-week study materials",
              "Assignment deadlines and results",
              "Light & dark mode support",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 mb-3">
                <div className="w-5 h-5 rounded-full bg-[#d1fae5] text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Icons.Check />
                </div>
                <span className={`text-sm ${t.text}`}>{item}</span>
              </div>
            ))}
          </div>

          {/* Student card */}
          <div className={`${t.card} rounded-2xl p-6`}>
            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-inherit">
              <div className="w-12 h-12 rounded-full bg-[#ede9fe] text-[#3c3489] flex items-center justify-center font-bold text-base flex-shrink-0">
                KP
              </div>
              <div>
                <p className={`font-semibold ${t.text}`}>Kavindu Perera</p>
                <p className={`text-xs ${t.textTert}`}>2026 A/L Revision · #1042</p>
              </div>
              <span className="ml-auto text-xs bg-[#ede9fe] text-[#4c1d95] px-2.5 py-1 rounded-full font-medium">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Average Mark", value: "74%", color: "text-[#a435f0]" },
                { label: "Attendance", value: "88%", color: "text-emerald-500" },
                { label: "Class Rank", value: "#3", color: "text-[#3c3489]" },
                { label: "Percentile", value: "89th", color: "text-amber-500" },
              ].map(({ label, value, color }) => (
                <div key={label} className={`${darkMode ? "bg-[#1c1d1f]" : "bg-[#f7f9fa]"} rounded-xl p-3`}>
                  <p className={`text-xs ${t.textTert} mb-1`}>{label}</p>
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className={`text-xs ${t.textTert} text-center`}>
              Last updated: Saturday, April 11, 2026
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-5 pb-16">
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: "linear-gradient(135deg, #3c3489, #a435f0)" }}
        >
          <h2 className="text-3xl font-bold text-white tracking-tight mb-3">
            Ready to take control of your studies?
          </h2>
          <p className="text-white/80 max-w-md mx-auto mb-8 leading-relaxed">
            Join thousands of A/L students across Sri Lanka who use ElectroPhysics to stay on top
            of their academic journey.
          </p>
          {onEnterPortal && (
            <button
              onClick={onEnterPortal}
              className="inline-flex items-center gap-2 bg-white text-[#a435f0] hover:bg-[#f3e8ff] font-semibold px-7 py-3.5 rounded-xl text-sm transition-colors cursor-pointer"
            >
              Get started — it's free <Icons.ArrowRight />
            </button>
          )}
          <p className="text-white/50 text-xs mt-4">
            No credit card required · Works on all devices
          </p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className={`${t.footerBg} transition-colors duration-200`}>
        <div className="max-w-[1400px] mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-base font-bold text-[#a435f0]">Electro</span>
            <span className={`text-base font-bold text-[#3c3489]`}>Physics</span>
            <span className={`text-xs ${t.textTert} ml-2`}>Student Portal</span>
          </div>
          <p className={`text-xs ${t.textTert}`}>
            Built for Sri Lankan A/L students · 2026
          </p>
          <div className="flex items-center gap-4">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <button key={link} className={`text-xs ${t.textTert} hover:${t.textSub} transition-colors cursor-pointer`}>
                {link}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
