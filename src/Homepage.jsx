import { useState } from "react";

const NAV_LINKS = ["World Cup", "Basketball", "Fantasy", "Analytics"];

// Using country-flags.com CDN as alternative
const FLAG_CODES = {
  "Mexico": "mx", "South Africa": "za", "South Korea": "kr", "Czechia": "cz",
  "Canada": "ca", "Bosnia and Herzegovina": "ba", "Qatar": "qa", "Switzerland": "ch",
  "Brazil": "br", "Morocco": "ma", "Haiti": "ht", "Scotland": "gb-sct",
  "USA": "us", "Paraguay": "py", "Australia": "au", "Türkiye": "tr",
  "Germany": "de", "Curaçao": "cw", "Ivory Coast": "ci", "Ecuador": "ec",
  "Netherlands": "nl", "Japan": "jp", "Sweden": "se", "Tunisia": "tn",
  "Belgium": "be", "Egypt": "eg", "Iran": "ir", "New Zealand": "nz",
  "Spain": "es", "Cape Verde": "cv", "Saudi Arabia": "sa", "Uruguay": "uy",
  "France": "fr", "Senegal": "sn", "Iraq": "iq", "Norway": "no",
  "Argentina": "ar", "Algeria": "dz", "Austria": "at", "Jordan": "jo",
  "Portugal": "pt", "DR Congo": "cd", "Uzbekistan": "uz", "Colombia": "co",
  "England": "gb-eng", "Croatia": "hr", "Ghana": "gh", "Panama": "pa",
};

function Flag({ team, size = 16 }) {
  const code = FLAG_CODES[team];
  if (!code) return null;
  return (
    <img
      src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${code.toUpperCase()}.svg`}
      alt={team}
      style={{ width: Math.round(size * 1.5), height: size, borderRadius: 2, objectFit: "cover", flexShrink: 0 }}
      onError={e => { e.target.style.display = "none"; }}
    />
  );
}

function Logo() {
  return (
    <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 26, letterSpacing: 3, display: "flex", alignItems: "center" }}>
      <span>SPORTA</span>
      <span style={{
        position: "relative", display: "inline-block",
        background: "linear-gradient(to right, #10b981 50%, #ffffff 50%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>T</span>
      <span style={{ color: "#10b981" }}>IQ</span>
    </div>
  );
}

const FEATURES = [
  { icon: "⚽", title: "Group Stage Simulator", desc: "Predict every match in all 12 World Cup groups. See live standings update as you enter scores.", tag: "Live now", tagColor: "#10b981", link: true },
  { icon: "🏆", title: "Knockout Bracket", desc: "Build your path to glory. Simulate the entire tournament from Round of 32 all the way to the Final.", tag: "Coming soon", tagColor: "#4b5563", link: false },
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

const STATS = [{ value: "48", label: "Teams" }, { value: "104", label: "Matches" }, { value: "12", label: "Groups" }, { value: "3", label: "Host Nations" }];
const FAVOURITES = ["France", "Brazil", "Spain", "Argentina", "England", "Germany"];
const G = "#10b981";

export default function Homepage({ onNavigate }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ minHeight: "100vh", background: "#080f0c", color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Background */}
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
        <style>{`@keyframes fh0{0%,100%{transform:translate(0,0)}50%{transform:translate(40px,-50px)}}@keyframes fh1{0%,100%{transform:translate(0,0)}50%{transform:translate(-50px,35px)}}@keyframes fh2{0%,100%{transform:translate(0,0)}50%{transform:translate(25px,45px)}}@keyframes fh3{0%,100%{transform:translate(0,0)}50%{transform:translate(35px,-30px)}}`}</style>
      </div>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(8,15,12,0.93)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(16,185,129,0.1)", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <Logo />
          <div style={{ display: "flex", gap: 2 }}>
            {NAV_LINKS.map(l => (
              <button key={l} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.45)", fontFamily: "inherit", fontSize: 14, fontWeight: 500, padding: "6px 12px", borderRadius: 8, cursor: "pointer" }}
                onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontFamily: "inherit", fontSize: 14, fontWeight: 500, padding: "8px 18px", borderRadius: 8, cursor: "pointer" }}>Log in</button>
          <button style={{ background: G, border: "none", color: "#080f0c", fontFamily: "inherit", fontSize: 14, fontWeight: 700, padding: "8px 18px", borderRadius: 8, cursor: "pointer" }}
            onMouseEnter={e => e.target.style.background = "#34d399"} onMouseLeave={e => e.target.style.background = G}>Sign up free</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "90px 32px 80px", maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", position: "relative", zIndex: 1 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 20, padding: "5px 14px", marginBottom: 24 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: G }} />
            <span style={{ fontSize: 12, color: G, fontWeight: 600, letterSpacing: 1 }}>WORLD CUP 2026 — JUNE 11</span>
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 72, lineHeight: 1, letterSpacing: 2, margin: "0 0 20px" }}>
            YOUR EDGE<br /><span style={{ color: G }}>IN EVERY</span><br />MATCH
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 440 }}>
            AI-powered sports analytics, predictions, and fantasy tools. Built for fans who want more than just the score.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => onNavigate("simulator")} style={{ background: G, border: "none", color: "#080f0c", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "14px 28px", borderRadius: 10, cursor: "pointer" }}
              onMouseEnter={e => e.target.style.background = "#34d399"} onMouseLeave={e => e.target.style.background = G}>Try the Simulator →</button>
            <button style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", fontFamily: "inherit", fontSize: 15, fontWeight: 500, padding: "14px 28px", borderRadius: 10, cursor: "pointer" }}>See all features</button>
          </div>
        </div>

        <div style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: 32 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: 2, marginBottom: 20 }}>WORLD CUP 2026 AT A GLANCE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {STATS.map(s => (
              <div key={s.label} style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 12, padding: "18px 14px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 44, color: G, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 4, letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontWeight: 600, letterSpacing: 2, marginBottom: 10 }}>TITLE FAVOURITES</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {FAVOURITES.map(team => (
                <div key={team} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "5px 10px" }}>
                  <Flag team={team} size={14} />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{team}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => onNavigate("simulator")} style={{ width: "100%", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: G, fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "13px", borderRadius: 10, cursor: "pointer", letterSpacing: 1 }}
            onMouseEnter={e => e.target.style.background = "rgba(16,185,129,0.2)"} onMouseLeave={e => e.target.style.background = "rgba(16,185,129,0.1)"}>SIMULATE THE GROUP STAGE →</button>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 32px", background: "rgba(0,0,0,0.2)", borderTop: "1px solid rgba(16,185,129,0.07)", borderBottom: "1px solid rgba(16,185,129,0.07)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: 11, color: G, fontWeight: 600, letterSpacing: 2, marginBottom: 10 }}>WHAT WE OFFER</div>
            <h2 style={{ fontFamily: "'Bebas Neue',cursive"
