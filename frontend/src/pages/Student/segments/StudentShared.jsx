export const PAPER_RESULTS = [
  { paper: "Physics Paper 1", subject: "Physics", mark: 72, classAvg: 68, date: "2026-01-11" },
  { paper: "Physics Paper 2", subject: "Physics", mark: 76, classAvg: 73, date: "2026-02-02" },
  { paper: "Physics Paper 3", subject: "Physics", mark: 81, classAvg: 74, date: "2026-03-01" },
  { paper: "Physics Paper 4", subject: "Physics", mark: 79, classAvg: 75, date: "2026-04-10" },
  { paper: "Maths Unit Test 1", subject: "Maths", mark: 69, classAvg: 66, date: "2026-01-20" },
  { paper: "Maths Unit Test 2", subject: "Maths", mark: 74, classAvg: 71, date: "2026-02-25" },
  { paper: "Maths Unit Test 3", subject: "Maths", mark: 83, classAvg: 77, date: "2026-03-28" },
  { paper: "Chemistry Paper 1", subject: "Chemistry", mark: 65, classAvg: 67, date: "2026-01-29" },
  { paper: "Chemistry Paper 2", subject: "Chemistry", mark: 71, classAvg: 70, date: "2026-03-13" },
  { paper: "Chemistry Paper 3", subject: "Chemistry", mark: 73, classAvg: 71, date: "2026-04-03" },
];

export function getMarkStats(rows) {
  const total = rows.length;
  const avg = Math.round(rows.reduce((sum, row) => sum + row.mark, 0) / total);
  const aCount = rows.filter((row) => row.mark >= 75).length;
  const bCount = rows.filter((row) => row.mark >= 65 && row.mark < 75).length;

  return {
    avg,
    aPercent: Math.round((aCount / total) * 100),
    bPercent: Math.round((bCount / total) * 100),
  };
}

export function PerformanceSparkline({ rows, t }) {
  const width = 520;
  const height = 200;
  const pad = 24;
  const minY = 40;
  const maxY = 100;

  const points = rows.map((row, index) => {
    const x = pad + (index * (width - pad * 2)) / (rows.length - 1);
    const y = height - pad - ((row.mark - minY) / (maxY - minY)) * (height - pad * 2);
    return { x, y, label: row.paper, mark: row.mark };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <div className={`${t.card} rounded-xl p-4`}>
      <p className={`text-xs font-semibold uppercase tracking-wider ${t.textTert} mb-3`}>Paper Mark Variation</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-52" role="img" aria-label="Mark variation graph">
        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="currentColor" className={t.textTert} opacity="0.35" />
        <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="currentColor" className={t.textTert} opacity="0.35" />
        <path d={linePath} fill="none" stroke="#a435f0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="4" fill="#a435f0" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fill="currentColor" className={t.textSub}>
              {p.mark}
            </text>
          </g>
        ))}
      </svg>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
        {rows.slice(-5).map((row) => (
          <div key={row.paper} className={`${t.metric} rounded-md px-2 py-1.5`}>
            <p className={`text-[10px] truncate ${t.textTert}`}>{row.paper}</p>
            <p className={`text-xs font-semibold ${t.text}`}>{row.mark}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const THEMES = {
  light: {
    bg: "bg-[#f7f9fa]",
    sidebar: "bg-white border-r border-[#e0e0e0]",
    topbar: "bg-white border-b border-[#e0e0e0]",
    card: "bg-white border border-[#e0e0e0]",
    input: "bg-[#f7f9fa] border border-[#e0e0e0] text-gray-800",
    text: "text-gray-900",
    textSub: "text-gray-500",
    textTert: "text-gray-400",
    navHover: "hover:bg-[#f0f0f0]",
    navActive: "bg-[#ece9fc] text-[#3c3489] font-semibold",
    navIcon: "text-gray-500",
    metric: "bg-white border border-[#e0e0e0]",
    tableHead: "bg-[#f7f9fa] text-gray-500",
    tableRow: "border-b border-[#f0f0f0] hover:bg-[#fafafa]",
    barBg: "bg-gray-100",
    badge: {
      green: "bg-[#d1fae5] text-[#065f46]",
      red: "bg-[#fee2e2] text-[#7f1d1d]",
      amber: "bg-[#fef3c7] text-[#78350f]",
      blue: "bg-[#dbeafe] text-[#1e3a8a]",
      purple: "bg-[#ede9fe] text-[#4c1d95]",
      gray: "bg-gray-100 text-gray-600",
    },
    toggleBtn: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    feeGreen: "bg-[#d1fae5] border border-[#6ee7b7] text-[#065f46]",
    feeRed: "bg-[#fee2e2] border border-[#fca5a5] text-[#7f1d1d]",
    sectionLabel: "text-gray-400",
    notifUnread: "bg-[#3c3489]",
    scrollbar: "scrollbar-light",
    selectBg: "bg-white border border-[#e0e0e0] text-gray-800",
    calNoClass: "bg-gray-100 text-gray-400",
  },
  dark: {
    bg: "bg-[#1c1d1f]",
    sidebar: "bg-[#2d2f31] border-r border-[#3e4143]",
    topbar: "bg-[#2d2f31] border-b border-[#3e4143]",
    card: "bg-[#2d2f31] border border-[#3e4143]",
    input: "bg-[#3e4143] border border-[#555] text-gray-200",
    text: "text-gray-100",
    textSub: "text-gray-400",
    textTert: "text-gray-500",
    navHover: "hover:bg-[#3e4143]",
    navActive: "bg-[#3e3a6e] text-[#a5b4fc] font-semibold",
    navIcon: "text-gray-400",
    metric: "bg-[#2d2f31] border border-[#3e4143]",
    tableHead: "bg-[#1c1d1f] text-gray-400",
    tableRow: "border-b border-[#3e4143] hover:bg-[#35373a]",
    barBg: "bg-[#3e4143]",
    badge: {
      green: "bg-[#064e3b] text-[#6ee7b7]",
      red: "bg-[#7f1d1d] text-[#fca5a5]",
      amber: "bg-[#78350f] text-[#fcd34d]",
      blue: "bg-[#1e3a8a] text-[#93c5fd]",
      purple: "bg-[#3730a3] text-[#c4b5fd]",
      gray: "bg-[#3e4143] text-gray-400",
    },
    toggleBtn: "bg-[#3e4143] text-gray-300 hover:bg-[#4a4d50]",
    feeGreen: "bg-[#064e3b] border border-[#065f46] text-[#6ee7b7]",
    feeRed: "bg-[#7f1d1d] border border-[#991b1b] text-[#fca5a5]",
    sectionLabel: "text-gray-500",
    notifUnread: "bg-[#a5b4fc]",
    scrollbar: "scrollbar-dark",
    selectBg: "bg-[#3e4143] border border-[#555] text-gray-200",
    calNoClass: "bg-[#3e4143] text-gray-500",
  },
};

export const Icons = {
  Dashboard: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Marks: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  CreditCard: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  Book: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  File: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  Bell: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Sun: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Moon: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  Video: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
  Check: () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Download: () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Person: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
    </svg>
  ),
  Menu: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  Close: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

export const Badge = ({ variant = "gray", children, t }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${t.badge[variant]}`}>
    {children}
  </span>
);

export const MetricCard = ({ label, value, color, t }) => (
  <div className={`${t.metric} rounded-xl p-4 transition-all`}>
    <p className={`text-xs font-medium ${t.textSub} mb-1`}>{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

export const SectionCard = ({ title, children, extra, t }) => (
  <div className={`${t.card} rounded-xl mb-4`}>
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-inherit">
      <span className={`text-xs font-semibold uppercase tracking-wider ${t.textTert}`}>{title}</span>
      {extra}
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
);

export const ProgressBar = ({ value, color, t }) => (
  <div className={`w-full h-1.5 ${t.barBg} rounded-full overflow-hidden`}>
    <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
  </div>
);

export const PrimaryBtn = ({ children, small, onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 bg-[#a435f0] hover:bg-[#8710d8] text-white font-semibold rounded-md transition-colors cursor-pointer ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}
  >
    {children}
  </button>
);

export const OutlineBtn = ({ children, small, t, onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 border border-current font-semibold rounded-md transition-colors cursor-pointer ${t.text} ${t.navHover} ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}
  >
    {children}
  </button>
);

export const NAV_ITEMS = [
  { id: "home", label: "My Dashboard", Icon: Icons.Dashboard },
  { id: "marks", label: "My Marks", Icon: Icons.Marks },
  { id: "attendance", label: "Attendance", Icon: Icons.Calendar },
  { id: "fees", label: "My Fees", Icon: Icons.CreditCard },
  { id: "materials", label: "Study Materials", Icon: Icons.Book },
  { id: "assignments", label: "Assignments", Icon: Icons.File },
  { id: "notifications", label: "Notifications", Icon: Icons.Bell, badge: 3 },
];

export const PAGE_TITLES = {
  home: "My Dashboard",
  marks: "My Marks",
  attendance: "Attendance",
  fees: "My Fees",
  materials: "Study Materials",
  assignments: "Assignments",
  notifications: "Notifications",
};
