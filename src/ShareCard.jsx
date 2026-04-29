import { useRef, useState, useEffect } from "react";

const FLAG_CODES = {
  "Mexico": "MX", "South Africa": "ZA", "South Korea": "KR", "Czechia": "CZ",
  "Canada": "CA", "Bosnia and Herzegovina": "BA", "Qatar": "QA", "Switzerland": "CH",
  "Brazil": "BR", "Morocco": "MA", "Haiti": "HT", "Scotland": "sco-custom",
  "USA": "US", "Paraguay": "PY", "Australia": "AU", "Türkiye": "TR",
  "Germany": "DE", "Curaçao": "CW", "Ivory Coast": "CI", "Ecuador": "EC",
  "Netherlands": "NL", "Japan": "JP", "Sweden": "SE", "Tunisia": "TN",
  "Belgium": "BE", "Egypt": "EG", "Iran": "IR", "New Zealand": "NZ",
  "Spain": "ES", "Cape Verde": "CV", "Saudi Arabia": "SA", "Uruguay": "UY",
  "France": "FR", "Senegal": "SN", "Iraq": "IQ", "Norway": "NO",
  "Argentina": "AR", "Algeria": "DZ", "Austria": "AT", "Jordan": "JO",
  "Portugal": "PT", "DR Congo": "CD", "Uzbekistan": "UZ", "Colombia": "CO",
  "England": "gb", "Croatia": "HR", "Ghana": "GH", "Panama": "PA",
};

async function toBase64(url) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function FlagImg({ team, size = 16, flagCache }) {
  const code = FLAG_CODES[team];
  if (!code) return null;
  const b64 = flagCache?.[code];
  if (!b64) return (
    <div style={{ width: Math.round(size * 1.5), height: size, borderRadius: 2, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />
  );
  return (
    <img
      src={b64}
      alt={team}
      style={{ width: Math.round(size * 1.5), height: size, borderRadius: 2, objectFit: "cover", flexShrink: 0 }}
    />
  );
}

export default function ShareCard({ qualifiers, champion, onClose }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [flagCache, setFlagCache] = useState({});
  const [flagsLoaded, setFlagsLoaded] = useState(false);
  const groupKeys = Object.keys(qualifiers || {});

  // Get all teams that appear in qualifiers + champion
  const teamsNeeded = new Set();
  groupKeys.forEach(g => {
    if (qualifiers[g]) {
      teamsNeeded.add(qualifiers[g].first);
      teamsNeeded.add(qualifiers[g].second);
    }
  });
  if (champion) teamsNeeded.add(champion);

  useEffect(() => {
    async function loadFlags() {
      const cache = {};
      await Promise.all([...teamsNeeded].map(async team => {
        const code = FLAG_CODES[team];
        if (!code) return;
        if (code === "sco-custom") {
  // Create Scotland flag using canvas
  const canvas = document.createElement("canvas");
  canvas.width = 32; canvas.height = 24;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#003399";
  ctx.fillRect(0, 0, 32, 24);
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(32, 24); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(32, 0); ctx.lineTo(0, 24); ctx.stroke();
  cache[code] = canvas.toDataURL();
  return;
}
const url = `https://flagcdn.com/32x24/${code.toLowerCase()}.png`;
        const b64 = await toBase64(url);
        if (b64) cache[code] = b64;
      }));
      setFlagCache(cache);
      setFlagsLoaded(true);
    }
    loadFlags();
  }, []);

  async function downloadImage() {
    if (!cardRef.current || !flagsLoaded) return;
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
      link.download = "my-worldcup-2026-predictions.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
    }
    setDownloading(false);
  }

  async function copyText() {
    const lines = ["🏆 My FIFA World Cup 2026 Predictions!\n"];
    groupKeys.forEach(g => {
      if (qualifiers[g]) {
        lines.push(`Group ${g}: ${qualifiers[g].first} | ${qualifiers[g].second}`);
      }
    });
    if (champion) lines.push(`\n🥇 My Champion: ${champion}`);
    lines.push("\nMake your predictions at getsportactiq.com");
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, maxWidth: 600, width: "100%", overflowY: "auto", maxHeight: "90vh" }}>

        {/* Card to be captured */}
        <div ref={cardRef} style={{ background: "#0d0d1a", borderRadius: 16, padding: 24, width: "100%", fontFamily: "'Bebas Neue', cursive", overflowX: "hidden" }}>
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700&display=swap');`}</style>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(201,168,76,0.3)" }}>
            <div>
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 28, letterSpacing: 3, color: "#c9a84c", lineHeight: 1 }}>WORLD CUP 2026</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginTop: 2 }}>MY PREDICTIONS</div>
            </div>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textAlign: "right" }}>GETSPORTACTIQ.COM</div>
          </div>

          {/* Groups grid */}
          {groupKeys.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, marginBottom: 16 }}>
              {groupKeys.map(g => {
                const q = qualifiers[g];
                return (
                  <div key={g} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px", border: "1px solid rgba(201,168,76,0.15)" }}>
                    <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 11, color: "#c9a84c", letterSpacing: 2, marginBottom: 6 }}>GROUP {g}</div>
                    {q ? (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                          <div style={{ width: 3, height: 10, borderRadius: 1, background: "#22c55e", flexShrink: 0 }} />
                          <FlagImg team={q.first} size={12} flagCache={flagCache} />
                          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.first}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <div style={{ width: 3, height: 10, borderRadius: 1, background: "#3b82f6", flexShrink: 0 }} />
                          <FlagImg team={q.second} size={12} flagCache={flagCache} />
                          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.second}</span>
                        </div>
                      </>
                    ) : (
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>Not set</div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "30px 0", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>
              No predictions yet — complete the simulator first!
            </div>
          )}

          {/* Champion */}
          {champion && (
            <div style={{ background: "linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.05))", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>🏆</span>
              <div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "rgba(201,168,76,0.6)", letterSpacing: 2, fontWeight: 700 }}>MY WORLD CUP CHAMPION</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <FlagImg team={champion} size={20} flagCache={flagCache} />
                  <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 24, color: "#c9a84c", letterSpacing: 2 }}>{champion}</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>Make your predictions at</div>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 14, color: "rgba(201,168,76,0.6)", letterSpacing: 2 }}>GETSPORTACTIQ.COM</div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, width: "100%" }}>
          <button onClick={downloadImage} disabled={downloading || !flagsLoaded}
            style={{ flex: 1, background: "#c9a84c", border: "none", color: "#0d0d1a", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, padding: "13px", borderRadius: 10, cursor: (downloading || !flagsLoaded) ? "not-allowed" : "pointer", opacity: (downloading || !flagsLoaded) ? 0.7 : 1 }}>
            {downloading ? "Generating..." : !flagsLoaded ? "Loading flags..." : "⬇️ Download Image"}
          </button>
          <button onClick={copyText}
            style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, padding: "13px", borderRadius: 10, cursor: "pointer" }}>
            {copied ? "✓ Copied!" : "📋 Copy Text"}
          </button>
          <button onClick={onClose}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans',sans-serif", fontSize: 14, padding: "13px 18px", borderRadius: 10, cursor: "pointer" }}>
            ✕
          </button>
        </div>

        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
          {flagsLoaded ? "Screenshot or download and share on social media!" : "Loading flag images..."}
        </div>
      </div>
    </div>
  );
}
