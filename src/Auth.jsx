import { useState } from "react";
import { supabase } from "./supabase";

const G = "#10b981";

export default function Auth({ onBack, onSuccess }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleEmailAuth(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      if (data.user) {
        await supabase.from("profiles").insert({ id: data.user.id, username });
        setMessage("Account created! Check your email to confirm.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      onSuccess();
    }
    setLoading(false);
  }

  async function handleGoogle() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "https://www.getsportactiq.com" }
    });
    if (error) { setError(error.message); setLoading(false); }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#060d0a", color: "#fff", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 32, letterSpacing: 3, display: "inline-flex", alignItems: "flex-start" }}>
            <span style={{ color: "#fff" }}>SPOR</span>
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ color: "transparent" }}>T</span>
              <span style={{ position: "absolute", top: 0, left: 0, width: "50%", overflow: "hidden", color: "#fff", whiteSpace: "nowrap" }}>T</span>
              <span style={{ position: "absolute", top: 0, right: 0, width: "50%", overflow: "hidden", color: G, whiteSpace: "nowrap", direction: "rtl" }}>T</span>
            </span>
            <span style={{ color: G }}>ACTIQ</span>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32 }}>
          {/* Tabs */}
          <div style={{ display: "flex", marginBottom: 28, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4 }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); setMessage(""); }}
                style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", background: mode === m ? "rgba(16,185,129,0.2)" : "transparent", color: mode === m ? G : "rgba(255,255,255,0.4)", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          {/* Google button */}
          <button onClick={handleGoogle} disabled={loading}
            style={{ width: "100%", background: "#fff", border: "none", color: "#1a1a1a", fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "12px", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20 }}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "signup" && (
              <div>
                <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>USERNAME</label>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="your_username" required
                  style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", fontFamily: "inherit", fontSize: 15, padding: "11px 14px", outline: "none", boxSizing: "border-box" }} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>EMAIL</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", fontFamily: "inherit", fontSize: 15, padding: "11px 14px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>PASSWORD</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6}
                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", fontFamily: "inherit", fontSize: 15, padding: "11px 14px", outline: "none", boxSizing: "border-box" }} />
            </div>

            {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#f87171" }}>{error}</div>}
            {message && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: G }}>{message}</div>}

            <button type="submit" disabled={loading}
              style={{ background: G, border: "none", color: "#060d0a", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "13px", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 4 }}>
              {loading ? "Loading..." : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>
        </div>

        <button onClick={onBack} style={{ display: "block", margin: "20px auto 0", background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontFamily: "inherit", fontSize: 13, cursor: "pointer" }}>← Back to site</button>
      </div>
    </div>
  );
}
