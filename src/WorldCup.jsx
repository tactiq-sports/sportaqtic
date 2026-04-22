import { useState, useEffect } from "react";

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
  { icon: "📈", title: "48 teams for the first time", desc: "The tournament expands from 32 to 48 teams, meaning 16 more nations get their shot at glory." },
  { icon: "⚽", title: "104 matches total", desc: "Up from 64 in previous tournaments — nearly double the amount of football to enjoy." },
  { icon: "🏟️", title: "16 venues across 3 countries", desc: "11 stadiums in the USA, 3 in Mexico and 2 in Canada will host matches across 39 days." },
  { icon: "🏆", title: "Argentina are defending champions", desc: "Lionel Messi led Argentina to glory in Qatar 2022. Can they defend their title on a bigger stage?" },
  { icon: "📅", title: "Final on July 19 at MetLife Stadium", desc: "The biggest game in football will take place in East Rutherford, New Jersey." },
  { icon: "🆕", title: "4 World Cup debutants", desc: "Cape Verde, Curaçao, Jordan and Uzbekistan will all appear in a World Cup for the very first time." },
  { icon: "🔄", title: "New round of 32 knockout stage", desc: "For the first time since 1998, there's an extra knockout round — 32 teams advance from the groups." },
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
    <div style={{ minHeight: "100vh", background: "#0d0a04", fontFamily: "'DM Sans',sans-serif", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Background */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[
          { top: "5%", left: "10%", w: 500, color: "rgba(201,168,76,0.06)" },
          { top: "60%", left: "70%", w: 400, color: "rgba(201,168,76,0.04)" },
        ].map((o, i) => (
          <div key={i} style={{ position: "absolute", top: o.top, left: o.left, width: o.w, height: o.w, borderRadius: "50%", background: `radial-gradient(circle,${o.color} 0%,transparent 70%)` }} />
        ))}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.02) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </div>

      {/* Navbar */}
      <div style={{ borderBottom: "1px solid rgba(201,168,76,0.12)", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, background: "rgba(13,10,4,0.93)", backdropFilter: "blur(16px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)", fontFamily: "inherit", fontSize: 12, padding: "6px 12px", borderRadius: 7, cursor: "pointer" }}>← Home</button>
          <div>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 22, letterSpacing: 3, color: G, lineHeight: 1 }}>WORLD CUP 2026</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 2 }}>HUB</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onNavigate("simulator")} style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", color: G, fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "7px 14px", borderRadius: 8, cursor: "pointer" }}>Simulator</button>
          <button onClick={() => onNavigate("bracket")} style={{ background: G, border: "none", color: "#0d0a04", fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "7px 14px", borderRadius: 8, cursor: "pointer" }}>Bracket</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 11, color: G, fontWeight: 600, letterSpacing: 3, marginBottom: 12 }}>FIFA WORLD CUP 2026</div>
          <h1 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 64, letterSpacing: 3, margin: "0 0 12px", lineHeight: 1 }}>
            THE BIGGEST<br /><span style={{ color: G }}>TOURNAMENT</span><br />ON EARTH
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", maxWidth: 500, margin: "0 auto" }}>
            48 teams. 3 nations. 104 matches. One champion.
          </p>
        </div>

        {/* Countdown */}
        <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 20, padding: "36px 40px", marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: 3, marginBottom: 24 }}>KICKOFF — MEXICO VS SOUTH AFRICA — JUNE 11, 2026</div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 16 }}>
            {[
              { v: countdown.days, l: "DAYS" },
              { v: countdown.hours, l: "HOURS" },
              { v: countdown.minutes, l: "MINS" },
              { v: countdown.seconds, l: "SECS" },
            ].map((u, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 80, color: G, lineHeight: 1, minWidth: 100 }}>
                    {String(u.v).padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontWeight: 700, marginTop: 4 }}>{u.l}</div>
                </div>
                {i < 3 && <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 60, color: "rgba(201,168,76,0.3)", marginBottom: 20, animation: "pulse 1s infinite" }}>:</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Poll + Facts grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>

          {/* Poll */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 20, padding: 28 }}>
            <div style={{ fontSize: 11, color: G, fontWeight: 600, letterSpacing: 2, marginBottom: 6 }}>POLL</div>
            <h3 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 28, letterSpacing: 2, margin: "0 0 20px" }}>WHO WINS THE WORLD CUP?</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {POLL_OPTIONS.map(({ team, flag }) => {
                const pct = Math.round((votes[team] / (totalVotes + 1)) * 100);
                const isVoted = voted === team;
                return (
                  <div key={team} onClick={() => handleVote(team)}
                    style={{ position: "relative", borderRadius: 10, overflow: "hidden", cursor: voted ? "default" : "pointer", border: `1px solid ${isVoted ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.07)"}`, transition: "border-color 0.2s" }}
                    onMouseEnter={e => { if (!voted) e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; }}
                    onMouseLeave={e => { if (!isVoted) e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                  >
                    {voted && (
                      <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${pct}%`, background: isVoted ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)", transition: "width 0.5s ease" }} />
                    )}
                    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px" }}>
                      {flag && <Flag team={team} size={14} />}
                      {!flag && <span style={{ fontSize: 14 }}>🌍</span>}
                      <span style={{ fontSize: 13, fontWeight: isVoted ? 700 : 500, color: isVoted ? G : "#fff" }}>{team}</span>
                      {voted && <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: isVoted ? G : "rgba(255,255,255,0.4)" }}>{pct}%</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
              {totalVotes.toLocaleString()} votes cast
            </div>
          </div>

          {/* Fun Facts */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 20, padding: 28 }}>
            <div style={{ fontSize: 11, color: G, fontWeight: 600, letterSpacing: 2, marginBottom: 6 }}>DID YOU KNOW?</div>
            <h3 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 28, letterSpacing: 2, margin: "0 0 20px" }}>WORLD CUP FACTS</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {FACTS.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{f.title}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div onClick={() => onNavigate("simulator")}
            style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 16, padding: "24px 28px", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.14)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>⚽</div>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 24, letterSpacing: 2, marginBottom: 6, color: G }}>GROUP STAGE SIMULATOR</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Predict all 12 groups and see who qualifies for the knockouts.</div>
          </div>
          <div onClick={() => onNavigate("bracket")}
            style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 16, padding: "24px 28px", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.14)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>🏆</div>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 24, letterSpacing: 2, marginBottom: 6, color: G }}>KNOCKOUT BRACKET</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Pick winners round by round all the way to the Final.</div>
          </div>
        </div>

      </div>
    </div>
  );
}
