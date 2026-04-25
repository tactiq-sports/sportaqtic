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
  "Brazil": "br", "Morocco": "ma", "Haiti": "ht", "Scotland": "gb",
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
      src={`https://flagcdn.com/32x24/${code}.png`}
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
          {isWildcard
            ? <span style={{ fontSize: 9, flexShrink: 0 }}>🔵</span>
            : <Flag team={team} size={11} />
          }
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
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 1200, H = 800;
    canvas.width = W;
    canvas.height = H;

    // Background
    ctx.fillStyle = "#0d0d1a";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(201,168,76,0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Header
    ctx.fillStyle = "#c9a84c";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("FIFA WORLD CUP 2026 — MY BRACKET", W / 2, 34);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "10px Arial";
    ctx.fillText("GETSPORTACTIQ.COM", W / 2, 50);

    // Round labels
    const colLabels = ["R32","R16","QF","SF","FINAL","SF","QF","R16","R32"];
    const colW = W / 9;
    ctx.font = "bold 9px Arial";
    colLabels.forEach((r, i) => {
      ctx.fillStyle = i === 4 ? "#c9a84c" : "rgba(201,168,76,0.5)";
      ctx.textAlign = "center";
      ctx.fillText(r, colW * i + colW / 2, 66);
    });

    const startY = 76;
    const endY = H - 30;
    const usableH = endY - startY;
    const matchW = colW - 10;
    const pad = 5;

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    function drawTeamSlot(x, y, w, h, team, isWinner, isLoser) {
      ctx.globalAlpha = isLoser ? 0.3 : 1;
      ctx.fillStyle = isWinner ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.04)";
      ctx.strokeStyle = isWinner ? "rgba(201,168,76,0.6)" : "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      roundRect(x, y, w, h, 3);
      ctx.fill(); ctx.stroke();
      ctx.globalAlpha = isLoser ? 0.3 : 1;
      ctx.fillStyle = isWinner ? "#c9a84c" : team ? "#fff" : "rgba(255,255,255,0.2)";
      ctx.font = `${isWinner ? "bold " : ""}9px Arial`;
      ctx.textAlign = "left";
      const label = team ? (team.length > 13 ? team.slice(0, 12) + "…" : team) : "TBD";
      ctx.fillText(label, x + 5, y + h - 4);
      ctx.globalAlpha = 1;
    }

    function drawMatch(x, y, w, totalH, match) {
      const slotH = (totalH - 4) / 2;
      const winner = winners[match.id];
      drawTeamSlot(x, y, w, slotH, match.home, winner === match.home, winner && winner !== match.home);
      drawTeamSlot(x, y + slotH + 4, w, slotH, match.away, winner === match.away, winner && winner !== match.away);
    }

    function drawConnector(x1, midY1, x2, midY2) {
      const mx = (x1 + x2) / 2;
      ctx.strokeStyle = "rgba(201,168,76,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, midY1);
      ctx.lineTo(mx, midY1);
      ctx.lineTo(mx, midY2);
      ctx.lineTo(x2, midY2);
      ctx.stroke();
    }

    // LEFT SIDE: cols 0-3 = R32, R16, QF, SF
    const leftRounds = [
      { key: "r32", slice: [0, 8] },
      { key: "r16", slice: [0, 4] },
      { key: "qf", slice: [0, 2] },
      { key: "sf", slice: [0, 1] },
    ];

    leftRounds.forEach(({ key, slice }, ri) => {
      const matches = bracket[key].slice(...slice);
      const count = matches.length;
      const slotH = usableH / count;
      const matchH = slotH * 0.55;
      const col = ri;
      matches.forEach((match, mi) => {
        const x = col * colW + pad;
        const y = startY + mi * slotH + (slotH - matchH) / 2;
        drawMatch(x, y, matchW, matchH, match);
        // Draw connector to next round
        if (ri < 3) {
          const nextCount = count / 2;
          const nextSlotH = usableH / nextCount;
          const nextMi = Math.floor(mi / 2);
          const nextMatchH = nextSlotH * 0.55;
          const nextY = startY + nextMi * nextSlotH + (nextSlotH - nextMatchH) / 2;
          const midY1 = y + matchH / 2;
          const midY2 = nextY + nextMatchH / 2;
          drawConnector(x + matchW, midY1, (col + 1) * colW + pad, midY2);
        }
      });
    });

    // RIGHT SIDE: cols 8-5 = R32, R16, QF, SF
    const rightRounds = [
      { key: "r32", slice: [8, 16] },
      { key: "r16", slice: [4, 8] },
      { key: "qf", slice: [2, 4] },
      { key: "sf", slice: [1, 2] },
    ];

    rightRounds.forEach(({ key, slice }, ri) => {
      const matches = bracket[key].slice(...slice);
      const count = matches.length;
      const slotH = usableH / count;
      const matchH = slotH * 0.55;
      const col = 8 - ri;
      matches.forEach((match, mi) => {
        const x = col * colW + pad;
        const y = startY + mi * slotH + (slotH - matchH) / 2;
        drawMatch(x, y, matchW, matchH, match);
        if (ri < 3) {
          const nextCount = count / 2;
          const nextSlotH = usableH / nextCount;
          const nextMi = Math.floor(mi / 2);
          const nextMatchH = nextSlotH * 0.55;
          const nextY = startY + nextMi * nextSlotH + (nextSlotH - nextMatchH) / 2;
          const midY1 = y + matchH / 2;
          const midY2 = nextY + nextMatchH / 2;
          const nextCol = 8 - ri - 1;
          drawConnector(x, midY1, nextCol * colW + matchW + pad, midY2);
        }
      });
    });

    // FINAL - center col 4
    const finalX = 4 * colW + pad;
    const finalMatchH = 60;
    const finalY = startY + usableH / 2 - finalMatchH / 2;
    drawMatch(finalX, finalY, matchW, finalMatchH, bracket.final[0]);

    // Connect left SF to final
    const leftSFMatch = bracket.sf[0];
    const leftSFSlotH = usableH;
    const leftSFMatchH = leftSFSlotH * 0.55;
    const leftSFY = startY + (leftSFSlotH - leftSFMatchH) / 2;
    drawConnector(3 * colW + matchW + pad, leftSFY + leftSFMatchH / 2, finalX, finalY + finalMatchH / 2);

    // Connect right SF to final
    const rightSFSlotH = usableH;
    const rightSFMatchH = rightSFSlotH * 0.55;
    const rightSFY = startY + (rightSFSlotH - rightSFMatchH) / 2;
    drawConnector(5 * colW + pad, rightSFY + rightSFMatchH / 2, finalX + matchW, finalY + finalMatchH / 2);

    // Champion text
    if (champion) {
      ctx.fillStyle = "#c9a84c";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.fillText("🏆  " + champion + "  🏆", W / 2, finalY + finalMatchH + 26);
    }

  }, [bracket, winners, champion]);

  function download() {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "my-worldcup-2026-bracket.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: "95vw" }}>
        <canvas ref={canvasRef} style={{ borderRadius: 12, border: "1px solid rgba(201,168,76,0.3)", maxWidth: "100%", height: "auto", display: "block" }} />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={download}
            style={{ flex: 1, background: "#c9a84c", border: "none", color: "#0d0d1a", fontFamily: "inherit", fontSize: 14, fontWeight: 700, padding: "13px", borderRadius: 10, cursor: "pointer" }}>
            ⬇️ Download Image
          </button>
          <button onClick={onClose}
            style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "inherit", fontSize: 14, fontWeight: 600, padding: "13px", borderRadius: 10, cursor: "pointer" }}>
            Close
          </button>
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

        {/* Bracket tree */}
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

      {/* Share bracket modal */}
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
