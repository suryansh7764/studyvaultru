import { createClient } from '@supabase/supabase-js';

// Credentials provided by user
const supabaseUrl = 'https://nxaterttiubxthvzwjwx.supabase.co';
const supabaseKey = 'sb_publishable_tJ03vjLNbP1re1fTFGE-6g_MyI0JjOq';

export const supabase = createClient(supabaseUrl, supabaseKey);
