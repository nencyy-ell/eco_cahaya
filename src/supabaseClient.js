import { createClient } from '@supabase/supabase-js';

// Ambil Project URL dan Anon Key dari Project Settings -> API di dashboard Supabase milikmu
const supabaseUrl = 'https://gddiajhvpdvuqiljcasv.supabase.co';
const supabaseAnonKey = 'sb_publishable_-TN3qHMF8WNr1nk5pxS8HQ_owPmkcsy';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);