
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL is not defined. Please check your .env file.');
  throw new Error('Supabase URL is not defined. Ensure NEXT_PUBLIC_SUPABASE_URL is set in your environment variables.');
}
if (!supabaseAnonKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined. Please check your .env file.');
  throw new Error('Supabase Anon Key is not defined. Ensure NEXT_PUBLIC_SUPABASE_ANON_KEY is set in your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
