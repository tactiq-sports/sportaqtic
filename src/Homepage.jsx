import { useState, useEffect } from "react";

const NAV_LINKS = ["World Cup", "Basketball", "Fantasy", "Analytics"];
const G = "#10b981";
const LAUNCH_DATE = new Date("2026-06-11T15:00:00Z");

const FLAG_CODES = {
  "France": "FR", "Brazil": "BR", "Spain": "ES",
  "Argentina": "AR", "England": "GB-ENG", "Germany": "DE",
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

function Logo({ size = 26 }) {
  return (
    <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: size, letterSpacing: 3, display: "flex", alignItems: "center", lineHeight: 1 }}>
      <span style={{ color: "#fff" }}>SPOR</span>
      <svg width={size * 0.62} height={size} viewBox="0 0 20 32" style={{ display: "inline-block", verticalAlign: "top", margin: "0 0px" }}>
        <defs>
          <clipPath id="left-hp">
            <rect x="0" y="0" width="10" height="32" />
          </clipPath>
          <clipPath id="right-hp">
            <rect x="10" y="0" width="10" height="32" />
          </clipPath>
        </defs>
        <text fontFamily="'Bebas Neue',cursive" fontSize="32" letterSpacing="0" clipPath="url(#left-hp)" fill="#ffffff" x="0" y="28">T</text>
        <text fontFamily="'Bebas Neue',cursive" fontSize="32" letterSpacing="0" clipPath="url(#right-hp)" fill="#10b981" x="0" y="28">T</text>
      </svg>
      <span style={{ color: "#10b981" }}>ACTIQ</span>
    </div>
  );
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
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

const FEATURES = [
  { icon: "⚽", title: "Group Stage Simulator", desc: "Predict every match in all 12 World Cup groups. See live standings update as you enter scores.", tag: "Live now", tagColor: "#10b981", link: true },
  { icon: "🏆", title: "Knockout Bracket", desc: "Build your path to glory. Simulate the entire tournament from Round of 32 to the Final.", tag: "Coming soon", tagColor: "#4b5563", link: false },
  { icon: "🤖", title: "AI Match Previews", desc: "Get AI-generated tactical breakdowns before every game. Who has the edge and why.", tag: "Coming soon", tagColor: "#4b5563", link: false },
  { icon: "👥", title: "Private Prediction Leagues", desc: "Compete with friends. Create a private league, share your link, see who predicts best.", tag: "Premium", tagColor: "#10b981", link: false },
  { icon: "📊", title: "Player Stats Tracker", desc: "Deep dive into every player's tournament performance. Goals, assists, ratings, heat maps.", tag: "Coming soon", tagColor: "#4b5563", link: false },
  { icon: "🏀", title: "EuroLeague Analytics", desc: "AI-powered basketball analytics for European leagues. Fantasy tools, scouting reports, and more.", tag: "Coming soon", tagColor: "#4b5563", link: false },
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
  { value: "3", label: "Host Nations" },
];

function CountdownUnit({ value, label }) {
  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <div style={{
        background: "rgba(16,185,129,0.08)",
        border: "1px solid rgba(16,185,129,0.15)",
        borderRadius: 12, padding: "16px 8px",
        marginBottom: 6,
      }}>
        <div style={{
          fontFamily: "'Bebas Neue',cursive",
          fontSize: 44, color: G, lineHeight: 1,
          minWidth: 60,
        }}>
          {String(value).padStart(2, "0")}
        </div>
      </div>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontWeight: 700 }}>
        {label}
      </div>
    </div>
  );
}

export default function Homepage({ onNavigate }) {
  const [hovered, setHovered] = useState(null);
  const countdown = useCountdown();

  return (
    <div style={{ minHeight: "100vh", background: "#080f0c", color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Animated background */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[
          { top: "5%", left: "10%", w: 500, color: "rgba(16,185,129,0.06)", d: 10 },
          { top: "55%", left: "65%", w: 600, color: "rgba(5,150,105,0.04)", d: 14 },
          { top: "25%", left: "75%", w: 350, color: "rgba(16,185,129,0.05)", d: 9 },
          { top: "70%", left: "5%", w: 300, color: "rgba(6,78,59,0.07)", d: 12 },
        ].map((o, i) => (
          <div key={i} style={{ position: "absolute", top: o.top, left: o.left, width: o.w, height: o.w, borderRadius: "50%", background: `radial-gradient(circle,${o.color} 0%,transparent 70%)`, animation: `fh${i} ${o.d}s ease-in-out infinite` }} />
        ))}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(16,185,129,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <style>{`
          @keyframes fh0{0%,100%{transform:translate(0,0)}50%{transform:translate(40px,-50px)}}
          @keyframes fh1{0%,100%{transform:translate(0,0)}50%{transform:translate(-50px,35px)}}
          @keyframes fh2{0%,100%{transform:translate(0,0)}50%{transform:translate(25px,45px)}}
          @keyframes fh3{0%,100%{transform:translate(0,0)}50%{transform:translate(35px,-30px)}}
          @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        `}</style>
      </div>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(8,15,12,0.93)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(16,185,129,0.1)", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <Logo size={26} />
          <div style={{ display: "flex", gap: 2 }}>
            {NAV_LINKS.map(l => (
              <button key={l} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.45)", fontFamily: "inherit", fontSize: 14, fontWeight: 500, padding: "6px 12px", borderRadius: 8, cursor: "pointer" }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}
              >{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontFamily: "inherit", fontSize: 14, fontWeight: 500, padding: "8px 18px", borderRadius: 8, cursor: "pointer" }}>Log in</button>
          <button style={{ background: G, border: "none", color: "#080f0c", fontFamily: "inherit", fontSize: 14, fontWeight: 700, padding: "8px 18px", borderRadius: 8, cursor: "pointer" }}
            onMouseEnter={e => e.target.style.background = "#34d399"}
            onMouseLeave={e => e.target.style.background = G}
          >Sign up free</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "90px 32px 80px", maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", position: "relative", zIndex: 1 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 20, padding: "5px 14px", marginBottom: 24 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: G, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, color: G, fontWeight: 600, letterSpacing: 1 }}>WORLD CUP 2026 — JUNE 11</span>
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 72, lineHeight: 1, letterSpacing: 2, margin: "0 0 20px" }}>
            YOUR EDGE<br /><span style={{ color: G }}>IN EVERY</span><br />MATCH
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 440 }}>
            AI-powered sports analytics, predictions, and fantasy tools. Built for fans who want more than just the score.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => onNavigate("simulator")}
              style={{ background: G, border: "none", color: "#080f0c", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "14px 28px", borderRadius: 10, cursor: "pointer" }}
              onMouseEnter={e => e.target.style.background = "#34d399"}
              onMouseLeave={e => e.target.style.background = G}
            >Try the Simulator →</button>
            <button style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", fontFamily: "inherit", fontSize: 15, fontWeight: 500, padding: "14px 28px", borderRadius: 10, cursor: "pointer" }}>See all features</button>
          </div>
        </div>

        {/* Right panel — countdown + stats */}
        <div style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: 32 }}>

          {/* Countdown */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: 2, marginBottom: 16, textAlign: "center" }}>KICKOFF IN</div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <CountdownUnit value={countdown.days} label="DAYS" />
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 40, color: "rgba(16,185,129,0.4)", paddingTop: 10, animation: "pulse 1s infinite" }}>:</div>
              <CountdownUnit value={countdown.hours} label="HOURS" />
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 40, color: "rgba(16,185,129,0.4)", paddingTop: 10, animation: "pulse 1s infinite" }}>:</div>
              <CountdownUnit value={countdown.minutes} label="MINS" />
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 40, color: "rgba(16,185,129,0.4)", paddingTop: 10, animation: "pulse 1s infinite" }}>:</div>
              <CountdownUnit value={countdown.seconds} label="SECS" />
            </div>
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
              Mexico vs South Africa — Estadio Azteca, Mexico City
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(16,185,129,0.1)", marginBottom: 20 }} />

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 20 }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 28, color: G, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 3, letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>

          <button onClick={() => onNavigate("simulator")}
            style={{ width: "100%", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: G, fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "13px", borderRadius: 10, cursor: "pointer", letterSpacing: 1 }}
            onMouseEnter={e => e.target.style.background = "rgba(16,185,129,0.2)"}
            onMouseLeave={e => e.target.style.background = "rgba(16,185,129,0.1)"}
          >SIMULATE THE GROUP STAGE →</button>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 32px", background: "rgba(0,0,0,0.2)", borderTop: "1px solid rgba(16,185,129,0.07)", borderBottom: "1px solid rgba(16,185,129,0.07)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: 11, color: G, fontWeight: 600, letterSpacing: 2, marginBottom: 10 }}>WHAT WE OFFER</div>
            <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 44, letterSpacing: 2, margin: 0 }}>EVERYTHING YOU NEED</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {FEATURES.map((f, i) => (
              <div key={i} onClick={() => f.link && onNavigate("simulator")}
                style={{ background: hovered === i ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${hovered === i ? "rgba(16,185,129,0.28)" : "rgba(255,255,255,0.05)"}`, borderRadius: 16, padding: 22, cursor: f.link ? "pointer" : "default", transition: "all 0.2s", transform: hovered === i ? "translateY(-2px)" : "none" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <span style={{ fontSize: 24 }}>{f.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: `${f.tagColor}18`, color: f.tagColor, border: `1px solid ${f.tagColor}35` }}>{f.tag}</span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 7px", color: "#fff" }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, color: G, fontWeight: 600, letterSpacing: 2, marginBottom: 8 }}>LATEST</div>
            <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 38, letterSpacing: 2, margin: 0 }}>MATCH PREVIEWS & NEWS</h2>
          </div>
          <button style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)", fontFamily: "inherit", fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}>View all →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
          {NEWS.map((n, i) => (
            <div key={i}
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 22, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.22)"; e.currentTarget.style.background = "rgba(16,185,129,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: "rgba(16,185,129,0.1)", color: G, border: "1px solid rgba(16,185,129,0.22)" }}>{n.category}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.22)" }}>{n.time}</span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 10px", lineHeight: 1.5 }}>{n.title}</h3>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.22)" }}>{n.read}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1136, margin: "0 auto 80px", padding: "0 32px", position: "relative", zIndex: 1 }}>
        <div style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.1),rgba(16,185,129,0.03))", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: "52px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 38, letterSpacing: 2, margin: "0 0 10px" }}>READY TO PREDICT THE WORLD CUP?</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", margin: 0 }}>Free to use. No account needed to start simulating.</p>
          </div>
          <button onClick={() => onNavigate("simulator")}
            style={{ background: G, border: "none", color: "#080f0c", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "16px 32px", borderRadius: 10, cursor: "pointer", whiteSpace: "nowrap" }}
            onMouseEnter={e => e.target.style.background = "#34d399"}
            onMouseLeave={e => e.target.style.background = G}
          >Start Simulating →</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(16,185,129,0.07)", padding: "28px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
        <Logo size={20} />
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.18)" }}>© 2026 Sportactiq. Built for fans, by fans.</div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Contact"].map(l => <span key={l} style={{ fontSize: 12, color: "rgba(255,255,255,0.22)", cursor: "pointer" }}>{l}</span>)}
        </div>
      </footer>
    </div>
  );
}
