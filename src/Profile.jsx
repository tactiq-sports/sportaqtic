import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const G = "#10b981";

const FLAG_CODES = {
  "Mexico": "MX", "South Africa": "ZA", "South Korea": "KR", "Czechia": "CZ",
  "Canada": "CA", "Bosnia and Herzegovina": "BA", "Qatar": "QA", "Switzerland": "CH",
  "Brazil": "BR", "Morocco": "MA", "Haiti": "HT", "Scotland": "GB-SCT",
  "USA": "US", "Paraguay": "PY", "Australia": "AU", "Türkiye": "TR",
  "Germany": "DE", "Curaçao": "CW", "Ivory Coast": "CI", "Ecuador": "EC",
  "Netherlands": "NL", "Japan": "JP", "Sweden": "SE", "Tunisia": "TN",
  "Belgium": "BE", "Egypt": "EG", "Iran": "IR", "New Zealand": "NZ",
  "Spain": "ES", "Cape Verde": "CV", "Saudi Arabia": "SA", "Uruguay": "UY",
  "France": "FR", "Senegal": "SN", "Iraq": "IQ", "Norway": "NO",
  "Argentina": "AR", "Algeria": "DZ", "Austria": "AT", "Jordan": "JO",
  "Portugal": "PT", "DR Congo": "CD", "Uzbekistan": "UZ", "Colombia": "CO",
  "England": "GB-ENG", "Croatia": "HR", "Ghana": "GH", "Panama": "PA",
};

const ALL_TEAMS = Object.keys(FLAG_CODES);

function Flag({ team, size = 16 }) {
  const code = FLAG_CODES[team];
  if (!code) return null;
  return <img src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`} alt={team} style={{ width: Math.round(size * 1.5), height: size, borderRadius: 2, objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />;
}

export default function Profile({ onBack, onNavigate, user, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Settings state
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [favouriteTeam, setFavouriteTeam] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { onBack(); return; }
    loadProfile();
  }, [user]);

  async function loadProfile() {
    setLoading(true);
    const [{ data: prof }, { data: preds }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("predictions").select("predictions").eq("user_id", user.id).single(),
    ]);
    setProfile(prof);
    setPredictions(preds?.predictions || null);
    setNewUsername(prof?.username || "");
    setFavouriteTeam(prof?.favourite_team || "");
    setLoading(false);
  }

  async function saveSettings() {
    setSaving(true);
    setSaveMsg("");
    const updates = { username: newUsername, favourite_team: favouriteTeam };
    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
    if (!error) {
      if (newPassword && newPassword.length >= 6) {
        await supabase.auth.updateUser({ password: newPassword });
        setNewPassword("");
      }
      setSaveMsg("✓ Saved!");
      loadProfile();
    } else {
      setSaveMsg("Error: " + error.message);
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  }

  const groupsDone = predictions?.qualifiers ? Object.keys(predictions.qualifiers).length : 0;
  const joinDate = profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "";

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#060d0a", display: "flex", alignItems: "center", justifyContent: "center", color: G, fontFamily: "'Bebas Neue',cursive", fontSize: 24, letterSpacing: 3 }}>
      LOADING...
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#060d0a", color: "#fff", fontFamily: "'DM Sans',sans-serif", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        html,body{overflow-x:hidden;margin:0;padding:0;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
      `}</style>

      {/* Background */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(16,185,129,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.02) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "10%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,0.05) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "60%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,0.03) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(6,13,10,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(16,185,129,0.1)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)", fontFamily: "inherit", fontSize: 12, padding: "6px 12px", borderRadius: 7, cursor: "pointer" }}>← Home</button>
          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 22, letterSpacing: 3, display: "flex", alignItems: "flex-start" }}>
            <span style={{ color: "#fff" }}>SPOR</span>
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ color: "transparent" }}>T</span>
              <span style={{ position: "absolute", top: 0, left: 0, width: "50%", overflow: "hidden", color: "#fff", whiteSpace: "nowrap" }}>T</span>
              <span style={{ position: "absolute", top: 0, right: 0, width: "50%", overflow: "hidden", color: G, whiteSpace: "nowrap", direction: "rtl" }}>T</span>
            </span>
            <span style={{ color: G }}>ACTIQ</span>
          </div>
        </div>
        <button onClick={onLogout} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontFamily: "inherit", fontSize: 13, fontWeight: 500, padding: "7px 16px", borderRadius: 8, cursor: "pointer" }}>Log out</button>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

        {/* Profile header */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 36, flexWrap: "wrap" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${G}, #059669)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#060d0a", fontFamily: "'Bebas Neue',cursive", flexShrink: 0 }}>
            {(profile?.username || user?.email || "?")[0].toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 36, letterSpacing: 2, margin: "0 0 4px", color: "#fff" }}>
              {profile?.username || user?.email?.split("@")[0] || "User"}
            </h1>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
              {user?.email} · Joined {joinDate}
            </div>
          </div>
          {favouriteTeam && (
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10, padding: "8px 14px" }}>
              <Flag team={favouriteTeam} size={16} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{favouriteTeam}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Favourite</span>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 32 }}>
          {[
            { value: groupsDone, label: "Groups Done", max: "/12", color: G },
            { value: groupsDone === 12 ? "✓" : `${groupsDone}/12`, label: "Predictions", max: "", color: groupsDone === 12 ? "#22c55e" : G },
            { value: user?.app_metadata?.provider === "google" ? "Google" : "Email", label: "Sign-in Method", max: "", color: "rgba(255,255,255,0.6)" },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 36, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}<span style={{ fontSize: 16, color: "rgba(255,255,255,0.3)" }}>{s.max}</span></div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4 }}>
          {["overview", "predictions", "settings"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", background: activeTab === t ? "rgba(16,185,129,0.2)" : "transparent", color: activeTab === t ? G : "rgba(255,255,255,0.4)", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer", textTransform: "capitalize", transition: "all 0.15s" }}>
              {t}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 11, color: G, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>WORLD CUP 2026 PROGRESS</div>
              <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, marginBottom: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", background: `linear-gradient(90deg,${G},#34d399)`, width: `${(groupsDone / 12) * 100}%`, borderRadius: 4, transition: "width 0.5s ease" }} />
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{groupsDone} of 12 groups completed</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div onClick={() => onNavigate("simulator")} style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 14, padding: 20, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(16,185,129,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(16,185,129,0.06)"}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>⚽</div>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 18, letterSpacing: 2, color: G, marginBottom: 4 }}>SIMULATOR</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{groupsDone < 12 ? `${12 - groupsDone} groups remaining` : "All groups complete!"}</div>
              </div>
              <div onClick={() => onNavigate("bracket")} style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 14, padding: 20, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(16,185,129,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(16,185,129,0.06)"}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>🏆</div>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 18, letterSpacing: 2, color: G, marginBottom: 4 }}>BRACKET</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Build your knockout predictions</div>
              </div>
            </div>
          </div>
        )}

        {/* Predictions tab */}
        {activeTab === "predictions" && (
          <div>
            {!predictions?.qualifiers || Object.keys(predictions.qualifiers).length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⚽</div>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 24, letterSpacing: 2, marginBottom: 8 }}>NO PREDICTIONS YET</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Complete the group stage simulator and save your predictions</div>
                <button onClick={() => onNavigate("simulator")} style={{ background: G, border: "none", color: "#060d0a", fontFamily: "inherit", fontSize: 14, fontWeight: 700, padding: "12px 24px", borderRadius: 10, cursor: "pointer" }}>Go to Simulator →</button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
                {Object.entries(predictions.qualifiers).map(([group, q]) => (
                  <div key={group} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, color: G, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>GROUP {group}</div>
                    {["first", "second"].map((pos, i) => (
                      <div key={pos} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.12)", borderRadius: 8, marginBottom: i === 0 ? 6 : 0 }}>
                        <div style={{ width: 3, height: 14, borderRadius: 2, background: i === 0 ? "#22c55e" : "#3b82f6", flexShrink: 0 }} />
                        <Flag team={q[pos]} size={14} />
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{q[pos]}</span>
                        <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{i === 0 ? "1st" : "2nd"}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings tab */}
        {activeTab === "settings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 500 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 11, color: G, fontWeight: 700, letterSpacing: 2, marginBottom: 20 }}>ACCOUNT SETTINGS</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>USERNAME</label>
                  <input value={newUsername} onChange={e => setNewUsername(e.target.value)}
                    style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", fontFamily: "inherit", fontSize: 15, padding: "11px 14px", outline: "none", boxSizing: "border-box" }} />
                </div>

                <div>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>FAVOURITE TEAM</label>
                  <select value={favouriteTeam} onChange={e => setFavouriteTeam(e.target.value)}
                    style={{ width: "100%", background: "#1a2e1a", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: favouriteTeam ? "#fff" : "rgba(255,255,255,0.3)", fontFamily: "inherit", fontSize: 15, padding: "11px 14px", outline: "none", boxSizing: "border-box", cursor: "pointer" }}>
                    <option value="">Select your favourite team</option>
                    {ALL_TEAMS.sort().map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>NEW PASSWORD <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400 }}>(leave blank to keep current)</span></label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" minLength={6}
                    style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", fontFamily: "inherit", fontSize: 15, padding: "11px 14px", outline: "none", boxSizing: "border-box" }} />
                </div>

                {saveMsg && (
                  <div style={{ background: saveMsg.includes("Error") ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", border: `1px solid ${saveMsg.includes("Error") ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: saveMsg.includes("Error") ? "#f87171" : G }}>
                    {saveMsg}
                  </div>
                )}

                <button onClick={saveSettings} disabled={saving}
                  style={{ background: G, border: "none", color: "#060d0a", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "13px", borderRadius: 10, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 11, color: "#f87171", fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>DANGER ZONE</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Log out of your account on this device.</div>
              <button onClick={onLogout} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontFamily: "inherit", fontSize: 14, fontWeight: 600, padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}>Log out</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
