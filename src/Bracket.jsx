import { useState, useEffect } from "react";
import { supabase } from "./supabase";

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
  return <img src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`} alt={team} style={{ width: Math.round(size * 1.5), height: size, borderRadius: 2, objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />;
}

function calcThirdFromMatches(groupMatches, teams) {
  const t = {};
  teams.forEach(n => t[n] = { team: n, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });
  groupMatches.forEach(({ home, away, homeScore, awayScore }) => {
    if (homeScore === null || awayScore === null) return;
    const h = t[home], a = t[away];
    h.p++; a.p++;
    h.gf += homeScore; h.ga += awayScore;
    a.gf += awayScore; a.ga += homeScore;
    if (homeScore > awayScore) { h.w++; h.pts += 3; a.l++; }
    else if (homeScore < awayScore) { a.w++; a.pts += 3; h.l++; }
    else { h.d++; h.pts++; a.d++; a.pts++; }
  });
  return Object.values(t).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf);
}

function getBest3rd(thirdPlaces) {
  return Object.values(thirdPlaces)
    .filter(Boolean)
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

const ROUND_NAMES = ["Round of 32", "Round of 16", "Quarter-finals", "Semi-finals", "Final"];

const ROUND_LABELS = ["R32", "R16", "QF", "SF", "Final"];

function BracketSummary({ rounds, winners, champion, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#080812", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 20, padding: 28, maxWidth: 700, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 32, letterSpacing: 3, color: "#c9a84c", marginBottom: 4 }}>YOUR BRACKET</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Here's how you predicted the World Cup 2026</div>
        </div>

        {/* Champion */}
        <div style={{ background: "linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.05))", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 14, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 28 }}>🥇</span>
          <div>
            <div style={{ fontSize: 10, color: "rgba(201,168,76,0.6)", letterSpacing: 2, fontWeight: 700, marginBottom: 4 }}>WORLD CUP 2026 CHAMPION</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Flag team={champion} size={20} />
              <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 28, color: "#c9a84c", letterSpacing: 2 }}>{champion}</span>
            </div>
          </div>
        </div>

        {/* Rounds summary */}
        {[4, 3, 2, 1].map(roundIdx => {
          const roundWinners = rounds[roundIdx - 1]?.map(match => winners[match.id]).filter(Boolean) || [];
          if (roundWinners.length === 0) return null;
          const labels = ["Round of 32", "Round of 16", "Quarter-finals", "Semi-finals"];
          return (
            <div key={roundIdx} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>{labels[roundIdx - 1]}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {roundWinners.map((team, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "5px 10px" }}>
                    <Flag team={team} size={12} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{team}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <button onClick={onClose}
          style={{ width: "100%", marginTop: 8, background: "#c9a84c", border: "none", color: "#080812", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, padding: "13px", borderRadius: 10, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </div>
  );
}
export default function Bracket({ onBack, bracketWinners, bracketRounds, onWinnersChange, onRoundsChange }) {
  const [qualifiers, setQualifiers] = useState({});
  const [thirdPlaces, setThirdPlaces] = useState({});
  const [winners, setWinners] = useState(bracketWinners || {});
  const [rounds, setRounds] = useState(null);
  const [activeRound, setActiveRound] = useState(0);
  const [loaded, setLoaded] = useState(false);
const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    async function load() {
      let q = {};
      let tp = {};

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data } = await supabase
            .from("predictions")
            .select("predictions")
            .eq("user_id", session.user.id)
            .single();

          if (data?.predictions?.qualifiers) {
            q = data.predictions.qualifiers;
          }

          if (data?.predictions?.matches) {
            Object.keys(GROUPS).forEach(groupId => {
              const groupMatches = data.predictions.matches[groupId];
              if (!groupMatches) return;
              const allPlayed = groupMatches.every(m => m.homeScore !== null && m.awayScore !== null);
              if (!allPlayed) return;
              const standings = calcThirdFromMatches(groupMatches, GROUPS[groupId]);
              if (standings[2]) {
                tp[groupId] = {
                  team: standings[2].team,
                  pts: standings[2].pts,
                  gf: standings[2].gf,
                  ga: standings[2].ga,
                };
              }
            });
          }
        }
      } catch (e) {
        console.error("Load error:", e);
      }

      setQualifiers(q);
      setThirdPlaces(tp);
      const r32 = buildR32(q, tp);
      setRounds(bracketRounds || initRounds(r32));
      setLoaded(true);
    }
    load();
  }, []);

  function updateWinners(updated) {
    setWinners(updated);
    if (onWinnersChange) onWinnersChange(updated);
  }

  function updateRounds(updated) {
    setRounds(updated);
    if (onRoundsChange) onRoundsChange(updated);
  }

  function pickWinner(roundIdx, matchIdx, team) {
  if (!team || !rounds) return;
  const matchId = rounds[roundIdx][matchIdx].id;
  const newWinners = { ...winners, [matchId]: team };
  updateWinners(newWinners);
  if (roundIdx < 4) {
    const nextMatchIdx = Math.floor(matchIdx / 2);
    const isHome = matchIdx % 2 === 0;
    const newRounds = { ...rounds };
    const next = [...newRounds[roundIdx + 1]];
    next[nextMatchIdx] = { ...next[nextMatchIdx], [isHome ? "home" : "away"]: team };
    newRounds[roundIdx + 1] = next;
    updateRounds(newRounds);
  }
  // Show summary when Final winner is picked
  if (roundIdx === 4) {
    setTimeout(() => setShowSummary(true), 400);
  }
}

  if (!loaded || !rounds) return (
    <div style={{ minHeight: "100vh", background: "#080812", display: "flex", alignItems: "center", justifyContent: "center", color: "#c9a84c", fontFamily: "'Bebas Neue',cursive", fontSize: 24, letterSpacing: 3 }}>
      LOADING...
    </div>
  );

  const best3rd = getBest3rd(thirdPlaces);
  const totalGroups = Object.keys(qualifiers).length;
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
            ⚠️ {totalGroups}/12 groups complete — finish the simulator to fill all bracket slots.
          </div>
        )}

        {best3rd.length > 0 && (
          <div style={{ background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 12 }}>
            <div style={{ color: "#93c5fd", fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>🔵 BEST 3RD PLACE TEAMS ({best3rd.length}/8)</div>
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
              {name} {i < 4 && <span style={{ fontSize: 9, opacity: 0.5 }}>({[16,8,4,2,1][i]})</span>}
            </button>
          ))}
        </div>

        {/* Matches */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {rounds[activeRound].map((match, i) => {
            const w = winners[match.id];
            return (
              <div key={match.id} style={{ background: match.wildcard ? "rgba(59,130,246,0.05)" : "rgba(255,255,255,0.03)", border: `1px solid ${match.wildcard ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.07)"}`, borderRadius: 14, padding: 14 }}>
                <div style={{ fontSize: 10, color: match.wildcard ? "rgba(147,197,253,0.7)" : "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>
                  {match.wildcard ? "🔵 BEST 3RD PLACE" : `MATCH ${i + 1}`}
                </div>
                {[match.home, match.away].map((team, ti) => (
                  <div key={ti}>
                    <div
                      onClick={() => team && pickWinner(activeRound, i, team)}
                      style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
                        borderRadius: 7, marginBottom: ti === 0 ? 3 : 0,
                        background: w === team ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${w === team ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.08)"}`,
                        cursor: team ? "pointer" : "default",
                        opacity: w && w !== team ? 0.35 : 1,
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { if (team && w !== team) e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; }}
                      onMouseLeave={e => { if (w !== team) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                    >
                      {team ? (
                        <>
                          <Flag team={team} size={13} />
                          <span style={{ fontSize: 12, fontWeight: w === team ? 700 : 500, color: w === team ? "#c9a84c" : "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{team}</span>
                          {w === team && <span style={{ marginLeft: "auto", fontSize: 10, color: "#c9a84c" }}>✓</span>}
                        </>
                      ) : (
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>TBD</span>
                      )}
                    </div>
                    {ti === 0 && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", textAlign: "center", letterSpacing: 1, marginBottom: 3 }}>VS</div>}
                  </div>
                ))}
                {match.home && match.away && !w && (
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 8 }}>Click to advance</div>
                )}
              </div>
            );
          })}
        </div>

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

{showSummary && champion && (
  <BracketSummary
    rounds={rounds}
    winners={winners}
    champion={champion}
    onClose={() => setShowSummary(false)}
  />
)}
      </div>
    </div>
  );
}
