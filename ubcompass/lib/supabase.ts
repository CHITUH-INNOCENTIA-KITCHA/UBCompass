import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase Configuration Missing:', {
    url: supabaseUrl ? '✓' : '✗ EXPO_PUBLIC_SUPABASE_URL',
    key: supabaseAnonKey ? '✓' : '✗ EXPO_PUBLIC_SUPABASE_ANON_KEY',
  });
  throw new Error(
    'Missing Supabase URL or Anon Key in environment variables. Check .env.local in ubcompass directory.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
