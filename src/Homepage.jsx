import { useState } from "react";

const NAV_LINKS = ["World Cup", "Basketball", "Fantasy", "Analytics"];

const FEATURES = [
  { icon: "⚽", title: "Group Stage Simulator", desc: "Predict every match in all 12 World Cup groups. See live standings update as you enter scores.", tag: "Live now", tagColor: "#22c55e", link: "/simulator" },
  { icon: "🏆", title: "Knockout Bracket", desc: "Build your path to glory. Simulate the entire tournament from Round of 32 all the way to the Final.", tag: "Coming soon", tagColor: "#f59e0b", link: null },
  { icon: "🤖", title: "AI Match Previews", desc: "Get AI-generated tactical breakdowns before every game. Who has the edge and why.", tag: "Coming soon", tagColor: "#f59e0b", link: null },
  { icon: "👥", title: "Private Prediction Leagues", desc: "Compete with friends. Create a private league, share your link, see who predicts best.", tag: "Premium", tagColor: "#c9a84c", link: null },
  { icon: "📊", title: "Player Stats Tracker", desc: "Deep dive into every player's tournament performance. Goals, assists, ratings, heat maps.", tag: "Coming soon", tagColor: "#f59e0b", link: null },
  { icon: "🏀", title: "EuroLeague Analytics", desc: "AI-powered basketball analytics for European leagues. Fantasy tools, scouting reports, and more.", tag: "Coming soon", tagColor: "#f59e0b", link: null },
];

const NEWS = [
  { category: "World Cup 2026", title: "USA, Canada & Mexico: Inside the First Tri-Nation World Cup", time: "2 hours ago", read: "4 min read" },
  { category: "Preview", title: "France vs Germany: The Group D Clash That Could Define the Tournament", time: "5 hours ago", read: "6 min read" },
  { category: "Analysis", title: "Why Brazil's New Generation Could End Their 24-Year Title Drought", time: "1 day ago", read: "8 min read" },
  { category: "Fantasy", title: "10 Underrated Players to Target in Your World Cup Fantasy League", time: "1 day ago", read: "5 min read" },
];

const STATS = [
  { value: "48", label: "Teams" },
  { value: "104", label: "Matches" },
  { value: "12", label: "Groups" },
  { value: "3", label: "Host Nations" },
];

export default function Homepage({ onNavigate }) {
  return (
    <div style={{ minHeight: "100vh", background: "#080812", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Animated background */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[
          { top: "10%", left: "15%", w: 400, h: 400, color: "rgba(201,168,76,0.07)" },
          { top: "60%", left: "70%", w: 500, h: 500, color: "rgba(59,130,246,0.05)" },
          { top: "30%", left: "80%", w: 300, h: 300, color: "rgba(201,168,76,0.04)" },
        ].map((o, i) => (
          <div key={i} style={{
            position: "absolute", top: o.top, left: o.left,
            width: o.w, height: o.h, borderRadius: "50%",
            background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
            animation: `float${i} ${8 + i * 2}s ease-in-out infinite`,
          }} />
        ))}
        <style>{`
          @keyframes float0 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-40px)} }
          @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,30px)} }
          @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,40px)} }
        `}</style>
      </div>

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(8,8,18,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 26, letterSpacing: 3 }}>
            SPORT<span style={{ color: "#c9a84c" }}>AQTIC</span>
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {NAV_LINKS.map(link => (
              <button key={link} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontFamily: "inherit", fontSize: 14, fontWeight: 500, padding: "6px 12px", borderRadius: 8, cursor: "pointer" }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
              >{link}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", fontFamily: "inherit", fontSize: 14, fontWeight: 500, padding: "8px 18px", borderRadius: 8, cursor: "pointer" }}>Log in</button>
          <button style={{ background: "#c9a84c", border: "none", color: "#080812", fontFamily: "inherit", fontSize: 14, fontWeight: 700, padding: "8px 18px", borderRadius: 8, cursor: "pointer" }}>Sign up free</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "90px 32px 80px", maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", position: "relative", zIndex: 1 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 20, padding: "5px 14px", marginBottom: 24 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: 12, color: "#c9a84c", fontWeight: 600, letterSpacing: 1 }}>WORLD CUP 2026 — JUNE 11</span>
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 72, lineHeight: 1, letterSpacing: 2, margin: "0 0 20px" }}>
            YOUR EDGE<br /><span style={{ color: "#c9a84c" }}>IN EVERY</span><br />MATCH
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 440 }}>
            AI-powered sports analytics, predictions, and fantasy tools. Built for fans who want more than just the score.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => onNavigate("simulator")} style={{ background: "#c9a84c", border: "none", color: "#080812", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "14px 28px", borderRadius: 10, cursor: "pointer" }}>
              Try the Simulator →
            </button>
            <button style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontFamily: "inherit", fontSize: 15, fontWeight: 500, padding: "14px 28px", borderRadius: 10, cursor: "pointer" }}>
              See all features
            </button>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: 2, marginBottom: 24 }}>WORLD CUP 2026 AT A GLANCE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
            {STATS.map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "20px 16px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 48, color: "#c9a84c", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4, letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <button onClick={() => onNavigate("simulator")} style={{ width: "100%", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", color: "#c9a84c", fontFamily: "inherit", fontSize: 14, fontWeight: 700, padding: "14px", borderRadius: 10, cursor: "pointer", letterSpacing: 1 }}>
            SIMULATE THE GROUP STAGE →
          </button>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 32px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, color: "#c9a84c", fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>WHAT WE OFFER</div>
            <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 44, letterSpacing: 2, margin: 0 }}>EVERYTHING YOU NEED</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={i}
                onClick={() => f.link && onNavigate("simulator")}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24, cursor: f.link ? "pointer" : "default", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <span style={{ fontSize: 28 }}>{f.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: `${f.tagColor}18`, color: f.tagColor, border: `1px solid ${f.tagColor}40` }}>{f.tag}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
          <div>
            <div style={{ fontSize: 12, color: "#c9a84c", fontWeight: 600, letterSpacing: 2, marginBottom: 8 }}>LATEST</div>
            <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 40, letterSpacing: 2, margin: 0 }}>MATCH PREVIEWS & NEWS</h2>
          </div>
          <button style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", fontFamily: "inherit", fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}>View all →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {NEWS.map((n, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24, cursor: "pointer", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(201,168,76,0.12)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.25)" }}>{n.category}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{n.time}</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 12px", lineHeight: 1.5 }}>{n.title}</h3>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{n.read}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ margin: "0 32px 80px", background: "linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.05))", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 20, padding: "52px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1136, marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1 }}>
        <div>
          <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 40, letterSpacing: 2, margin: "0 0 10px" }}>READY TO PREDICT THE WORLD CUP?</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", margin: 0 }}>Free to use. No account needed to start simulating.</p>
        </div>
        <button onClick={() => onNavigate("simulator")} style={{ background: "#c9a84c", border: "none", color: "#080812", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "16px 32px", borderRadius: 10, cursor: "pointer", whiteSpace: "nowrap" }}>
          Start Simulating →
        </button>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 20, letterSpacing: 3, color: "rgba(255,255,255,0.4)" }}>SPORT<span style={{ color: "rgba(201,168,76,0.5)" }}>AQTIC</span></div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>© 2026 Sportaqtic. Built for fans, by fans.</div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <span key={l} style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
