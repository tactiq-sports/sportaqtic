import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["World Cup", "Basketball", "Fantasy", "Analytics"];
const G = "#10b981";
const LAUNCH_DATE = new Date("2026-06-11T15:00:00Z");

const FLAG_CODES = {
  "France": "FR", "Brazil": "BR", "Spain": "ES", "Argentina": "AR",
  "England": "GB-ENG", "Germany": "DE", "Portugal": "PT", "Netherlands": "NL",
  "USA": "US", "Mexico": "MX", "Canada": "CA", "Morocco": "MA",
  "Japan": "JP", "South Korea": "KR", "Senegal": "SN", "Uruguay": "UY",
  "Croatia": "HR", "Belgium": "BE", "Switzerland": "CH", "Norway": "NO",
  "Austria": "AT", "Colombia": "CO", "Ecuador": "EC", "Australia": "AU",
  "Türkiye": "TR", "Sweden": "SE",
};

const ALL_TEAMS = Object.keys(FLAG_CODES);

function Flag({ team, size = 16 }) {
  const code = FLAG_CODES[team];
  if (!code) return null;
  return <img src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`} alt={team} style={{ width: Math.round(size * 1.5), height: size, borderRadius: 2, objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />;
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
    const orbs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H, r: 200 + Math.random() * 300,
      dx: (Math.random() - 0.5) * 0.2, dy: (Math.random() - 0.5) * 0.2,
      hue: i % 3 === 0 ? 152 : i % 3 === 1 ? 160 : 140, alpha: 0.03 + Math.random() * 0.04,
    }));
    const dots = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: 0.5 + Math.random() * 1.5,
      dx: (Math.random() - 0.5) * 0.3, dy: -0.1 - Math.random() * 0.3, alpha: 0.05 + Math.random() * 0.25,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      orbs.forEach(o => {
        o.x += o.dx; o.y += o.dy;
        if (o.x < -o.r) o.x = W + o.r; if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r; if (o.y > H + o.r) o.y = -o.r;
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, `hsla(${o.hue},70%,45%,${o.alpha})`);
        g.addColorStop(1, `hsla(${o.hue},70%,45%,0)`);
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });
      dots.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,185,129,${p.alpha})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

function useCountdown() {
  const calc = () => {
    const diff = LAUNCH_DATE - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc());
  useEffect(() => { const t = setInterval(() => setTime(calc()), 1000); return () => clearInterval(t); }, []);
  return time;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
}

const FEATURES = [
  { icon: "⚽", title: "Group Stage Simulator", desc: "Predict every match across all 12 groups. Standings update live as you enter scores.", tag: "Live now", tagColor: G, link: true },
  { icon: "🏆", title: "Knockout Bracket", desc: "Pick winners round by round from the Round of 32 all the way to the Final.", tag: "Coming soon", tagColor: "#4b5563", link: false },
  { icon: "🤖", title: "AI Match Previews", desc: "AI-generated tactical breakdowns before every game. Who has the edge and why.", tag: "Coming soon", tagColor: "#4b5563", link: false },
  { icon: "👥", title: "Private Prediction Leagues", desc: "Compete with friends. Create a private league, share your link, see who predicts best.", tag: "Premium", tagColor: G, link: false },
  { icon: "📊", title: "Player Stats Tracker", desc: "Deep dive into every player's tournament stats. Goals, assists, ratings and more.", tag: "Coming soon", tagColor: "#4b5563", link: false },
  { icon: "🏀", title: "EuroLeague Analytics", desc: "AI-powered basketball analytics. Fantasy tools, scouting reports for European leagues.", tag: "Coming soon", tagColor: "#4b5563", link: false },
];

const NEWS = [
  { category: "World Cup 2026", title: "USA, Canada & Mexico: Inside the First Tri-Nation World Cup", time: "2 hours ago", read: "4 min read" },
  { category: "Preview", title: "France vs Senegal: Group I Could Be the Tournament's Toughest", time: "5 hours ago", read: "6 min read" },
  { category: "Analysis", title: "Why Brazil's New Generation Could End Their 24-Year Title Drought", time: "1 day ago", read: "8 min read" },
  { category: "Fantasy", title: "10 Underrated Players to Target in Your World Cup Fantasy League", time: "1 day ago", read: "5 min read" },
];

const STATS = [
  { value: "48", label: "Teams" },
  { value: "104", label: "Matches" },
  { value: "12", label: "Groups" },
  { value: "3", label: "Hosts" },
];

function TeamTicker() {
  const teams = [...ALL_TEAMS, ...ALL_TEAMS];
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid rgba(16,185,129,0.1)", borderBottom: "1px solid rgba(16,185,129,0.1)", background: "rgba(16,185,129,0.03)", padding: "12px 0", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", gap: 32, animation: "ticker 30s linear infinite", width: "max-content" }}>
        {teams.map((team, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
            <Flag team={team} size={14} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: 1 }}>{team.toUpperCase()}</span>
            <span style={{ color: "rgba(16,185,129,0.3)", fontSize: 10 }}>◆</span>
          </div>
        ))}
      </div>
    </div>
  );
  export default function Homepage({ onNavigate }) {
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const countdown = useCountdown();
  const isMobile = useIsMobile();
  const P = isMobile ? "20px" : "40px";

  return (
    <div style={{ minHeight: "100vh", background: "#060d0a", color: "#fff", fontFamily: "'DM Sans',sans-serif", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <ParticleBackground />
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(16,185,129,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.02) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      `}</style>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(6,13,10,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(16,185,129,0.1)", padding: `0 ${P}`, height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: isMobile ? 22 : 26, letterSpacing: 3, display: "flex", alignItems: "center" }}>
          <span style={{ color: "#fff" }}>SPOR</span>
          <span style={{ position: "relative", display: "inline-block", color: "#fff" }}>T<span style={{ position: "absolute", top: 0, left: "50%", right: 0, color: G, overflow: "hidden" }}>T</span></span>
          <span style={{ color: G }}>ACTIQ</span>
        </div>
        {isMobile ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: "4px 10px" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: G, animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 11, color: G, fontWeight: 700 }}>{countdown.days}D {String(countdown.hours).padStart(2,"0")}H</span>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "inherit", fontSize: 18, padding: "4px 10px", borderRadius: 8, cursor: "pointer" }}>☰</button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ display: "flex", gap: 2 }}>
              {NAV_LINKS.map(l => (
                <button key={l} onClick={() => l === "World Cup" && onNavigate("worldcup")}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontFamily: "inherit", fontSize: 14, fontWeight: 500, padding: "6px 14px", borderRadius: 8, cursor: "pointer" }}
                  onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}>{l}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: "5px 14px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: G, animation: "pulse 1.5s infinite" }} />
                <span style={{ fontSize: 12, color: G, fontWeight: 700, letterSpacing: 1 }}>{countdown.days}D {String(countdown.hours).padStart(2,"0")}H {String(countdown.minutes).padStart(2,"0")}M</span>
              </div>
              <button style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontFamily: "inherit", fontSize: 14, fontWeight: 500, padding: "8px 18px", borderRadius: 8, cursor: "pointer" }}>Log in</button>
              <button style={{ background: G, border: "none", color: "#060d0a", fontFamily: "inherit", fontSize: 14, fontWeight: 700, padding: "8px 18px", borderRadius: 8, cursor: "pointer" }}
                onMouseEnter={e => e.target.style.background = "#34d399"} onMouseLeave={e => e.target.style.background = G}>Sign up free</button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <div style={{ position: "fixed", top: 60, left: 0, right: 0, background: "rgba(6,13,10,0.98)", borderBottom: "1px solid rgba(16,185,129,0.15)", zIndex: 99, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_LINKS.map(l => (
            <button key={l} onClick={() => { if (l === "World Cup") onNavigate("worldcup"); setMenuOpen(false); }}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontFamily: "inherit", fontSize: 16, fontWeight: 500, padding: "12px 0", textAlign: "left", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{l}</button>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button style={{ flex: 1, background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontFamily: "inherit", fontSize: 14, padding: "10px", borderRadius: 8, cursor: "pointer" }}>Log in</button>
            <button style={{ flex: 1, background: G, border: "none", color: "#060d0a", fontFamily: "inherit", fontSize: 14, fontWeight: 700, padding: "10px", borderRadius: 8, cursor: "pointer" }}>Sign up free</button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section style={{ padding: isMobile ? "40px 20px 32px" : "0 40px", minHeight: isMobile ? "auto" : "calc(100vh - 60px)", maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 28 : 60, alignItems: "center", position: "relative", zIndex: 1 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 20, padding: "6px 14px", marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: G, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, color: G, fontWeight: 700, letterSpacing: 1 }}>WORLD CUP 2026 — JUNE 11</span>
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: isMobile ? 68 : 96, lineHeight: 0.92, letterSpacing: 2, margin: "0 0 20px" }}>
            YOUR<br />EDGE<br /><span style={{ color: G }}>IN EVERY</span><br />MATCH
          </h1>
          <p style={{ fontSize: isMobile ? 15 : 18, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "0 0 28px" }}>
            AI-powered sports analytics, predictions, and fantasy tools. Built for fans who want more than just the score.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => onNavigate("simulator")}
              style={{ background: G, border: "none", color: "#060d0a", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "14px 24px", borderRadius: 12, cursor: "pointer", boxShadow: "0 0 30px rgba(16,185,129,0.3)", flex: isMobile ? 1 : "none" }}
              onMouseEnter={e => e.target.style.background = "#34d399"} onMouseLeave={e => e.target.style.background = G}
            >⚽ Try the Simulator</button>
            <button onClick={() => onNavigate("worldcup")}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "14px 24px", borderRadius: 12, cursor: "pointer", flex: isMobile ? 1 : "none" }}
            >World Cup Hub →</button>
          </div>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 36 }}>
              <div style={{ display: "flex" }}>
                {["BR","FR","DE","ES","AR"].map((c, i) => (
                  <img key={c} src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${c}.svg`} style={{ width: 28, height: 18, borderRadius: 3, border: "2px solid #060d0a", marginLeft: i === 0 ? 0 : -8, objectFit: "cover" }} />
                ))}
              </div>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Join fans predicting the World Cup</span>
            </div>
          )}
        </div>

        {/* Countdown panel */}
        <div style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 20, padding: isMobile ? 20 : 36 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: 3, marginBottom: 4 }}>KICKOFF IN</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginBottom: 20 }}>Mexico vs South Africa — Estadio Azteca</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr", gap: isMobile ? 4 : 8, alignItems: "center", marginBottom: 24 }}>
            {[{ v: countdown.days, l: "DAYS" }, null, { v: countdown.hours, l: "HRS" }, null, { v: countdown.minutes, l: "MINS" }, null, { v: countdown.seconds, l: "SECS" }].map((u, i) =>
              u === null ? (
                <div key={i} style={{ fontFamily: "'Bebas Neue',cursive", fontSize: isMobile ? 32 : 52, color: "rgba(16,185,129,0.3)", textAlign: "center", animation: "pulse 1s infinite", paddingBottom: 18 }}>:</div>
              ) : (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 12, padding: isMobile ? "10px 4px" : "16px 8px" }}>
                    <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: isMobile ? 34 : 52, color: G, lineHeight: 1 }}>{String(u.v).padStart(2, "0")}</div>
                  </div>
                  <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: 1, fontWeight: 700, marginTop: 5 }}>{u.l}</div>
                </div>
              )
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 20, padding: "14px 0", borderTop: "1px solid rgba(16,185,129,0.1)", borderBottom: "1px solid rgba(16,185,129,0.1)" }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: isMobile ? 22 : 30, color: "#fff", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginTop: 2 }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <button onClick={() => onNavigate("simulator")}
            style={{ width: "100%", background: G, border: "none", color: "#060d0a", fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "13px", borderRadius: 12, cursor: "pointer", letterSpacing: 1 }}
            onMouseEnter={e => e.target.style.background = "#34d399"} onMouseLeave={e => e.target.style.background = G}
          >SIMULATE THE GROUP STAGE →</button>
        </div>
      </section>

      <TeamTicker />

      {/* Features */}
      <section style={{ padding: isMobile ? "60px 20px" : "100px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 11, color: G, fontWeight: 700, letterSpacing: 3, marginBottom: 10 }}>WHAT WE OFFER</div>
            <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: isMobile ? 40 : 52, letterSpacing: 2, margin: 0, lineHeight: 1 }}>EVERYTHING YOU NEED</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 14 }}>
            {FEATURES.map((f, i) => (
              <div key={i} onClick={() => f.link && onNavigate("simulator")}
                style={{ background: hovered === i ? "rgba(16,185,129,0.07)" : "rgba(255,255,255,0.02)", border: `1px solid ${hovered === i ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 18, padding: isMobile ? 20 : 28, cursor: f.link ? "pointer" : "default", transition: "all 0.2s", transform: hovered === i ? "translateY(-4px)" : "none" }}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "#fff" }}>{f.title}</h3>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: `${f.tagColor}18`, color: f.tagColor, border: `1px solid ${f.tagColor}35`, whiteSpace: "nowrap", marginLeft: 8, flexShrink: 0 }}>{f.tag}</span>
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section style={{ padding: isMobile ? "0 20px 60px" : "0 40px 100px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 11, color: G, fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>LATEST</div>
              <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: isMobile ? 34 : 44, letterSpacing: 2, margin: 0 }}>NEWS & PREVIEWS</h2>
            </div>
            <button style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)", fontFamily: "inherit", fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" }}>View all →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 12 }}>
            {NEWS.map((n, i) => (
              <div key={i}
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: isMobile ? 18 : 24, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.25)"; e.currentTarget.style.background = "rgba(16,185,129,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: "rgba(16,185,129,0.1)", color: G, border: "1px solid rgba(16,185,129,0.22)" }}>{n.category}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.22)" }}>{n.time}</span>
                </div>
                <h3 style={{ fontSize: isMobile ? 14 : 16, fontWeight: 600, margin: "0 0 10px", lineHeight: 1.5 }}>{n.title}</h3>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.22)" }}>{n.read}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1200, margin: "0 auto 80px", padding: isMobile ? "0 20px" : "0 40px", position: "relative", zIndex: 1 }}>
        <div style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.12),rgba(16,185,129,0.03))", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: isMobile ? "36px 24px" : "60px 56px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -60, top: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 70%)" }} />
          <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: isMobile ? 34 : 44, letterSpacing: 2, margin: "0 0 10px" }}>READY TO PREDICT THE WORLD CUP?</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", margin: "0 0 28px" }}>Free to use. No account needed. Start simulating in seconds.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => onNavigate("simulator")}
              style={{ background: G, border: "none", color: "#060d0a", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "14px 28px", borderRadius: 12, cursor: "pointer", boxShadow: "0 0 30px rgba(16,185,129,0.3)", flex: isMobile ? 1 : "none" }}
              onMouseEnter={e => e.target.style.background = "#34d399"} onMouseLeave={e => e.target.style.background = G}
            >Start Simulating →</button>
            <button onClick={() => onNavigate("worldcup")}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "14px 28px", borderRadius: 12, cursor: "pointer", flex: isMobile ? 1 : "none" }}
            >World Cup Hub</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(16,185,129,0.07)", padding: `28px ${P}`, display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 16 : 0, position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 20, letterSpacing: 3, display: "flex", alignItems: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>SPOR</span>
          <span style={{ position: "relative", display: "inline-block", color: "rgba(255,255,255,0.3)" }}>T<span style={{ position: "absolute", top: 0, left: "50%", right: 0, color: "rgba(16,185,129,0.4)", overflow: "hidden" }}>T</span></span>
          <span style={{ color: "rgba(16,185,129,0.4)" }}>ACTIQ</span>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.18)" }}>© 2026 Sportactiq. Built for fans, by fans.</div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Contact"].map(l => <span key={l} style={{ fontSize: 12, color: "rgba(255,255,255,0.22)", cursor: "pointer" }}>{l}</span>)}
        </div>
      </footer>
    </div>
  );
}
}
