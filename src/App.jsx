import { useState, useEffect } from "react";
import Homepage from "./Homepage.jsx";
import Simulator from "./Simulator.jsx";
import Bracket from "./Bracket.jsx";
import WorldCup from "./WorldCup.jsx";
import Auth from "./Auth.jsx";
import { supabase } from "./supabase.js";

export default function App() {
  const [page, setPage] = useState("home");
  const [qualifiers, setQualifiers] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (page === "auth") return <Auth onBack={() => setPage("home")} onSuccess={() => setPage("home")} />;
  if (page === "simulator") return <Simulator onBack={() => setPage("home")} onQualify={setQualifiers} />;
  if (page === "bracket") return <Bracket onBack={() => setPage("home")} qualifiers={qualifiers} />;
  if (page === "worldcup") return <WorldCup onBack={() => setPage("home")} onNavigate={setPage} />;
  return <Homepage onNavigate={setPage} user={user} onLogout={() => supabase.auth.signOut()} />;
}
