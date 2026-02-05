import { createClient } from '@supabase/supabase-js';

// Accessing shimmed process.env
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

// Fallback logic to prevent "Failed to construct 'URL'" if values are missing
let safeUrl = supabaseUrl;
if (!supabaseUrl || supabaseUrl.includes('YOUR_NEW_SUPABASE')) {
  safeUrl = 'https://sjptcgmjokirbgeuehhm.supabase.co'; // Force use your project URL as safety
}

let safeKey = supabaseKey;
if (!supabaseKey || supabaseKey.includes('YOUR_NEW_SUPABASE')) {
  safeKey = 'sb_publishable_92_Sk36mczhLc5rTKlT4jA_9alIJCMf'; // Force use your project Key as safety
}

export const supabase = createClient(safeUrl, safeKey);
