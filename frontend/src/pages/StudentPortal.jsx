import { useState, useEffect, useRef } from "react";

const PAPER_RESULTS = [
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

function getMarkStats(rows) {
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

function PerformanceSparkline({ rows, t }) {
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

// ─── THEME TOKENS ────────────────────────────────────────────────────────────
const THEMES = {
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

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Icons = {
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

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
const Badge = ({ variant = "gray", children, t }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${t.badge[variant]}`}>
    {children}
  </span>
);

const MetricCard = ({ label, value, color, t }) => (
  <div className={`${t.metric} rounded-xl p-4 transition-all`}>
    <p className={`text-xs font-medium ${t.textSub} mb-1`}>{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const SectionCard = ({ title, children, extra, t }) => (
  <div className={`${t.card} rounded-xl mb-4`}>
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-inherit">
      <span className={`text-xs font-semibold uppercase tracking-wider ${t.textTert}`}>{title}</span>
      {extra}
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
);

const ProgressBar = ({ value, color, t }) => (
  <div className={`w-full h-1.5 ${t.barBg} rounded-full overflow-hidden`}>
    <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
  </div>
);

const PrimaryBtn = ({ children, small, onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 bg-[#a435f0] hover:bg-[#8710d8] text-white font-semibold rounded-md transition-colors cursor-pointer ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}
  >
    {children}
  </button>
);

const OutlineBtn = ({ children, small, t, onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 border border-current font-semibold rounded-md transition-colors cursor-pointer ${t.text} ${t.navHover} ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}
  >
    {children}
  </button>
);

// ─── PAGES ────────────────────────────────────────────────────────────────────
function DashboardPage({ t }) {
  const stats = getMarkStats(PAPER_RESULTS);

  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Average Mark" value={`${stats.avg}%`} color="text-[#a435f0]" t={t} />
        <MetricCard label="Attendance" value="88%" color="text-emerald-500" t={t} />
        <MetricCard label="A Grade %" value={`${stats.aPercent}%`} color="text-blue-500" t={t} />
        <MetricCard label="B Grade %" value={`${stats.bPercent}%`} color="text-amber-500" t={t} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Class Rank" value="#3" color="text-[#3c3489]" t={t} />
        <MetricCard label="Percentile" value="89th" color="text-amber-500" t={t} />
        <MetricCard label="Papers Done" value={`${PAPER_RESULTS.length}`} color="text-[#a435f0]" t={t} />
        <MetricCard label="Latest Mark" value={`${PAPER_RESULTS[PAPER_RESULTS.length - 1].mark}%`} color="text-emerald-500" t={t} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Marks Overview" t={t}>
          <div className="space-y-3">
            {[["Physics", 74, "bg-[#a435f0]"], ["Maths", 81, "bg-emerald-500"], ["Chemistry", 67, "bg-orange-500"]].map(([subj, val, clr]) => (
              <div key={subj}>
                <div className={`flex justify-between text-sm mb-1 ${t.text}`}>
                  <span>{subj}</span><span className="font-semibold">{val}%</span>
                </div>
                <ProgressBar value={val} color={clr} t={t} />
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Class Standing" t={t}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-[#a435f0] flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-[#a435f0]">#3</span>
                <span className={`text-[10px] ${t.textTert}`}>of 28</span>
              </div>
              <div className="flex-1">
                <p className={`text-sm ${t.textSub} mb-1`}>Better than 89% of class</p>
                <ProgressBar value={89} color="bg-[#a435f0]" t={t} />
              </div>
            </div>
          </SectionCard>

          <div className={`${t.feeGreen} rounded-xl p-4`}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">April 2026 Fee</p>
            <p className="text-2xl font-bold">LKR 4,500</p>
            <p className="text-sm mt-0.5 opacity-80">Paid on April 3</p>
            <button className="mt-3 w-full flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2 rounded-md transition-colors cursor-pointer">
              <Icons.Download /> Download Receipt
            </button>
          </div>
        </div>
      </div>

      <SectionCard title="Upcoming & Recent" t={t}>
        <table className="w-full text-sm">
          <thead>
            <tr className={t.tableHead}>
              {["Date", "Subject", "Type", "Status"].map(h => (
                <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider py-2 px-3 first:pl-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Today 4:00 PM", "Physics", "Class", "green", "Today"],
              ["Apr 14", "Physics Paper 4", "Assignment due", "amber", "Submitted"],
              ["Apr 16", "Maths Problem Set 7", "Assignment due", "blue", "Pending"],
              ["Apr 18", "Chemistry Lab Report 2", "Assignment due", "gray", "Not started"],
            ].map(([date, subj, type, badge, status]) => (
              <tr key={date + subj} className={t.tableRow}>
                <td className={`py-3 px-3 pl-0 ${t.text}`}>{date}</td>
                <td className={`py-3 px-3 ${t.text}`}>{subj}</td>
                <td className={`py-3 px-3 ${t.textSub}`}>{type}</td>
                <td className="py-3 px-3"><Badge variant={badge} t={t}>{status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <PerformanceSparkline rows={PAPER_RESULTS} t={t} />
    </div>
  );
}

function MarksPage({ t }) {
  const stats = getMarkStats(PAPER_RESULTS);

  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Overall Average" value={`${stats.avg}%`} color="text-[#a435f0]" t={t} />
        <MetricCard label="A Grade %" value={`${stats.aPercent}%`} color="text-blue-500" t={t} />
        <MetricCard label="B Grade %" value={`${stats.bPercent}%`} color="text-amber-500" t={t} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Subject Breakdown" t={t}>
          <div className="space-y-4">
            {[["Physics", 74, "bg-[#a435f0]", "text-[#a435f0]"], ["Maths", 81, "bg-emerald-500", "text-emerald-500"], ["Chemistry", 67, "bg-orange-500", "text-orange-500"]].map(([s, v, bg, tc]) => (
              <div key={s}>
                <div className={`flex justify-between text-sm mb-1.5 ${t.text}`}>
                  <span>{s}</span><span className={`font-bold ${tc}`}>{v}%</span>
                </div>
                <ProgressBar value={v} color={bg} t={t} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Strengths & Areas to Improve" t={t}>
          <p className={`text-xs font-semibold mb-2 ${t.textSub}`}>Strengths</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {["Kinematics", "Algebra", "Waves"].map(s => (
              <span key={s} className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">{s}</span>
            ))}
          </div>
          <p className={`text-xs font-semibold mb-2 ${t.textSub}`}>Needs Work</p>
          <div className="flex flex-wrap gap-1.5">
            {["Organic Chem", "Electrostatics", "Integration"].map(s => (
              <span key={s} className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">{s}</span>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Test-by-Test Results" t={t}>
        <table className="w-full text-sm">
          <thead>
            <tr className={t.tableHead}>
              {["Test", "Subject", "Mark", "Class Avg", "Standing"].map(h => (
                <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider py-2 px-3 first:pl-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Test 6", "Physics", "82/100", "74", "green", "Above avg"],
              ["Test 6", "Maths", "85/100", "79", "green", "Above avg"],
              ["Test 6", "Chemistry", "72/100", "70", "blue", "On avg"],
              ["Test 5", "Physics", "74/100", "74", "blue", "On avg"],
              ["Test 5", "Chemistry", "68/100", "72", "amber", "Below avg"],
            ].map(([test, subj, mark, avg, badge, stand], i) => (
              <tr key={i} className={t.tableRow}>
                <td className={`py-3 px-3 pl-0 ${t.textSub}`}>{test}</td>
                <td className={`py-3 px-3 ${t.text}`}>{subj}</td>
                <td className={`py-3 px-3 font-bold ${t.text}`}>{mark}</td>
                <td className={`py-3 px-3 ${t.textSub}`}>{avg}</td>
                <td className="py-3 px-3"><Badge variant={badge} t={t}>{stand}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Paper-wise Marks List" t={t}>
        <table className="w-full text-sm">
          <thead>
            <tr className={t.tableHead}>
              {["Paper", "Subject", "Date", "Your Mark", "Class Avg", "Standing"].map((h) => (
                <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider py-2 px-3 first:pl-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAPER_RESULTS.map((row) => {
              const standing = row.mark > row.classAvg ? ["green", "Above avg"] : row.mark === row.classAvg ? ["blue", "On avg"] : ["amber", "Below avg"];
              return (
                <tr key={row.paper} className={t.tableRow}>
                  <td className={`py-3 px-3 pl-0 font-medium ${t.text}`}>{row.paper}</td>
                  <td className={`py-3 px-3 ${t.textSub}`}>{row.subject}</td>
                  <td className={`py-3 px-3 ${t.textSub}`}>{row.date}</td>
                  <td className={`py-3 px-3 font-bold ${t.text}`}>{row.mark}%</td>
                  <td className={`py-3 px-3 ${t.textSub}`}>{row.classAvg}%</td>
                  <td className="py-3 px-3"><Badge variant={standing[0]} t={t}>{standing[1]}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SectionCard>

      <PerformanceSparkline rows={PAPER_RESULTS} t={t} />
    </div>
  );
}

function AttendancePage({ t }) {
  const attendance = { 1:"p",2:"p",3:"p",4:"a",5:"p",6:"p",7:"p",8:"p",9:"a",10:"p",11:"p" };
  const days = [];
  for (let i = 0; i < 2; i++) days.push(<div key={`e${i}`} />);
  for (let d = 1; d <= 30; d++) {
    const s = attendance[d];
    const cls = s === "p" ? "bg-emerald-500 text-white" : s === "a" ? "bg-red-500 text-white" : `${t.calNoClass}`;
    days.push(
      <div key={d} className={`aspect-square rounded flex items-center justify-center text-[10px] font-semibold ${cls}`}>{d}</div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Overall Attendance" value="88%" color="text-emerald-500" t={t} />
        <MetricCard label="Present Days" value="22" color="text-blue-500" t={t} />
        <MetricCard label="Absent Days" value="3" color="text-red-500" t={t} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="April 2026 Calendar" t={t}>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["M","T","W","T","F","S","S"].map((d,i) => (
              <div key={i} className={`text-center text-[10px] font-semibold ${t.textTert}`}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">{days}</div>
          <div className={`flex gap-4 mt-3 text-xs ${t.textSub}`}>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"/>Present</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500 inline-block"/>Absent</span>
            <span className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded inline-block ${t.barBg}`}/>No class</span>
          </div>
        </SectionCard>

        <SectionCard title="Attendance by Subject" t={t}>
          <div className="space-y-4">
            {[["Physics","90","bg-[#a435f0]"],["Maths","92","bg-emerald-500"],["Chemistry","82","bg-orange-500"]].map(([s,v,c]) => (
              <div key={s}>
                <div className={`flex justify-between text-sm mb-1 ${t.text}`}><span>{s}</span><span className="font-semibold">{v}%</span></div>
                <ProgressBar value={parseInt(v)} color={c} t={t} />
              </div>
            ))}
          </div>
          <div className={`mt-4 p-3 ${t.barBg} rounded-lg`}>
            <p className={`text-xs ${t.textSub}`}>Minimum required attendance</p>
            <p className="text-sm font-semibold text-emerald-500 mt-0.5">88% — You are on track ✓</p>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Attendance Log" t={t}>
        <table className="w-full text-sm">
          <thead>
            <tr className={t.tableHead}>
              {["Date","Subject","Check-in","Method","Status"].map(h => (
                <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider py-2 px-3 first:pl-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Apr 11","Physics","4:02 PM","QR scan","green","Present"],
              ["Apr 10","Maths","4:01 PM","QR scan","green","Present"],
              ["Apr 9","Chemistry","—","—","red","Absent"],
              ["Apr 8","Physics","4:15 PM","QR scan","amber","Late"],
              ["Apr 7","Maths","4:00 PM","QR scan","green","Present"],
            ].map(([d,s,ci,m,b,st],i) => (
              <tr key={i} className={t.tableRow}>
                <td className={`py-3 px-3 pl-0 ${t.textSub}`}>{d}</td>
                <td className={`py-3 px-3 ${t.text}`}>{s}</td>
                <td className={`py-3 px-3 ${t.textSub}`}>{ci}</td>
                <td className={`py-3 px-3 ${t.textSub}`}>{m}</td>
                <td className="py-3 px-3"><Badge variant={b} t={t}>{st}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}

function FeesPage({ t }) {
  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={`${t.feeGreen} rounded-xl p-5`}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">April 2026 — Current Month</p>
          <p className="text-4xl font-bold">LKR 4,500</p>
          <p className="text-sm mt-1 opacity-80">Paid on April 3, 2026</p>
          <button className="mt-4 w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold py-2.5 rounded-md transition-colors cursor-pointer">
            <Icons.Download /> Download Receipt
          </button>
        </div>

        <SectionCard title="Payment Summary" t={t}>
          {[
            ["Monthly fee", "LKR 4,500", ""],
            ["Batch", "2026 A/L Revision", ""],
            ["Total paid (2026)", "LKR 18,000", "text-emerald-500"],
            ["Outstanding", "LKR 0", "text-emerald-500"],
          ].map(([k,v,vc]) => (
            <div key={k} className={`flex justify-between py-2.5 border-b last:border-0 border-inherit text-sm`}>
              <span className={t.textSub}>{k}</span>
              <span className={`font-semibold ${vc || t.text}`}>{v}</span>
            </div>
          ))}
        </SectionCard>
      </div>

      <SectionCard title="Payment History" t={t}>
        <table className="w-full text-sm">
          <thead>
            <tr className={t.tableHead}>
              {["Month","Amount","Paid On","Status","Receipt"].map(h => (
                <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider py-2 px-3 first:pl-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["April 2026","LKR 4,500","Apr 3"],
              ["March 2026","LKR 4,500","Mar 4"],
              ["February 2026","LKR 4,500","Feb 5"],
              ["January 2026","LKR 4,500","Jan 6"],
            ].map(([month,amt,date]) => (
              <tr key={month} className={t.tableRow}>
                <td className={`py-3 px-3 pl-0 ${t.text}`}>{month}</td>
                <td className={`py-3 px-3 font-semibold ${t.text}`}>{amt}</td>
                <td className={`py-3 px-3 ${t.textSub}`}>{date}</td>
                <td className="py-3 px-3"><Badge variant="green" t={t}>Paid</Badge></td>
                <td className="py-3 px-3">
                  <OutlineBtn small t={t}><Icons.Download />Download</OutlineBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}

function MaterialsPage({ t }) {
  const weeks = [
    {
      title: "Week 14 — Electromagnetic Induction",
      isNew: true,
      items: [
        { icon: <Icons.File />, iconBg: "bg-red-100 text-red-600", name: "Lecture notes — EM Induction.pdf", meta: "PDF · 2.4 MB · Added Apr 9", btn: "Download" },
        { icon: <Icons.Video />, iconBg: "bg-purple-100 text-purple-600", name: "Lesson recording — Apr 9 class", meta: "Video · 1h 24m · YouTube", btn: "Watch" },
        { icon: <Icons.File />, iconBg: "bg-red-100 text-red-600", name: "2024 A/L Paper — Physics Section B", meta: "Past paper · 1.1 MB · Added Apr 8", btn: "Download" },
      ],
    },
    {
      title: "Week 13 — Waves & Optics",
      isNew: false,
      items: [
        { icon: <Icons.File />, iconBg: "bg-red-100 text-red-600", name: "Waves chapter notes.pdf", meta: "PDF · 3.1 MB · Added Apr 2", btn: "Download" },
        { icon: <Icons.Video />, iconBg: "bg-purple-100 text-purple-600", name: "Lesson recording — Apr 2 class", meta: "Video · 1h 10m · YouTube", btn: "Watch" },
      ],
    },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex gap-3">
        <select className={`${t.selectBg} rounded-lg px-3 py-2 text-sm cursor-pointer focus:outline-none`}>
          <option>All subjects</option>
          <option>Physics</option><option>Maths</option><option>Chemistry</option>
        </select>
        <select className={`${t.selectBg} rounded-lg px-3 py-2 text-sm cursor-pointer focus:outline-none`}>
          <option>All types</option>
          <option>PDF notes</option><option>Video</option><option>Past paper</option>
        </select>
      </div>

      {weeks.map((week) => (
        <SectionCard key={week.title} title={week.title} extra={week.isNew ? <Badge variant="purple" t={t}>New</Badge> : null} t={t}>
          <div className="space-y-1">
            {week.items.map((item, i) => (
              <div key={i} className={`flex items-center gap-3 py-3 border-b last:border-0 border-inherit`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${t.text} truncate`}>{item.name}</p>
                  <p className={`text-xs ${t.textTert} mt-0.5`}>{item.meta}</p>
                </div>
                <PrimaryBtn small>{item.btn}</PrimaryBtn>
              </div>
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

function AssignmentsPage({ t }) {
  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Submitted" value="11 / 14" color="text-emerald-500" t={t} />
        <MetricCard label="Graded" value="8" color="text-[#a435f0]" t={t} />
        <MetricCard label="Missing" value="3" color="text-red-500" t={t} />
      </div>

      <SectionCard title="Active Assignments" t={t}>
        <table className="w-full text-sm">
          <thead>
            <tr className={t.tableHead}>
              {["Assignment","Subject","Due","Status","Mark"].map(h => (
                <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider py-2 px-3 first:pl-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Physics Paper 4","Electromagnetic induction","Physics","Apr 14","amber","Submitted","Awaiting"],
              ["Maths Problem Set 7","Integration & differentiation","Maths","Apr 16","blue","Pending","—"],
              ["Chemistry Lab Report 2","Titration experiment","Chemistry","Apr 18","gray","Not started","—"],
            ].map(([name,sub,subj,due,b,st,mark]) => (
              <tr key={name} className={t.tableRow}>
                <td className="py-3 px-3 pl-0">
                  <p className={`font-semibold ${t.text}`}>{name}</p>
                  <p className={`text-xs ${t.textTert}`}>{sub}</p>
                </td>
                <td className={`py-3 px-3 ${t.textSub}`}>{subj}</td>
                <td className={`py-3 px-3 ${t.textSub}`}>{due}</td>
                <td className="py-3 px-3"><Badge variant={b} t={t}>{st}</Badge></td>
                <td className={`py-3 px-3 ${t.textSub}`}>{mark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Graded Results" t={t}>
        <table className="w-full text-sm">
          <thead>
            <tr className={t.tableHead}>
              {["Assignment","Subject","Mark","Class Avg","Standing"].map(h => (
                <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider py-2 px-3 first:pl-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Physics Paper 3","Physics","76/100","71","green","Above avg"],
              ["Maths Problem Set 6","Maths","82/100","78","green","Above avg"],
              ["Chemistry Lab Report 1","Chemistry","68/100","70","amber","Below avg"],
              ["Physics Paper 2","Physics","74/100","73","blue","On avg"],
            ].map(([name,subj,mark,avg,b,st]) => (
              <tr key={name} className={t.tableRow}>
                <td className={`py-3 px-3 pl-0 ${t.text}`}>{name}</td>
                <td className={`py-3 px-3 ${t.textSub}`}>{subj}</td>
                <td className={`py-3 px-3 font-bold ${t.text}`}>{mark}</td>
                <td className={`py-3 px-3 ${t.textSub}`}>{avg}</td>
                <td className="py-3 px-3"><Badge variant={b} t={t}>{st}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}

function NotificationsPage({ t }) {
  const groups = [
    {
      label: "Today",
      items: [
        { icon: <Icons.Check />, iconBg: "bg-emerald-100 text-emerald-600", title: "Attendance marked", body: "You were marked present for Physics class at 4:00 PM", time: "4:20 PM", unread: true },
        { icon: <Icons.File />, iconBg: "bg-purple-100 text-purple-600", title: "New material uploaded", body: "Week 14 — EM Induction notes added to Study Materials", time: "9:30 AM", unread: true },
      ],
    },
    {
      label: "Yesterday",
      items: [
        { icon: <Icons.File />, iconBg: "bg-amber-100 text-amber-600", title: "Assignment due reminder", body: "Physics Paper 4 is due in 3 days — Apr 14", time: "Apr 10, 8:00 AM", unread: true },
        { icon: <Icons.Marks />, iconBg: "bg-emerald-100 text-emerald-600", title: "Maths Problem Set 6 graded", body: "Your mark: 82/100 — above class average", time: "Apr 10, 2:00 PM", unread: false },
        { icon: <Icons.CreditCard />, iconBg: "bg-emerald-100 text-emerald-600", title: "Fee receipt available", body: "April 2026 payment confirmed — LKR 4,500", time: "Apr 3, 11:00 AM", unread: false },
      ],
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <span className={`text-sm ${t.textSub}`}>3 unread</span>
        <OutlineBtn small t={t}>Mark all read</OutlineBtn>
      </div>
      {groups.map((group) => (
        <div key={group.label}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${t.sectionLabel}`}>{group.label}</p>
          <div className={`${t.card} rounded-xl overflow-hidden`}>
            {group.items.map((item, i) => (
              <div key={i} className={`flex gap-3 px-5 py-4 border-b last:border-0 border-inherit ${i % 2 === 0 ? "" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${t.text}`}>{item.title}</p>
                  <p className={`text-xs ${t.textSub} mt-0.5`}>{item.body}</p>
                  <p className={`text-xs ${t.textTert} mt-1`}>{item.time}</p>
                </div>
                {item.unread && <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${t.notifUnread}`} />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home", label: "My Dashboard", Icon: Icons.Dashboard },
  { id: "marks", label: "My Marks", Icon: Icons.Marks },
  { id: "attendance", label: "Attendance", Icon: Icons.Calendar },
  { id: "fees", label: "My Fees", Icon: Icons.CreditCard },
  { id: "materials", label: "Study Materials", Icon: Icons.Book },
  { id: "assignments", label: "Assignments", Icon: Icons.File },
  { id: "notifications", label: "Notifications", Icon: Icons.Bell, badge: 3 },
];

const PAGE_TITLES = {
  home: "My Dashboard", marks: "My Marks", attendance: "Attendance",
  fees: "My Fees", materials: "Study Materials", assignments: "Assignments",
  notifications: "Notifications",
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function StudentPortal() {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const t = darkMode ? THEMES.dark : THEMES.light;

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
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-56 flex flex-col ${t.sidebar} transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Brand */}
        <div className="px-5 py-4 border-b border-inherit">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-bold text-[#a435f0]">ElectroPhysics</p>
              <p className={`text-[11px] ${t.textTert} mt-0.5`}>Student Portal</p>
            </div>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><Icons.Close /></button>
          </div>
        </div>

        {/* Student info */}
        <div className="px-4 py-3.5 border-b border-inherit flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#ede9fe] text-[#3c3489] flex items-center justify-center text-xs font-bold flex-shrink-0">KP</div>
          <div className="min-w-0">
            <p className={`text-sm font-semibold ${t.text} truncate`}>Kavindu Perera</p>
            <p className={`text-[11px] ${t.textTert} truncate`}>2026 A/L Revision</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          <p className={`text-[10px] font-semibold uppercase tracking-widest px-3 pb-1.5 ${t.textTert}`}>Menu</p>
          {NAV_ITEMS.map(({ id, label, Icon, badge }) => (
            <button
              key={id}
              onClick={() => { setActivePage(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${activePage === id ? t.navActive : `${t.textSub} ${t.navHover}`}`}
            >
              <span className={activePage === id ? "" : t.navIcon}><Icon /></span>
              <span className="flex-1 text-left">{label}</span>
              {badge && (
                <span className="bg-[#a435f0] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className={`px-4 py-3 border-t border-inherit`}>
          <p className={`text-xs ${t.textTert}`}>Logged in as</p>
          <p className={`text-sm font-semibold ${t.text}`}>Kavindu Perera</p>
          <button className="text-xs text-red-500 hover:text-red-600 mt-2 cursor-pointer font-medium">Sign out</button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Topbar */}
        <header className={`sticky top-0 z-10 ${t.topbar} px-5 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Icons.Menu /></button>
            <div>
              <p className={`text-base font-bold ${t.text}`}>{PAGE_TITLES[activePage]}</p>
              <p className={`text-xs ${t.textTert} hidden sm:block`}>Good evening, Kavindu · Saturday, April 11, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="purple" t={t}>2026 Revision · #1042</Badge>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${t.toggleBtn} transition-colors cursor-pointer`}
            >
              {darkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            <div className="w-8 h-8 rounded-full bg-[#ede9fe] text-[#3c3489] flex items-center justify-center text-xs font-bold">KP</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {pageComponents[activePage]}
        </main>
      </div>
    </div>
  );
}
