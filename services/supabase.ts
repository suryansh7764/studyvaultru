import { createClient } from '@supabase/supabase-js';

// Netlify will provide these via environment variables during the build/runtime
const supabaseUrl = process.env.SUPABASE_URL || 'https://nxaterttiubxthvzwjwx.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_tJ03vjLNbP1re1fTFGE-6g_MyI0JjOq';

export const supabase = createClient(supabaseUrl, supabaseKey);