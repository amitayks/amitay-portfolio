import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://qjyybkgqqadjedgelakf.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqeXlia2dxcWFkamVkZ2VsYWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MTE0NDUsImV4cCI6MjA1NzE4NzQ0NX0.c5nEfh7VNoA6w8bYYoBmoYgAtO721_4h1tQgrNWNFEY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
