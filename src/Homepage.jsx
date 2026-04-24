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

function Logo({ size = 24, color1 = "#fff", color2 = G, opacity = 1 }) {
  return (
    <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: size, letterSpacing: 3, display: "flex", alignItems: "flex-start", lineHeight: 1, opacity }}>
      <span style={{ color: color1 }}>SPOR</span>
      <span style={{ position: "relative", display: "inline-block" }}>
        <span style={{ color: "transparent" }}>T</span>
        <span style={{ position: "absolute", top: 0, left: 0, width: "50%", overflow: "hidden", color: color1, whiteSpace: "nowrap" }}>T</span>
        <span style={{ position: "absolute", top: 0, right: 0, width: "50%", overflow: "hidden", color: color2, whiteSpace: "nowrap", direction: "rtl" }}>T</span>
      </span>
      <span style={{ color: color2 }}>ACTIQ</span>
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

const FEATURES = [
  { icon: "⚽", title: "Group Stage Simulator", desc: "Predict every match across all 12 groups. Standings update live.", tag: "Live now", tagColor: G, link: true },
  { icon: "🏆", title: "Knockout Bracket", desc: "Pick winners round by round from R32 to the Final.", tag: "Live now", tagColor: G, link: true, page: "bracket" },
  { icon: "🤖", title: "AI Match Previews", desc: "AI-generated tactical breakdowns before every game.", tag: "Coming soon", tagColor: "#4b5563", link: false },
  { icon: "👥", title: "Private Prediction Leagues", desc: "Compete with friends in a private prediction league.", tag: "Premium", tagColor: G, link: false },
  { icon: "📊", title: "Player Stats Tracker", desc: "Goals, assists, ratings and more for every player.", tag: "Coming soon", tagColor: "#4b5563", link: false },
  { icon: "🏀", title: "EuroLeague Analytics", desc: "AI-powered basketball analytics for European leagues.", tag: "Coming soon", tagColor: "#4b5563", link: false },
];

const STATS = [{ value: "48", label: "Teams" }, { value: "104", label: "Matches" }, { value: "12", label: "Groups" }, { value: "3", label: "Hosts" }];

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
}

export default function Homepage({ onNavigate, user, onLogout }) {
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const countdown = useCountdown();

  return (
    <div style={{ minHeight: "100vh", background: "#060d0a", color: "#fff", fontFamily: "'DM Sans',sans-serif", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <ParticleBackground />
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(16,185,129,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.02) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />

      <style>{`
        html,body{overflow-x:hidden;margin:0;padding:0;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;}
        .features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
        .nav-links{display:flex;gap:2px;}
        .nav-right{display:flex;align-items:center;gap:8px;}
        .mobile-nav{display:none;}
        .hero-social{display:flex;align-items:center;gap:16px;margin-top:36px;}
        .cta-inner{display:flex;justify-content:space-between;align-items:center;gap:24px;}
        .cta-buttons{display:flex;gap:12px;flex-shrink:0;flex-wrap:wrap;}
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr!important;gap:28px!important;}
          .features-grid{grid-template-columns:1fr!important;}
          .nav-links{display:none!important;}
          .nav-right{display:none!important;}
          .mobile-nav{display:flex!important;align-items:center;gap:8px;}
          .hero-social{display:none!important;}
          .cta-inner{flex-direction:column!important;align-items:flex-start!important;}
          .cta-buttons{width:100%;}
          .cta-buttons button{flex:1;}
        }
      `}</style>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(6,13,10,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(16,185,129,0.1)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo size={24} />

        <div className="nav-links">
          {NAV_LINKS.map(l => (
            <button key={l} onClick={() => l === "World Cup" && onNavigate("worldcup")}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontFamily: "inherit", fontSize: 14, fontWeight: 500, padding: "6px 14px", borderRadius: 8, cursor: "pointer" }}
              onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}>{l}</button>
          ))}
        </div>

        <div className="nav-right">
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: "5px 14px" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: G, animation: "pulse 1.5s infinite" }} />
            <span style={{ fontSize: 12, color: G, fontWeight: 700 }}>{countdown.days}D {String(countdown.hours).padStart(2,"0")}H {String(countdown.minutes).padStart(2,"0")}M</span>
          </div>
          {user ? (
  <button onClick={() => onNavigate("profile")}
    style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: G, fontFamily: "inherit", fontSize: 14, fontWeight: 700, padding: "8px 18px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{ width: 24, height: 24, borderRadius: "50%", background: G, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#060d0a" }}>
      {user.email[0].toUpperCase()}
    </div>
    {user.email.split("@")[0]}
  </button>
) : (
  <>
    <button onClick={() => onNavigate("auth")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontFamily: "inherit", fontSize: 14, fontWeight: 500, padding: "8px 18px", borderRadius: 8, cursor: "pointer" }}>Log in</button>
    <button onClick={() => onNavigate("auth")} style={{ background: G, border: "none", color: "#060d0a", fontFamily: "inherit", fontSize: 14, fontWeight: 700, padding: "8px 18px", borderRadius: 8, cursor: "pointer" }}
      onMouseEnter={e => e.target.style.background = "#34d399"} onMouseLeave={e => e.target.style.background = G}>Sign up free</button>
  </>
)}
        </div>

        <div className="mobile-nav">
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: "4px 10px" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: G, animation: "pulse 1.5s infinite" }} />
            <span style={{ fontSize: 11, color: G, fontWeight: 700 }}>{countdown.days}D {String(countdown.hours).padStart(2,"0")}H</span>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "inherit", fontSize: 18, padding: "4px 10px", borderRadius: 8, cursor: "pointer" }}>☰</button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ position: "fixed", top: 60, left: 0, right: 0, background: "rgba(6,13,10,0.98)", borderBottom: "1px solid rgba(16,185,129,0.15)", zIndex: 99, padding: "16px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
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
      <section style={{ padding: "40px 24px", maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 20, padding: "6px 14px", marginBottom: 20 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: G, animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 11, color: G, fontWeight: 700, letterSpacing: 1 }}>WORLD CUP 2026 — JUNE 11</span>
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "clamp(44px,12vw,96px)", lineHeight: 0.95, letterSpacing: 1, margin: "0 0 20px", wordBreak: "break-word" }}>
              YOUR<br />EDGE<br /><span style={{ color: G }}>IN EVERY</span><br />MATCH
            </h1>
            <p style={{ fontSize: "clamp(14px,2vw,18px)", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "0 0 28px" }}>
              AI-powered sports analytics, predictions, and fantasy tools. Built for fans who want more than just the score.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => onNavigate("simulator")}
                style={{ background: G, border: "none", color: "#060d0a", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "14px 24px", borderRadius: 12, cursor: "pointer", boxShadow: "0 0 30px rgba(16,185,129,0.3)", flex: 1, minWidth: 160 }}
                onMouseEnter={e => e.target.style.background = "#34d399"} onMouseLeave={e => e.target.style.background = G}
              >⚽ Try the Simulator</button>
              <button onClick={() => onNavigate("worldcup")}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "14px 24px", borderRadius: 12, cursor: "pointer", flex: 1, minWidth: 140 }}
              >World Cup Hub →</button>
            </div>
            <div className="hero-social">
              <div style={{ display: "flex" }}>
                {["BR","FR","DE","ES","AR"].map((c, i) => (
                  <img key={c} src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${c}.svg`} style={{ width: 28, height: 18, borderRadius: 3, border: "2px solid #060d0a", marginLeft: i === 0 ? 0 : -8, objectFit: "cover" }} />
                ))}
              </div>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Join fans predicting the World Cup</span>
            </div>
          </div>

          <div style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 20, padding: 28 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: 3, marginBottom: 4 }}>KICKOFF IN</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginBottom: 20 }}>Mexico vs South Africa — Estadio Azteca</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr", gap: 6, alignItems: "center", marginBottom: 20 }}>
              {[{ v: countdown.days, l: "DAYS" }, null, { v: countdown.hours, l: "HRS" }, null, { v: countdown.minutes, l: "MINS" }, null, { v: countdown.seconds, l: "SECS" }].map((u, i) =>
                u === null ? (
                  <div key={i} style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "clamp(28px,4vw,52px)", color: "rgba(16,185,129,0.3)", textAlign: "center", animation: "pulse 1s infinite", paddingBottom: 16 }}>:</div>
                ) : (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 10, padding: "10px 4px" }}>
                      <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "clamp(28px,4vw,52px)", color: G, lineHeight: 1 }}>{String(u.v).padStart(2, "0")}</div>
                    </div>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: 1, fontWeight: 700, marginTop: 4 }}>{u.l}</div>
                  </div>
                )
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 20, padding: "12px 0", borderTop: "1px solid rgba(16,185,129,0.1)", borderBottom: "1px solid rgba(16,185,129,0.1)" }}>
              {STATS.map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "clamp(20px,3vw,30px)", color: "#fff", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginTop: 2 }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate("simulator")}
              style={{ width: "100%", background: G, border: "none", color: "#060d0a", fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "13px", borderRadius: 12, cursor: "pointer", letterSpacing: 1 }}
              onMouseEnter={e => e.target.style.background = "#34d399"} onMouseLeave={e => e.target.style.background = G}
            >SIMULATE THE GROUP STAGE →</button>
          </div>
        </div>
      </section>

      <TeamTicker />

      {/* Features */}
      <section style={{ padding: "80px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 11, color: G, fontWeight: 700, letterSpacing: 3, marginBottom: 10 }}>WHAT WE OFFER</div>
            <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "clamp(36px,5vw,52px)", letterSpacing: 2, margin: 0 }}>EVERYTHING YOU NEED</h2>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} onClick={() => f.link && onNavigate(f.page || "simulator")}
                style={{ background: hovered === i ? "rgba(16,185,129,0.07)" : "rgba(255,255,255,0.02)", border: `1px solid ${hovered === i ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 18, padding: 24, cursor: f.link ? "pointer" : "default", transition: "all 0.2s" }}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 8 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "#fff" }}>{f.title}</h3>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: `${f.tagColor}18`, color: f.tagColor, border: `1px solid ${f.tagColor}35`, whiteSpace: "nowrap", flexShrink: 0 }}>{f.tag}</span>
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1200, margin: "0 auto 80px", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <div style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.12),rgba(16,185,129,0.03))", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: "40px 32px", overflow: "hidden" }}>
          <div className="cta-inner">
            <div>
              <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "clamp(28px,4vw,44px)", letterSpacing: 2, margin: "0 0 8px" }}>READY TO PREDICT THE WORLD CUP?</h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", margin: 0 }}>Free to use. No account needed.</p>
            </div>
            <div className="cta-buttons">
              <button onClick={() => onNavigate("simulator")}
                style={{ background: G, border: "none", color: "#060d0a", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "14px 28px", borderRadius: 12, cursor: "pointer", whiteSpace: "nowrap" }}
                onMouseEnter={e => e.target.style.background = "#34d399"} onMouseLeave={e => e.target.style.background = G}
              >Start Simulating →</button>
              <button onClick={() => onNavigate("worldcup")}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "14px 28px", borderRadius: 12, cursor: "pointer", whiteSpace: "nowrap" }}
              >World Cup Hub</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(16,185,129,0.07)", padding: "28px 24px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
        <Logo size={20} color1="rgba(255,255,255,0.3)" color2="rgba(16,185,129,0.4)" />
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.18)" }}>© 2026 Sportactiq. Built for fans, by fans.</div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Contact"].map(l => <span key={l} style={{ fontSize: 12, color: "rgba(255,255,255,0.22)", cursor: "pointer" }}>{l}</span>)}
        </div>
      </footer>
    </div>
  );
}
