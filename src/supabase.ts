// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vyypqsdhuuemmuelbxqg.supabase.co'; // Replace with your Project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5eXBxc2RodXVlbW11ZWxieHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcxNjM0MjcsImV4cCI6MjA0MjczOTQyN30.8cxerTKGUYLh1n3QncD2R5pFXC3npptGBoMOS7MUB8U'; // Replace with your anon public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);