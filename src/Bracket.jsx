import { useState, useEffect } from "react";

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

function getBest3rd(thirdPlaces) {
  const teams = Object.values(thirdPlaces).filter(Boolean);
  return teams
    .sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf)
    .slice(0, 8);
}

function buildR32(qualifiers, thirdPlaces) {
  const g = (id, pos) => qualifiers[id]?.[pos] || null;
  const best3rd = getBest3rd(thirdPlaces);
  const t = (i) => best3rd[i]?.team || null;
  return [
    { id: "r32_1", home: g("A","first"), away: g("B","second") },
    { id: "r32_2", home: g("C","first"), away: g("D","second") },
    { id: "r32_3", home: g("E","first"), away: g("F","second") },
    { id: "r32_4", home: g("G","first"), away: g("H","second") },
    { id: "r32_5", home: g("B","first"), away: g("A","second") },
    { id: "r32_6", home: g("D","first"), away: g("C","second") },
    { id: "r32_7", home: g("F","first"), away: g("E","second") },
    { id: "r32_8", home: g("H","first"), away: g("G","second") },
    { id: "r32_9", home: g("I","first"), away: g("J","second") },
    { id: "r32_10", home: g("K","first"), away: g("L","second") },
    { id: "r32_11", home: g("J","first"), away: g("I","second") },
    { id: "r32_12", home: g("L","first"), away: g("K","second") },
    { id: "r32_13", home: t(0), away: t(1), wildcard: true },
    { id: "r32_14", home: t(2), away: t(3), wildcard: true },
    { id: "r32_15", home: t(4), away: t(5), wildcard: true },
    { id: "r32_16", home: t(6), away: t(7), wildcard: true },
  ];
}

function initRounds(r32) {
  return {
    0: r32,
    1: Array.from({ length: 8 }, (_, i) => ({ id: `r16_${i}`, home: null, away: null })),
    2: Array.from({ length: 4 }, (_, i) => ({ id: `qf_${i}`, home: null, away: null })),
    3: Array.from({ length: 2 }, (_, i) => ({ id: `sf_${i}`, home: null, away: null })),
    4: [{ id: "final", home: null, away: null }],
  };
}

function TeamSlot({ team, onClick, isWinner, isLoser, isWildcard }) {
  return (
    <div onClick={team && !isWildcard ? onClick : undefined}
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 7,
        background: isWinner ? "rgba(201,168,76,0.15)" : isWildcard ? "rgba(59,130,246,0.07)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isWinner ? "rgba(201,168,76,0.4)" : isWildcard ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.08)"}`,
        cursor: team && !isWildcard ? "pointer" : "default",
        opacity: isLoser ? 0.35 : 1, transition: "all 0.15s", minWidth: 160,
      }}
      onMouseEnter={e => { if (team && !isWinner && !isWildcard) e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; }}
      onMouseLeave={e => { if (!isWinner) e.currentTarget.style.borderColor = isWildcard ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.08)"; }}
    >
      {team ? (
        <>
          {isWildcard ? <span style={{ fontSize: 11 }}>🔵</span> : <Flag team={team} size={13} />}
          <span style={{ fontSize: 12, fontWeight: isWinner ? 700 : 500, color: isWinner ? "#c9a84c" : isWildcard ? "#93c5fd" : "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{team}</span>
          {isWinner && <span style={{ marginLeft: "auto", fontSize: 10, color: "#c9a84c" }}>✓</span>}
        </>
      ) : (
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>TBD</span>
      )}
    </div>
  );
}

const ROUND_NAMES = ["Round of 32", "Round of 16", "Quarter-finals", "Semi-finals", "Final"];

export default function Bracket({ onBack, qualifiers: qualifiersProp = {}, thirdPlaces: thirdPlacesProp = {}, bracketWinners, bracketRounds, onWinnersChange, onRoundsChange }) {
  const [qualifiers, setQualifiers] = useState(qualifiersProp);
  const [thirdPlaces, setThirdPlaces] = useState(thirdPlacesProp);

  // Load from Supabase if qualifiers are empty
  useEffect(() => {
    if (Object.keys(qualifiersProp).length > 0) {
      setQualifiers(qualifiersProp);
      setThirdPlaces(thirdPlacesProp);
      return;
    }
    // Try loading from Supabase
    import("./supabase").then(({ supabase }) => {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (!session?.user) return;
        const { data } = await supabase
          .from("predictions")
          .select("predictions")
          .eq("user_id", session.user.id)
          .single();
        if (data?.predictions?.qualifiers) {
          setQualifiers(data.predictions.qualifiers);
          if (onWinnersChange) onWinnersChange({});
        }
        if (data?.predictions?.thirdPlaces) {
          setThirdPlaces(data.predictions.thirdPlaces);
        }
      });
    });
  }, [qualifiersProp, thirdPlacesProp]);

  const r32 = buildR32(qualifiers, thirdPlaces);
  const best3rd = getBest3rd(thirdPlaces);
  const totalGroups = Object.keys(qualifiers).length;

  // Use lifted state from App if available, otherwise init locally
  const [localWinners, setLocalWinners] = useState({});
  const [localRounds, setLocalRounds] = useState(() => initRounds(r32));
  const [activeRound, setActiveRound] = useState(0);

  const winners = bracketWinners && Object.keys(bracketWinners).length > 0 ? bracketWinners : localWinners;
  const rounds = bracketRounds || localRounds;

  // Update R32 when qualifiers change
  useEffect(() => {
    const newR32 = buildR32(qualifiers, thirdPlaces);
    const updatedRounds = { ...rounds, 0: newR32 };
    if (onRoundsChange) onRoundsChange(updatedRounds);
    else setLocalRounds(updatedRounds);
  }, [qualifiers, thirdPlaces]);

  function setWinners(fn) {
    const updated = typeof fn === "function" ? fn(winners) : fn;
    if (onWinnersChange) onWinnersChange(updated);
    else setLocalWinners(updated);
  }

  function setRounds(fn) {
    const updated = typeof fn === "function" ? fn(rounds) : fn;
    if (onRoundsChange) onRoundsChange(updated);
    else setLocalRounds(updated);
  }

  function pickWinner(roundIdx, matchIdx, team) {
    if (!team) return;
    const matchId = rounds[roundIdx][matchIdx].id;
    setWinners(w => ({ ...w, [matchId]: team }));
    if (roundIdx < 4) {
      const nextMatchIdx = Math.floor(matchIdx / 2);
      const isHome = matchIdx % 2 === 0;
      setRounds(prev => {
        const next = [...prev[roundIdx + 1]];
        next[nextMatchIdx] = { ...next[nextMatchIdx], [isHome ? "home" : "away"]: team };
        return { ...prev, [roundIdx + 1]: next };
      });
    }
  }

  const champion = winners[rounds[4][0].id];

  return (
    <div style={{ minHeight: "100vh", background: "#080812", fontFamily: "'DM Sans',sans-serif", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[{ top: "10%", left: "5%", w: 400, color: "rgba(201,168,76,0.05)" }, { top: "60%", left: "70%", w: 500, color: "rgba(59,130,246,0.04)" }].map((o, i) => (
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
          <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: "14px 18px", marginBottom: 20, fontSize: 13, color: "rgba(201,168,76,0.8)" }}>
            ⚠️ {totalGroups}/12 groups complete — finish the simulator to fill all bracket slots automatically.
          </div>
        )}

        {best3rd.length > 0 && (
          <div style={{ background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 12 }}>
            <div style={{ color: "#93c5fd", fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>🔵 BEST 3RD PLACE TEAMS ({best3rd.length}/8 qualified)</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {best3rd.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 6, padding: "3px 8px" }}>
                  <Flag team={t.team} size={12} />
                  <span style={{ fontSize: 11, color: "#93c5fd", fontWeight: 600 }}>{t.team}</span>
                  <span style={{ fontSize: 10, color: "rgba(147,197,253,0.5)" }}>{t.pts}pts</span>
                </div>
              ))}
            </div>
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

        {/* Matches */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {rounds[activeRound].map((match, i) => (
            <div key={match.id} style={{ background: match.wildcard ? "rgba(59,130,246,0.05)" : "rgba(255,255,255,0.03)", border: `1px solid ${match.wildcard ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.07)"}`, borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 10, color: match.wildcard ? "rgba(147,197,253,0.7)" : "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>
                {match.wildcard ? "🔵 BEST 3RD PLACE" : `MATCH ${i + 1}`}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TeamSlot team={match.home} onClick={() => pickWinner(activeRound, i, match.home)} isWinner={winners[match.id] === match.home} isLoser={winners[match.id] && winners[match.id] !== match.home} isWildcard={match.wildcard} />
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", textAlign: "center", letterSpacing: 1 }}>VS</div>
                <TeamSlot team={match.away} onClick={() => pickWinner(activeRound, i, match.away)} isWinner={winners[match.id] === match.away} isLoser={winners[match.id] && winners[match.id] !== match.away} isWildcard={match.wildcard} />
              </div>
              {match.home && match.away && !winners[match.id] && !match.wildcard && (
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 8 }}>Click a team to advance</div>
              )}
            </div>
          ))}
        </div>

        {/* Champion */}
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
