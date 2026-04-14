import { useState } from "react";

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
const THEMES = {
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

// ─── ICONS ────────────────────────────────────────────────────────────────────
const I = {
  Dashboard: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
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

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Badge = ({ v = "gray", children, t }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${t.badge[v]}`}>{children}</span>
);

const Metric = ({ label, value, color, sub, t }) => (
  <div className={`${t.metric} rounded-xl p-4`}>
    <p className={`text-xs font-medium mb-1 ${t.textSub}`}>{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}{sub && <span className={`text-sm font-normal ml-0.5 ${t.textSub}`}>{sub}</span>}</p>
  </div>
);

const Card = ({ title, extra, children, t, noPad }) => (
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

const Bar = ({ value, color, t }) => (
  <div className={`h-1.5 w-full ${t.barBg} rounded-full overflow-hidden`}>
    <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
  </div>
);

const PrimaryBtn = ({ children, small, onClick }) => (
  <button onClick={onClick} className={`inline-flex items-center gap-1.5 bg-[#a435f0] hover:bg-[#8710d8] text-white font-semibold rounded-lg transition-colors cursor-pointer ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}>
    {children}
  </button>
);

const GhostBtn = ({ children, small, onClick, t }) => (
  <button onClick={onClick} className={`inline-flex items-center gap-1.5 border ${t.divider} font-semibold rounded-lg transition-colors cursor-pointer ${t.textSub} ${t.navHover} ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}>
    {children}
  </button>
);

const Th = ({ children, t }) => (
  <th className={`text-left text-xs font-semibold uppercase tracking-wider py-2.5 px-3 first:pl-5 last:pr-5 ${t.tableHead}`}>{children}</th>
);
const Td = ({ children, t, className = "" }) => (
  <td className={`py-3 px-3 first:pl-5 last:pr-5 text-sm ${t.text} ${className}`}>{children}</td>
);

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({ t }) {
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Metric label="Total Students" value="28" color="text-[#a435f0]" t={t} />
        <Metric label="Today's Attendance" value="24" sub="/28" color="text-emerald-500" t={t} />
        <Metric label="Pending Fees" value="5" color="text-red-500" t={t} />
        <Metric label="Assignments Due" value="3" color="text-amber-500" t={t} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Recent Activity" t={t}>
          <div className="space-y-1">
            {[
              { icon: <I.Person />, bg: "bg-purple-100 text-purple-600", title: "New student enrolled", body: "Amali Silva joined 2026 Revision Batch", time: "2 hours ago" },
              { icon: <I.Fees />, bg: "bg-red-100 text-red-600", title: "Fee overdue", body: "Nuwan Bandara — April fee not paid", time: "1 day ago" },
              { icon: <I.Check />, bg: "bg-emerald-100 text-emerald-600", title: "Assignment graded", body: "Physics Paper 3 marked for 26 students", time: "3 days ago" },
            ].map((item, i) => (
              <div key={i} className={`flex gap-3 py-3 border-b last:border-0 ${t.divider}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.bg}`}>{item.icon}</div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${t.text}`}>{item.title}</p>
                  <p className={`text-xs ${t.textSub} mt-0.5`}>{item.body}</p>
                  <p className={`text-xs ${t.textTert} mt-1`}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Batch Overview" t={t}>
          <div className="space-y-0">
            {[["2026 A/L Revision","28 students","purple"],["2027 Theory","19 students","blue"],["O/L Foundation","34 students","teal"]].map(([name,count,v]) => (
              <div key={name} className={`flex justify-between items-center py-3 border-b last:border-0 ${t.divider}`}>
                <span className={`text-sm font-semibold ${t.text}`}>{name}</span>
                <Badge v={v} t={t}>{count}</Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            <p className={`text-xs font-semibold uppercase tracking-wider ${t.textTert}`}>Class Avg Marks — April</p>
            {[["Physics",74,"bg-[#a435f0]"],["Maths",81,"bg-emerald-500"],["Chemistry",67,"bg-orange-500"]].map(([s,v,c]) => (
              <div key={s}>
                <div className={`flex justify-between text-sm mb-1 ${t.text}`}><span>{s}</span><span className="font-bold">{v}%</span></div>
                <Bar value={v} color={c} t={t} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Upcoming SchElectrole" extra={<GhostBtn small t={t}>View all</GhostBtn>} t={t} noPad>
        <table className="w-full">
          <thead><tr className={t.tableHead}>
            {["Date","Batch","Subject","Time","Room","Status"].map(h => <Th key={h} t={t}>{h}</Th>)}
          </tr></thead>
          <tbody>
            {[
              ["Today, Apr 11","2026 Revision","Physics","4:00 PM","Hall A","green","Confirmed"],
              ["Sat, Apr 12","O/L Foundation","Maths","9:00 AM","Hall B","green","Confirmed"],
              ["Sun, Apr 13","2027 Theory","Chemistry","2:00 PM","Hall A","amber","Tentative"],
              ["Mon, Apr 14","2026 Revision","Maths","4:00 PM","Hall A","green","Confirmed"],
            ].map(([d,b,s,ti,r,bv,bs],i) => (
              <tr key={i} className={t.tableRow}>
                <Td t={t}>{d}</Td><Td t={t}>{b}</Td><Td t={t}>{s}</Td>
                <Td t={t}>{ti}</Td><Td t={t}>{r}</Td>
                <td className="py-3 px-3 last:pr-5"><Badge v={bv} t={t}>{bs}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── STUDENTS PAGE ────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-[#ede9fe] text-[#4c1d95]",
  "bg-[#d1fae5] text-[#065f46]",
  "bg-[#fee2e2] text-[#7f1d1d]",
  "bg-[#fef3c7] text-[#78350f]",
  "bg-[#dbeafe] text-[#1e3a8a]",
];

function StudentsPage({ t }) {
  const students = [
    { initials:"KP", name:"Kavindu Perera", id:"#1042", batch:"2026 Revision", mark:"74%", att:"88%", fee:"green","Paid":true },
    { initials:"AS", name:"Amali Silva", id:"#1043", batch:"2026 Revision", mark:"81%", att:"95%", fee:"green","Paid":true },
    { initials:"NB", name:"Nuwan Bandara", id:"#1038", batch:"2026 Revision", mark:"62%", att:"71%", fee:"red" },
    { initials:"DW", name:"Dilini Wijeratne", id:"#1039", batch:"2027 Theory", mark:"77%", att:"82%", fee:"green" },
    { initials:"SF", name:"Sachini Fernando", id:"#1041", batch:"O/L Foundation", mark:"69%", att:"90%", fee:"amber" },
  ];
  const feeLabel = { green:"Paid", red:"Overdue", amber:"Pending" };

  return (
    <div className="p-6">
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className={`flex items-center gap-2 flex-1 min-w-[160px] ${t.inputBg} rounded-lg px-3 py-2`}>
          <I.Search /><input className="bg-transparent outline-none text-sm w-full" placeholder="Search students..." />
        </div>
        <select className={`${t.selectBg} rounded-lg px-3 py-2 text-sm cursor-pointer focus:outline-none`}>
          <option>All batches</option>
          <option>2026 Revision</option><option>2027 Theory</option><option>O/L Foundation</option>
        </select>
        <PrimaryBtn>+ Add Student</PrimaryBtn>
      </div>

      <Card t={t} noPad>
        <table className="w-full">
          <thead><tr className={t.tableHead}>
            {["Student","Batch","Avg Mark","Attendance","Fee Status","Actions"].map(h => <Th key={h} t={t}>{h}</Th>)}
          </tr></thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i} className={t.tableRow}>
                <td className="py-3 pl-5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>{s.initials}</div>
                    <div>
                      <p className={`text-sm font-semibold ${t.text}`}>{s.name}</p>
                      <p className={`text-xs ${t.textTert}`}>ID {s.id}</p>
                    </div>
                  </div>
                </td>
                <Td t={t}><Badge v="gray" t={t}>{s.batch}</Badge></Td>
                <td className={`py-3 px-3 text-sm font-bold ${t.text}`}>{s.mark}</td>
                <Td t={t}>{s.att}</Td>
                <td className="py-3 px-3"><Badge v={s.fee} t={t}>{feeLabel[s.fee]}</Badge></td>
                <td className="py-3 px-3 pr-5"><GhostBtn small t={t}>View</GhostBtn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── ATTENDANCE PAGE ──────────────────────────────────────────────────────────
function AttendancePage({ t }) {
  const [scannerCode, setScannerCode] = useState("");
  const [scannerMessage, setScannerMessage] = useState("Scan QR code to mark attendance");
  const [register, setRegister] = useState([
    { name: "Kavindu Perera", batch: "2026 Revision", code: "EP-1042", checkIn: "4:02 PM", method: "QR scan", status: "green", label: "Present" },
    { name: "Amali Silva", batch: "2026 Revision", code: "EP-1043", checkIn: "4:01 PM", method: "QR scan", status: "green", label: "Present" },
    { name: "Nuwan Bandara", batch: "2026 Revision", code: "EP-1038", checkIn: "-", method: "-", status: "red", label: "Absent" },
    { name: "Dilini Wijeratne", batch: "2026 Revision", code: "EP-1039", checkIn: "4:07 PM", method: "Manual", status: "green", label: "Present" },
    { name: "Sachini Fernando", batch: "2026 Revision", code: "EP-1041", checkIn: "4:15 PM", method: "QR scan", status: "amber", label: "Late" },
  ]);

  const calData = { 1:"p",2:"p",3:"p",4:"a",5:"p",6:"p",7:"p",8:"p",9:"a",10:"p",11:"p" };
  const presentCount = register.filter((row) => row.label === "Present" || row.label === "Late").length;
  const absentCount = register.length - presentCount;
  const monthlyAvg = Math.round((presentCount / register.length) * 100);

  function markByQr() {
    const code = scannerCode.trim().toUpperCase();
    if (!code) {
      setScannerMessage("Please enter a QR student code");
      return;
    }

    setRegister((prev) => {
      const idx = prev.findIndex((row) => row.code === code);
      if (idx === -1) {
        setScannerMessage(`No student found for ${code}`);
        return prev;
      }

      const next = [...prev];
      next[idx] = {
        ...next[idx],
        checkIn: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        method: "QR scan",
        status: "green",
        label: "Present",
      };
      setScannerMessage(`${next[idx].name} marked present`);
      return next;
    });

    setScannerCode("");
  }

  const cells = [<div key="e0" />, ...Array.from({length:30},(_,i)=>{
    const d = i+1, s = calData[d];
    const cls = s==="p" ? "bg-emerald-500 text-white" : s==="a" ? "bg-red-500 text-white" : d>11 ? `${t.barBg} ${t.textTert} opacity-40` : `${t.barBg} ${t.textTert}`;
    return <div key={d} className={`aspect-square rounded flex items-center justify-center text-[10px] font-semibold ${cls}`}>{d}</div>;
  })];

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Metric label="Present Today" value={`${presentCount}`} sub={`/${register.length}`} color="text-emerald-500" t={t} />
        <Metric label="Monthly Avg" value={`${monthlyAvg}%`} color="text-blue-500" t={t} />
        <Metric label="Absent Today" value={`${absentCount}`} color="text-red-500" t={t} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="QR Attendance — Today" extra={<Badge v="green" t={t}>Active</Badge>} t={t}>
          <div className={`w-32 h-32 ${t.qrBorder} rounded-xl flex items-center justify-center mx-auto mb-4`}>
            <svg width="88" height="88" viewBox="0 0 80 80">
              <rect x="5" y="5" width="28" height="28" rx="2" fill="none" stroke="#a435f0" strokeWidth="3"/>
              <rect x="12" y="12" width="14" height="14" rx="1" fill="#a435f0"/>
              <rect x="47" y="5" width="28" height="28" rx="2" fill="none" stroke="#a435f0" strokeWidth="3"/>
              <rect x="54" y="12" width="14" height="14" rx="1" fill="#a435f0"/>
              <rect x="5" y="47" width="28" height="28" rx="2" fill="none" stroke="#a435f0" strokeWidth="3"/>
              <rect x="12" y="54" width="14" height="14" rx="1" fill="#a435f0"/>
              <rect x="47" y="47" width="6" height="6" fill="#a435f0"/>
              <rect x="56" y="47" width="6" height="6" fill="#a435f0"/>
              <rect x="65" y="47" width="6" height="6" fill="#a435f0"/>
              <rect x="47" y="56" width="6" height="6" fill="#a435f0"/>
              <rect x="65" y="56" width="6" height="6" fill="#a435f0"/>
              <rect x="47" y="65" width="6" height="6" fill="#a435f0"/>
              <rect x="56" y="65" width="6" height="6" fill="#a435f0"/>
              <rect x="65" y="65" width="6" height="6" fill="#a435f0"/>
            </svg>
          </div>
          <p className={`text-center text-xs ${t.textSub} mb-2`}>ElectroPhysics · 2026 Revision · Apr 14, 4:00 PM</p>
          <p className="text-center text-xs font-semibold text-[#a435f0] tracking-widest mb-4">GPS VALIDATION: ON</p>
          <div className="space-y-2">
            <input
              value={scannerCode}
              onChange={(e) => setScannerCode(e.target.value)}
              placeholder="Enter scanned code e.g. EP-1042"
              className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none ${t.inputBg}`}
            />
            <p className={`text-xs ${t.textSub}`}>{scannerMessage}</p>
          </div>
          <div className="flex gap-2 mt-3">
            <GhostBtn t={t} small onClick={() => setScannerMessage("New QR session generated")}>Regenerate QR</GhostBtn>
            <PrimaryBtn small onClick={markByQr}>Scan & Mark</PrimaryBtn>
          </div>
        </Card>

        <Card title="April 2026 Calendar" t={t}>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {["M","T","W","T","F","S","S"].map((d,i)=><div key={i} className={`text-center text-[10px] font-semibold ${t.textTert}`}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">{cells}</div>
          <div className={`flex gap-4 mt-3 text-xs ${t.textSub}`}>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"/>Present</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500 inline-block"/>Absent</span>
            <span className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded inline-block ${t.barBg}`}/>Holiday/Future</span>
          </div>
        </Card>
      </div>

      <Card title="Today's Register" extra={<GhostBtn small t={t}><I.Download />Export CSV</GhostBtn>} t={t} noPad>
        <table className="w-full">
          <thead><tr className={t.tableHead}>
            {["Student","Batch","Check-in Time","Method","Status"].map(h=><Th key={h} t={t}>{h}</Th>)}
          </tr></thead>
          <tbody>
            {register.map((row,i)=>(
              <tr key={i} className={t.tableRow}>
                <Td t={t}><span className="font-medium">{row.name}</span></Td>
                <Td t={t}>{row.batch}</Td><Td t={t}>{row.checkIn}</Td><Td t={t}>{row.method}</Td>
                <td className="py-3 px-3 pr-5"><Badge v={row.status} t={t}>{row.label}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── ASSIGNMENTS PAGE ─────────────────────────────────────────────────────────
function AssignmentsPage({ t }) {
  return (
    <div className="p-6">
      <div className="flex justify-end mb-5">
        <PrimaryBtn>+ New Assignment</PrimaryBtn>
      </div>

      <Card title="Active Assignments" t={t} noPad>
        <table className="w-full">
          <thead><tr className={t.tableHead}>
            {["Title","Subject","Due Date","Submitted","Graded","Status"].map(h=><Th key={h} t={t}>{h}</Th>)}
          </tr></thead>
          <tbody>
            {[
              ["Physics Paper 4","Electromagnetic induction","Physics","Apr 14","21/28","0/28","amber","In progress"],
              ["Maths Problem Set 7","Integration & differentiation","Maths","Apr 16","8/28","0/28","blue","Open"],
              ["Chemistry Lab Report 2","Titration experiment","Chemistry","Apr 18","0/28","0/28","blue","Open"],
              ["Physics Paper 3","Waves & optics","Physics","Apr 3","26/28","26/28","green","Graded"],
            ].map(([name,sub,subj,due,submitted,graded,bv,bs],i)=>(
              <tr key={i} className={t.tableRow}>
                <td className="py-3 pl-5 pr-3">
                  <p className={`text-sm font-bold ${t.text}`}>{name}</p>
                  <p className={`text-xs ${t.textTert}`}>{sub}</p>
                </td>
                <Td t={t}>{subj}</Td><Td t={t}>{due}</Td>
                <Td t={t}>{submitted}</Td><Td t={t}>{graded}</Td>
                <td className="py-3 px-3 pr-5"><Badge v={bv} t={t}>{bs}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Physics Paper 4 — Submissions" extra={<Badge v="amber" t={t}>21 / 28 submitted</Badge>} t={t} noPad>
        <table className="w-full">
          <thead><tr className={t.tableHead}>
            {["Student","Submitted At","File","Mark","Action"].map(h=><Th key={h} t={t}>{h}</Th>)}
          </tr></thead>
          <tbody>
            {[
              ["Kavindu Perera","Apr 12, 2:14 PM","physics_p4_kp.pdf","—",true],
              ["Amali Silva","Apr 12, 9:05 AM","amali_phys4.pdf","—",true],
              ["Nuwan Bandara","—",null,"—",false],
            ].map(([n,time,file,mark,submitted],i)=>(
              <tr key={i} className={t.tableRow}>
                <Td t={t}><span className="font-medium">{n}</span></Td>
                <Td t={t} className={t.textSub}>{time}</Td>
                <td className="py-3 px-3 text-sm">
                  {file ? <span className="text-blue-500 font-medium">{file}</span> : <span className={t.textTert}>Not submitted</span>}
                </td>
                <Td t={t} className={t.textTert}>{mark}</Td>
                <td className="py-3 px-3 pr-5">
                  {submitted ? <GhostBtn small t={t}>Grade</GhostBtn> : <Badge v="red" t={t}>Missing</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── MATERIALS PAGE ───────────────────────────────────────────────────────────
function MaterialsPage({ t }) {
  const weeks = [
    { title:"Week 14 — Electromagnetic Induction", items:[
      { icon:<I.File/>, bg:"bg-red-100 text-red-600", name:"Lecture notes — EM Induction.pdf", meta:"PDF · 2.4 MB · Uploaded Apr 9", btn:"Download" },
      { icon:<I.Video/>, bg:"bg-purple-100 text-purple-600", name:"Lesson recording — Apr 9 class", meta:"YouTube link · 1h 24m · Added Apr 9", btn:"Watch" },
      { icon:<I.File/>, bg:"bg-red-100 text-red-600", name:"2024 A/L Paper — Physics Section B.pdf", meta:"Past paper · 1.1 MB · Uploaded Apr 8", btn:"Download" },
    ]},
    { title:"Week 13 — Waves & Optics", items:[
      { icon:<I.File/>, bg:"bg-red-100 text-red-600", name:"Waves chapter notes.pdf", meta:"PDF · 3.1 MB · Uploaded Apr 2", btn:"Download" },
      { icon:<I.Doc/>, bg:"bg-blue-100 text-blue-600", name:"Optics formula sheet.docx", meta:"Word doc · 245 KB · Uploaded Apr 1", btn:"Download" },
    ]},
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <select className={`${t.selectBg} rounded-lg px-3 py-2 text-sm cursor-pointer focus:outline-none`}>
          <option>2026 Revision Batch</option><option>2027 Theory</option><option>O/L Foundation</option>
        </select>
        <PrimaryBtn>+ Upload Material</PrimaryBtn>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[["24","PDF Notes","text-[#a435f0]"],["12","Video Lessons","text-emerald-500"],["18","Past Papers","text-amber-500"]].map(([n,l,c])=>(
          <div key={l} className={`${t.statCard} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${c}`}>{n}</p>
            <p className={`text-xs mt-1 ${t.textSub}`}>{l}</p>
          </div>
        ))}
      </div>

      {weeks.map(week=>(
        <Card key={week.title} title={week.title} extra={<GhostBtn small t={t}>+ Add to week</GhostBtn>} t={t}>
          <div className="space-y-1">
            {week.items.map((item,i)=>(
              <div key={i} className={`flex items-center gap-3 py-3 border-b last:border-0 ${t.divider}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.bg}`}>{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${t.text} truncate`}>{item.name}</p>
                  <p className={`text-xs ${t.textTert} mt-0.5`}>{item.meta}</p>
                </div>
                <PrimaryBtn small>{item.btn}</PrimaryBtn>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── FEES PAGE ────────────────────────────────────────────────────────────────
function FeesPage({ t }) {
  const [payments, setPayments] = useState([
    { student: "Kavindu Perera", batch: "2026 Revision", amount: 4500, dueDate: "Apr 5", paidOn: "Apr 3", status: "green", label: "Paid" },
    { student: "Amali Silva", batch: "2026 Revision", amount: 4500, dueDate: "Apr 5", paidOn: "Apr 5", status: "green", label: "Paid" },
    { student: "Nuwan Bandara", batch: "2026 Revision", amount: 4500, dueDate: "Apr 5", paidOn: "-", status: "red", label: "Overdue" },
    { student: "Dilini Wijeratne", batch: "2027 Theory", amount: 3500, dueDate: "Apr 5", paidOn: "Apr 4", status: "green", label: "Paid" },
    { student: "Sachini Fernando", batch: "O/L Foundation", amount: 3000, dueDate: "Apr 5", paidOn: "-", status: "amber", label: "Pending" },
  ]);

  const feeData = [118000,122000,108000,115000,121000,103500];
  const months = ["Nov","Dec","Jan","Feb","Mar","Apr"];
  const maxVal = Math.max(...feeData);
  const paidRows = payments.filter((row) => row.label === "Paid");
  const unpaidRows = payments.filter((row) => row.label !== "Paid");
  const collected = paidRows.reduce((sum, row) => sum + row.amount, 0);
  const pending = unpaidRows.reduce((sum, row) => sum + row.amount, 0);

  function markAsPaid(studentName) {
    setPayments((prev) =>
      prev.map((row) =>
        row.student === studentName
          ? {
              ...row,
              paidOn: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              status: "green",
              label: "Paid",
            }
          : row
      )
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Metric label="Collected — April" value={`LKR ${(collected / 1000).toFixed(1)}k`} color="text-emerald-500" t={t} />
        <Metric label="Pending Amount" value={`LKR ${(pending / 1000).toFixed(1)}k`} color="text-red-500" t={t} />
        <Metric label="Paid Students" value={`${paidRows.length}/${payments.length}`} color="text-blue-500" t={t} />
        <Metric label="Overdue" value={`${payments.filter((row) => row.label === "Overdue").length}`} color="text-red-500" t={t} />
      </div>

      <Card title="April 2026 Fee Status" extra={<GhostBtn small t={t}>Send Reminders</GhostBtn>} t={t} noPad>
        <table className="w-full">
          <thead><tr className={t.tableHead}>
            {["Student","Batch","Amount","Due Date","Paid On","Status","Action"].map(h=><Th key={h} t={t}>{h}</Th>)}
          </tr></thead>
          <tbody>
            {payments.map((row,i)=>(
              <tr key={i} className={t.tableRow}>
                <Td t={t}><span className="font-medium">{row.student}</span></Td>
                <Td t={t}>{row.batch}</Td><Td t={t}>{`LKR ${row.amount.toLocaleString()}`}</Td>
                <Td t={t}>{row.dueDate}</Td><Td t={t}>{row.paidOn}</Td>
                <td className="py-3 px-3"><Badge v={row.status} t={t}>{row.label}</Badge></td>
                <td className="py-3 px-3 pr-5">
                  {row.label === "Paid"
                    ? <GhostBtn small t={t}><I.Download />Receipt</GhostBtn>
                    : <PrimaryBtn small onClick={() => markAsPaid(row.student)}>Mark Paid</PrimaryBtn>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Fee Collection — Last 6 Months" t={t}>
        <div className="flex items-end gap-3 h-44 px-2">
          {feeData.map((v,i)=>{
            const pct = (v/maxVal)*100;
            const isLast = i===feeData.length-1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <span className={`text-[10px] font-semibold ${isLast?"text-[#a435f0]":t.textTert}`}>
                  {Math.round(v/1000)}k
                </span>
                <div className="w-full flex items-end" style={{height:"120px"}}>
                  <div
                    className={`w-full rounded-t-md transition-all ${isLast?"bg-[#a435f0]":t.barBg} hover:opacity-80`}
                    style={{height:`${pct}%`}}
                  />
                </div>
                <span className={`text-[10px] ${t.textTert}`}>{months[i]}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
function NotificationsPage({ t }) {
  const groups = [
    { label:"Today", items:[
      { icon:<I.Fees/>, bg:"bg-red-100 text-red-600", title:"Fee reminder sent", body:"Automated alert sent to 5 students with overdue April fees", time:"9:00 AM · Automated cron job", unread:true },
      { icon:<I.Check/>, bg:"bg-emerald-100 text-emerald-600", title:"QR attendance recorded", body:"24/28 students marked present for Physics class at 4:00 PM", time:"4:20 PM · System", unread:true },
    ]},
    { label:"Yesterday", items:[
      { icon:<I.File/>, bg:"bg-purple-100 text-purple-600", title:"Assignment submitted", body:"Kavindu Perera submitted Physics Paper 4", time:"Apr 10, 2:14 PM", unread:false },
      { icon:<I.Alert/>, bg:"bg-amber-100 text-amber-600", title:"Low attendance alert", body:"Nuwan Bandara's attendance has dropped below 75%", time:"Apr 10, 8:00 AM · Automated", unread:true },
    ]},
    { label:"Earlier", items:[
      { icon:<I.Person/>, bg:"bg-emerald-100 text-emerald-600", title:"New student enrolled", body:"Amali Silva joined the 2026 A/L Revision batch", time:"Apr 9, 11:00 AM", unread:false },
    ]},
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <span className={`text-sm ${t.textSub}`}>4 unread notifications</span>
        <GhostBtn small t={t}>Mark all as read</GhostBtn>
      </div>
      {groups.map(group=>(
        <div key={group.label}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${t.sectionLabel}`}>{group.label}</p>
          <div className={`${t.card} rounded-xl overflow-hidden`}>
            {group.items.map((item,i)=>(
              <div key={i} className={`flex gap-3 px-5 py-4 border-b last:border-0 ${t.divider}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${item.bg}`}>{item.icon}</div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${t.text}`}>{item.title}</p>
                  <p className={`text-xs ${t.textSub} mt-0.5`}>{item.body}</p>
                  <p className={`text-xs ${t.textTert} mt-1`}>{item.time}</p>
                </div>
                {item.unread && <div className="w-2 h-2 rounded-full bg-[#a435f0] flex-shrink-0 mt-2"/>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
const NAV = [
  { section:"Main", items:[
    { id:"dashboard", label:"Dashboard", Icon:I.Dashboard },
    { id:"students", label:"Students", Icon:I.Students },
    { id:"attendance", label:"Attendance", Icon:I.Attendance },
  ]},
  { section:"Academic", items:[
    { id:"assignments", label:"Assignments", Icon:I.Assignments },
    { id:"materials", label:"Study Materials", Icon:I.Materials },
  ]},
  { section:"Finance", items:[
    { id:"fees", label:"Fees", Icon:I.Fees },
  ]},
  { section:"System", items:[
    { id:"notifications", label:"Notifications", Icon:I.Bell, badge:4 },
  ]},
];

const PAGES = {
  dashboard: DashboardPage,
  students: StudentsPage,
  attendance: AttendancePage,
  assignments: AssignmentsPage,
  materials: MaterialsPage,
  fees: FeesPage,
  notifications: NotificationsPage,
};

const PAGE_TITLES = {
  dashboard:"Dashboard", students:"Students", attendance:"Attendance",
  assignments:"Assignments", materials:"Study Materials", fees:"Fees", notifications:"Notifications",
};

// ─── APP SHELL ────────────────────────────────────────────────────────────────
export default function TuitionPlatform() {
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const t = dark ? THEMES.dark : THEMES.light;
  const PageComponent = PAGES[page];

  return (
    <div className={`min-h-screen flex ${t.bg} ${t.text} transition-colors duration-200`} style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={()=>setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-52 flex flex-col ${t.sidebar} transition-transform duration-200 ${sidebarOpen?"translate-x-0":"-translate-x-full lg:translate-x-0"}`}>
        {/* Brand */}
        <div className={`px-5 py-4 border-b ${t.divider}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-bold text-[#a435f0]">ElectroPhysics</p>
              <p className={`text-[11px] ${t.textTert} mt-0.5`}>Tuition Management</p>
            </div>
            <button className="lg:hidden" onClick={()=>setSidebarOpen(false)}><I.Close /></button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          {NAV.map(group=>(
            <div key={group.section}>
              <p className={`text-[10px] font-semibold uppercase tracking-widest px-3 py-2 ${t.textTert}`}>{group.section}</p>
              {group.items.map(({id,label,Icon,badge})=>(
                <button
                  key={id}
                  onClick={()=>{setPage(id);setSidebarOpen(false);}}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer mb-0.5 ${page===id ? t.navActive : `${t.textSub} ${t.navHover}`}`}
                >
                  <Icon />
                  <span className="flex-1 text-left">{label}</span>
                  {badge && <span className="bg-[#a435f0] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={`px-4 py-3 border-t ${t.divider}`}>
          <p className={`text-xs ${t.textTert}`}>Logged in as</p>
          <p className={`text-sm font-semibold ${t.text} mt-0.5`}>Kavisha Perera</p>
          <button className="text-xs text-red-500 hover:text-red-600 mt-2 cursor-pointer font-medium">Sign out</button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className={`sticky top-0 z-10 ${t.topbar} px-5 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={()=>setSidebarOpen(true)}><I.Menu /></button>
            <p className={`text-base font-bold ${t.text}`}>{PAGE_TITLES[page]}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={()=>setPage("notifications")}
              className={`relative p-2 rounded-lg ${t.toggleBtn} transition-colors cursor-pointer`}
            >
              <I.Bell />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"/>
            </button>
            <button
              onClick={()=>setDark(!dark)}
              className={`p-2 rounded-lg ${t.toggleBtn} transition-colors cursor-pointer`}
            >
              {dark ? <I.Sun /> : <I.Moon />}
            </button>
            <div className="w-8 h-8 rounded-full bg-[#ede9fe] text-[#3c3489] flex items-center justify-center text-xs font-bold">KP</div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto">
          <PageComponent t={t} />
        </main>
      </div>
    </div>
  );
}
