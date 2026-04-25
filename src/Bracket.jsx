import { useState, useEffect, useRef } from "react";
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
  "England": "gb", "Croatia": "hr", "Ghana": "gh", "Panama": "pa",
};

function Flag({ team, size = 14 }) {
  const code = FLAG_CODES[team];
  if (!code) return null;
  return (
    <img
      src={code === "gb-sct"
  ? "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Flag_of_Scotland.svg/32px-Flag_of_Scotland.svg.png"
  : `https://flagcdn.com/32x24/${code}.png`}
      alt={team}
      style={{ width: Math.round(size * 1.5), height: size, borderRadius: 2, objectFit: "cover", flexShrink: 0 }}
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
        minWidth: 0, overflow: "hidden",
      }}
      onMouseEnter={e => { if (team && !isWinner) e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; }}
      onMouseLeave={e => { if (!isWinner) e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
    >
      {team ? (
        <>
          <Flag team={team} size={11} />
          <span style={{ fontSize: 10, fontWeight: isWinner ? 700 : 500, color: isWinner ? "#c9a84c" : "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>{team}</span>
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

function BracketShareModal({ bracket, winners, champion, onClose }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [flagCache, setFlagCache] = useState({});
  const [flagsLoaded, setFlagsLoaded] = useState(false);

  async function toBase64(url) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch { return null; }
  }

  const sfWinners = bracket.sf.map(m => winners[m.id]).filter(Boolean);
  const finalTeams = [bracket.final[0].home, bracket.final[0].away].filter(Boolean);
  const allTeams = [...new Set([...sfWinners, ...finalTeams, champion].filter(Boolean))];

  useEffect(() => {
    async function loadFlags() {
      const cache = {};
      await Promise.all(allTeams.map(async team => {
        const code = FLAG_CODES[team];
        if (!code) return;
        const b64 = await toBase64(
  code === "gb-sct"
    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Flag_of_Scotland.svg/32px-Flag_of_Scotland.svg.png"
    : `https://flagcdn.com/32x24/${code}.png`
);
        if (b64) cache[team] = b64;
      }));
      setFlagCache(cache);
      setFlagsLoaded(true);
    }
    loadFlags();
  }, []);

  async function downloadImage() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0d0d1a",
        scale: 2,
        useCORS: false,
        allowTaint: false,
        imageTimeout: 15000,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = "my-worldcup-2026-bracket.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) { console.error(e); }
    setDownloading(false);
  }

  function FlagCached({ team, size = 16 }) {
    const b64 = flagCache[team];
    if (!b64) return <div style={{ width: Math.round(size * 1.5), height: size, borderRadius: 2, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />;
    return <img src={b64} alt={team} style={{ width: Math.round(size * 1.5), height: size, borderRadius: 2, objectFit: "cover", flexShrink: 0 }} />;
  }

  function TeamPill({ team, isWinner }) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 7,
        background: isWinner ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.05)",
        border: `1px solid ${isWinner ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: 7, padding: "7px 10px",
      }}>
        <FlagCached team={team} size={15} />
        <span style={{ fontSize: 13, fontWeight: isWinner ? 700 : 500, color: isWinner ? "#c9a84c" : "#fff", whiteSpace: "nowrap" }}>{team}</span>
        {isWinner && <span style={{ fontSize: 12 }}>🏆</span>}
      </div>
    );
  }

  const leftSF = winners[bracket.sf[0]?.id];
  const rightSF = winners[bracket.sf[1]?.id];
  const finalHome = bracket.final[0]?.home;
  const finalAway = bracket.final[0]?.away;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 560, width: "100%" }}>

        <div ref={cardRef} style={{ background: "#0d0d1a", borderRadius: 16, padding: 24, border: "1px solid rgba(201,168,76,0.3)", fontFamily: "'DM Sans',sans-serif" }}>
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700&display=swap');`}</style>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 22, color: "#c9a84c", letterSpacing: 3 }}>MY WORLD CUP 2026 BRACKET</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 1 }}>GETSPORTACTIQ.COM</div>
          </div>

          <div style={{ display: "flex", alignItems: "stretch", gap: 6 }}>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: "rgba(201,168,76,0.5)", fontWeight: 700, letterSpacing: 2, marginBottom: 8, textAlign: "center" }}>SEMI-FINALS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[leftSF, rightSF].map((team, i) => team ? (
                  <TeamPill key={i} team={team} isWinner={false} />
                ) : (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "7px 10px", fontSize: 11, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>TBD</div>
                ))}
              </div>
            </div>

            <div style={{ color: "rgba(201,168,76,0.4)", fontSize: 20, fontWeight: 700, padding: "0 4px", display: "flex", alignItems: "center" }}>→</div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: "rgba(201,168,76,0.5)", fontWeight: 700, letterSpacing: 2, marginBottom: 8, textAlign: "center" }}>FINAL</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[finalHome, finalAway].map((team, i) => team ? (
                  <TeamPill key={i} team={team} isWinner={false} />
                ) : (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "7px 10px", fontSize: 11, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>TBD</div>
                ))}
              </div>
            </div>

            <div style={{ color: "rgba(201,168,76,0.4)", fontSize: 20, fontWeight: 700, padding: "0 4px", display: "flex", alignItems: "center" }}>→</div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: "rgba(201,168,76,0.5)", fontWeight: 700, letterSpacing: 2, marginBottom: 8, textAlign: "center" }}>🏆 CHAMPION</div>
              {champion ? (
                <div style={{ background: "rgba(201,168,76,0.12)", border: "2px solid rgba(201,168,76,0.5)", borderRadius: 10, padding: "14px 12px", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                    <FlagCached team={champion} size={24} />
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 20, color: "#c9a84c", letterSpacing: 2 }}>{champion}</div>
                  <div style={{ fontSize: 18, marginTop: 4 }}>🏆</div>
                </div>
              ) : (
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "14px 12px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 11, fontStyle: "italic" }}>TBD</div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 18, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>Make your predictions at</div>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 13, color: "rgba(201,168,76,0.5)", letterSpacing: 2 }}>GETSPORTACTIQ.COM</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={downloadImage} disabled={downloading || !flagsLoaded}
            style={{ flex: 1, background: "#c9a84c", border: "none", color: "#0d0d1a", fontFamily: "inherit", fontSize: 14, fontWeight: 700, padding: "13px", borderRadius: 10, cursor: (downloading || !flagsLoaded) ? "not-allowed" : "pointer", opacity: (downloading || !flagsLoaded) ? 0.7 : 1 }}>
            {downloading ? "Generating..." : !flagsLoaded ? "Loading flags..." : "⬇️ Download Image"}
          </button>
          <button onClick={onClose}
            style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "inherit", fontSize: 14, fontWeight: 600, padding: "13px", borderRadius: 10, cursor: "pointer" }}>
            Close
          </button>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
          {flagsLoaded ? "Screenshot or download and share!" : "Loading flags..."}
        </div>
      </div>
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
      if (savedBracket) {
        savedBracket.r32 = base.r32;
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

  function resetBracket() {
    if (!window.confirm("Reset your entire bracket? This cannot be undone.")) return;
    const freshBracket = buildBracket(qualifiers, thirdPlaces);
    setBracket(freshBracket);
    setWinners({});
    if (onWinnersChange) onWinnersChange({});
    if (user) saveBracket({}, freshBracket);
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
    if (roundKey === "final") setTimeout(() => setShowCelebration(true), 400);
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
              <span>🏆</span>
              <Flag team={champion} size={13} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#c9a84c" }}>{champion}</span>
            </div>
          )}
          <button onClick={resetBracket}
            style={{ padding: "6px 10px", borderRadius: 7, border: "1px solid rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.1)", color: "#f87171", fontFamily: "inherit", fontSize: 10, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
            RESET
          </button>
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

        {/* Bracket */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 110px 1fr 1fr 1fr 1fr", gap: 4, height: 640, alignItems: "stretch", minWidth: 900 }}>
          <BracketColumn matches={leftR32} winners={winners} onPick={(i, t) => pickWinner("r32", i, t)} />
          <BracketColumn matches={leftR16} winners={winners} onPick={(i, t) => pickWinner("r16", i, t)} />
          <BracketColumn matches={leftQF} winners={winners} onPick={(i, t) => pickWinner("qf", i, t)} />
          <BracketColumn matches={leftSF} winners={winners} onPick={(i, t) => pickWinner("sf", i, t)} />

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

      {/* Celebration */}
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

      {showShareBracket && (
        <BracketShareModal
          bracket={bracket}
          winners={winners}
          champion={champion}
          onClose={() => setShowShareBracket(false)}
        />
      )}
    </div>
  );
}
