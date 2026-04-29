import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const SCORE_CONFIG = {
  groupFirst: 2,
  groupSecond: 1,
  r16: 3,
  qf: 5,
  sf: 8,
  finalist: 10,
  champion: 15,
};

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function calcScore(predictions) {
  if (!predictions) return 0;
  let score = 0;
  // Group stage
  if (predictions.qualifiers) {
    Object.values(predictions.qualifiers).forEach(q => {
      if (q?.first) score += SCORE_CONFIG.groupFirst;
      if (q?.second) score += SCORE_CONFIG.groupSecond;
    });
  }
  return score;
}

function calcBracketScore(bracket) {
  if (!bracket?.winners) return 0;
  let score = 0;
  const { winners, rounds } = bracket;
  if (!rounds) return 0;
  rounds.r16?.forEach(m => { if (winners[m.id]) score += SCORE_CONFIG.r16; });
  rounds.qf?.forEach(m => { if (winners[m.id]) score += SCORE_CONFIG.qf; });
  rounds.sf?.forEach(m => { if (winners[m.id]) score += SCORE_CONFIG.sf; });
  if (rounds.final?.[0] && winners[rounds.final[0].id]) {
    score += SCORE_CONFIG.champion;
  }
  return score;
}

function Flag({ team, size = 14 }) {
  const FLAG_CODES = {
    "Mexico": "mx", "South Africa": "za", "South Korea": "kr", "Czechia": "cz",
    "Canada": "ca", "Bosnia and Herzegovina": "ba", "Qatar": "qa", "Switzerland": "ch",
    "Brazil": "br", "Morocco": "ma", "Haiti": "ht", "Scotland": "gb",
    "USA": "us", "Paraguay": "py", "Australia": "au", "Türkiye": "tr",
    "Germany": "de", "Curaçao": "cw", "Ivory Coast": "ci", "Ecuador": "ec",
    "Netherlands": "nl", "Japan": "jp", "Sweden": "se", "Tunisia": "tn",
    "Belgium": "be", "Egypt": "eg", "Iran": "ir", "New Zealand": "nz",
    "Spain": "es", "Cape Verde": "cv", "Saudi Arabia": "sa", "Uruguay": "uy",
    "France": "fr", "Senegal": "sn", "Iraq": "iq", "Norway": "no",
    "Argentina": "ar", "Algeria": "dz", "Austria": "at", "Jordan": "jo",
    "Portugal": "pt", "DR Congo": "cd", "Uzbekistan": "uz", "Colombia": "co",
    "England": "gb", "Croatia": "hr", "Ghana": "gh", "Panama": "pa",
  };
  const code = FLAG_CODES[team];
  if (!code) return null;
  return <img src={`https://flagcdn.com/32x24/${code}.png`} alt={team} style={{ width: Math.round(size * 1.5), height: size, borderRadius: 2, objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />;
}

export default function Leagues({ onBack, user }) {
  const [tab, setTab] = useState("my");
  const [myLeagues, setMyLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [createName, setCreateName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) loadMyLeagues();
    else setLoading(false);
  }, [user]);

  async function loadMyLeagues() {
    setLoading(true);
    try {
      const { data: memberships } = await supabase
        .from("league_members")
        .select("league_id")
        .eq("user_id", user.id);

      if (!memberships?.length) { setMyLeagues([]); setLoading(false); return; }

      const ids = memberships.map(m => m.league_id);
      const { data: leagues } = await supabase
        .from("leagues")
        .select("*")
        .in("id", ids);

      // Get member counts
      const leaguesWithCounts = await Promise.all((leagues || []).map(async league => {
        const { count } = await supabase
          .from("league_members")
          .select("*", { count: "exact", head: true })
          .eq("league_id", league.id);
        return { ...league, memberCount: count || 0 };
      }));

      setMyLeagues(leaguesWithCounts);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function loadLeaderboard(league) {
    setSelectedLeague(league);
    setLeaderboardLoading(true);
    try {
      const { data: members } = await supabase
        .from("league_members")
        .select("user_id, joined_at")
        .eq("league_id", league.id);

      if (!members?.length) { setLeaderboard([]); setLeaderboardLoading(false); return; }

      const userIds = members.map(m => m.user_id);

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, favourite_team")
        .in("id", userIds);

      const { data: predictions } = await supabase
        .from("predictions")
        .select("user_id, predictions, bracket")
        .in("user_id", userIds);

      const board = members.map(member => {
        const profile = profiles?.find(p => p.id === member.user_id);
        const pred = predictions?.find(p => p.user_id === member.user_id);
        const groupScore = calcScore(pred?.predictions);
        const bracketScore = calcBracketScore(pred?.bracket);
        const total = groupScore + bracketScore;
        const champion = pred?.bracket?.winners && pred?.bracket?.rounds?.final?.[0]
          ? pred.bracket.winners[pred.bracket.rounds.final[0].id]
          : pred?.predictions?.champion || null;
        return {
          userId: member.user_id,
          username: profile?.username || "Anonymous",
          favouriteTeam: profile?.favourite_team,
          groupScore,
          bracketScore,
          total,
          champion,
          isOwner: league.owner_id === member.user_id,
          joinedAt: member.joined_at,
        };
      });

      board.sort((a, b) => b.total - a.total);
      setLeaderboard(board);
    } catch (e) { console.error(e); }
    setLeaderboardLoading(false);
  }

  async function createLeague() {
    if (!createName.trim()) { showMsg("Enter a league name", "error"); return; }
    try {
      const code = generateCode();
      const { data, error } = await supabase
        .from("leagues")
        .insert({ name: createName.trim(), code, owner_id: user.id })
        .select()
        .single();
      if (error) throw error;
      await supabase.from("league_members").insert({ league_id: data.id, user_id: user.id });
      showMsg("League created!", "success");
      setCreateName("");
      loadMyLeagues();
      setTab("my");
    } catch (e) { showMsg("Error creating league", "error"); }
  }

  async function joinLeague() {
    if (!joinCode.trim()) { showMsg("Enter a league code", "error"); return; }
    try {
      const { data: league, error } = await supabase
        .from("leagues")
        .select("*")
        .eq("code", joinCode.trim().toUpperCase())
        .single();
      if (error || !league) { showMsg("League not found", "error"); return; }

      const { data: existing } = await supabase
        .from("league_members")
        .select("id")
        .eq("league_id", league.id)
        .eq("user_id", user.id)
        .single();

      if (existing) { showMsg("You're already in this league!", "error"); return; }

      await supabase.from("league_members").insert({ league_id: league.id, user_id: user.id });
      showMsg(`Joined "${league.name}"!`, "success");
      setJoinCode("");
      loadMyLeagues();
      setTab("my");
    } catch (e) { showMsg("Error joining league", "error"); }
  }

  async function leaveLeague(leagueId) {
    if (!window.confirm("Leave this league?")) return;
    await supabase.from("league_members").delete().eq("league_id", leagueId).eq("user_id", user.id);
    if (selectedLeague?.id === leagueId) setSelectedLeague(null);
    loadMyLeagues();
  }

  function showMsg(text, type) {
    setMsg(text); setMsgType(type);
    setTimeout(() => setMsg(""), 3000);
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const myUserId = user?.id;

  return (
    <div style={{ minHeight: "100vh", background: "#080812", fontFamily: "'DM Sans',sans-serif", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[{ top: "10%", left: "5%", w: 400, color: "rgba(16,185,129,0.04)" }, { top: "60%", left: "70%", w: 500, color: "rgba(201,168,76,0.03)" }].map((o, i) => (
          <div key={i} style={{ position: "absolute", top: o.top, left: o.left, width: o.w, height: o.w, borderRadius: "50%", background: `radial-gradient(circle,${o.color} 0%,transparent 70%)` }} />
        ))}
      </div>

      {/* Navbar */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 16px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, background: "rgba(8,8,18,0.92)", backdropFilter: "blur(16px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)", fontFamily: "inherit", fontSize: 12, padding: "5px 10px", borderRadius: 7, cursor: "pointer" }}>← Home</button>
          <div>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 20, letterSpacing: 3, color: "#10b981", lineHeight: 1 }}>PRIVATE LEAGUES</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: 2 }}>COMPETE WITH FRIENDS</div>
          </div>
        </div>
        {msg && (
          <div style={{ fontSize: 12, fontWeight: 700, color: msgType === "success" ? "#22c55e" : "#f87171", background: msgType === "success" ? "rgba(34,197,94,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${msgType === "success" ? "rgba(34,197,94,0.3)" : "rgba(248,113,113,0.3)"}`, borderRadius: 8, padding: "5px 12px" }}>
            {msg}
          </div>
        )}
      </div>

      {!user ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, padding: 24, position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 48 }}>🏆</div>
          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 28, letterSpacing: 3, color: "#10b981" }}>LOG IN TO USE LEAGUES</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", textAlign: "center", maxWidth: 300 }}>Create private leagues and compete with friends by predicting the World Cup</div>
          <button onClick={onBack} style={{ background: "#10b981", border: "none", color: "#060d0a", fontFamily: "inherit", fontSize: 14, fontWeight: 700, padding: "12px 28px", borderRadius: 10, cursor: "pointer" }}>Go to Login</button>
        </div>
      ) : (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px", position: "relative", zIndex: 1 }}>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {[
              { id: "my", label: "My Leagues" },
              { id: "create", label: "Create League" },
              { id: "join", label: "Join League" },
            ].map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setSelectedLeague(null); }}
                style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid", borderColor: tab === t.id ? "#10b981" : "rgba(255,255,255,0.12)", background: tab === t.id ? "rgba(16,185,129,0.14)" : "transparent", color: tab === t.id ? "#10b981" : "rgba(255,255,255,0.4)", fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* MY LEAGUES */}
          {tab === "my" && (
            <div>
              {loading ? (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 40 }}>Loading...</div>
              ) : myLeagues.length === 0 ? (
                <div style={{ textAlign: "center", padding: 60 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
                  <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 24, letterSpacing: 2, color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>NO LEAGUES YET</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.2)", marginBottom: 24 }}>Create a league and invite friends, or join one with a code</div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button onClick={() => setTab("create")} style={{ background: "#10b981", border: "none", color: "#060d0a", fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}>Create League</button>
                    <button onClick={() => setTab("join")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "inherit", fontSize: 13, fontWeight: 600, padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}>Join League</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: selectedLeague ? "1fr 2fr" : "1fr", gap: 16 }}>
                  {/* League list */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {myLeagues.map(league => (
                      <div key={league.id}
                        onClick={() => loadLeaderboard(league)}
                        style={{ background: selectedLeague?.id === league.id ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${selectedLeague?.id === league.id ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: 16, cursor: "pointer", transition: "all 0.15s" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>{league.name}</div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{league.memberCount} member{league.memberCount !== 1 ? "s" : ""}</div>
                          </div>
                          {league.owner_id === user.id && (
                            <span style={{ fontSize: 9, background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>OWNER</span>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Code:</span>
                            <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 16, color: "#10b981", letterSpacing: 2 }}>{league.code}</span>
                            <button onClick={e => { e.stopPropagation(); copyCode(league.code); }}
                              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", fontFamily: "inherit", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 5, cursor: "pointer" }}>
                              {copied ? "✓" : "COPY"}
                            </button>
                          </div>
                          <button onClick={e => { e.stopPropagation(); leaveLeague(league.id); }}
                            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontFamily: "inherit", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 5, cursor: "pointer" }}>
                            LEAVE
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Leaderboard */}
                  {selectedLeague && (
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <div>
                          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 22, letterSpacing: 2, color: "#10b981" }}>{selectedLeague.name}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Leaderboard · {leaderboard.length} members</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Invite code:</span>
                          <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 18, color: "#10b981", letterSpacing: 2 }}>{selectedLeague.code}</span>
                          <button onClick={() => copyCode(selectedLeague.code)}
                            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", fontFamily: "inherit", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 5, cursor: "pointer" }}>
                            {copied ? "✓ COPIED" : "COPY"}
                          </button>
                        </div>
                      </div>

                      {/* Score legend */}
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                        {[
                          { label: "Group 1st", pts: "+2" },
                          { label: "Group 2nd", pts: "+1" },
                          { label: "R16", pts: "+3" },
                          { label: "QF", pts: "+5" },
                          { label: "SF", pts: "+8" },
                          { label: "Final", pts: "+10" },
                          { label: "Champion", pts: "+15" },
                        ].map(s => (
                          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{s.label}</span>
                            <span style={{ fontSize: 9, color: "#10b981", fontWeight: 700 }}>{s.pts}</span>
                          </div>
                        ))}
                      </div>

                      {leaderboardLoading ? (
                        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 24 }}>Loading...</div>
                      ) : leaderboard.length === 0 ? (
                        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 24, fontSize: 13 }}>No members yet</div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {leaderboard.map((member, i) => (
                            <div key={member.userId} style={{
                              display: "flex", alignItems: "center", gap: 12,
                              background: member.userId === myUserId ? "rgba(16,185,129,0.08)" : i === 0 ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)",
                              border: `1px solid ${member.userId === myUserId ? "rgba(16,185,129,0.25)" : i === 0 ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.06)"}`,
                              borderRadius: 10, padding: "10px 14px",
                            }}>
                              {/* Rank */}
                              <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: i === 0 ? "rgba(201,168,76,0.2)" : i === 1 ? "rgba(160,160,160,0.15)" : i === 2 ? "rgba(180,100,50,0.15)" : "rgba(255,255,255,0.05)", fontFamily: "'Bebas Neue',cursive", fontSize: 14, color: i === 0 ? "#c9a84c" : i === 1 ? "#9ca3af" : i === 2 ? "#b46432" : "rgba(255,255,255,0.3)", flexShrink: 0 }}>
                                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                              </div>

                              {/* Avatar */}
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: member.userId === myUserId ? "#10b981" : "#c9a84c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#080812", flexShrink: 0 }}>
                                {member.username[0].toUpperCase()}
                              </div>

                              {/* Name + champion */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <span style={{ fontSize: 13, fontWeight: 700, color: member.userId === myUserId ? "#10b981" : "#fff" }}>{member.username}</span>
                                  {member.isOwner && <span style={{ fontSize: 8, color: "#10b981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10, padding: "1px 5px" }}>OWNER</span>}
                                  {member.userId === myUserId && <span style={{ fontSize: 8, color: "#10b981" }}>YOU</span>}
                                </div>
                                {member.champion && (
                                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Picks:</span>
                                    <Flag team={member.champion} size={10} />
                                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{member.champion}</span>
                                  </div>
                                )}
                              </div>

                              {/* Score breakdown */}
                              <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 22, color: i === 0 ? "#c9a84c" : member.userId === myUserId ? "#10b981" : "#fff", letterSpacing: 1, lineHeight: 1 }}>{member.total}</div>
                                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>pts</div>
                                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", marginTop: 2 }}>
                                  G:{member.groupScore} B:{member.bracketScore}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CREATE LEAGUE */}
          {tab === "create" && (
            <div style={{ maxWidth: 480 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 24 }}>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 22, letterSpacing: 2, color: "#10b981", marginBottom: 6 }}>CREATE A LEAGUE</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Give your league a name and share the invite code with friends.</div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>LEAGUE NAME</label>
                  <input
                    value={createName}
                    onChange={e => setCreateName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && createLeague()}
                    placeholder="e.g. The Lads, Work Predictions..."
                    style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff", fontFamily: "inherit", fontSize: 14, padding: "10px 14px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <button onClick={createLeague}
                  style={{ width: "100%", background: "#10b981", border: "none", color: "#060d0a", fontFamily: "inherit", fontSize: 14, fontWeight: 700, padding: "13px", borderRadius: 10, cursor: "pointer" }}>
                  Create League →
                </button>
              </div>

              <div style={{ marginTop: 20, padding: 16, background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>HOW IT WORKS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {["Create your league and get a 6-character invite code", "Share the code with friends — they join in seconds", "Everyone's predictions are scored automatically", "Leaderboard updates as the tournament progresses"].map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#10b981", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* JOIN LEAGUE */}
          {tab === "join" && (
            <div style={{ maxWidth: 480 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 24 }}>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 22, letterSpacing: 2, color: "#10b981", marginBottom: 6 }}>JOIN A LEAGUE</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Enter the 6-character invite code from your friend.</div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: 1, display: "block", marginBottom: 6 }}>INVITE CODE</label>
                  <input
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === "Enter" && joinLeague()}
                    placeholder="e.g. AB12CD"
                    maxLength={6}
                    style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff", fontFamily: "'Bebas Neue',cursive", fontSize: 24, letterSpacing: 6, padding: "10px 14px", outline: "none", boxSizing: "border-box", textAlign: "center" }}
                  />
                </div>
                <button onClick={joinLeague}
                  style={{ width: "100%", background: "#10b981", border: "none", color: "#060d0a", fontFamily: "inherit", fontSize: 14, fontWeight: 700, padding: "13px", borderRadius: 10, cursor: "pointer" }}>
                  Join League →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
