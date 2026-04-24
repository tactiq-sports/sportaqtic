import { useState } from "react";

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
  return <img src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`} alt={team} style={{ width: Math.round(size * 1.5), height: size, borderRadius: 2, objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />;
}

function TeamSlot({ team, onClick, isWinner, isLoser }) {
  return (
    <div onClick={team ? onClick : undefined}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "7px 10px", borderRadius: 7,
        background: isWinner ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isWinner ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.08)"}`,
        cursor: team ? "pointer" : "default",
        opacity: isLoser ? 0.35 : 1,
        transition: "all 0.15s",
        minWidth: 160,
      }}
      onMouseEnter={e => { if (team && !isWinner) e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; }}
      onMouseLeave={e => { if (!isWinner) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
    >
      {team ? (
        <>
          <Flag team={team} size={13} />
          <span style={{ fontSize: 12, fontWeight: isWinner ? 700 : 500, color: isWinner ? "#c9a84c" : "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{team}</span>
          {isWinner && <span style={{ marginLeft: "auto", fontSize: 10, color: "#c9a84c" }}>✓</span>}
        </>
      ) : (
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>TBD</span>
      )}
    </div>
  );
}

function Match({ home, away, winner, onPick, round }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <TeamSlot team={home} onClick={() => onPick(home)} isWinner={winner === home} isLoser={winner && winner !== home} />
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", textAlign: "center", letterSpacing: 1 }}>VS</div>
      <TeamSlot team={away} onClick={() => onPick(away)} isWinner={winner === away} isLoser={winner && winner !== away} />
    </div>
  );
}

// Build R32 matchups from group qualifiers
// Official FIFA 2026 R32 bracket pairing pattern
function buildR32(qualifiers) {
  const g = (id, pos) => qualifiers[id]?.[pos] || null;
  return [
    // Bracket Left side
    { id: "r32_1", home: g("A","first"), away: g("B","second") },
    { id: "r32_2", home: g("C","first"), away: g("D","second") },
    { id: "r32_3", home: g("E","first"), away: g("F","second") },
    { id: "r32_4", home: g("G","first"), away: g("H","second") },
    // Bracket Right side
    { id: "r32_5", home: g("B","first"), away: g("A","second") },
    { id: "r32_6", home: g("D","first"), away: g("C","second") },
    { id: "r32_7", home: g("F","first"), away: g("E","second") },
    { id: "r32_8", home: g("H","first"), away: g("G","second") },
    { id: "r32_9", home: g("I","first"), away: g("J","second") },
    { id: "r32_10", home: g("K","first"), away: g("L","second") },
    { id: "r32_11", home: g("J","first"), away: g("I","second") },
    { id: "r32_12", home: g("L","first"), away: g("K","second") },
    { id: "r32_13", home: "Best 3rd (Groups A-D)", away: "Best 3rd (Groups E-H)", wildcard: true },
{ id: "r32_14", home: "Best 3rd (Groups I-L)", away: "Best 3rd (Groups A-D)", wildcard: true },
{ id: "r32_15", home: "Best 3rd (Groups E-H)", away: "Best 3rd (Groups I-L)", wildcard: true },
{ id: "r32_16", home: "Best 3rd (Groups A-D)", away: "Best 3rd (Groups E-H)", wildcard: true },
  ];
}

const ROUND_NAMES = ["Round of 32", "Round of 16", "Quarter-finals", "Semi-finals", "Final"];

export default function Bracket({ onBack, qualifiers = {} }) {
  const r32 = buildR32(qualifiers);
  const totalGroups = Object.keys(qualifiers).length;

  // rounds[0] = R32 (16 matches), rounds[1] = R16 (8), rounds[2] = QF (4), rounds[3] = SF (2), rounds[4] = Final (1)
  const [rounds, setRounds] = useState({
    0: r32,
    1: Array.from({ length: 8 }, (_, i) => ({ id: `r16_${i}`, home: null, away: null })),
    2: Array.from({ length: 4 }, (_, i) => ({ id: `qf_${i}`, home: null, away: null })),
    3: Array.from({ length: 2 }, (_, i) => ({ id: `sf_${i}`, home: null, away: null })),
    4: [{ id: "final", home: null, away: null }],
  });
  const [winners, setWinners] = useState({});
  const [activeRound, setActiveRound] = useState(0);

  function pickWinner(roundIdx, matchIdx, team) {
    const matchId = rounds[roundIdx][matchIdx].id;
    setWinners(w => ({ ...w, [matchId]: team }));

    // Advance winner to next round
    if (roundIdx < 4) {
      const nextMatchIdx = Math.floor(matchIdx / 2);
      const isHome = matchIdx % 2 === 0;
      setRounds(prev => {
        const next = [...prev[roundIdx + 1]];
        next[nextMatchIdx] = {
          ...next[nextMatchIdx],
          [isHome ? "home" : "away"]: team,
        };
        return { ...prev, [roundIdx + 1]: next };
      });
    }
  }

  const champion = winners[rounds[4][0].id];

  return (
    <div style={{ minHeight: "100vh", background: "#080812", fontFamily: "'DM Sans',sans-serif", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Animated background orbs */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[
          { top: "10%", left: "5%", w: 400, color: "rgba(201,168,76,0.05)" },
          { top: "60%", left: "70%", w: 500, color: "rgba(59,130,246,0.04)" },
        ].map((o, i) => (
          <div key={i} style={{ position: "absolute", top: o.top, left: o.left, width: o.w, height: o.w, borderRadius: "50%", background: `radial-gradient(circle,${o.color} 0%,transparent 70%)` }} />
        ))}
      </div>

      {/* Navbar */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, background: "rgba(8,8,18,0.92)", backdropFilter: "blur(16px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)", fontFamily: "inherit", fontSize: 12, padding: "6px 12px", borderRadius: 7, cursor: "pointer" }}>← Home</button>
          <div>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 20, letterSpacing: 3, color: "#c9a84c", lineHeight: 1 }}>WORLD CUP 2026</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 2 }}>KNOCKOUT BRACKET</div>
          </div>
        </div>
        {champion && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 10, padding: "8px 16px" }}>
            <span style={{ fontSize: 18 }}>🏆</span>
            <div>
              <div style={{ fontSize: 9, color: "rgba(201,168,76,0.6)", letterSpacing: 2, fontWeight: 700 }}>YOUR CHAMPION</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Flag team={champion} size={14} />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#c9a84c" }}>{champion}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "24px 18px", position: "relative", zIndex: 1 }}>

        {totalGroups < 12 && (
          <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: "14px 18px", marginBottom: 24, fontSize: 13, color: "rgba(201,168,76,0.8)" }}>
            ⚠️ You've only completed {totalGroups}/12 groups in the simulator. Go back and finish the group stage to fill all bracket slots automatically.
          </div>
        )}

        {/* Round tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28, overflowX: "auto", paddingBottom: 4 }}>
          {ROUND_NAMES.map((name, i) => (
            <button key={i} onClick={() => setActiveRound(i)}
              style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid", whiteSpace: "nowrap", borderColor: activeRound === i ? "#c9a84c" : "rgba(255,255,255,0.12)", background: activeRound === i ? "rgba(201,168,76,0.14)" : "transparent", color: activeRound === i ? "#c9a84c" : "rgba(255,255,255,0.4)", fontFamily: "inherit", fontSize: 11, fontWeight: 700, textTransform: "uppercase", cursor: "pointer", letterSpacing: 1 }}>
              {name}
              {i < 4 && <span style={{ marginLeft: 6, fontSize: 9, opacity: 0.6 }}>({[16,8,4,2,1][i]})</span>}
            </button>
          ))}
        </div>

        {/* Matches grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {rounds[activeRound].map((match, i) => (
            <div key={match.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 10, color: match.wildcard ? "rgba(59,130,246,0.7)" : "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>
  {match.wildcard ? "🔵 WILDCARD SLOT" : `MATCH ${i + 1}`}
</div>
              <Match
                home={match.home}
                away={match.away}
                winner={winners[match.id]}
                onPick={(team) => pickWinner(activeRound, i, team)}
                round={activeRound}
              />
              {match.home && match.away && !winners[match.id] && (
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 8 }}>
                  Click a team to advance them
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Final champion display */}
        {activeRound === 4 && champion && (
          <div style={{ marginTop: 32, textAlign: "center", padding: 40, background: "linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.04))", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
            <div style={{ fontSize: 11, color: "rgba(201,168,76,0.6)", letterSpacing: 3, fontWeight: 700, marginBottom: 8 }}>WORLD CUP 2026 CHAMPION</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <Flag team={champion} size={32} />
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 48, color: "#c9a84c", letterSpacing: 2 }}>{champion}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
