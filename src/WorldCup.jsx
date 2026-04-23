import { useState, useEffect, useRef } from "react";

const G = "#c9a84c";
const LAUNCH_DATE = new Date("2026-06-11T15:00:00Z");

const FLAG_CODES = {
  "France": "FR", "Brazil": "BR", "Spain": "ES", "Argentina": "AR",
  "England": "GB-ENG", "Germany": "DE", "Portugal": "PT", "Netherlands": "NL",
  "USA": "US", "Mexico": "MX", "Canada": "CA",
};

function Flag({ team, size = 16 }) {
  const code = FLAG_CODES[team];
  if (!code) return null;
  return <img src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`} alt={team} style={{ width: Math.round(size * 1.5), height: size, borderRadius: 2, objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />;
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
      const rotateEnd = Math.random() > 0.5 ? 360 : -360;
      el.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        font-size: ${size}px;
        opacity: ${0.07 + Math.random() * 0.12};
        animation: wcball${i} ${dur}s ${delay}s ease-in-out infinite;
        pointer-events: none;
        user-select: none;
      `;
      el.textContent = "⚽";
      const styleEl = document.createElement("style");
      styleEl.textContent = `
        @keyframes wcball${i} {
          0%   { transform: translate(0px, 0px) rotate(0deg); }
          25%  { transform: translate(${driftX * 0.4}px, ${driftY * 0.4}px) rotate(${rotateEnd * 0.25}deg); }
          50%  { transform: translate(${driftX}px, ${driftY * 0.6}px) rotate(${rotateEnd * 0.5}deg); }
          75%  { transform: translate(${driftX * 0.6}px, ${driftY}px) rotate(${rotateEnd * 0.75}deg); }
          100% { transform: translate(0px, 0px) rotate(${rotateEnd}deg); }
        }
      `;
      document.head.appendChild(styleEl);
      container.appendChild(el);
      balls.push({ el, styleEl });
    }
    return () => { balls.forEach(({ el, styleEl }) => { el.remove(); styleEl.remove(); }); };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {[
        { top: "5%", left: "10%", w: 500, color: "rgba(201,168,76,0.06)" },
        { top: "60%", left: "70%", w: 400, color: "rgba(201,168,76,0.04)" },
      ].map((o, i) => (
        <div key={i} style={{ position: "absolute", top: o.top, left: o.left, width: o.w, height: o.w, borderRadius: "50%", background: `radial-gradient(circle,${o.color} 0%,transparent 70%)` }} />
      ))}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.02) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
    </div>
  );
}

const POLL_OPTIONS = [
  { team: "France", flag: "FR" },
  { team: "Brazil", flag: "BR" },
  { team: "Spain", flag: "ES" },
  { team: "Argentina", flag: "AR" },
  { team: "England", flag: "GB-ENG" },
  { team: "Germany", flag: "DE" },
  { team: "Portugal", flag: "PT" },
  { team: "Other", flag: null },
];

const FACTS = [
  { icon: "🌎", title: "First ever tri-nation World Cup", desc: "USA, Canada and Mexico become the first three countries to co-host a World Cup together." },
  { icon: "📈", title: "48 teams for the first time", desc: "The tournament expands from 32 to 48 teams — 16 more nations get their shot at glory." },
  { icon: "⚽", title: "104 matches total", desc: "Up from 64 in previous tournaments — nearly double the amount of football." },
  { icon: "🏟️", title: "16 venues across 3 countries", desc: "11 in the USA, 3 in Mexico and 2 in Canada will host matches across 39 days." },
  { icon: "🏆", title: "Argentina are defending champions", desc: "Messi led Argentina to glory in Qatar 2022. Can they defend on a bigger stage?" },
  { icon: "📅", title: "Final on July 19 at MetLife Stadium", desc: "The biggest game in football will be in East Rutherford, New Jersey." },
  { icon: "🆕", title: "4 World Cup debutants", desc: "Cape Verde, Curaçao, Jordan and Uzbekistan appear in a World Cup for the first time." },
  { icon: "🔄", title: "New round of 32 knockout stage", desc: "For the first time since 1998, there's an extra knockout round — 32 teams advance." },
];

export default function WorldCup({ onBack, onNavigate }) {
  const countdown = useCountdown();
  const [voted, setVoted] = useState(null);
  const [votes, setVotes] = useState({ France: 142, Brazil: 198, Spain: 167, Argentina: 231, England: 89, Germany: 76, Portugal: 94, Other: 43 });
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  function handleVote(team) {
    if (voted) return;
    setVotes(v => ({ ...v, [team]: v[team] + 1 }));
    setVoted(team);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0a04", fontFamily: "'DM Sans',sans-serif", color: "#fff", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .wc-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
        .wc-cta-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .countdown-grid{display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1fr;gap:8px;align-items:center;}
        @media(max-width:768px){
          .wc-grid{grid-template-columns:1fr!important;}
          .wc-cta-grid{grid-template-columns:1fr!important;}
          .countdown-grid{gap:4px!important;}
        }
      `}</style>

      <FootballBackground />

      {/* Navbar */}
      <div style={{ borderBottom: "1px solid rgba(201,168,76,0.12)", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, background: "rgba(13,10,4,0.95)", backdropFilter: "blur(16px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)", fontFamily: "inherit", fontSize: 12, padding: "5px 10px", borderRadius: 7, cursor: "pointer", whiteSpace: "nowrap" }}>← Home</button>
          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 18, letterSpacing: 2, color: G, lineHeight: 1 }}>WORLD CUP 2026</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => onNavigate("simulator")} style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", color: G, fontFamily: "inherit", fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" }}>Simulator</button>
          <button onClick={() => onNavigate("bracket")} style={{ background: G, border: "none", color: "#0d0a04", fontFamily: "inherit", fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" }}>Bracket</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: G, fontWeight: 600, letterSpacing: 3, marginBottom: 10 }}>FIFA WORLD CUP 2026</div>
          <h1 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "clamp(40px,8vw,64px)", letterSpacing: 3, margin: "0 0 12px", lineHeight: 1 }}>
            THE BIGGEST<br /><span style={{ color: G }}>TOURNAMENT</span><br />ON EARTH
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", maxWidth: 400, margin: "0 auto" }}>
            48 teams. 3 nations. 104 matches. One champion.
          </p>
        </div>

        {/* Countdown */}
        <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 18, padding: "28px 24px", marginBottom: 20, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: 2, marginBottom: 20 }}>KICKOFF — MEXICO VS SOUTH AFRICA — JUNE 11, 2026</div>
          <div className="countdown-grid">
            {[{ v: countdown.days, l: "DAYS" }, null, { v: countdown.hours, l: "HRS" }, null, { v: countdown.minutes, l: "MINS" }, null, { v: countdown.seconds, l: "SECS" }].map((u, i) =>
              u === null ? (
                <div key={i} style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "clamp(32px,6vw,60px)", color: "rgba(201,168,76,0.3)", textAlign: "center", animation: "pulse 1s infinite", paddingBottom: 16 }}>:</div>
              ) : (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 12, padding: "12px 6px" }}>
                    <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "clamp(36px,7vw,72px)", color: G, lineHeight: 1 }}>
                      {String(u.v).padStart(2, "0")}
                    </div>
                  </div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontWeight: 700, marginTop: 6 }}>{u.l}</div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Poll + Facts */}
        <div className="wc-grid" style={{ marginBottom: 20 }}>

          {/* Poll */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 18, padding: 24 }}>
            <div style={{ fontSize: 10, color: G, fontWeight: 600, letterSpacing: 2, marginBottom: 6 }}>POLL</div>
            <h3 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "clamp(20px,4vw,28px)", letterSpacing: 2, margin: "0 0 18px" }}>WHO WINS THE WORLD CUP?</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {POLL_OPTIONS.map(({ team, flag }) => {
                const pct = Math.round((votes[team] / (totalVotes + 1)) * 100);
                const isVoted = voted === team;
                return (
                  <div key={team} onClick={() => handleVote(team)}
                    style={{ position: "relative", borderRadius: 9, overflow: "hidden", cursor: voted ? "default" : "pointer", border: `1px solid ${isVoted ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.07)"}` }}
                  >
                    {voted && <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${pct}%`, background: isVoted ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)", transition: "width 0.5s ease" }} />}
                    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, padding: "9px 11px" }}>
                      {flag ? <Flag team={team} size={13} /> : <span style={{ fontSize: 13 }}>🌍</span>}
                      <span style={{ fontSize: 13, fontWeight: isVoted ? 700 : 500, color: isVoted ? G : "#fff" }}>{team}</span>
                      {voted && <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: isVoted ? G : "rgba(255,255,255,0.4)" }}>{pct}%</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>{totalVotes.toLocaleString()} votes cast</div>
          </div>

          {/* Facts */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 18, padding: 24 }}>
            <div style={{ fontSize: 10, color: G, fontWeight: 600, letterSpacing: 2, marginBottom: 6 }}>DID YOU KNOW?</div>
            <h3 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "clamp(20px,4vw,28px)", letterSpacing: 2, margin: "0 0 18px" }}>WORLD CUP FACTS</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FACTS.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "9px 11px", background: "rgba(255,255,255,0.02)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{f.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="wc-cta-grid">
          {[
            { icon: "⚽", title: "GROUP STAGE SIMULATOR", desc: "Predict all 12 groups and see who qualifies.", page: "simulator" },
            { icon: "🏆", title: "KNOCKOUT BRACKET", desc: "Pick winners all the way to the Final.", page: "bracket" },
          ].map((c, i) => (
            <div key={i} onClick={() => onNavigate(c.page)}
              style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 14, padding: "20px", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,0.14)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(201,168,76,0.08)"}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "clamp(16px,3vw,22px)", letterSpacing: 2, marginBottom: 5, color: G }}>{c.title}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
