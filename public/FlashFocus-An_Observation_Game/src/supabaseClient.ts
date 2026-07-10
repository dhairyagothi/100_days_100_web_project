import { createClient } from '@supabase/supabase-js';

// Grab these keys from your Supabase Dashboard Settings -> API page
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_PROJECT_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// 🔍 TEMPORARY DEBUG LOGS
console.log('--- SUPABASE ENV CHECK ---');
console.log('Raw URL Value:', supabaseUrl);
console.log('Type of URL:', typeof supabaseUrl);
console.log('--------------------------');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase keys are missing from import.meta.env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);