import { useState, useEffect, useRef } from "react";

const LAUNCH_DATE = new Date("2026-06-11T15:00:00Z");

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
"Italy": "it", "Czechoslovakia": "cz", "Hungary": "hu", "Sweden": "se",
};

const GROUPS = {
  A: { teams: ["Mexico", "South Africa", "South Korea", "Czechia"], matches: [
    { home: "Mexico", away: "South Africa", date: "Jun 11", venue: "Estadio Azteca" },
    { home: "South Korea", away: "Czechia", date: "Jun 12", venue: "SoFi Stadium" },
    { home: "Mexico", away: "Czechia", date: "Jun 16", venue: "Rose Bowl" },
    { home: "South Africa", away: "South Korea", date: "Jun 16", venue: "AT&T Stadium" },
    { home: "Mexico", away: "South Korea", date: "Jun 20", venue: "Estadio Azteca" },
    { home: "Czechia", away: "South Africa", date: "Jun 20", venue: "SoFi Stadium" },
  ]},
  B: { teams: ["Canada", "Bosnia and Herzegovina", "Qatar", "Switzerland"], matches: [
    { home: "Canada", away: "Switzerland", date: "Jun 12", venue: "BC Place" },
    { home: "Bosnia and Herzegovina", away: "Qatar", date: "Jun 12", venue: "Arrowhead Stadium" },
    { home: "Canada", away: "Qatar", date: "Jun 16", venue: "BC Place" },
    { home: "Switzerland", away: "Bosnia and Herzegovina", date: "Jun 17", venue: "MetLife Stadium" },
    { home: "Canada", away: "Bosnia and Herzegovina", date: "Jun 21", venue: "BC Place" },
    { home: "Qatar", away: "Switzerland", date: "Jun 21", venue: "Arrowhead Stadium" },
  ]},
  C: { teams: ["Brazil", "Morocco", "Haiti", "Scotland"], matches: [
    { home: "Brazil", away: "Scotland", date: "Jun 13", venue: "MetLife Stadium" },
    { home: "Morocco", away: "Haiti", date: "Jun 13", venue: "Hard Rock Stadium" },
    { home: "Brazil", away: "Haiti", date: "Jun 17", venue: "SoFi Stadium" },
    { home: "Scotland", away: "Morocco", date: "Jun 17", venue: "AT&T Stadium" },
    { home: "Brazil", away: "Morocco", date: "Jun 21", venue: "Rose Bowl" },
    { home: "Haiti", away: "Scotland", date: "Jun 21", venue: "Hard Rock Stadium" },
  ]},
  D: { teams: ["USA", "Paraguay", "Australia", "Türkiye"], matches: [
    { home: "USA", away: "Türkiye", date: "Jun 13", venue: "SoFi Stadium" },
    { home: "Paraguay", away: "Australia", date: "Jun 14", venue: "Arrowhead Stadium" },
    { home: "USA", away: "Australia", date: "Jun 18", venue: "Rose Bowl" },
    { home: "Türkiye", away: "Paraguay", date: "Jun 18", venue: "AT&T Stadium" },
    { home: "USA", away: "Paraguay", date: "Jun 22", venue: "MetLife Stadium" },
    { home: "Australia", away: "Türkiye", date: "Jun 22", venue: "SoFi Stadium" },
  ]},
  E: { teams: ["Germany", "Curaçao", "Ivory Coast", "Ecuador"], matches: [
    { home: "Germany", away: "Ecuador", date: "Jun 14", venue: "MetLife Stadium" },
    { home: "Ivory Coast", away: "Curaçao", date: "Jun 14", venue: "BC Place" },
    { home: "Germany", away: "Curaçao", date: "Jun 18", venue: "AT&T Stadium" },
    { home: "Ecuador", away: "Ivory Coast", date: "Jun 19", venue: "Hard Rock Stadium" },
    { home: "Germany", away: "Ivory Coast", date: "Jun 23", venue: "MetLife Stadium" },
    { home: "Curaçao", away: "Ecuador", date: "Jun 23", venue: "BC Place" },
  ]},
  F: { teams: ["Netherlands", "Japan", "Sweden", "Tunisia"], matches: [
    { home: "Netherlands", away: "Sweden", date: "Jun 15", venue: "AT&T Stadium" },
    { home: "Japan", away: "Tunisia", date: "Jun 15", venue: "Arrowhead Stadium" },
    { home: "Netherlands", away: "Tunisia", date: "Jun 19", venue: "SoFi Stadium" },
    { home: "Sweden", away: "Japan", date: "Jun 19", venue: "Rose Bowl" },
    { home: "Netherlands", away: "Japan", date: "Jun 23", venue: "AT&T Stadium" },
    { home: "Tunisia", away: "Sweden", date: "Jun 23", venue: "Arrowhead Stadium" },
  ]},
  G: { teams: ["Belgium", "Egypt", "Iran", "New Zealand"], matches: [
    { home: "Belgium", away: "New Zealand", date: "Jun 15", venue: "Hard Rock Stadium" },
    { home: "Egypt", away: "Iran", date: "Jun 15", venue: "BC Place" },
    { home: "Belgium", away: "Iran", date: "Jun 19", venue: "MetLife Stadium" },
    { home: "New Zealand", away: "Egypt", date: "Jun 20", venue: "Arrowhead Stadium" },
    { home: "Belgium", away: "Egypt", date: "Jun 24", venue: "Hard Rock Stadium" },
    { home: "Iran", away: "New Zealand", date: "Jun 24", venue: "BC Place" },
  ]},
  H: { teams: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"], matches: [
    { home: "Spain", away: "Uruguay", date: "Jun 16", venue: "Rose Bowl" },
    { home: "Cape Verde", away: "Saudi Arabia", date: "Jun 16", venue: "Hard Rock Stadium" },
    { home: "Spain", away: "Saudi Arabia", date: "Jun 20", venue: "AT&T Stadium" },
    { home: "Uruguay", away: "Cape Verde", date: "Jun 20", venue: "MetLife Stadium" },
    { home: "Spain", away: "Cape Verde", date: "Jun 24", venue: "SoFi Stadium" },
    { home: "Saudi Arabia", away: "Uruguay", date: "Jun 24", venue: "Rose Bowl" },
  ]},
  I: { teams: ["France", "Senegal", "Iraq", "Norway"], matches: [
    { home: "France", away: "Norway", date: "Jun 17", venue: "MetLife Stadium" },
    { home: "Senegal", away: "Iraq", date: "Jun 17", venue: "SoFi Stadium" },
    { home: "France", away: "Iraq", date: "Jun 21", venue: "AT&T Stadium" },
    { home: "Norway", away: "Senegal", date: "Jun 21", venue: "BC Place" },
    { home: "France", away: "Senegal", date: "Jun 25", venue: "Rose Bowl" },
    { home: "Iraq", away: "Norway", date: "Jun 25", venue: "Hard Rock Stadium" },
  ]},
  J: { teams: ["Argentina", "Algeria", "Austria", "Jordan"], matches: [
    { home: "Argentina", away: "Jordan", date: "Jun 17", venue: "Hard Rock Stadium" },
    { home: "Algeria", away: "Austria", date: "Jun 18", venue: "Rose Bowl" },
    { home: "Argentina", away: "Austria", date: "Jun 22", venue: "MetLife Stadium" },
    { home: "Jordan", away: "Algeria", date: "Jun 22", venue: "SoFi Stadium" },
    { home: "Argentina", away: "Algeria", date: "Jun 26", venue: "Hard Rock Stadium" },
    { home: "Austria", away: "Jordan", date: "Jun 26", venue: "AT&T Stadium" },
  ]},
  K: { teams: ["Portugal", "DR Congo", "Uzbekistan", "Colombia"], matches: [
    { home: "Portugal", away: "Colombia", date: "Jun 18", venue: "Arrowhead Stadium" },
    { home: "DR Congo", away: "Uzbekistan", date: "Jun 18", venue: "BC Place" },
    { home: "Portugal", away: "Uzbekistan", date: "Jun 22", venue: "Hard Rock Stadium" },
    { home: "Colombia", away: "DR Congo", date: "Jun 23", venue: "Rose Bowl" },
    { home: "Portugal", away: "DR Congo", date: "Jun 27", venue: "MetLife Stadium" },
    { home: "Uzbekistan", away: "Colombia", date: "Jun 27", venue: "Arrowhead Stadium" },
  ]},
  L: { teams: ["England", "Croatia", "Ghana", "Panama"], matches: [
    { home: "England", away: "Panama", date: "Jun 19", venue: "AT&T Stadium" },
    { home: "Croatia", away: "Ghana", date: "Jun 19", venue: "MetLife Stadium" },
    { home: "England", away: "Ghana", date: "Jun 23", venue: "SoFi Stadium" },
    { home: "Panama", away: "Croatia", date: "Jun 24", venue: "BC Place" },
    { home: "England", away: "Croatia", date: "Jun 28", venue: "Rose Bowl" },
    { home: "Ghana", away: "Panama", date: "Jun 28", venue: "Hard Rock Stadium" },
  ]},
};

const VENUES = [
  { name: "MetLife Stadium", city: "East Rutherford, NJ", country: "USA", capacity: "82,500", matches: 8, final: true, flag: "🏆", img: "🏟️" },
  { name: "SoFi Stadium", city: "Inglewood, CA", country: "USA", capacity: "70,240", matches: 7, final: false, flag: "🌟", img: "🏟️" },
  { name: "AT&T Stadium", city: "Arlington, TX", country: "USA", capacity: "80,000", matches: 7, final: false, flag: "⭐", img: "🏟️" },
  { name: "Hard Rock Stadium", city: "Miami Gardens, FL", country: "USA", capacity: "65,326", matches: 6, final: false, flag: "🌴", img: "🏟️" },
  { name: "Rose Bowl", city: "Pasadena, CA", country: "USA", capacity: "88,565", matches: 6, final: false, flag: "🌹", img: "🏟️" },
  { name: "Arrowhead Stadium", city: "Kansas City, MO", country: "USA", capacity: "76,416", matches: 6, final: false, flag: "🏹", img: "🏟️" },
  { name: "Levi's Stadium", city: "Santa Clara, CA", country: "USA", capacity: "68,500", matches: 6, final: false, flag: "💙", img: "🏟️" },
  { name: "Lincoln Financial Field", city: "Philadelphia, PA", country: "USA", capacity: "69,796", matches: 6, final: false, flag: "🦅", img: "🏟️" },
  { name: "Gillette Stadium", city: "Foxborough, MA", country: "USA", capacity: "65,878", matches: 5, final: false, flag: "🎖️", img: "🏟️" },
  { name: "Seattle Lumen Field", city: "Seattle, WA", country: "USA", capacity: "72,000", matches: 5, final: false, flag: "🌧️", img: "🏟️" },
  { name: "Empower Field", city: "Denver, CO", country: "USA", capacity: "76,125", matches: 5, final: false, flag: "🏔️", img: "🏟️" },
  { name: "BC Place", city: "Vancouver, BC", country: "Canada", capacity: "54,500", matches: 6, final: false, flag: "🍁", img: "🏟️" },
  { name: "BMO Field", city: "Toronto, ON", country: "Canada", capacity: "30,000", matches: 5, final: false, flag: "🍁", img: "🏟️" },
  { name: "Estadio Azteca", city: "Mexico City", country: "Mexico", capacity: "87,523", matches: 5, final: false, flag: "🌵", img: "🏟️" },
  { name: "Estadio BBVA", city: "Monterrey", country: "Mexico", capacity: "51,348", matches: 5, final: false, flag: "⛰️", img: "🏟️" },
  { name: "Estadio Akron", city: "Guadalajara", country: "Mexico", capacity: "49,850", matches: 5, final: false, flag: "🌺", img: "🏟️" },
];

const TEAM_PROFILES = {
  "Brazil": { coach: "Dorival Júnior", ranking: 3, style: "Attacking", players: ["Vinicius Jr", "Rodrygo", "Endrick", "Raphinha", "Alisson", "Marquinhos"], wc_wins: 5, last_won: 2002 },
  "France": { coach: "Didier Deschamps", ranking: 2, style: "Balanced", players: ["Kylian Mbappé", "Antoine Griezmann", "Aurélien Tchouaméni", "Mike Maignan", "William Saliba", "Ousmane Dembélé"], wc_wins: 2, last_won: 2018 },
  "Argentina": { coach: "Lionel Scaloni", ranking: 1, style: "Tactical", players: ["Lionel Messi", "Julián Álvarez", "Rodrigo De Paul", "Emi Martínez", "Lisandro Martínez", "Alexis Mac Allister"], wc_wins: 3, last_won: 2022 },
  "England": { coach: "Thomas Tuchel", ranking: 5, style: "Pressing", players: ["Jude Bellingham", "Harry Kane", "Phil Foden", "Bukayo Saka", "Jordan Pickford", "Declan Rice"], wc_wins: 1, last_won: 1966 },
  "Spain": { coach: "Luis de la Fuente", ranking: 4, style: "Possession", players: ["Pedri", "Lamine Yamal", "Álvaro Morata", "Unai Simón", "Dani Carvajal", "Rodri"], wc_wins: 1, last_won: 2010 },
  "Germany": { coach: "Julian Nagelsmann", ranking: 6, style: "Gegenpressing", players: ["Florian Wirtz", "Jamal Musiala", "Kai Havertz", "Manuel Neuer", "Antonio Rüdiger", "Leroy Sané"], wc_wins: 4, last_won: 2014 },
  "Portugal": { coach: "Roberto Martínez", ranking: 7, style: "Counter-attack", players: ["Cristiano Ronaldo", "Bruno Fernandes", "Rafael Leão", "Rúben Dias", "Bernardo Silva", "Diogo Costa"], wc_wins: 0, last_won: null },
  "Netherlands": { coach: "Ronald Koeman", ranking: 8, style: "Total Football", players: ["Virgil van Dijk", "Memphis Depay", "Cody Gakpo", "Frenkie de Jong", "Xavi Simons", "Bart Verbruggen"], wc_wins: 0, last_won: null },
  "USA": { coach: "Mauricio Pochettino", ranking: 11, style: "Athletic", players: ["Christian Pulisic", "Gio Reyna", "Tyler Adams", "Matt Turner", "Weston McKennie", "Ricardo Pepi"], wc_wins: 0, last_won: null },
  "Mexico": { coach: "Javier Aguirre", ranking: 14, style: "Defensive", players: ["Hirving Lozano", "Raúl Jiménez", "Edson Álvarez", "Guillermo Ochoa", "Santiago Giménez", "César Montes"], wc_wins: 0, last_won: null },
  "Canada": { coach: "Jesse Marsch", ranking: 12, style: "High Press", players: ["Alphonso Davies", "Jonathan David", "Tajon Buchanan", "Milan Borjan", "Stephen Eustáquio", "Cyle Larin"], wc_wins: 0, last_won: null },
  "Morocco": { coach: "Walid Regragui", ranking: 13, style: "Defensive", players: ["Achraf Hakimi", "Hakim Ziyech", "Youssef En-Nesyri", "Bono", "Sofyan Amrabat", "Azzedine Ounahi"], wc_wins: 0, last_won: null },
  "Japan": { coach: "Hajime Moriyasu", ranking: 18, style: "Pressing", players: ["Takefusa Kubo", "Ritsu Doan", "Daichi Kamada", "Shuichi Gonda", "Maya Yoshida", "Wataru Endo"], wc_wins: 0, last_won: null },
  "Senegal": { coach: "Aliou Cissé", ranking: 20, style: "Physical", players: ["Sadio Mané", "Kalidou Koulibaly", "Ismaïla Sarr", "Édouard Mendy", "Idrissa Gueye", "Pape Matar Sarr"], wc_wins: 0, last_won: null },
  "Croatia": { coach: "Zlatko Dalić", ranking: 10, style: "Midfield", players: ["Luka Modrić", "Ivan Perišić", "Mateo Kovačić", "Dominik Livaković", "Joško Gvardiol", "Marcelo Brozović"], wc_wins: 0, last_won: null },
  "Belgium": { coach: "Domenico Tedesco", ranking: 9, style: "Technical", players: ["Kevin De Bruyne", "Romelu Lukaku", "Thibaut Courtois", "Axel Witsel", "Yannick Carrasco", "Jeremy Doku"], wc_wins: 0, last_won: null },
  "Switzerland": { coach: "Murat Yakin", ranking: 15, style: "Organized", players: ["Granit Xhaka", "Xherdan Shaqiri", "Breel Embolo", "Yann Sommer", "Manuel Akanji", "Remo Freuler"], wc_wins: 0, last_won: null },
  "Colombia": { coach: "Néstor Lorenzo", ranking: 16, style: "Physical", players: ["James Rodríguez", "Luis Díaz", "Falcao", "David Ospina", "Davinson Sánchez", "Juan Cuadrado"], wc_wins: 0, last_won: null },
  "Uruguay": { coach: "Marcelo Bielsa", ranking: 17, style: "Physical", players: ["Federico Valverde", "Darwin Núñez", "Rodrigo Bentancur", "Sergio Rochet", "José María Giménez", "Ronald Araújo"], wc_wins: 2, last_won: 1950 },
  "Australia": { coach: "Tony Popovic", ranking: 22, style: "Pressing", players: ["Mathew Leckie", "Mitchell Duke", "Aaron Mooy", "Mat Ryan", "Harry Souttar", "Riley McGree"], wc_wins: 0, last_won: null },
};

const WC_HISTORY = [
  { year: 2022, winner: "Argentina", runner_up: "France", score: "3-3 (4-2 pens)", host: "Qatar", goals: 172 },
  { year: 2018, winner: "France", runner_up: "Croatia", score: "4-2", host: "Russia", goals: 169 },
  { year: 2014, winner: "Germany", runner_up: "Argentina", score: "1-0 (aet)", host: "Brazil", goals: 171 },
  { year: 2010, winner: "Spain", runner_up: "Netherlands", score: "1-0 (aet)", host: "South Africa", goals: 145 },
  { year: 2006, winner: "Italy", runner_up: "France", score: "1-1 (5-3 pens)", host: "Germany", goals: 147 },
  { year: 2002, winner: "Brazil", runner_up: "Germany", score: "2-0", host: "Japan/South Korea", goals: 161 },
  { year: 1998, winner: "France", runner_up: "Brazil", score: "3-0", host: "France", goals: 171 },
  { year: 1994, winner: "Brazil", runner_up: "Italy", score: "0-0 (3-2 pens)", host: "USA", goals: 141 },
  { year: 1990, winner: "Germany", runner_up: "Argentina", score: "1-0", host: "Italy", goals: 115 },
  { year: 1986, winner: "Argentina", runner_up: "Germany", score: "3-2", host: "Mexico", goals: 132 },
  { year: 1982, winner: "Italy", runner_up: "Germany", score: "3-1", host: "Spain", goals: 146 },
  { year: 1978, winner: "Argentina", runner_up: "Netherlands", score: "3-1 (aet)", host: "Argentina", goals: 102 },
  { year: 1974, winner: "Germany", runner_up: "Netherlands", score: "2-1", host: "Germany", goals: 97 },
  { year: 1970, winner: "Brazil", runner_up: "Italy", score: "4-1", host: "Mexico", goals: 95 },
  { year: 1966, winner: "England", runner_up: "Germany", score: "4-2 (aet)", host: "England", goals: 89 },
  { year: 1962, winner: "Brazil", runner_up: "Czechoslovakia", score: "3-1", host: "Chile", goals: 89 },
  { year: 1958, winner: "Brazil", runner_up: "Sweden", score: "5-2", host: "Sweden", goals: 126 },
  { year: 1954, winner: "Germany", runner_up: "Hungary", score: "3-2", host: "Switzerland", goals: 140 },
  { year: 1950, winner: "Uruguay", runner_up: "Brazil", score: "2-1", host: "Brazil", goals: 88 },
  { year: 1938, winner: "Italy", runner_up: "Hungary", score: "4-2", host: "France", goals: 84 },
  { year: 1934, winner: "Italy", runner_up: "Czechoslovakia", score: "2-1 (aet)", host: "Italy", goals: 70 },
  { year: 1930, winner: "Uruguay", runner_up: "Argentina", score: "4-2", host: "Uruguay", goals: 70 },
];

const FACTS = [
  { icon: "🌍", title: "First ever tri-nation World Cup", desc: "USA, Canada and Mexico become the first three countries to co-host a World Cup together." },
  { icon: "📈", title: "48 teams for the first time", desc: "The tournament expands from 32 to 48 teams — 16 more nations get their shot at glory." },
  { icon: "⚽", title: "104 matches total", desc: "Up from 64 in previous tournaments — nearly double the amount of football." },
  { icon: "🏟️", title: "16 venues across 3 countries", desc: "11 in the USA, 3 in Mexico and 2 in Canada will host matches across 39 days." },
  { icon: "🏆", title: "Argentina are defending champions", desc: "Messi led Argentina to glory in Qatar 2022. Can they defend on a bigger stage?" },
  { icon: "📅", title: "Final on July 19 at MetLife Stadium", desc: "The biggest game in football will be in East Rutherford, New Jersey." },
  { icon: "🆕", title: "4 World Cup debutants", desc: "Cape Verde, Curaçao, Jordan and Uzbekistan appear in a World Cup for the first time." },
  { icon: "🔄", title: "New round of 32 knockout stage", desc: "For the first time since 1998, there's an extra knockout round — 32 teams advance." },
];

function Flag({ team, size = 16 }) {
  const code = FLAG_CODES[team];
  if (!code) return <span style={{ fontSize: size }}>🏳️</span>;
  return <img src={`https://flagcdn.com/32x24/${code}.png`} alt={team} style={{ width: Math.round(size * 1.5), height: size, borderRadius: 2, objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />;
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
  useEffect(() => { const t = setInterval(() => setTime(calc()), 1000); return () => clearInterval(t); }, []);
  return time;
}

export default function WorldCup({ onBack, onNavigate }) {
  const [tab, setTab] = useState("overview");
  const [selectedGroup, setSelectedGroup] = useState("A");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [pollVote, setPollVote] = useState(null);
  const [pollCounts, setPollCounts] = useState({ France: 280, Brazil: 310, Spain: 195, Argentina: 420, England: 160, Germany: 142, Portugal: 98, Other: 35 });
  const countdown = useCountdown();
  const gold = "#c9a84c";

  const totalVotes = Object.values(pollCounts).reduce((a, b) => a + b, 0);

  function vote(team) {
    if (pollVote) return;
    setPollVote(team);
    setPollCounts(prev => ({ ...prev, [team]: prev[team] + 1 }));
  }

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "schedule", label: "Schedule" },
    { id: "teams", label: "Teams" },
    { id: "venues", label: "Venues" },
    { id: "history", label: "History" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#080812", fontFamily: "'DM Sans',sans-serif", color: "#fff", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-15px) rotate(5deg)}}
      `}</style>

      {/* Background */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[{ top: "5%", left: "10%", w: 500, color: "rgba(201,168,76,0.05)" }, { top: "50%", left: "65%", w: 600, color: "rgba(59,130,246,0.04)" }].map((o, i) => (
          <div key={i} style={{ position: "absolute", top: o.top, left: o.left, width: o.w, height: o.w, borderRadius: "50%", background: `radial-gradient(circle,${o.color} 0%,transparent 70%)` }} />
        ))}
        {["30%", "70%", "15%", "85%", "50%"].map((l, i) => (
          <div key={i} style={{ position: "absolute", left: l, top: `${20 + i * 15}%`, fontSize: 40 + i * 10, opacity: 0.04, animation: `float ${8 + i * 2}s ${i * 1.5}s ease-in-out infinite` }}>⚽</div>
        ))}
      </div>

      {/* Navbar */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 16px", height: 58, display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 100, background: "rgba(8,8,18,0.92)", backdropFilter: "blur(16px)" }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)", fontFamily: "inherit", fontSize: 12, padding: "5px 10px", borderRadius: 7, cursor: "pointer", whiteSpace: "nowrap" }}>← Home</button>
        <div>
          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 18, letterSpacing: 3, color: gold, lineHeight: 1 }}>WORLD CUP 2026</div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: 2 }}>JUNE 11 — JULY 19</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 20, padding: "4px 12px" }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: gold, animation: "pulse 1.5s infinite" }} />
          <span style={{ fontSize: 11, color: gold, fontWeight: 700 }}>{countdown.days}D {String(countdown.hours).padStart(2,"0")}H {String(countdown.minutes).padStart(2,"0")}M</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 16px", background: "rgba(8,8,18,0.8)", position: "sticky", top: 58, zIndex: 99, overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 0, minWidth: "max-content" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSelectedTeam(null); }}
              style={{ padding: "12px 20px", background: "none", border: "none", borderBottom: `2px solid ${tab === t.id ? gold : "transparent"}`, color: tab === t.id ? gold : "rgba(255,255,255,0.4)", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 1 }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px", position: "relative", zIndex: 1 }}>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div>
            {/* Hero stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
              {[
                { icon: "🏆", label: "Edition", value: "23rd" },
                { icon: "🌍", label: "Hosts", value: "USA / CAN / MEX" },
                { icon: "⚽", label: "Teams", value: "48" },
                { icon: "🏟️", label: "Venues", value: "16" },
                { icon: "📅", label: "Matches", value: "104" },
                { icon: "🗓️", label: "Duration", value: "39 days" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 18, color: gold, letterSpacing: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Poll */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 9, color: gold, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>POLL</div>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 24, letterSpacing: 2, marginBottom: 16 }}>WHO WINS THE WORLD CUP?</div>
                {Object.entries(pollCounts).map(([team, count]) => {
                  const pct = Math.round((count / totalVotes) * 100);
                  const isVoted = pollVote === team;
                  return (
                    <div key={team} onClick={() => vote(team)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, marginBottom: 6, background: isVoted ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${isVoted ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.06)"}`, cursor: pollVote ? "default" : "pointer", transition: "all 0.15s", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pollVote ? pct : 0}%`, background: "rgba(201,168,76,0.06)", transition: "width 0.5s ease" }} />
                      <Flag team={team === "Other" ? null : team} size={14} />
                      <span style={{ fontSize: 13, fontWeight: 600, flex: 1, position: "relative" }}>{team}</span>
                      {pollVote && <span style={{ fontSize: 12, color: gold, fontWeight: 700, position: "relative" }}>{pct}%</span>}
                      {isVoted && <span style={{ fontSize: 10, color: gold, position: "relative" }}>✓</span>}
                    </div>
                  );
                })}
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 8 }}>{totalVotes.toLocaleString()} votes cast</div>
              </div>

              {/* Facts */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 9, color: gold, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>DID YOU KNOW?</div>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 24, letterSpacing: 2, marginBottom: 16 }}>WORLD CUP FACTS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {FACTS.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 12px" }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{f.title}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.4 }}>{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCHEDULE TAB */}
        {tab === "schedule" && (
          <div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
              {Object.keys(GROUPS).map(g => (
                <button key={g} onClick={() => setSelectedGroup(g)}
                  style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid", borderColor: selectedGroup === g ? gold : "rgba(255,255,255,0.12)", background: selectedGroup === g ? "rgba(201,168,76,0.14)" : "transparent", color: selectedGroup === g ? gold : "rgba(255,255,255,0.5)", fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  Group {g}
                </button>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
              <div style={{ marginBottom: 16 }}>
  <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 24, letterSpacing: 2, color: gold, marginBottom: 8 }}>GROUP {selectedGroup}</div>
  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
    {GROUPS[selectedGroup].teams.map(t => (
      <div key={t} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "3px 8px" }}>
        <Flag team={t} size={12} />
        <span style={{ fontSize: 11, fontWeight: 600 }}>{t}</span>
      </div>
    ))}
  </div>
</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {GROUPS[selectedGroup].matches.map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "12px 16px", flexWrap: "wrap" }}>
                    <div style={{ fontSize: 11, color: gold, fontWeight: 700, minWidth: 44 }}>MD{Math.floor(i / 2) + 1}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, justifyContent: "flex-end", minWidth: 100 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{m.home}</span>
                      <Flag team={m.home} size={14} />
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", flexShrink: 0 }}>VS</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 100 }}>
                      <Flag team={m.away} size={14} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{m.away}</span>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{m.date}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{m.venue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEAMS TAB */}
        {tab === "teams" && !selectedTeam && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 28, letterSpacing: 3, color: gold, marginBottom: 4 }}>TEAM PROFILES</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Click a team to see their squad and stats</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10 }}>
              {Object.entries(TEAM_PROFILES).map(([team, data]) => (
                <div key={team} onClick={() => setSelectedTeam(team)}
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; e.currentTarget.style.background = "rgba(201,168,76,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Flag team={team} size={18} />
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{team}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>Rank #{data.ranking}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>Coach: {data.coach}</div>
                  <div style={{ fontSize: 10, color: gold, fontWeight: 700 }}>{data.wc_wins > 0 ? `🏆 ${data.wc_wins}x Winner` : "Seeking first title"}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: "14px 18px", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 10, fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
              Showing {Object.keys(TEAM_PROFILES).length} of 48 teams — full profiles for all teams coming soon
            </div>
          </div>
        )}

        {/* TEAM DETAIL */}
        {tab === "teams" && selectedTeam && (
          <div>
            <button onClick={() => setSelectedTeam(null)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)", fontFamily: "inherit", fontSize: 12, padding: "5px 12px", borderRadius: 7, cursor: "pointer", marginBottom: 20 }}>← All Teams</button>
            {(() => {
              const data = TEAM_PROFILES[selectedTeam];
              return (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, padding: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16 }}>
                    <Flag team={selectedTeam} size={48} />
                    <div>
                      <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 36, letterSpacing: 3, color: "#fff", lineHeight: 1 }}>{selectedTeam}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Coach: {data.coach} · Style: {data.style}</div>
                      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                        <div style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: gold }}>Rank #{data.ranking}</div>
                        {data.wc_wins > 0 && <div style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: gold }}>🏆 {data.wc_wins}x World Champion</div>}
                        {data.last_won && <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Last won: {data.last_won}</div>}
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
                    <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 20, letterSpacing: 2, color: gold, marginBottom: 14 }}>KEY PLAYERS</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 10 }}>
                      {data.players.map((player, i) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: gold, flexShrink: 0 }}>{i + 1}</div>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{player}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button onClick={() => { onNavigate && onNavigate("simulator"); }}
                      style={{ background: gold, border: "none", color: "#080812", fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}>
                      ⚽ Simulate Their Group
                    </button>
                    <button onClick={() => { onNavigate && onNavigate("bracket"); }}
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "inherit", fontSize: 13, fontWeight: 600, padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}>
                      🏆 Pick Them in the Bracket
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* VENUES TAB */}
        {tab === "venues" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 28, letterSpacing: 3, color: gold, marginBottom: 4 }}>16 WORLD CUP VENUES</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Across the USA, Canada and Mexico</div>
            </div>

            {["USA", "Canada", "Mexico"].map(country => (
              <div key={country} style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <Flag team={country === "USA" ? "USA" : country === "Canada" ? "Canada" : "Mexico"} size={16} />
                  <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 20, letterSpacing: 2, color: "rgba(255,255,255,0.6)" }}>{country}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{VENUES.filter(v => v.country === country).length} venues</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 10 }}>
                  {VENUES.filter(v => v.country === country).map((venue, i) => (
                    <div key={i} style={{ background: venue.final ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.03)", border: `1px solid ${venue.final ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{venue.name}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{venue.city}</div>
                        </div>
                        {venue.final && <span style={{ fontSize: 9, background: "rgba(201,168,76,0.15)", color: gold, border: "1px solid rgba(201,168,76,0.3)", borderRadius: 20, padding: "2px 8px", fontWeight: 700, flexShrink: 0 }}>FINAL</span>}
                      </div>
                      <div style={{ display: "flex", gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: 1 }}>CAPACITY</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: gold }}>{venue.capacity}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: 1 }}>MATCHES</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{venue.matches}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* HISTORY TAB */}
        {tab === "history" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 28, letterSpacing: 3, color: gold, marginBottom: 4 }}>WORLD CUP HISTORY</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>All 22 tournaments — from Uruguay 1930 to Qatar 2022</div>
            </div>

            {/* Winners summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 24 }}>
              {[
                { country: "Brazil", wins: 5 },
                { country: "Germany", wins: 4 },
                { country: "Italy", wins: 4 },
                { country: "Argentina", wins: 3 },
                { country: "France", wins: 2 },
                { country: "Uruguay", wins: 2 },
                { country: "England", wins: 1 },
                { country: "Spain", wins: 1 },
              ].map((w, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                  <Flag team={w.country} size={16} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{w.country}</div>
                    <div style={{ fontSize: 13, color: gold, fontWeight: 700 }}>{"🏆".repeat(w.wins)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* All tournaments */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {WC_HISTORY.map((wc, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 16px", flexWrap: "wrap" }}>
                  <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 20, color: gold, minWidth: 48 }}>{wc.year}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", minWidth: 80 }}>{wc.host}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 120 }}>
                    <Flag team={wc.winner} size={14} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{wc.winner}</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>def.</span>
                    <Flag team={wc.runner_up} size={14} />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{wc.runner_up}</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: gold, minWidth: 70, textAlign: "right" }}>{wc.score}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", minWidth: 60, textAlign: "right" }}>{wc.goals} goals</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
