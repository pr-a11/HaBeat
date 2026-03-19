import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MONTHLY_URL = "https://habeat-a-clean-protocols-tracking.lemonsqueezy.com/checkout/buy/f13becb0-9b4f-4516-b501-4225b98111dc";
const YEARLY_URL = "https://habeat-a-clean-protocols-tracking.lemonsqueezy.com/checkout/buy/9816262e-382b-4740-bee0-6e6233af8c9b";

const streakBars = [18,24,20,30,26,36,32,40,38,44,40,22,16,28,34,42];
const streakHot = [5,6,7,8,9,10,15];
const streakOn = [2,3,4,13,14];

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const switchMode = (m: "login" | "register") => {
    setMode(m);
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
  };

  const validate = () => {
    if (!email.trim()) { setError("Email is required"); return false; }
    if (!email.includes("@") || !email.includes(".")) { setError("Enter a valid email"); return false; }
    if (!password) { setError("Password is required"); return false; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("hb-token", data.token);
        setSuccess(mode === "login" ? "Welcome back!" : "Account created! Redirecting...");
        setTimeout(() => { window.location.href = "/"; }, 900);
      } else {
        setError(data.message || "Something went wrong. Try again.");
      }
    } catch {
      setError("Network error. Check your connection.");
    }
    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  const inp: React.CSSProperties = {
    width: "100%", height: 44,
    background: "#ffffff03",
    border: "1px solid #ffffff08",
    borderRadius: 10,
    padding: "0 14px 0 38px",
    fontSize: 12, fontWeight: 300,
    color: "#fff", outline: "none",
    letterSpacing: "0.03em",
    fontFamily: "inherit",
    transition: "border 0.2s",
  };

  const lbl: React.CSSProperties = {
    fontSize: 9, fontWeight: 400,
    color: "#ffffff18",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    marginBottom: 7,
    display: "block",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "clamp(280px, 38%, 420px) 1fr",
      backgroundColor: "#09090e",
      color: "#fff",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
    }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        padding: "44px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#09090e",
        borderRight: "1px solid #ffffff06",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            border: "1px solid #ffffff15",
            background: "#ffffff04",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff44" strokeWidth="1.5" strokeLinecap="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span style={{ fontSize: 11, fontWeight: 400, color: "#ffffff30", letterSpacing: "0.3em", textTransform: "uppercase" }}>
            Habeat
          </span>
        </div>

        {/* Center content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 0" }}>
          <div style={{ fontSize: 44, fontWeight: 200, lineHeight: 1.1, letterSpacing: "-0.04em", marginBottom: 10 }}>
            <span style={{ color: "#ffffff18", fontStyle: "italic" }}>your</span><br />
            <span style={{ fontWeight: 500 }}>habits</span><br />
            <span style={{ color: "#ffffff18", fontStyle: "italic" }}>finally</span><br />
            <span style={{ fontWeight: 500 }}>working</span>
          </div>

          <div style={{ fontSize: 10, fontWeight: 300, color: "#ffffff15", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 44, paddingLeft: 2 }}>
            habit tracking — reimagined
          </div>

          <div style={{ display: "flex", gap: 28, marginBottom: 40 }}>
            {[["10", "themes"], ["∞", "habits"], ["31", "day streaks"]].map(([n, l]) => (
              <div key={l} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 20, fontWeight: 200, color: "#ffffff40", letterSpacing: "-0.03em" }}>{n}</span>
                <span style={{ fontSize: 9, fontWeight: 300, color: "#ffffff15", letterSpacing: "0.12em", textTransform: "uppercase" }}>{l}</span>
              </div>
            ))}
          </div>

          {/* Streak bars */}
          <div style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
            {streakBars.map((h, i) => (
              <div key={i} style={{
                width: 3, height: h, borderRadius: 10,
                background: streakHot.includes(i) ? "#7c3aed" : streakOn.includes(i) ? "#7c3aed40" : "#ffffff07",
              }} />
            ))}
          </div>
        </div>

        <span style={{ fontSize: 10, fontWeight: 300, color: "#ffffff10", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          © 2026 habeat
        </span>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0b0b14",
        padding: "48px 24px",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Mode switch */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 36 }}>
            {(["login", "register"] as const).map((m, i) => (
              <span key={m} style={{ display: "flex", alignItems: "center" }}>
                <button
                  onClick={() => switchMode(m)}
                  style={{
                    fontSize: 11, fontWeight: 300,
                    color: mode === m ? "#ffffff66" : "#ffffff18",
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    paddingBottom: 3,
                    borderBottom: mode === m ? "1px solid #ffffff20" : "1px solid transparent",
                    background: "none", border: "none",
                    borderBottom: mode === m ? "1px solid #ffffff20" : "1px solid transparent",
                    outline: "none", fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                >
                  {m === "login" ? "sign in" : "sign up"}
                </button>
                {i === 0 && <span style={{ fontSize: 11, color: "#ffffff10", margin: "0 10px" }}>/</span>}
              </span>
            ))}
          </div>

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
            >
              <div style={{ fontSize: 26, fontWeight: 200, letterSpacing: "-0.03em", marginBottom: 5, lineHeight: 1.25 }}>
                {mode === "login" ? <>good to see<br />you again.</> : <>create your<br />account.</>}
              </div>
              <div style={{ fontSize: 11, fontWeight: 300, color: "#ffffff18", letterSpacing: "0.04em", marginBottom: 30 }}>
                {mode === "login" ? "continue your habit journey" : "start building better habits today"}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Email */}
          <div style={{ marginBottom: 12 }}>
            <span style={lbl}>Email</span>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff18" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                onKeyDown={handleKey}
                placeholder="you@example.com"
                style={inp}
                onFocus={e => (e.target.style.borderColor = "#ffffff14")}
                onBlur={e => (e.target.style.borderColor = "#ffffff08")}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 8 }}>
            <span style={lbl}>Password</span>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff18" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={handleKey}
                placeholder={mode === "register" ? "min. 6 characters" : "••••••••"}
                style={{ ...inp, paddingRight: 44 }}
                onFocus={e => (e.target.style.borderColor = "#ffffff14")}
                onBlur={e => (e.target.style.borderColor = "#ffffff08")}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)",
                  fontSize: 9, fontWeight: 400, color: "#ffffff20", letterSpacing: "0.08em",
                  textTransform: "uppercase", cursor: "pointer",
                  background: "none", border: "none", fontFamily: "inherit",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = "#ffffff44")}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = "#ffffff20")}
              >
                {showPass ? "hide" : "show"}
              </button>
            </div>
          </div>

          {/* Error / Success messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  fontSize: 11, fontWeight: 300, color: "#f43f5e",
                  background: "#f43f5e08", border: "1px solid #f43f5e12",
                  borderRadius: 8, padding: "8px 12px", marginBottom: 8,
                  letterSpacing: "0.02em",
                }}
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  fontSize: 11, fontWeight: 300, color: "#34d399",
                  background: "#34d39908", border: "1px solid #34d39912",
                  borderRadius: 8, padding: "8px 12px", marginBottom: 8,
                  letterSpacing: "0.02em",
                }}
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", height: 44,
              background: loading ? "#ffffff08" : "#ffffff",
              borderRadius: 10,
              fontSize: 11, fontWeight: 400,
              color: loading ? "#ffffff20" : "#09090e",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              marginTop: 8, border: "none",
              letterSpacing: "0.08em", textTransform: "uppercase",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget.style.opacity = "0.88"); }}
            onMouseLeave={e => { (e.currentTarget.style.opacity = "1"); }}
          >
            {loading ? (
              <div style={{
                width: 14, height: 14, borderRadius: "50%",
                border: "1.5px solid #ffffff15",
                borderTopColor: "#ffffff44",
                animation: "hb-spin 0.6s linear infinite",
              }} />
            ) : (
              <>
                {mode === "login" ? "continue" : "create account"}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 14px" }}>
            <div style={{ flex: 1, height: 1, background: "#ffffff05" }} />
            <span style={{ fontSize: 9, fontWeight: 300, color: "#ffffff12", letterSpacing: "0.15em", textTransform: "uppercase" }}>or go pro</span>
            <div style={{ flex: 1, height: 1, background: "#ffffff05" }} />
          </div>

          {/* Pro strip */}
          <div style={{ border: "1px solid #ffffff06", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#7c3aed55">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span style={{ fontSize: 11, fontWeight: 300, color: "#ffffff25", letterSpacing: "0.08em" }}>habeat pro</span>
              </div>
              <span style={{
                fontSize: 9, fontWeight: 300, color: "#7c3aed66",
                letterSpacing: "0.1em", textTransform: "uppercase",
                border: "1px solid #7c3aed18", padding: "2px 8px", borderRadius: 20,
              }}>7 days free</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button
                onClick={() => window.open(MONTHLY_URL, "_blank")}
                style={{
                  padding: "9px 12px", borderRadius: 8,
                  fontSize: 11, fontWeight: 300, letterSpacing: "0.03em",
                  cursor: "pointer", textAlign: "center",
                  background: "transparent", border: "1px solid #ffffff07", color: "#ffffff20",
                  fontFamily: "inherit", transition: "all 0.15s",
                }}
                onMouseEnter={e => { (e.currentTarget.style.color = "#ffffff44"); (e.currentTarget.style.borderColor = "#ffffff14"); }}
                onMouseLeave={e => { (e.currentTarget.style.color = "#ffffff20"); (e.currentTarget.style.borderColor = "#ffffff07"); }}
              >
                $4.99 / mo
              </button>
              <button
                onClick={() => window.open(YEARLY_URL, "_blank")}
                style={{
                  padding: "9px 12px", borderRadius: 8,
                  fontSize: 11, fontWeight: 300, letterSpacing: "0.03em",
                  cursor: "pointer", textAlign: "center",
                  background: "#7c3aed10", border: "1px solid #7c3aed20", color: "#a78bfa66",
                  fontFamily: "inherit", transition: "all 0.15s",
                }}
                onMouseEnter={e => { (e.currentTarget.style.background = "#7c3aed20"); }}
                onMouseLeave={e => { (e.currentTarget.style.background = "#7c3aed10"); }}
              >
                $2.99 / mo · yearly
              </button>
            </div>
          </div>

          {/* Switch */}
          <div style={{ fontSize: 11, fontWeight: 300, color: "#ffffff12", textAlign: "center", marginTop: 20, letterSpacing: "0.03em" }}>
            {mode === "login" ? "no account? " : "already have one? "}
            <span
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
              style={{ color: "#ffffff28", cursor: "pointer", textDecoration: "underline", textDecorationColor: "#ffffff12" }}
            >
              {mode === "login" ? "create one free" : "sign in"}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hb-spin { to { transform: rotate(360deg); } }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 30px #0d0d1a inset !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff;
        }
      `}</style>
    </div>
  );
}
