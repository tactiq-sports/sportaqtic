import { useState, useEffect, useRef } from "react";

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
  return (
    <img
      src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`}
      alt={team}
      style={{ width: Math.round(size * 1.5), height: size, borderRadius: 2, objectFit: "cover", flexShrink: 0 }}
      onError={e => { e.target.style.display = "none"; }}
    />
  );
}

function Logo({ size = 22 }) {
  return (
    <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: size, letterSpacing: 3, display: "flex", alignItems: "center", lineHeight: 1 }}>
      <span style={{ color: "#fff" }}>SPOR</span>
      <svg width={size * 0.62} height={size} viewBox="0 0 20 32" style={{ display: "inline-block", verticalAlign: "top", margin: "0 0px" }}>
        <defs>
          <clipPath id="left-sim">
            <rect x="0" y="0" width="10" height="32" />
          </clipPath>
          <clipPath id="right-sim">
            <rect x="10" y="0" width="10" height="32" />
          </clipPath>
        </defs>
        <text fontFamily="'Bebas Neue',cursive" fontSize="32" letterSpacing="0" clipPath="url(#left-sim)" fill="#ffffff" x="0" y="28">T</text>
        <text fontFamily="'Bebas Neue',cursive" fontSize="32" letterSpacing="0" clipPath="url(#right-sim)" fill="#c9a84c" x="0" y="28">T</text>
      </svg>
      <span style={{ color: "#c9a84c" }}>ACTIQ</span>
    </div>
  );
}

function ParticleBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    const resize = () => { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; };
    window.addEventListener("resize", resize);
    const orbs = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H, r: 150 + Math.random() * 200,
      dx: (Math.random() - 0.5) * 0.25, dy: (Math.random() - 0.5) * 0.25,
      hue: i % 2 === 0 ? 42 : 215, alpha: 0.035 + Math.random() * 0.03,
    }));
    const dots = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: 0.8 + Math.random() * 1.8,
      dx: (Math.random() - 0.5) * 0.35, dy: -0.15 - Math.random() * 0.35,
      alpha: 0.08 + Math.random() * 0.35,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      orbs.forEach(o => {
        o.x += o.dx; o.y += o.dy;
        if (o.x < -o.r) o.x = W + o.r; if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r; if (o.y > H + o.r) o.y = -o.r;
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, `hsla(${o.hue},75%,55%,${o.alpha})`);
        g.addColorStop(1, `hsla(${o.hue},75%,55%,0)`);
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });
      dots.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.alpha})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
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
      style={{ width: 40, textAlign: "center", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 6, color: "#fff", fontSize: 15, fontFamily: "inherit", padding: "5px 0", outline: "none", fontWeight: 700 }}
    />
  );
}

function GroupCard({ groupId, teams, onQualify }) {
  const [matches, setMatches] = useState(getMatches(teams));
  const [tab, setTab] = useState("matches");
  const standings = calcStandings(teams, matches);
  const allPlayed = matches.every(m => m.homeScore !== null && m.awayScore !== null);
  useEffect(() => { if (allPlayed) onQualify(groupId, standings[0].team, standings[1].team); }, [matches]);
  const upd = (i, f, v) => setMatches(p => p.map((m, j) => j === i ? { ...m, [f]: v } : m));

  return (
    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.09)", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s", position: "relative", zIndex: 1 }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 40px rgba(201,168,76,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ background: "linear-gradient(135deg,#b8922a,#e8c96d,#b8922a)", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 21, color: "#0d0d1a", letterSpacing: 2 }}>GROUP {groupId}</span>
        <div style={{ display: "flex", gap: 4, marginLeft: 4 }}>
          {teams.map(t => <Flag key={t} team={t} size={14} />)}
        </div>
        {allPlayed && <span style={{ marginLeft: "auto", fontSize: 10, background: "#0d0d1a", color: "#c9a84c", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>✓ DONE</span>}
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        {["matches", "table"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "7px", background: tab === t ? "rgba(201,168,76,0.1)" : "transparent", border: "none", color: tab === t ? "#c9a84c" : "rgba(255,255,255,0.3)", fontFamily: "inherit", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", borderBottom: tab === t ? "2px solid #c9a84c" : "2px solid transparent" }}>{t}</button>
        ))}
      </div>

      {tab === "matches" ? (
        <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
          {matches.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "7px 8px" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 5, overflow: "hidden" }}>
                <span style={{ fontSize: 11, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.home}</span>
                <Flag team={m.home} size={13} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <ScoreInput value={m.homeScore} onChange={v => upd(i, "homeScore", v)} />
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10 }}>—</span>
                <ScoreInput value={m.awayScore} onChange={v => upd(i, "awayScore", v)} />
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 5, overflow: "hidden" }}>
                <Flag team={m.away} size={13} />
                <span style={{ fontSize: 11, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.away}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "10px 12px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "14px 1fr 24px 24px 24px 24px 30px 30px", gap: "2px 5px", fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>
            <span /><span /><span style={{ textAlign: "center" }}>P</span><span style={{ textAlign: "center" }}>W</span><span style={{ textAlign: "center" }}>D</span><span style={{ textAlign: "center" }}>L</span><span style={{ textAlign: "center" }}>GD</span><span style={{ textAlign: "center" }}>PTS</span>
          </div>
          {standings.map((s, i) => (
            <div key={s.team} style={{ display: "grid", gridTemplateColumns: "14px 1fr 24px 24px 24px 24px 30px 30px", gap: "2px 5px", alignItems: "center", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ width: 3, height: 16, borderRadius: 2, background: i === 0 ? "#22c55e" : i === 1 ? "#3b82f6" : "rgba(255,255,255,0.08)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 5, overflow: "hidden" }}>
                <Flag team={s.team} size={12} />
                <span style={{ fontSize: 11, fontWeight: i < 2 ? 700 : 400, color: i < 2 ? "#fff" : "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.team}</span>
              </div>
              {[s.p, s.w, s.d, s.l, s.gf - s.ga, s.pts].map((v, j) => (
                <span key={j} style={{ fontSize: 11, textAlign: "center", color: j === 5 ? "#c9a84c" : "rgba(255,255,255,0.6)", fontWeight: j === 5 ? 700 : 400 }}>{v}</span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Simulator({ onBack }) {
  const [qualifiers, setQualifiers] = useState({});
  const [view, setView] = useState("groups");
  const [shareMsg, setShareMsg] = useState("");
  const groupKeys = Object.keys(GROUPS);
  const done = Object.keys(qualifiers).length;

  function handleShare() {
    const lines = ["🏆 My FIFA World Cup 2026 Predictions!\n", ...groupKeys.filter(g => qualifiers[g]).map(g => `Group ${g}: ${qualifiers[g].first} | ${qualifiers[g].second}`)];
    navigator.clipboard.writeText(lines.join("\n")).then(() => { setShareMsg("Copied! ✓"); setTimeout(() => setShareMsg(""), 2500); });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080812", fontFamily: "'DM Sans',sans-serif", color: "#fff", position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <ParticleBackground />

      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, background: "rgba(8,8,18,0.92)", backdropFilter: "blur(16px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)", fontFamily: "inherit", fontSize: 12, padding: "6px 12px", borderRadius: 7, cursor: "pointer" }}>← Home</button>
          <Logo />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 18, color: "#c9a84c", marginRight: 6 }}>{done}/12</span>
          {["groups", "bracket"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid", borderColor: view === v ? "#c9a84c" : "rgba(255,255,255,0.12)", background: view === v ? "rgba(201,168,76,0.14)" : "transparent", color: view === v ? "#c9a84c" : "rgba(255,255,255,0.4)", fontFamily: "inherit", fontSize: 10, fontWeight: 700, textTransform: "uppercase", cursor: "pointer", letterSpacing: 1 }}>{v}</button>
          ))}
          <button onClick={handleShare} style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid #c9a84c", background: "#c9a84c", color: "#080812", fontFamily: "inherit", fontSize: 10, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>{shareMsg || "SHARE"}</button>
        </div>
      </div>

      <div style={{ height: 2, background: "rgba(255,255,255,0.05)", position: "relative", zIndex: 1 }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg,#c9a84c,#e8c96d)", width: `${(done / 12) * 100}%`, transition: "width 0.5s ease" }} />
      </div>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "24px 18px", position: "relative", zIndex: 1 }}>
        {view === "groups" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))", gap: 14 }}>
            {groupKeys.map(g => (
              <GroupCard key={g} groupId={g} teams={GROUPS[g]} onQualify={(id, f, s) => setQualifiers(p => ({ ...p, [id]: { first: f, second: s } }))} />
            ))}
          </div>
        ) : (
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 26, letterSpacing: 3, marginBottom: 20 }}>ROUND OF 32 — QUALIFIERS</h2>
            {done < 12 && <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: "11px 15px", marginBottom: 18, fontSize: 13, color: "rgba(201,168,76,0.8)" }}>⚠️ {12 - done} group{12 - done !== 1 ? "s" : ""} still remaining</div>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))", gap: 10 }}>
              {groupKeys.map(g => {
                const q = qualifiers[g];
                return (
                  <div key={g} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, border: `1px solid ${q ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.07)"}`, padding: "13px 15px" }}>
                    <div style={{ fontSize: 10, color: "#c9a84c", fontWeight: 700, letterSpacing: 2, marginBottom: 9 }}>GROUP {g}</div>
                    {["first", "second"].map((pos, i) => (
                      <div key={pos} style={{ display: "flex", alignItems: "center", gap: 8, background: q ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.03)", border: `1px solid ${q ? "rgba(201,168,76,0.18)" : "rgba(255,255,255,0.06)"}`, borderRadius: 8, padding: "7px 11px", marginBottom: i === 0 ? 5 : 0 }}>
                        <div style={{ width: 3, height: 14, borderRadius: 2, background: i === 0 ? "#22c55e" : "#3b82f6", flexShrink: 0 }} />
                        {q ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <Flag team={q[pos]} size={14} />
                            <span style={{ fontSize: 14, fontWeight: 700 }}>{q[pos]}</span>
                          </div>
                        ) : <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>TBD</span>}
                      </div>
                    ))}
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
