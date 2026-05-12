import { useState } from "react";
import { supabase } from "./supabase";

const T = {
  bg: "#0c0c10", surface: "rgba(255,255,255,0.025)",
  border: "rgba(255,255,255,0.07)", gold: "#c9a84c",
  goldDim: "rgba(201,168,76,0.12)", goldBorder: "rgba(201,168,76,0.25)",
  text: "#f0ede8", dim: "#444", red: "#ef4444",
};

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else onLogin(data.user);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 10, color: T.gold, letterSpacing: 4, marginBottom: 12 }}>SPREAD THERAPY</div>
          <div style={{ fontSize: 28, fontWeight: "bold", marginBottom: 8 }}>Welcome back.</div>
          <div style={{ fontSize: 13, color: T.dim }}>Trade with discipline. Not emotion.</div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address"
            style={{ width: "100%", boxSizing: "border-box", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "13px 14px", color: T.text, fontSize: 14, fontFamily: "Georgia, serif", outline: "none", marginBottom: 10 }} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", boxSizing: "border-box", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "13px 14px", color: T.text, fontSize: 14, fontFamily: "Georgia, serif", outline: "none" }} />
        </div>
        {error && <div style={{ fontSize: 12, color: T.red, marginBottom: 12, textAlign: "center" }}>{error}</div>}
        <button onClick={handleLogin} disabled={loading || !email || !password} style={{ width: "100%", padding: "14px", background: T.goldDim, border: `1px solid ${T.goldBorder}`, borderRadius: 8, color: T.gold, fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif" }}>
          {loading ? "Signing in..." : "Sign in →"}
        </button>
        <div style={{ fontSize: 11, color: T.dim, textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
          Spread Therapy is currently invite-only.<br />Contact paul@spreadtherapy.com to request access.
        </div>
      </div>
    </div>
  );
}
