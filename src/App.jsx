import Leagues from "./Leagues.jsx";
import { useState, useEffect } from "react";
import Homepage from "./Homepage.jsx";
import Simulator from "./Simulator.jsx";
import Bracket from "./Bracket.jsx";
import WorldCup from "./WorldCup.jsx";
import Auth from "./Auth.jsx";
import Profile from "./Profile.jsx";
import { supabase } from "./supabase.js";

export default function App() {
  const [qualifiers, setQualifiers] = useState({});
  const [thirdPlaces, setThirdPlaces] = useState({});
  const [bracketWinners, setBracketWinners] = useState({});
  const [showLeagues, setShowLeagues] = useState(false);
  const [bracketRounds, setBracketRounds] = useState(null);
  const [user, setUser] = useState(null);

  const hash = window.location.hash.replace("#", "") || "home";
  const [page, setPage] = useState(hash);

  function navigate(p) {
    setPage(p);
    window.location.hash = p;
  }

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace("#", "") || "home";
      setPage(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (page === "auth") return <Auth onBack={() => navigate("home")} onSuccess={() => navigate("home")} />;
  if (page === "simulator") return (
    <Simulator
      onBack={() => navigate("home")}
      onQualify={setQualifiers}
      onThirdPlace={setThirdPlaces}
      onGoBracket={() => navigate("bracket")}
    />
  );
  if (page === "leagues") return (
  <Leagues
    onBack={() => navigate("home")}
    user={user}
  />
);
  if (page === "bracket") return (
  <Bracket
    onBack={() => navigate("home")}
    bracketWinners={bracketWinners}
    onWinnersChange={setBracketWinners}
  />
);
  if (page === "worldcup") return <WorldCup onBack={() => navigate("home")} onNavigate={navigate} />;
  if (page === "profile") {
  if (!user) { navigate("home"); return null; }
  return <Profile onBack={() => navigate("home")} onNavigate={navigate} user={user} onLogout={() => { supabase.auth.signOut(); navigate("home"); }} />;
}
  return <Homepage onNavigate={navigate} user={user} onLogout={() => { supabase.auth.signOut(); navigate("home"); }} />;
}
