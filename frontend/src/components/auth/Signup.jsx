import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

// ─── GLOBAL STYLES ──────────────────────────────────────────────────────────
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
  @keyframes spin     { to   { transform:rotate(360deg) } }
  @keyframes slideLeft  { from { opacity:0; transform:translateX(40px)  } to { opacity:1; transform:translateX(0) } }
  @keyframes slideRight { from { opacity:0; transform:translateX(-40px) } to { opacity:1; transform:translateX(0) } }
  @keyframes popIn    { from { opacity:0; transform:scale(0.85) } to { opacity:1; transform:scale(1) } }
  .anim-fade-up    { animation: fadeUp   0.45s cubic-bezier(.22,1,.36,1) both }
  .anim-slide-left { animation: slideLeft 0.4s cubic-bezier(.22,1,.36,1) both }
  .anim-pop-in     { animation: popIn    0.4s cubic-bezier(.22,1,.36,1) both }
  .anim-spin       { animation: spin     0.8s linear infinite }
  .delay-1 { animation-delay: 0.08s }
  .delay-2 { animation-delay: 0.16s }
  .delay-3 { animation-delay: 0.24s }
  .delay-4 { animation-delay: 0.32s }
  .ring-input:focus { outline:none; border-color:#a435f0 !important; box-shadow: 0 0 0 3px rgba(164,53,240,0.15) !important; }
  .ring-green:focus { outline:none; border-color:#10b981 !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.15) !important; }
  input::placeholder { color: #9ca3af; }
  select { appearance: none; }
`;

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Ic = {
  Book:     (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Teacher:  (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 8 0v2"/><path d="M18 8h4m-2-2v4"/></svg>,
  Student:  (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  User:     (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Mail:     (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Phone:    (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.63a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Lock:     (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Eye:      (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff:   (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  ChevronRight: (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  ArrowLeft:(p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Check:    (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  ID:       (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  Hash:     (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
  Sun:      (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon:     (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Alert:    (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Sparkle:  (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>,
  MapPin:   (p={}) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
};

const sz = (size) => ({ width: size, height: size });

// ─── FIELD COMPONENT ─────────────────────────────────────────────────────────
function Field({ label, icon: Icon, type = "text", value, onChange, placeholder, error, hint, suffix, D, accentClass = "ring-input", children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: D.sub, marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {Icon && (
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: D.tert, pointerEvents: "none", display: "flex" }}>
            <Icon {...sz(15)} />
          </span>
        )}
        {children ? children : (
          <input
            className={accentClass}
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
              width: "100%",
              paddingLeft: Icon ? 36 : 12,
              paddingRight: suffix ? 40 : 12,
              paddingTop: 10, paddingBottom: 10,
              background: D.input,
              border: `1.5px solid ${error ? "#ef4444" : D.inputBorder}`,
              borderRadius: 12, fontSize: 13, color: D.text,
              boxSizing: "border-box", transition: "border-color 0.15s, box-shadow 0.15s",
              fontFamily: "inherit",
            }}
          />
        )}
        {suffix && (
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
            {suffix}
          </span>
        )}
      </div>
      {error && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{error}</p>}
      {hint && !error && <p style={{ fontSize: 11, color: D.tert, marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

// ─── PASSWORD STRENGTH ───────────────────────────────────────────────────────
function passwordStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "Too short", color: "#ef4444" },
    { label: "Weak",      color: "#f59e0b" },
    { label: "Fair",      color: "#f59e0b" },
    { label: "Good",      color: "#10b981" },
    { label: "Strong",    color: "#059669" },
  ];
  return { score, ...map[score] };
}

// ─── STEP INDICATOR ──────────────────────────────────────────────────────────
function StepDots({ step, total, accent, D }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 28 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 6, borderRadius: 99,
          width: i === step ? 24 : 8,
          background: i === step ? accent : (i < step ? accent + "88" : D.border),
          transition: "all 0.3s ease",
        }} />
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [step, setStep] = useState(0);           // 0=role, 1=personal, 2=account, 3=success
  const [role, setRole] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  // Personal info
  const [firstName, setFirstName]   = useState("");
  const [lastName,  setLastName]    = useState("");
  const [email,     setEmail]       = useState("");
  const [phone,     setPhone]       = useState("");
  const [dob,       setDob]         = useState("");
  const [address,   setAddress]     = useState("");

  // Role-specific
  const [studentId, setStudentId]   = useState("");
  const [batch,     setBatch]       = useState("");
  const [subject,   setSubject]     = useState("");

  // Account
  const [username,  setUsername]    = useState("");
  const [password,  setPassword]    = useState("");
  const [confirm,   setConfirm]     = useState("");
  const [showPw,    setShowPw]      = useState(false);
  const [showCf,    setShowCf]      = useState(false);
  const [agree,     setAgree]       = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [createdAuth, setCreatedAuth] = useState(null);

  const D = dark ? {
    page:        "#1c1d1f",
    card:        "#2d2f31",
    border:      "#3e4143",
    text:        "#f3f4f6",
    sub:         "#9ca3af",
    tert:        "#6b7280",
    input:       "#3e4143",
    inputBorder: "#555",
    hover:       "#35373a",
    divider:     "#3e4143",
    shadow:      "rgba(0,0,0,0.45)",
    toggleBg:    "#3e4143",
    checkboxBg:  "#3e4143",
  } : {
    page:        "#f0f2f5",
    card:        "#ffffff",
    border:      "#e5e7eb",
    text:        "#111827",
    sub:         "#6b7280",
    tert:        "#9ca3af",
    input:       "#f9fafb",
    inputBorder: "#d1d5db",
    hover:       "#f3f4f6",
    divider:     "#e5e7eb",
    shadow:      "rgba(0,0,0,0.08)",
    toggleBg:    "#e5e7eb",
    checkboxBg:  "#f3f4f6",
  };

  const RC = {
    admin: {
      accent:     "#a435f0",
      gradient:   "linear-gradient(135deg, #3c3489 0%, #a435f0 100%)",
      lightBg:    dark ? "#3730a3" : "#ede9fe",
      lightColor: dark ? "#c4b5fd" : "#4c1d95",
      hoverBorder:"#a435f0",
      label:      "Admin / Teacher",
      sub:        "Manage your tuition class",
      Icon:       Ic.Teacher,
    },
    student: {
      accent:     "#10b981",
      gradient:   "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
      lightBg:    dark ? "#064e3b" : "#d1fae5",
      lightColor: dark ? "#6ee7b7" : "#065f46",
      hoverBorder:"#10b981",
      label:      "Student",
      sub:        "Track your academic journey",
      Icon:       Ic.Student,
    },
  };

  const rc = role ? RC[role] : RC.admin;
  const pw = passwordStrength(password);

  const goNext = (nextStep) => {
    setAnimKey(k => k + 1);
    setStep(nextStep);
  };

  const selectRole = (r) => {
    setRole(r);
    setErrors({});
    goNext(1);
  };

  const validatePersonal = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!lastName.trim())  e.lastName  = "Last name is required";
    if (!email.trim())     e.email     = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!phone.trim())     e.phone     = "Phone number is required";
    if (role === "student" && !studentId.trim()) e.studentId = "Student ID is required";
    if (role === "student" && !batch)            e.batch     = "Please select a batch";
    if (role === "admin"   && !subject)          e.subject   = "Please select your subject";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateAccount = () => {
    const e = {};
    if (!username.trim())   e.username = "Username is required";
    else if (username.length < 4) e.username = "At least 4 characters";
    if (!password)          e.password = "Password is required";
    else if (password.length < 6) e.password = "At least 6 characters";
    if (password !== confirm) e.confirm = "Passwords do not match";
    if (!agree)             e.agree   = "You must agree to the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateAccount()) return;
    setSubmitError("");
    setLoading(true);

    try {
      const payload = {
        username,
        email,
        password,
        fullName: `${firstName} ${lastName}`.trim(),
        role: role === "student" ? "STUDENT" : "ADMIN",
        grade: role === "student" ? (batch || "N/A") : null,
        subject: role === "admin" ? (subject || "General") : null,
      };

      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Unable to create account");
      }

      setCreatedAuth(data);
      goNext(3);
    } catch (error) {
      setSubmitError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ── PROGRESS BAR ──────────────────────────────────────────────────────────
  const stepLabels = ["Role", "Personal Info", "Account Setup"];
  const progressPct = step === 0 ? 0 : step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <>
      <style>{STYLE}</style>
      <div style={{
        minHeight: "100vh",
        background: dark
          ? "radial-gradient(ellipse at 25% 15%, #2d2060 0%, #1c1d1f 55%)"
          : "radial-gradient(ellipse at 25% 15%, #ede9fe 0%, #f0f2f5 55%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "28px 16px",
        fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif",
        transition: "background 0.3s",
      }}>

        {/* Dark toggle */}
        <button onClick={() => setDark(d => !d)} style={{
          position: "fixed", top: 20, right: 20, zIndex: 100,
          background: D.toggleBg, border: "none", borderRadius: 10,
          padding: "8px 10px", cursor: "pointer", color: D.sub,
          display: "flex", alignItems: "center",
        }}>
          {dark ? <Ic.Sun {...sz(16)} /> : <Ic.Moon {...sz(16)} />}
        </button>

        {/* ── HEADER ── */}
        <div className="anim-fade-up" style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, #3c3489, #a435f0)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
              boxShadow: "0 4px 14px rgba(164,53,240,0.35)",
            }}>
              <Ic.Book {...sz(20)} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: D.text, letterSpacing: "-0.5px" }}>ElectroPhysics</span>
          </div>
          <p style={{ fontSize: 13, color: D.sub }}>Create your account — it's free</p>
        </div>

        {/* ── PROGRESS BAR (steps 1-3) ── */}
        {step > 0 && step < 3 && (
          <div className="anim-fade-up" style={{ width: "100%", maxWidth: 480, marginBottom: 20 }}>
            {/* Step labels */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              {stepLabels.map((label, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", fontSize: 10, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: i + 1 <= step ? rc.accent : D.border,
                    color: i + 1 <= step ? "#fff" : D.tert,
                    transition: "all 0.3s",
                    flexShrink: 0,
                  }}>
                    {i + 1 < step ? <Ic.Check {...sz(10)} /> : i + 1}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: i + 1 === step ? rc.accent : D.tert }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ height: 6, background: D.border, borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", background: rc.gradient, borderRadius: 99,
                width: `${progressPct}%`, transition: "width 0.4s ease",
              }} />
            </div>
          </div>
        )}

        {/* ════════════ STEP 0: ROLE SELECTION ════════════════════════════ */}
        {step === 0 && (
          <div key="step0" className="anim-fade-up delay-1" style={{ width: "100%", maxWidth: 520 }}>
            <p style={{ textAlign: "center", fontSize: 20, fontWeight: 700, color: D.text, marginBottom: 6 }}>
              Who are you registering as?
            </p>
            <p style={{ textAlign: "center", fontSize: 13, color: D.sub, marginBottom: 24 }}>
              Choose your role to get started
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {(["admin", "student"]).map((r) => {
                const cfg = RC[r];
                return (
                  <button
                    key={r}
                    onClick={() => selectRole(r)}
                    className="anim-fade-up"
                    style={{
                      background: D.card, border: `1.5px solid ${D.border}`,
                      borderRadius: 20, padding: "28px 22px",
                      cursor: "pointer", textAlign: "left",
                      transition: "all 0.2s",
                      boxShadow: `0 2px 16px ${D.shadow}`,
                      position: "relative", overflow: "hidden",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = `0 12px 32px ${D.shadow}, 0 0 0 2px ${cfg.accent}`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = `0 2px 16px ${D.shadow}`;
                    }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: cfg.gradient }} />
                    <div style={{
                      width: 54, height: 54, borderRadius: 16,
                      background: cfg.lightBg, color: cfg.lightColor,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 14,
                    }}>
                      <cfg.Icon {...sz(26)} />
                    </div>
                    <p style={{ fontSize: 17, fontWeight: 800, color: D.text, marginBottom: 4 }}>{cfg.label}</p>
                    <p style={{ fontSize: 12, color: D.sub, marginBottom: 16, lineHeight: 1.5 }}>{cfg.sub}</p>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      background: cfg.lightBg, color: cfg.lightColor,
                      fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 99,
                    }}>
                      Register <Ic.ChevronRight {...sz(12)} />
                    </div>
                  </button>
                );
              })}
            </div>

            <p style={{ textAlign: "center", fontSize: 12, color: D.sub, marginTop: 20 }}>
              Already have an account?{" "}
              <span style={{ color: "#a435f0", fontWeight: 600, cursor: "pointer" }} onClick={() => navigate("/login")}>Sign in</span>
            </p>
          </div>
        )}

        {/* ════════════ STEP 1: PERSONAL INFO ═════════════════════════════ */}
        {step === 1 && role && (
          <div key={`step1-${animKey}`} className="anim-slide-left" style={{ width: "100%", maxWidth: 480 }}>
            <div style={{
              background: D.card, border: `1.5px solid ${D.border}`,
              borderRadius: 24, overflow: "hidden",
              boxShadow: `0 8px 40px ${D.shadow}`,
            }}>
              {/* Banner */}
              <div style={{ background: rc.gradient, padding: "24px 28px 28px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -24, right: -24, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                <button onClick={() => goNext(0)} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 8,
                  padding: "5px 10px", cursor: "pointer", color: "#fff", fontSize: 12, fontWeight: 600, marginBottom: 14,
                }}>
                  <Ic.ArrowLeft {...sz(14)} /> Back
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                    <rc.Icon {...sz(24)} />
                  </div>
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Step 1 of 2</p>
                    <p style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>Personal Information</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "28px 28px 24px" }}>
                {/* Name row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="First Name" icon={Ic.User} value={firstName} onChange={setFirstName}
                    placeholder="Kavindu" error={errors.firstName} D={D} accentClass="ring-input" />
                  <Field label="Last Name" value={lastName} onChange={setLastName}
                    placeholder="Perera" error={errors.lastName} D={D} accentClass="ring-input" />
                </div>

                <Field label="Email Address" icon={Ic.Mail} type="email" value={email} onChange={setEmail}
                  placeholder="you@example.com" error={errors.email} D={D} accentClass="ring-input" />

                <Field label="Phone Number" icon={Ic.Phone} value={phone} onChange={setPhone}
                  placeholder="+94 77 123 4567" error={errors.phone} D={D} accentClass="ring-input" />

                {/* Role-specific fields */}
                {role === "student" && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <Field label="Student ID" icon={Ic.Hash} value={studentId} onChange={setStudentId}
                        placeholder="#1042" error={errors.studentId} D={D} accentClass="ring-input" />
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: D.sub, marginBottom: 6 }}>Batch</label>
                        <div style={{ position: "relative" }}>
                          <select
                            className="ring-input"
                            value={batch} onChange={e => setBatch(e.target.value)}
                            style={{
                              width: "100%", padding: "10px 12px", paddingRight: 30,
                              background: D.input, border: `1.5px solid ${errors.batch ? "#ef4444" : D.inputBorder}`,
                              borderRadius: 12, fontSize: 13, color: batch ? D.text : D.tert,
                              fontFamily: "inherit", cursor: "pointer",
                            }}
                          >
                            <option value="">Select batch</option>
                            <option>2026 A/L Revision</option>
                            <option>2027 Theory</option>
                            <option>O/L Foundation</option>
                          </select>
                          <Ic.ChevronRight {...sz(13)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%) rotate(90deg)", color: D.tert, pointerEvents: "none" }} />
                        </div>
                        {errors.batch && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{errors.batch}</p>}
                      </div>
                    </div>
                  </>
                )}

                {role === "admin" && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: D.sub, marginBottom: 6 }}>Primary Subject</label>
                    <div style={{ position: "relative" }}>
                      <select
                        className="ring-input"
                        value={subject} onChange={e => setSubject(e.target.value)}
                        style={{
                          width: "100%", padding: "10px 12px", paddingRight: 30,
                          background: D.input, border: `1.5px solid ${errors.subject ? "#ef4444" : D.inputBorder}`,
                          borderRadius: 12, fontSize: 13, color: subject ? D.text : D.tert,
                          fontFamily: "inherit", cursor: "pointer",
                        }}
                      >
                        <option value="">Select subject</option>
                        <option>Physics</option>
                        <option>Mathematics</option>
                        <option>Chemistry</option>
                        <option>Combined Maths</option>
                        <option>Biology</option>
                      </select>
                      <Ic.ChevronRight {...sz(13)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%) rotate(90deg)", color: D.tert, pointerEvents: "none" }} />
                    </div>
                    {errors.subject && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{errors.subject}</p>}
                  </div>
                )}

                <Field label="Address / City" icon={Ic.MapPin} value={address} onChange={setAddress}
                  placeholder="Colombo, Sri Lanka" D={D} accentClass="ring-input" />

                <button
                  onClick={() => { if (validatePersonal()) goNext(2); }}
                  style={{
                    width: "100%", padding: "12px", border: "none", borderRadius: 12,
                    background: rc.gradient, color: "#fff", fontSize: 14, fontWeight: 700,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: `0 4px 18px ${rc.accent}44`, transition: "opacity 0.2s", marginTop: 4,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Continue to Account Setup <Ic.ChevronRight {...sz(16)} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════ STEP 2: ACCOUNT SETUP ═════════════════════════════ */}
        {step === 2 && role && (
          <div key={`step2-${animKey}`} className="anim-slide-left" style={{ width: "100%", maxWidth: 480 }}>
            <div style={{
              background: D.card, border: `1.5px solid ${D.border}`,
              borderRadius: 24, overflow: "hidden",
              boxShadow: `0 8px 40px ${D.shadow}`,
            }}>
              {/* Banner */}
              <div style={{ background: rc.gradient, padding: "24px 28px 28px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -24, right: -24, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                <button onClick={() => goNext(1)} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 8,
                  padding: "5px 10px", cursor: "pointer", color: "#fff", fontSize: 12, fontWeight: 600, marginBottom: 14,
                }}>
                  <Ic.ArrowLeft {...sz(14)} /> Back
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                    <Ic.Lock {...sz(22)} />
                  </div>
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Step 2 of 2</p>
                    <p style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>Account Setup</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "28px 28px 24px" }}>
                {/* Summary chip */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: rc.lightBg, borderRadius: 12, padding: "10px 14px", marginBottom: 20,
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: rc.accent + "22", display: "flex", alignItems: "center", justifyContent: "center", color: rc.accent }}>
                    <rc.Icon {...sz(16)} />
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: rc.lightColor }}>{firstName || "Your"} {lastName || "Name"}</p>
                    <p style={{ fontSize: 11, color: rc.lightColor + "bb" }}>{email || "your@email.com"} · {rc.label}</p>
                  </div>
                </div>

                <Field label="Username" icon={Ic.User} value={username} onChange={setUsername}
                  placeholder="kavindu_perera" error={errors.username}
                  hint="4+ characters, no spaces" D={D} accentClass="ring-input" />

                {/* Password */}
                <div style={{ marginBottom: 6 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: D.sub, marginBottom: 6 }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: D.tert, display: "flex" }}>
                      <Ic.Lock {...sz(15)} />
                    </span>
                    <input
                      className="ring-input"
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      style={{
                        width: "100%", paddingLeft: 36, paddingRight: 40, paddingTop: 10, paddingBottom: 10,
                        background: D.input, border: `1.5px solid ${errors.password ? "#ef4444" : D.inputBorder}`,
                        borderRadius: 12, fontSize: 13, color: D.text, fontFamily: "inherit",
                        boxSizing: "border-box",
                      }}
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)} style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", color: D.tert, display: "flex",
                    }}>
                      {showPw ? <Ic.EyeOff {...sz(15)} /> : <Ic.Eye {...sz(15)} />}
                    </button>
                  </div>
                  {errors.password && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{errors.password}</p>}
                </div>

                {/* Strength bar */}
                {password && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{
                          flex: 1, height: 4, borderRadius: 99,
                          background: i <= pw.score ? pw.color : D.border,
                          transition: "background 0.2s",
                        }} />
                      ))}
                    </div>
                    <p style={{ fontSize: 11, color: pw.color, fontWeight: 600 }}>{pw.label}</p>
                  </div>
                )}

                {/* Confirm password */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: D.sub, marginBottom: 6 }}>Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: D.tert, display: "flex" }}>
                      <Ic.Lock {...sz(15)} />
                    </span>
                    <input
                      className="ring-input"
                      type={showCf ? "text" : "password"}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="Re-enter your password"
                      style={{
                        width: "100%", paddingLeft: 36, paddingRight: 40, paddingTop: 10, paddingBottom: 10,
                        background: D.input, border: `1.5px solid ${errors.confirm ? "#ef4444" : confirm && confirm === password ? "#10b981" : D.inputBorder}`,
                        borderRadius: 12, fontSize: 13, color: D.text, fontFamily: "inherit",
                        boxSizing: "border-box",
                      }}
                    />
                    <button type="button" onClick={() => setShowCf(v => !v)} style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", color: D.tert, display: "flex",
                    }}>
                      {showCf ? <Ic.EyeOff {...sz(15)} /> : <Ic.Eye {...sz(15)} />}
                    </button>
                    {confirm && confirm === password && (
                      <span style={{ position: "absolute", right: 38, top: "50%", transform: "translateY(-50%)", color: "#10b981", display: "flex" }}>
                        <Ic.Check {...sz(15)} />
                      </span>
                    )}
                  </div>
                  {errors.confirm && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{errors.confirm}</p>}
                </div>

                {/* Terms */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20 }}>
                  <button
                    type="button"
                    onClick={() => setAgree(a => !a)}
                    style={{
                      width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                      border: `2px solid ${agree ? rc.accent : D.inputBorder}`,
                      background: agree ? rc.accent : D.checkboxBg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {agree && <Ic.Check {...sz(11)} style={{ color: "#fff" }} />}
                  </button>
                  <p style={{ fontSize: 12, color: D.sub, lineHeight: 1.5 }}>
                    I agree to the{" "}
                    <span style={{ color: rc.accent, fontWeight: 600, cursor: "pointer" }}>Terms of Service</span>
                    {" "}and{" "}
                    <span style={{ color: rc.accent, fontWeight: 600, cursor: "pointer" }}>Privacy Policy</span>
                  </p>
                </div>
                {errors.agree && <p style={{ fontSize: 11, color: "#ef4444", marginTop: -12, marginBottom: 12 }}>{errors.agree}</p>}

                {submitError && (
                  <p style={{ fontSize: 12, color: "#ef4444", marginBottom: 12 }}>
                    {submitError}
                  </p>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    width: "100%", padding: "12px", border: "none", borderRadius: 12,
                    background: loading ? "#9ca3af" : rc.gradient,
                    color: "#fff", fontSize: 14, fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: loading ? "none" : `0 4px 18px ${rc.accent}44`,
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  {loading ? (
                    <>
                      <svg className="anim-spin" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                      Creating account…
                    </>
                  ) : (
                    <>Create Account <Ic.Sparkle {...sz(16)} /></>
                  )}
                </button>

                <p style={{ textAlign: "center", fontSize: 12, color: D.sub, marginTop: 16 }}>
                  Already registered?{" "}
                  <span style={{ color: rc.accent, fontWeight: 600, cursor: "pointer" }} onClick={() => navigate("/login")}>Sign in</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ════════════ STEP 3: SUCCESS ════════════════════════════════════ */}
        {step === 3 && (
          <div key="step3" className="anim-pop-in" style={{ width: "100%", maxWidth: 420 }}>
            <div style={{
              background: D.card, border: `1.5px solid ${D.border}`,
              borderRadius: 24, padding: "48px 36px", textAlign: "center",
              boxShadow: `0 8px 40px ${D.shadow}`,
            }}>
              {/* Success icon */}
              <div style={{
                width: 80, height: 80, borderRadius: "50%", margin: "0 auto 24px",
                background: rc.gradient, display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 8px 28px ${rc.accent}44`,
              }}>
                <Ic.Check {...sz(36)} style={{ color: "#fff" }} />
              </div>

              <h2 style={{ fontSize: 24, fontWeight: 800, color: D.text, marginBottom: 8 }}>
                You're all set! 🎉
              </h2>
              <p style={{ fontSize: 14, color: D.sub, lineHeight: 1.6, marginBottom: 6 }}>
                Welcome to ElectroPhysics,{" "}
                <strong style={{ color: D.text }}>{firstName || "there"}</strong>!
              </p>
              <p style={{ fontSize: 13, color: D.sub, lineHeight: 1.6, marginBottom: 28 }}>
                Your <strong style={{ color: rc.accent }}>{rc.label}</strong> account has been created successfully.
              </p>

              {/* Summary card */}
              <div style={{
                background: rc.lightBg, borderRadius: 16, padding: "16px 20px",
                marginBottom: 28, textAlign: "left",
              }}>
                {[
                  ["Name",     `${firstName} ${lastName}`],
                  ["Email",    email],
                  ["Username", `@${username}`],
                  ["Role",     rc.label],
                  ...(role === "student" ? [["Batch", batch]] : [["Subject", subject]]),
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
                    <span style={{ color: rc.lightColor + "99", fontWeight: 600 }}>{k}</span>
                    <span style={{ color: rc.lightColor, fontWeight: 700 }}>{v || "—"}</span>
                  </div>
                ))}
              </div>

              <button
                style={{
                  width: "100%", padding: "13px", border: "none", borderRadius: 12,
                  background: rc.gradient, color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", boxShadow: `0 4px 18px ${rc.accent}44`, marginBottom: 12,
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                onClick={() => {
                  if (createdAuth) {
                    localStorage.setItem("ep_auth", JSON.stringify({
                      userId: createdAuth.userId,
                      username: createdAuth.username,
                      email: createdAuth.email,
                      role: createdAuth.role,
                      basicToken: createdAuth.basicToken,
                    }));
                  }
                  navigate(role === "admin" ? "/admin" : "/student");
                }}
              >
                Go to {role === "admin" ? "Admin Dashboard" : "Student Portal"} →
              </button>

              <button
                onClick={() => { setStep(0); setRole(null); setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setStudentId(""); setBatch(""); setSubject(""); setUsername(""); setPassword(""); setConfirm(""); setAgree(false); setErrors({}); }}
                style={{
                  width: "100%", padding: "11px", border: `1.5px solid ${D.border}`,
                  borderRadius: 12, background: "none", color: D.sub,
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                Register another account
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        {step < 3 && (
          <p style={{ fontSize: 11, color: D.tert, marginTop: 20, textAlign: "center" }}>
            Protected by Spring Security · JWT Authentication
          </p>
        )}
      </div>
    </>
  );
}
