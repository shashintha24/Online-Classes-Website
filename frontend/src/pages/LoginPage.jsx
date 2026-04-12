import { useState, useEffect } from "react";

// ─── ICONS ─────────────────────────────────────────────────────────────────
const Icon = {
  Book: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  Mail: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Lock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Eye: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Chart: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  CreditCard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  Teacher: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M6 20v-2a4 4 0 0 1 8 0v2"/>
      <path d="M18 8h4m-2-2v4"/>
    </svg>
  ),
  Student: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  Sun: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Moon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  Loader: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  ),
};

// ─── DEMO CREDENTIALS ──────────────────────────────────────────────────────
const DEMO = {
  admin:   { email: "admin@edutrack.lk",   password: "admin123",   dest: "Admin Dashboard" },
  student: { email: "kavindu@gmail.com",   password: "student123", dest: "Student Portal (Kavindu Perera)" },
};

// ─── FEATURE LIST ──────────────────────────────────────────────────────────
const FEATURES = [
  { Icon: Icon.Chart,      title: "Smart Analytics",       desc: "Percentile ranks, subject trends & strength analysis" },
  { Icon: Icon.Calendar,   title: "QR Attendance",         desc: "GPS-validated scan-in — no manual register needed" },
  { Icon: Icon.CreditCard, title: "Automated Fee Alerts",  desc: "Cron job reminders sent on the 5th of every month" },
  { Icon: Icon.Book,       title: "Study Material Vault",  desc: "PDFs, videos & past papers organised by week" },
];

// ─── STATS DISPLAY ─────────────────────────────────────────────────────────
const STATS = [
  { value: "81", label: "Students" },
  { value: "3",  label: "Batches"  },
  { value: "98%", label: "Satisfaction" },
];

export default function LoginPage() {
  const [dark, setDark] = useState(false);
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("admin@edutrack.lk");
  const [password, setPassword] = useState("admin123");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'error'|'success'|'info', message }
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // stagger mount animation
    setTimeout(() => setMounted(true), 50);
  }, []);

  const switchRole = (r) => {
    setRole(r);
    setEmail(DEMO[r].email);
    setPassword(DEMO[r].password);
    setAlert(null);
  };

  const doLogin = () => {
    setAlert(null);
    if (!email.trim() || !password.trim()) {
      setAlert({ type: "error", message: "Please enter your email and password." });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const creds = DEMO[role];
      const ok =
        (role === "admin"   && email === creds.email   && password === creds.password) ||
        (role === "student" && (email === creds.email || email === "#1042") && password === creds.password);
      if (ok) {
        setAlert({ type: "success", message: `Login successful! Redirecting to ${creds.dest}…` });
      } else {
        setAlert({ type: "error", message: "Invalid credentials. Try the demo credentials shown above." });
      }
    }, 900);
  };

  const demoLogin = (r) => {
    switchRole(r);
    setAlert(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAlert({ type: "success", message: `Login successful! Redirecting to ${DEMO[r].dest}…` });
    }, 700);
  };

  const showForgot = () => {
    setAlert({ type: "info", message: "Password reset link sent to your registered email." });
  };

  // ── theme tokens ──
  const T = dark
    ? {
        page:        "bg-[#1c1d1f]",
        panel:       "bg-[#2d2f31]",
        border:      "border-[#3e4143]",
        text:        "text-gray-100",
        textSub:     "text-gray-400",
        textTert:    "text-gray-500",
        input:       "bg-[#3e4143] border-[#555] text-gray-100 placeholder-gray-500 focus:border-[#a435f0] focus:ring-[#a435f0]/20",
        roleBg:      "bg-[#3e4143]",
        roleInactive: "text-gray-400 hover:bg-[#4a4d50]",
        hintBg:      "bg-[#3e4143] border-[#555] text-gray-400",
        ghostBtn:    "bg-[#3e4143] border-[#555] text-gray-300 hover:bg-[#4a4d50]",
        divLine:     "bg-[#3e4143]",
        divText:     "text-gray-500",
        footerText:  "text-gray-500",
        toggleBtn:   "bg-[#3e4143] text-gray-300 hover:bg-[#4a4d50]",
      }
    : {
        page:        "bg-[#f7f9fa]",
        panel:       "bg-white",
        border:      "border-[#e0e0e0]",
        text:        "text-gray-900",
        textSub:     "text-gray-500",
        textTert:    "text-gray-400",
        input:       "bg-white border-[#d0d0d0] text-gray-900 placeholder-gray-400 focus:border-[#a435f0] focus:ring-[#a435f0]/15",
        roleBg:      "bg-[#f4f4f4]",
        roleInactive: "text-gray-500 hover:bg-[#ebebeb]",
        hintBg:      "bg-[#f4f4f4] border-[#e8e8e8] text-gray-500",
        ghostBtn:    "bg-white border-[#d0d0d0] text-gray-700 hover:bg-[#f7f7f7]",
        divLine:     "bg-[#e8e8e8]",
        divText:     "text-gray-400",
        footerText:  "text-gray-400",
        toggleBtn:   "bg-[#f0f0f0] text-gray-600 hover:bg-[#e8e8e8]",
      };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-5 sm:p-8 font-sans transition-colors duration-300 ${T.page}`}
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      <div className={`w-full max-w-[1120px] grid lg:grid-cols-[44%_56%] rounded-3xl overflow-hidden border ${T.border} shadow-2xl`}>
        {/* ── LEFT CONTENT (NOW INSIDE SAME CARD) ───────────────────── */}
        <div
          className="flex flex-col justify-between relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #3c3489 0%, #534AB7 45%, #6e63d4 100%)",
          }}
        >
          {/* decorative blobs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
          <div className="absolute bottom-20 -left-16 w-64 h-64 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #a435f0 0%, transparent 70%)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, #fff 0%, transparent 60%)" }} />

          <div className="relative z-10 p-8 sm:p-10">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
              <Icon.Book size={20} color="#fff" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">EduTrack</p>
              <p className="text-white/50 text-xs mt-0.5">Tuition Management System</p>
            </div>
          </div>

          {/* Hero */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white leading-tight mb-3">
              Manage your tuition<br/>class with confidence
            </h1>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Track students, marks, fees, attendance, and study materials — all in one professional platform built for Sri Lankan A/L tuition masters.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-5">
            {FEATURES.map(({ Icon: Ico, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(255,255,255,0.15)" }}>
                  <Ico />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{title}</p>
                  <p className="text-white/50 text-xs mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row + footer */}
          <div className="relative z-10 p-8 sm:p-10">
          <div className="flex gap-8 mb-6">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-white text-2xl font-bold leading-none">{value}</p>
                <p className="text-white/50 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs font-mono tracking-wide">
            Spring Boot · React · Tailwind · MySQL
          </p>
        </div>
      </div>

        {/* ── RIGHT CONTENT (INSIDE SAME CARD) ──────────────────────── */}
        <div className={`flex flex-col items-center justify-center px-6 sm:px-8 py-10 relative ${T.panel} transition-colors duration-300`}>
        {/* Dark mode toggle */}
        <button
          onClick={() => setDark(!dark)}
          className={`absolute top-5 right-5 p-2 rounded-lg transition-colors cursor-pointer ${T.toggleBtn}`}
        >
          {dark ? <Icon.Sun /> : <Icon.Moon />}
        </button>

        {/* Form container */}
        <div
          className={`w-full max-w-[380px] transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {/* Brand mark */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#ede9fe] flex items-center justify-center">
              <Icon.Book size={18} color="#534AB7" />
            </div>
            <p className={`font-bold text-lg ${T.text}`}>EduTrack</p>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className={`text-2xl font-bold ${T.text} mb-1`}>Welcome back</h2>
            <p className={`text-sm ${T.textSub}`}>
              {role === "admin"
                ? "Sign in to manage your tuition class"
                : "Sign in to view your marks, attendance & fees"}
            </p>
          </div>

          {/* Role switcher */}
          <div className={`flex rounded-xl p-1 mb-5 ${T.roleBg}`}>
            {[
              { key: "admin",   label: "Admin / Teacher", Ico: Icon.Teacher },
              { key: "student", label: "Student",         Ico: Icon.Student },
            ].map(({ key, label, Ico }) => (
              <button
                key={key}
                onClick={() => switchRole(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  role === key
                    ? "bg-[#a435f0] text-white shadow-sm"
                    : T.roleInactive
                }`}
              >
                <Ico />
                {label}
              </button>
            ))}
          </div>

          {/* Hint box */}
          <div className={`text-xs px-3 py-2.5 rounded-lg border mb-4 ${T.hintBg}`}>
            <span className={`font-semibold ${T.text}`}>
              {role === "admin" ? "Admin demo:" : "Student demo:"}
            </span>{" "}
            {role === "admin" ? "admin@edutrack.lk / admin123" : "kavindu@gmail.com / student123"}
          </div>

          {/* Alert box */}
          {alert && (
            <div className={`flex items-center gap-2.5 px-3.5 py-3 rounded-lg mb-4 text-sm font-medium
              ${alert.type === "error"   ? "bg-red-50 text-red-700 border border-red-200" : ""}
              ${alert.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : ""}
              ${alert.type === "info"    ? "bg-blue-50 text-blue-700 border border-blue-200" : ""}
              ${dark && alert.type === "error"   ? "!bg-red-900/30 !text-red-300 !border-red-800" : ""}
              ${dark && alert.type === "success" ? "!bg-emerald-900/30 !text-emerald-300 !border-emerald-800" : ""}
              ${dark && alert.type === "info"    ? "!bg-blue-900/30 !text-blue-300 !border-blue-800" : ""}
            `}>
              {alert.type === "error"   && <Icon.AlertCircle />}
              {alert.type === "success" && <Icon.CheckCircle />}
              {alert.type === "info"    && <Icon.AlertCircle />}
              <span>{alert.message}</span>
            </div>
          )}

          {/* Email field */}
          <div className="mb-4">
            <label className={`block text-xs font-semibold mb-1.5 ${T.textSub}`}>
              {role === "admin" ? "Email address" : "Student ID or email"}
            </label>
            <div className="relative">
              <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${T.textTert}`}>
                <Icon.Mail />
              </span>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && doLogin()}
                placeholder={role === "admin" ? "admin@edutrack.lk" : "student@edutrack.lk or #1042"}
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-all ring-0 focus:ring-2 ${T.input}`}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="mb-1">
            <label className={`block text-xs font-semibold mb-1.5 ${T.textSub}`}>Password</label>
            <div className="relative">
              <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${T.textTert}`}>
                <Icon.Lock />
              </span>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && doLogin()}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border outline-none transition-all ring-0 focus:ring-2 ${T.input}`}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${T.textTert} hover:opacity-80 transition-opacity`}
              >
                {showPw ? <Icon.EyeOff /> : <Icon.Eye />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end mb-5 mt-2">
            <button
              onClick={showForgot}
              className="text-xs font-semibold text-[#a435f0] hover:text-[#8710d8] transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Sign in button */}
          <button
            onClick={doLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#a435f0] hover:bg-[#8710d8] active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all cursor-pointer disabled:opacity-70 mb-4 shadow-lg shadow-[#a435f0]/25"
          >
            {loading ? (
              <>
                <span className="animate-spin"><Icon.Loader /></span>
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`flex-1 h-px ${T.divLine}`} />
            <span className={`text-xs ${T.divText}`}>or try a demo account</span>
            <div className={`flex-1 h-px ${T.divLine}`} />
          </div>

          {/* Demo buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => demoLogin("admin")}
              className={`w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${T.ghostBtn}`}
            >
              <span className="text-[#a435f0]"><Icon.Teacher /></span>
              Continue as <strong>Admin / Teacher</strong>
            </button>
            <button
              onClick={() => demoLogin("student")}
              className={`w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${T.ghostBtn}`}
            >
              <span className="text-emerald-500"><Icon.Student /></span>
              Continue as <strong>Student</strong> (Kavindu Perera)
            </button>
          </div>

          {/* Footer note */}
          <p className={`text-center text-xs mt-6 leading-relaxed ${T.footerText}`}>
            Protected by Spring Security · JWT Authentication
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
