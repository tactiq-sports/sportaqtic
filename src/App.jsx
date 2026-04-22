import { useState } from "react";
import Homepage from "./Homepage.jsx";
import Simulator from "./Simulator.jsx";
import Bracket from "./Bracket.jsx";
import WorldCup from "./WorldCup.jsx";

export default function App() {
  const [page, setPage] = useState("home");
  const [qualifiers, setQualifiers] = useState({});

  if (page === "simulator") return <Simulator onBack={() => setPage("home")} onQualify={setQualifiers} />;
  if (page === "bracket") return <Bracket onBack={() => setPage("home")} qualifiers={qualifiers} />;
  if (page === "worldcup") return <WorldCup onBack={() => setPage("home")} onNavigate={setPage} />;
  return <Homepage onNavigate={setPage} />;
}
