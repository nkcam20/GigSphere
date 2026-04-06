import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gemtybauqogpfwgfwqfc.supabase.co';
const supabaseAnonKey = 'sb_publishable_k07MH0eNBackC5MmGyzVZA_dn4KM97O';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
