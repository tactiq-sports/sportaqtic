import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import ShareCard from "./ShareCard.jsx";

const GROUPS = {
  A: ["Mexico", "South Africa", "South Korea", "Czechia"],
  B: ["Canada", "Bosnia and Herzegovina", "Qatar", "Switzerland"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["USA", "Paraguay", "Australia", "Türkiye"],
  E: ["Germany", "Curaçao", "Ivory Coast", "Ecuador"],
  F: ["Netherlands", "Japan", "Sweden", "Tunisia"],
  G: ["Belgium", "Egypt", "Iran", "New Zealand"],
  H: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"],
  I: ["France", "Senegal", "Iraq", "Norway"],
  J: ["Argentina", "Algeria", "Austria", "Jordan"],
  K: ["Portugal", "DR Congo", "Uzbekistan", "Colombia"],
  L: ["England", "Croatia", "Ghana", "Panama"],
};

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

function Flag({ team, size = 16 }) {
  const code = FLAG_CODES[team];
  if (!code) return null;
  const w = Math.round(size * 1.5);
  return <img src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`} alt={team} style={{ width: w, height: size, borderRadius: 2, objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />;
}

function Logo({ size = 22 }) {
  return (
    <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: size, letterSpacing: 3, display: "flex", alignItems: "flex-start", lineHeight: 1 }}>
      <span style={{ color: "#fff" }}>SPOR</span>
      <span style={{ position: "relative", display: "inline-block" }}>
        <span style={{ color: "transparent" }}>T</span>
        <span style={{ position: "absolute", top: 0, left: 0, width: "50%", overflow: "hidden", color: "#fff", whiteSpace: "nowrap" }}>T</span>
        <span style={{ position: "absolute", top: 0, right: 0, width: "50%", overflow: "hidden", color: "#c9a84c", whiteSpace: "nowrap", direction: "rtl" }}>T</span>
      </span>
      <span style={{ color: "#c9a84c" }}>ACTIQ</span>
    </div>
  );
}

function FootballBackground() {
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const balls = [];
    const count = window.innerWidth < 768 ? 8 : 16;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      const size = 16 + Math.random() * 28;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const dur = 12 + Math.random() * 20;
      const delay = -Math.random() * 20;
      const driftX = (Math.random() - 0.5) * 120;
      const driftY = (Math.random() - 0.5) * 120;
      const rotateDir = Math.random() > 0.5 ? 360 : -360;
      el.style.cssText = `position:absolute;left:${x}%;top:${y}%;font-size:${size}px;opacity:${0.07 + Math.random() * 0.12};animation:simball${i} ${dur}s ${delay}s ease-in-out infinite;pointer-events:none;user-select:none;`;
      el.textContent = "⚽";
      const styleEl = document.createElement("style");
      styleEl.textContent = `@keyframes simball${i}{0%{transform:translate(0px,0px) rotate(0deg);}25%{transform:translate(${driftX * .4}px,${driftY * .4}px) rotate(${rotateDir * .25}deg);}50%{transform:translate(${driftX}px,${driftY * .6}px) rotate(${rotateDir * .5}deg);}75%{transform:translate(${driftX * .6}px,${driftY}px) rotate(${rotateDir * .75}deg);}100%{transform:translate(0px,0px) rotate(${rotateDir}deg);}}`;
      document.head.appendChild(styleEl);
      container.appendChild(el);
      balls.push({ el, styleEl });
    }
    return () => { balls.forEach(({ el, styleEl }) => { el.remove(); styleEl.remove(); }); };
  }, []);
  return (
    <div ref={containerRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {[
        { top: "10%", left: "5%", size: 400, color: "rgba(201,168,76,0.05)" },
        { top: "60%", left: "70%", size: 500, color: "rgba(59,130,246,0.04)" },
        { top: "30%", left: "85%", size: 300, color: "rgba(201,168,76,0.04)" },
      ].map((o, i) => (
        <div key={i} style={{ position: "absolute", top: o.top, left: o.left, width: o.size, height: o.size, borderRadius: "50%", background: `radial-gradient(circle,${o.color} 0%,transparent 70%)` }} />
      ))}
    </div>
  );
}

function getMatches(teams) {
  const m = [];
  for (let i = 0; i < teams.length; i++)
    for (let j = i + 1; j < teams.length; j++)
      m.push({ home: teams[i], away: teams[j], homeScore: null, awayScore: null });
  return m;
}

function calcStandings(teams, matches) {
  const t = {};
  teams.forEach(n => t[n] = { team: n, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });
  matches.forEach(({ home, away, homeScore, awayScore }) => {
    if (homeScore === null || awayScore === null) return;
    const h = t[home], a = t[away];
    h.p++; a.p++; h.gf += homeScore; h.ga += awayScore; a.gf += awayScore; a.ga += homeScore;
    if (homeScore > awayScore) { h.w++; h.pts += 3; a.l++; }
    else if (homeScore < awayScore) { a.w++; a.pts += 3; h.l++; }
    else { h.d++; h.pts++; a.d++; a.pts++; }
  });
  return Object.values(t).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf);
}

function ScoreInput({ value, onChange }) {
  return (
    <input type="number" min="0" max="20"
      value={value === null ? "" : value}
      onChange={e => onChange(e.target.value === "" ? null : Math.max(0, parseInt(e.target.value) || 0))}
      style={{ width: 36, textAlign: "center", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 6, color: "#fff", fontSize: 14, fontFamily: "inherit", padding: "5px 0", outline: "none", fontWeight: 700 }}
    />
  );
}

function GroupCard({ groupId, teams, onQualify, onMatchesChange, savedMatches }) {
  const [matches, setMatches] = useState(savedMatches || getMatches(teams));
  const [tab, setTab] = useState("matches");

  useEffect(() => {
    if (savedMatches) setMatches(savedMatches);
  }, [savedMatches]);

  const standings = calcStandings(teams, matches);
  const allPlayed = matches.every(m => m.homeScore !== null && m.awayScore !== null);

  useEffect(() => {
    if (allPlayed) onQualify(groupId, standings[0].team, standings[1].team);
  }, [matches]);

  function upd(i, f, v) {
    const updated = matches.map((m, j) => j === i ? { ...m, [f]: v } : m);
    setMatches(updated);
    onMatchesChange(groupId, updated);
  }

  return (
    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.09)", overflow: "hidden", position: "relative", zIndex: 1, transition: "transform 0.2s, box-shadow 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 40px rgba(201,168,76,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ background: "linear-gradient(135deg,#b8922a,#e8c96d,#b8922a)", padding: "9px 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 19, color: "#0d0d1a", letterSpacing: 2 }}>GROUP {groupId}</span>
        <div style={{ display: "flex", gap: 3, marginLeft: 4 }}>{teams.map(t => <Flag key={t} team={t} size={13} />)}</div>
        {allPlayed && <span style={{ marginLeft: "auto", fontSize: 9, background: "#0d0d1a", color: "#c9a84c", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>✓ DONE</span>}
      </div>
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        {["matches", "table"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "7px", background: tab === t ? "rgba(201,168,76,0.1)" : "transparent", border: "none", color: tab === t ? "#c9a84c" : "rgba(255,255,255,0.3)", fontFamily: "inherit", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", borderBottom: tab === t ? "2px solid #c9a84c" : "2px solid transparent" }}>{t}</button>
        ))}
      </div>
      {tab === "matches" ? (
        <div style={{ padding: "10px 10px", display: "flex", flexDirection: "column", gap: 5 }}>
          {matches.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.03)", borderRadius: 7, padding: "6px 8px" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, minWidth: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.home}</span>
                <Flag team={m.home} size={12} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                <ScoreInput value={m.homeScore} onChange={v => upd(i, "homeScore", v)} />
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10 }}>—</span>
                <ScoreInput value={m.awayScore} onChange={v => upd(i, "awayScore", v)} />
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4, minWidth: 0 }}>
                <Flag team={m.away} size={12} />
                <span style={{ fontSize: 11, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.away}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "8px 10px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "12px 1fr 22px 22px 22px 22px 28px 28px", gap: "2px 4px", fontSize: 8, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: 1, marginBottom: 3 }}>
            <span /><span /><span style={{ textAlign: "center" }}>P</span><span style={{ textAlign: "center" }}>W</span><span style={{ textAlign: "center" }}>D</span><span style={{ textAlign: "center" }}>L</span><span style={{ textAlign: "center" }}>GD</span><span style={{ textAlign: "center" }}>PTS</span>
          </div>
          {standings.map((s, i) => (
            <div key={s.team} style={{ display: "grid", gridTemplateColumns: "12px 1fr 22px 22px 22px 22px 28px 28px", gap: "2px 4px", alignItems: "center", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ width: 3, height: 14, borderRadius: 2, background: i === 0 ? "#22c55e" : i === 1 ? "#3b82f6" : "rgba(255,255,255,0.08)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 0 }}>
                <Flag team={s.team} size={11} />
                <span style={{ fontSize: 10, fontWeight: i < 2 ? 700 : 400, color: i < 2 ? "#fff" : "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.team}</span>
              </div>
              {[s.p, s.w, s.d, s.l, s.gf - s.ga, s.pts].map((v, j) => (
                <span key={j} style={{ fontSize: 10, textAlign: "center", color: j === 5 ? "#c9a84c" : "rgba(255,255,255,0.6)", fontWeight: j === 5 ? 700 : 400 }}>{v}</span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Simulator({ onBack, onQualify }) {
  const [qualifiers, setQualifiers] = useState({});
  const [allMatches, setAllMatches] = useState({});
  const [view, setView] = useState("groups");
  const [shareMsg, setShareMsg] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [champion, setChampion] = useState("");
  const groupKeys = Object.keys(GROUPS);
  const done = Object.keys(qualifiers).length;

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const { data } = await supabase
          .from("predictions")
          .select("predictions")
          .eq("user_id", u.id)
          .single();
        if (data?.predictions) {
          const saved = data.predictions;
          if (saved.qualifiers) {
            setQualifiers(saved.qualifiers);
            if (onQualify) onQualify(saved.qualifiers);
          }
          if (saved.matches) setAllMatches(saved.matches);
          if (saved.champion) setChampion(saved.champion);
        }
      }
      setLoaded(true);
    });
  }, []);

  async function savePredictions() {
    if (!user) return;
    setSaveMsg("Saving...");
    const { error } = await supabase.from("predictions").upsert({
      user_id: user.id,
      predictions: { qualifiers, matches: allMatches, champion },
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    if (!error) {
      setSaveMsg("✓ Saved!");
      setTimeout(() => setSaveMsg(""), 3000);
    } else {
      setSaveMsg("Error");
      setTimeout(() => setSaveMsg(""), 3000);
    }
  }

  function handleQualify(id, first, second) {
    const updated = { ...qualifiers, [id]: { first, second } };
    setQualifiers(updated);
    if (onQualify) onQualify(updated);
  }

  function handleMatchesChange(groupId, matches) {
    setAllMatches(prev => ({ ...prev, [groupId]: matches }));
  }

  function handleShare() {
    const lines = ["🏆 My FIFA World Cup 2026 Predictions!\n", ...groupKeys.filter(g => qualifiers[g]).map(g => `Group ${g}: ${qualifiers[g].first} | ${qualifiers[g].second}`)];
    if (champion) lines.push(`\n🥇 My Champion: ${champion}`);
    lines.push("\nMake your predictions at getsportactiq.com");
    navigator.clipboard.writeText(lines.join("\n")).then(() => { setShareMsg("Copied! ✓"); setTimeout(() => setShareMsg(""), 2500); });
  }

  if (!loaded) return (
    <div style={{ minHeight: "100vh", background: "#080812", display: "flex", alignItems: "center", justifyContent: "center", color: "#c9a84c", fontFamily: "'Bebas Neue',cursive", fontSize: 24, letterSpacing: 3 }}>
      LOADING...
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080812", fontFamily: "'DM Sans',sans-serif", color: "#fff", position: "relative", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <FootballBackground />

      <style>{`
        .sim-groups{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:14px;}
        .sim-bracket{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:10px;}
        @media(max-width:768px){
          .sim-groups{grid-template-columns:1fr!important;}
          .sim-bracket{grid-template-columns:1fr!important;}
        }
      `}</style>

      {/* Navbar */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 16px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, background: "rgba(8,8,18,0.92)", backdropFilter: "blur(16px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)", fontFamily: "inherit", fontSize: 12, padding: "5px 10px", borderRadius: 7, cursor: "pointer", whiteSpace: "nowrap" }}>← Home</button>
          <Logo size={18} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {saveMsg && <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700 }}>{saveMsg}</span>}
          <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 16, color: "#c9a84c" }}>{done}/12</span>
          {["groups", "bracket"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid", borderColor: view === v ? "#c9a84c" : "rgba(255,255,255,0.12)", background: view === v ? "rgba(201,168,76,0.14)" : "transparent", color: view === v ? "#c9a84c" : "rgba(255,255,255,0.4)", fontFamily: "inherit", fontSize: 9, fontWeight: 700, textTransform: "uppercase", cursor: "pointer", letterSpacing: 1 }}>{v}</button>
          ))}
          {user && (
            <button onClick={savePredictions} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #22c55e", background: "rgba(34,197,94,0.15)", color: "#22c55e", fontFamily: "inherit", fontSize: 9, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>SAVE</button>
          )}
          <button onClick={() => setShowShareCard(true)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #c9a84c", background: "#c9a84c", color: "#080812", fontFamily: "inherit", fontSize: 9, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>SHARE 🏆</button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: "rgba(255,255,255,0.05)", position: "relative", zIndex: 1 }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg,#c9a84c,#e8c96d)", width: `${(done / 12) * 100}%`, transition: "width 0.5s ease" }} />
      </div>

      {/* Champion picker */}
      {done > 0 && (
        <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: "10px 16px", margin: "12px 14px 0", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: 13, color: "rgba(201,168,76,0.8)" }}>🏆 Who wins the World Cup?</span>
          <select value={champion} onChange={e => setChampion(e.target.value)}
            style={{ background: "#1a1a2e", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 7, color: champion ? "#fff" : "rgba(255,255,255,0.4)", fontFamily: "inherit", fontSize: 12, padding: "5px 10px", cursor: "pointer", outline: "none" }}>
            <option value="">Pick your champion...</option>
            {Object.keys(qualifiers).sort().map(g =>
              qualifiers[g] && [qualifiers[g].first, qualifiers[g].second].map(team => (
                <option key={team} value={team}>{team}</option>
              ))
            )}
          </select>
        </div>
      )}

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "20px 14px", position: "relative", zIndex: 1 }}>
        {!user && (
          <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: "11px 16px", marginBottom: 14, fontSize: 13, color: "rgba(201,168,76,0.8)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span>💡 Log in to save your predictions</span>
            <button onClick={onBack} style={{ background: "#c9a84c", border: "none", color: "#080812", fontFamily: "inherit", fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 6, cursor: "pointer" }}>Log in</button>
          </div>
        )}

        {view === "groups" && (
          <div style={{ background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, padding: "11px 16px", marginBottom: 14, fontSize: 13, color: "rgba(147,197,253,0.8)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span>🏆 Ready for the knockout stage? You can skip ahead even with incomplete groups</span>
            <button onClick={() => setView("bracket")} style={{ background: "rgba(59,130,246,0.3)", border: "1px solid rgba(59,130,246,0.4)", color: "#93c5fd", fontFamily: "inherit", fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 6, cursor: "pointer" }}>Go to Bracket →</button>
          </div>
        )}

        {view === "groups" ? (
          <div className="sim-groups">
            {groupKeys.map(g => (
              <GroupCard
                key={g}
                groupId={g}
                teams={GROUPS[g]}
                onQualify={handleQualify}
                onMatchesChange={handleMatchesChange}
                savedMatches={allMatches[g]}
              />
            ))}
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 22, letterSpacing: 3, margin: 0 }}>ROUND OF 32 — QUALIFIERS</h2>
              <button onClick={() => setView("groups")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", fontFamily: "inherit", fontSize: 12, padding: "6px 14px", borderRadius: 7, cursor: "pointer" }}>← Back to Groups</button>
            </div>
            {done < 12 && (
              <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "rgba(201,168,76,0.8)" }}>
                ⚠️ {12 - done} group{12 - done !== 1 ? "s" : ""} incomplete — those slots show as TBD
              </div>
            )}
            <div className="sim-bracket">
              {groupKeys.map(g => {
                const q = qualifiers[g];
                return (
                  <div key={g} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, border: `1px solid ${q ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.07)"}`, padding: "12px 14px" }}>
                    <div style={{ fontSize: 9, color: "#c9a84c", fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>GROUP {g}</div>
                    {["first", "second"].map((pos, i) => (
                      <div key={pos} style={{ display: "flex", alignItems: "center", gap: 7, background: q ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.03)", border: `1px solid ${q ? "rgba(201,168,76,0.18)" : "rgba(255,255,255,0.06)"}`, borderRadius: 8, padding: "6px 10px", marginBottom: i === 0 ? 4 : 0 }}>
                        <div style={{ width: 3, height: 13, borderRadius: 2, background: i === 0 ? "#22c55e" : "#3b82f6", flexShrink: 0 }} />
                        {q ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Flag team={q[pos]} size={13} />
                            <span style={{ fontSize: 13, fontWeight: 700 }}>{q[pos]}</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>TBD — complete group {g}</span>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showShareCard && (
        <ShareCard
          qualifiers={qualifiers}
          champion={champion}
          onClose={() => setShowShareCard(false)}
        />
      )}
    </div>
  );
}
