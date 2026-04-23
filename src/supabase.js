import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bdtclpwwwqcfwytwnavh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdGNscHd3d3FjZnd5dHduYXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjI2NTgsImV4cCI6MjA5MjUzODY1OH0.6girL2yieFaxU6s2Ck_yL1mpFeQMIQ51kL9vXkRXE4c";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
