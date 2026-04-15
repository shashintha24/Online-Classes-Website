export const THEMES = {
  light: {
    bg: "bg-[#f7f9fa]",
    sidebar: "bg-white border-r border-[#e0e0e0]",
    topbar: "bg-white border-b border-[#e0e0e0]",
    card: "bg-white border border-[#e0e0e0]",
    text: "text-gray-900",
    textSub: "text-gray-500",
    textTert: "text-gray-400",
    navHover: "hover:bg-[#f0f0f0]",
    navActive: "bg-[#ece9fc] text-[#3c3489] font-semibold",
    metric: "bg-white border border-[#e0e0e0]",
    tableHead: "bg-[#f7f9fa] text-gray-500",
    tableRow: "border-b border-[#f0f0f0] hover:bg-[#fafafa]",
    barBg: "bg-gray-100",
    selectBg: "bg-white border border-[#e0e0e0] text-gray-800",
    inputBg: "bg-white border border-[#e0e0e0] text-gray-800 placeholder-gray-400",
    sectionLabel: "text-gray-400",
    badge: {
      green: "bg-[#d1fae5] text-[#065f46]",
      red: "bg-[#fee2e2] text-[#7f1d1d]",
      amber: "bg-[#fef3c7] text-[#78350f]",
      blue: "bg-[#dbeafe] text-[#1e3a8a]",
      purple: "bg-[#ede9fe] text-[#4c1d95]",
      teal: "bg-[#d1fae5] text-[#065f46]",
      gray: "bg-gray-100 text-gray-600",
    },
    toggleBtn: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    statCard: "bg-[#f7f9fa] border border-[#e0e0e0]",
    qrBorder: "border-2 border-[#a435f0]",
    divider: "border-[#f0f0f0]",
  },
  dark: {
    bg: "bg-[#1c1d1f]",
    sidebar: "bg-[#2d2f31] border-r border-[#3e4143]",
    topbar: "bg-[#2d2f31] border-b border-[#3e4143]",
    card: "bg-[#2d2f31] border border-[#3e4143]",
    text: "text-gray-100",
    textSub: "text-gray-400",
    textTert: "text-gray-500",
    navHover: "hover:bg-[#3e4143]",
    navActive: "bg-[#3e3a6e] text-[#a5b4fc] font-semibold",
    metric: "bg-[#2d2f31] border border-[#3e4143]",
    tableHead: "bg-[#1c1d1f] text-gray-400",
    tableRow: "border-b border-[#3e4143] hover:bg-[#35373a]",
    barBg: "bg-[#3e4143]",
    selectBg: "bg-[#3e4143] border border-[#555] text-gray-200",
    inputBg: "bg-[#3e4143] border border-[#555] text-gray-200 placeholder-gray-500",
    sectionLabel: "text-gray-500",
    badge: {
      green: "bg-[#064e3b] text-[#6ee7b7]",
      red: "bg-[#7f1d1d] text-[#fca5a5]",
      amber: "bg-[#78350f] text-[#fcd34d]",
      blue: "bg-[#1e3a8a] text-[#93c5fd]",
      purple: "bg-[#3730a3] text-[#c4b5fd]",
      teal: "bg-[#064e3b] text-[#6ee7b7]",
      gray: "bg-[#3e4143] text-gray-400",
    },
    toggleBtn: "bg-[#3e4143] text-gray-300 hover:bg-[#4a4d50]",
    statCard: "bg-[#1c1d1f] border border-[#3e4143]",
    qrBorder: "border-2 border-[#a435f0]",
    divider: "border-[#3e4143]",
  },
};

export const I = {
  Dashboard: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Marks: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Students: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Attendance: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Assignments: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
  Materials: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Fees: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Bell: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Sun: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  File: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Video: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  Doc: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/></svg>,
  Check: () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Alert: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Search: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Menu: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Close: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Download: () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Person: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
};

export const Badge = ({ v = "gray", children, t }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${t.badge[v]}`}>{children}</span>
);

export const Metric = ({ label, value, color, sub, t }) => (
  <div className={`${t.metric} rounded-xl p-4`}>
    <p className={`text-xs font-medium mb-1 ${t.textSub}`}>{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}{sub && <span className={`text-sm font-normal ml-0.5 ${t.textSub}`}>{sub}</span>}</p>
  </div>
);

export const Card = ({ title, extra, children, t, noPad }) => (
  <div className={`${t.card} rounded-xl mb-4`}>
    {title && (
      <div className={`flex items-center justify-between px-5 py-3.5 border-b ${t.divider}`}>
        <span className={`text-xs font-semibold uppercase tracking-wider ${t.textTert}`}>{title}</span>
        {extra}
      </div>
    )}
    <div className={noPad ? "" : "px-5 py-4"}>{children}</div>
  </div>
);

export const Bar = ({ value, color, t }) => (
  <div className={`h-1.5 w-full ${t.barBg} rounded-full overflow-hidden`}>
    <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
  </div>
);

export const PrimaryBtn = ({ children, small, onClick }) => (
  <button onClick={onClick} className={`inline-flex items-center gap-1.5 bg-[#a435f0] hover:bg-[#8710d8] text-white font-semibold rounded-lg transition-colors cursor-pointer ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}>
    {children}
  </button>
);

export const GhostBtn = ({ children, small, onClick, t }) => (
  <button onClick={onClick} className={`inline-flex items-center gap-1.5 border ${t.divider} font-semibold rounded-lg transition-colors cursor-pointer ${t.textSub} ${t.navHover} ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}>
    {children}
  </button>
);

export const Th = ({ children, t }) => (
  <th className={`text-left text-xs font-semibold uppercase tracking-wider py-2.5 px-3 first:pl-5 last:pr-5 ${t.tableHead}`}>{children}</th>
);

export const Td = ({ children, t, className = "", ...props }) => (
  <td className={`py-3 px-3 first:pl-5 last:pr-5 text-sm ${t.text} ${className}`} {...props}>{children}</td>
);

export const AVATAR_COLORS = [
  "bg-[#ede9fe] text-[#4c1d95]",
  "bg-[#d1fae5] text-[#065f46]",
  "bg-[#fee2e2] text-[#7f1d1d]",
  "bg-[#fef3c7] text-[#78350f]",
  "bg-[#dbeafe] text-[#1e3a8a]",
];

export const NAV = [
  { section: "Main", items: [
    { id: "dashboard", label: "Dashboard", Icon: I.Dashboard },
    { id: "students", label: "Students", Icon: I.Students },
    { id: "attendance", label: "Attendance", Icon: I.Attendance },
    { id: "marks", label: "Marks", Icon: I.Marks },
  ]},
  { section: "Academic", items: [
    { id: "assignments", label: "Assignments", Icon: I.Assignments },
    { id: "materials", label: "Study Materials", Icon: I.Materials },
  ]},
  { section: "Finance", items: [
    { id: "fees", label: "Fees", Icon: I.Fees },
  ]},
  { section: "System", items: [
    { id: "notifications", label: "Notifications", Icon: I.Bell, badge: 4 },
  ]},
];

export const PAGE_TITLES = {
  dashboard: "Dashboard",
  students: "Students",
  attendance: "Attendance",
  marks: "Marks",
  assignments: "Assignments",
  materials: "Study Materials",
  fees: "Fees",
  notifications: "Notifications",
};
