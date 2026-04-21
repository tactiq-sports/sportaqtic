import { useState, useEffect } from "react";

const GROUPS = {
  A: ["USA", "Mexico", "Canada", "Uruguay"],
  B: ["Argentina", "Chile", "Ecuador", "Peru"],
  C: ["Brazil", "Colombia", "Paraguay", "Bolivia"],
  D: ["France", "Germany", "Portugal", "Belgium"],
  E: ["Spain", "England", "Netherlands", "Croatia"],
  F: ["Italy", "Switzerland", "Austria", "Denmark"],
  G: ["Morocco", "Senegal", "Nigeria", "Cameroon"],
  H: ["Japan", "South Korea", "Australia", "Iran"],
  I: ["Saudi Arabia", "Qatar", "Iraq", "Jordan"],
  J: ["South Africa", "Egypt", "Tunisia", "Algeria"],
  K: ["Mexico", "Honduras", "Costa Rica", "Panama"],
  L: ["New Zealand", "China", "Indonesia", "Thailand"],
};

const FLAGS = {
  USA: "🇺🇸", Mexico: "🇲🇽", Canada: "🇨🇦", Uruguay: "🇺🇾",
  Argentina: "🇦🇷", Chile: "🇨🇱", Ecuador: "🇪🇨", Peru: "🇵🇪",
  Brazil: "🇧🇷", Colombia: "🇨🇴", Paraguay: "🇵🇾", Bolivia: "🇧🇴",
  France: "🇫🇷", Germany: "🇩🇪", Portugal: "🇵🇹", Belgium: "🇧🇪",
  Spain: "🇪🇸", England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Netherlands: "🇳🇱", Croatia: "🇭🇷",
  Italy: "🇮🇹", Switzerland: "🇨🇭", Austria: "🇦🇹", Denmark: "🇩🇰",
  Morocco: "🇲🇦", Senegal: "🇸🇳", Nigeria: "🇳🇬", Cameroon: "🇨🇲",
  Japan: "🇯🇵", "South Korea": "🇰🇷", Australia: "🇦🇺", Iran: "🇮🇷",
  "Saudi Arabia": "🇸🇦", Qatar: "🇶🇦", Iraq: "🇮🇶", Jordan: "🇯🇴",
  "South Africa": "🇿🇦", Egypt: "🇪🇬", Tunisia: "🇹🇳", Algeria: "🇩🇿",
  Honduras: "🇭🇳", "Costa Rica": "🇨🇷", Panama: "🇵🇦",
  "New Zealand": "🇳🇿", China: "🇨🇳", Indonesia: "🇮🇩", Thailand: "🇹🇭",
};

function getMatches(teams) {
  const matches = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({ home: teams[i], away: teams[j], homeScore: null, awayScore: null });
    }
  }
  return matches;
}

function calcStandings(teams, matches) {
  const table = {};
  teams.forEach(t => table[t] = { team: t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });
  matches.forEach(({ home, away, homeScore, awayScore }) => {
    if (homeScore === null || awayScore === null) return;
    const h = table[home], a = table[away];
    h.p++; a.p++;
    h.gf += homeScore; h.ga += awayScore;
    a.gf += awayScore; a.ga += homeScore;
    if (homeScore > awayScore) { h.w++; h.pts += 3; a.l++; }
    else if (homeScore < awayScore) { a.w++; a.pts += 3; h.l++; }
    else { h.d++; h.pts++; a.d++; a.pts++; }
  });
  return Object.values(table).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf);
}

function ScoreInput({ value, onChange }) {
  return (
    <input
      type="number" min="0" max="20"
      value={value === null ? "" : value}
      onChange={e => onChange(e.target.value === "" ? null : parseInt(e.target.value))}
      style={{
        width: 44, textAlign: "center", background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6,
        color: "#fff", fontSize: 16, fontFamily: "inherit", padding: "4px 0",
        outline: "none", fontWeight: 700,
      }}
    />
  );
}

function GroupCard({ groupId, teams, onQualify }) {
  const [matches, setMatches] = useState(getMatches(teams));
  const [activeTab, setActiveTab] = useState("matches");
  const standings = calcStandings(teams, matches);
  const allPlayed = matches.every(m => m.homeScore !== null && m.awayScore !== null);

  useEffect(() => {
    if (allPlayed) onQualify(groupId, standings[0].team, standings[1].team);
  }, [matches]);

  function updateScore(idx, field, val) {
    setMatches(prev => prev.map((m, i) => i === idx ? { ...m, [field]: val } : m));
  }

  const qualifiedColor = (i) => i === 0 ? "#22c55e" : i === 1 ? "#3b82f6" : "transparent";

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", borderRadius: 16,
      border: "1px solid rgba(255,255,255,0.09)", overflow: "hidden",
      transition: "transform 0.2s", cursor: "default",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{
        background: "linear-gradient(135deg, #c9a84c 0%, #e8c96d 50%, #c9a84c 100%)",
        padding: "10px 16px", display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, color: "#1a1a2e", letterSpacing: 2 }}>
          GROUP {groupId}
        </span>
        {allPlayed && <span style={{ marginLeft: "auto", fontSize: 11, background: "#1a1a2e", color: "#c9a84c", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>COMPLETE</span>}
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {["matches", "table"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: "8px", background: activeTab === tab ? "rgba(201,168,76,0.15)" : "transparent",
            border: "none", color: activeTab === tab ? "#c9a84c" : "rgba(255,255,255,0.4)",
            fontFamily: "inherit", fontSize: 11, fontWeight: 700, letterSpacing: 1,
            textTransform: "uppercase", cursor: "pointer", borderBottom: activeTab === tab ? "2px solid #c9a84c" : "2px solid transparent",
          }}>{tab}</button>
        ))}
      </div>

      {activeTab === "matches" ? (
        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
          {matches.map((m, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 10px",
            }}>
              <span style={{ flex: 1, textAlign: "right", fontSize: 13, fontWeight: 600 }}>
                {FLAGS[m.home]} {m.home}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ScoreInput value={m.homeScore} onChange={v => updateScore(i, "homeScore", v)} />
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>–</span>
                <ScoreInput value={m.awayScore} onChange={v => updateScore(i, "awayScore", v)} />
              </div>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>
                {FLAGS[m.away]} {m.away}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "12px 14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto auto auto auto auto", gap: "4px 8px", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: 1, marginBottom: 6, paddingLeft: 28 }}>
            <span></span><span></span><span>P</span><span>W</span><span>D</span><span>L</span><span>GD</span><span>PTS</span>
          </div>
          {standings.map((s, i) => (
            <div key={s.team} style={{
              display: "grid", gridTemplateColumns: "auto 1fr auto auto auto auto auto auto",
              gap: "4px 8px", alignItems: "center", padding: "5px 0",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>
              <div style={{
                width: 4, height: 20, borderRadius: 2,
                background: qualifiedColor(i), marginRight: 4,
              }} />
              <span style={{ fontSize: 13, fontWeight: i < 2 ? 700 : 400, color: i < 2 ? "#fff" : "rgba(255,255,255,0.6)" }}>
                {FLAGS[s.team]} {s.team}
              </span>
              {[s.p, s.w, s.d, s.l, s.gf - s.ga, s.pts].map((v, j) => (
                <span key={j} style={{ fontSize: 12, textAlign: "center", color: j === 5 ? "#c9a84c" : "rgba(255,255,255,0.7)", fontWeight: j === 5 ? 700 : 400 }}>{v}</span>
              ))}
            </div>
          ))}
          <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 4, height: 12, background: "#22c55e", borderRadius: 2 }} />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>1st place</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 4, height: 12, background: "#3b82f6", borderRadius: 2 }} />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>2nd place (advance)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BracketSlot({ label, team, flag }) {
  return (
    <div style={{
      background: team ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.04)",
      border: `1px solid ${team ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 8, padding: "8px 12px", minWidth: 160,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 700, minWidth: 24 }}>{label}</span>
      {team ? (
        <span style={{ fontSize: 14, fontWeight: 700 }}>{flag} {team}</span>
      ) : (
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>TBD</span>
      )}
    </div>
  );
}

export default function App() {
  const [qualifiers, setQualifiers] = useState({});
  const [view, setView] = useState("groups");
  const [shareMsg, setShareMsg] = useState("");

  function handleQualify(groupId, first, second) {
    setQualifiers(prev => ({ ...prev, [groupId]: { first, second } }));
  }

  const groupKeys = Object.keys(GROUPS);
  const totalGroups = groupKeys.length;
  const completedGroups = Object.keys(qualifiers).length;

  function handleShare() {
    const lines = ["🏆 My World Cup 2026 Predictions!", ""];
    groupKeys.forEach(g => {
      if (qualifiers[g]) {
        lines.push(`Group ${g}: ${FLAGS[qualifiers[g].first]} ${qualifiers[g].first} | ${FLAGS[qualifiers[g].second]} ${qualifiers[g].second}`);
      }
    });
    const text = lines.join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setShareMsg("Copied to clipboard!");
      setTimeout(() => setShareMsg(""), 2500);
    });
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0d1a",
      backgroundImage: "radial-gradient(ellipse at 20% 20%, rgba(201,168,76,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.05) 0%, transparent 50%)",
      fontFamily: "'DM Sans', sans-serif",
      color: "#fff",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "20px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(13,13,26,0.95)", backdropFilter: "blur(12px)",
      }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, letterSpacing: 3, color: "#c9a84c", lineHeight: 1 }}>
            WORLD CUP 2026
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginTop: 2 }}>GROUP STAGE SIMULATOR</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontFamily: "'Bebas Neue', cursive", color: "#c9a84c" }}>{completedGroups}/{totalGroups}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>GROUPS DONE</div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {["groups", "bracket"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "8px 16px", borderRadius: 8, border: "1px solid",
                borderColor: view === v ? "#c9a84c" : "rgba(255,255,255,0.15)",
                background: view === v ? "rgba(201,168,76,0.15)" : "transparent",
                color: view === v ? "#c9a84c" : "rgba(255,255,255,0.5)",
                fontFamily: "inherit", fontSize: 12, fontWeight: 700, letterSpacing: 1,
                textTransform: "uppercase", cursor: "pointer",
              }}>{v}</button>
            ))}
            <button onClick={handleShare} style={{
              padding: "8px 16px", borderRadius: 8, border: "1px solid #c9a84c",
              background: "#c9a84c", color: "#0d0d1a",
              fontFamily: "inherit", fontSize: 12, fontWeight: 700, letterSpacing: 1,
              textTransform: "uppercase", cursor: "pointer",
            }}>
              {shareMsg || "📋 Share"}
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "rgba(255,255,255,0.05)" }}>
        <div style={{
          height: "100%", background: "linear-gradient(90deg, #c9a84c, #e8c96d)",
          width: `${(completedGroups / totalGroups) * 100}%`,
          transition: "width 0.5s ease",
        }} />
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>

        {view === "groups" ? (
          <>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 20, letterSpacing: 2, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                ENTER MATCH SCORES TO SIMULATE THE GROUP STAGE
              </h2>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 20,
            }}>
              {groupKeys.map(g => (
                <GroupCard key={g} groupId={g} teams={GROUPS[g]} onQualify={handleQualify} />
              ))}
            </div>
          </>
        ) : (
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, letterSpacing: 3, marginBottom: 24, color: "rgba(255,255,255,0.7)" }}>
              ROUND OF 32 — QUALIFIED TEAMS
            </h2>
            {completedGroups < totalGroups && (
              <div style={{
                background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: 10, padding: "12px 16px", marginBottom: 24, fontSize: 13,
                color: "rgba(201,168,76,0.8)",
              }}>
                ⚠️ Complete all {totalGroups} groups to see the full bracket. ({totalGroups - completedGroups} remaining)
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 12 }}>
              {groupKeys.map(g => {
                const q = qualifiers[g];
                return (
                  <div key={g} style={{
                    background: "rgba(255,255,255,0.03)", borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.07)", padding: "14px 16px",
                  }}>
                    <div style={{ fontSize: 11, color: "#c9a84c", fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>GROUP {g}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <BracketSlot label="1ST" team={q?.first} flag={FLAGS[q?.first]} />
                      <BracketSlot label="2ND" team={q?.second} flag={FLAGS[q?.second]} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
