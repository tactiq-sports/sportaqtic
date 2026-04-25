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

function Flag({ team, size = 14 }) {
  const code = FLAG_CODES[team];
  if (!code) return null;
  return (
    <img
      src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`}
      alt={team}
      style={{ width: Math.round(size * 1.5), height: size, borderRadius: 2, objectFit: "cover", flexShrink: 0, display: "block" }}
      onError={e => { e.target.style.display = "none"; }}
    />
  );
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

function buildBracket(qualifiers, thirdPlaces) {
  const g = (id, pos) => qualifiers[id]?.[pos] || null;
  const best3rd = getBest3rd(thirdPlaces);
  const t = (i) => best3rd[i]?.team || null;
  const r32 = [
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
    { id: "r32_11", home: t(0), away: t(1), wildcard: true },
    { id: "r32_12", home: t(2), away: t(3), wildcard: true },
    { id: "r32_13", home: g("J","first"), away: g("I","second") },
    { id: "r32_14", home: g("L","first"), away: g("K","second") },
    { id: "r32_15", home: t(4), away: t(5), wildcard: true },
    { id: "r32_16", home: t(6), away: t(7), wildcard: true },
  ];
  return {
    r32,
    r16: Array.from({ length: 8 }, (_, i) => ({ id: `r16_${i}`, home: null, away: null })),
    qf: Array.from({ length: 4 }, (_, i) => ({ id: `qf_${i}`, home: null, away: null })),
    sf: Array.from({ length: 2 }, (_, i) => ({ id: `sf_${i}`, home: null, away: null })),
    final: [{ id: "final", home: null, away: null }],
  };
}

function TeamSlot({ team, winner, onClick, isWildcard }) {
  const isWinner = winner === team;
  const isLoser = winner && winner !== team;
  return (
    <div
      onClick={() => team && onClick && onClick(team)}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "4px 7px", height: 28,
        background: isWinner ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isWinner ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: 5,
        cursor: team ? "pointer" : "default",
        opacity: isLoser ? 0.3 : 1,
        transition: "all 0.15s",
        minWidth: 0,
        overflow: "hidden",
      }}
      onMouseEnter={e => { if (team && !isWinner) e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; }}
      onMouseLeave={e => { if (!isWinner) e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
    >
      {team ? (
        <>
          {isWildcard
            ? <span style={{ fontSize: 9, flexShrink: 0 }}>🔵</span>
            : <Flag team={team} size={11} />
          }
          <span style={{
            fontSize: 10, fontWeight: isWinner ? 700 : 500,
            color: isWinner ? "#c9a84c" : "#fff",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            flex: 1, minWidth: 0,
          }}>{team}</span>
          {isWinner && <span style={{ fontSize: 8, color: "#c9a84c", flexShrink: 0 }}>✓</span>}
        </>
      ) : (
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>TBD</span>
      )}
    </div>
  );
}

function MatchBox({ match, winner, onPick }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
      <TeamSlot team={match?.home} winner={winner} onClick={onPick} isWildcard={match?.wildcard} />
      <TeamSlot team={match?.away} winner={winner} onClick={onPick} isWildcard={match?.wildcard} />
    </div>
  );
}

function BracketColumn({ matches, winners, onPick }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", height: "100%" }}>
      {matches.map((match, i) => (
        <div key={match.id} style={{ padding: "3px 2px" }}>
          <MatchBox
            match={match}
            winner={winners[match.id]}
            onPick={(team) => onPick(i, team)}
          />
        </div>
      ))}
    </div>
  );
}

export default function Bracket({ onBack, bracketWinners, onWinnersChange }) {
  const [qualifiers, setQualifiers] = useState({});
  const [thirdPlaces, setThirdPlaces] = useState({});
  const [winners, setWinners] = useState(bracketWinners || {});
  const [bracket, setBracket] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showShareBracket, setShowShareBracket] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load() {
      let q = {};
      let tp = {};
      let savedWinners = {};
      let savedBracket = null;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const { data } = await supabase
            .from("predictions")
            .select("predictions, bracket")
            .eq("user_id", session.user.id)
            .single();

          if (data?.predictions?.qualifiers) q = data.predictions.qualifiers;
          if (data?.predictions?.matches) {
            Object.keys(GROUPS).forEach(groupId => {
              const groupMatches = data.predictions.matches[groupId];
              if (!groupMatches) return;
              const allPlayed = groupMatches.every(m => m.homeScore !== null && m.awayScore !== null);
              if (!allPlayed) return;
              const standings = calcThirdFromMatches(groupMatches, GROUPS[groupId]);
              if (standings[2]) tp[groupId] = { team: standings[2].team, pts: standings[2].pts, gf: standings[2].gf, ga: standings[2].ga };
            });
          }
          if (data?.bracket?.winners) savedWinners = data.bracket.winners;
          if (data?.bracket?.rounds) savedBracket = data.bracket.rounds;
        }
      } catch (e) { console.error(e); }

      setQualifiers(q);
      setThirdPlaces(tp);

      const base = buildBracket(q, tp);

      // If we have saved bracket rounds, merge with fresh R32
      if (savedBracket) {
        savedBracket.r32 = base.r32; // always use fresh R32 from qualifiers
        setBracket(savedBracket);
      } else {
        setBracket(base);
      }

      setWinners(savedWinners);
      setLoaded(true);
    }
    load();
  }, []);

  async function saveBracket(newWinners, newBracket) {
    if (!user) return;
    setSaveMsg("Saving...");
    const { error } = await supabase
      .from("predictions")
      .update({ bracket: { winners: newWinners, rounds: newBracket } })
      .eq("user_id", user.id);
    if (!error) {
      setSaveMsg("✓ Saved!");
      setTimeout(() => setSaveMsg(""), 3000);
    } else {
      setSaveMsg("Error");
      setTimeout(() => setSaveMsg(""), 3000);
    }
  }

  function pickWinner(roundKey, matchIdx, team) {
    if (!team || !bracket) return;
    const nextRound = { r32: "r16", r16: "qf", qf: "sf", sf: "final" };
    const match = bracket[roundKey][matchIdx];
    const newWinners = { ...winners, [match.id]: team };
    setWinners(newWinners);
    if (onWinnersChange) onWinnersChange(newWinners);

    const newBracket = { ...bracket };
    if (nextRound[roundKey]) {
      const next = nextRound[roundKey];
      const nextMatchIdx = Math.floor(matchIdx / 2);
      const isHome = matchIdx % 2 === 0;
      const nextMatches = [...newBracket[next]];
      nextMatches[nextMatchIdx] = { ...nextMatches[nextMatchIdx], [isHome ? "home" : "away"]: team };
      newBracket[next] = nextMatches;
      setBracket(newBracket);
    }

    saveBracket(newWinners, newBracket);

    if (roundKey === "final") {
      setTimeout(() => setShowCelebration(true), 400);
    }
  }

  if (!loaded || !bracket) return (
    <div style={{ minHeight: "100vh", background: "#080812", display: "flex", alignItems: "center", justifyContent: "center", color: "#c9a84c", fontFamily: "'Bebas Neue',cursive", fontSize: 24, letterSpacing: 3 }}>
      LOADING...
    </div>
  );

  const champion = winners[bracket.final[0].id];
  const best3rd = getBest3rd(thirdPlaces);
  const totalGroups = Object.keys(qualifiers).length;

  const leftR32 = bracket.r32.slice(0, 8);
  const rightR32 = bracket.r32.slice(8, 16);
  const leftR16 = bracket.r16.slice(0, 4);
  const rightR16 = bracket.r16.slice(4, 8);
  const leftQF = bracket.qf.slice(0, 2);
  const rightQF = bracket.qf.slice(2, 4);
  const leftSF = bracket.sf.slice(0, 1);
  const rightSF = bracket.sf.slice(1, 2);

  return (
    <div style={{ minHeight: "100vh", background: "#080812", fontFamily: "'DM Sans',sans-serif", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[{ top: "10%", left: "5%", w: 400, color: "rgba(201,168,76,0.05)" }, { top: "60%", left: "70%", w: 500, color: "rgba(59,130,246,0.04)" }].map((o, i) => (
          <div key={i} style={{ position: "absolute", top: o.top, left: o.left, width: o.w, height: o.w, borderRadius: "50%", background: `radial-gradient(circle,${o.color} 0%,transparent 70%)` }} />
        ))}
      </div>

      {/* Navbar */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 16px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, background: "rgba(8,8,18,0.92)", backdropFilter: "blur(16px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)", fontFamily: "inherit", fontSize: 12, padding: "5px 10px", borderRadius: 7, cursor: "pointer", whiteSpace: "nowrap" }}>← Home</button>
          <div>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 18, letterSpacing: 3, color: "#c9a84c", lineHeight: 1 }}>WORLD CUP 2026</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: 2 }}>KNOCKOUT BRACKET</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {saveMsg && <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700 }}>{saveMsg}</span>}
          {!user && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Log in to save</span>}
          {champion && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 8, padding: "5px 10px" }}>
              <span style={{ fontSize: 14 }}>🏆</span>
              <Flag team={champion} size={13} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#c9a84c" }}>{champion}</span>
            </div>
          )}
          <button onClick={() => setShowShareBracket(true)}
            style={{ padding: "6px 12px", borderRadius: 7, border: "1px solid #c9a84c", background: "#c9a84c", color: "#080812", fontFamily: "inherit", fontSize: 10, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
            SHARE 🏆
          </button>
        </div>
      </div>

      <div style={{ padding: "16px 12px", position: "relative", zIndex: 1, overflowX: "auto" }}>

        {totalGroups < 12 && (
          <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "rgba(201,168,76,0.8)" }}>
            ⚠️ {totalGroups}/12 groups complete — finish the simulator to fill all bracket slots.
          </div>
        )}

        {/* Round labels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 110px 1fr 1fr 1fr 1fr", gap: 4, marginBottom: 6, textAlign: "center", minWidth: 900 }}>
          {["R32","R16","QF","SF","FINAL","SF","QF","R16","R32"].map((l, i) => (
            <div key={i} style={{ fontSize: 9, color: i === 4 ? "#c9a84c" : "rgba(201,168,76,0.5)", fontWeight: 700, letterSpacing: 1 }}>{l}</div>
          ))}
        </div>

        {/* Bracket tree */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 110px 1fr 1fr 1fr 1fr", gap: 4, height: 640, alignItems: "stretch", minWidth: 900 }}>

          <BracketColumn matches={leftR32} winners={winners} onPick={(i, t) => pickWinner("r32", i, t)} />
          <BracketColumn matches={leftR16} winners={winners} onPick={(i, t) => pickWinner("r16", i, t)} />
          <BracketColumn matches={leftQF} winners={winners} onPick={(i, t) => pickWinner("qf", i, t)} />
          <BracketColumn matches={leftSF} winners={winners} onPick={(i, t) => pickWinner("sf", i, t)} />

          {/* FINAL */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <MatchBox
              match={bracket.final[0]}
              winner={winners[bracket.final[0].id]}
              onPick={(team) => pickWinner("final", 0, team)}
            />
            {champion && (
              <div style={{ textAlign: "center", marginTop: 8 }}>
                <div style={{ fontSize: 20 }}>🏆</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 4 }}>
                  <Flag team={champion} size={12} />
                  <span style={{ fontSize: 9, color: "#c9a84c", fontWeight: 700 }}>{champion}</span>
                </div>
              </div>
            )}
          </div>

          <BracketColumn matches={rightSF} winners={winners} onPick={(i, t) => pickWinner("sf", i + 1, t)} />
          <BracketColumn matches={rightQF} winners={winners} onPick={(i, t) => pickWinner("qf", i + 2, t)} />
          <BracketColumn matches={rightR16} winners={winners} onPick={(i, t) => pickWinner("r16", i + 4, t)} />
          <BracketColumn matches={rightR32} winners={winners} onPick={(i, t) => pickWinner("r32", i + 8, t)} />

        </div>

        {/* Best 3rd place */}
        {best3rd.length > 0 && (
          <div style={{ background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, padding: "12px 16px", marginTop: 16, fontSize: 12 }}>
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
      </div>

      {/* Celebration modal */}
      {showCelebration && champion && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }}
          onClick={() => setShowCelebration(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#080812", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 20, padding: 40, maxWidth: 420, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 14, letterSpacing: 3, color: "rgba(201,168,76,0.6)", marginBottom: 8 }}>YOUR WORLD CUP 2026 CHAMPION</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 24 }}>
              <Flag team={champion} size={28} />
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 48, color: "#c9a84c", letterSpacing: 3 }}>{champion}</div>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Your full bracket is complete! 🎉</div>
            <button onClick={() => setShowCelebration(false)}
              style={{ width: "100%", background: "#c9a84c", border: "none", color: "#080812", fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "13px", borderRadius: 10, cursor: "pointer" }}>
              View My Bracket
            </button>
          </div>
        </div>
      )}

      {/* Share modal */}
      {showShareBracket && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }}
          onClick={() => setShowShareBracket(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#080812", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 20, padding: 28, maxWidth: 500, width: "100%", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 24, letterSpacing: 3, color: "#c9a84c", marginBottom: 20, textAlign: "center" }}>MY BRACKET PREDICTIONS</div>
            {[
              { label: "ROUND OF 32", matches: bracket.r32 },
              { label: "ROUND OF 16", matches: bracket.r16 },
              { label: "QUARTER-FINALS", matches: bracket.qf },
              { label: "SEMI-FINALS", matches: bracket.sf },
              { label: "🏆 CHAMPION", matches: bracket.final },
            ].map(({ label, matches }) => {
              const rw = matches.map(m => winners[m.id]).filter(Boolean);
              if (rw.length === 0) return null;
              return (
                <div key={label} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: "rgba(201,168,76,0.6)", fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>{label}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {rw.map((team, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "5px 10px" }}>
                        <Flag team={team} size={13} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: label.includes("CHAMPION") ? "#c9a84c" : "#fff" }}>{team}</span>
                        {label.includes("CHAMPION") && <span>🏆</span>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => {
                const lines = ["🏆 My World Cup 2026 Bracket!\n"];
                [
                  { label: "R32", matches: bracket.r32 },
                  { label: "R16", matches: bracket.r16 },
                  { label: "QF", matches: bracket.qf },
                  { label: "SF", matches: bracket.sf },
                  { label: "🏆 Champion", matches: bracket.final },
                ].forEach(({ label, matches }) => {
                  const rw = matches.map(m => winners[m.id]).filter(Boolean);
                  if (rw.length > 0) lines.push(`${label}: ${rw.join(", ")}`);
                });
                lines.push("\nMake your predictions at getsportactiq.com");
                navigator.clipboard.writeText(lines.join("\n"));
              }} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "inherit", fontSize: 13, fontWeight: 600, padding: "12px", borderRadius: 10, cursor: "pointer" }}>
                📋 Copy Text
              </button>
              <button onClick={() => setShowShareBracket(false)}
                style={{ flex: 1, background: "#c9a84c", border: "none", color: "#080812", fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "12px", borderRadius: 10, cursor: "pointer" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
