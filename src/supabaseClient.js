import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xdqqrqpqhiyagologhfg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkcXFycXBxaGl5YWdvbG9naGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE3ODc3MzQsImV4cCI6MjAzNzM2MzczNH0.XTQgJY7yAKsgONhhWqKCREEN6XGpoSye5G1WXR7uDj0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
