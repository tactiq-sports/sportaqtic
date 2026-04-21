import { useState } from "react";
import Homepage from "./Homepage.jsx";
import Simulator from "./Simulator.jsx";

export default function App() {
  const [page, setPage] = useState("home");

  if (page === "simulator") return <Simulator onBack={() => setPage("home")} />;
  return <Homepage onNavigate={setPage} />;
}
